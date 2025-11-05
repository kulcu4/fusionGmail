
import React from 'react';
import { Option } from '../types';

interface OptionSelectorProps {
    title: string;
    options: Option[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ title, options, selectedValue, onSelect }) => {
    return (
        <div className="w-full">
            <h2 className="text-sm font-bold tracking-widest text-gray-400 mb-3">{title}</h2>
            <div className="flex justify-between items-start space-x-2">
                {options.map((option) => {
                    const isActive = selectedValue === option.id;
                    const Icon = option.icon;
                    return (
                        <div key={option.id} className="flex flex-col items-center space-y-1 w-1/4">
                            <button
                                onClick={() => onSelect(option.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform hover:scale-105 ${
                                    isActive ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(0,240,255,0.5)]' : 'border-gray-600'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                            </button>
                            <span className={`text-xs text-center font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>{option.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OptionSelector;