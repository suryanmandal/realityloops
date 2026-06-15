"use client";

import PublicNavbar from "@/app/components/PublicNavbar";
import Footer from "@/app/components/Footer";
import { ArrowUpRight, Sparkles, MoveRight, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface TrackingModule {
  id: string;
  index: string;
  title: string;
  description: string;
  useCases: string[];
  exampleLink: string;
  icon: string;
}

export default function FashionPage() {
  const router = useRouter();

  const trackingModules: TrackingModule[] = [
    {
      id: "wrist-hand",
      index: "01",
      title: "Wrist & Hand Tracking",
      description: "Precision spatial anchoring that maps physical joint movements of the wrist, palm, and individual fingers down to the millimeter.",
      useCases: ["Watches", "Bracelets", "Bangles", "Rings", "Nail Art", "Virtual Gloves"],
      exampleLink: "#",
      icon: "🤚",
    },
    {
      id: "foot-ankle",
      index: "02",
      title: "Foot & Ankle Tracking",
      description: "Robust anatomical shape recognition of the foot, ankle contours, and dimensional shoe orientation for perfect digital shoe mappings.",
      useCases: ["Luxury Footwear", "Designer Socks", "Anklets", "Orthopedic Sizing", "Digital Sneaker Try-On"],
      exampleLink: "#",
      icon: "👟",
    },
    {
      id: "face-head",
      index: "03",
      title: "Face & Head Tracking",
      description: "Dense coordinate topology mapping of the human face and head silhouette to anchor accessories in real time with zero-latency posture adjustment.",
      useCases: ["Spectacles & Sunglasses", "Earrings & Piercings", "Hats & Caps", "Headbands", "Virtual Makeup", "Artistic Filters"],
      exampleLink: "#",
      icon: "🕶️",
    },
    {
      id: "full-body",
      index: "04",
      title: "Full-Body Skinned Mesh Tracking",
      description: "Full-body skeletal frame tracking that identifies shoulders, hips, knees, and elbow configurations to compute dynamic fabric flows.",
      useCases: ["Virtual Fitting Room (Jackets, Pants, Dresses)", "Ergonomic Posture Coaching", "Interactive Avatars", "Sizing Calibration"],
      exampleLink: "#",
      icon: "🧍",
    },
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#111111] flex flex-col font-sans">
      <PublicNavbar />

      {/* HERO SECTION */}
      <header className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center space-y-6 flex-1">
        <div className="inline-flex items-center gap-2 border border-slate-900/10 bg-[#F5F4F0] px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-slate-800" />
          Verticals / Coming Soon
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto uppercase leading-none font-serif">
          The Future of <br />
          <span className="text-[#3D5AFE]">Immersive Fashion</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          We're bridging the digital-physical couture divide. Reality Loops is integrating state-of-the-art camera tracking to power immersive virtual try-on tryouts for premium brands.
        </p>

        <div className="pt-6 flex justify-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest transition-all rounded-none"
          >
            Return Home
          </button>
        </div>
      </header>

      {/* BOX MAP GRID */}
      <section className="max-w-6xl mx-auto px-6 pb-24 w-full">
        <div className="text-xs uppercase tracking-widest font-mono text-slate-500 mb-6 border-b border-slate-900/10 pb-3 flex justify-between">
          <span>Camera Tracking Architectures</span>
          <span>SaaS XR Modules</span>
        </div>

        {/* Sharp Boxy Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-slate-900/15">
          {trackingModules.map((module) => (
            <div 
              key={module.id} 
              className="bg-white p-8 md:p-10 border-r border-b border-slate-900/15 flex flex-col justify-between group hover:bg-[#FAF9F5] transition-colors duration-300 relative min-h-[440px]"
            >
              {/* Coming soon badge */}
              <div className="absolute top-6 right-6">
                <span className="text-[9px] font-mono uppercase tracking-widest border border-[#3D5AFE]/30 bg-[#3D5AFE]/5 text-[#3D5AFE] px-2.5 py-0.5 font-bold">
                  Coming Soon
                </span>
              </div>

              {/* Header Box */}
              <div>
                <span className="text-3xl font-mono text-slate-300 font-extrabold block mb-4">
                  {module.index}
                </span>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl" role="img" aria-label="module icon">
                    {module.icon}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    {module.title}
                  </h3>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                  {module.description}
                </p>

                {/* Bullet Use Cases */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Core Target Use Cases
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {module.useCases.map((useCase, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs font-semibold px-2.5 py-1 bg-[#F5F4F0] border border-slate-900/5 text-slate-700"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Explore Showcase CTA */}
              <button 
                onClick={() => alert(`Virtual ${module.title} Showcase VTO showcase launching soon. Stay tuned!`)}
                className="w-full mt-8 border border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 py-3.5 px-5 text-xs font-mono uppercase tracking-widest font-black flex items-center justify-between group-hover:shadow-lg cursor-pointer"
              >
                <span>Showcase Example</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
