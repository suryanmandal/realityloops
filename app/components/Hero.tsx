"use client";
import React, { useState, useEffect, JSX } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Slide {
  title: string;
  desc: string;
  button: string;
  img: string;
  bg: string;
  btnColor: string;
}

export default function Hero(): JSX.Element {
  
  const slides: Slide[] = [
    {
      title: "Create Stunning AR Experiences",
      desc: "Transform your ideas into immersive augmented reality with our professional AR development services",
      button: "Get Started",
      img: "/ar-image.jpg",
      bg: "from-purple-600 via-blue-600 to-teal-500",
      btnColor: "text-purple-600",
    },
    {
      title: "VR Worlds That Amaze",
      desc: "Build captivating virtual reality environments that transport users to extraordinary digital realms",
      button: "Explore VR",
      img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500&h=300&fit=crop&crop=center",
      bg: "from-pink-500 via-red-500 to-orange-500",
      btnColor: "text-pink-600",
    },
    {
      title: "Metaverse Ready Assets",
      desc: "Premium 3D models, avatars, and environments optimized for the next generation of digital experiences",
      button: "Browse Assets",
      img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=500&h=300&fit=crop&crop=center",
      bg: "from-green-500 via-teal-500 to-blue-500",
      btnColor: "text-green-600",
    },
  ];

  const [current, setCurrent] = useState<number>(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = (): void => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = (): void =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          {/* Slides Container */}
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`min-w-full flex items-center bg-gradient-to-r ${slide.bg} h-[24rem] sm:h-[26rem] md:h-[28rem]`}
              >
                <div className="w-full px-6 md:px-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Text Section */}
                    <div className="text-white">
                      <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl mb-6 opacity-90">
                        {slide.desc}
                      </p>
                      <button
                        className={`bg-white ${slide.btnColor} px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition`}
                      >
                        {slide.button}
                      </button>
                    </div>

                    {/* Image Section */}
                    <div className="hidden lg:block">
                      <img
                        src={slide.img}
                        alt={slide.title}
                        className="rounded-lg shadow-2xl w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
          >
            <FaChevronRight />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === i
                    ? "bg-white bg-opacity-90 scale-110"
                    : "bg-white bg-opacity-50 hover:bg-opacity-75"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
