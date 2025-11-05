import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageGrid from './components/ImageGrid';
import { generateWallpaper, startVideoGeneration, checkVideoGenerationStatus, getVideoResult } from './services/generationService';
import {
    styles as originalStyles,
    uiStyleCategories as originalUiStyleCategories,
    freeStyleIds,
    allEffects,
    freeEffectIds,
    samplePrompts,
    animationOptions,
    animationPresets,
    previewSvgTemplateDefault,
    previewSvgTemplatePixelArt,
    previewSvgTemplateWatercolor,
    previewSvgTemplateGeometric,
    previewSvgTemplateComic,
    previewSvgTemplateLowPoly,
    previewSvgTemplateCyberpunk,
    previewSvgTemplateVaporwave,
    previewSvgTemplateSciFi,
    previewSvgTemplateFantasy,
    previewSvgTemplateOrganic,
    previewSvgTemplateSteampunk,
    previewSvgTemplate3DBlocks,
    previewSvgTemplate3DVoxel,
    styleDescriptions,
    defaultColorPresets,
} from './constants';
import { placeholderImageUrls } from './placeholderData';
import BottomNav from './components/BottomNav';
import ActionButtons from './components/ActionButtons';
import StyleCarousel from './components/StyleCarousel';
import { User, Page, Option, CollectionItem, ColorPreset, ColorSettings, GenerationProvider, MediaItem } from './types';
import DetailPage from './components/DetailPage';
import UserProfilePage from './components/UserProfilePage';
import SettingsPage from './components/SettingsPage';
import { playSound, toggleSound, getIsSoundEnabled } from './services/soundService';
import { CloseIcon, PadlockIcon, UploadIcon, TrashIcon, CheckIcon, EditIcon, MagnifyingGlassIcon, ChevronDownIcon } from './components/icons';
import OnboardingModal from './components/OnboardingModal';
import ShopPage from './components/ShopPage';
import AnimationCarousel from './components/AnimationCarousel';
import { useDraggableScroll } from './hooks/useDraggableScroll';
import CollectionsPage from './components/CollectionsPage';
import DynamicBackground from './components/DynamicBackground';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    confirmText: string;
    cancelText?: string | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText = 'Cancel' }) => {
    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm bg-gray-950 border border-cyan-500/30 rounded-2xl p-6 relative shadow-2xl shadow-cyan-500/20"
                onClick={e => e.stopPropagation()}
            >
                <button data-sound="click" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-center text-cyan-400 mb-4">{title}</h2>
                <div className="text-center text-gray-300 text-sm mb-6">{message}</div>
                <div className="flex flex-col space-y-3">
                    <button
                        data-sound="click"
                        onClick={handleConfirm}
                        className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-full text-base tracking-wider hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    >
                        {confirmText}
                    </button>
                    {cancelText && (
                        <button
                            data-sound="click"
                            onClick={onClose}
                            className="w-full bg-white/10 text-gray-300 font-bold py-3 px-4 rounded-full text-base tracking-wider hover:bg-white/20"
                        >
                            {cancelText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

interface EditCollectionItemsModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCount: number;
    onSave: (updates: { cost: number; isFree: boolean }) => void;
}

const EditCollectionItemsModal: React.FC<EditCollectionItemsModalProps> = ({ isOpen, onClose, selectedCount, onSave }) => {
    const [cost, setCost] = useState('');
    const [isFree, setIsFree] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCost('');
            setIsFree(false);
        }
    }, [isOpen]);


    if (!isOpen) return null;

    const handleSave = () => {
        const finalCost = isFree ? 0 : Number(cost) || 0;
        onSave({ cost: finalCost, isFree });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="w-full max-w-sm bg-gray-950 border border-cyan-500/30 rounded-2xl p-6 relative shadow-2xl shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
                <button data-sound="click" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><CloseIcon className="w-6 h-6" /></button>
                <h2 className="text-xl font-bold text-center text-cyan-400 mb-6">Edit {selectedCount} Item(s)</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <label htmlFor="is-free-toggle" className="font-semibold text-gray-200">
                            {isFree ? 'Set as: Unlocked (Free)' : 'Set as: Locked (Costs Coins)'}
                        </label>
                        <button onClick={() => setIsFree(p => !p)} className={`relative w-12 h-6 rounded-full transition-colors ${!isFree ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${!isFree ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="item-cost" className="text-sm font-semibold text-gray-300 mb-2">Set Coin Cost</label>
                        <input
                            id="item-cost"
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            disabled={isFree}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Enter cost for all selected..."
                        />
                    </div>
                </div>
                <div className="mt-6 flex flex-col space-y-3">
                    <button data-sound="click" onClick={handleSave} className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-full">Apply Changes</button>
                    <button data-sound="click" onClick={onClose} className="w-full bg-white/10 text-gray-300 font-bold py-3 px-4 rounded-full hover:bg-white/20">Cancel</button>
                </div>
            </div>
        </div>
    );
};

interface EditStyleModalProps {
    isOpen: boolean;
    onClose: () => void;
    style: Option | null;
    onSave: (styleId: string, newIcon: string) => void;
}

const EditStyleModal: React.FC<EditStyleModalProps> = ({ isOpen, onClose, style, onSave }) => {
    const [newIconPreview, setNewIconPreview] = useState<string | null>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setNewIconPreview(null);
        }
    }, [isOpen]);

    if (!isOpen || !style) return null;

    const handleUploadClick = () => {
        uploadInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewIconPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (newIconPreview) {
            onSave(style.id, newIconPreview);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <input
                type="file"
                ref={uploadInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
            />
            <div className="w-full max-w-sm bg-gray-950 border border-cyan-500/30 rounded-2xl p-6 relative shadow-2xl shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
                <button data-sound="click" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><CloseIcon className="w-6 h-6" /></button>
                <h2 className="text-xl font-bold text-center text-cyan-400 mb-4">Edit Style: {style.label}</h2>
                <div className="flex flex-col items-center space-y-4">
                    <img src={newIconPreview || style.previewImage} alt="Style icon preview" className="w-32 h-32 rounded-2xl object-cover border-2 border-gray-600"/>
                    <button data-sound="click" onClick={handleUploadClick} className="w-full bg-white/10 text-gray-300 font-bold py-3 px-4 rounded-full hover:bg-white/20">
                        Upload New Icon (.png)
                    </button>
                </div>
                <div className="mt-6 flex flex-col space-y-3">
                    <button data-sound="click" onClick={handleSave} disabled={!newIconPreview} className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</button>
                </div>
            </div>
        </div>
    );
};


function hashStringToColor(str: string, saturation = 90, lightness = 75) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const sortedStylesInitial = [...originalStyles].sort((a, b) => a.label.localeCompare(b.label));
const firstStyleInitial = sortedStylesInitial[0] || originalStyles[0];

const PROMPT_MAX_LENGTH = 1000;

const initialCollectionItems: CollectionItem[] = [
    { id: 'col1', name: 'Cosmic Drift', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/6e9e4e20-7212-4f1c-8b83-3e1e405a0d5c', type: 'image', cost: 50, isFree: false, category: 'Space' },
    { id: 'col2', name: 'Neon City', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/12b4e7a8-1a4e-4f7f-8c3b-48c279a0b9e8', type: 'image', cost: 50, isFree: false, category: 'Cityscapes' },
    { id: 'col3', name: 'Forest Spirit', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/a8f2e245-8408-4d57-8c8b-59b1e9e0c1f5', type: 'image', cost: 0, isFree: true, category: 'Nature' },
    { id: 'col4', name: 'Abstract Geometry', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/1c6d1d4f-9e8a-4b9a-8a3a-2b4e2d3e1b1a', type: 'image', cost: 25, isFree: false, category: 'Abstract' },
    { id: 'col5', name: 'Mecha Battle', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/d8d0d3d5-1f9e-4f6c-8e4a-5b6c3d4e2f8c', type: 'image', cost: 75, isFree: false, category: 'Sci-Fi' },
    { id: 'col6', name: 'Enchanted Forest', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/e3a8b4c7-6e6a-4b0c-8a9a-3e5f4a6b1c2d', type: 'image', cost: 60, isFree: false, category: 'Nature' },
    { id: 'col7', name: 'Cyber Runner', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6', type: 'image', cost: 80, isFree: false, category: 'Cityscapes' },
    { id: 'col8', name: 'Dragon\'s Lair', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/c4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9', type: 'image', cost: 90, isFree: false, category: 'Fantasy' },
    { id: 'col9', name: 'Serene Lake', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/d8e9f0a1-b2c3-d4e5-f6a7-b8c9d0e1f2a3', type: 'image', cost: 0, isFree: true, category: 'Nature' },
    { id: 'col10', name: 'Steampunk Owl', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/e1f2a3b4-c5d6-e7f8-a9b0-c1d2e3f4a5b6', type: 'image', cost: 70, isFree: false, category: 'Fantasy' },
    { id: 'vid1', name: 'Dynamic Flow', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/4d8f2d1e-8e3a-4f5c-9c7b-3b4e1d2c3b4a.webm', type: 'video', cost: 100, isFree: false, category: 'Abstract' },
    { id: 'vid2', name: 'Galactic Voyage', src: 'https://storage.googleapis.com/aistudio-project-assets/f9311339-7123-4f93-9c4c-ca631a01152a/5e9f0a1b-2c3d-4e5f-6a7b-8c9d0e1f2a3b.webm', type: 'video', cost: 120, isFree: false, category: 'Space' },
];


const App: React.FC = () => {
    const initialStyles = useMemo(() => {
        return originalStyles.map(style => {
            const color1 = hashStringToColor(style.id);
            const color2 = hashStringToColor(style.label);

            let template = previewSvgTemplateDefault;
            const styleWithPreviewType = style as Option & { previewType?: string };

            switch(styleWithPreviewType.previewType) {
                case 'pixel': template = previewSvgTemplatePixelArt; break;
                case 'watercolor': template = previewSvgTemplateWatercolor; break;
                case 'geometric': template = previewSvgTemplateGeometric; break;
                case 'comic': template = previewSvgTemplateComic; break;
                case 'low_poly': template = previewSvgTemplateLowPoly; break;
                case 'cyberpunk': template = previewSvgTemplateCyberpunk; break;
                case 'vaporwave': template = previewSvgTemplateVaporwave; break;
                case 'sci_fi': template = previewSvgTemplateSciFi; break;
                case 'fantasy': template = previewSvgTemplateFantasy; break;
                case 'organic': template = previewSvgTemplateOrganic; break;
                case 'steampunk': template = previewSvgTemplateSteampunk; break;
                case '3d_blocks': template = previewSvgTemplate3DBlocks; break;
                case '3d_voxel': template = previewSvgTemplate3DVoxel; break;
            }

            const svgString = template
                .replace(/{color1}/g, color1)
                .replace(/{color2}/g, color2);
            const previewImage = `data:image/svg+xml;base64,${btoa(svgString)}`;
            return { ...style, previewImage };
        });
    }, []);

    const [appStyles, setAppStyles] = useState(initialStyles);

    useEffect(() => {
        try {
            const customIcons = JSON.parse(localStorage.getItem('wallpapersai_custom_icons') || '{}');
            if (Object.keys(customIcons).length > 0) {
                setAppStyles(prevStyles => prevStyles.map(style => ({
                    ...style,
                    previewImage: customIcons[style.id] || style.previewImage,
                })));
            }
        } catch (e) {
            console.error("Failed to load custom icons from localStorage", e);
        }
    }, [initialStyles]);

    const uiStyleCategories = useMemo(() => {
        return originalUiStyleCategories.map(category => ({
            ...category,
            styles: category.styles.map(style => {
                const foundStyle = appStyles.find(s => s.id === style.id);
                return foundStyle || style;
            })
        }));
    }, [appStyles]);

    // Core Generation State
    const [prompt, setPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(firstStyleInitial.id);
    const [selectedStyleDetails, setSelectedStyleDetails] = useState<Option | null>(appStyles.find(s => s.id === firstStyleInitial.id) || appStyles[0]);
    const [imageCount, setImageCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<MediaItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [generationStatus, setGenerationStatus] = useState<string | undefined>();
    const [provider, setProvider] = useState<GenerationProvider>('gemini');

    // Animation/Camera State
    const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
    const [animationSettings, setAnimationSettings] = useState({
        zoomAmount: 25,
        panDirection: 'right',
        swirlDirection: 'clockwise',
        tiltDirection: 'up'
    });
    const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'needed' | 'selected'>('checking');

    // UI State
    const [activeControlTab, setActiveControlTab] = useState<'styles' | 'camera'>('styles');
    const [activeStyleCategory, setActiveStyleCategory] = useState('All');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryContainerRef = useRef<HTMLDivElement>(null);
    const [editingStyle, setEditingStyle] = useState<Option | null>(null);
    const [isEditStyleModalOpen, setIsEditStyleModalOpen] = useState(false);


    // Navigation and User State
    const [page, setPage] = useState<Page>('home');
    const [previousPage, setPreviousPage] = useState<Page>('home');
    const [returnPage, setReturnPage] = useState<Page>('home');
    const [user, setUser] = useState<User>({ id: 'user1', username: 'Overseer', subscription: 'none', coins: 100, avatarId: 'Av_1', avatarUrl: '/images/Av_1.png' });
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [favoritedMedia, setFavoritedMedia] = useState<string[]>([]);
    const [recentGenerations, setRecentGenerations] = useState<MediaItem[]>([]);
    const [unlockedItems, setUnlockedItems] = useState<{ [key: string]: number }>({});
    
    const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(initialCollectionItems);
    const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

    const [tempUnlockedItems, setTempUnlockedItems] = useState<string[]>([]);

    // Settings
    const [isSoundEnabled, setIsSoundEnabled] = useState(getIsSoundEnabled());
    const [dynamicBackground, setDynamicBackground] = useState<string>('none');
    const [selectedColorPreset, setSelectedColorPreset] = useState<ColorPreset>(defaultColorPresets[0]);
    const [colorSettings, setColorSettings] = useState<ColorSettings>(defaultColorPresets[0].settings);


    // New Features State
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: React.ReactNode;
        confirmText: string;
        onConfirm: () => void;
        cancelText?: string | null;
    }>({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'OK',
        onConfirm: () => {},
        cancelText: 'Cancel'
    });
    const [isEditCollectionItemsModalOpen, setIsEditCollectionItemsModalOpen] = useState(false);
    const [isCollectionManageMode, setIsCollectionManageMode] = useState(false);
    const [selectedCollectionItems, setSelectedCollectionItems] = useState<string[]>([]);

    useEffect(() => {
        const handleGlobalClick = (event: MouseEvent) => {
            if ((event.target as HTMLElement).closest('[data-sound="click"]')) {
                playSound('click');
            }
        };

        document.body.addEventListener('click', handleGlobalClick);

        return () => {
            document.body.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    const handleToggleSound = () => {
        setIsSoundEnabled(toggleSound());
    };

    const handleColorPresetChange = (preset: ColorPreset) => {
        setSelectedColorPreset(preset);
        setColorSettings(preset.settings);
    };

    const handleToggleCollectionManageMode = () => {
        setIsCollectionManageMode(prev => !prev);
        setSelectedCollectionItems([]);
    };

    const handleSelectCollectionItem = (itemId: string) => {
        setSelectedCollectionItems(prev =>
            prev.includes(itemId) ? prev.filter(selectedId => selectedId !== itemId) : [...prev, itemId]
        );
    };

    const handleDeleteSelectedCollectionItems = () => {
        if (selectedCollectionItems.length === 0) return;
        setConfirmationModal({
            isOpen: true,
            title: `Delete ${selectedCollectionItems.length} item(s)?`,
            message: 'This action is permanent and cannot be undone.',
            confirmText: 'Delete',
            onConfirm: () => {
                setCollectionItems(prev => prev.filter(item => !selectedCollectionItems.includes(item.id)));
                setPurchasedItems(prev => prev.filter(id => !selectedCollectionItems.includes(id)));
                setSelectedCollectionItems([]);
                setIsCollectionManageMode(false);
                playSound('click');
            },
            cancelText: 'Cancel',
        });
    };

    const handleSaveCollectionItemEdits = (updates: { cost: number; isFree: boolean }) => {
        setCollectionItems(prev =>
            prev.map(item =>
                selectedCollectionItems.includes(item.id) ? { ...item, ...updates } : item
            )
        );
        setSelectedCollectionItems([]);
        setIsCollectionManageMode(false);
        setIsEditCollectionItemsModalOpen(false);
        playSound('success');
    };

    useEffect(() => {
        const hasOnboarded = localStorage.getItem('wallpapersai_onboarded');
        if (!hasOnboarded) {
            setShowOnboarding(true);
        }
    }, []);

    const handleFinishOnboarding = () => {
        setShowOnboarding(false);
        localStorage.setItem('wallpapersai_onboarded', 'true');
    };

    const handleUpdateUser = (updates: Partial<User>) => {
        setUser(prev => ({ ...prev, ...updates }));
    };
    
    const unlockedStyles = useMemo(() => {
        if (user.subscription === 'premium') {
            return appStyles.map(s => s.id);
        }
        const now = Date.now();
        const validUnlocked = Object.entries(unlockedItems)
            .filter(([, expiry]: [string, number]) => expiry > now)
            .map(([id]) => id);
        return [...freeStyleIds, ...validUnlocked];
    }, [user.subscription, unlockedItems, appStyles]);

    const unlockedEffects = useMemo(() => {
        if (user.subscription === 'premium') {
            return allEffects.map(e => e.id);
        }
        const now = Date.now();
        const validUnlocked = Object.entries(unlockedItems)
            .filter(([, expiry]: [string, number]) => expiry > now)
            .map(([id]) => id);
        return [...freeEffectIds, ...validUnlocked, ...tempUnlockedItems];
    }, [user.subscription, unlockedItems, tempUnlockedItems]);

    const handleStyleSelect = (styleId: string) => {
        const style = appStyles.find(s => s.id === styleId);
        if (style) {
            setSelectedStyle(style.id);
            setSelectedStyleDetails(style);
        }
    };

    const handleSurprise = () => {
        const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
        const randomStyle = appStyles[Math.floor(Math.random() * appStyles.length)];
        setPrompt(randomPrompt);
        handleStyleSelect(randomStyle.id);
    };

    const handleGenerate = useCallback(async () => {
        if (isLoading || !prompt.trim()) return;
        
        const isAnimation = activeControlTab === 'camera' && selectedAnimation;
        const generationCost = isAnimation ? 10 : (user.subscription === 'none' ? 5 : 0);

        if (user.coins < generationCost) {
            setConfirmationModal({
                isOpen: true,
                title: 'Not Enough Coins',
                message: `You need ${generationCost} coins for this generation. You currently have ${user.coins}.`,
                confirmText: 'Go to Shop',
                onConfirm: () => setPage('shop'),
            });
            return;
        }

        const proceedWithGeneration = async () => {
            setIsLoading(true);
            setError(null);
            setGeneratedImages([]);

            if (generationCost > 0) {
                setUser(prev => ({ ...prev, coins: prev.coins - generationCost }));
            }
            
            try {
                 if (isAnimation) {
                    setGenerationStatus('Initializing video sequence...');
                    const operation = await startVideoGeneration(provider, prompt, selectedStyle, selectedAnimation!, animationSettings);

                    let status = operation;
                    let pollCount = 0;
                    while (!status.done) {
                        setGenerationStatus(`Frame ${Math.min(pollCount * 10, 99)}/100: Rendering quantum layers...`);
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        status = await checkVideoGenerationStatus(provider, status);
                        pollCount++;
                    }
                    
                    setGenerationStatus('Finalizing video stream...');
                    const videoBlob = await getVideoResult(provider, status);
                    const videoUrl = URL.createObjectURL(videoBlob);
                    const newMedia: MediaItem = { src: videoUrl, type: 'video' as const, styleId: selectedStyle };

                    setGeneratedImages([newMedia]);
                    setRecentGenerations(prev => [newMedia, ...prev.slice(0, 49)]);

                } else {
                    const base64Images = await generateWallpaper(provider, prompt, selectedStyle, imageCount, selectedColor);
                    const newImages: MediaItem[] = base64Images.map(b64 => ({ src: `data:image/jpeg;base64,${b64}`, type: 'image' as const, styleId: selectedStyle }));
                    setGeneratedImages(newImages);
                    setRecentGenerations(prev => [...newImages, ...prev.slice(0, 50 - newImages.length)]);
                }
                playSound('success');
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred.');
                playSound('error');
            } finally {
                setIsLoading(false);
                setGenerationStatus(undefined);
            }
        };

        if (generationCost > 0) {
            setConfirmationModal({
                isOpen: true,
                title: 'Confirm Generation',
                message: `This generation costs ${generationCost} coins. Proceed?`,
                confirmText: `Generate (${generationCost} Coins)`,
                onConfirm: proceedWithGeneration,
            });
        } else {
            proceedWithGeneration();
        }

    }, [prompt, selectedStyle, imageCount, isLoading, user, selectedColor, activeControlTab, selectedAnimation, animationSettings, provider]);

    const handleMediaClick = (media: MediaItem) => {
        setSelectedMedia(media);
        setReturnPage(page); // Remember where to return
        setPage('detail');
    };

    const handleToggleFavorite = (src: string, oldSrc?: string) => {
        setFavoritedMedia(prev => {
            const newFavorites = oldSrc ? prev.filter(f => f !== oldSrc) : prev;
            if (newFavorites.includes(src)) {
                return newFavorites.filter(f => f !== src);
            } else {
                return [src, ...newFavorites];
            }
        });
    };

    const handleUnlockRequest = (itemId: string) => {
        const item = [...appStyles, ...allEffects].find(i => i.id === itemId);
        if (!item) return;

        const cost = 25; // Example cost
        if (user.coins < cost) {
            setConfirmationModal({
                isOpen: true,
                title: "Not Enough Coins",
                message: `You need ${cost} coins to unlock this item for 30 days. You only have ${user.coins}.`,
                confirmText: "Go to Shop",
                onConfirm: () => setPage('shop'),
                cancelText: "Cancel"
            });
            return;
        }

        setConfirmationModal({
            isOpen: true,
            title: "Unlock Item?",
            message: `Unlock "${item.label}" for 30 days? This will cost ${cost} coins.`,
            confirmText: `Unlock (${cost} Coins)`,
            onConfirm: () => {
                setUser(prev => ({ ...prev, coins: prev.coins - cost }));
                setUnlockedItems(prev => ({
                    ...prev,
                    [itemId]: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days from now
                }));
                playSound('success');
            },
            cancelText: "Cancel"
        });
    };

    const handlePurchaseCollectionItem = (item: CollectionItem) => {
        if (user.coins < item.cost) {
             setConfirmationModal({
                isOpen: true,
                title: "Not Enough Coins",
                message: `You need ${item.cost} coins to purchase "${item.name}". You only have ${user.coins}.`,
                confirmText: "Go to Shop",
                onConfirm: () => setPage('shop'),
            });
            return;
        }
         setConfirmationModal({
            isOpen: true,
            title: "Confirm Purchase",
            message: `Purchase "${item.name}" for ${item.cost} coins?`,
            confirmText: `Purchase (${item.cost} Coins)`,
            onConfirm: () => {
                setUser(prev => ({ ...prev, coins: prev.coins - item.cost }));
                setPurchasedItems(prev => [...prev, item.id]);
                playSound('success');
            }
        });
    };

    const handleFileUploads = (fileDataUrls: string[]) => {
        const newItems: CollectionItem[] = fileDataUrls.map((url, index) => {
            const type = url.startsWith('data:video') ? 'video' : 'image';
            return {
                id: `upload_${Date.now()}_${index}`,
                name: 'User Upload',
                src: url,
                type: type,
                cost: 0,
                isFree: true,
                category: 'Uploads',
            };
        });
        setCollectionItems(prev => [...newItems, ...prev]);
        playSound('success');
    };

    const handleDeleteCollectionItem = (itemId: string) => {
        setConfirmationModal({
            isOpen: true,
            title: "Delete Item?",
            message: `Are you sure you want to permanently delete this item from your collection?`,
            confirmText: 'Delete',
            onConfirm: () => {
                setCollectionItems(prev => prev.filter(item => item.id !== itemId));
                setPurchasedItems(prev => prev.filter(purchasedItemId => purchasedItemId !== itemId));
                playSound('click');
            }
        });
    };


    const handleCloseDetail = () => {
        setSelectedMedia(null);
        setPage(returnPage);
        setTempUnlockedItems([]);
    };
    
    const renderPage = () => {
        const commonHeader = (
            <Header
                user={user}
                onSettingsClick={() => { setPreviousPage(page); setPage('user-profile'); }}
                onNavigateHome={() => setPage('home')}
            />
        );

        switch(page) {
            case 'detail':
                return selectedMedia && (
                    <DetailPage
                        media={selectedMedia}
                        onClose={handleCloseDetail}
                        favorites={favoritedMedia}
                        onToggleFavorite={handleToggleFavorite}
                        unlockedEffects={unlockedEffects}
                        user={user}
                        onUnlockRequest={handleUnlockRequest}
                        onUpdateUser={handleUpdateUser}
                        setConfirmationModal={setConfirmationModal}
                        onGoToShop={() => setPage('shop')}
                        tempUnlockedItems={tempUnlockedItems}
                        onClearTempUnlock={(id) => setTempUnlockedItems(p => p.filter(i => i !== id))}
                        provider={provider}
                    />
                );
            case 'user-profile':
                 return (
                    <>
                        {commonHeader}
                        <UserProfilePage
                            user={user}
                            onUpdateUser={handleUpdateUser}
                            collectionItems={collectionItems}
                            purchasedItems={purchasedItems}
                            onClose={() => setPage(previousPage)}
                            recentGenerations={recentGenerations}
                            onDeleteFavorites={(items) => setFavoritedMedia(p => p.filter(fav => !items.includes(fav)))}
                            onDeleteRecents={(items) => setRecentGenerations(p => p.filter(rec => !items.includes(rec.src)))}
                            onMediaClick={(item) => handleMediaClick(item)}
                            favorites={favoritedMedia}
                        />
                    </>
                );
             case 'settings':
                return (
                    <>
                        {commonHeader}
                        <SettingsPage
                            isSoundEnabled={isSoundEnabled}
                            onToggleSound={handleToggleSound}
                            selectedBackground={dynamicBackground}
                            onBackgroundChange={setDynamicBackground}
                            colorSettings={colorSettings}
                            onColorSettingsChange={setColorSettings}
                            selectedColorPresetId={selectedColorPreset.id}
                            onColorPresetChange={handleColorPresetChange}
                        />
                    </>
                );
            case 'shop':
                return (
                    <>
                        {commonHeader}
                        <ShopPage 
                            onClose={() => setPage(previousPage)}
                            user={user}
                            onUpdateUser={handleUpdateUser}
                            onWatchAdForCoins={() => {
                                 setUser(prev => ({...prev, coins: prev.coins + 10}));
                                 playSound('success');
                            }}
                            setConfirmationModal={setConfirmationModal}
                        />
                    </>
                );
            case 'collections':
                return (
                    <>
                        {commonHeader}
                        <CollectionsPage
                            user={user}
                            collectionItems={collectionItems}
                            purchasedItems={purchasedItems}
                            onPurchase={handlePurchaseCollectionItem}
                            onMediaClick={(src, type) => handleMediaClick({ src, type })}
                            onFileUploads={handleFileUploads}
                            onDeleteItem={handleDeleteCollectionItem}
                            isManageMode={isCollectionManageMode}
                            onToggleManageMode={handleToggleCollectionManageMode}
                            selectedItems={selectedCollectionItems}
                            onSelectItem={handleSelectCollectionItem}
                            onDeleteSelected={handleDeleteSelectedCollectionItems}
                            onEditSelected={() => setIsEditCollectionItemsModalOpen(true)}
                        />
                    </>
                );
            case 'home':
            default:
                return null;
        }
    };

    const isHeaderVisible = page !== 'detail';

    return (
        <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
             <DynamicBackground 
                animationId={dynamicBackground}
                colorSettings={colorSettings}
                isPaused={page === 'detail'}
            />
            <div className={`relative z-10 flex flex-col items-center justify-start min-h-screen pb-32 transition-opacity duration-500 ${(page !== 'home') ? 'hidden' : ''} ${!!selectedMedia ? 'opacity-20 pointer-events-none' : ''}`}>

                {isHeaderVisible && (
                    <Header
                        user={user}
                        onSettingsClick={() => { setPreviousPage(page); setPage('user-profile'); }}
                        onNavigateHome={() => setPage('home')}
                    >
                        
                        <div className="flex bg-black/20 rounded-full border border-gray-700 p-1">
                            <button onClick={() => setActiveControlTab('styles')} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${activeControlTab === 'styles' ? 'bg-cyan-500 text-black' : 'text-gray-300'}`}>Styles</button>
                            <button onClick={() => setActiveControlTab('camera')} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${activeControlTab === 'camera' ? 'bg-cyan-500 text-black' : 'text-gray-300'}`}>Camera FX</button>
                        </div>

                        <PromptInput
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value.slice(0, PROMPT_MAX_LENGTH))}
                            isDisabled={isLoading}
                            imageCount={imageCount}
                            onImageCountChange={setImageCount}
                        />

                        {activeControlTab === 'styles' ? (
                            <>
                                <div className="relative">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="font-Roboto text-xs font-normal text-white tracking-widest">ARTISTIC STYLES</h2>
                                        <div ref={categoryContainerRef} className="relative">
                                            <button onClick={() => setIsCategoryOpen(p => !p)} className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-sm font-semibold">
                                                <span>{activeStyleCategory}</span>
                                                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isCategoryOpen && (
                                                <div className="absolute top-full right-0 mt-2 w-48 bg-[#12072F] border border-gray-700 rounded-lg shadow-lg z-20 py-1">
                                                    {uiStyleCategories.map(cat => (
                                                        <button
                                                            key={cat.name}
                                                            onClick={() => { setActiveStyleCategory(cat.name); setIsCategoryOpen(false); }}
                                                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-white/10"
                                                        >
                                                            {cat.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <StyleCarousel
                                            categories={uiStyleCategories}
                                            activeCategory={activeStyleCategory}
                                            selectedValue={selectedStyle}
                                            onSelect={handleStyleSelect}
                                            unlockedStyles={unlockedStyles}
                                            user={user}
                                            onUnlockRequest={handleUnlockRequest}
                                            onEditRequest={(style) => {
                                                setEditingStyle(style);
                                                setIsEditStyleModalOpen(true);
                                            }}
                                        />
                                    </div>
                                </div>
                                {selectedStyleDetails && styleDescriptions[selectedStyleDetails.id] && (
                                    <div className="w-full p-4 bg-black/20 rounded-2xl border border-gray-800 text-center animate-fade-in-down space-y-1">
                                        <h4 className="font-bold text-base text-cyan-400">{styleDescriptions[selectedStyleDetails.id].name}</h4>
                                        <p className="text-gray-300 text-sm">{styleDescriptions[selectedStyleDetails.id].description}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <AnimationCarousel
                                options={animationOptions}
                                selectedValue={selectedAnimation}
                                onSelect={setSelectedAnimation}
                                user={user}
                                onGoToShop={() => setPage('shop')}
                                settings={animationSettings}
                                onSettingsChange={setAnimationSettings}
                                presets={animationPresets}
                            />
                        )}
                        
                        <ActionButtons
                            onGenerate={handleGenerate}
                            onSurprise={handleSurprise}
                            isLoading={isLoading}
                            isGenerateDisabled={!prompt.trim()}
                        />
                    </Header>
                )}

                <main className="w-full max-w-lg mx-auto mt-6 space-y-6 px-4 sm:px-6">
                    {error && <p className="text-red-400 text-center text-sm">{error}</p>}

                    <ImageGrid
                        images={generatedImages}
                        isLoading={isLoading}
                        count={imageCount}
                        onMediaClick={(item) => handleMediaClick(item)}
                        selectedStyle={selectedStyle}
                        generationStatus={generationStatus}
                        favorites={favoritedMedia}
                        onToggleFavorite={handleToggleFavorite}
                        onDownload={(src, filename) => { /* Implement download logic */ }}
                    />
                </main>

            </div>

            {page !== 'home' && renderPage()}
            
            {page !== 'detail' && <BottomNav currentPage={page} onSetPage={(p) => { setPreviousPage(page); setPage(p); }} user={user} onShopClick={() => { setPreviousPage(page); setPage('shop'); }} />}
            
            <OnboardingModal isOpen={showOnboarding} onFinish={handleFinishOnboarding} />
            
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmationModal.onConfirm}
                title={confirmationModal.title}
                message={confirmationModal.message}
                confirmText={confirmationModal.confirmText}
                cancelText={confirmationModal.cancelText}
            />

            <EditStyleModal
                isOpen={isEditStyleModalOpen}
                onClose={() => setIsEditStyleModalOpen(false)}
                style={editingStyle}
                onSave={(styleId, newIcon) => {
                    const customIcons = JSON.parse(localStorage.getItem('wallpapersai_custom_icons') || '{}');
                    customIcons[styleId] = newIcon;
                    localStorage.setItem('wallpapersai_custom_icons', JSON.stringify(customIcons));
                    setAppStyles(prev => prev.map(s => s.id === styleId ? { ...s, previewImage: newIcon } : s));
                }}
            />

            <EditCollectionItemsModal
                isOpen={isEditCollectionItemsModalOpen}
                onClose={() => setIsEditCollectionItemsModalOpen(false)}
                selectedCount={selectedCollectionItems.length}
                onSave={handleSaveCollectionItemEdits}
            />
            
            <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default App;
