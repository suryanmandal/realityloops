// types.d.ts
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                alt?: string;
                poster?: string;
                loading?: 'auto' | 'lazy' | 'eager';
                reveal?: 'auto' | 'interaction' | 'manual';
                // Add other attributes as needed, e.g.:
                'camera-controls'?: boolean;
                'auto-rotate'?: boolean;
                ar?: boolean;
            };
        }
    }
}