'use client';

import { useEffect, useRef, useState } from 'react';

interface Model3DViewerProps {
    src: string;
    alt: string;
}

const Model3DViewer = ({ src, alt }: Model3DViewerProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const arButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Dynamically load the module purely on client side
        import('@google/model-viewer').then(() => {
            setIsMounted(true);
        }).catch(console.error);
    }, []);

    // Handle AR Button Logic
    useEffect(() => {
        if (!isMounted) return;

        const viewer = document.querySelector('model-viewer');

        const checkARSupport = () => {
            // @ts-ignore
            if (viewer && viewer.canActivateAR) {
                if (arButtonRef.current) {
                    arButtonRef.current.style.opacity = '1';
                    arButtonRef.current.style.visibility = 'visible';
                }
            } else {
                if (arButtonRef.current) {
                    arButtonRef.current.style.opacity = '0';
                    arButtonRef.current.style.visibility = 'hidden';
                }
            }
        };

        if (viewer) {
            viewer.addEventListener('load', checkARSupport);
        }

        return () => {
            if (viewer) viewer.removeEventListener('load', checkARSupport);
        };
    }, [isMounted, src]);

    if (!isMounted) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading 3D Engine...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            {/* @ts-ignore */}
            <model-viewer
                src={src}
                alt={alt}
                shadow-intensity="1"
                camera-controls
                auto-rotate
                ar
                ar-modes="webxr scene-viewer quick-look"
                environment-image="neutral"
                exposure="1"
                loading="eager"
                style={{ width: '100%', height: '100%' }}
                // @ts-ignore
                className="w-full h-full"
                crossOrigin="anonymous"
            >
                <button
                    ref={arButtonRef}
                    slot="ar-button"
                    className="bg-white text-indigo-600 font-medium px-6 py-3 rounded-full shadow-lg items-center gap-2 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer border border-indigo-100 opacity-0 invisible flex"
                    style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '20px', zIndex: 10 }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline mr-2">
                        <path d="M3 7C3 4.79086 4.79086 3 7 3H9V5H7C5.89543 5 5 5.89543 5 7V9H3V7Z" fill="currentColor" />
                        <path d="M17 3C19.2091 3 21 4.79086 21 7V9H19V7C19 5.89543 18.1046 5 17 5H15V3H17Z" fill="currentColor" />
                        <path d="M21 17C21 19.2091 19.2091 21 17 21H15V19H17C18.1046 19 19 18.1046 19 17V15H21V17Z" fill="currentColor" />
                        <path d="M7 21C4.79086 21 3 19.2091 3 17V15H5V17C5 18.1046 5.89543 19 7 19H9V21H7Z" fill="currentColor" />
                    </svg>
                    View in your space
                </button>

                <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-gray-100 pointer-events-none">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading Model...</p>
                    </div>
                </div>

                {/* @ts-ignore  */}
            </model-viewer>
        </div>
    );
};

export default Model3DViewer;