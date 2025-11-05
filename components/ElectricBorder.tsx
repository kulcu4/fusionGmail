import React, { CSSProperties } from 'react';

interface StarBorderProps {
    className?: string;
    style?: CSSProperties;
}

const StarBorder: React.FC<StarBorderProps> = ({ className, style }) => {
    return (
        <div
            className={`absolute pointer-events-none ${className}`}
            style={style}
        >
            <div className="relative w-full h-full">
                <div
                    className="absolute -inset-1 rounded-2xl"
                    style={{
                        border: '3.2px solid transparent',
                        background: 'conic-gradient(from var(--angle), transparent 0%, #7df9ff 20%, transparent 40%)',
                        backgroundClip: 'border-box',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        animation: 'spin 3.6s linear infinite',
                    }}
                >
                </div>
            </div>
            <style>
                {`
                    @property --angle {
                        syntax: '<angle>';
                        initial-value: 0deg;
                        inherits: false;
                    }
                    @keyframes spin {
                        from { --angle: 0deg; }
                        to { --angle: 360deg; }
                    }
                `}
            </style>
        </div>
    );
};

export default StarBorder;