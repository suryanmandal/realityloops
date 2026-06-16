"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ── TYPES ── */
interface FAQItem {
  tag: string;
  question: string;
  answer: React.ReactNode;
}

interface CarouselItem {
  tag: string;
  label: string;
  gradient: string;
}

/* ── DATA ── */
const carousel1Items: CarouselItem[] = [
  { tag: "Food", label: "3D Menu Experience", gradient: "linear-gradient(135deg,#FF6B35,#FF3D00)" },
  { tag: "Furniture", label: "AR Room Placement", gradient: "linear-gradient(135deg,#00C2A8,#00897B)" },
  { tag: "Fashion", label: "Virtual Try-On Demo", gradient: "linear-gradient(135deg,#3D5AFE,#1A237E)" },
  { tag: "Platform", label: "Storefront Builder", gradient: "linear-gradient(135deg,#C8A96E,#8D6E48)" },
  { tag: "Food", label: "Restaurant XR Tour", gradient: "linear-gradient(135deg,#FF3D00,#C62828)" },
  { tag: "Furniture", label: "Catalog to 3D", gradient: "linear-gradient(135deg,#00C2A8,#004D40)" },
];

const carousel2Items: CarouselItem[] = [
  { tag: "Virtual 360", label: "Restaurant Walkthrough", gradient: "linear-gradient(135deg,#1A1F2E,#3D5AFE)" },
  { tag: "Virtual 360", label: "Furniture Showroom", gradient: "linear-gradient(135deg,#00897B,#004D40)" },
  { tag: "AR", label: "Sofa in Your Living Room", gradient: "linear-gradient(135deg,#C8A96E,#7B5E2A)" },
  { tag: "AR", label: "Food AR Menu", gradient: "linear-gradient(135deg,#FF3D00,#7B1D00)" },
  { tag: "Virtual 360", label: "Fashion Boutique Tour", gradient: "linear-gradient(135deg,#5C35D4,#1A0066)" },
  { tag: "Platform", label: "Generative XR Pipeline", gradient: "linear-gradient(135deg,#0D0D0D,#3D3D3D)" },
];

const faqItems: FAQItem[] = [
  {
    tag: "Platform",
    question: "What exactly is Reality Loops and who is it built for?",
    answer: <>Reality Loops is a <strong>Generative XR SaaS platform</strong> — the operating system for immersive commerce. It's built for businesses in food, furniture, and fashion who want to offer their customers 3D product experiences, AR try-on, and virtual 360° spaces — without hiring a 3D team or learning complex software.</>,
  },
  {
    tag: "3D Generation",
    question: "How does the image-to-3D model generation work? Do I need to send a lot of photos?",
    answer: <>Our AI pipeline can generate a production-ready 3D model from <strong>as few as one product photo</strong>. The model infers geometry, depth, and PBR material properties from 2D pixel data. The output is available in <strong>GLB, USDZ, and WebXR</strong> formats, ready to deploy instantly.</>,
  },
  {
    tag: "Virtual 360",
    question: "How does the 4-photo 360° space generation work?",
    answer: <>Upload four photos of a physical space from roughly four directions. Our generative AI stitches them into a fully explorable <strong>360° immersive environment</strong> customers can navigate in their browser. No special camera required — a modern smartphone works perfectly.</>,
  },
  {
    tag: "Integration",
    question: "I already have a website on Shopify / WooCommerce. Do I need to migrate?",
    answer: <><strong>No migration needed.</strong> Our Business API plugs into your existing stack. A few lines of our JavaScript SDK and you have a fully functional 3D/AR viewer embedded in your existing product pages. We support Shopify, WooCommerce, and custom-built sites.</>,
  },
  {
    tag: "AR",
    question: "Does AR require customers to download an app?",
    answer: <><strong>No app required.</strong> All our AR experiences are browser-native WebAR. Customers tap a link on your product page and their camera opens instantly in their browser — on any modern iOS or Android device. Zero friction.</>,
  },
  {
    tag: "Pricing",
    question: "How is Reality Loops priced? Is there a free tier?",
    answer: <>We are currently in <strong>early access</strong> and onboarding select food and furniture businesses as founding partners. Pricing is structured around active 3D models, AR sessions, and API calls. Early access partners receive preferential pricing locked in for life.</>,
  },
  {
    tag: "Services",
    question: "Can you build a fully custom immersive experience using Unity or Unreal?",
    answer: <>Yes. We take on <strong>select bespoke projects</strong> — photorealistic virtual showrooms in Unreal Engine, custom AR apps in Unity, or hand-crafted 3D assets in Blender. These projects directly fund our platform development.</>,
  },
  {
    tag: "Analytics",
    question: "What data does the Business Dashboard track?",
    answer: <>The dashboard gives you real-time and historical AR and 3D commerce performance: <strong>AR session counts, session duration, conversion rate lift</strong> (AR vs non-AR), geographic breakdown, device types, and model-level analytics.</>,
  },
];

/* ── CURSOR HOOK ── */
function useCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMove);

    let raf: number;
    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + "px";
        cursorRef.current.style.top = my + "px";
      }
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top = ry + "px";
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return { cursorRef, ringRef };
}

/* ── CAROUSEL HOOK ── */
function useCarousel(total: number, visible = 4) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const next = () => setIndex(i => Math.min(i + 1, total - visible));
  const prev = () => setIndex(i => Math.max(i - 1, 0));

  useEffect(() => {
    if (!trackRef.current) return;
    const item = trackRef.current.querySelector(".carousel-item") as HTMLElement;
    if (!item) return;
    const w = item.offsetWidth + 24;
    trackRef.current.style.transform = `translateX(-${index * w}px)`;
  }, [index]);

  return { trackRef, next, prev };
}

/* ── CSS ── */
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@300;400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --white:#FFFFFF;--off-white:#F7F6F3;--cream:#F0EDE6;
  --ink:#0D0D0D;--ink-60:rgba(13,13,13,0.6);--ink-30:rgba(13,13,13,0.3);--ink-10:rgba(13,13,13,0.08);
  --accent:#FF3D00;--accent-soft:#FF6B35;--teal:#00C2A8;--gold:#C8A96E;
  --enterprise:#1A1F2E;--enterprise-accent:#3D5AFE;
}
html{scroll-behavior:smooth;}
body{font-family:'DM Sans',sans-serif;background:var(--white);color:var(--ink);overflow-x:hidden;cursor:none;}

/* CURSOR */
.cursor{position:fixed;width:12px;height:12px;background:var(--accent);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.cursor-ring{position:fixed;width:40px;height:40px;border:1px solid var(--ink-30);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);}

/* HEADER */
header{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.96);backdrop-filter:blur(16px);border-bottom:1px solid var(--ink-10);transition:all 0.3s;}
.header-contact-bar{display:flex;align-items:center;justify-content:flex-end;gap:24px;padding:7px 48px;background:var(--ink);border-bottom:1px solid rgba(255,255,255,0.06);}
.header-contact-bar a{font-family:'DM Mono',monospace;font-size:0.68rem;letter-spacing:0.06em;text-decoration:none;display:flex;align-items:center;gap:6px;transition:opacity 0.2s;white-space:nowrap;}
.header-contact-bar a:hover{opacity:0.75;}
.contact-phone{color:rgba(255,255,255,0.6);}
.contact-email{color:var(--teal)!important;background:rgba(0,194,168,0.1);border:1px solid rgba(0,194,168,0.25);padding:3px 12px;border-radius:2px;}
.header-main{display:flex;align-items:center;justify-content:space-between;padding:16px 48px;}
nav{display:flex;gap:28px;align-items:center;}
nav a{font-family:'DM Mono',monospace;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-60);text-decoration:none;transition:color 0.2s;}
nav a:hover{color:var(--ink);}
.nav-about{background:var(--accent)!important;color:#fff!important;padding:8px 18px!important;border-radius:2px;font-family:'Syne',sans-serif!important;font-weight:700!important;font-size:0.75rem!important;letter-spacing:0.02em!important;text-transform:none!important;box-shadow:0 3px 12px rgba(255,61,0,0.3);transition:background 0.2s,box-shadow 0.2s!important;}
.nav-about:hover{background:#d43000!important;box-shadow:0 6px 20px rgba(255,61,0,0.4)!important;}
.logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.2rem;letter-spacing:-0.03em;color:var(--ink);text-decoration:none;}
.logo span{color:var(--accent);}

/* HERO */
.hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:150px 48px 80px;gap:60px;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-200px;right:-200px;width:700px;height:700px;background:radial-gradient(circle,rgba(255,61,0,0.06) 0%,transparent 70%);pointer-events:none;}
.hero-label{font-family:'DM Mono',monospace;font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:24px;display:flex;align-items:center;gap:10px;}
.hero-label::before{content:'';display:block;width:32px;height:1px;background:var(--accent);}
.hero h1{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(3rem,6vw,5.5rem);line-height:0.95;letter-spacing:-0.04em;color:var(--ink);margin-bottom:32px;}
.hero h1 em{font-style:normal;color:var(--accent);}
.hero-sub{font-size:1.05rem;line-height:1.7;color:var(--ink-60);max-width:440px;margin-bottom:48px;font-weight:300;}
.hero-actions{display:flex;gap:16px;align-items:center;}
.hero-stats{display:flex;gap:0;border-top:1px solid var(--ink-10);padding-top:40px;}
.stat{flex:1;}
.stat-num{font-family:'Syne',sans-serif;font-weight:700;font-size:2rem;color:var(--ink);letter-spacing:-0.04em;}
.stat-label{font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-30);margin-top:4px;}

/* BUTTONS */
.btn-primary{background:var(--ink);color:var(--white);padding:16px 32px;font-family:'DM Mono',monospace;font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase;border:none;cursor:pointer;text-decoration:none;display:inline-block;transition:background 0.2s,transform 0.2s;border-radius:2px;}
.btn-primary:hover{background:var(--accent);transform:translateY(-2px);}
.btn-ghost{color:var(--ink);padding:16px 32px;font-family:'DM Mono',monospace;font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase;border:1px solid var(--ink-30);cursor:pointer;text-decoration:none;display:inline-block;transition:border-color 0.2s,transform 0.2s;border-radius:2px;background:none;}
.btn-ghost:hover{border-color:var(--ink);transform:translateY(-2px);}

/* 3D CUBE */
.hero-visual{position:relative;height:560px;display:flex;align-items:center;justify-content:center;}
.model-stage{width:380px;height:380px;position:relative;animation:float 6s ease-in-out infinite;}
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-20px) rotate(3deg);}}
.model-cube{width:220px;height:220px;position:absolute;top:50%;left:50%;transform-style:preserve-3d;transform:translate(-50%,-50%) rotateX(20deg) rotateY(0deg);animation:spin3d 12s linear infinite;}
@keyframes spin3d{from{transform:translate(-50%,-50%) rotateX(20deg) rotateY(0deg);}to{transform:translate(-50%,-50%) rotateX(20deg) rotateY(360deg);}}
.face{position:absolute;width:220px;height:220px;border:1.5px solid rgba(13,13,13,0.15);display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:0.6rem;letter-spacing:0.1em;color:var(--ink-30);}
.face.front{transform:translateZ(110px);background:rgba(255,61,0,0.04);}
.face.back{transform:rotateY(180deg) translateZ(110px);background:rgba(0,194,168,0.04);}
.face.left{transform:rotateY(-90deg) translateZ(110px);background:rgba(200,169,110,0.04);}
.face.right{transform:rotateY(90deg) translateZ(110px);background:rgba(255,61,0,0.04);}
.face.top{transform:rotateX(90deg) translateZ(110px);background:rgba(13,13,13,0.02);}
.face.bottom{transform:rotateX(-90deg) translateZ(110px);background:rgba(13,13,13,0.02);}
.orbit-ring{position:absolute;top:50%;left:50%;border:1px dashed var(--ink-10);border-radius:50%;transform:translate(-50%,-50%) rotateX(75deg);}
.orbit-ring:nth-child(1){width:320px;height:320px;animation:orbitSpin 8s linear infinite;}
.orbit-ring:nth-child(2){width:400px;height:400px;animation:orbitSpin 14s linear infinite reverse;}
@keyframes orbitSpin{from{transform:translate(-50%,-50%) rotateX(75deg) rotateZ(0);}to{transform:translate(-50%,-50%) rotateX(75deg) rotateZ(360deg);}}
.orbit-dot{position:absolute;width:8px;height:8px;background:var(--accent);border-radius:50%;top:-4px;left:50%;margin-left:-4px;}

/* MARQUEE */
.marquee-strip{padding:20px 0;background:var(--accent);overflow:hidden;white-space:nowrap;}
.marquee-track{display:inline-flex;animation:marquee 20s linear infinite;}
@keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.marquee-item{font-family:'Syne',sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--white);padding:0 32px;display:inline-flex;align-items:center;gap:16px;}
.marquee-sep{opacity:0.4;font-size:0.5rem;}

/* SECTION SHARED */
.section-tag{font-family:'DM Mono',monospace;font-size:0.68rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.section-tag::before{content:'';display:inline-block;width:24px;height:1px;background:currentColor;}
.section-title{font-family:'Syne',sans-serif;font-weight:700;font-size:clamp(2rem,4vw,3.2rem);letter-spacing:-0.03em;line-height:1.05;color:var(--ink);}
.section-sub{font-size:1rem;line-height:1.7;color:var(--ink-60);font-weight:300;max-width:520px;margin-top:16px;}

/* VERTICALS */
.verticals-intro{padding:80px 48px 0;display:flex;justify-content:space-between;align-items:flex-end;}
.verticals-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin:40px 48px 0;background:var(--ink-10);}
.vertical-card{background:var(--white);position:relative;overflow:hidden;height:420px;cursor:pointer;transition:transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);}
.vertical-card:hover{z-index:2;transform:scale(1.01);}
.vertical-card-inner{height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:40px;position:relative;}
.vertical-bg{position:absolute;inset:0;transition:transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);}
.vertical-card:hover .vertical-bg{transform:scale(1.05);}
.vertical-card:nth-child(1) .vertical-bg{background:linear-gradient(160deg,#FFF5EE 0%,#FFE4CC 100%);}
.vertical-card:nth-child(2) .vertical-bg{background:linear-gradient(160deg,#F0F4EE 0%,#D8E8D0 100%);}
.vertical-card:nth-child(3) .vertical-bg{background:linear-gradient(160deg,#EEF0F8 0%,#D0D8F0 100%);}
.vertical-icon{font-size:4rem;margin-bottom:24px;position:relative;z-index:1;line-height:1;}
.vertical-name{font-family:'Syne',sans-serif;font-weight:700;font-size:1.8rem;letter-spacing:-0.03em;color:var(--ink);position:relative;z-index:1;}
.vertical-desc{font-size:0.88rem;color:var(--ink-60);margin-top:8px;line-height:1.6;position:relative;z-index:1;font-weight:300;}
.vertical-cta{position:absolute;top:32px;right:32px;width:40px;height:40px;border:1px solid var(--ink-30);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--ink);transition:background 0.2s,border-color 0.2s,color 0.2s;z-index:1;}
.vertical-card:hover .vertical-cta{background:var(--ink);border-color:var(--ink);color:var(--white);}
.vertical-blob{position:absolute;border-radius:50%;opacity:0.4;pointer-events:none;}
.vertical-card:nth-child(1) .vertical-blob{width:200px;height:200px;background:radial-gradient(circle,#FF6B35 0%,transparent 70%);top:-50px;right:-50px;}
.vertical-card:nth-child(2) .vertical-blob{width:200px;height:200px;background:radial-gradient(circle,#00C2A8 0%,transparent 70%);top:-50px;left:-50px;}
.vertical-card:nth-child(3) .vertical-blob{width:200px;height:200px;background:radial-gradient(circle,#3D5AFE 0%,transparent 70%);bottom:-50px;right:-50px;}
.cs-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(13,13,13,0.08);border:1px solid rgba(13,13,13,0.15);padding:5px 14px;border-radius:100px;margin-bottom:12px;width:fit-content;}
.cs-badge-dot{width:6px;height:6px;border-radius:50%;background:#0D0D0D;animation:blink 1.5s infinite;}
.cs-badge-text{font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink);}

/* CAROUSEL */
.carousel-section{padding:100px 48px;background:var(--off-white);}
.carousel-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;}
.carousel-track-wrap{overflow:hidden;position:relative;}
.carousel-track{display:flex;gap:24px;transition:transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);}
.carousel-item{min-width:calc(25% - 18px);aspect-ratio:9/16;border-radius:12px;background:var(--ink-10);position:relative;overflow:hidden;cursor:pointer;flex-shrink:0;}
.carousel-item-bg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}
.carousel-item-label{position:absolute;bottom:28px;left:20px;right:20px;font-family:'Syne',sans-serif;font-weight:600;font-size:1rem;color:rgba(255,255,255,0.95);line-height:1.3;}
.carousel-item-tag{position:absolute;top:20px;left:20px;font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.6);background:rgba(0,0,0,0.2);padding:4px 10px;border-radius:2px;}
.play-btn{width:56px;height:56px;background:rgba(255,255,255,0.2);backdrop-filter:blur(8px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:white;transition:background 0.2s,transform 0.2s;}
.carousel-item:hover .play-btn{background:rgba(255,255,255,0.35);transform:scale(1.1);}
.carousel-nav{display:flex;gap:12px;margin-top:32px;}
.carousel-btn{width:44px;height:44px;border:1px solid var(--ink-30);background:none;border-radius:2px;cursor:pointer;font-size:1rem;transition:background 0.2s,color 0.2s,border-color 0.2s;display:flex;align-items:center;justify-content:center;}
.carousel-btn:hover{background:var(--ink);color:white;border-color:var(--ink);}

/* VIRTUAL 360 */
.virtual360-section{min-height:90vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:100px 48px;gap:80px;background:var(--ink);color:var(--white);}
.virtual360-section .section-tag{color:var(--teal);}
.virtual360-section .section-tag::before{background:var(--teal);}
.virtual360-section .section-title{color:var(--white);}
.virtual360-section .section-sub{color:rgba(255,255,255,0.5);}
.v360-visual{position:relative;height:520px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;}
.room-wrap{perspective:900px;perspective-origin:50% 40%;}
.room{width:320px;height:260px;position:relative;transform-style:preserve-3d;transform:rotateX(30deg) rotateY(-20deg);animation:roomFloat 8s ease-in-out infinite;}
@keyframes roomFloat{0%,100%{transform:rotateX(30deg) rotateY(-20deg) translateY(0);}50%{transform:rotateX(30deg) rotateY(-20deg) translateY(-14px);}}
.room-floor{position:absolute;width:320px;height:260px;bottom:0;left:0;background:linear-gradient(135deg,#1a2a2a 0%,#0f1f1f 100%);transform:rotateX(90deg);transform-origin:bottom center;border:1px solid rgba(0,194,168,0.15);}
.room-floor::after{content:'';position:absolute;inset:0;background:linear-gradient(rgba(0,194,168,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,194,168,0.06) 1px,transparent 1px);background-size:32px 32px;}
.room-back{position:absolute;width:320px;height:260px;top:0;left:0;background:linear-gradient(180deg,#111820 0%,#0d1520 100%);border:1px solid rgba(0,194,168,0.1);}
.room-back::after{content:'';position:absolute;inset:0;background:linear-gradient(rgba(0,194,168,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,194,168,0.04) 1px,transparent 1px);background-size:40px 40px;}
.room-left{position:absolute;width:260px;height:260px;top:0;left:0;background:linear-gradient(90deg,#0a1218 0%,#111820 100%);transform:rotateY(-90deg);transform-origin:left center;border:1px solid rgba(0,194,168,0.08);}
.room-window{position:absolute;width:90px;height:70px;top:48px;left:50%;transform:translateX(-50%);border:2px solid rgba(0,194,168,0.4);background:radial-gradient(ellipse at center,rgba(0,194,168,0.15) 0%,transparent 80%);box-shadow:0 0 20px rgba(0,194,168,0.2),inset 0 0 20px rgba(0,194,168,0.05);}
.room-window::before,.room-window::after{content:'';position:absolute;background:rgba(0,194,168,0.25);}
.room-window::before{width:1px;height:100%;left:50%;}
.room-window::after{height:1px;width:100%;top:50%;}
.room-sofa{position:absolute;bottom:48px;left:50%;transform:translateX(-50%);}
.sofa-base{width:140px;height:36px;background:linear-gradient(180deg,#2a4a5a 0%,#1a3040 100%);border-radius:4px 4px 0 0;border:1px solid rgba(0,194,168,0.2);position:relative;}
.sofa-back{width:140px;height:28px;background:linear-gradient(180deg,#2a4a5a 0%,#1e3848 100%);border-radius:4px 4px 0 0;border:1px solid rgba(0,194,168,0.15);position:absolute;top:-28px;left:0;}
.sofa-leg{width:8px;height:10px;background:#1a3040;position:absolute;bottom:-10px;}
.sofa-leg.l{left:8px;}.sofa-leg.r{right:8px;}
.room-lamp{position:absolute;bottom:40px;right:52px;}
.lamp-pole{width:3px;height:80px;background:rgba(0,194,168,0.5);margin:0 auto;}
.lamp-head{width:24px;height:12px;background:rgba(0,194,168,0.3);border-radius:50% 50% 0 0;margin:0 auto;box-shadow:0 0 16px rgba(0,194,168,0.6),0 0 40px rgba(0,194,168,0.2);}
.lamp-base{width:16px;height:5px;background:rgba(0,194,168,0.3);margin:0 auto;border-radius:2px;}
.room-plant{position:absolute;bottom:40px;left:40px;}
.plant-pot{width:18px;height:16px;background:rgba(200,169,110,0.5);border-radius:0 0 4px 4px;margin:0 auto;}
.plant-stem{width:2px;height:20px;background:rgba(0,194,168,0.4);margin:0 auto;}
.plant-leaf{width:20px;height:20px;background:radial-gradient(circle at 30% 60%,rgba(0,194,168,0.7),rgba(0,100,80,0.4));border-radius:50% 0 50% 0;margin:0 auto;}
.room-dot{position:absolute;width:6px;height:6px;border-radius:50%;background:var(--teal);box-shadow:0 0 8px var(--teal),0 0 16px rgba(0,194,168,0.5);animation:dotPulse 2s ease-in-out infinite;}
.room-dot:nth-child(1){top:30px;left:60px;animation-delay:0s;}
.room-dot:nth-child(2){top:80px;right:80px;animation-delay:0.5s;}
.room-dot:nth-child(3){bottom:60px;left:100px;animation-delay:1s;}
.room-dot:nth-child(4){bottom:100px;right:50px;animation-delay:1.5s;}
@keyframes dotPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.3;transform:scale(0.5);}}
.room-scan{position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(0,194,168,0.06) 50%,transparent 100%);animation:scanSweep 4s linear infinite;pointer-events:none;}
@keyframes scanSweep{from{transform:translateY(-100%);}to{transform:translateY(100%);}}
.v360-steps{margin-top:48px;display:flex;flex-direction:column;gap:20px;}
.v360-step{display:flex;align-items:flex-start;gap:20px;}
.step-num{font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--teal);min-width:28px;margin-top:2px;}
.step-text{font-size:0.95rem;color:rgba(255,255,255,0.6);line-height:1.6;font-weight:300;}
.step-text strong{color:var(--white);font-weight:500;}
.v360-coming-soon{display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;max-width:360px;}
.coming-soon-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(0,194,168,0.4);color:var(--teal);padding:8px 20px;border-radius:100px;font-family:'DM Mono',monospace;font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;background:rgba(0,194,168,0.06);}
.cs-dot{width:6px;height:6px;border-radius:50%;background:var(--teal);animation:blink 1.5s infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
.waitlist-form{display:flex;width:100%;border:1px solid rgba(255,255,255,0.12);border-radius:3px;overflow:hidden;transition:border-color 0.2s;}
.waitlist-form:focus-within{border-color:var(--teal);}
.waitlist-input{flex:1;background:rgba(255,255,255,0.04);border:none;outline:none;padding:14px 18px;font-family:'DM Sans',sans-serif;font-size:0.88rem;color:var(--white);}
.waitlist-input::placeholder{color:rgba(255,255,255,0.25);}
.waitlist-btn{background:var(--teal);border:none;padding:14px 22px;font-family:'DM Mono',monospace;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink);font-weight:700;cursor:pointer;transition:background 0.2s;white-space:nowrap;}
.waitlist-btn:hover{background:#00dfc0;}
.waitlist-note{font-family:'DM Mono',monospace;font-size:0.62rem;color:rgba(255,255,255,0.2);letter-spacing:0.06em;text-align:center;}

/* 3D MODELS */
.models-section{padding:100px 48px;background:var(--cream);}
.models-showcase{margin-top:60px;display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--ink-10);}
.model-card{background:var(--cream);padding:60px 48px;position:relative;overflow:hidden;min-height:360px;display:flex;flex-direction:column;justify-content:flex-end;cursor:pointer;transition:background 0.3s;}
.model-card:hover{background:var(--white);}
.model-card-accent{position:absolute;top:0;right:0;width:200px;height:200px;border-radius:50%;opacity:0.15;pointer-events:none;}
.model-card:nth-child(1) .model-card-accent{background:var(--accent);}
.model-card:nth-child(2) .model-card-accent{background:var(--teal);}
.model-card:nth-child(3) .model-card-accent{background:var(--gold);}
.model-card:nth-child(4) .model-card-accent{background:var(--enterprise-accent);}
.model-card-visual{position:absolute;top:40px;right:40px;font-size:5rem;opacity:0.6;}
.model-card-tag{font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;}
.model-card-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1.5rem;letter-spacing:-0.02em;color:var(--ink);margin-bottom:12px;}
.model-card-desc{font-size:0.88rem;color:var(--ink-60);line-height:1.6;font-weight:300;max-width:340px;}
.ai-badge{display:inline-flex;align-items:center;gap:6px;background:var(--ink);color:var(--white);padding:6px 14px;border-radius:100px;font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;width:fit-content;}
.ai-dot{width:6px;height:6px;background:var(--teal);border-radius:50%;animation:blink 1.5s infinite;}

/* BUSINESS API */
.api-section{padding:100px 48px;background:var(--enterprise);color:var(--white);}
.api-section .section-tag{color:var(--enterprise-accent);}
.api-section .section-tag::before{background:var(--enterprise-accent);}
.api-section .section-title{color:var(--white);}
.api-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:80px;align-items:center;margin-top:60px;}
.api-code-block{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:4px;padding:32px;font-family:'DM Mono',monospace;font-size:0.8rem;line-height:1.8;color:rgba(255,255,255,0.5);overflow-x:auto;}
.code-header{display:flex;align-items:center;gap:8px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.06);}
.code-dot{width:10px;height:10px;border-radius:50%;}
.kw{color:#3D5AFE;}.str{color:#00C2A8;}.fn{color:#C8A96E;}.cm{color:rgba(255,255,255,0.25);}
.api-features{display:flex;flex-direction:column;gap:32px;}
.api-feature{display:flex;gap:20px;align-items:flex-start;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.06);}
.api-feature:last-child{border:none;padding:0;}
.api-feature-icon{width:44px;height:44px;border:1px solid rgba(61,90,254,0.4);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
.api-feature-title{font-family:'Syne',sans-serif;font-weight:600;font-size:1rem;color:var(--white);margin-bottom:6px;}
.api-feature-desc{font-size:0.88rem;color:rgba(255,255,255,0.4);line-height:1.6;font-weight:300;}

/* DASHBOARD */
.dashboard-section{padding:100px 48px;background:var(--off-white);}
.dashboard-preview{margin-top:60px;border:1px solid var(--ink-10);border-radius:6px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,0.1);}
.dash-topbar{background:var(--white);padding:16px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--ink-10);}
.dash-logo-sm{font-family:'Syne',sans-serif;font-weight:700;font-size:0.9rem;color:var(--ink);}
.dash-logo-sm span{color:var(--accent);}
.dash-nav-items{display:flex;gap:24px;}
.dash-nav-item{font-family:'DM Mono',monospace;font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-30);padding:6px 12px;border-radius:2px;cursor:pointer;transition:background 0.15s,color 0.15s;}
.dash-nav-item.active{background:var(--ink);color:var(--white);}
.dash-body{background:var(--off-white);padding:32px;display:grid;grid-template-columns:repeat(3,1fr) 1.5fr;grid-template-rows:auto auto;gap:16px;}
.dash-metric{background:var(--white);padding:24px;border-radius:4px;border:1px solid var(--ink-10);}
.dash-metric-label{font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-30);margin-bottom:8px;}
.dash-metric-value{font-family:'Syne',sans-serif;font-weight:700;font-size:2rem;color:var(--ink);letter-spacing:-0.04em;}
.dash-metric-change{font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--teal);margin-top:4px;}
.dash-chart{background:var(--white);padding:24px;border-radius:4px;border:1px solid var(--ink-10);grid-column:span 3;}
.dash-chart-title{font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-30);margin-bottom:20px;}
.mini-chart{display:flex;align-items:flex-end;gap:6px;height:80px;}
.bar{flex:1;background:var(--ink-10);border-radius:2px;position:relative;}
.bar::after{content:'';position:absolute;bottom:0;left:0;right:0;height:var(--h,0%);background:var(--accent);border-radius:2px;transition:height 0.5s;}
.bar:hover::after{background:var(--ink);}
.dash-activity{background:var(--white);padding:24px;border-radius:4px;border:1px solid var(--ink-10);grid-row:span 2;}
.activity-title{font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-30);margin-bottom:20px;}
.activity-item{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--ink-10);}
.activity-item:last-child{border:none;}
.activity-dot{width:8px;height:8px;border-radius:50%;background:var(--teal);margin-top:4px;flex-shrink:0;}
.activity-dot.orange{background:var(--accent);}
.activity-dot.blue{background:var(--enterprise-accent);}
.activity-text{font-size:0.82rem;color:var(--ink-60);line-height:1.5;}
.activity-text strong{color:var(--ink);font-weight:500;}
.activity-time{font-family:'DM Mono',monospace;font-size:0.62rem;color:var(--ink-30);margin-top:2px;}

/* SERVICES */
.services-intro{padding:100px 48px 60px;background:var(--white);border-top:1px solid var(--ink-10);}
.services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--ink-10);margin:0 48px;}
.service-card{background:var(--white);padding:60px 48px;position:relative;overflow:hidden;min-height:400px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:background 0.3s;}
.service-card:hover{background:var(--ink);}
.service-card:hover .service-name,.service-card:hover .service-label,.service-card:hover .service-desc{color:var(--white);}
.service-card:hover .service-label{color:rgba(255,255,255,0.4);}
.service-card:hover .service-desc{color:rgba(255,255,255,0.5);}
.service-visual{font-size:5rem;margin-bottom:48px;transition:transform 0.4s;line-height:1;}
.service-card:hover .service-visual{transform:scale(1.1) rotate(-5deg);}
.service-label{font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-30);margin-bottom:12px;transition:color 0.3s;}
.service-name{font-family:'Syne',sans-serif;font-weight:700;font-size:2rem;letter-spacing:-0.03em;color:var(--ink);margin-bottom:16px;transition:color 0.3s;}
.service-desc{font-size:0.88rem;color:var(--ink-60);line-height:1.7;font-weight:300;transition:color 0.3s;max-width:280px;}
.service-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:32px;}
.service-tag{padding:4px 12px;border:1px solid currentColor;border-radius:100px;font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:0.06em;color:var(--ink-30);transition:color 0.3s,border-color 0.3s;}
.service-card:hover .service-tag{color:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.2);}

/* FAQ */
.faq-section{padding:100px 48px;background:var(--white);border-top:1px solid var(--ink-10);}
.faq-layout{display:grid;grid-template-columns:1fr 1.8fr;gap:80px;margin-top:60px;align-items:start;}
.faq-sticky{position:sticky;top:100px;}
.faq-cta-block{margin-top:40px;padding:32px;background:var(--ink);border-radius:4px;}
.faq-cta-block p{font-size:0.9rem;color:rgba(255,255,255,0.5);line-height:1.6;font-weight:300;margin-bottom:20px;}
.faq-list{display:flex;flex-direction:column;}
.faq-item{border-bottom:1px solid var(--ink-10);overflow:hidden;}
.faq-question{width:100%;background:none;border:none;padding:28px 0;display:flex;justify-content:space-between;align-items:center;gap:24px;cursor:pointer;text-align:left;}
.faq-q-text{font-family:'Syne',sans-serif;font-weight:600;font-size:1.05rem;color:var(--ink);letter-spacing:-0.01em;line-height:1.3;transition:color 0.2s;}
.faq-item.open .faq-q-text{color:var(--accent);}
.faq-icon{width:32px;height:32px;border:1px solid var(--ink-10);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--ink-30);flex-shrink:0;transition:background 0.3s,color 0.3s,border-color 0.3s,transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);line-height:1;}
.faq-item.open .faq-icon{background:var(--accent);border-color:var(--accent);color:var(--white);transform:rotate(45deg);}
.faq-answer{max-height:0;overflow:hidden;transition:max-height 0.5s cubic-bezier(0.25,0.46,0.45,0.94);}
.faq-item.open .faq-answer{max-height:400px;}
.faq-answer-inner{padding:0 0 28px;font-size:0.95rem;color:var(--ink-60);line-height:1.75;font-weight:300;max-width:580px;}
.faq-answer-inner strong{color:var(--ink);font-weight:500;}
.faq-tag{display:inline-block;font-family:'DM Mono',monospace;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);background:rgba(255,61,0,0.06);padding:3px 10px;border-radius:100px;margin-bottom:10px;}

/* FOOTER */
footer{background:var(--ink);color:var(--white);padding:80px 48px 40px;}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,0.08);}
.footer-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.4rem;letter-spacing:-0.03em;color:var(--white);margin-bottom:16px;}
.footer-logo span{color:var(--accent);}
.footer-tagline{font-size:0.88rem;color:rgba(255,255,255,0.35);line-height:1.6;font-weight:300;max-width:280px;}
.footer-col-title{font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:20px;}
.footer-links{display:flex;flex-direction:column;gap:12px;}
.footer-links a{font-size:0.9rem;color:rgba(255,255,255,0.55);text-decoration:none;transition:color 0.2s;}
.footer-links a:hover{color:var(--white);}
.footer-bottom{padding-top:32px;display:flex;justify-content:space-between;align-items:center;}
.footer-copy{font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.06em;color:rgba(255,255,255,0.2);}
.footer-socials{display:flex;gap:16px;}
.social-link{width:36px;height:36px;border:1px solid rgba(255,255,255,0.12);border-radius:2px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);text-decoration:none;font-size:0.9rem;transition:all 0.2s;}
.social-link:hover{background:var(--accent);border-color:var(--accent);color:white;}

/* REVEAL ANIMATION */
.reveal{animation:fadeUp 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both;}
.reveal-delay-1{animation-delay:0.08s;}
.reveal-delay-2{animation-delay:0.16s;}
.reveal-delay-3{animation-delay:0.24s;}
.reveal-delay-4{animation-delay:0.32s;}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:none;}}

/* RESPONSIVE */
@media(max-width:900px){
  .hero,.virtual360-section{grid-template-columns:1fr;}
  .hero{padding:120px 24px 60px;}
  .hero-visual{display:none;}
  .verticals-grid,.services-grid{grid-template-columns:1fr;}
  .models-showcase{grid-template-columns:1fr;}
  .api-grid{grid-template-columns:1fr;}
  header{padding:0;}
  .header-contact-bar{padding:7px 24px;}
  .header-main{padding:12px 24px;}
  .verticals-intro,.carousel-header{flex-direction:column;align-items:flex-start;gap:20px;}
  nav{display:none;}
  .footer-top{grid-template-columns:1fr 1fr;gap:40px;}
  .faq-layout{grid-template-columns:1fr;gap:40px;}
  .faq-sticky{position:static;}
  .carousel-item{min-width:calc(50% - 12px);}
  .carousel-section,.virtual360-section,.api-section,.dashboard-section,.services-intro{padding:60px 24px;}
  .verticals-intro,.models-section,.faq-section{padding:60px 24px;}
  .services-grid{margin:0 24px;}
  .dash-body{grid-template-columns:1fr!important;grid-template-rows:auto!important;padding:16px!important;}
  .dash-chart{grid-column:span 1!important;}
  .dash-activity{grid-row:span 1!important;}
}
@media(max-width:600px){
  .header-contact-bar{flex-direction:column;align-items:center;gap:8px;padding:8px 16px;text-align:center;}
  .header-main{padding:12px 16px;}
  .logo{font-size:1rem;}
  .footer-top{grid-template-columns:1fr!important;gap:30px;}
  .footer-bottom{flex-direction:column;gap:20px;text-align:center;}
  .hero-actions{flex-direction:column;width:100%;gap:12px;}
  .hero-actions a{width:100%;text-align:center;}
  .carousel-item{min-width:100%!important;}
  .waitlist-form{flex-direction:column;border:none!important;}
  .waitlist-input{border:1px solid rgba(255,255,255,0.12)!important;border-radius:3px;margin-bottom:8px;width:100%;}
  .waitlist-btn{border-radius:3px;width:100%;text-align:center;}
}
`;

/* ── SUB-COMPONENTS ── */

function Cursor() {
  const { cursorRef, ringRef } = useCursor();
  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}

function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return;
      headerRef.current.style.boxShadow = window.scrollY > 60
        ? "0 4px 24px rgba(0,0,0,0.08)" : "";
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={headerRef}>
      <div className="header-contact-bar">
        <a href="tel:+917602548747" className="contact-phone">📞 +91 76025-48747</a>
        <a href="mailto:connect@realityloops.in" className="contact-email">✉ connect@realityloops.in</a>
      </div>
      <div className="header-main">
        <a href="#" className="logo">Reality<span>.</span>Loops</a>
        <nav className="hidden md:flex">
          <a href="#api">API</a>
          <a href="#services">Services</a>
          <a href="#about" className="nav-about">About Us</a>
        </nav>
        {/* Mobile menu toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer font-bold text-lg select-none focus:outline-none"
          aria-label="Toggle navigation"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 flex flex-col p-4 gap-4">
          <a
            href="#api"
            onClick={() => setIsOpen(false)}
            className="text-xs font-semibold text-gray-600 py-2 border-b border-gray-50 uppercase tracking-widest font-mono text-center"
          >
            API
          </a>
          <a
            href="#services"
            onClick={() => setIsOpen(false)}
            className="text-xs font-semibold text-gray-600 py-2 border-b border-gray-50 uppercase tracking-widest font-mono text-center"
          >
            Services
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="nav-about text-center w-full py-2.5 rounded shadow-sm text-sm font-bold text-white select-none block"
            style={{ textDecoration: 'none' }}
          >
            About Us
          </a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="hero">
      <div>
        <div className="hero-label reveal">Generative XR Platform</div>
        <h1 className="reveal reveal-delay-1">
          The <em>Operating System</em> for Immersive Commerce
        </h1>
        <p className="hero-sub reveal reveal-delay-2">
          Deploy spatial storefronts, 3D catalogs, and AR experiences as effortlessly as uploading a 2D image. Reality Loops is where commerce goes spatial.
        </p>
        <div className="hero-actions reveal reveal-delay-3">
          <a href="#saas" className="btn-primary">Explore Platform</a>
          <a href="#api" className="btn-ghost">View API Docs</a>
        </div>
        <div className="hero-stats reveal reveal-delay-4">
          <div className="stat">
            <div className="stat-num">3D</div>
            <div className="stat-label">From single image</div>
          </div>
          <div className="stat">
            <div className="stat-num">360°</div>
            <div className="stat-label">4-photo generation</div>
          </div>
          <div className="stat">
            <div className="stat-num">AR</div>
            <div className="stat-label">Any device, no app</div>
          </div>
        </div>
      </div>
      <div className="hero-visual reveal reveal-delay-2">
        <div className="model-stage">
          <div className="orbit-ring"><div className="orbit-dot" /></div>
          <div className="orbit-ring"><div className="orbit-dot" /></div>
          <div className="model-cube">
            <div className="face front">FRONT</div>
            <div className="face back">BACK</div>
            <div className="face left">LEFT</div>
            <div className="face right">RIGHT</div>
            <div className="face top">TOP</div>
            <div className="face bottom">BOT</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Immersive Commerce", "3D Storefronts", "AR Try-On", "360° Spaces", "Generative XR", "Image to 3D", "Spatial Computing", "WebAR Platform"];
  const doubled = [...items, ...items];
  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            {item} <span className="marquee-sep">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Verticals() {
  return (
    <div id="saas">
      <div className="verticals-intro">
        <div>
          <div className="section-tag reveal">SaaS Platform</div>
          <h2 className="section-title reveal reveal-delay-1">Built for real industries.<br />Deployable in minutes.</h2>
        </div>
        <p className="section-sub reveal reveal-delay-2">We've gone deep on food, furniture, and fashion — so you don't have to figure it out alone.</p>
      </div>
      <div className="verticals-grid">
        {/* Food */}
        <Link href="/restaurant" className="vertical-card reveal">
          <div className="vertical-bg" />
          <div className="vertical-blob" />
          <div className="vertical-card-inner">
            <div className="vertical-icon">🍜</div>
            <div className="vertical-name">Food</div>
            <div className="vertical-desc">Give every dish a 360° presence. Customers explore your menu spatially before they order — boosting confidence and conversion.</div>
          </div>
          <div className="vertical-cta">↗</div>
        </Link>
        {/* Furniture */}
        <Link href="/furniture" className="vertical-card reveal reveal-delay-1">
          <div className="vertical-bg" />
          <div className="vertical-blob" />
          <div className="vertical-card-inner">
            <div className="vertical-icon">🛋️</div>
            <div className="vertical-name">Furniture</div>
            <div className="vertical-desc">Let customers place your products in their space with AR. Reduce returns. Build trust at the moment of decision.</div>
          </div>
          <div className="vertical-cta">↗</div>
        </Link>
        {/* Fashion */}
        <Link href="/fashion" className="vertical-card reveal reveal-delay-2 cursor-pointer">
          <div className="vertical-bg" />
          <div className="vertical-blob" />
          <div className="vertical-card-inner">
            <div className="vertical-icon">👗</div>
            <div className="cs-badge">
              <div className="cs-badge-dot" />
              <span className="cs-badge-text">Coming Soon</span>
            </div>
            <div className="vertical-name">Fashion</div>
            <div className="vertical-desc">Virtual try-on powered by AR. Shoppers see how it fits — no changing room required. Full VTO support launching soon.</div>
          </div>
          <div className="vertical-cta">↗</div>
        </Link>
        {/* RealityForge */}
        <Link href="/forge" className="vertical-card reveal reveal-delay-3 cursor-pointer">
          <div className="vertical-bg" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))' }} />
          <div className="vertical-blob" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)' }} />
          <div className="vertical-card-inner">
            <div className="vertical-icon">✨</div>
            <div className="cs-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
              <div className="cs-badge-dot animate-pulse" style={{ background: '#10b981' }} />
              <span className="cs-badge-text">NEW</span>
            </div>
            <div className="vertical-name">RealityForge 3D</div>
            <div className="vertical-desc">Create Any AR Experience. Upload an image or snap a photo, compile your 3D asset using our C++ engine, and share your AR instantly with the world.</div>
          </div>
          <div className="vertical-cta" style={{ color: '#10b981' }}>↗</div>
        </Link>
      </div>
    </div>

  );
}

function VideoCarousel({ items, id, bg, tag, title }: {
  items: CarouselItem[];
  id: string;
  bg?: string;
  tag: string;
  title: string;
}) {
  const { trackRef, next, prev } = useCarousel(items.length, 4);
  return (
    <section className="carousel-section" id={id} style={bg ? { background: bg } : undefined}>
      <div className="carousel-header">
        <div>
          <div className="section-tag reveal">{tag}</div>
          <h2 className="section-title reveal reveal-delay-1">{title}</h2>
        </div>
        <div className="carousel-nav">
          <button className="carousel-btn" onClick={prev}>←</button>
          <button className="carousel-btn" onClick={next}>→</button>
        </div>
      </div>
      <div className="carousel-track-wrap">
        <div className="carousel-track" ref={trackRef}>
          {items.map((item, i) => (
            <div className="carousel-item" key={i}>
              <div className="carousel-item-bg" style={{ background: item.gradient }}>
                <div className="play-btn">▶</div>
              </div>
              <div className="carousel-item-tag">{item.tag}</div>
              <div className="carousel-item-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Virtual360() {
  return (
    <section className="virtual360-section" id="virtual360">
      <div>
        <div className="section-tag reveal">Generative XR</div>
        <h2 className="section-title reveal reveal-delay-1">Four photos.<br />One immersive world.</h2>
        <p className="section-sub reveal reveal-delay-2">Our flagship AI feature turns any space into a fully explorable 360° environment. No photogrammetry rig. No 3D artist. Just four photos and our engine does the rest.</p>
        <div className="v360-steps reveal reveal-delay-3">
          {[
            ["01", <><strong>Upload four photos</strong> of your space from any angle</>],
            ["02", <>Our <strong>generative AI stitches</strong> a fully immersive 360° scene</>],
            ["03", <><strong>Embed instantly</strong> in your storefront or share as a link</>],
            ["04", <>Customers <strong>explore spatially</strong> from any device, no app needed</>],
          ].map(([num, text], i) => (
            <div className="v360-step" key={i}>
              <div className="step-num">{num as string}</div>
              <div className="step-text">{text as React.ReactNode}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="v360-visual reveal reveal-delay-2">
        <div className="room-wrap">
          <div className="room">
            <div className="room-back">
              <div className="room-window" />
              <div className="room-dot" />
              <div className="room-dot" />
              <div className="room-dot" />
              <div className="room-dot" />
              <div className="room-scan" />
            </div>
            <div className="room-floor" />
            <div className="room-left" />
            <div className="room-sofa">
              <div className="sofa-back" />
              <div className="sofa-base">
                <div className="sofa-leg l" />
                <div className="sofa-leg r" />
              </div>
            </div>
            <div className="room-lamp">
              <div className="lamp-head" />
              <div className="lamp-pole" />
              <div className="lamp-base" />
            </div>
            <div className="room-plant">
              <div className="plant-leaf" />
              <div className="plant-stem" />
              <div className="plant-pot" />
            </div>
          </div>
        </div>
        <div className="v360-coming-soon reveal reveal-delay-3">
          <div className="coming-soon-badge">
            <div className="cs-dot" />
            Coming Soon
          </div>
          <div className="waitlist-form">
            <input className="waitlist-input" type="email" placeholder="your@email.com" />
            <button className="waitlist-btn">Notify Me</button>
          </div>
          <div className="waitlist-note">Be first when Virtual 360° goes live. No spam, ever.</div>
        </div>
      </div>
    </section>
  );
}

function Models() {
  const cards = [
    { visual: "📸", tag: "Input", title: "Single Image Upload", desc: "Just one product photo. Our model understands depth, material, and geometry from 2D pixel data.", showBadge: true },
    { visual: "🔮", tag: "Processing", title: "Geometry Generation", desc: "Mesh creation, UV unwrapping, PBR material inference — all automated in seconds, not hours.", showBadge: false },
    { visual: "📦", tag: "Output", title: "3D + AR Ready", desc: "GLB, USDZ, and WebXR formats — deployable instantly on any platform or embedded via our API.", showBadge: false },
    { visual: "🗂️", tag: "Scale", title: "Bulk Catalog Conversion", desc: "Send your entire 2D catalog through our API. Receive a fully 3D-enabled storefront. No manual work.", showBadge: false },
  ];
  return (
    <section className="models-section" id="models">
      <div className="section-tag reveal">Generative AI</div>
      <h2 className="section-title reveal reveal-delay-1">Image in.<br />3D out.</h2>
      <p className="section-sub reveal reveal-delay-2">Our AI pipeline converts product photography into production-ready 3D models — with full AR tracking and custom textures baked in.</p>
      <div className="models-showcase">
        {cards.map((c, i) => (
          <div className={`model-card reveal${i > 0 ? ` reveal-delay-${i}` : ""}`} key={i}>
            <div className="model-card-accent" />
            <div className="model-card-visual">{c.visual}</div>
            <div>
              {c.showBadge && <div className="ai-badge"><div className="ai-dot" /> AI Powered</div>}
              <div className="model-card-tag">{c.tag}</div>
              <div className="model-card-title">{c.title}</div>
              <div className="model-card-desc">{c.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BusinessAPI() {
  return (
    <section className="api-section" id="api">
      <div className="section-tag reveal">Enterprise</div>
      <h2 className="section-title reveal reveal-delay-1">Plug XR into<br />your existing store.</h2>
      <p className="section-sub reveal reveal-delay-2" style={{ color: "rgba(255,255,255,0.4)" }}>
        Already have a website? Our API layer connects directly to your product catalog — no platform migration needed.
      </p>
      <div className="api-grid">
        <div className="reveal reveal-delay-1">
          <div className="api-code-block">
            <div className="code-header">
              <div className="code-dot" style={{ background: "#FF5F56" }} />
              <div className="code-dot" style={{ background: "#FFBD2E" }} />
              <div className="code-dot" style={{ background: "#27C93F" }} />
            </div>
            <span className="cm">{"// Initialize Reality Loops"}</span><br />
            <span className="kw">import</span>{" { RealityLoops } "}<span className="kw">from</span>{" "}<span className="str">'@reality-loops/sdk'</span><br /><br />
            <span className="kw">const</span>{" rl = "}<span className="kw">new</span>{" "}<span className="fn">RealityLoops</span>{"({"}<br />
            {"  apiKey: "}<span className="str">'rl_live_...'</span>,<br />
            {"  mode: "}<span className="str">'ar'</span><br />
            {"})"}<br /><br />
            <span className="cm">{"// Convert a product to 3D"}</span><br />
            <span className="kw">const</span>{" model = "}<span className="kw">await</span>{" rl."}<span className="fn">generate3D</span>{"({"}<br />
            {"  imageUrl: product.thumbnail,"}<br />
            {"  format: ["}<span className="str">'glb'</span>{", "}<span className="str">'usdz'</span>{"],"}<br />
            {"  arTracking: "}<span className="kw">true</span><br />
            {"})"}<br /><br />
            <span className="cm">{"// Embed AR viewer"}</span><br />
            {"rl."}<span className="fn">embed</span>{"(model, "}<span className="str">'#product-viewer'</span>{")"}
          </div>
        </div>
        <div className="api-features reveal reveal-delay-2">
          {[
            { icon: "⚡", title: "Instant Integration", desc: "Drop our SDK into any website. Works with Shopify, WooCommerce, custom stacks — anywhere JavaScript runs." },
            { icon: "🎯", title: "Custom AR Tracking", desc: "Surface-aware placement, scale calibration, and lighting estimation built into every model we generate." },
            { icon: "📊", title: "Real-Time Analytics", desc: "Track every AR session — how long, what products, which angles — piped directly to your dashboard." },
            { icon: "🔒", title: "Enterprise Security", desc: "SOC2-ready infrastructure. Data stays yours. White-label options available for agency deployments." },
          ].map((f, i) => (
            <div className="api-feature" key={i}>
              <div className="api-feature-icon">{f.icon}</div>
              <div>
                <div className="api-feature-title">{f.title}</div>
                <div className="api-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dashboard() {
  const bars = [40, 55, 45, 70, 60, 80, 75, 90, 85, 100, 88, 95];
  return (
    <section className="dashboard-section" id="dashboard">
      <div className="section-tag reveal">Analytics</div>
      <h2 className="section-title reveal reveal-delay-1">Your AR performance,<br />at a glance.</h2>
      <p className="section-sub reveal reveal-delay-2">The Business Dashboard gives you a real-time view into how customers interact with your spatial commerce experience.</p>
      <div style={{ marginTop: "32px" }} className="reveal reveal-delay-3">
        <a
          href="https://realityloopsio.flutterflow.app/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "12px",
            background: "linear-gradient(135deg,#FF3D00,#FF6B35)",
            color: "#fff", padding: "16px 32px", borderRadius: "3px",
            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem",
            textDecoration: "none",
            boxShadow: "0 8px 32px rgba(255,61,0,0.35)",
            transition: "transform 0.2s,box-shadow 0.2s",
          }}
          onMouseOver={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 16px 48px rgba(255,61,0,0.45)";
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(255,61,0,0.35)";
          }}
        >
          <span>Open Live Dashboard</span>
          <span style={{ fontSize: "1.1rem", fontWeight: 400 }}>↗</span>
        </a>
      </div>
      <div className="dashboard-preview reveal reveal-delay-2">
        <div className="dash-topbar">
          <div className="dash-logo-sm">Reality<span>.</span>Loops</div>
          <div className="dash-nav-items">
            {["Overview", "AR Sessions", "Models", "Conversions"].map((n, i) => (
              <div key={n} className={`dash-nav-item${i === 0 ? " active" : ""}`}>{n}</div>
            ))}
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.65rem", color: "var(--ink-30)" }}>Last 30 days ▾</div>
        </div>
        <div className="dash-body">
          {[
            { label: "AR Sessions", value: "14,832", change: "↑ 23% vs last month" },
            { label: "Avg. Session Time", value: "2m 41s", change: "↑ 11% vs last month" },
            { label: "3D Models Active", value: "247", change: "↑ 38 new this month" },
          ].map(m => (
            <div className="dash-metric" key={m.label}>
              <div className="dash-metric-label">{m.label}</div>
              <div className="dash-metric-value">{m.value}</div>
              <div className="dash-metric-change">{m.change}</div>
            </div>
          ))}
          <div className="dash-metric" style={{ gridRow: "span 2", background: "var(--ink)", borderColor: "transparent" }}>
            <div className="dash-metric-label" style={{ color: "rgba(255,255,255,0.3)" }}>AR Conversion Rate</div>
            <div className="dash-metric-value" style={{ color: "white", fontSize: "3rem" }}>4.2x</div>
            <div className="dash-metric-change">Higher than non-AR sessions</div>
            <div style={{ marginTop: "16px", fontSize: "0.82rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, fontWeight: 300 }}>
              Customers who interact with AR are 4.2x more likely to complete a purchase.
            </div>
          </div>
          <div className="dash-chart">
            <div className="dash-chart-title">AR Sessions — Last 30 days</div>
            <div className="mini-chart">
              {bars.map((h, i) => (
                <div key={i} className="bar" style={{ "--h": `${h}%` } as React.CSSProperties} />
              ))}
            </div>
          </div>
          <div className="dash-activity">
            <div className="activity-title">Live Activity</div>
            {[
              { dot: "", text: <><strong>Sofa Grande 3-Seater</strong> placed in AR by visitor</>, time: "Just now" },
              { dot: "orange", text: <><strong>Margherita Pizza</strong> 3D model viewed — 1m 20s</>, time: "2 mins ago" },
              { dot: "blue", text: <>New 3D model generated: <strong>Oak Dining Chair</strong></>, time: "5 mins ago" },
              { dot: "", text: <><strong>3 new AR sessions</strong> started in last minute</>, time: "6 mins ago" },
              { dot: "orange", text: <><strong>Checkout completed</strong> after AR session — ₹4,200</>, time: "9 mins ago" },
            ].map((a, i) => (
              <div className="activity-item" key={i}>
                <div className={`activity-dot${a.dot ? " " + a.dot : ""}`} />
                <div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const cards = [
    {
      visual: "🎮", label: "Real-Time 3D Engine", name: "Unity",
      desc: "Interactive 3D product experiences, AR applications, and immersive showrooms built on the world's most widely deployed real-time engine.",
      tags: ["WebGL", "AR Foundation", "Mobile", "WebXR"],
    },
    {
      visual: "⚡", label: "Cinematic XR", name: "Unreal Engine",
      desc: "Photorealistic virtual showrooms and configurators. When only the highest visual fidelity will do — for luxury brands and flagship launches.",
      tags: ["Pixel Streaming", "Nanite", "Lumen"],
    },
    {
      visual: "🌐", label: "Web-Based AR", name: "WebAR & Blender",
      desc: "Browser-native AR experiences — no app required. Hand-crafted 3D assets from Blender, deployed via 8thWall, Zappar, or our own WebXR stack.",
      tags: ["8thWall", "Zappar", "Three.js", "Blender"],
    },
  ];
  return (
    <div id="services">
      <div className="services-intro">
        <div className="section-tag reveal">Services</div>
        <h2 className="section-title reveal reveal-delay-1">Bespoke immersive builds.<br />Enterprise grade.</h2>
        <p className="section-sub reveal reveal-delay-2">While we scale the platform, we partner with select clients for high-impact immersive projects — using the same industry-standard tools powering the biggest XR experiences globally.</p>
      </div>
      <div className="services-grid">
        {cards.map((c, i) => (
          <div key={i} className={`service-card reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}>
            <div>
              <div className="service-visual">{c.visual}</div>
              <div className="service-label">{c.label}</div>
              <div className="service-name">{c.name}</div>
              <div className="service-desc">{c.desc}</div>
              <div className="service-tags">
                {c.tags.map(t => <span key={t} className="service-tag">{t}</span>)}
              </div>
            </div>
            <div style={{ marginTop: "auto", paddingTop: "32px" }}>
              <a href="#" className="btn-ghost">Discuss Project</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen(prev => prev === i ? null : i);

  return (
    <section className="faq-section" id="faq">
      <div className="section-tag reveal">FAQ</div>
      <div className="faq-layout">
        <div className="faq-sticky reveal">
          <h2 className="section-title">Everything you<br />want to know.</h2>
          <p className="section-sub">Can't find your answer? We're happy to talk through your specific use case.</p>
          <div className="faq-cta-block">
            <p>Have a specific project in mind or want a custom demo for your business?</p>
            <a href="mailto:connect@realityloops.in" className="btn-primary" style={{ background: "var(--accent)" }}>
              Talk to Us
            </a>
          </div>
        </div>
        <div className="faq-list reveal reveal-delay-1">
          {faqItems.map((item, i) => (
            <div key={i} className={`faq-item${open === i ? " open" : ""}`}>
              <button className="faq-question" onClick={() => toggle(i)}>
                <div>
                  <div className="faq-tag">{item.tag}</div>
                  <div className="faq-q-text">{item.question}</div>
                </div>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const [blogHover, setBlogHover] = useState(false);
  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="footer-logo">Reality<span>.</span>Loops</div>
          <div className="footer-tagline">The operating system for immersive commerce. Built for merchants who want spatial — without the complexity.</div>
        </div>
        {[
          { title: "Platform", links: ["3D Storefronts", "Virtual 360", "AR Try-On", "3D Generation", "Analytics"] },
          { title: "Verticals", links: ["Food & Restaurant", "Furniture & Decor", "Fashion & Apparel", "Enterprise API"] },
          { title: "Services", links: ["Unity Development", "Unreal Engine", "WebAR & Blender", "Contact"] },
        ].map(col => (
          <div key={col.title}>
            <div className="footer-col-title">{col.title}</div>
            <div className="footer-links">
              {col.links.map(l => <a key={l} href="#">{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2025 Reality Loops. All rights reserved.</div>
        <a
          href="#"
          onMouseOver={() => setBlogHover(true)}
          onMouseOut={() => setBlogHover(false)}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "linear-gradient(135deg,#3D5AFE,#00C2A8)",
            color: "#fff", padding: "10px 24px", borderRadius: "3px",
            fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem",
            textDecoration: "none",
            boxShadow: blogHover ? "0 8px 28px rgba(61,90,254,0.5)" : "0 4px 20px rgba(61,90,254,0.35)",
            transform: blogHover ? "translateY(-2px)" : "none",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          Blog ↗
        </a>
        <div className="footer-socials">
          {["𝕏", "in", "⬡"].map(s => <a key={s} href="#" className="social-link">{s}</a>)}
        </div>
      </div>
    </footer>
  );
}

/* ── ROOT ── */
export default function RealityLoops() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Verticals />
        <VideoCarousel
          items={carousel1Items}
          id="carousel"
          tag="Showcase Reel"
          title="See it in action."
        />
        <Virtual360 />
        <VideoCarousel
          items={carousel2Items}
          id="carousel2"
          bg="var(--cream)"
          tag="360° & AR Demos"
          title="Spatial in every direction."
        />
        <Models />
        <BusinessAPI />
        <Dashboard />
        <Services />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
