
import React from 'react';
import { DownloadIcon, TrashIcon, HeartIcon } from './icons';

interface BatchActionsProps {
    onSelectAll: () => void;
    onClearSelection: () => void;
    onDownloadSelected: () => void;
    onDeleteSelected: () => void;
    onAddToFavorites: () => void;
    selectedCount: number;
    totalCount: number;
}

const BatchActions: React.FC<BatchActionsProps> = ({
    onSelectAll,
    onClearSelection,
    onDownloadSelected,
    onDeleteSelected,
    onAddToFavorites,
    selectedCount,
    totalCount
}) => {
    const allSelected = selectedCount === totalCount && totalCount > 0;

    return (
        <div className="w-full flex justify-between items-center bg-black/20 border border-gray-700 rounded-lg p-2 animate-fade-in-down mb-2">
            <div className="flex items-center space-x-2">
                <button
                    data-sound="click"
                    onClick={allSelected ? onClearSelection : onSelectAll}
                    className="px-3 py-1 text-xs font-semibold rounded-md transition-colors bg-gray-700 hover:bg-gray-600 text-gray-200"
                >
                    {allSelected ? 'Clear Selection' : 'Select All'}
                </button>
            </div>
            {selectedCount > 0 && (
                 <div className="flex items-center space-x-2">
                    <button
                        data-sound="click"
                        onClick={onAddToFavorites}
                        className="px-3 py-1 text-xs font-semibold rounded-md transition-colors bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 flex items-center space-x-1.5"
                    >
                        <HeartIcon className="w-4 h-4" />
                        <span>Favorite ({selectedCount})</span>
                    </button>
                    <button
                        data-sound="click"
                        onClick={onDownloadSelected}
                        className="px-3 py-1 text-xs font-semibold rounded-md transition-colors bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 flex items-center space-x-1.5"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        <span>Download ({selectedCount})</span>
                    </button>
                    <button
                        data-sound="click"
                        onClick={onDeleteSelected}
                        className="px-3 py-1 text-xs font-semibold rounded-md transition-colors bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center space-x-1.5"
                    >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete ({selectedCount})</span>
                    </button>
                 </div>
            )}
        </div>
    );
};

export default BatchActions;
