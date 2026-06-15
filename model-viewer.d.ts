import type React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'interaction' | 'manual';
        
        // AR features
        ar?: boolean | string;
        'ar-modes'?: string;
        'ar-scale'?: 'auto' | 'fixed';
        'ar-placement'?: 'floor' | 'wall';
        'ios-src'?: string;
        'xr-environment'?: boolean | string;
        
        // Camera controls
        'camera-controls'?: boolean | string;
        'camera-orbit'?: string;
        'camera-target'?: string;
        'field-of-view'?: string;
        'max-camera-orbit'?: string;
        'min-camera-orbit'?: string;
        'max-field-of-view'?: string;
        'min-field-of-view'?: string;
        'interpolation-decay'?: number | string;
        
        // Interaction
        'disable-zoom'?: boolean | string;
        'disable-pan'?: boolean | string;
        'disable-tap'?: boolean | string;
        'touch-action'?: string;
        'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
        'interaction-prompt-threshold'?: number | string;
        'interaction-prompt-style'?: 'basic' | 'wiggle';
        
        // Lighting & Environment
        'environment-image'?: string;
        'skybox-image'?: string;
        exposure?: number | string;
        'shadow-intensity'?: number | string;
        'shadow-softness'?: number | string;
        
        // Staging & Presentation
        autoplay?: boolean | string;
        'animation-name'?: string;
        'animation-crossfade-duration'?: number | string;
        'auto-rotate'?: boolean | string;
        'auto-rotate-delay'?: number | string;
        'rotation-per-second'?: string;
        
        // Loading
        preload?: boolean | string;
        withCredentials?: boolean | string;
        
        // Dimensions & Scaling
        bounds?: 'tight' | 'legacy';
        scale?: string;
        
        // Annotations
        'quick-look-browsers'?: string;
      };
    }
  }
  
  interface HTMLElementTagNameMap {
    'model-viewer': HTMLElement & {
      src: string;
      alt: string;
      canActivateAR: boolean;
      activateAR(): Promise<void>;
    };
  }
}
