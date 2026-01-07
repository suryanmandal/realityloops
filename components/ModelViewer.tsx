'use client';

import { useEffect, useRef } from 'react';

interface ModelViewerProps {
  src: string;
  title: string;
  price: number;
  description: string;
}

const ModelViewerComponent = ({ src, title, price, description }: ModelViewerProps) => {
  const modelViewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load the model-viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
    script.async = true;
    document.head.appendChild(script);

    // Wait for the script to load
    script.onload = () => {
      // Wait a bit more to ensure the custom element is registered
      setTimeout(() => {
        if (modelViewerRef.current) {
          // Initialize the AR button functionality
          const viewer = modelViewerRef.current.querySelector('model-viewer');
          if (viewer) {
            const arButton = modelViewerRef.current.querySelector('#ar-button') as HTMLElement;
            
            // Function to check AR support and show button
            const checkAR = () => {
              // @ts-ignore - model-viewer adds this property
              if (viewer.canActivateAR) {
                arButton?.classList.add('opacity-100', 'visible');
                arButton?.classList.remove('opacity-0', 'invisible');
              } else {
                arButton?.classList.remove('opacity-100', 'visible');
                arButton?.classList.add('opacity-0', 'invisible');
              }
            };

            // Check immediately
            checkAR();

            // Check again when the model is fully loaded
            viewer.addEventListener('load', () => {
              checkAR();
            });

            // Fallback click handler
            arButton?.addEventListener('click', () => {
              // @ts-ignore - model-viewer adds this method
              if (viewer.canActivateAR) {
                // @ts-ignore
                viewer.activateAR();
              }
            });

            viewer.addEventListener('error', (event) => {
              console.error('Model Viewer Error Detail:', event);
            });
          }
        }
      }, 500);
    };

    // Cleanup function
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div ref={modelViewerRef} className="w-full h-full relative">
      <model-viewer 
        src={src}
        alt={title}
        shadow-intensity="1"
        camera-controls
        auto-rotate
        ar
        ar-modes="webxr scene-viewer quick-look"
        environment-image="neutral"
        exposure="1"
        loading="eager"
        className="w-full h-full bg-white"
        crossOrigin="anonymous"
      >
        {/* Custom AR Button */}
        <button 
          slot="ar-button"
          className="absolute left-1/2 transform -translate-x-1/2 bottom-4 z-10 bg-white text-indigo-600 font-medium px-6 py-3 rounded-full shadow-lg items-center gap-2 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer border border-indigo-100 opacity-0 invisible transition-opacity duration-300"
          id="ar-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline mr-2">
            <path d="M3 7C3 4.79086 4.79086 3 7 3H9V5H7C5.89543 5 5 5.89543 5 7V9H3V7Z" fill="currentColor" />
            <path d="M17 3C19.2091 3 21 4.79086 21 7V9H19V7C19 5.89543 18.1046 5 17 5H15V3H17Z" fill="currentColor" />
            <path d="M21 17C21 19.2091 19.2091 21 17 21H15V19H17C18.1046 19 19 18.1046 19 17V15H21V17Z" fill="currentColor" />
            <path d="M7 21C4.79086 21 3 19.2091 3 17V15H5V17C5 18.1046 5.89543 19 7 19H9V21H7Z" fill="currentColor" />
          </svg>
          View in your space
        </button>

        {/* Loading Poster */}
        <div 
          slot="poster"
          className="absolute inset-0 flex items-center justify-center bg-white pointer-events-none"
        >
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium">Loading 3D Model...</p>
          </div>
        </div>
      </model-viewer>
      
      {/* Info Card Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-white/50 max-w-[200px]">
        <h2 className="font-bold text-slate-800">{title}</h2>
        <p className="text-indigo-600 font-semibold mt-1">₹{price}</p>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {description.substring(0, 60)}{description.length > 60 ? '...' : ''}
        </p>
      </div>
    </div>
  );
};

export default ModelViewerComponent;