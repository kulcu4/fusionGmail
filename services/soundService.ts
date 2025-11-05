// services/soundService.ts

let audioCtx: AudioContext | null = null;
let isSoundEnabled = true;

/**
 * Initializes the AudioContext. 
 * Must be called as a result of a user gesture (e.g., a click) to comply with browser autoplay policies.
 */
const initAudioContext = () => {
    if (audioCtx) return;
    try {
        // Use the standard AudioContext, with a fallback for older webkit browsers.
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
        console.error("Web Audio API is not supported in this browser.", e);
        // If AudioContext isn't supported, disable sound to prevent further errors.
        isSoundEnabled = false; 
    }
};

// Load sound preference from localStorage on initial app load.
try {
    const storedSetting = localStorage.getItem('wallpapersai_soundEnabled');
    if (storedSetting !== null) {
        isSoundEnabled = JSON.parse(storedSetting);
    }
} catch (e) {
    console.error("Could not load sound setting from localStorage", e);
}

/**
 * Generates and plays a simple tone.
 * @param type - The shape of the sound wave (e.g., 'sine', 'triangle').
 * @param frequency - The pitch of the tone in Hertz.
 * @param duration - The length of the sound in seconds.
 * @param volume - The loudness of the sound (0.0 to 1.0).
 */
const playTone = (type: OscillatorType, frequency: number, duration: number, volume: number) => {
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Start at the specified volume and fade out quickly.
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
};

// A short, high-pitched pop for button clicks.
const playClickSound = () => {
    playTone('triangle', 880, 0.1, 0.15);
};

// A pleasant, rising two-note chime for success.
const playSuccessSound = () => {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.2, now);

    // First note (C5)
    oscillator.frequency.setValueAtTime(523.25, now);
    // Second note, slightly later (G5)
    oscillator.frequency.setValueAtTime(783.99, now + 0.1);

    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
};

// A low, brief buzz for errors.
const playErrorSound = () => {
    playTone('sawtooth', 120, 0.2, 0.1);
};


export const playSound = (soundName: 'click' | 'success' | 'error'): void => {
    if (!isSoundEnabled) return;
    
    // Initialize AudioContext on the first user interaction to comply with browser policies.
    initAudioContext();
    if (!audioCtx) return;

    // Browsers may suspend the AudioContext after a period of inactivity.
    // We must resume it before playing a sound.
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    switch (soundName) {
        case 'click':
            playClickSound();
            break;
        case 'success':
            playSuccessSound();
            break;
        case 'error':
            playErrorSound();
            break;
    }
};

export const toggleSound = (): boolean => {
    isSoundEnabled = !isSoundEnabled;
    try {
        localStorage.setItem('wallpapersai_soundEnabled', JSON.stringify(isSoundEnabled));
    } catch (e) {
        console.error("Could not save sound setting to localStorage", e);
    }
    if (isSoundEnabled) {
        playSound('click'); // Play a sound to confirm it's on.
    }
    return isSoundEnabled;
};

export const getIsSoundEnabled = (): boolean => {
    return isSoundEnabled;
};
