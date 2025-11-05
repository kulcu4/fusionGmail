


import React from 'react';
import { GenerateIcon, FolderIcon, CartIcon, SettingsIcon } from './icons';
import { Page, User } from '../types';

type NavigablePage = 'home' | 'shop' | 'collections' | 'settings';

interface BottomNavProps {
    currentPage: Page;
    onSetPage: (page: NavigablePage) => void;
    user?: User;
    onShopClick?: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onSetPage, user, onShopClick }) => {
    const isSubscribed = user && user.subscription !== 'none';

    const navItems = [
        <NavItem key="generate" icon={GenerateIcon} label="HOME" active={currentPage === 'home'} onClick={() => onSetPage('home')} />,
        <NavItem key="collections" icon={FolderIcon} label="COLLECTIONS" active={currentPage === 'collections'} onClick={() => onSetPage('collections')} />,
        isSubscribed ? (
             <NavItem
                key="shop"
                icon={CartIcon}
                label="SHOP"
                active={currentPage === 'shop'}
                onClick={onShopClick}
                isGradient={true}
             />
        ) : (
             <NavItem
                key="shop"
                icon={CartIcon}
                label="GO PREMIUM"
                active={currentPage === 'shop'}
                onClick={onShopClick}
                isGradient={true}
            />
        ),
        <NavItem key="settings" icon={SettingsIcon} label="SETTINGS" active={currentPage === 'settings'} onClick={() => onSetPage('settings')} />,
    ];

    return (
        <footer className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto h-16 bg-black/30 backdrop-blur-lg border border-cyan-500/30 rounded-2xl z-20 relative overflow-hidden liquid-glass-button shadow-[0_0_25px_rgba(56,189,248,0.25)]">
            <div className="flex justify-around items-center h-full px-2">
                {navItems}
            </div>
        </footer>
    );
};

interface NavItemProps {
    icon: React.FC<any>;
    label: string;
    active?: boolean;
    onClick?: () => void;
    isGradient?: boolean;
    className?: string;
    color?: string; // For icon color
    textColor?: string; // New prop for text color
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active = false, onClick, isGradient, className, color, textColor }) => {
    // Logic for text color: active -> custom textColor -> gradient -> default
    const textClasses = active
        ? 'text-cyan-400'
        : textColor
        ? textColor
        : isGradient
            ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text'
            : 'text-gray-500 group-hover:text-gray-300';

    // Logic for icon color: active -> custom color -> default
    const iconClasses = active
        ? 'text-cyan-400'
        : color
        ? color
        : 'text-gray-500 group-hover:text-gray-300';

    const gradientId = `icon-gradient-${label.replace(/\s+/g, '-')}`;
    // Gradient filter only applies if isGradient is true and there's no overriding color prop.
    const iconStyle = isGradient && !color ? { filter: `url(#${gradientId})` } : {};

    return (
        <button
            data-sound="click"
            onClick={onClick}
            className={`group flex flex-col items-center space-y-1 transition-colors duration-300 ${className}`}
            disabled={!onClick}
        >
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#22d3ee' }} />
                        <stop offset="100%" style={{ stopColor: '#d946ef' }} />
                    </linearGradient>
                </defs>
            </svg>
            {/* The icon will use `iconClasses` which is controlled by the `color` prop */}
            <Icon className={`w-6 h-6 transition-colors duration-300 ${iconClasses}`} style={iconStyle} />
            {/* The text will use `textClasses` which is now controlled by the new `textColor` prop */}
            <span className={`text-xs font-bold ${textClasses}`}>{label}</span>
        </button>
    );
};

export default BottomNav;