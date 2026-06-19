"""
RealityLoops Custom GPU Server - T4 Compatible
================================================
This server loads Stable Fast 3D directly using float16 precision,
which is compatible with T4 GPUs (Turing architecture).

The original run.py uses bfloat16 which ONLY works on Ampere+ GPUs (A100, etc.).
T4 GPUs crash with: "RuntimeError: expected scalar type BFloat16 but found Float"

This script fixes that by:
1. Detecting GPU compute capability at startup
2. Using float16 for T4 (compute capability 7.5) instead of bfloat16
3. Loading the model once at startup (faster subsequent requests)
4. Proper memory management with gc.collect() + torch.cuda.empty_cache()
"""

import os
import gc

# Set PyTorch memory allocator config to prevent fragmentation
os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"

import shutil
import torch
import rembg
from contextlib import nullcontext
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps

from sf3d.system import SF3D
from sf3d.utils import get_device, remove_background, resize_foreground

app = FastAPI(title="RealityLoops Custom GPU Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Detect device and pick correct dtype ──────────────────────────
device = get_device()
if "cuda" in device:
    # T4 (compute capability 7.5 / Turing) does NOT support bfloat16.
    # Only Ampere+ (compute capability >= 8.0) supports it.
    capability = torch.cuda.get_device_capability()
    if capability[0] >= 8:
        autocast_dtype = torch.bfloat16
        print(f"✅ GPU supports bfloat16 (compute capability {capability[0]}.{capability[1]}), using bfloat16")
    else:
        autocast_dtype = torch.float16
        print(f"⚠️  GPU does NOT support bfloat16 (compute capability {capability[0]}.{capability[1]}), using float16 instead")
else:
    autocast_dtype = torch.float32
    print("⚠️  No CUDA device, using float32 (will be slow)")

# ── Load model once at startup ────────────────────────────────────
print("Loading Stable Fast 3D model...")
model = SF3D.from_pretrained(
    "stabilityai/stable-fast-3d",
    config_name="config.yaml",
    weight_name="model.safetensors",
)
model.to(device)
model.eval()
rembg_session = rembg.new_session()
print("✅ Model loaded and ready for inference!")


@app.post("/generate-3d")
async def generate_3d(file: UploadFile = File(...)):
    temp_dir = "temp_run"
    os.makedirs(temp_dir, exist_ok=True)

    # Save and resize uploaded image (max 512x512 to prevent CUDA OOM)
    image_path = os.path.join(temp_dir, "input.png")
    try:
        with Image.open(file.file) as img:
            img = ImageOps.exif_transpose(img)
            img.thumbnail((512, 512))
            img.save(image_path, "PNG")
    except Exception as e:
        print(f"Failed to process/resize image: {e}")
        file.file.seek(0)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    output_dir = os.path.join(temp_dir, "output")
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir, exist_ok=True)

    try:
        print("Running Stable Fast 3D inference (in-process, T4-safe dtype)...")
        # Load and preprocess image
        input_image = Image.open(image_path)
        input_image = remove_background(input_image, rembg_session)
        input_image = resize_foreground(input_image, 0.85)

        # Run model with correct dtype for this GPU
        with torch.no_grad():
            with torch.autocast(
                device_type=device, dtype=autocast_dtype
            ) if "cuda" in device else nullcontext():
                mesh, glob_dict = model.run_image(
                    input_image,
                    bake_resolution=1024,
                    remesh="none",
                )

        # Export mesh to GLB
        out_path = os.path.join(output_dir, "mesh.glb")
        mesh.export(out_path, include_normals=True)
        print(f"✅ GLB saved to {out_path}")

        # Free GPU memory
        del mesh, glob_dict
        gc.collect()
        torch.cuda.empty_cache()

        return FileResponse(out_path, media_type="model/gltf-binary", filename="model.glb")

    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(f"❌ Stable Fast 3D generation failed:\n{tb}")
        # Free GPU memory even on failure
        gc.collect()
        torch.cuda.empty_cache()
        return {"error": "Generation failed", "details": str(e)}
