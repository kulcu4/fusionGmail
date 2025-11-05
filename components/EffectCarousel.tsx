import React, { useState, useRef } from 'react';
import { EffectOption, User } from '../types';
import { PadlockIcon } from './icons';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface EffectCarouselProps {
    options: EffectOption[];
    selectedEffects: { [key: string]: { intensity: number; spread?: number } };
    onToggleEffect: (id: string) => void;
    onSliderChange: (id: string, type: 'intensity' | 'spread', value: number) => void;
    unlockedEffects: string[];
    user: User;
    onUnlockRequest: (id: string) => void;
}

interface EffectCarouselItemProps {
    option: EffectOption;
    isSelected: boolean;
    isUnlocked: boolean;
    currentSettings: { intensity: number; spread?: number } | undefined;
    onToggleEffect: (id: string) => void;
    onSliderChange: (id: string, type: 'intensity' | 'spread', value: number) => void;
    onUnlockRequest: (id: string) => void;
}

const EffectCarouselItem: React.FC<EffectCarouselItemProps> = ({
    option,
    isSelected,
    isUnlocked,
    currentSettings,
    onToggleEffect,
    onSliderChange,
    onUnlockRequest,
}) => {

    const handleClick = () => {
        if (isUnlocked) {
            onToggleEffect(option.id);
        } else {
            onUnlockRequest(option.id);
        }
    };

    return (
        <div className="relative">
            <div className="flex flex-col items-center space-y-1.5 w-20">
                <button
                    data-sound="click"
                    onClick={handleClick}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform hover:scale-105 relative ${
                        isSelected ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(0,240,255,0.5)]' : 'border-gray-600'
                    }`}
                    aria-pressed={isSelected}
                >
                    {typeof option.icon === 'string' ? (
                        <img src={option.icon} alt={option.label} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <option.icon className={`w-6 h-6 ${isSelected ? 'text-cyan-400' : isUnlocked ? 'text-gray-400' : 'text-gray-600'}`} />
                    )}
                     {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                            <PadlockIcon className="w-5 h-5 text-yellow-400" />
                        </div>
                    )}
                </button>
                <span className={`text-xs text-center font-semibold transition-colors ${isSelected ? 'text-white' : 'text-gray-400'}`}>{option.label}</span>
            </div>
        </div>
    );
};


const EffectCarousel: React.FC<EffectCarouselProps> = ({ options, selectedEffects, onToggleEffect, onSliderChange, unlockedEffects, user, onUnlockRequest }) => {
    const firstRowScrollRef = useDraggableScroll();
    const secondRowScrollRef = useDraggableScroll();
    
    const midPoint = Math.ceil(options.length / 2);
    const firstRowOptions = options.slice(0, midPoint);
    const secondRowOptions = options.slice(midPoint);

    return (
        <div className="w-full flex flex-col space-y-2">
            <div ref={firstRowScrollRef} className="overflow-x-auto -mx-4 px-4 no-scrollbar cursor-grab py-1" style={{ overflowY: 'visible' }}>
                <div className="inline-flex items-start space-x-3">
                    {firstRowOptions.map((option) => (
                       <EffectCarouselItem
                            key={option.id}
                            option={option}
                            isSelected={selectedEffects[option.id] !== undefined}
                            isUnlocked={unlockedEffects.includes(option.id)}
                            currentSettings={selectedEffects[option.id]}
                            onToggleEffect={onToggleEffect}
                            onSliderChange={onSliderChange}
                            onUnlockRequest={onUnlockRequest}
                       />
                    ))}
                </div>
            </div>
            {secondRowOptions.length > 0 && (
                <div ref={secondRowScrollRef} className="overflow-x-auto -mx-4 px-4 no-scrollbar cursor-grab py-1" style={{ overflowY: 'visible' }}>
                    <div className="inline-flex items-start space-x-3">
                        {secondRowOptions.map((option) => (
                           <EffectCarouselItem
                                key={option.id}
                                option={option}
                                isSelected={selectedEffects[option.id] !== undefined}
                                isUnlocked={unlockedEffects.includes(option.id)}
                                currentSettings={selectedEffects[option.id]}
                                onToggleEffect={onToggleEffect}
                                onSliderChange={onSliderChange}
                                onUnlockRequest={onUnlockRequest}
                           />
                        ))}
                    </div>
                </div>
            )}
             <style>{`
                .range-thumb-small::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    background: #22d3ee; /* cyan-400 */
                    cursor: pointer;
                    border-radius: 50%;
                }

                .range-thumb-small::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    background: #22d3ee;
                    cursor: pointer;
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default EffectCarousel;