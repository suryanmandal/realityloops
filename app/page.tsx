"use client";
import React, { useState, useEffect } from 'react';
import { Box, Store, ShoppingBag, LayoutTemplate, ArrowRight, Code, Zap, Smartphone, Cuboid } from 'lucide-react';

const HomePage = () => {
  // Carousel State Logic
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const useCases = [
    {
      id: 0,
      title: "Furniture",
      desc: "Let customers place sofas in their living room.",
      video: "https://www.w3schools.com/html/mov_bbb.mp4", // Replace with your AR Furniture video
    },
    {
      id: 1,
      title: "Fashion",
      desc: "Virtual Try-On for glasses and earrings.",
      video: "https://www.w3schools.com/html/mov_bbb.mp4", // Replace with your VTO video
    },
    {
      id: 2,
      title: "Food",
      desc: "3D Menus that make guests hungry.",
      video: "https://www.w3schools.com/html/mov_bbb.mp4", // Replace with your 3D Menu video
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === useCases.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [useCases.length]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30">
      
      {/* Navbar Placeholder */}
      <nav className="flex justify-between items-center p-6 lg:px-12 border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <Cuboid className="text-cyan-400" />
          Reality Loops
        </div>
        <button className="px-5 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-full transition-all">
          Sign In
        </button>
      </nav>

      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-32 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
            <Zap size={16} /> Beta Launch
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Immersive Commerce.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Turn visitors into buyers. Whether you have a website or need one, launch 3D and AR experiences in minutes—modularly.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-white text-slate-950 rounded-full font-semibold hover:bg-slate-200 transition-all flex items-center gap-2">
              Start for Free <ArrowRight size={18} />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all">
              View Demo
            </button>
          </div>
        </div>
        
        {/* 3D Model Viewer Integration */}
        <div className="flex-1 w-full h-[500px] relative rounded-3xl overflow-hidden bg-gradient-to-tr from-purple-900/20 to-cyan-900/20 border border-white/10">
        {/* @ts-ignore*/}
          <model-viewer
            src="https://modelviewer.dev/shared-assets/models/Astronaut.glb" // Replace with your 3D Sneaker .glb
            auto-rotate
            camera-controls
            ar
            shadow-intensity="1"
            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
          />
        </div>
      </section>

      {/* 2. How It Works (The Core Apps) */}
      <section className="py-24 px-6 lg:px-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Install only what you need.</h2>
            <p className="text-slate-400">Don't pay for bloatware. Modular apps built for your specific business.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Code className="text-cyan-400" size={32}/>, title: "The Connector", desc: "For Shopify & WooCommerce users." },
              { icon: <Store className="text-purple-400" size={32}/>, title: "Instant Store", desc: "For Instagram & WhatsApp sellers." },
              { icon: <Smartphone className="text-pink-400" size={32}/>, title: "Face Try-On", desc: "For eyewear & jewelry brands." },
              { icon: <LayoutTemplate className="text-emerald-400" size={32}/>, title: "Room Planner", desc: "For furniture & decor placement." }
            ].map((app, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer group">
                <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block group-hover:scale-110 transition-transform">{app.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{app.title}</h3>
                <p className="text-slate-400 text-sm">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Two Paths */}
      <section className="py-0 flex flex-col lg:flex-row min-h-[60vh]">
        {/* Left Side */}
        <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-slate-950 to-slate-900 hover:from-slate-900 hover:to-cyan-950/20 transition-colors">
          <Code size={48} className="text-cyan-400 mb-8" />
          <h2 className="text-3xl font-bold mb-4">I have a website.</h2>
          <p className="text-xl text-slate-400 mb-8">Seamless Integration. Copy one line of code to add AR to your existing Shopify or Custom site.</p>
          <button className="text-cyan-400 font-semibold flex items-center gap-2 hover:gap-4 transition-all w-fit">
            Get the Snippet <ArrowRight size={20} />
          </button>
        </div>
        
        {/* Right Side */}
        <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center bg-gradient-to-bl from-slate-950 to-slate-900 hover:from-slate-900 hover:to-purple-950/20 transition-colors">
          <ShoppingBag size={48} className="text-purple-400 mb-8" />
          <h2 className="text-3xl font-bold mb-4">I need a store.</h2>
          <p className="text-xl text-slate-400 mb-8">Instant Launch. No website? No problem. Create a 3D-first storefront in under 5 minutes.</p>
          <button className="text-purple-400 font-semibold flex items-center gap-2 hover:gap-4 transition-all w-fit">
            Build Store <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* 4. Industry Use Cases (Carousel) */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-5xl font-bold text-center mb-16">Built for your industry.</h2>
        
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 aspect-video flex items-center justify-center">
          {/* Background Video Layer */}
          <video 
            key={useCases[currentSlide].id}
            autoPlay 
            loop 
            muted 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src={useCases[currentSlide].video} type="video/mp4" />
          </video>
          
          {/* Overlay Content */}
          <div className="relative z-10 text-center p-8 max-w-2xl backdrop-blur-sm bg-slate-950/30 rounded-3xl border border-white/10">
            <h3 className="text-4xl font-bold mb-4">{useCases[currentSlide].title}</h3>
            <p className="text-2xl text-slate-300">{useCases[currentSlide].desc}</p>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
            {useCases.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trust & Tech Footer */}
      <footer className="py-12 border-t border-white/10 bg-slate-950 text-center flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-24 px-6 text-slate-400 text-sm font-medium">
        <div className="flex items-center gap-3">
          <Smartphone className="text-slate-500" />
          Powered by WebAR – No App Download Required
        </div>
        <div className="flex items-center gap-3">
          <Box className="text-slate-500" />
          Universal 3D CMS – Upload once, deploy everywhere
        </div>
      </footer>
    </div>
  );
};

export default HomePage;