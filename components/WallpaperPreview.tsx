import React from 'react';
// FIX: Replace non-existent 'CityscapeIcon' with 'WallpapersIcon' which is an exported member of './icons'.
import { WallpapersIcon } from './icons';

interface WallpaperPreviewProps {
    imageSrc: string | null;
    isLoading: boolean;
}

const WallpaperPreview: React.FC<WallpaperPreviewProps> = ({ imageSrc, isLoading }) => {
    return (
        <div className="w-full aspect-[9/16] rounded-2xl bg-black/30 border border-gray-700 flex items-center justify-center overflow-hidden transition-all duration-300">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-300">Conjuring pixels...</p>
                </div>
            ) : imageSrc ? (
                <img src={imageSrc} alt="Generated wallpaper" className="w-full h-full object-cover" />
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-600 p-4">
                    <WallpapersIcon className="w-full max-w-[200px] h-auto" />
                    <p className="mt-4 text-center text-sm">Your generated wallpaper will appear here</p>
                </div>
            )}
        </div>
    );
};

export default WallpaperPreview;
