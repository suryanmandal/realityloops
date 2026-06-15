"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles, Server, Calendar, MapPin, Eye, ArrowLeft, Loader2 } from "lucide-react";
import PublicNavbar from "../../components/PublicNavbar";
import Footer from "../../components/Footer";

interface ForgeModelItem {
  _id: string;
  shortId: string;
  title: string;
  imageUrl: string;
  glbUrl: string;
  placementMode: "auto" | "hit-test";
  createdAt: string;
}

export default function RealityForgeLibrary() {
  const router = useRouter();
  const [feedItems, setFeedItems] = useState<ForgeModelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/forge/feed`);
        const result = await response.json();
        
        if (result.success) {
          setFeedItems(result.data);
        } else {
          setError(result.message || "Failed to load public feed");
        }
      } catch (err: any) {
        console.error("Error fetching library feed:", err);
        setError("Could not establish connection to the backend service");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push("/forge")}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                RealityForge Feed
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1 ml-8">A public feed of custom 3D AR models compiled using our C++ engine</p>
          </div>

          <button
            onClick={() => router.push("/forge")}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Custom AR</span>
          </button>
        </div>

        {/* Library Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Fetching 3D database records...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-700 max-w-md mx-auto">
            <p className="font-bold mb-1">Server connection error</p>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">No generated models yet</h3>
            <p className="text-xs text-slate-400 mb-6">Be the first to compile an image into 3D using the RealityForge engine!</p>
            <button 
              onClick={() => router.push("/forge")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
            >
              Start Generating
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {feedItems.map((item) => (
              <div 
                key={item._id} 
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Preview with overlay */}
                <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => router.push(`/forge/experience/${item.shortId}`)}
                      className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl flex items-center gap-1 shadow-md hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview 3D
                    </button>
                  </div>

                  <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm border border-slate-100 text-slate-700 font-mono text-[9px] font-bold rounded-lg shadow-sm uppercase">
                    ID: {item.shortId}
                  </span>
                </div>

                {/* Details panel */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-1">{item.title}</h3>
                    
                    <div className="flex flex-col gap-1.5 mt-3 text-[10px] text-slate-400 font-semibold font-mono">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mode: {item.placementMode === "auto" ? "Auto-Place" : "Hit & Test"}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Compiled: {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => router.push(`/forge/experience/${item.shortId}`)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 group-hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <span>Launch Experience</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
