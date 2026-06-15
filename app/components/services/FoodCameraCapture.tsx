"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, X, RefreshCw, Sparkles, CheckCircle2, AlertTriangle, Play, HelpCircle, Upload } from "lucide-react";

interface FoodCameraCaptureProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProduct: any) => void;
}

type StepState = "idle" | "camera" | "preview" | "generating" | "success" | "error";

export default function FoodCameraCapture({ productId, isOpen, onClose, onSuccess }: FoodCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [state, setState] = useState<StepState>("idle");
  const [streamActive, setStreamActive] = useState(false);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Clean up captured URL on change/unmount
  useEffect(() => {
    return () => {
      if (capturedUrl) {
        URL.revokeObjectURL(capturedUrl);
      }
    };
  }, [capturedUrl]);

  // Clean up camera stream when modal is closed
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setState("idle");
      setCapturedBlob(null);
      setCapturedUrl(null);
      setProgress(0);
      setErrorMessage("");
    }
  }, [isOpen]);

  // Handle progress interval simulation during 3D generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === "generating") {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 8) + 3;
          if (next >= 99) {
            clearInterval(interval);
            return 99;
          }
          
          // Update texts based on progress steps
          if (next < 25) {
            setProgressText("📤 Uploading food photo...");
          } else if (next >= 25 && next < 50) {
            setProgressText("✂️ Extracting foreground details & isolating background...");
          } else if (next >= 50 && next < 75) {
            setProgressText("🧬 Synthesizing water-tight 3D polygon mesh...");
          } else {
            setProgressText("🎨 Baking high-fidelity UV roughness & albedo textures...");
          }

          return next;
        });
      }, 180);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state]);

  const startCamera = async () => {
    setState("camera");
    setErrorMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (err: any) {
      console.error("Failed to access camera:", err);
      setErrorMessage("Could not access your camera. Make sure you grant permissions or try manually uploading files.");
      setState("error");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedBlob(file);
      const previewUrl = URL.createObjectURL(file);
      setCapturedUrl(previewUrl);
      setState("preview");
      stopCamera();
    }
  };

  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // We want a perfect 1:1 square crop from the center of the video frame
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
            setCapturedBlob(blob);
            const previewUrl = URL.createObjectURL(blob);
            setCapturedUrl(previewUrl);
            setState("preview");
            stopCamera();
          }
        }, "image/png");
      }
    }
  };

  const handleGenerateModel = async () => {
    if (!capturedBlob) return;
    setState("generating");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("Restaurant authentication token not found. Please log in again.");
      }

      // Build standard multipart request body
      const formData = new FormData();
      formData.append("image", capturedBlob, "captured_food.png");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/product/generate-3d/${productId}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate 3D model. Please try again.");
      }

      const result = await response.json();
      setProgress(100);
      setProgressText("✓ 3D Model generated successfully!");
      setState("success");
      
      // Delay success callback slightly to let them enjoy the completed checkbox
      setTimeout(() => {
        onSuccess(result.data.product);
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error("Image to 3D pipeline execution failed:", err);
      setErrorMessage(err.message || "An unexpected error occurred during 3D generation.");
      setState("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-[#1e293b] rounded-3xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b]">
          <div>
            <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Reconstruction Engine</span>
            </div>
            <h2 className="text-xl font-black text-white mt-0.5">Image-to-3D Generator</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#131926] hover:bg-[#1e293b] border border-[#1e293b] flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Close generator"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-center min-h-[350px]">
          
          {/* Main State Canvas */}
          <div className="relative aspect-square w-full max-w-[320px] mx-auto bg-[#0b0f19] border border-[#1e293b]/80 rounded-2xl overflow-hidden flex items-center justify-center group">
            
            {/* 1. Camera live feed */}
            {state === "camera" && (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {/* Target overlay framework */}
                <div className="absolute inset-4 border border-dashed border-cyan-500/40 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border border-dashed border-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-500 bg-[#0f172a]/95 px-2 py-0.5 rounded-md border border-[#1e293b] uppercase tracking-widest shadow">Align Food Center</span>
                  </div>
                </div>
              </>
            )}

            {/* 2. Snapshot captured preview */}
            {state === "preview" && capturedUrl && (
              <img src={capturedUrl} alt="Captured preview" className="w-full h-full object-cover" />
            )}

            {/* 3. Generating micro-animation */}
            {state === "generating" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4 bg-gradient-to-b from-[#131926]/40 to-[#0b0f19]/60">
                {/* 3D Wireframe Spinning Cube Simulation in CSS */}
                <div className="w-20 h-20 relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 border-2 border-emerald-500/40 rounded-lg animate-[spin_3s_linear_infinite]" />
                  <div className="absolute w-16 h-16 border border-cyan-500/30 rounded-xl animate-[spin_6s_linear_infinite_reverse]" />
                  <div className="absolute w-6 h-6 border-2 border-indigo-500/60 rounded animate-[spin_2s_ease-in-out_infinite]" />
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse absolute" />
                </div>
                <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${progress}%` }}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                  />
                </div>
                <div className="text-center">
                  <span className="text-lg font-black text-white">{progress}%</span>
                  <p className="text-xs font-semibold text-gray-400 mt-1 max-w-[240px] leading-relaxed animate-pulse">{progressText}</p>
                </div>
              </div>
            )}

            {/* 4. Success State */}
            {state === "success" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-emerald-950/20 text-emerald-400 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-white">Pipeline Complete</h3>
                <p className="text-xs text-gray-400 font-semibold max-w-[200px]">The textured 3D model has been successfully generated and bound to your menu item!</p>
              </div>
            )}

            {/* 5. Error State */}
            {state === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-red-950/20 text-red-400 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Generation Failed</h3>
                <p className="text-xs text-gray-400 font-semibold max-w-[240px] leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* 6. Idle start screen */}
            {state === "idle" && (
              <div className="p-6 text-center space-y-3">
                <Camera className="w-12 h-12 text-gray-500 mx-auto mb-1 opacity-50" />
                <p className="text-sm font-bold text-gray-300">Ready to Generate</p>
                <p className="text-[11px] text-gray-500 font-semibold max-w-[200px] leading-relaxed">Ensure your food dish is placed on a simple background with good overhead lighting.</p>
              </div>
            )}
            
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Footer Controls */}
        <footer className="px-6 py-4 border-t border-[#1e293b] bg-[#131926]/40 flex gap-4">
          
          {/* Close button */}
          {state !== "generating" && state !== "success" && (
            <button
              onClick={onClose}
              className="flex-1 bg-[#1e293b] hover:bg-[#1e293b]/80 border border-[#1e293b] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
          )}

          {/* Start stream button */}
          {state === "idle" && (
            <div className="flex w-full gap-4">
              <button
                onClick={startCamera}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10 border border-emerald-500/25 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Start Camera</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950/10 border border-cyan-600/25 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>
          )}

          {/* Trigger capture button */}
          {state === "camera" && streamActive && (
            <div className="flex w-full gap-4">
              <button
                onClick={captureSnapshot}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/10 border border-cyan-500/25 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Snapshot</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950/10 border border-cyan-600/25 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>
          )}

          {/* Re-snap and Process buttons */}
          {state === "preview" && (
            <>
              <button
                onClick={startCamera}
                className="flex-1 bg-[#1e293b] hover:bg-[#1e293b]/80 border border-[#1e293b] text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
              <button
                onClick={handleGenerateModel}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/10 border border-emerald-500/25 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Generate 3D</span>
              </button>
            </>
          )}

          {/* Try again from error state */}
          {state === "error" && (
            <button
              onClick={startCamera}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}

          {/* Generator executing loading state */}
          {state === "generating" && (
            <div className="w-full text-center py-2.5 text-xs text-gray-500 font-semibold select-none flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing algorithms. Do not close this window.</span>
            </div>
          )}

        </footer>

      </div>
    </div>
  );
}
