"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Sparkles, 
  MapPin, 
  Eye, 
  ArrowLeft, 
  Loader2, 
  Share2, 
  Copy, 
  CheckCircle, 
  Info, 
  Terminal,
  Activity 
} from "lucide-react";
import PublicNavbar from "../../../components/PublicNavbar";
import Footer from "../../../components/Footer";

const getAbsoluteGlbUrl = (url: string) => {
  if (!url) return "";
  
  const apiBase = process.env.NEXT_PUBLIC_API || "";
  let resolvedUrl = url;

  // 1. If it's a relative path, prepend the API base URL
  if (resolvedUrl.startsWith("/uploads")) {
    resolvedUrl = `${apiBase}${resolvedUrl}`;
  }
  
  // 2. If it points to localhost:3000 but the API is hosted elsewhere (production),
  // replace localhost with the API base URL
  if (resolvedUrl.includes("localhost:3000") && apiBase && !apiBase.includes("localhost:3000")) {
    resolvedUrl = resolvedUrl.replace(/https?:\/\/localhost:3000/, apiBase);
  }

  // 3. Force HTTPS if the current page is loaded over HTTPS to prevent Mixed Content blocking
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    resolvedUrl = resolvedUrl.replace("http://", "https://");
  }

  return resolvedUrl;
};

interface ForgeModelItem {
  _id: string;
  shortId: string;
  title: string;
  imageUrl: string;
  glbUrl: string;
  placementMode: "auto" | "hit-test";
  cppLogs: string;
  createdAt: string;
}

export default function RealityForgeExperienceViewer() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // Safely import model-viewer on client side to prevent Next.js SSR crashes
  useEffect(() => {
    import("@google/model-viewer").catch((err) => {
      console.error("Failed to load model-viewer script:", err);
    });
  }, []);

  const [experience, setExperience] = useState<ForgeModelItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchExperience = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/forge/experience/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setExperience(result.data);
        } else {
          setError(result.message || "This experience could not be loaded");
        }
      } catch (err: any) {
        console.error("Error loading experience:", err);
        setError("Could not establish connection to the backend database");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  const copyShareLink = () => {
    if (!experience) return;
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col justify-center">
        {/* Navigation & Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => router.push("/forge/library")}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Feed
          </button>
          
          <button
            onClick={() => router.push("/forge")}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 rounded-xl font-bold text-xs transition-all bg-white"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Yours</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Reconstructing 3D space matrix...</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Error Loading Experience</h3>
            <p className="text-xs text-slate-400 mb-6">{error}</p>
            <button 
              onClick={() => router.push("/forge")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
            >
              Go to Creator Workspace
            </button>
          </div>
        ) : experience ? (
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Interactive 3D Canvas Panel (2/3 width) */}
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[520px]">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-600">Interactive 3D Preview</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">Short ID: {experience.shortId}</div>
              </div>

              <div className="relative flex-1 bg-[#f8fafc] flex items-center justify-center">
                {/* @ts-ignore */}
                <model-viewer
                  src={getAbsoluteGlbUrl(experience.glbUrl)}
                  alt={experience.title}
                  ar
                  ar-modes="webxr scene-viewer quick-look"

                  camera-controls
                  auto-rotate
                  shadow-intensity="1.5"
                  style={{ width: "100%", height: "100%" }}
                >
                  <button slot="ar-button" className="absolute top-4 right-4 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all">
                    <span>📱 Place in Space (AR)</span>
                  </button>
                {/* @ts-ignore */}
                </model-viewer>
              </div>
            </div>

            {/* Sidebar Details Panel (1/3 width) */}
            <div className="space-y-6">
              
              {/* Product Info Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                <div>
                  <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-mono font-bold uppercase rounded-lg">C++ Generated Asset</span>
                  <h2 className="text-2xl font-black text-slate-950 mt-3 tracking-tight">{experience.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">Compiled: {new Date(experience.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Placement Details */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                    {experience.placementMode === "auto" ? "📐" : "🎯"}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 uppercase tracking-wider">Placement Anchor</div>
                    <div className="text-xs text-slate-700 mt-1 font-semibold">
                      {experience.placementMode === "auto" ? "Auto Place (Instant)" : "Hit & Test (Precision)"}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      {experience.placementMode === "auto" 
                        ? "Anchors automatically onto flat surfaces using advanced environment scanning." 
                        : "Requires manual tap to place. Supports rotation, translation, and scaling controls."}
                    </p>
                  </div>
                </div>

                {/* Original Source Thumbnail */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Source 2D Image</div>
                  <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-100 overflow-hidden relative">
                    <img src={experience.imageUrl} alt="Source thumbnail" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Share CTA */}
                <div className="space-y-3 pt-2">
                  <button 
                    onClick={copyShareLink}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                      copied 
                        ? "bg-emerald-600 text-white" 
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? "Link Copied!" : "Share AR Experience"}</span>
                  </button>
                </div>
              </div>

              {/* Native C++ Logs accordion card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="w-full flex justify-between items-center font-bold text-xs text-slate-700"
                >
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-600" />
                    <span>C++ Server Logs</span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase">{showLogs ? "Hide" : "Show"}</span>
                </button>

                {showLogs && (
                  <div className="mt-4 bg-slate-950 p-4 rounded-2xl border border-slate-900 font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-[200px] leading-relaxed">
                    {experience.cppLogs ? (
                      <pre>{experience.cppLogs}</pre>
                    ) : (
                      <span className="text-slate-500">No logging details captured.</span>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
