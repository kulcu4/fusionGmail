import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { User, CollectionItem, ColorPreset, ColorSettings, MediaItem } from '../types';
import { ChevronLeftIcon, CrownIcon, UserProfileIcon, SoundOnIcon, SoundOffIcon, MagicWandIcon, CheckIcon, EditIcon, WallpapersIcon, TrashIcon, ChevronDownIcon } from './icons';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { motion, AnimatePresence } from 'framer-motion';

// --- HELPER FUNCTIONS FOR 3D EFFECT ---
const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  DEVICE_BETA_OFFSET: 20
};

// --- PROPS INTERFACES ---

interface UserProfilePageProps {
    user: User;
    onUpdateUser: (updates: Partial<User>) => void;
    collectionItems: CollectionItem[];
    purchasedItems: string[];
    onClose: () => void;
    recentGenerations: MediaItem[];
    favorites: string[];
    onMediaClick: (src: string, type: 'image' | 'video', styleId?: string) => void;
    onDeleteFavorites: (items: string[]) => void;
    onDeleteRecents: (items: string[]) => void;
}

// --- MEDIA GRID & EMPTY STATE (from MyWallpapersPage) ---
interface MediaGridProps {
    items: MediaItem[];
    onMediaClick: (src: string, type: 'image' | 'video', styleId?: string) => void;
    selectionMode: boolean;
    selectedItems: string[];
    onSelectItem: (src: string) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ items = [], onMediaClick, selectionMode, selectedItems = [], onSelectItem }) => (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((media, index) => {
            const { src, type, styleId } = media;
            const isSelected = selectedItems.includes(src);

            const handleClick = () => {
                if (selectionMode) {
                    onSelectItem(src);
                } else {
                    onMediaClick(src, type, styleId);
                }
            };

            return (
                <div key={index} className="relative group">
                    <button
                        data-sound="click"
                        onClick={handleClick}
                        className={`w-full aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer block ${
                            selectionMode ? (isSelected ? 'border-cyan-400 scale-[0.98]' : 'border-gray-700 hover:border-gray-500') : 'border-transparent hover:border-cyan-400 hover:scale-[1.02]'
                        } shadow-xl`}
                        aria-label={`View wallpaper ${index + 1}`}
                    >
                        {type === 'video' ? (
                             <video 
                                src={src} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                            />
                        ) : (
                            <img 
                                src={src} 
                                alt={`Wallpaper ${index + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                        )}
                         
                        {selectionMode && (
                            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${isSelected ? 'bg-cyan-500 border-cyan-400' : 'bg-black/50 border-gray-400'}`} >
                                {isSelected && <CheckIcon className="w-4 h-4 text-white" />}
                            </div>
                        )}
                    </button>
                </div>
            )
        })}
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-gray-500 py-12">
        <WallpapersIcon className="w-16 h-16" />
        <p className="mt-4 text-center">{message}</p>
    </div>
);


// --- USER PROFILE PAGE ---

const UserProfilePage: React.FC<UserProfilePageProps> = (props) => {
    const { user, onUpdateUser, collectionItems, purchasedItems, onClose, recentGenerations, favorites, onMediaClick, onDeleteFavorites, onDeleteRecents } = props;

    const [activeTab, setActiveTab] = useState<'profile' | 'creations' | 'favorites' | 'owned'>('profile');
    const [isAvatarGridOpen, setIsAvatarGridOpen] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);
    const [username, setUsername] = useState(user.username);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);


    const wrapRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (user.id !== currentUser.id) {
            setCurrentUser(user);
            setUsername(user.username);
        }
    }, [user, currentUser.id]);

    useEffect(() => {
        setSelectionMode(false);
        setSelectedItems([]);
    }, [activeTab]);

    const avatarIds = ['Av_1', 'Av_2', 'Av_3', 'Av_4', 'Av_5', 'Av_6', 'Av_7', 'Av_8', 'Av_9'];
    const CurrentAvatar = () => currentUser.avatarId ? <img src={`/images/${currentUser.avatarId}.png?v=${new Date().getTime()}`} alt="User Avatar" className="w-full h-full rounded-full object-cover" /> : <UserProfileIcon className="w-20 h-20 text-white" />;
    const subscriptionTiers: {[key: string]: string} = { 'none': 'Free Member', 'simple': 'Simple Premium', 'premium': 'Premium Member' };

    const handleUsernameSave = () => {
        const trimmedUsername = username.trim();
        if (trimmedUsername) {
            setCurrentUser(prev => ({...prev, username: trimmedUsername}));
            onUpdateUser({ username: trimmedUsername });
            setIsEditingUsername(false);
        }
    };

    const handleAvatarSelect = (avatarId: string) => {
        const avatarUrl = `/images/${avatarId}.png`;
        setCurrentUser(prev => ({ ...prev, avatarId, avatarUrl }));
        onUpdateUser({ avatarId, avatarUrl });
        setIsAvatarGridOpen(false);
    };
    
    const favoriteItems = useMemo(() => favorites.map(src => {
        const allItems: MediaItem[] = [...recentGenerations, ...collectionItems];
        const item = allItems.find(i => i.src === src);
        return { src, type: item?.type || 'image', styleId: item?.styleId };
    }), [favorites, recentGenerations, collectionItems]);
    
    const ownedItems = useMemo(() => {
        return collectionItems.filter(item => purchasedItems.includes(item.id));
    }, [collectionItems, purchasedItems]);

    const handleSelectItem = (src: string) => {
        setSelectedItems(prev => prev.includes(src) ? prev.filter(item => item !== src) : [...prev, src]);
    };
    
    const handleSelectAll = () => {
        let itemsToSelect: string[] = [];
        if (activeTab === 'creations') itemsToSelect = recentGenerations.map(m => m.src);
        else if (activeTab === 'favorites') itemsToSelect = favorites;
        // 'owned' items are not selectable for deletion

        if(itemsToSelect.length > 0) {
            const allSelected = itemsToSelect.every(item => selectedItems.includes(item));
            if (allSelected) {
                setSelectedItems(prev => prev.filter(item => !itemsToSelect.includes(item)));
            } else {
                const newSelected = new Set([...selectedItems, ...itemsToSelect]);
                setSelectedItems(Array.from(newSelected));
            }
        }
    };
    
    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) return;
        
        if (activeTab === 'creations') onDeleteRecents(selectedItems);
        else if (activeTab === 'favorites') onDeleteFavorites(selectedItems);
        
        setSelectedItems([]);
        setSelectionMode(false);
    };

    const animationHandlers = useMemo(() => {
        let rafId: number | null = null;
    
        const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
            const { clientWidth: width, clientHeight: height } = card;
            const percentX = clamp((100 / width) * offsetX);
            const percentY = clamp((100 / height) * offsetY);
    
            const properties = {
                '--pointer-x': `${percentX}%`,
                '--pointer-y': `${percentY}%`,
                '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
                '--rotate-x': `${round(-(percentX - 50) / 3.5)}deg`,
                '--rotate-y': `${round((percentY - 50) / 3.5)}deg`
            };
    
            Object.entries(properties).forEach(([property, value]) => {
                wrap.style.setProperty(property, value);
            });
        };
    
        const createSmoothAnimation = (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => {
            const startTime = performance.now();
            const targetX = wrap.clientWidth / 2;
            const targetY = wrap.clientHeight / 2;
    
            const animationLoop = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = clamp(elapsed / duration);
                const easedProgress = easeInOutCubic(progress);
    
                const currentX = adjust(easedProgress, 0, 1, startX, targetX);
                const currentY = adjust(easedProgress, 0, 1, startY, targetY);
    
                updateCardTransform(currentX, currentY, card, wrap);
    
                if (progress < 1) {
                    rafId = requestAnimationFrame(animationLoop);
                }
            };
            rafId = requestAnimationFrame(animationLoop);
        };
    
        return {
            updateCardTransform,
            createSmoothAnimation,
            cancelAnimation: () => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
            }
        };
    }, []);

    const handlePointerMove = useCallback((event: PointerEvent) => {
        const card = cardRef.current;
        const wrap = wrapRef.current;
        if (!card || !wrap || !animationHandlers) return;
        const rect = card.getBoundingClientRect();
        animationHandlers.updateCardTransform(event.clientX - rect.left, event.clientY - rect.top, card, wrap);
    }, [animationHandlers]);

    const handlePointerEnter = useCallback(() => {
        const wrap = wrapRef.current;
        if (!wrap || !animationHandlers) return;
        animationHandlers.cancelAnimation();
        wrap.classList.add('active');
    }, [animationHandlers]);

    const handlePointerLeave = useCallback((event: PointerEvent) => {
        const card = cardRef.current;
        const wrap = wrapRef.current;
        if (!card || !wrap || !animationHandlers) return;
        animationHandlers.createSmoothAnimation(ANIMATION_CONFIG.SMOOTH_DURATION, event.offsetX, event.offsetY, card, wrap);
        wrap.classList.remove('active');
    }, [animationHandlers]);

    const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
        const card = cardRef.current;
        const wrap = wrapRef.current;
        if (!card || !wrap || !animationHandlers) return;
        const { beta, gamma } = event;
        if (!beta || !gamma) return;
        const sensitivity = 4;
        animationHandlers.updateCardTransform(
            card.clientWidth / 2 + gamma * sensitivity,
            card.clientHeight / 2 + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * sensitivity,
            card, wrap
        );
    }, [animationHandlers]);

    useEffect(() => {
        if (activeTab !== 'profile') return;
        const card = cardRef.current;
        const wrap = wrapRef.current;
        if (!card || !wrap || !animationHandlers) return;

        const initialX = wrap.clientWidth / 2;
        const initialY = wrap.clientHeight / 2;
        animationHandlers.createSmoothAnimation(ANIMATION_CONFIG.INITIAL_DURATION, initialX, initialY, card, wrap);

        card.addEventListener('pointerenter', handlePointerEnter as EventListener);
        card.addEventListener('pointermove', handlePointerMove as EventListener);
        card.addEventListener('pointerleave', handlePointerLeave as EventListener);
        window.addEventListener('deviceorientation', handleDeviceOrientation);

        return () => {
            card.removeEventListener('pointerenter', handlePointerEnter as EventListener);
            card.removeEventListener('pointermove', handlePointerMove as EventListener);
            card.removeEventListener('pointerleave', handlePointerLeave as EventListener);
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
            animationHandlers.cancelAnimation();
        };
    }, [activeTab, animationHandlers, handlePointerEnter, handlePointerMove, handlePointerLeave, handleDeviceOrientation]);
    
    const tabs: {id: 'profile' | 'creations' | 'favorites' | 'owned', label: string}[] = [
        {id: 'profile', label: 'Profile'},
        {id: 'creations', label: 'Creations'},
        {id: 'favorites', label: 'Favorites'},
        {id: 'owned', label: 'Owned'},
    ];
    
    return (
        <div className="relative z-10 flex flex-col items-center justify-start max-w-lg mx-auto p-4 sm:p-6 pb-24 animate-fade-in no-scrollbar min-h-screen mt-6">
            <div className="w-full sticky top-20 bg-black/90 backdrop-blur-sm z-20 -mx-4 px-4 sm:px-6">
                 <div className="flex border-b border-gray-700">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            data-sound="click"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 font-Roboto italic text-xs uppercase tracking-widest transition-colors duration-300 ${activeTab === tab.id ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-white hover:bg-white/5'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="w-full flex flex-col items-center space-y-8 mt-6">
                {activeTab === 'profile' && (
                    <div ref={wrapRef} className="profile-card-wrapper w-full max-w-md">
                        <div
                            ref={cardRef}
                            className="profile-card-3d bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10"
                        >
                            <div className="h-32 bg-gradient-to-r from-cyan-900 via-fuchsia-900 to-indigo-900 relative flex justify-center items-start pt-4">
                                <div className="text-center pointer-events-auto">
                                    {isEditingUsername ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleUsernameSave()}
                                                onBlur={handleUsernameSave}
                                                className="bg-black/30 backdrop-blur-sm border border-gray-500 rounded-lg py-1 px-3 text-white text-2xl font-bold w-48 text-center"
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 group/username">
                                            <h2 className="text-2xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{currentUser.username}</h2>
                                            {currentUser.subscription === 'premium' && <CrownIcon className="w-5 h-5 text-yellow-400" />}
                                            <button onClick={() => setIsEditingUsername(true)} data-sound="click" className="p-1 text-gray-200 hover:text-white opacity-0 group-hover/username:opacity-100 transition-opacity">
                                                <EditIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 pt-0 text-center">
                                <div className="relative -mt-16 inline-block">
                                    <button
                                        data-sound="click"
                                        onClick={() => setIsAvatarGridOpen(true)}
                                        className="relative w-28 h-28 group"
                                        aria-expanded={isAvatarGridOpen}
                                        aria-controls="avatar-grid"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                                        <div className="relative w-full h-full rounded-full bg-black flex items-center justify-center p-1">
                                            <CurrentAvatar />
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <EditIcon className="w-8 h-8 text-white" />
                                        </div>
                                    </button>
                                </div>
                                
                                <div className="mt-4">
                                    <p className="text-sm text-gray-400 mt-1">{subscriptionTiers[currentUser.subscription]}</p>
                                </div>

                                <div className="mt-6 flex justify-around items-center border-t border-gray-700/50 pt-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-white">{ownedItems.length}</p>
                                        <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Owned</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-cyan-300">{currentUser.coins.toLocaleString()}</p>
                                        <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Coins</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-white">{favorites.length}</p>
                                        <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Favorites</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {(activeTab === 'creations' || activeTab === 'favorites' || activeTab === 'owned') && (
                    <div className="w-full space-y-4 animate-fade-in">
                        { (activeTab === 'creations' || activeTab === 'favorites') && (
                             <div className="w-full flex justify-end">
                                <button
                                    data-sound="click"
                                    onClick={() => setSelectionMode(p => !p)}
                                    className={`px-4 py-2 text-sm font-normal rounded-full transition-colors ${selectionMode ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-white/10 text-cyan-300 hover:bg-white/20'}`}
                                >
                                    {selectionMode ? 'Cancel' : 'Manage'}
                                </button>
                             </div>
                        )}

                        {selectionMode && (
                            <div className="w-full flex justify-between items-center bg-gray-800/50 p-2 rounded-xl transition-all duration-300 animate-fade-in-down border border-gray-700">
                                <button onClick={handleSelectAll} data-sound="click" className="text-xs font-normal text-gray-300 hover:text-white px-2">SELECT ALL</button>
                                <div className="flex space-x-2">
                                    <button
                                        data-sound="click"
                                        onClick={handleDeleteSelected}
                                        disabled={selectedItems.length === 0}
                                        className="flex items-center justify-center gap-1 bg-red-500/20 text-red-300 font-normal py-1.5 px-3 rounded-lg text-sm hover:bg-red-500/30 hover:text-white disabled:opacity-30 transition-colors"
                                        title="Delete selected items"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span>Delete ({selectedItems.length})</span>
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeTab === 'creations' && (recentGenerations.length > 0 ? <MediaGrid items={recentGenerations} onMediaClick={onMediaClick} selectionMode={selectionMode} selectedItems={selectedItems} onSelectItem={handleSelectItem} /> : <EmptyState message="Your generated wallpapers will appear here." />)}
                        {activeTab === 'favorites' && (favoriteItems.length > 0 ? <MediaGrid items={favoriteItems} onMediaClick={onMediaClick} selectionMode={selectionMode} selectedItems={selectedItems} onSelectItem={handleSelectItem} /> : <EmptyState message="Your favorite wallpapers will appear here." />)}
                        {activeTab === 'owned' && (ownedItems.length > 0 ? <MediaGrid items={ownedItems} onMediaClick={(src, type, styleId) => onMediaClick(src, type, styleId)} selectionMode={selectionMode} selectedItems={selectedItems} onSelectItem={handleSelectItem} /> : <EmptyState message="Items you purchase from collections will appear here." />)}
                    </div>
                )}
            </main>

            {isAvatarGridOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setIsAvatarGridOpen(false)}
                >
                    <div 
                        className="w-full max-w-xs bg-gray-950 border border-cyan-500/30 rounded-2xl p-6 shadow-xl animate-fade-in-down"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-sm font-bold tracking-widest text-gray-400 text-center mb-4">CHOOSE AVATAR</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {avatarIds.map(avatarId => {
                                const isSelected = currentUser.avatarId === avatarId;
                                return (
                                    <button
                                        key={avatarId}
                                        data-sound="click"
                                        onClick={() => handleAvatarSelect(avatarId)}
                                        className={`w-full aspect-square rounded-full flex items-center justify-center p-1 transition-all duration-200 transform hover:scale-110 ${isSelected ? 'bg-cyan-500/30 ring-2 ring-cyan-400' : 'bg-white/10'}`}
                                    >
                                        <img src={`/images/${avatarId}.png`} alt={`${avatarId} Avatar`} className="w-full h-full rounded-full object-cover" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                .profile-card-wrapper {
                    perspective: 1500px;
                    transform-style: preserve-3d;
                }
                .profile-card-3d {
                    transform: rotateX(var(--rotate-x, 0)) rotateY(var(--rotate-y, 0));
                    transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
                    transform-style: preserve-3d;
                    will-change: transform;
                }
                .profile-card-wrapper.active .profile-card-3d {
                    transition: none;
                }
                .profile-card-3d::after { /* Glare effect */
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    border-radius: 1rem; /* same as rounded-2xl */
                    background-image: radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%);
                    opacity: 0;
                    transition: opacity 600ms ease;
                    pointer-events: none;
                }
                .profile-card-wrapper.active .profile-card-3d::after {
                    opacity: var(--pointer-from-center, 0);
                    transition-duration: 200ms;
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; } 
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
                .animate-fade-in-down { animation: fadeInDown 0.3s ease-out; } 
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}

export default UserProfilePage;