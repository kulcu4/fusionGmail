import React from 'react';
import { GenerationProvider } from '../types';
import { GeminiIcon, RunwareIcon } from './icons';

interface ProviderSelectorProps {
    selectedProvider: GenerationProvider;
    onSelectProvider: (provider: GenerationProvider) => void;
    isDisabled: boolean;
}

const providers: { id: GenerationProvider; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'gemini', label: 'Gemini', icon: GeminiIcon },
    { id: 'runware', label: 'Runware', icon: RunwareIcon },
];

const ProviderSelector: React.FC<ProviderSelectorProps> = ({ selectedProvider, onSelectProvider, isDisabled }) => {
    return (
        <div className="w-full flex justify-center py-2">
            <div className="flex bg-black/20 rounded-full border border-gray-700 p-1 space-x-1">
                {providers.map((provider) => {
                    const isSelected = selectedProvider === provider.id;
                    return (
                        <button
                            key={provider.id}
                            data-sound="click"
                            onClick={() => onSelectProvider(provider.id)}
                            disabled={isDisabled}
                            className={`flex items-center space-x-2 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${
                                isSelected
                                    ? 'bg-cyan-400 text-black shadow-md shadow-cyan-500/30'
                                    : 'text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            <provider.icon className={`w-5 h-5 ${isSelected ? 'text-black' : 'text-cyan-400'}`} />
                            <span>{provider.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProviderSelector;
