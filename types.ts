import React from 'react';

export interface Option {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }> | string;
  previewImage?: string;
  previewType?: string;
}

export interface AnimationOption extends Option {
  isPremium?: boolean;
  controls?: ('zoom' | 'pan' | 'swirl' | 'tilt')[];
}

export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  settings: {
    zoomAmount: number;
    panDirection: string;
    swirlDirection: string;
    tiltDirection: string;
  };
}

export interface StyleCategory {
  name: string;
  styles: Option[];
}

export interface EffectOption extends Option {
  type: 'generative' | 'css' | 'canvas' | 'js' | 'overlay';
  hasSlider: boolean;
  sliderLabel?: string;
  hasDirectionControl?: boolean;
  directionLabel?: string;
  hasColorControl?: boolean;
  hasSpreadControl?: boolean;
  spreadLabel?: string;
  hasSpeedControl?: boolean;
  speedLabel?: string;
}

// FIX: Added a required `id` property to the User type to provide a stable identifier, resolving comparison errors in other components.
export interface User {
  id: string;
  username: string;
  subscription: 'none' | 'simple' | 'premium';
  coins: number;
  avatarId?: string;   // optional (used for vector icons)
  avatarUrl?: string;  // ✅ new — used for uploaded/PNG avatars
}

export type Page =
  | 'home'
  | 'detail'
  | 'my-wallpapers'
  | 'shop'
  | 'collections'
  | 'user-profile'
  | 'settings';

// FIX: Add the missing 'CustomPreset' type to resolve an import error in PresetCarousel.tsx.
// Since the preset feature was removed from the main application, a minimal definition
// is sufficient to resolve the compilation error in the orphaned component.
export interface CustomPreset {
  id: string;
  name: string;
}

export type FontFamily =
  | 'sans-serif'
  | 'serif'
  | 'monospace'
  | 'Impact'
  | 'Courier New'
  | 'Comic Sans MS'
  | 'Arial'
  | 'Verdana'
  | 'Georgia'
  | 'Roboto'
  | 'Open Sans'
  | 'Lato'
  | 'Montserrat'
  | 'Oswald'
  | 'Raleway'
  | 'Playfair Display';

export interface CollectionItem {
  id: string;
  src: string;
  name: string;
  type: 'image' | 'video';
  cost: number;
  isFree: boolean;
  category: string;
}

export interface TextOverlayState {
  enabled: boolean;
  text: string;
  fontFamily: FontFamily;
  fontSize: number;
  color: string;
  isItalic: boolean;
  fontWeight: 'normal' | 'bold';
  rotation: number;
  position: { x: number; y: number }; // Percentage
}

export interface DynamicBackgroundOption {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

export interface ColorSettings {
    h: number; // Hue
    s: number; // Saturation
    l: number; // Lightness
}

export interface ColorPreset {
    id: string;
    name: string;
    settings: ColorSettings;
}

export interface MediaItem {
    src: string;
    type: 'image' | 'video';
    styleId?: string;
}


// FIX: Add missing 'GenerationProvider' type to resolve import errors.
export type GenerationProvider = 'gemini' | 'runware';