import React from 'react';
import { ColorPreset, ColorSettings, DynamicBackgroundOption } from '../types';
import { dynamicBackgroundOptions, defaultColorPresets } from '../constants';
import { SoundOnIcon, SoundOffIcon } from './icons';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface SettingsPageProps {
    isSoundEnabled: boolean;
    onToggleSound: () => void;
    selectedBackground: string;
    onBackgroundChange: (id: string) => void;
    colorSettings: ColorSettings;
    onColorSettingsChange: (settings: ColorSettings) => void;
    selectedColorPresetId: string;
    onColorPresetChange: (preset: ColorPreset) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    isSoundEnabled, 
    onToggleSound, 
    selectedBackground, 
    onBackgroundChange, 
    colorSettings,
    onColorSettingsChange,
    selectedColorPresetId,
    onColorPresetChange,
}) => {
    const bgScrollRef = useDraggableScroll();
    const colorScrollRef = useDraggableScroll();

    return (
        <div className="relative z-10 flex flex-col items-center justify-start max-w-lg mx-auto p-4 sm:p-6 pb-24 animate-fade-in no-scrollbar mt-6">
            <div className="w-full space-y-8">
                <section>
                    <h2 className="text-sm font-bold tracking-widest text-gray-400 mb-4 border-b border-gray-700 pb-2">DYNAMIC BACKGROUND</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-semibold tracking-wider text-gray-300 mb-2">STYLE</h3>
                            <div ref={bgScrollRef} className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar cursor-grab">
                                {dynamicBackgroundOptions.map(option => {
                                    const isSelected = selectedBackground === option.id;
                                    const Icon = option.icon;
                                    return (
                                        <div key={option.id} className="flex flex-col items-center space-y-1.5 w-24 flex-shrink-0">
                                            <button
                                                data-sound="click"
                                                onClick={() => onBackgroundChange(option.id)}
                                                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 transform hover:scale-105 ${isSelected ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(0,240,255,0.5)]' : 'border-gray-600'}`}
                                            >
                                                <Icon className={`w-8 h-8 ${isSelected ? 'text-cyan-400' : 'text-gray-300'}`} />
                                            </button>
                                            <span className={`text-xs text-center font-semibold transition-colors ${isSelected ? 'text-white' : 'text-gray-400'}`}>{option.label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold tracking-wider text-gray-300 mb-2">COLOR PRESET</h3>
                             <div ref={colorScrollRef} className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar cursor-grab">
                                {defaultColorPresets.map(preset => (
                                    <button
                                        key={preset.id}
                                        data-sound="click"
                                        onClick={() => onColorPresetChange(preset)}
                                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap border-2 ${selectedColorPresetId === preset.id ? 'bg-fuchsia-500 text-black border-fuchsia-500 shadow-md shadow-fuchsia-500/30' : 'bg-white/10 text-gray-300 border-transparent hover:bg-white/20'}`}
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div className="mt-4 pt-2">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xs font-semibold tracking-wider text-gray-300">CUSTOM HUE</h3>
                                <span className="text-xs font-mono text-gray-400">{colorSettings.h}°</span>
                            </div>
                            <div className="p-1 rounded-lg" style={{ background: `linear-gradient(to right, hsl(0, 80%, 50%), hsl(60, 80%, 50%), hsl(120, 80%, 50%), hsl(180, 80%, 50%), hsl(240, 80%, 50%), hsl(300, 80%, 50%), hsl(360, 80%, 50%))` }}>
                                <input
                                    type="range" min="0" max="360"
                                    value={colorSettings.h}
                                    onChange={(e) => {
                                        const newHue = parseInt(e.target.value);
                                        const newSettings = { ...colorSettings, h: newHue };
                                        onColorPresetChange({ id: 'custom', name: 'Custom', settings: newSettings });
                                    }}
                                    className="w-full h-2 bg-transparent appearance-none cursor-pointer range-thumb-fuchsia"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold tracking-widest text-gray-400 mb-4 border-b border-gray-700 pb-2">GENERAL</h2>
                    <div className="flex justify-between items-center bg-white/5 rounded-lg p-3 px-4">
                        <div className="flex items-center gap-3">
                            {isSoundEnabled ? <SoundOnIcon className="w-6 h-6 text-cyan-400" /> : <SoundOffIcon className="w-6 h-6 text-gray-500" />}
                            <span className="font-semibold text-gray-200">App Sounds</span>
                        </div>
                        <button onClick={onToggleSound} className={`relative w-12 h-6 rounded-full transition-colors ${isSoundEnabled ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isSoundEnabled ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                </section>
            </div>
            <style>{`
                .animate-fade-in { animation: fadeIn 0.3s ease-out; } 
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .range-thumb-fuchsia::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 20px; height: 20px;
                    background: white; cursor: pointer; border-radius: 50%;
                    border: 4px solid #a855f7;
                }
                .range-thumb-fuchsia::-moz-range-thumb {
                    width: 20px; height: 20px; background: white; cursor: pointer; border-radius: 50%;
                    border: 4px solid #a855f7;
                }
            `}</style>
        </div>
    );
}

export default SettingsPage;