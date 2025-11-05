import React from 'react';
import { HelpIcon, ChevronDownIcon } from './icons';

interface PromptInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    isDisabled: boolean;
    imageCount: number;
    onImageCountChange: (count: number) => void;
}

const PROMPT_MAX_LENGTH = 1000;

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, isDisabled, imageCount, onImageCountChange }) => {
    return (
        <div className="relative w-full">
            <textarea
                rows={2}
                value={value}
                onChange={onChange}
                placeholder="Describe your wallpaper..."
                className="w-full bg-transparent border-2 border-[#3D8BFF] rounded-2xl py-2 pl-6 pr-40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3D8BFF] focus:border-transparent transition-all duration-300 resize-none"
                disabled={isDisabled}
                maxLength={PROMPT_MAX_LENGTH}
            />
             <div className="absolute bottom-2.5 right-3 flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">
                    {value.length}/{PROMPT_MAX_LENGTH}
                </span>
                <div className="relative group">
                    <select
                        value={imageCount}
                        onChange={(e) => onImageCountChange(Number(e.target.value))}
                        disabled={isDisabled}
                        className="bg-transparent border border-gray-600 rounded-full py-2 pl-3 pr-8 text-white font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                        aria-label="Image count"
                        title="Number of images to generate"
                    >
                        {[...Array(8)].map((_, i) => <option key={i+1} value={i+1} className="bg-[#12072F]">{i+1}</option>)}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative group flex items-center">
                    <HelpIcon className="w-6 h-6 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full right-0 mb-2 w-72 p-3 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 text-left">
                        <h4 className="font-bold text-sm text-cyan-400">Prompting Tips</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                            <li>Be specific: "A cat in a spacesuit" vs "animal".</li>
                            <li>Use descriptive adjectives: "glowing," "ancient," "surreal."</li>
                            <li>Combine concepts: "A steampunk clocktower in a bioluminescent forest."</li>
                            <li>Mention artists or styles for inspiration (e.g., "in the style of Van Gogh").</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptInput;