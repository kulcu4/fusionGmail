import React from 'react';
// FIX: Import PlayIcon to use in the new "Watch Ad" button.
import { CloseIcon, CheckIcon, PlayIcon } from './icons';
import { User } from '../types';
import { playSound } from '../services/soundService';

interface ShopPageProps {
    onClose: () => void;
    user: User;
    onUpdateUser: (updatedUser: Partial<User>) => void;
    onWatchAdForCoins: () => void;
    setConfirmationModal: (modal: any) => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ onClose, user, onUpdateUser, onWatchAdForCoins, setConfirmationModal }) => {
    const handlePurchase = (amount: number) => {
        const newCoinTotal = user.coins + amount;
        onUpdateUser({ coins: newCoinTotal });
        setConfirmationModal({
            isOpen: true,
            title: 'Purchase Successful!',
            message: (
                <>
                    <p className="text-2xl font-bold text-cyan-300 mb-2">+{amount.toLocaleString()} Coins</p>
                    <p>Added to your account. You now have {newCoinTotal.toLocaleString()} coins.</p>
                </>
            ),
            confirmText: 'Great!',
            onConfirm: () => {},
            cancelText: null,
        });
        playSound('success');
    };

    const handleSubscribe = (tier: 'simple' | 'premium') => {
        if (tier === 'premium' && user.subscription !== 'premium') {
            const newCoins = user.coins + 100;
            onUpdateUser({ subscription: 'premium', coins: newCoins });
            setConfirmationModal({
                isOpen: true,
                title: 'Welcome to Premium!',
                message: (
                    <>
                        <p>You are now a Premium member. Enjoy all the exclusive features!</p>
                        <p className="mt-2 text-sm text-cyan-300 font-bold">+100 bonus coins have been added to your account.</p>
                    </>
                ),
                confirmText: 'Awesome!',
                onConfirm: () => {},
                cancelText: null,
            });
            playSound('success');
        } else if (tier === 'simple' && user.subscription === 'none') {
            onUpdateUser({ subscription: 'simple' });
            setConfirmationModal({
                isOpen: true,
                title: 'Subscription Activated!',
                message: 'You have subscribed to Simple Premium. Enjoy the benefits!',
                confirmText: 'Continue',
                onConfirm: () => {},
                cancelText: null,
            });
            playSound('success');
        }
    };
    
    return (
        <div className="relative z-10 flex flex-col items-center justify-start max-w-lg mx-auto p-4 sm:p-6 pb-24 animate-fade-in mt-6">
            <div className="w-full space-y-8">
                {/* Subscription Tiers */}
                <div className="grid grid-cols-2 gap-4">
                    <SubscriptionTier
                        title="SIMPLE PREMIUM"
                        price="£2.99"
                        features={[
                            'Use coins to unlock styles & effects for 30 days',
                            'Download generated images',
                            'Add and customize text',
                            'Access to wallpaper cycling'
                        ]}
                        onSubscribe={() => handleSubscribe('simple')}
                        disabled={user.subscription !== 'none'}
                        isCurrent={user.subscription === 'simple'}
                        color="cyan"
                    />
                     <SubscriptionTier
                        title="PREMIUM"
                        price="£9.99"
                        features={[
                            'Unlock ALL styles & effects',
                            'Unlimited Animated Wallpapers',
                            'Higher Quality Generations',
                            'All Simple Premium benefits'
                        ]}
                        onSubscribe={() => handleSubscribe('premium')}
                        disabled={user.subscription === 'premium'}
                        isCurrent={user.subscription === 'premium'}
                        color="fuchsia"
                    />
                </div>

                {/* Coin Packs */}
                <div className="space-y-4 pt-4">
                     <h3 className="text-xl font-bold text-cyan-400 text-center tracking-widest">COIN PACKS</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <CoinPack amount={100} price="£0.99" onPurchase={handlePurchase} />
                        <CoinPack amount={350} price="£2.99" onPurchase={handlePurchase} />
                        <CoinPack amount={750} price="£4.99" popular onPurchase={handlePurchase} />
                        <CoinPack amount={1800} price="£9.99" onPurchase={handlePurchase} />
                     </div>
                </div>

                {/* FIX: Add a section for watching an ad to earn free coins. */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-bold text-cyan-400 text-center tracking-widest">FREE COINS</h3>
                    <button
                        data-sound="click"
                        onClick={onWatchAdForCoins}
                        className="w-full bg-white/5 p-4 rounded-lg border-2 border-gray-700 hover:border-cyan-400/50 transition-all duration-300 text-center flex flex-col items-center justify-center"
                    >
                        <PlayIcon className="w-8 h-8 text-cyan-300 mb-2" />
                        <p className="font-bold text-lg text-white">Watch an Ad</p>
                        <p className="text-gray-300 text-sm">Earn 10 free coins!</p>
                    </button>
                </div>
            </div>
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

interface SubscriptionTierProps {
    title: string;
    price: string;
    features: string[];
    onSubscribe: () => void;
    disabled: boolean;
    isCurrent: boolean;
    color: 'cyan' | 'fuchsia';
}

const SubscriptionTier: React.FC<SubscriptionTierProps> = ({ title, price, features, onSubscribe, disabled, isCurrent, color }) => {
    const colorClasses = {
        cyan: {
            border: 'border-cyan-500',
            shadow: 'shadow-cyan-500/20',
            text: 'text-cyan-300',
            buttonBg: 'bg-cyan-500',
            buttonHover: 'hover:bg-cyan-600',
            buttonShadow: 'shadow-[0_0_20px_rgba(34,211,238,0.5)]'
        },
        fuchsia: {
            border: 'border-fuchsia-500',
            shadow: 'shadow-fuchsia-500/20',
            text: 'text-fuchsia-300',
            buttonBg: 'bg-fuchsia-500',
            buttonHover: 'hover:bg-fuchsia-600',
            buttonShadow: 'shadow-[0_0_20px_rgba(217,70,239,0.5)]'
        }
    };
    const currentColors = colorClasses[color];

    return (
        <div className={`bg-white/5 p-2 rounded-2xl border-2 ${currentColors.border} text-center relative overflow-hidden shadow-xl ${currentColors.shadow} flex flex-col justify-between`}>
            <div>
                <h2 className="text-sm font-black tracking-wider text-white">{title}</h2>
                <p className={`${currentColors.text} mt-0.5 font-semibold text-xs`}>{price} / month</p>
                
                <ul className="text-left my-2 space-y-1 text-gray-300 text-[11px] leading-snug">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                            <CheckIcon className={`w-3.5 h-3.5 mr-1.5 mt-px flex-shrink-0 ${currentColors.text}`} />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button 
                data-sound="click" 
                onClick={onSubscribe}
                disabled={disabled}
                className={`w-full ${currentColors.buttonBg} text-white font-bold py-1.5 px-4 rounded-full text-sm ${!disabled ? currentColors.buttonHover : ''} transition-all duration-300 ${currentColors.buttonShadow} transform-gpu active:-translate-y-0.5 disabled:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
                {isCurrent ? 'Current Plan' : 'Subscribe'}
            </button>
        </div>
    );
};

interface CoinPackProps {
    amount: number;
    price: string;
    popular?: boolean;
    onPurchase: (amount: number) => void;
}

const CoinPack: React.FC<CoinPackProps> = ({ amount, price, popular, onPurchase }) => {
    return (
        <div className={`relative bg-white/5 p-4 rounded-lg border-2 border-gray-700 transition-all duration-300 text-center ${popular ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' : 'hover:border-cyan-400/50'}`}>
            {popular && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">BEST VALUE</div>}
            <p className="font-bold text-2xl text-white">{amount.toLocaleString()}</p>
            <p className="text-gray-300 text-lg">Coins</p>
            <button data-sound="click" onClick={() => onPurchase(amount)} className="mt-3 w-full bg-cyan-500/10 text-cyan-300 font-semibold py-2 px-4 rounded-full border border-cyan-500/30 hover:bg-cyan-500/20 hover:text-white transition-colors transform-gpu active:-translate-y-0.5">
                BUY - {price}
            </button>
        </div>
    )
}

export default ShopPage;
