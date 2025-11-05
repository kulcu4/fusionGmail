// FIX: The component function was incomplete and missing a return statement, which caused a type error.
// The function has been completed with the full implementation, including state management, effects, and the JSX to be rendered.
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CloseIcon, DownloadIcon, SetWallpaperIcon, HeartIcon, GenerateIcon, ChevronDownIcon, ItalicIcon, BoldIcon, RotateIcon, MagicWandIcon, DownloadGifIcon, MagicWandIcon as MotionIcon } from './icons';
import EffectCarousel from './EffectCarousel';
import { dynamicEffects, imageFilters, allEffects, textColors  } from './constants';
import { editWallpaper, startImageAnimation, checkVideoGenerationStatus, getVideoResult } from './services/generationService';
import ParticleOverlay, { ParticleOverlayRef } from './ParticleOverlay';
import { FontFamily, User, EffectOption, TextOverlayState, GenerationProvider, MediaItem } from './types';
import { Operation, GenerateVideosResponse } from '@google/genai';
import { playSound } from './services/soundService';
import { motion, Transition } from 'framer-motion';

interface DetailPageProps {
    media: MediaItem;
    onClose: () => void;
    favorites: string[];
    onToggleFavorite: (src: string, oldSrc?: string) => void;
    unlockedEffects: string[];
    user: User;
    onUnlockRequest: (id: string) => void;
    onUpdateUser: (updates: Partial<User>) => void;
    setConfirmationModal: (modal: any) => void;
    onGoToShop: () => void;
    tempUnlockedItems: string[];
    onClearTempUnlock: (itemId: string) => void;
    provider: GenerationProvider;
}

const fontOptions: FontFamily[] = [
    'sans-serif', 'serif', 'monospace', 'Impact', 'Courier New', 'Comic Sans MS',
    'Arial', 'Verdana', 'Georgia', 'Roboto', 'Open Sans', 'Lato', 
    'Montserrat', 'Oswald', 'Raleway', 'Playfair Display'
];

const effectColors = ['#22d3ee', '#a855f7', '#ec4899', '#facc15', '#4ade80', '#ffffff'];

type DetailTab = 'effects' | 'filters' | 'adjust' | 'text';

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

const DetailPage: React.FC<DetailPageProps> = ({ media, onClose, favorites, onToggleFavorite, unlockedEffects, user, onUnlockRequest, onUpdateUser, setConfirmationModal, onGoToShop, tempUnlockedItems, onClearTempUnlock, provider }) => {
    const [displayMedia, setDisplayMedia] = useState(media);
    const [selectedEffects, setSelectedEffects] = useState<{ [key: string]: { intensity: number, spread?: number, speed?: number, direction?: number } }>({});
    const [effectSettings, setEffectSettings] = useState<{ [key: string]: { color?: string; direction?: string } }>({});
    const [textOverlay, setTextOverlay] = useState<TextOverlayState>({
        enabled: false, text: 'Your Text Here', fontFamily: 'Roboto', fontSize: 48, color: '#FFFFFF', isItalic: false, fontWeight: 'bold', rotation: 0, position: { x: 50, y: 50 }
    });
    const [adjustments, setAdjustments] = useState({ brightness: 100, contrast: 100, saturate: 100 });
    const [isLoading, setIsLoading] = useState(false);
    const [isExportingGif, setIsExportingGif] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeDetailTab, setActiveDetailTab] = useState<DetailTab | null>('effects');
    
    // --- Motion Effects State ---
    const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('unsupported');
    const imageRef = useRef<HTMLImageElement>(null);
    // --- End Motion Effects State ---
    
    const ambientLightEffect = useMemo(() => {
        if (selectedEffects['ambient_light']) {
            const settings = selectedEffects['ambient_light'];
            const color = effectSettings['ambient_light']?.color || '#ffffff';
            const intensity = settings.intensity; // 0 to 1
            const blur = intensity * 100; // e.g., 0 to 100px
            const spread = intensity * 50; // e.g., 0 to 50px
            return {
                boxShadow: `inset 0 0 ${blur}px ${spread}px ${color}`
            };
        }
        return null;
    }, [selectedEffects, effectSettings]);

    const [isAnimating, setIsAnimating] = useState(false);
    const [animationStatus, setAnimationStatus] = useState('');
    const [animationOperation, setAnimationOperation] = useState<Operation<GenerateVideosResponse> | null>(null);
    const animationPollInterval = useRef<number | null>(null);

    const [favoritedVersionSrc, setFavoritedVersionSrc] = useState<string | null>(null);
    
    const [isDraggingText, setIsDraggingText] = useState(false);
    const [isPinching, setIsPinching] = useState(false);
    const initialPinchState = useRef<{dist: number, fontSize: number} | null>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const mediaContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const dragOffset = useRef({x: 0, y: 0});

    const particleOverlayRefs = useRef<Map<string, ParticleOverlayRef | null>>(new Map());
    
    const [editingEffect, setEditingEffect] = useState<EffectOption | null>(null);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    
    const mediaSrcRef = useRef<string | null>(null);

    const isFavorited = useMemo(() => !!favoritedVersionSrc, [favoritedVersionSrc]);
    
    const isVideo = displayMedia.type === 'video';
    const applicableImageFilters = isVideo ? imageFilters.filter(f => f.type !== 'generative') : imageFilters;

    const handleTabClick = (tabId: DetailTab) => {
        setActiveDetailTab(prev => (prev === tabId ? null : tabId));
    };

    const neonGlowAnimation = {
        boxShadow: [
            '0 0 20px rgba(56, 189, 248, 0.4), 0 0 40px rgba(56, 189, 248, 0.2), inset 0 0 20px rgba(56, 189, 248, 0.1)',
            '0 0 30px rgba(56, 189, 248, 0.6), 0 0 60px rgba(56, 189, 248, 0.4), inset 0 0 20px rgba(56, 189, 248, 0.1)',
            '0 0 20px rgba(56, 189, 248, 0.4), 0 0 40px rgba(56, 189, 248, 0.2), inset 0 0 20px rgba(56, 189, 248, 0.1)',
        ],
    };

    const neonGlowTransition: Transition = {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
    };

    const handleMotion = useCallback((event: DeviceOrientationEvent) => {
        const container = mediaContainerRef.current;
        if (!container) return;
        const { beta, gamma } = event; // beta: [-180, 180], gamma: [-90, 90]
        if (beta === null || gamma === null) return;
        
        // Normalize and clamp values for smoother control
        const tiltX = clamp(beta, -45, 45);
        const tiltY = clamp(gamma, -45, 45);

        requestAnimationFrame(() => {
            if (media.styleId === 'three_d_touch') {
                const rotateX = tiltX * -0.4; // Invert for natural feel
                const rotateY = tiltY * 0.4;
                const shadowX = rotateY * 1.5;
                const shadowY = -rotateX * 1.5;
                const shadowBlur = 30 + (Math.abs(rotateX) + Math.abs(rotateY));
                
                container.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
                container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px) scale(0.9)`;
                container.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.5)`;

            } else if (media.styleId === 'parallax') {
                const mediaEl = imageRef.current || videoRef.current;
                if (mediaEl) {
                    const moveX = tiltY * -0.3; // Gamma controls horizontal movement
                    const moveY = tiltX * -0.3; // Beta controls vertical movement
                    mediaEl.style.transition = 'transform 0.1s ease-out';
                    mediaEl.style.transform = `scale(1.15) translateX(${moveX}px) translateY(${moveY}px)`;
                }
            }
        });
    }, [media.styleId]);

    const handlePermissionRequest = useCallback(async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            if (permission === 'granted') {
                window.addEventListener('deviceorientation', handleMotion);
                setPermissionState('granted');
            } else {
                setPermissionState('denied');
            }
        }
    }, [handleMotion]);
    
    useEffect(() => {
        const container = mediaContainerRef.current;
        if (!container) return;

        const isMotionStyle = media.styleId === 'three_d_touch' || media.styleId === 'parallax';
        
        // Reset styles from previous media item
        container.style.transform = '';
        container.style.boxShadow = '';
        const mediaEl = imageRef.current || videoRef.current;
        if (mediaEl) mediaEl.style.transform = '';
        
        if (!isMotionStyle) {
            setPermissionState('unsupported');
            return;
        }

        const init = () => {
             if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                setPermissionState('prompt');
            } else {
                window.addEventListener('deviceorientation', handleMotion);
                setPermissionState('granted');
            }
        };
        
        init();

        return () => {
            window.removeEventListener('deviceorientation', handleMotion);
        };
    }, [media.styleId, handleMotion]);


    useEffect(() => {
        if (mediaSrcRef.current !== media.src) {
            mediaSrcRef.current = media.src;
            
            setDisplayMedia(media);
            setSelectedEffects({});
            setEffectSettings({});
            setAdjustments({ brightness: 100, contrast: 100, saturate: 100 });
            setTextOverlay(p => ({ ...p, enabled: false, text: 'Your Text Here', isItalic: false, fontWeight: 'bold', rotation: 0, position: { x: 50, y: 50 } }));
            setEditingEffect(null);
            
            const initialFavorite = favorites.find(f => f === media.src);
            setFavoritedVersionSrc(initialFavorite || null);
        }
    }, [media, favorites]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setIsColorPickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (favoritedVersionSrc && !favorites.includes(favoritedVersionSrc)) {
            setFavoritedVersionSrc(null);
        }
    }, [favorites, favoritedVersionSrc]);

    const activeCanvasEffects = useMemo(() => {
        return Object.entries(selectedEffects).filter(([id]) => allEffects.find(e => e.id === id)?.type === 'canvas');
    }, [selectedEffects]);

    const hasActiveCanvasEffects = useMemo(() => activeCanvasEffects.length > 0, [activeCanvasEffects]);

    const canExportGif = useMemo(() => {
        if (media.type === 'video') return true;
        if (media.type === 'image' && hasActiveCanvasEffects) return true;
        return false;
    }, [media.type, hasActiveCanvasEffects]);

    const generativeEffects = useMemo(() => {
        const effects: { [key: string]: { intensity: number; spread?: number; color?: string; direction?: string; } } = {};
        Object.keys(selectedEffects)
            .filter((id) => allEffects.find(e => e.id === id)?.type === 'generative')
            .forEach((id) => {
                const { speed, direction, ...settings } = selectedEffects[id];
                effects[id] = { ...settings, ...(effectSettings[id] || {}) };
            });
        return effects;
    }, [selectedEffects, effectSettings]);

    const cssFilters = useMemo(() => {
        const filters: string[] = [];
        Object.keys(selectedEffects).forEach((id) => {
            const settings = selectedEffects[id];
            const effectDetail = allEffects.find(e => e.id === id);
            if (effectDetail?.type !== 'css') return;

            switch (id) {
                case 'blur':
                    filters.push(`blur(${settings.intensity * 10}px)`);
                    break;
                case 'sepia':
                    filters.push(`sepia(${settings.intensity})`);
                    break;
                case 'vaporwave':
                    const intensity = settings.intensity; // 0 to 1
                    filters.push(`sepia(${intensity * 0.4}) hue-rotate(${intensity * -30}deg) saturate(${1 + intensity * 1.5}) contrast(1.1) brightness(1.1)`);
                    break;
            }
        });
        return { filter: filters.join(' ') };
    }, [selectedEffects]);
    
    const adjustmentCssFilter = useMemo(() => {
        const { brightness, contrast, saturate } = adjustments;
        const filters = [];
        if (brightness !== 100) filters.push(`brightness(${brightness / 100})`);
        if (contrast !== 100) filters.push(`contrast(${contrast / 100})`);
        if (saturate !== 100) filters.push(`saturate(${saturate / 100})`);
        return filters.join(' ');
    }, [adjustments]);

    useEffect(() => {
        let isCancelled = false;
    
        const applyGenerativeEffects = async () => {
            if (Object.keys(generativeEffects).length > 0 && !isVideo) {
                setIsLoading(true);
                setError(null);
                try {
                    let imageSrcForEditing = media.src;

                    // If the src is a URL, it must be converted to a data URI before editing.
                    if (imageSrcForEditing.startsWith('http')) {
                        try {
                            const response = await fetch(imageSrcForEditing);
                            if (!response.ok) throw new Error('Network response was not ok while fetching image for editing.');
                            const blob = await response.blob();
                            imageSrcForEditing = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            });
                        } catch (fetchError) {
                            console.error("Error converting URL to data URI for editing:", fetchError);
                            throw new Error("Could not load the source image for editing. Please check your network connection.");
                        }
                    }

                    const editedImageB64 = await editWallpaper(provider, imageSrcForEditing, generativeEffects);
                    if (!isCancelled) {
                        setDisplayMedia({ src: `data:image/jpeg;base64,${editedImageB64}`, type: 'image' });
                    }
                } catch (err: any) {
                    console.error(err);
                    if (!isCancelled) setError(err.message || "Failed to apply effects. Please try again.");
                } finally {
                    if (!isCancelled) setIsLoading(false);
                }
            } else {
                if (displayMedia.src !== media.src) {
                    setDisplayMedia(media);
                }
            }
        };
    
        applyGenerativeEffects();
    
        return () => { isCancelled = true; };
    }, [generativeEffects, media, isVideo, provider]);

    const drawCompositeFrame = async (ctx: CanvasRenderingContext2D, width: number, height: number, sourceMedia: HTMLImageElement | HTMLVideoElement, timeInSeconds = 0) => {
        const particleCanvasSnapshots: HTMLCanvasElement[] = [];
        particleOverlayRefs.current.forEach(ref => {
            const particleCanvas = ref?.getCanvas();
            if (particleCanvas && (particleCanvas.width > 0 && particleCanvas.height > 0)) {
                const snapshotCanvas = document.createElement('canvas');
                snapshotCanvas.width = particleCanvas.width;
                snapshotCanvas.height = particleCanvas.height;
                const snapshotCtx = snapshotCanvas.getContext('2d');
                snapshotCtx?.drawImage(particleCanvas, 0, 0);
                particleCanvasSnapshots.push(snapshotCanvas);
            }
        });
    
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        ctx.filter = `${cssFilters.filter} ${adjustmentCssFilter}`;
    
        if (sourceMedia instanceof HTMLVideoElement) {
            const video = sourceMedia;
            const targetTime = timeInSeconds > 0 && video.duration > 0 ? timeInSeconds % video.duration : 0;
            if (Math.abs(video.currentTime - targetTime) > 0.1) {
                video.currentTime = targetTime;
                await new Promise(resolve => {
                    const handler = () => { video.removeEventListener('seeked', handler); resolve(true); };
                    video.addEventListener('seeked', handler);
                });
            }
        }
    
        ctx.drawImage(sourceMedia, 0, 0, width, height);
        ctx.filter = 'none';
    
        particleCanvasSnapshots.forEach(canvas => {
            ctx.drawImage(canvas, 0, 0, width, height);
        });
    
        if (textOverlay.enabled && textOverlay.text) {
            const container = mediaContainerRef.current;
            const scale = container ? width / container.clientWidth : 1;
            const fontSize = textOverlay.fontSize * scale;
            ctx.font = `${textOverlay.isItalic ? 'italic' : ''} ${textOverlay.fontWeight} ${fontSize}px "${textOverlay.fontFamily}"`;
            ctx.fillStyle = textOverlay.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const x = (textOverlay.position.x / 100) * width;
            const y = (textOverlay.position.y / 100) * height;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(textOverlay.rotation * Math.PI / 180);
            ctx.fillText(textOverlay.text, 0, 0);
            ctx.restore();
        }
    };
    
    const getCompositeImage = (): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            try {
                const compositeCanvas = document.createElement('canvas');
                let sourceMedia: HTMLImageElement | HTMLVideoElement;
                let naturalWidth: number, naturalHeight: number;
    
                if (displayMedia.type === 'video') {
                    if (!videoRef.current) throw new Error("Video element not found for compositing.");
                    sourceMedia = videoRef.current;
                    naturalWidth = (sourceMedia as HTMLVideoElement).videoWidth;
                    naturalHeight = (sourceMedia as HTMLVideoElement).videoHeight;
                } else {
                    const img = new Image();
                    if (displayMedia.src && !displayMedia.src.startsWith('data:')) {
                        img.crossOrigin = "anonymous";
                    }
                    
                    await new Promise<void>((resolveLoad, rejectLoad) => {
                        img.onload = () => resolveLoad();
                        img.onerror = () => rejectLoad(new Error("The source image could not be loaded. It may be a network issue or a cross-origin problem."));
                        img.src = displayMedia.src;
                    });
    
                    if (!img.complete || img.naturalWidth === 0) {
                         throw new Error("The source image is invalid or could not be decoded.");
                    }
    
                    sourceMedia = img;
                    naturalWidth = sourceMedia.naturalWidth;
                    naturalHeight = sourceMedia.naturalHeight;
                }
    
                if (!naturalWidth || !naturalHeight) {
                    naturalWidth = 300;
                    naturalHeight = 533;
                }
    
                compositeCanvas.width = naturalWidth;
                compositeCanvas.height = naturalHeight;
    
                const ctx = compositeCanvas.getContext('2d');
                if (!ctx) return reject(new Error("Could not get canvas context"));
    
                const time = (sourceMedia instanceof HTMLVideoElement) ? sourceMedia.currentTime : 0;
                await drawCompositeFrame(ctx, compositeCanvas.width, compositeCanvas.height, sourceMedia, time);
    
                resolve(compositeCanvas.toDataURL('image/jpeg', 0.95));
            } catch (e) {
                console.error("Error in getCompositeImage:", e);
                reject(e);
            }
        });
    };

    const handleFavoriteClick = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (isFavorited) {
                onToggleFavorite(favoritedVersionSrc!);
                setFavoritedVersionSrc(null);
            } else {
                const imageToSave = await getCompositeImage();
                onToggleFavorite(imageToSave, favoritedVersionSrc || undefined);
                setFavoritedVersionSrc(imageToSave);
            }
            playSound('success');
        } catch (err: any) {
            console.error("Favorite action failed:", err);
            setError(`Failed to save favorite. ${err.message || ''}`);
            playSound('error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleToggleEffect = (effectId: string) => {
        const isCurrentlySelected = selectedEffects[effectId] !== undefined;
        const effectOption = allEffects.find(e => e.id === effectId);
        const isUnlocked = unlockedEffects.includes(effectId);

        if (!isUnlocked) {
            onUnlockRequest(effectId);
            return;
        }

        setSelectedEffects(prev => {
            const newEffects = { ...prev };
            if (newEffects[effectId] !== undefined) delete newEffects[effectId];
            else newEffects[effectId] = { intensity: 0.5, spread: 0.5, speed: 0.5, direction: 0 };
            return newEffects;
        });

        if (effectOption?.hasColorControl || effectOption?.hasSpeedControl || effectOption?.hasDirectionControl || effectOption?.hasSpreadControl) {
            if (!isCurrentlySelected) {
                setEditingEffect(effectOption);
            } else {
                setEditingEffect(null);
            }
        }
    };

    const handleSliderChange = (effectId: string, type: 'intensity' | 'spread' | 'speed' | 'direction', value: number) => {
        setSelectedEffects(prev => {
            const currentSettings = prev[effectId] || { intensity: 0.5 };
            return {
                ...prev,
                [effectId]: {
                    ...currentSettings,
                    [type]: value,
                },
            };
        });
    };
    
    const handleEffectSettingChange = (id: string, key: 'color' | 'direction', value: string) => {
        setEffectSettings(prev => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
    };

    const executeSetOrDownload = async (isSetting: boolean) => {
        setIsLoading(true);
        setError(null);
        try {
            const compositeImage = await getCompositeImage();
            const filename = `wallpaper-${Date.now()}.jpeg`;
    
            const link = document.createElement('a');
            link.href = compositeImage;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            if (isSetting) {
                alert("Image saved! Open your Photos/Gallery app to set it as wallpaper.");
            }
            
            playSound('success');
    
        } catch (err: any) {
            const action = isSetting ? 'set wallpaper' : 'prepare download';
            console.error(`Error during ${action}:`, err);
            setError(`Failed to ${action}. ${err.message || ''}`);
            playSound('error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const createMonetizedAction = (action: () => void) => {
        const cost = 5;
        if (user.subscription === 'none') {
            if (user.coins < cost) {
                setConfirmationModal({
                    isOpen: true,
                    title: 'Not Enough Coins',
                    message: `You need ${cost} coins for this action. You only have ${user.coins}.`,
                    confirmText: 'Go to Shop',
                    onConfirm: onGoToShop,
                });
                return;
            }
            setConfirmationModal({
                isOpen: true,
                title: 'Confirm Action',
                message: `This action costs ${cost} coins. Proceed?`,
                confirmText: `Proceed (${cost} Coins)`,
                onConfirm: () => {
                    onUpdateUser({ coins: user.coins - cost });
                    action();
                },
                cancelText: 'Cancel',
            });
        } else {
            action();
        }
    };
    
    const handleDownload = () => createMonetizedAction(() => executeSetOrDownload(false));
    const handleSet = () => createMonetizedAction(() => executeSetOrDownload(true));
    
    const handleExportGif = () => {
        setConfirmationModal({
            isOpen: true,
            title: 'Coming Soon!',
            message: 'GIF export functionality will be available in a future update.',
            confirmText: 'Got It!',
            onConfirm: () => {},
            cancelText: null
        });
    };

    const handleAnimate = async () => {
        if (displayMedia.type === 'video' || isAnimating) return;
    
        const animationCost = 25;
        if (user.coins < animationCost) {
            setConfirmationModal({
                isOpen: true,
                title: 'Not Enough Coins',
                message: `You need ${animationCost} coins to animate an image. You currently have ${user.coins}.`,
                confirmText: 'Go to Shop',
                onConfirm: onGoToShop,
            });
            return;
        }
    
        setConfirmationModal({
            isOpen: true,
            title: 'Animate Image?',
            message: `This will cost ${animationCost} coins and may take a few minutes. Proceed?`,
            confirmText: `Animate (${animationCost} Coins)`,
            onConfirm: async () => {
                onUpdateUser({ coins: user.coins - animationCost });
                setIsAnimating(true);
                setAnimationStatus('Initializing animation...');
                setError(null);
                try {
                    const compositeImage = await getCompositeImage();
                    const operation = await startImageAnimation(provider, compositeImage);
                    setAnimationOperation(operation);
                } catch (err: any) {
                    setError(err.message || 'Failed to start animation.');
                    setIsAnimating(false);
                    onUpdateUser({ coins: user.coins }); // Refund on failure
                }
            },
            cancelText: 'Cancel',
        });
    };
    
    useEffect(() => {
        if (!animationOperation || animationOperation.done) {
            if (animationPollInterval.current) {
                clearInterval(animationPollInterval.current);
                animationPollInterval.current = null;
            }
            return;
        }

        const poll = async () => {
            try {
                setAnimationStatus('Animating... this may take a few minutes.');
                const updatedOp = await checkVideoGenerationStatus(provider, animationOperation);
                
                if (updatedOp.done) {
                    setAnimationStatus('Finalizing animation...');
                    const videoBlob = await getVideoResult(provider, updatedOp);
                    const videoUrl = URL.createObjectURL(videoBlob);
                    setDisplayMedia({ src: videoUrl, type: 'video' });
                    setAnimationOperation(null);
                    setIsAnimating(false);
                    playSound('success');
                } else {
                     setAnimationOperation(updatedOp); // Continue polling
                }
            } catch (error: any) {
                setError(error.message || 'Animation failed during processing.');
                setIsAnimating(false);
                setAnimationOperation(null);
            }
        };
    
        animationPollInterval.current = window.setInterval(poll, 10000);
    
        return () => {
            if (animationPollInterval.current) clearInterval(animationPollInterval.current);
        };
    }, [animationOperation, provider]);
    
    const textPositionStyle = useMemo((): React.CSSProperties => ({
        position: 'absolute',
        top: `${textOverlay.position.y}%`,
        left: `${textOverlay.position.x}%`,
        transform: `translate(-50%, -50%) rotate(${textOverlay.rotation}deg)`,
        fontFamily: textOverlay.fontFamily,
        fontSize: `${textOverlay.fontSize}px`,
        fontStyle: textOverlay.isItalic ? 'italic' : 'normal',
        fontWeight: textOverlay.fontWeight,
        color: textOverlay.color,
        textShadow: '0 0 5px rgba(0,0,0,0.7)',
        cursor: 'move',
        userSelect: 'none',
        whiteSpace: 'nowrap',
    }), [textOverlay]);

    const handleTextMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!textRef.current || !mediaContainerRef.current) return;
        e.preventDefault();
        setIsDraggingText(true);
        const textRect = e.currentTarget.getBoundingClientRect();
        const containerRect = mediaContainerRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - textRect.left + (textRect.width / 2) - (textOverlay.position.x / 100 * containerRect.width),
            y: e.clientY - textRect.top + (textRect.height / 2) - (textOverlay.position.y / 100 * containerRect.height),
        };
    };

    const handleTextTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!textRef.current || !mediaContainerRef.current) return;

        if (e.touches.length === 1) {
            setIsPinching(false);
            initialPinchState.current = null;
            setIsDraggingText(true);
            const touch = e.touches[0];
            const textRect = e.currentTarget.getBoundingClientRect();
            const containerRect = mediaContainerRef.current.getBoundingClientRect();
            dragOffset.current = {
                x: touch.clientX - textRect.left + (textRect.width / 2) - (textOverlay.position.x / 100 * containerRect.width),
                y: touch.clientY - textRect.top + (textRect.height / 2) - (textOverlay.position.y / 100 * containerRect.height),
            };
        } else if (e.touches.length === 2) {
            e.preventDefault();
            setIsDraggingText(false);
            setIsPinching(true);
            const dist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            initialPinchState.current = { dist, fontSize: textOverlay.fontSize };
        }
    };

    const handleDragMove = (clientX: number, clientY: number) => {
        if (!isDraggingText || !mediaContainerRef.current) return;
        const containerRect = mediaContainerRef.current.getBoundingClientRect();
        
        let x = clientX - containerRect.left;
        let y = clientY - containerRect.top;
        
        let xPercent = (x / containerRect.width) * 100;
        let yPercent = (y / containerRect.height) * 100;

        xPercent = Math.max(0, Math.min(100, xPercent));
        yPercent = Math.max(0, Math.min(100, yPercent));

        setTextOverlay(p => ({ ...p, position: { x: xPercent, y: yPercent } }));
    };
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if(isDraggingText) handleDragMove(e.clientX, e.clientY);
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (isDraggingText && e.touches.length === 1) {
                handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
            } else if (isPinching && e.touches.length === 2 && initialPinchState.current) {
                e.preventDefault();
                const dist = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                const scale = dist / initialPinchState.current.dist;
                const newFontSize = Math.round(initialPinchState.current.fontSize * scale);
                setTextOverlay(p => ({ ...p, fontSize: Math.max(12, Math.min(128, newFontSize)) }));
            }
        };
        const handleEnd = () => {
            setIsDraggingText(false);
            setIsPinching(false);
            initialPinchState.current = null;
        };

        if (isDraggingText || isPinching) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDraggingText, isPinching]);
    
    const isActionDisabled = isLoading || isAnimating;
    const isParallax = media.styleId === 'parallax';

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex flex-col items-center justify-end sm:justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
            <button data-sound="click" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-[60]">
                <CloseIcon className="w-8 h-8" />
            </button>

            <div 
                ref={mediaContainerRef}
                className="relative w-full max-w-[300px] sm:max-w-[350px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20 mb-4 sm:mb-0 z-50"
            >
                 {(isLoading || isAnimating) && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-20 h-20 bg-cyan-500/30 rounded-full animate-ping"></div>
                            <GenerateIcon className="w-12 h-12 text-cyan-400 animate-pulse" />
                        </div>
                        <p className="mt-4 text-lg font-semibold">{isAnimating ? animationStatus : (error || 'Processing...')}</p>
                    </div>
                )}
                 {permissionState === 'prompt' && (
                    <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                        <div className="w-16 h-16 mb-4 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-full flex items-center justify-center">
                            <MotionIcon className="w-8 h-8 text-cyan-300" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Enable Motion Effects</h3>
                        <p className="text-sm text-gray-300 mb-4">This style uses your device's motion sensors for a 3D effect. Please grant permission to continue.</p>
                        <button onClick={handlePermissionRequest} className="bg-cyan-500 text-black font-bold py-2 px-6 rounded-full">
                            Enable Motion
                        </button>
                    </div>
                )}
                {permissionState === 'denied' && (
                    <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                        <p className="text-sm text-red-400">Motion access was denied. You can change this in your browser settings.</p>
                    </div>
                )}
                {activeCanvasEffects.map(([effect, settings]) => (
                    <ParticleOverlay
                        key={effect}
                        ref={(el) => { particleOverlayRefs.current.set(effect, el); }}
                        effect={effect}
                        intensity={settings.intensity}
                        speed={settings.speed}
                        direction={settings.direction}
                        spread={settings.spread}
                    />
                ))}
                
                {displayMedia.type === 'video' ? (
                    <video
                        ref={videoRef}
                        key={displayMedia.src}
                        src={displayMedia.src}
                        crossOrigin="anonymous"
                        className={`w-full h-full object-cover transition-all duration-500 animate-image-reveal ${isLoading ? 'blur-sm brightness-75' : ''} ${isParallax ? 'transform scale-115' : ''}`}
                        style={{ filter: `${cssFilters.filter} ${adjustmentCssFilter}` }}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                ) : (
                    <img 
                        ref={imageRef}
                        key={displayMedia.src}
                        src={displayMedia.src} 
                        alt="Selected wallpaper" 
                        crossOrigin="anonymous"
                        className={`w-full h-full object-cover transition-all duration-500 animate-image-reveal ${isLoading ? 'blur-sm brightness-75' : ''} ${isParallax ? 'transform scale-115' : ''}`} 
                        style={{ filter: `${cssFilters.filter} ${adjustmentCssFilter}` }}
                    />
                )}

                {ambientLightEffect && (
                    <div 
                        className="absolute inset-0 pointer-events-none z-10"
                        style={ambientLightEffect}
                    />
                )}

                {textOverlay.enabled && (
                    <div ref={textRef} style={textPositionStyle} onMouseDown={handleTextMouseDown} onTouchStart={handleTextTouchStart}>
                        {textOverlay.text}
                    </div>
                )}
            </div>

            {editingEffect && (
                 <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setEditingEffect(null)}>
                    <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs p-4 flex flex-col space-y-4 shadow-2xl animate-fade-in-down rounded-xl border"
                        onClick={e => e.stopPropagation()}
                        style={{
                            backdropFilter: 'blur(16px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                            backgroundColor: 'rgba(10, 25, 47, 0.75)',
                            borderColor: 'rgba(56, 189, 248, 0.6)',
                            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4), 0 0 40px rgba(56, 189, 248, 0.2), inset 0 0 20px rgba(56, 189, 248, 0.1)',
                        }}
                    >
                        <h3 className="text-sm font-bold tracking-widest text-cyan-300 text-center">{editingEffect.label}</h3>
                        {editingEffect.hasSlider && (
                            <div className="w-full">
                                <label className="text-xs text-cyan-100">{editingEffect.sliderLabel}</label>
                                <input
                                    type="range" min="0" max="1" step="0.05"
                                    value={selectedEffects[editingEffect.id]?.intensity || 0.5}
                                    onChange={(e) => handleSliderChange(editingEffect.id, 'intensity', parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer range-thumb-small"
                                />
                            </div>
                        )}
                         {editingEffect.hasSpeedControl && (
                            <div className="w-full">
                                <label className="text-xs text-cyan-100">{editingEffect.speedLabel}</label>
                                <input
                                    type="range" min="0" max="1" step="0.05"
                                    value={selectedEffects[editingEffect.id]?.speed || 0.5}
                                    onChange={(e) => handleSliderChange(editingEffect.id, 'speed', parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer range-thumb-small"
                                />
                            </div>
                        )}
                        {editingEffect.hasDirectionControl && (
                            <div className="w-full">
                                <label className="text-xs text-cyan-100">{editingEffect.directionLabel}</label>
                                <input
                                    type="range" min="-45" max="45" step="5"
                                    value={selectedEffects[editingEffect.id]?.direction || 0}
                                    onChange={(e) => handleSliderChange(editingEffect.id, 'direction', parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer range-thumb-small"
                                />
                            </div>
                        )}
                        {editingEffect.hasSpreadControl && (
                            <div className="w-full">
                                <label className="text-xs text-cyan-100">{editingEffect.spreadLabel}</label>
                                <input
                                    type="range" min="0" max="1" step="0.05"
                                    value={selectedEffects[editingEffect.id]?.spread || 0.5}
                                    onChange={(e) => handleSliderChange(editingEffect.id, 'spread', parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer range-thumb-small"
                                />
                            </div>
                        )}
                        {editingEffect.hasColorControl && (
                            <div className="w-full flex justify-center items-center gap-2 pt-1 flex-wrap">
                                {effectColors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => handleEffectSettingChange(editingEffect.id, 'color', color)}
                                        className={`w-6 h-6 rounded-full border-2 transition-all ${effectSettings[editingEffect.id]?.color === color ? 'border-white scale-110' : 'border-transparent hover:border-white/50'}`}
                                        style={{ backgroundColor: color }}
                                        aria-label={`Set color to ${color}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                 </div>
            )}
            
            <motion.div
                className={`w-full max-w-xl p-4 flex flex-col space-y-4 no-scrollbar overflow-y-auto max-h-[55vh] sm:max-h-[80vh] z-50 transition-opacity rounded-xl border ${isActionDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                style={{
                    backdropFilter: 'blur(16px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                    backgroundColor: 'rgba(10, 25, 47, 0.75)',
                    borderColor: 'rgba(56, 189, 248, 0.6)',
                }}
                animate={neonGlowAnimation}
                transition={neonGlowTransition}
            >
                <div className="flex w-full justify-around items-center border-b border-cyan-400/20 px-2">
                    {(['effects', 'filters', 'adjust', 'text'] as const).map(tab => (
                         <button
                            key={tab}
                            onClick={() => handleTabClick(tab)}
                            className={`flex-1 py-2 text-xs font-bold tracking-wider uppercase transition-colors duration-300 ${activeDetailTab === tab ? 'text-cyan-300 border-b-2 border-cyan-400' : 'text-cyan-100 hover:text-cyan-400'}`}
                        >
                            {tab === 'effects' ? 'Effects' : tab === 'filters' ? 'Filters' : tab}
                        </button>
                    ))}
                </div>

                <div className="min-h-[220px] animate-fade-in">
                    {activeDetailTab === 'effects' && (
                         <EffectCarousel 
                            options={dynamicEffects} 
                            selectedEffects={selectedEffects} 
                            onToggleEffect={handleToggleEffect}
                            onSliderChange={handleSliderChange}
                            unlockedEffects={unlockedEffects}
                            user={user}
                            onUnlockRequest={onUnlockRequest}
                        />
                    )}
                     {activeDetailTab === 'filters' && (
                         <EffectCarousel 
                            options={applicableImageFilters} 
                            selectedEffects={selectedEffects} 
                            onToggleEffect={handleToggleEffect}
                            onSliderChange={handleSliderChange}
                            unlockedEffects={unlockedEffects}
                            user={user}
                            onUnlockRequest={onUnlockRequest}
                        />
                    )}
                    {activeDetailTab === 'adjust' && (
                        <div className="space-y-4 bg-cyan-950/20 p-3 rounded-lg animate-fade-in-down">
                            <div>
                                <label className="text-xs font-bold tracking-widest text-cyan-300 flex justify-between">
                                    <span>BRIGHTNESS</span>
                                    <span className="text-cyan-100">{adjustments.brightness}%</span>
                                </label>
                                <input type="range" min="50" max="150" value={adjustments.brightness} 
                                    onChange={e => setAdjustments(p => ({...p, brightness: parseInt(e.target.value)}))} 
                                    className="w-full h-1.5 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer range-thumb-small"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold tracking-widest text-cyan-300 flex justify-between">
                                    <span>CONTRAST</span>
                                    <span className="text-cyan-100">{adjustments.contrast}%</span>
                                </label>
                                <input type="range" min="50" max="150" value={adjustments.contrast} 
                                    onChange={e => setAdjustments(p => ({...p, contrast: parseInt(e.target.value)}))} 
                                    className="w-full h-1.5 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer range-thumb-small"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold tracking-widest text-cyan-300 flex justify-between">
                                    <span>SATURATION</span>
                                    <span className="text-cyan-100">{adjustments.saturate}%</span>
                                </label>
                                <input type="range" min="0" max="200" value={adjustments.saturate} 
                                    onChange={e => setAdjustments(p => ({...p, saturate: parseInt(e.target.value)}))} 
                                    className="w-full h-1.5 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer range-thumb-small"/>
                            </div>
                        </div>
                    )}
                    {activeDetailTab === 'text' && (
                        <div className="space-y-4 bg-cyan-950/20 p-3 rounded-lg animate-fade-in-down">
                            <div className="flex items-center justify-between">
                                <label htmlFor="text-enabled" className="text-sm font-semibold text-cyan-100">Enable Text Overlay</label>
                                <button onClick={() => setTextOverlay(p => ({ ...p, enabled: !p.enabled }))} className={`relative w-12 h-6 rounded-full transition-colors ${textOverlay.enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${textOverlay.enabled ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>
                            <input type="text" value={textOverlay.text} onChange={e => setTextOverlay(p => ({...p, text: e.target.value}))} className="w-full bg-cyan-900/30 border border-cyan-400/30 rounded-md py-2 px-3 text-cyan-100 placeholder-cyan-200/50" placeholder="Enter text..." />
                            <p className="text-xs text-gray-500 text-center -mt-2">Hint: Drag with one finger, pinch to resize.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold tracking-widest text-cyan-300">FONT</label>
                                    <div className="relative">
                                        <select
                                            value={textOverlay.fontFamily}
                                            onChange={e => setTextOverlay(p => ({...p, fontFamily: e.target.value as FontFamily}))}
                                            className="w-full bg-cyan-900/30 border border-cyan-400/30 rounded-md py-1.5 px-3 text-cyan-100 appearance-none text-sm"
                                        >
                                            {fontOptions.map(font => (
                                                <option key={font} value={font} style={{fontFamily: font}} className="bg-slate-900 text-cyan-100">{font}</option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="w-4 h-4 text-cyan-200/70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                                <div ref={colorPickerRef} className="relative">
                                        <label className="text-xs font-bold tracking-widest text-cyan-300">COLOR</label>
                                        <div className="mt-1">
                                        <button onClick={() => setIsColorPickerOpen(p => !p)} className="w-full h-9 rounded-md border border-cyan-400/30 flex items-center justify-between px-2" style={{ backgroundColor: textOverlay.color }}>
                                            <span className="w-5 h-5" />
                                            <ChevronDownIcon className={`w-5 h-5 text-cyan-100`}/>
                                        </button>
                                        </div>
                                        {isColorPickerOpen && (
                                        <div className="absolute bottom-full right-0 mb-1 w-40 bg-slate-900/80 backdrop-blur-sm border border-cyan-400/30 p-2 rounded-lg grid grid-cols-6 gap-2 z-10">
                                            {textColors.map(color => (
                                                <button key={color} onClick={() => { setTextOverlay(p => ({...p, color})); setIsColorPickerOpen(false); }} className={`w-6 h-6 rounded-full border-2 ${textOverlay.color.toLowerCase() === color.toLowerCase() ? 'border-white' : 'border-transparent'}`} style={{backgroundColor: color}} />
                                            ))}
                                        </div>
                                        )}
                                    </div>
                            </div>
                            <div className="flex items-center justify-start gap-2 pt-2">
                                <button onClick={() => setTextOverlay(p => ({...p, isItalic: !p.isItalic}))} className={`p-2 rounded-md transition-colors h-9 ${textOverlay.isItalic ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-900/30 text-cyan-100 hover:text-cyan-400'}`}>
                                    <ItalicIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => setTextOverlay(p => ({ ...p, fontWeight: p.fontWeight === 'bold' ? 'normal' : 'bold' }))} className={`p-2 rounded-md transition-colors h-9 ${textOverlay.fontWeight === 'bold' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-900/30 text-cyan-100 hover:text-cyan-400'}`}>
                                    <BoldIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => setTextOverlay(p => ({ ...p, rotation: (p.rotation + 45) % 360 }))} className="p-2 rounded-md bg-cyan-900/30 text-cyan-100 hover:text-cyan-400 transition-colors h-9">
                                    <RotateIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {error && !isLoading && <p className="text-red-400 text-center text-sm">{error}</p>}
                {/* USER CUSTOMIZATION: To adjust the vertical position of the main action buttons below, change the '-translate-y-10' class on the Download, Favorite, and Set Wallpaper buttons. */}
                <div className="flex items-center justify-around gap-2 pt-1">
                    <button data-sound="click" onClick={handleDownload} disabled={isActionDisabled} title="Download" className="p-3 bg-cyan-900/30 border border-cyan-400/50 rounded-full flex items-center justify-center hover:bg-cyan-800/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform -translate-y-10">
                        <DownloadIcon className="w-6 h-6 text-cyan-100" />
                    </button>
                    {canExportGif && (
                        <button data-sound="click" onClick={handleExportGif} disabled={isActionDisabled || isExportingGif} title="Download as GIF" className="p-3 bg-cyan-900/30 border border-cyan-400/50 rounded-full flex items-center justify-center hover:bg-cyan-800/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {isExportingGif ? (
                                <svg className="animate-spin h-6 w-6 text-cyan-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <DownloadGifIcon className="w-6 h-6 text-cyan-100" />
                            )}
                        </button>
                    )}
                     <button
                        data-sound="click"
                        onClick={handleFavoriteClick}
                        className={`p-3 rounded-full transition-all disabled:opacity-50 transform -translate-y-10 ${isFavorited
                            ? 'bg-red-500/20 border-red-500 border hover:bg-red-500/30'
                            : 'bg-cyan-900/30 border border-cyan-400/50 hover:bg-cyan-800/40'
                        }`}
                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        title={isFavorited ? 'Unfavorite' : 'Favorite'}
                        disabled={isActionDisabled}
                    >
                        <HeartIcon className={`w-6 h-6 ${isFavorited ? 'text-red-500' : 'text-cyan-100'}`} filled={isFavorited} />
                    </button>
                    <button data-sound="click" onClick={handleSet} disabled={isActionDisabled} title="Set as Wallpaper" className="p-3 bg-cyan-900/30 border border-cyan-400/50 rounded-full flex items-center justify-center hover:bg-cyan-800/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform -translate-y-10">
                        <SetWallpaperIcon className="w-6 h-6 text-cyan-100" />
                    </button>
                </div>
            </motion.div>
            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-fade-in-down {
                     animation: fadeInDown 0.3s ease-out;
                }
                .animate-image-reveal {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
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

export default DetailPage;
