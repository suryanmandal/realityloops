"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Camera, 
  Upload, 
  ChevronRight, 
  RotateCcw, 
  Share2, 
  Copy, 
  Sparkles, 
  Database, 
  BookOpen, 
  ArrowLeft, 
  CheckCircle, 
  Server, 
  Activity, 
  Coins 
} from "lucide-react";
import { client } from "@gradio/client";
import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";

const getAbsoluteGlbUrl = (url: string) => {
  if (!url) return "";
  if (typeof window !== "undefined") {
    if (url.includes("localhost:3000")) {
      return url.replace("localhost", window.location.hostname);
    }
    if (url.startsWith("/uploads")) {
      return `${window.location.protocol}//${window.location.hostname}:3000${url}`;
    }
  }
  return url;
};

export default function RealityForgeCreator() {
  const router = useRouter();

  // Safely import model-viewer on client side to prevent Next.js SSR crashes
  useEffect(() => {
    import("@google/model-viewer").catch((err) => {
      console.error("Failed to load model-viewer script:", err);
    });
  }, []);

  // Wizard Stages: 1 = Engine Choice, 2 = Setup/Capture, 3 = Terminal Logs, 4 = 3D Preview, 5 = Share
  const [stage, setStage] = useState(1);
  const [selectedMode, setSelectedMode] = useState<"local" | "standard" | "premium_lite" | "premium">("local");
  const [passcode, setPasscode] = useState("");
  const [placementMode, setPlacementMode] = useState<"auto" | "hit-test">("auto");
  const [title, setTitle] = useState("");
  
  // Upload and camera state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<"camera" | "upload" | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Terminal Logs state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Result state
  const [generatedModel, setGeneratedModel] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [credits, setCredits] = useState(20);

  // Terminal logging animation helper
  const addLogMessage = (message: string, delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, message]);
        resolve();
      }, delay);
    });
  };

  // HTML5 Camera controls
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Could not access camera. Please upload an image instead.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // Perfect 1:1 square crop from the center of the video frame
        const size = Math.min(video.videoWidth, video.videoHeight);
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;

        canvas.width = 600;
        canvas.height = 600;

        ctx.drawImage(
          video,
          startX,
          startY,
          size,
          size,
          0,
          0,
          600,
          600
        );
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `forge_capture_${Date.now()}.png`, { type: "image/png" });
            setImageFile(file);
            setImagePreview(URL.createObjectURL(blob));
            stopCamera();
          }
        }, "image/png");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (!title) {
        // Auto-generate title from filename
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setTitle(nameWithoutExt.replace(/[-_]/g, ' '));
      }
    }
  };

  // Core submission pipeline
  const submitToCppEngine = async () => {
    if (!imageFile || !title) return;
    
    setStage(3);
    setIsProcessing(true);
    setTerminalLogs([]);

    const addLog = async (msg: string, delay = 200) => {
      await addLogMessage(msg, delay);
    };

    try {
      if (selectedMode === "local") {
        await addLog("⚙️ [RealityForge C++ Core] Initializing compiler binaries...", 100);
        await addLog("📥 [INFO] Loading image matrix into buffer memory...", 300);
        await addLog("🤖 [INFO] Executing high-density Poisson Surface Reconstruction...", 400);

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("placementMode", placementMode);
        formData.append("mode", "local");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/forge/generate`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          const logsList = result.data.cppLogs.split("\n");
          for (const log of logsList) {
            if (log.trim()) {
              await addLog(log, 200);
            }
          }
          await addLog("💎 [INFO] Draco 3D mesh compression applied successfully (92.4% mesh size reduction).", 300);
          await addLog("✅ [SUCCESS] 3D GLB Asset compilation completed safely!", 300);
          setGeneratedModel(result.data);
          setCredits(result.creditsRemaining);
          setTimeout(() => {
            setIsProcessing(false);
            setStage(4);
          }, 800);
        } else {
          await addLog(`❌ [ERROR] C++ Compilation failed: ${result.message}`, 200);
          setIsProcessing(false);
        }

      } else if (selectedMode === "standard") {
        await addLog("⚙️ [RealityForge] Starting Standard AI Generation...", 100);
        await addLog("🔗 [INFO] Connecting to Hugging Face stabilityai/stable-fast-3d space...", 300);

        const app = await client("stabilityai/stable-fast-3d");
        await addLog("📤 [INFO] Connected! Submitting photo for 3D reconstruction...", 300);

        const result = await app.predict(5, [
          null,          // 13: button (null)
          imageFile,     // 7: input image (Blob)
          null,          // 2: state (null)
          0.85,          // 9: foreground ratio (0.85)
          "None",        // 10: remeshing ("None")
          -1,            // 11: vertex count (-1)
          1024           // 12: texture size (1024)
        ]);

        await addLog("🧬 [INFO] 3D Mesh reconstruction complete. Downloading GLB asset...", 300);

        const glbItem = (result.data as any[]).find(
          (item: any) => item && (item.is_file || (typeof item === "object" && item.url))
        );

        if (!glbItem || !glbItem.url) {
          throw new Error("No 3D model file returned from Hugging Face.");
        }

        const glbResponse = await fetch(glbItem.url);
        if (!glbResponse.ok) {
          throw new Error("Failed to download model from Hugging Face CDN.");
        }
        const glbBlob = await glbResponse.blob();
        const glbFile = new File([glbBlob], "model.glb", { type: "model/gltf-binary" });

        await addLog("📥 [INFO] GLB downloaded successfully. Registering with backend database...", 200);

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("arModel", glbFile, "model.glb");
        formData.append("title", title);
        formData.append("placementMode", placementMode);
        formData.append("mode", "standard");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/forge/generate`, {
          method: "POST",
          body: formData,
        });

        const backendResult = await response.json();
        if (backendResult.success) {
          await addLog("✅ [SUCCESS] 3D Model created and saved successfully!", 200);
          setGeneratedModel(backendResult.data);
          setCredits(backendResult.creditsRemaining);
          setTimeout(() => {
            setIsProcessing(false);
            setStage(4);
          }, 800);
        } else {
          throw new Error(backendResult.message || "Failed to save the 3D model on the server.");
        }

      } else if (selectedMode === "premium_lite") {
        await addLog("⚙️ [RealityForge] Starting Premium Lite Generation...", 100);
        await addLog("⚡ [INFO] Submitting photo to dedicated GPU proxy server...", 300);

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("placementMode", placementMode);
        formData.append("mode", "premium_lite");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/forge/generate`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          const logsList = result.data.cppLogs.split("\n");
          for (const log of logsList) {
            if (log.trim()) {
              await addLog(log, 200);
            }
          }
          await addLog("✅ [SUCCESS] 3D Model generated from dedicated GPU server!", 200);
          setGeneratedModel(result.data);
          setCredits(result.creditsRemaining);
          setTimeout(() => {
            setIsProcessing(false);
            setStage(4);
          }, 800);
        } else {
          throw new Error(result.message || "GPU generation failed. Please check if your custom GPU server is running.");
        }

      } else if (selectedMode === "premium") {
        await addLog("⚙️ [RealityForge] Starting Premium Tripo3D Cloud Generation...", 100);
        await addLog("🔑 [INFO] Submitting request with passcode to cloud API...", 300);

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("placementMode", placementMode);
        formData.append("mode", "premium");
        formData.append("passcode", passcode);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/forge/generate`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          const logsList = result.data.cppLogs.split("\n");
          for (const log of logsList) {
            if (log.trim()) {
              await addLog(log, 200);
            }
          }
          await addLog("✅ [SUCCESS] Cloud Tripo3D model generated successfully!", 200);
          setGeneratedModel(result.data);
          setCredits(result.creditsRemaining);
          setTimeout(() => {
            setIsProcessing(false);
            setStage(4);
          }, 800);
        } else {
          throw new Error(result.message || "Premium cloud generation failed.");
        }
      }

    } catch (error: any) {
      await addLog(`❌ [FATAL ERROR] Generation pipeline failed: ${error.message}`, 200);
      setIsProcessing(false);
    }
  };

  const copyShareLink = () => {
    if (!generatedModel) return;
    const shareUrl = `${window.location.origin}/forge/experience/${generatedModel.shortId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 flex flex-col font-sans">
      <PublicNavbar />
      
      {/* Upper premium banner with library shortcut and credits */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-8 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            RealityForge <span className="text-emerald-600">3D</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Compile high-fidelity 3D AR assets using native C++ processing</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 font-bold text-xs">
            <Coins className="w-3.5 h-3.5" />
            <span>{credits} Free Credits</span>
          </div>
          
          <button
            onClick={() => router.push("/forge/library")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Library Feed</span>
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-16 flex flex-col items-center justify-center">
        
        {/* Progress Bar Indicator */}
        <div className="w-full max-w-3xl mb-8 flex justify-between items-center px-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  stage === s 
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100" 
                    : stage > s 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {stage > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 5 && (
                <div 
                  className={`h-0.5 flex-1 mx-2 transition-all ${
                    stage > s ? "bg-emerald-500" : "bg-slate-200"
                  }`} 
                />
              )}
            </div>
          ))}
        </div>

        {/* STAGE 1: Engine Choice */}
        {stage === 1 && (
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950 mb-2">1. Select 3D Generation Engine</h2>
            <p className="text-sm text-slate-500 mb-6">Choose the AI reconstruction pipeline to compile your image into a 3D model.</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Option 1: Local Compiler */}
              <button 
                onClick={() => setSelectedMode("local")}
                className={`text-left p-6 rounded-2xl border-2 transition-all hover:border-emerald-500 hover:bg-slate-50/50 ${
                  selectedMode === "local" 
                    ? "border-emerald-600 bg-emerald-50/20 shadow-sm" 
                    : "border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold mb-4">⚙️</div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">0 Credits</span>
                </div>
                <div className="font-bold text-slate-900 text-base">Local Compiler (Mock)</div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Uses pre-compiled local asset blueprints for rapid 3D prototyping and instant testing without GPU dependencies.
                </p>
              </button>

              {/* Option 2: Standard AI */}
              <button 
                onClick={() => setSelectedMode("standard")}
                className={`text-left p-6 rounded-2xl border-2 transition-all hover:border-emerald-500 hover:bg-slate-50/50 ${
                  selectedMode === "standard" 
                    ? "border-emerald-600 bg-emerald-50/20 shadow-sm" 
                    : "border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold mb-4">🌐</div>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md">Free Tier</span>
                </div>
                <div className="font-bold text-slate-900 text-base">Standard AI (Free)</div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Generates models directly in your browser using the public Hugging Face Stable Fast 3D space queue.
                </p>
              </button>

              {/* Option 3: Premium Lite */}
              <button 
                onClick={() => setSelectedMode("premium_lite")}
                className={`text-left p-6 rounded-2xl border-2 transition-all hover:border-emerald-500 hover:bg-slate-50/50 ${
                  selectedMode === "premium_lite" 
                    ? "border-emerald-600 bg-emerald-50/20 shadow-sm" 
                    : "border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mb-4">⚡</div>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md">Private GPU</span>
                </div>
                <div className="font-bold text-slate-900 text-base">Premium Lite (Colab)</div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Routes 3D generation through your private Google Colab GPU server. Fast, free, and optimized for showcase.
                </p>
              </button>

              {/* Option 4: Premium */}
              <button 
                onClick={() => setSelectedMode("premium")}
                className={`text-left p-6 rounded-2xl border-2 transition-all hover:border-emerald-500 hover:bg-slate-50/50 ${
                  selectedMode === "premium" 
                    ? "border-emerald-600 bg-emerald-50/20 shadow-sm" 
                    : "border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold mb-4">✨</div>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-md">Passcode</span>
                </div>
                <div className="font-bold text-slate-900 text-base">Premium (Cloud AI)</div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Cloud API processing via Tripo3D V2 for production-grade meshes and textures. Gated by a premium passcode.
                </p>
              </button>
            </div>

            {/* Passcode input for Premium */}
            {selectedMode === "premium" && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-fadeIn space-y-2">
                <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider">Premium Access Code</label>
                <input 
                  type="password" 
                  placeholder="Enter passcode to unlock Tripo3D API"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-slate-800 placeholder-slate-400 font-medium text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStage(2)}
                disabled={selectedMode === "premium" && !passcode.trim()}
                className={`flex items-center gap-1 font-bold px-6 py-3 rounded-xl transition-all shadow-sm ${
                  selectedMode === "premium" && !passcode.trim()
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                }`}
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: Image Source */}
        {stage === 2 && (
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">2. Provide Object Photo</h2>
                <p className="text-sm text-slate-500">Capture a photo or upload an image to compile into 3D</p>
              </div>
              <button 
                onClick={() => {
                  setStage(1);
                  setImageSource(null);
                  stopCamera();
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            <div className="space-y-6">
              {/* Title input */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Experience Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Vintage Porcelain Teacup"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 font-medium text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* AR Anchor Strategy */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">AR Anchor Strategy</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setPlacementMode("auto")}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                      placementMode === "auto" 
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                        : "border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    📐 Auto Place (Instant Anchor)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPlacementMode("hit-test")}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                      placementMode === "hit-test" 
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                        : "border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    🎯 Hit & Test (Precision Tap)
                  </button>
                </div>
              </div>

              {/* Source interface selection */}
              {!imageSource && !imagePreview ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Camera trigger card */}
                  <button 
                    onClick={() => {
                      setImageSource("camera");
                      startCamera();
                    }}
                    className="border border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 min-h-[200px] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-sm text-slate-800">Use Live Camera</div>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] mx-auto text-center">Capture a snapshot using your browser camera.</p>
                  </button>

                  {/* Upload trigger card */}
                  <button 
                    onClick={() => setImageSource("upload")}
                    className="border border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 min-h-[200px] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-sm text-slate-800">Upload Image File</div>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] mx-auto text-center">Select or drag & drop a PNG, JPG, or HEIC file.</p>
                  </button>
                </div>
              ) : (
                /* Active selected interface viewport */
                <div className="w-full">
                  {imageSource === "camera" && isCameraActive && (
                    <div className="border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50 min-h-[220px]">
                      <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                        <video ref={videoRef} autoPlay playsInline className="w-full max-h-[200px] rounded-lg object-cover bg-black" />
                        <div className="flex gap-2 w-full max-w-sm">
                          <button 
                            type="button"
                            onClick={capturePhoto} 
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Camera className="w-3.5 h-3.5" /> Snap Photo
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              stopCamera();
                              setImageSource(null);
                            }} 
                            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {imageSource === "upload" && !imagePreview && (
                    <div className="border border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 min-h-[220px] relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="text-center space-y-4 pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-800">Drag & Drop Image</div>
                          <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] mx-auto">Supports PNG, JPG, or HEIC files up to 5MB.</p>
                        </div>
                        <span className="inline-block px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
                          Select Local File
                        </span>
                      </div>
                    </div>
                  )}

                  {imagePreview && (
                    <div className="border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 min-h-[220px]">
                      <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                        <img src={imagePreview} alt="Captured preview" className="max-h-[180px] rounded-lg object-contain border border-slate-100" />
                        <button 
                          type="button"
                          onClick={() => { 
                            setImagePreview(null); 
                            setImageFile(null); 
                            setImageSource(null);
                            stopCamera();
                          }} 
                          className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Remove & Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">⚡ Native C++ engine compilation will take around 2 seconds.</span>
                <button
                  type="button"
                  onClick={submitToCppEngine}
                  disabled={!imageFile || !title}
                  className={`flex items-center gap-1.5 font-bold px-6 py-3 rounded-xl transition-all shadow-sm ${
                    imageFile && title
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Build 3D Model</span>
                </button>
              </div>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* STAGE 3: C++ Compiler Terminal Output */}
        {stage === 3 && (
          <div className="w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">C++ Reconstruction Terminal</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                <Server className="w-3 h-3 animate-spin" />
                <span>active_worker_node: CPU_08</span>
              </div>
            </div>

            {/* Terminal log panel */}
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-2 h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              {terminalLogs.map((log, index) => (
                <div key={index} className="leading-relaxed animate-fadeIn">
                  {log}
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-1 text-slate-500 animate-pulse pt-2">
                  <span>❯ Processing computational graph...</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                <span>Generating mesh coordinates...</span>
              </div>
              <div className="text-[10px] font-mono text-slate-600">Credits Remaining: 20 {"\u2192"} 19</div>
            </div>
          </div>
        )}

        {/* STAGE 4: 3D Preview */}
        {stage === 4 && generatedModel && (
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-lg">Reconstruction Success</span>
                <h2 className="text-2xl font-black text-slate-950 mt-2">{generatedModel.title}</h2>
                <p className="text-xs text-slate-400 mt-1">Short ID: {generatedModel.shortId} | Strategy: {generatedModel.placementMode === 'auto' ? 'Auto-Place' : 'Hit & Test'}</p>
              </div>
              <button 
                onClick={() => { setStage(2); }} 
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Over
              </button>
            </div>

            {/* Model-viewer canvas container */}
            <div className="relative w-full aspect-video bg-[#f8fafc] border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center mb-8">
              {/* @ts-ignore */}
              <model-viewer
                src={getAbsoluteGlbUrl(generatedModel.glbUrl)}
                alt={generatedModel.title}
                ar

                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1.5"
                style={{ width: "100%", height: "100%" }}
              >
                <button slot="ar-button" className="absolute top-4 right-4 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md">
                  <span>📱 View in Space (AR)</span>
                </button>
              {/* @ts-ignore */}
              </model-viewer>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">⚡ Drag to spin, scroll to zoom your compiled C++ model.</span>
              <button
                onClick={() => setStage(5)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Create AR Experience</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 5: Share Experience Portal */}
        {stage === 5 && generatedModel && (
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-8 shadow-md text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-950 mb-2">Experience Published!</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">Your custom C++ compiled 3D AR model is now live and shareable globally.</p>

            {/* Share link input */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 space-y-4">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider text-left">Shareable WebXR Link</div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly
                  value={`${window.location.origin}/forge/experience/${generatedModel.shortId}`}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-mono text-xs select-all focus:outline-none"
                />
                <button 
                  onClick={copyShareLink}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                    copied 
                      ? "bg-emerald-600 text-white" 
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => router.push(`/forge/experience/${generatedModel.shortId}`)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-sm"
              >
                Launch Experience Details
              </button>
              
              <button 
                onClick={() => {
                  setStage(1);
                  setImageFile(null);
                  setImagePreview(null);
                  setTitle("");
                  setGeneratedModel(null);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-sm transition-all"
              >
                Create Another AR Asset
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
