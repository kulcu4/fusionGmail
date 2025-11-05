
import React from 'react';
import { MagicWandIcon } from './icons';

interface ActionButtonsProps {
    onGenerate: () => void;
    onSurprise: () => void;
    isLoading: boolean;
    isGenerateDisabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onGenerate, onSurprise, isLoading, isGenerateDisabled }) => {
    return (
        <div className="w-full flex items-stretch space-x-3">
            <button
                data-sound="click"
                onClick={onGenerate}
                disabled={isLoading || isGenerateDisabled}
                className="flex-1 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-full text-sm sm:text-base tracking-wider hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-2 relative overflow-hidden liquid-glass-button"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>GENERATING...</span>
                    </>
                ) : (
                    <span>GENERATE</span>
                )}
            </button>
            <button
                data-sound="click"
                onClick={onSurprise}
                disabled={isLoading}
                className="flex-1 border-2 border-fuchsia-500 text-fuchsia-400 font-bold py-3 px-4 rounded-full text-sm sm:text-base hover:bg-fuchsia-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                title="Generate a random prompt and style"
            >
                <MagicWandIcon className="w-5 h-5" />
                <span>Surprise Me</span>
            </button>
        </div>
    );
};

export default ActionButtons;
