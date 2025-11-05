import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Option, StyleCategory, User } from '../types';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { EditIcon, PadlockIcon } from './icons';

interface StyleCarouselProps {
    categories: StyleCategory[];
    activeCategory: string;
    selectedValue: string;
    onSelect: (value: string) => void;
    unlockedStyles: string[];
    user: User;
    onUnlockRequest: (id: string) => void;
    onEditRequest?: (style: Option) => void;
}

const neonColors = ['pink', 'cyan', 'yellow', 'green', 'orange', 'purple', 'red', 'blue'];
const neonMixes = ['mix-1', 'mix-2', 'mix-3', 'mix-4'];
const allNeonEffects = [...neonColors.map(c => `neon-${c}`), ...neonMixes.map(m => `neon-${m}`)];

const getNeonClassForStyle = (styleId: string): string => {
  // Simple hash function to get a consistent index
  let hash = 0;
  for (let i = 0; i < styleId.length; i++) {
    hash = styleId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % allNeonEffects.length);
  return allNeonEffects[index];
};

const StyleCarousel: React.FC<StyleCarouselProps> = ({ categories, activeCategory, selectedValue, onSelect, unlockedStyles, user, onUnlockRequest, onEditRequest }) => {
    const draggableScroll = useDraggableScroll();
    const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
    const scrollRef = useCallback((node: HTMLDivElement | null) => {
        setScrollContainer(node);
        draggableScroll(node);
    }, [draggableScroll]);

    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const activeOptions = useMemo(() => {
        return categories.find(c => c.name === activeCategory)?.styles || [];
    }, [categories, activeCategory]);

    useEffect(() => {
        const node = itemRefs.current.get(selectedValue);
        const container = scrollContainer;

        if (node && container && activeOptions.some(o => o.id === selectedValue)) {
            const nodeRight = node.offsetLeft + node.offsetWidth;
            const nodeLeft = node.offsetLeft;
            const containerRight = container.scrollLeft + container.clientWidth;
            const containerLeft = container.scrollLeft;

            if (nodeRight > containerRight) {
                container.scrollTo({ left: nodeRight - container.clientWidth + 20, behavior: 'smooth' });
            } else if (nodeLeft < containerLeft) {
                container.scrollTo({ left: nodeLeft - 20, behavior: 'smooth' });
            }
        }
    }, [selectedValue, activeOptions, scrollContainer]);

    return (
        <div className="w-full relative">
            <div
                ref={scrollRef}
                className="relative flex space-x-3 overflow-x-auto -mx-4 px-4 no-scrollbar cursor-grab"
                style={{ overflowY: 'visible' }}
            >
                {activeOptions.map((option) => {
                    const isUnlocked = unlockedStyles.includes(option.id);
                    const isSelected = selectedValue === option.id;
                    const neonClass = getNeonClassForStyle(option.id);

                    const handleClick = () => {
                        if (isUnlocked) {
                            onSelect(option.id);
                        } else {
                            onUnlockRequest(option.id);
                        }
                    };

                    return (
                        <div
                            key={option.id}
                            ref={el => { if(el) itemRefs.current.set(option.id, el) }}
                            className="relative flex-shrink-0 z-10 py-4"
                        >
                            <div className="flex flex-col items-center space-y-1.5 w-24">
                                <button
                                    data-sound="click"
                                    onClick={handleClick}
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 relative group/item bg-gray-900/50 border-2 ${isSelected ? 'border-cyan-400' : 'border-transparent'} ${neonClass}`}
                                    aria-pressed={isSelected}
                                >
                                    {typeof option.icon === 'string' ? (
                                        <img src={option.icon} alt={option.label} className="w-full h-full object-cover" />
                                    ) : (
                                        <option.icon className={`w-8 h-8 ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`} />
                                    )}

                                    {!isUnlocked && (
                                        <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
                                            <PadlockIcon className="w-6 h-6 text-yellow-400" />
                                        </div>
                                    )}

                                </button>
                                <span className={`text-xs text-center font-semibold transition-colors ${isSelected ? 'text-white' : 'text-gray-400'}`}>{option.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <style>{`
                .neon-pink { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #d946ef, 0 0 12px #d946ef; }
                .neon-cyan { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #22d3ee, 0 0 12px #22d3ee; }
                .neon-yellow { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #facc15, 0 0 12px #facc15; }
                .neon-green { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #4ade80, 0 0 12px #4ade80; }
                .neon-orange { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #f97316, 0 0 12px #f97316; }
                .neon-purple { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #a855f7, 0 0 12px #a855f7; }
                .neon-red { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #f87171, 0 0 12px #f87171; }
                .neon-blue { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #60a5fa, 0 0 12px #60a5fa; }

                @keyframes neon-mix-1 {
                    0%, 100% { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #d946ef, 0 0 12px #d946ef; }
                    50% { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #22d3ee, 0 0 12px #22d3ee; }
                }
                .neon-mix-1 { animation: neon-mix-1 4s ease-in-out infinite; }

                @keyframes neon-mix-2 {
                    0%, 100% { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #facc15, 0 0 12px #facc15; }
                    50% { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #f97316, 0 0 12px #f97316; }
                }
                .neon-mix-2 { animation: neon-mix-2 4s ease-in-out infinite; }

                @keyframes neon-mix-3 {
                    0%, 100% { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #a855f7, 0 0 12px #a855f7; }
                    50% { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #4ade80, 0 0 12px #4ade80; }
                }
                .neon-mix-3 { animation: neon-mix-3 4s ease-in-out infinite; }

                @keyframes neon-mix-4 {
                    0%, 100% { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #f87171, 0 0 12px #f87171; }
                    50% { box-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 7px #60a5fa, 0 0 12px #60a5fa; }
                }
                .neon-mix-4 { animation: neon-mix-4 4s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default StyleCarousel;