import React, { useState } from 'react';
import { CloseIcon, GenerateIcon, WallpapersIcon, MagicWandIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon } from './icons';

interface OnboardingModalProps {
    isOpen: boolean;
    onFinish: () => void;
}

const onboardingSteps = [
    {
        icon: MagicWandIcon,
        title: "Welcome to Wallpapers AI",
        content: "Create stunning, unique wallpapers with the power of AI. Let's take a quick tour of the features!"
    },
    {
        icon: WallpapersIcon,
        title: "Choose Your Style",
        content: "Describe what you want to see in the prompt box, then browse our vast collection of art styles to define the aesthetic of your creation."
    },
    {
        icon: CheckIcon,
        title: "You're All Set!",
        content: "That's everything you need to know to get started. Unleash your creativity and start generating some amazing wallpapers!"
    }
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onFinish }) => {
    const [step, setStep] = useState(0);

    if (!isOpen) {
        return null;
    }

    const currentStep = onboardingSteps[step];
    const Icon = currentStep.icon;

    const goToNext = () => {
        if (step < onboardingSteps.length - 1) {
            setStep(s => s + 1);
        } else {
            onFinish();
        }
    };

    const goToPrev = () => {
        if (step > 0) {
            setStep(s => s + 1);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-sm bg-gray-950 border border-cyan-500/30 rounded-2xl p-6 pt-8 relative shadow-2xl shadow-cyan-500/20 flex flex-col items-center text-center">
                <button data-sound="click" onClick={onFinish} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                
                <div className="w-20 h-20 bg-cyan-500/10 border-2 border-cyan-500/50 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-10 h-10 text-cyan-400" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2">{currentStep.title}</h2>
                <p className="text-gray-300 text-sm mb-6 min-h-[60px]">{currentStep.content}</p>

                <div className="flex justify-center space-x-2 mb-6">
                    {onboardingSteps.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === step ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                    ))}
                </div>

                <div className="w-full flex items-center justify-between">
                    {step > 0 ? (
                        <button data-sound="click" onClick={goToPrev} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">
                           <ChevronLeftIcon className="w-5 h-5"/>
                        </button>
                    ) : <div className="w-12"/>}

                    <button
                        data-sound="click"
                        onClick={goToNext}
                        className="flex-grow bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold py-2 px-6 rounded-full text-base tracking-wider hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    >
                        {step === onboardingSteps.length - 1 ? "Finish" : "Next"}
                    </button>
                    
                    {step < onboardingSteps.length - 1 ? (
                        <button data-sound="click" onClick={goToNext} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">
                           <ChevronRightIcon className="w-5 h-5"/>
                        </button>
                    ) : <div className="w-12"/>}

                </div>
            </div>
            <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default OnboardingModal;