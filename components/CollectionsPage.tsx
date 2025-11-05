import React, { useMemo, useRef } from 'react';
import { User, CollectionItem } from '../types';
import { PadlockIcon, UploadIcon, TrashIcon, EditIcon } from './icons';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface CollectionsPageProps {
    user: User;
    collectionItems: CollectionItem[];
    purchasedItems: string[];
    onPurchase: (item: CollectionItem) => void;
    onMediaClick: (src: string, type: 'image' | 'video') => void;
    onFileUploads: (fileDataUrls: string[]) => void;
    onDeleteItem: (itemId: string) => void;
    isManageMode: boolean;
    onToggleManageMode: () => void;
    selectedItems: string[];
    onSelectItem: (itemId: string) => void;
    onDeleteSelected: () => void;
    onEditSelected: () => void;
}

const CollectionsPage: React.FC<CollectionsPageProps> = ({
    user,
    collectionItems,
    purchasedItems,
    onPurchase,
    onMediaClick,
    onFileUploads,
    onDeleteItem,
    isManageMode,
    onToggleManageMode,
    selectedItems,
    onSelectItem,
    onDeleteSelected,
    onEditSelected
}) => {
    const uploadInputRef = useRef<HTMLInputElement>(null);

    const collectionRows = useMemo(() => {
        const items = collectionItems;
        const numRows = 4;
        if (items.length === 0) return [];

        const rows: CollectionItem[][] = Array.from({ length: numRows }, () => []);
        // Distribute items into rows like dealing cards for more even distribution
        items.forEach((item, index) => {
            rows[index % numRows].push(item);
        });

        return rows.filter(row => row.length > 0);
    }, [collectionItems]);


    const handleUploadClick = () => {
        uploadInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const filePromises = Array.from(files).map((file: File) => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (reader.result) resolve(reader.result as string);
                        else reject(new Error('Failed to read file.'));
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(filePromises)
                .then(onFileUploads)
                .catch(error => console.error("Error reading files:", error));

            event.target.value = '';
        }
    };

    const CollectionGridItem: React.FC<{ item: CollectionItem }> = ({ item }) => {
        const isUnlocked = item.isFree || purchasedItems.includes(item.id);
        const isSelected = selectedItems.includes(item.id);

        const handleClick = () => {
            if (isManageMode) {
                onSelectItem(item.id);
            } else if (isUnlocked) {
                onMediaClick(item.src, item.type);
            } else {
                onPurchase(item);
            }
        };

        return (
            <div className="relative group w-32 flex-shrink-0 aspect-[9/16]">
                <button
                    data-sound="click"
                    onClick={handleClick}
                    className={`w-full h-full rounded-2xl overflow-hidden border-2 transition-all duration-300 block shadow-lg ${isManageMode ? (isSelected ? 'border-cyan-400 scale-95' : 'border-gray-700 hover:border-gray-500') : 'border-transparent hover:border-cyan-400'}`}
                >
                    {item.type === 'video' ? (
                        <video src={item.src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" autoPlay loop muted playsInline />
                    ) : (
                        <img src={item.src} alt={`Collection item ${item.id}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                    {!isUnlocked && !isManageMode && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-1">
                            <PadlockIcon className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400 text-xs font-bold mt-1">{item.cost} Coins</span>
                        </div>
                    )}
                    {isManageMode && (
                         <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${isSelected ? 'bg-cyan-500 border-cyan-400' : 'bg-black/50 border-gray-400'}`}>
                             {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                         </div>
                    )}
                </button>
            </div>
        );
    };
    
    const CollectionRow: React.FC<{title?: string, items: CollectionItem[]}> = ({title, items}) => {
        const scrollRef = useDraggableScroll();
        if(!items || items.length === 0) return null;
        return (
            <section>
                {title && <h2 className="text-sm font-bold tracking-widest text-gray-400 mb-3">{title}</h2>}
                <div ref={scrollRef} className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar cursor-grab">
                    {items.map(item => <CollectionGridItem key={item.id} item={item} />)}
                </div>
            </section>
        );
    }

    return (
        <div className="w-full mt-6">
            <input type="file" ref={uploadInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" multiple />

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-bold tracking-wider text-white">COLLECTIONS</h1>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleUploadClick} data-sound="click"
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors bg-white/10 text-gray-300 hover:bg-white/20"
                        title="Upload new images or videos"
                    >
                        <UploadIcon className="w-4 h-4" />
                        UPLOAD
                    </button>
                     <button
                        data-sound="click"
                        onClick={onToggleManageMode}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${isManageMode ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-gray-300'}`}
                        title={isManageMode ? "Cancel management" : "Manage collection"}
                    >
                        {isManageMode ? 'Cancel' : 'Manage'}
                    </button>
                </div>
            </div>
            
            {isManageMode && selectedItems.length > 0 && (
                <div className="w-full flex justify-between items-center bg-black/20 border border-gray-700 rounded-lg p-2 animate-fade-in-down mb-4">
                     <p className="text-sm font-semibold text-gray-300">{selectedItems.length} selected</p>
                     <div className="flex items-center space-x-2">
                         <button
                            data-sound="click"
                            onClick={onEditSelected}
                            className="px-3 py-1 text-xs font-semibold rounded-md transition-colors bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 flex items-center space-x-1.5"
                            title="Edit price and lock status"
                        >
                            <EditIcon className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                        <button
                            data-sound="click"
                            onClick={onDeleteSelected}
                            className="px-3 py-1 text-xs font-semibold rounded-md transition-colors bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center space-x-1.5"
                            title="Delete selected items"
                        >
                            <TrashIcon className="w-4 h-4" />
                            <span>Delete</span>
                        </button>
                     </div>
                </div>
            )}

            <main className="w-full space-y-2 mt-4">
                {collectionRows.map((rowItems, index) => (
                    <CollectionRow key={`collection-row-${index}`} items={rowItems} />
                ))}
            
                {collectionItems.length === 0 && (
                     <p className="text-center text-gray-500 text-sm py-8">
                        Your collections are empty.
                     </p>
                )}
            </main>
        </div>
    );
};

export default CollectionsPage;