import React, { useState, useEffect } from 'react';
import { GenerateIcon, MagnifyingGlassIcon, HeartIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaItem } from '../types';

interface ImageGridProps {
    images: MediaItem[];
    isLoading: boolean;
    count: number;
    onMediaClick: (item: MediaItem) => void;
    selectedStyle: string;
    generationStatus?: string;
    favorites: string[];
    onToggleFavorite: (src: string) => void;
    onDownload: (src: string, filename: string) => void;
}

const staticLoadingMessages = [
    'Warming up the AI artists...',
    'Mixing neon paints...',
    'Generating cosmic backdrops...',
    'Adding a touch of magic...',
    'Finalizing the pixels...',
];

const CyberpunkLoader: React.FC = () => {
    const text = "INITIALIZING_SYSTEM...";
    return (
        <div className="font-mono text-lg tracking-widest text-cyan-300 relative" aria-label="Loading cyberpunk style">
            <span className="glitch" data-text={text}>{text}</span>
             <style>{`
                .glitch {
                    position: relative;
                    text-shadow: 0 0 4px #0ff, 0 0 8px #0ff, 0 0 12px #0ff;
                }
                .glitch::before,
                .glitch::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #000;
                    overflow: hidden;
                }
                .glitch::before {
                    left: 2px;
                    text-shadow: -2px 0 #ff00c1;
                    animation: glitch-anim-1 2s infinite linear alternate-reverse;
                }
                .glitch::after {
                    left: -2px;
                    text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
                    animation: glitch-anim-2 2s infinite linear alternate-reverse;
                }
                @keyframes glitch-anim-1 {
                    0% { clip-path: inset(15% 0 86% 0); } 25% { clip-path: inset(55% 0 23% 0); } 50% { clip-path: inset(22% 0 43% 0); } 75% { clip-path: inset(88% 0 3% 0); } 100% { clip-path: inset(45% 0 46% 0); }
                }
                @keyframes glitch-anim-2 {
                    0% { clip-path: inset(82% 0 13% 0); } 25% { clip-path: inset(23% 0 49% 0); } 50% { clip-path: inset(68% 0 11% 0); } 75% { clip-path: inset(33% 0 47% 0); } 100% { clip-path: inset(92% 0 5% 0); }
                }
            `}</style>
        </div>
    );
};

const GhibliLoader: React.FC = () => (
    <div className="relative w-16 h-16 flex items-center justify-center">
        <span className="absolute inset-0 border-4 border-dashed border-green-300 rounded-full animate-spin-slow"></span>
        <span className="absolute inset-2 border-2 border-dotted border-green-200 rounded-full animate-spin-reverse"></span>
        <span className="text-2xl">🌱</span>
    </div>
);

const WatercolorLoader: React.FC = () => (
    <div className="relative w-20 h-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
                <filter id="watercolor-filter">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="contrast" />
                    <feComposite in="SourceGraphic" in2="contrast" operator="atop"/>
                </filter>
            </defs>
            <g filter="url(#watercolor-filter)">
                <circle cx="50" cy="50" r="10" fill="#22d3ee" className="animate-splash" style={{ transformOrigin: '50% 50%', animationDelay: '0s' }} />
                <circle cx="50" cy="50" r="10" fill="#a855f7" className="animate-splash" style={{ transformOrigin: '50% 50%', animationDelay: '0.5s' }} />
                <circle cx="50" cy="50" r="10" fill="#ec4899" className="animate-splash" style={{ transformOrigin: '50% 50%', animationDelay: '1s' }} />
            </g>
        </svg>
        <style>{`
            @keyframes splash {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                50% { opacity: 0.8; }
                100% { transform: scale(4) rotate(360deg); opacity: 0; }
            }
            .animate-splash {
                animation: splash 3s infinite ease-out;
            }
        `}</style>
    </div>
);

const PixelArtLoader: React.FC = () => (
    <div className="w-12 h-12 grid grid-cols-4 gap-1 animate-pixel-pulse">
        {Array.from({length: 16}).map((_, i) => (
            <div key={i} className="w-full h-full bg-fuchsia-500" style={{animationDelay: `${i*0.1}s`}}></div>
        ))}
        <style>{`
            @keyframes pixel-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.5); opacity: 0.5; } }
            .animate-pixel-pulse > div { animation: pixel-pulse 1.6s infinite ease-in-out; }
        `}</style>
    </div>
);

const DefaultLoader: React.FC = () => (
    <div className="relative flex items-center justify-center">
        <div className="absolute w-20 h-20 bg-cyan-500/30 rounded-full animate-ping"></div>
        <GenerateIcon className="w-12 h-12 text-cyan-400 animate-pulse" />
    </div>
);


const LoadingIndicator: React.FC<{count: number, selectedStyle: string, generationStatus?: string}> = ({ count, selectedStyle, generationStatus }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    
    const styleMessages: {[key: string]: string[]} = {
        cyberpunk: ["Booting neural interface...", "Compiling chrome...", "Entering the matrix..."],
        ghibli: ["Sketching magical creatures...", "Painting lush landscapes...", "Adding a touch of wonder..."],
        watercolor: ["Washing colors onto the canvas...", "Blending pigments...", "Letting the colors flow..."],
        pixel_art: ["Arranging pixels...", "Building an 8-bit world...", "Choosing the perfect palette..."],
        default: staticLoadingMessages
    };

    const loadingMessages = styleMessages[selectedStyle] || styleMessages.default;

    useEffect(() => {
        if (generationStatus) return;
        setMessageIndex(0); // Reset on mode change
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [loadingMessages.length, generationStatus]);
    
    const renderSkeletons = () => {
        return Array.from({ length: count }).map((_, index) => (
            <div key={index} className="aspect-[9/16] w-full bg-black/30 rounded-xl animate-pulse border border-gray-700"></div>
        ));
    };

    const ThematicLoader = () => {
        switch(selectedStyle) {
            case 'cyberpunk': return <CyberpunkLoader />;
            case 'ghibli': return <GhibliLoader />;
            case 'watercolor': return <WatercolorLoader />;
            case 'pixel_art': return <PixelArtLoader />;
            default: return <DefaultLoader />;
        }
    };


    return (
        <div className="w-full flex flex-col items-center justify-center space-y-4 py-8 min-h-[300px]">
            <ThematicLoader />
            <p className="text-center text-cyan-300 transition-opacity duration-500 h-5">{generationStatus || loadingMessages[messageIndex]}</p>
            <div className="w-full max-w-sm aspect-[9/16] mt-4 opacity-20">
                {renderSkeletons()}
            </div>
        </div>
    )
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const ImageGrid: React.FC<ImageGridProps> = ({ images, isLoading, count, onMediaClick, selectedStyle, generationStatus, favorites, onToggleFavorite, onDownload }) => {
    const [[page, direction], setPage] = useState([0, 0]);

    const imageIndex = page;

    useEffect(() => {
        setPage([0, 0]);
    }, [images]);

    const paginate = (newDirection: number) => {
        let newIndex = page + newDirection;
        if (newIndex < 0) {
            newIndex = images.length - 1;
        } else if (newIndex >= images.length) {
            newIndex = 0;
        }
        setPage([newIndex, newDirection]);
    };
    
    if (isLoading) {
        return <LoadingIndicator count={count} selectedStyle={selectedStyle} generationStatus={generationStatus} />;
    }
    
    if (images.length === 0) {
        return null;
    }
    
    const media = images[imageIndex];
    if (!media) return null;

    const isFavorited = favorites.includes(media.src);

    const renderMedia = (mediaItem: MediaItem, isCurrent: boolean) => (
        <>
            {mediaItem.type === 'video' ? (
                <video src={mediaItem.src} className="w-full h-full object-cover" autoPlay loop muted playsInline />
            ) : (
                <img src={mediaItem.src} alt="Generated wallpaper" className="w-full h-full object-cover" />
            )}
            
            {isCurrent && (
                <>
                <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                    aria-hidden="true" 
                    onClick={() => onMediaClick(media)}
                />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        data-sound="click"
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(media.src); }}
                        className="p-1.5 bg-black/50 rounded-full hover:bg-white/20 transition-colors"
                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <HeartIcon className={`w-5 h-5 transition-colors ${isFavorited ? 'text-red-500' : 'text-white'}`} filled={isFavorited} />
                    </button>
                    <button
                        data-sound="click"
                        onClick={(e) => { e.stopPropagation(); onDownload(media.src, `wallpaper-${selectedStyle}-${imageIndex}.jpeg`); }}
                        className="p-1.5 bg-black/50 rounded-full hover:bg-white/20 transition-colors"
                        aria-label="Download wallpaper"
                    >
                        <DownloadIcon className="w-5 h-5 text-white" />
                    </button>
                </div>
                <div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    onClick={() => onMediaClick(media)}
                >
                    <div className="p-2 bg-black/50 rounded-full">
                        <MagnifyingGlassIcon className="w-6 h-6 text-white" />
                    </div>
                </div>
                </>
            )}
        </>
    );

    if (images.length === 1) {
        return (
             <div className="w-full flex justify-center py-4">
                <div className="relative group aspect-[9/16] w-full max-w-sm rounded-xl overflow-hidden border-2 border-transparent hover:border-cyan-400/50 transition-all duration-300 cursor-pointer block">
                    {renderMedia(media, true)}
                </div>
             </div>
        )
    }

    return (
        <div className="w-full flex flex-col items-center space-y-3 py-4">
             <div className="relative w-full max-w-sm aspect-[9/16] overflow-hidden rounded-xl group">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        className="absolute w-full h-full cursor-grab active:cursor-grabbing"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                         onClick={() => onMediaClick(media)}
                    >
                       {renderMedia(media, true)}
                    </motion.div>
                </AnimatePresence>

                <button
                    className="absolute top-1/2 -translate-y-1/2 left-2 z-10 p-1 bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    onClick={() => paginate(-1)}
                    aria-label="Previous image"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                    className="absolute top-1/2 -translate-y-1/2 right-2 z-10 p-1 bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    onClick={() => paginate(1)}
                    aria-label="Next image"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>
             <div className="flex justify-center space-x-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage([i, i > imageIndex ? 1 : -1])}
                        className={`w-2 h-2 rounded-full transition-colors ${i === imageIndex ? 'bg-cyan-400' : 'bg-gray-600 hover:bg-gray-400'}`}
                        aria-label={`Go to image ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageGrid;