// declare namespace JSX {
//     interface IntrinsicElements {
//         'model-viewer': ModelViewerJSX & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
//     }
// }

// interface ModelViewerJSX {
//     src?: string;
//     alt?: string;
//     poster?: string;
//     loading?: 'auto' | 'lazy' | 'eager';
//     reveal?: 'auto' | 'interaction' | 'manual';

//     // AR features
//     ar?: boolean;
//     'ar-modes'?: string;
//     'ar-scale'?: 'auto' | 'fixed';
//     'ar-placement'?: 'floor' | 'wall';
//     'ios-src'?: string;
//     'xr-environment'?: boolean;

//     // Camera controls
//     'camera-controls'?: boolean;
//     'camera-orbit'?: string;
//     'camera-target'?: string;
//     'field-of-view'?: string;
//     'max-camera-orbit'?: string;
//     'min-camera-orbit'?: string;
//     'max-field-of-view'?: string;
//     'min-field-of-view'?: string;
//     'interpolation-decay'?: number;

//     // Interaction
//     'disable-zoom'?: boolean;
//     'disable-pan'?: boolean;
//     'disable-tap'?: boolean;
//     'touch-action'?: string;
//     'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
//     'interaction-prompt-threshold'?: number;
//     'interaction-prompt-style'?: 'basic' | 'wiggle';

//     // Lighting & Environment
//     'environment-image'?: string;
//     'skybox-image'?: string;
//     exposure?: number;
//     'shadow-intensity'?: number;
//     'shadow-softness'?: number;

//     // Staging & Presentation
//     autoplay?: boolean;
//     'animation-name'?: string;
//     'animation-crossfade-duration'?: number;
//     'auto-rotate'?: boolean;
//     'auto-rotate-delay'?: number;
//     'rotation-per-second'?: string;

//     // Loading
//     preload?: boolean;
//     withCredentials?: boolean;

//     // Dimensions & Scaling
//     bounds?: 'tight' | 'legacy';
//     'scale'?: string;

//     // Annotations
//     'quick-look-browsers'?: string;

//     // Style
//     style?: React.CSSProperties;
//     className?: string;
//     id?: string;
// }

// interface ModelViewerElement extends HTMLElement {
//     src: string;
//     alt: string;
//     poster: string;
//     loading: 'auto' | 'lazy' | 'eager';
//     reveal: 'auto' | 'interaction' | 'manual';

//     // AR properties
//     ar: boolean;
//     arModes: string;
//     arScale: 'auto' | 'fixed';
//     arPlacement: 'floor' | 'wall';
//     iosSrc: string;
//     xrEnvironment: boolean;
//     canActivateAR: boolean;

//     // Camera controls
//     cameraControls: boolean;
//     cameraOrbit: string;
//     cameraTarget: string;
//     fieldOfView: string;

//     // Methods
//     activateAR(): Promise<void>;
//     toBlob(options?: { mimeType?: string; qualityArgument?: number; idealAspect?: boolean }): Promise<Blob>;
//     toDataURL(type?: string, encoderOptions?: number): string;
//     getCameraOrbit(): { theta: number; phi: number; radius: number };
//     getCameraTarget(): { x: number; y: number; z: number };
//     getFieldOfView(): number;
//     jumpCameraToGoal(): void;
//     resetTurntableRotation(theta?: number): void;
//     play(options?: { repetitions?: number; pingpong?: boolean }): void;
//     pause(): void;

//     // Model properties
//     readonly loaded: boolean;
//     readonly modelIsVisible: boolean;
//     autoplay: boolean;
//     animationName: string;
//     availableAnimations: string[];
//     readonly paused: boolean;
//     currentTime: number;
//     readonly duration: number;
//     timeScale: number;

//     // Events
//     addEventListener(type: 'load', listener: (event: Event) => void): void;
//     addEventListener(type: 'error', listener: (event: ErrorEvent) => void): void;
//     addEventListener(type: 'ar-status', listener: (event: CustomEvent) => void): void;
//     addEventListener(type: 'camera-change', listener: (event: CustomEvent) => void): void;
//     addEventListener(type: 'progress', listener: (event: CustomEvent) => void): void;
//     addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
// }

// declare global {
//     interface HTMLElementTagNameMap {
//         'model-viewer': ModelViewerElement;
//     }
// }

// export { };

import '@google/model-viewer';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & {
                src?: string;
                alt?: string;
                poster?: string;
                loading?: 'auto' | 'lazy' | 'eager';
                reveal?: 'auto' | 'interaction' | 'manual';
                'camera-controls'?: boolean;
                'auto-rotate'?: boolean;
                ar?: boolean;
                'ar-modes'?: string;
                'ar-scale'?: 'auto' | 'fixed';
                'ar-placement'?: 'floor' | 'wall';
                'ios-src'?: string;
                'xr-environment'?: boolean;
                'shadow-intensity'?: string | number;
                'shadow-softness'?: number;
                'environment-image'?: string;
                'skybox-image'?: string;
                exposure?: string | number;
                autoplay?: boolean;
                'animation-name'?: string;
                'animation-crossfade-duration'?: number;
                'auto-rotate-delay'?: number;
                'rotation-per-second'?: string;
                preload?: boolean;
                withCredentials?: boolean;
                bounds?: 'tight' | 'legacy';
                scale?: string;
                'quick-look-browsers'?: string;
                style?: React.CSSProperties;
                className?: string;
                id?: string;
                crossOrigin?: string;
                slot?: string;
                [key: string]: any;
            };
        }
    }
}

export { };
