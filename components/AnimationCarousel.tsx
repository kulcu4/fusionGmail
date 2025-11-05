import React, { useState } from 'react';
import { AnimationOption, User, AnimationPreset } from '../types';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { PadlockIcon } from './icons';

interface AnimationCarouselProps {
    options: AnimationOption[];
    selectedValue: string | null;
    onSelect: (value: string | null) => void;
    user: User;
    onGoToShop: () => void;
    settings: {
        zoomAmount: number;
        panDirection: string;
        swirlDirection: string;
        tiltDirection: string;
    };
    onSettingsChange: (newSettings: any) => void;
    presets: AnimationPreset[];
}

const AnimationCarousel: React.FC<AnimationCarouselProps> = ({ options, selectedValue, onSelect, user, onGoToShop, settings, onSettingsChange, presets }) => {
    const scrollRef = useDraggableScroll();
    const presetsScrollRef = useDraggableScroll();
    const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

    const isPremium = user.subscription === 'premium';
    const selectedOption = options.find(o => o.id === selectedValue);

    const handleSettingChange = (key: string, value: any) => {
        setSelectedPresetId(null);
        onSettingsChange((prev: any) => ({ ...prev, [key]: value }));
    };
    
    const handlePresetSelect = (preset: AnimationPreset) => {
        setSelectedPresetId(preset.id);
        onSettingsChange(preset.settings);
    };

    const isLocked = !!selectedOption?.isPremium && !isPremium;

    return (
        <div className="w-full">
            <div ref={scrollRef} className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar cursor-grab">
                {options.map((option) => {
                    const isSelected = selectedValue === option.id;
                    const isLocked = !!option.isPremium && !isPremium;
                    const Icon = option.icon;

                    const handleClick = () => {
                        if (isLocked) {
                            onGoToShop();
                            return;
                        }
                        onSelect(isSelected ? null : option.id);
                    };

                    return (
                        <div key={option.id} className="flex flex-col items-center space-y-1.5 w-24 flex-shrink-0">
                            <button
                                data-sound="click"
                                onClick={handleClick}
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 transform hover:scale-105 relative ${
                                    isSelected ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(0,240,255,0.5)]' : isLocked ? 'border-gray-700' : 'border-gray-600'
                                }`}
                                aria-pressed={isSelected}
                            >
                                <Icon className={`w-8 h-8 ${isSelected ? 'text-cyan-400' : isLocked ? 'text-gray-600' : 'text-gray-300'}`} />
                                {isLocked && (
                                    <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
                                        <PadlockIcon className="w-6 h-6 text-yellow-400" />
                                    </div>
                                )}
                            </button>
                            <span className={`text-xs text-center font-semibold transition-colors ${isSelected ? 'text-white' : isLocked ? 'text-gray-600' : 'text-gray-400'}`}>{option.label}</span>
                        </div>
                    );
                })}
            </div>

            {selectedOption && !isLocked && (
                <div className="mt-4 p-3 bg-black/20 rounded-lg space-y-4 animate-fade-in-down">
                    <div>
                        <label className="text-xs font-bold tracking-widest text-gray-400 mb-2 block">PRESETS</label>
                        <div ref={presetsScrollRef} className="flex space-x-2 overflow-x-auto pb-2 -mx-3 px-3 no-scrollbar cursor-grab">
                            {presets.map(preset => (
                                <button
                                    key={preset.id}
                                    data-sound="click"
                                    onClick={() => handlePresetSelect(preset)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap border-2 ${
                                        selectedPresetId === preset.id
                                            ? 'bg-cyan-400 text-black border-cyan-400 shadow-md shadow-cyan-500/30'
                                            : 'bg-white/10 text-gray-300 border-transparent hover:bg-white/20'
                                    }`}
                                    title={preset.description}
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedOption.controls?.includes('zoom') && (
                        <div>
                            <label className="text-xs font-bold tracking-widest text-gray-400 flex justify-between">
                                <span>ZOOM AMOUNT</span>
                                <span>{settings.zoomAmount}%</span>
                            </label>
                            <input
                                type="range" min="10" max="100" step="5"
                                value={settings.zoomAmount}
                                onChange={(e) => handleSettingChange('zoomAmount', parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb-cyan"
                            />
                        </div>
                    )}
                    {selectedOption.controls?.includes('pan') && (
                        <div>
                            <label className="text-xs font-bold tracking-widest text-gray-400 mb-2 block">PAN DIRECTION</label>
                            <div className="flex bg-gray-900/50 rounded-lg p-1">
                                <button onClick={() => handleSettingChange('panDirection', 'left')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${settings.panDirection === 'left' ? 'bg-cyan-500 text-black' : 'text-gray-300'}`}>Left</button>
                                <button onClick={() => handleSettingChange('panDirection', 'right')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${settings.panDirection === 'right' ? 'bg-cyan-500 text-black' : 'text-gray-300'}`}>Right</button>
                            </div>
                        </div>
                    )}
                     {selectedOption.controls?.includes('tilt') && (
                        <div>
                            <label className="text-xs font-bold tracking-widest text-gray-400 mb-2 block">TILT DIRECTION</label>
                            <div className="flex bg-gray-900/50 rounded-lg p-1">
                                <button onClick={() => handleSettingChange('tiltDirection', 'up')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${settings.tiltDirection === 'up' ? 'bg-cyan-500 text-black' : 'text-gray-300'}`}>Up</button>
                                <button onClick={() => handleSettingChange('tiltDirection', 'down')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${settings.tiltDirection === 'down' ? 'bg-cyan-500 text-black' : 'text-gray-300'}`}>Down</button>
                            </div>
                        </div>
                    )}
                     {selectedOption.controls?.includes('swirl') && (
                        <div>
                            <label className="text-xs font-bold tracking-widest text-gray-400 mb-2 block">SWIRL DIRECTION</label>
                            <div className="flex bg-gray-900/50 rounded-lg p-1">
                                <button onClick={() => handleSettingChange('swirlDirection', 'counter-clockwise')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${settings.swirlDirection === 'counter-clockwise' ? 'bg-cyan-500 text-black' : 'text-gray-300'}`}>Counter-Clockwise</button>
                                <button onClick={() => handleSettingChange('swirlDirection', 'clockwise')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${settings.swirlDirection === 'clockwise' ? 'bg-cyan-500 text-black' : 'text-gray-300'}`}>Clockwise</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <style>{`
                .animate-fade-in-down { animation: fadeInDown 0.3s ease-out; } 
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                
                .range-thumb-cyan::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 16px; height: 16px;
                    background: #22d3ee; cursor: pointer; border-radius: 50%;
                }
                .range-thumb-cyan::-moz-range-thumb {
                    width: 16px; height: 16px; background: #22d3ee; cursor: pointer; border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default AnimationCarousel;