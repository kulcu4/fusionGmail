import React from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import {
  CrownIcon,
  UserProfileIcon,
  avatarComponents,
  CartIcon,
} from './icons';

interface HeaderProps {
  user: User;
  onSettingsClick: () => void;
  onNavigateHome: () => void;
  // FIX: Made children optional to allow the Header to be used without content, fixing a type error in App.tsx.
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onSettingsClick,
  onNavigateHome,
  children,
}) => {
  const Avatar =
    user && user.avatarId && avatarComponents[user.avatarId]
      ? avatarComponents[user.avatarId]
      : UserProfileIcon;

  const avatarImage = user.avatarUrl ? `${user.avatarUrl}?v=${new Date().getTime()}` : null;

  const isPremium = user.subscription === 'premium';

  return (
    <div className="relative z-30 w-full max-w-lg mx-auto px-4 sm:px-6 space-y-6">
      <header className="flex items-center justify-between w-full pt-5">
        {/* Logo Section */}
        <motion.button
          onClick={onNavigateHome}
          data-sound="click"
          className="flex items-center group focus:outline-none rounded-lg"
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <img src="/images/logo_1.png" alt="PhoenixAI Logo" className="w-28 h-auto" />
          <div className="ml-2 flex flex-col items-start">
            <h2 className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text leading-tight">
              PhoenixAI
            </h2>
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text -mt-1">
              Wallpapers
            </span>
          </div>
        </motion.button>

        {/* Right-side Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* User Settings and Info Button */}
          <button
            data-sound="click"
            onClick={onSettingsClick}
            className="flex items-center space-x-3 bg-white/5 pl-1.5 pr-4 py-1.5 rounded-full border border-gray-700 hover:bg-white/10 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Open Settings"
          >
            {/* User Avatar */}
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 flex items-center justify-center font-bold text-lg shadow-lg overflow-hidden">
              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Avatar className="w-8 h-8 text-white" />
              )}
            </div>

            {/* User Info */}
            <div className="text-sm text-left">
              <div className="flex items-center gap-1.5">
                <p className="font-bold">{user.username}</p>
                {isPremium && <CrownIcon className="w-4 h-4 text-yellow-400" />}
              </div>
              <p className="text-xs text-cyan-300">
                {user.coins.toLocaleString()} Coins
              </p>
            </div>
          </button>
        </div>
      </header>
      {children}
    </div>
  );
};

export default Header;
