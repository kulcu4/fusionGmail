import { Option, EffectOption, StyleCategory, DynamicBackgroundOption, AnimationOption, AnimationPreset, ColorPreset } from './types';

// Your existing PNG imports
const abstractIconPng = '/images/Style_icons/1.png';
const AbstractGeometryIconPng = '/images/Style_icons/2.png';
const aberrationIconPng = '/images/Style_icons/3.png';
const pixarIconPng = '/images/Style_icons/5.png';
const bokehIconPng = '/images/Style_icons/6.png';
const christmasIconPng = '/images/Style_icons/8.png';
const cinematicIconPng = '/images/Style_icons/9.png';
const cyberpunkIconPng = '/images/Style_icons/11.png';
const falloutIconPng = '/images/Style_icons/13.png';
const fantasyIconPng = '/images/Style_icons/14.png';
const goldenHourIconPng = '/images/Style_icons/15.png';
const comicBookIconPng = '/images/Style_icons/21.png';
const easterIconPng = '/images/Style_icons/22.png';
const glitchIconPng = '/images/Style_icons/23.png';
const gothicVictorianIconPng = '/images/Style_icons/24.png';
const animeIconPng = '/images/Style_icons/4.png';
const legoIconPng = '/images/Style_icons/7.png';
const claymationIconPng = '/images/Style_icons/10.png';
const noirIconPng = '/images/Style_icons/12.png';
const gothicIconPng = '/images/Style_icons/16.png';
const graffitiIconPng = '/images/Style_icons/17.png';
const stainedGlassIconPng = '/images/Style_icons/18.png';
const cartoonIconPng = '/images/Style_icons/19.png';
const sketchIconPng = '/images/Style_icons/20.png';
const vaporwaveIconPng = '/images/Style_icons/25.png';
const toyLookIconPng = '/images/Style_icons/26.png';
const artDecoIconPng = '/images/Style_icons/27.png';
const artNouveauIconPng = '/images/Style_icons/28.png';
const dioramaIconPng = '/images/Style_icons/29.png';
const dadaismIconPng = '/images/Style_icons/30.png';
const ukiyoeIconPng = '/images/Style_icons/31.png';
const pixelArtIconPng = '/images/Style_icons/32.png';
const geometricIconPng = '/images/Style_icons/33.png';
const papercraftIconPng = '/images/Style_icons/34.png';
const origamiIconPng = '/images/Style_icons/35.png';
const ghibliIconPng = '/images/Style_icons/36.png';
const tattooArtIconPng = '/images/Style_icons/37.png';

// --- ADDING THE LATEST BATCH OF PNG IMPORTS ---
const lowPolyIconPng = '/images/Style_icons/38.png';
const longExposureIconPng = '/images/Style_icons/39.png';
const halloweenIconPng = '/images/Style_icons/40.png';
const minimalIconPng = '/images/Style_icons/41.png';
const threeDRenderIconPng = '/images/Style_icons/53.png';
const mosaicIconPng = '/images/Style_icons/54.png';
const oilPaintingIconPng = '/images/Style_icons/55.png';
const organicIconPng = '/images/Style_icons/56.png';
const parallaxIconPng = '/images/Style_icons/57.png';
const pastelIconPng = '/images/Style_icons/58.png';
const popArtIconPng = '/images/Style_icons/59.png';
const realisticIconPng = '/images/Style_icons/60.png';
const retroFuturismIconPng = '/images/Style_icons/61.png';
const retroIconPng = '/images/Style_icons/62.png';
const sciFiIconPng = '/images/Style_icons/63.png';
const steampunkIconPng = '/images/Style_icons/64.png';
const watercolorIconPng = '/images/Style_icons/65.png';
const zombieIconPng = '/images/Style_icons/66.png';


import {
    SparkleIcon,
    RainIcon, SnowIcon, BubblesIcon,
    BlurIcon,
    AmbientLightIcon,
    ParticlesIcon, SepiaIcon, NeonGlowIcon,
    FireflyIcon, MatrixIcon, TvStaticIcon, LightSpeedIcon, EqualizerIcon, EmbersIcon, CameraPanIcon, ZoomInIcon, GentleSwirlIcon, ThreeDIcon,
    LightningIcon, CubismIcon, SuprematismIcon, ExpressionismIcon, ShoujoIcon, MechaIcon, LineArtIcon, MonochromeIcon, DreamlikeIcon, ScribbleIcon, JuxtapositionIcon,
    ArcIcon, DroneIcon, HandheldIcon, BoomIcon, VertigoIcon, SpinIcon, PulseIcon, TiltIcon,
    NoneIcon,
    SoftLinesIcon,
    NebulaIcon,
    AbstractGeometryIcon,
    IridescenceIcon,
    LightRaysIcon,
    PixelBlastIcon,
    AuroraIcon,
    GalaxyIcon
} from './components/icons';

export const previewSvgTemplateDefault = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient></defs><rect width="64" height="64" fill="#0B021D"/><path d="M0 32 C 16 0, 48 64, 64 32" stroke="url(#previewGrad)" stroke-width="4" fill="none" /><circle cx="32" cy="32" r="12" fill="none" stroke="{color1}" stroke-width="2" stroke-dasharray="4 4" /></svg>`;
export const previewSvgTemplatePixelArt = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><rect width="64" height="64" fill="#0B021D"/><rect x="8" y="8" width="8" height="8" fill="{color1}" /><rect x="16" y="8" width="8" height="8" fill="{color2}" /><rect x="24" y="8" width="8" height="8" fill="{color1}" /><rect x="32" y="8" width="8" height="8" fill="{color2}" /><rect x="40" y="8" width="8" height="8" fill="{color1}" /><rect x="48" y="8" width="8" height="8" fill="{color2}" /><rect x="8" y="16" width="8" height="8" fill="{color2}" /><rect x="16" y="16" width="8" height="8" fill="{color1}" /><rect x="24" y="16" width="8" height="8" fill="{color2}" /><rect x="32" y="16" width="8" height="8" fill="{color1}" /><rect x="40" y="16" width="8" height="8" fill="{color2}" /><rect x="48" y="16" width="8" height="8" fill="{color1}" /><rect x="8" y="24" width="8" height="8" fill="{color1}" /><rect x="16" y="24" width="8" height="8" fill="{color2}" /><rect x="24" y="24" width="8" height="8" fill="{color1}" /><rect x="32" y="24" width="8" height="8" fill="{color2}" /><rect x="40" y="24" width="8" height="8" fill="{color1}" /><rect x="48" y="24" width="8" height="8" fill="{color2}" /><rect x="8" y="32" width="8" height="8" fill="{color2}" /><rect x="16" y="32" width="8" height="8" fill="{color1}" /><rect x="24" y="32" width="8" height="8" fill="{color2}" /><rect x="32" y="32" width="8" height="8" fill="{color1}" /><rect x="40" y="32" width="8" height="8" fill="{color2}" /><rect x="48" y="32" width="8" height="8" fill="{color1}" /><rect x="8" y="40" width="8" height="8" fill="{color1}" /><rect x="16" y="40" width="8" height="8" fill="{color2}" /><rect x="24" y="40" width="8" height="8" fill="{color1}" /><rect x="32" y="40" width="8" height="8" fill="{color2}" /><rect x="40" y="40" width="8" height="8" fill="{color1}" /><rect x="48" y="40" width="8" height="8" fill="{color2}" /><rect x="8" y="48" width="8" height="8" fill="{color2}" /><rect x="16" y="48" width="8" height="8" fill="{color1}" /><rect x="24" y="48" width="8" height="8" fill="{color2}" /><rect x="32" y="48" width="8" height="8" fill="{color1}" /><rect x="40" y="48" width="8" height="8" fill="{color2}" /><rect x="48" y="48" width="8" height="8" fill="{color1}" /></svg>`;
export const previewSvgTemplateWatercolor = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient><filter id="watercolor"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="2" seed="2" result="turbulence"/><feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="1" /></filter></defs><rect width="64" height="64" fill="#0B021D"/><circle cx="32" cy="32" r="25" fill="url(#previewGrad)" filter="url(#watercolor)" opacity="0.8"/></svg>`;
export const previewSvgTemplateGeometric = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient></defs><rect width="64" height="64" fill="#0B021D"/><path d="M32 0 L 64 32 L 32 64 L 0 32 Z" fill="none" stroke="url(#previewGrad)" stroke-width="4"/><path d="M32 16 L 48 32 L 32 48 L 16 32 Z" fill="{color1}" opacity="0.5"/></svg>`;
export const previewSvgTemplateComic = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient><pattern id="dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="{color2}" opacity="0.6"/></pattern></defs><rect width="64" height="64" fill="{color1}"/><path d="M 0 0 L 64 0 L 0 64 Z" fill="url(#dots)" /><path d="M 5 5 L 59 5 L 59 59 L 5 59 Z" fill="none" stroke="black" stroke-width="3"/><path d="M 32 10 A 20 20 0 0 1 32 54" fill="none" stroke="black" stroke-width="4"/></svg>`;
export const previewSvgTemplateLowPoly = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient></defs><rect width="64" height="64" fill="#0B021D"/><path d="M 0 0 L 32 64 L 64 0 Z" fill="url(#previewGrad)" opacity="0.6"/><path d="M 0 64 L 32 0 L 64 64 Z" fill="url(#previewGrad)" opacity="0.8"/></svg>`;
export const previewSvgTemplateCyberpunk = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient><filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="64" height="64" fill="#0B021D"/><rect x="10" y="30" width="8" height="34" fill="url(#previewGrad)" opacity="0.7"/><rect x="25" y="20" width="14" height="44" fill="url(#previewGrad)"/><rect x="46" y="40" width="10" height="24" fill="url(#previewGrad)" opacity="0.8"/><path d="M0 50 H64" stroke="{color1}" stroke-width="1.5" filter="url(#neonGlow)"/></svg>`;
export const previewSvgTemplateVaporwave = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient><linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#FFD700" /><stop offset="100%" stop-color="#FF69B4" /></linearGradient></defs><rect width="64" height="64" fill="#0B021D"/><circle cx="32" cy="32" r="12" fill="url(#sunGrad)"/><path d="M0 40 L32 28 L64 40 M0 44 L32 32 L64 44 M0 48 L32 36 L64 48 M0 52 L32 40 L64 52 M0 56 L32 44 L64 56 M0 60 L32 48 L64 60" stroke="url(#previewGrad)" stroke-width="1" fill="none" opacity="0.7"/></svg>`;
export const previewSvgTemplateSciFi = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient></defs><rect width="64" height="64" fill="#0B021D"/><circle cx="32" cy="32" r="10" fill="url(#previewGrad)"/><ellipse cx="32" cy="32" rx="20" ry="8" stroke="{color1}" stroke-width="2" fill="none" transform="rotate(-30 32 32)"/><ellipse cx="32" cy="32" rx="25" ry="12" stroke="{color2}" stroke-width="1.5" fill="none" transform="rotate(20 32 32)"/><circle cx="50" cy="14" r="3" fill="{color2}"/></svg>`;
export const previewSvgTemplateFantasy = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient></defs><rect width="64" height="64" fill="#0B021D"/><path d="M20 54 L20 30 L26 24 L26 54 M38 54 L38 30 L44 24 L44 54 M20 30 L32 18 L44 30 M28 54 L28 40 L36 40 L36 54" stroke="url(#previewGrad)" stroke-width="2" fill="none"/><path d="M15 15 L32 4 L49 15" stroke="{color2}" stroke-width="2" fill="none"/></svg>`;
export const previewSvgTemplateOrganic = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient><filter id="organicGlow"><feGaussianBlur stdDeviation="1.5" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="contrast"/><feMerge><feMergeNode in="contrast"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="64" height="64" fill="#0B021D"/><path d="M5 5 C 20 60, 40 -10, 59 59" stroke="url(#previewGrad)" stroke-width="3" fill="none" filter="url(#organicGlow)"/><path d="M59 5 C 40 60, 20 -10, 5 59" stroke="{color1}" stroke-width="2" fill="none" opacity="0.7"/></svg>`;
export const previewSvgTemplateSteampunk = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="{color1}" /><stop offset="100%" stop-color="{color2}" /></linearGradient></defs><rect width="64" height="64" fill="#0B021D"/><g stroke="url(#previewGrad)" stroke-width="2" fill="none"><path d="M24 20 a 10 10 0 0 1 0 20 M24 20 l-2-3 M24 40 l-2 3 M24 20 l 2-3 M24 40 l 2 3 M14 30 l-3-2 M34 30 l 3-2 M14 30 l-3 2 M34 30 l 3 2"/><path d="M44 35 a 8 8 0 0 1 0 16 M44 35 l-2-3 M44 51 l-2 3 M44 35 l 2-3 M44 51 l 2 3 M36 43 l-3-2 M52 43 l 3-2 M36 43 l-3 2 M52 43 l 3 2"/></g><circle cx="24" cy="30" r="3" fill="{color1}"/><circle cx="44" cy="43" r="2" fill="{color2}"/></svg>`;
export const previewSvgTemplate3DBlocks = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" fill="#0B021D"/><g transform="translate(32,32) rotate(45) scale(1.2)"><defs><linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="{color1}"/><stop offset="100%" stop-color="{color2}"/></linearGradient></defs><path d="M -15 -15 L 0 -22 L 15 -15 L 0 -8 Z" fill="{color1}" style="filter: brightness(1.2)"/><path d="M -15 -15 L -15 5 L 0 12 L 0 -8 Z" fill="{color2}" style="filter: brightness(0.8)"/><path d="M 15 -15 L 15 5 L 0 12 L 0 -8 Z" fill="{color2}"/><path d="M -15 5 L 0 12 L 15 5 L 0 -2 Z" fill="{color1}" style="display:none" /></g></svg>`;
export const previewSvgTemplate3DVoxel = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><rect width="64" height="64" fill="#0B021D"/><g transform="translate(12, 12)"><path d="M 0 18 L 10 12 L 10 24 L 0 30 Z" fill="{color2}" style="filter: brightness(0.7)"/><path d="M 10 12 L 20 6 L 30 12 L 20 18 Z" fill="{color1}"/><path d="M 20 18 L 30 12 L 30 24 L 20 30 Z" fill="{color2}"/><path d="M 10 24 L 20 18 L 20 30 L 10 36 Z" fill="{color2}" style="filter: brightness(0.7)"/><path d="M 20 30 L 30 24 L 40 30 L 30 36 Z" fill="{color1}"/><path d="M 30 36 L 40 30 L 40 42 L 30 48 Z" fill="{color2}"/></g></svg>`;


const initialStyleCategories: StyleCategory[] = [
    {
        name: 'Artistic',
        styles: [
            { id: 'abstract_flow', label: 'ABSTRACT', icon: abstractIconPng, previewType: 'organic' },
            { id: 'art_deco', label: 'ART DECO', icon: artDecoIconPng, previewType: 'geometric' },
            { id: 'art_nouveau', label: 'ART NOUVEAU', icon: artNouveauIconPng, previewType: 'organic' },
            { id: 'cubism', label: 'CUBISM', icon: CubismIcon, previewType: 'geometric' },
            { id: 'expressionism', label: 'EXPRESSIONISM', icon: ExpressionismIcon, previewType: 'watercolor' },
            { id: 'mosaic', label: 'MOSAIC', icon: mosaicIconPng, previewType: 'pixel' },
            { id: 'oil_painting', label: 'OIL PAINTING', icon: oilPaintingIconPng, previewType: 'watercolor' },
            { id: 'pop_art', label: 'POP ART', icon: popArtIconPng, previewType: 'comic' },
            { id: 'suprematism', label: 'SUPREMATISM', icon: SuprematismIcon, previewType: 'geometric' },
            { id: 'tattoo', label: 'TATTOO ART', icon: tattooArtIconPng, previewType: 'comic' },
            { id: 'ukiyo_e', label: 'UKIYO-E', icon: ukiyoeIconPng, previewType: 'watercolor' },
            { id: 'watercolor', label: 'WATERCOLOR', icon: watercolorIconPng, previewType: 'watercolor' },
        ],
    },
    {
        name: 'Craft & Traditional',
        styles: [
            { id: 'claymation', label: 'CLAYMATION', icon: claymationIconPng, previewType: 'watercolor' },
            { id: 'graffiti', label: 'GRAFFITI', icon: graffitiIconPng, previewType: 'comic' },
            { id: 'low_poly', label: 'LOW POLY', icon: lowPolyIconPng, previewType: 'low_poly' },
            { id: 'origami', label: 'ORIGAMI', icon: origamiIconPng, previewType: 'geometric' },
            { id: 'papercraft', label: 'PAPERCRAFT', icon: papercraftIconPng, previewType: 'geometric' },
            { id: 'sketch', label: 'SKETCH', icon: sketchIconPng },
            { id: 'stained_glass', label: 'STAINED GLASS', icon: stainedGlassIconPng, previewType: 'geometric' },
        ],
    },
     {
        name: 'Anime',
        styles: [
            { id: 'anime_manga', label: 'ANIME', icon: animeIconPng, previewType: 'comic' },
            { id: 'shounen', label: 'SHOUNEN', icon: LightningIcon },
            { id: 'shoujo', label: 'SHOUJO', icon: ShoujoIcon },
            { id: 'mecha', label: 'MECHA', icon: MechaIcon },
        ],
    },
    {
        name: 'Minimalist',
        styles: [
            { id: 'line_art', label: 'LINE ART', icon: LineArtIcon },
            { id: 'monochrome', label: 'MONOCHROME', icon: MonochromeIcon },
            { id: 'geometric_minimal', label: 'GEO MINIMAL', icon: AbstractGeometryIconPng },
            { id: 'minimal_neon', label: 'MINIMAL', icon: minimalIconPng },
        ],
    },
    {
        name: 'Surrealism',
        styles: [
            { id: 'dreamlike', label: 'DREAMLIKE', icon: DreamlikeIcon },
            { id: 'scribble_art', label: 'SCRIBBLE', icon: ScribbleIcon },
            { id: 'juxtaposition', label: 'JUXTAPOSITION', icon: JuxtapositionIcon },
            { id: 'dadaism', label: 'DADAISM', icon: dadaismIconPng },
        ],
    },
    {
        name: 'Digital & Sci-Fi',
        styles: [
            { id: 'cyberpunk', label: 'CYBERPUNK', icon: cyberpunkIconPng, previewType: 'cyberpunk' },
            { id: 'geometric_synth', label: 'GEOMETRIC', icon: geometricIconPng, previewType: 'geometric' },
            { id: 'glitch_art', label: 'GLITCH', icon: glitchIconPng, previewType: 'pixel' },
            { id: 'pixel_art', label: 'PIXEL ART', icon: pixelArtIconPng, previewType: 'pixel' },
            { id: 'retro_futurism', label: 'RETRO FUTURISM', icon: retroFuturismIconPng, previewType: 'sci_fi' },
            { id: 'sci_fi', label: 'SCI-FI', icon: sciFiIconPng, previewType: 'sci_fi' },
            { id: 'vaporwave', label: 'VAPORWAVE', icon: vaporwaveIconPng, previewType: 'vaporwave' },
        ],
    },
    {
        name: 'Fantasy & Thematic',
        styles: [
            { id: 'christmas', label: 'CHRISTMAS', icon: christmasIconPng },
            { id: 'easter', label: 'EASTER', icon: easterIconPng },
            { id: 'fantasy', label: 'FANTASY', icon: fantasyIconPng, previewType: 'fantasy' },
            { id: 'gothic', label: 'GOTHIC', icon: gothicIconPng, previewType: 'fantasy' },
            { id: 'gothic_victorian', label: 'GOTHIC VICTORIAN', icon: gothicVictorianIconPng, previewType: 'fantasy' },
            { id: 'halloween', label: 'HALLOWEEN', icon: halloweenIconPng, previewType: 'comic' },
            { id: 'medieval', label: 'MEDIEVAL', icon: fantasyIconPng, previewType: 'fantasy' },
            { id: 'steampunk', label: 'STEAMPUNK', icon: steampunkIconPng, previewType: 'steampunk' },
            { id: 'zombie', label: 'ZOMBIE', icon: zombieIconPng, previewType: 'comic' },
        ],
    },
    {
        name: 'Games & Pop Culture',
        styles: [
            { id: 'fallout', label: 'FALLOUT', icon: falloutIconPng, previewType: 'comic' },
            { id: 'lego_style', label: 'LEGO', icon: legoIconPng, previewType: 'pixel' },
            { id: 'pixar', label: 'PIXAR', icon: pixarIconPng, previewType: 'comic' },
            { id: 'toy_look', label: 'TOY LOOK', icon: toyLookIconPng, previewType: 'comic' },
        ]
    },
    {
        name: 'General',
        styles: [
            { id: 'organic_glow', label: 'ORGANIC', icon: organicIconPng, previewType: 'organic' },
            { id: 'pastel', label: 'PASTEL', icon: pastelIconPng, previewType: 'watercolor' },
            { id: 'retro', label: 'RETRO', icon: retroIconPng, previewType: 'vaporwave' },
        ],
    },
    {
        name: 'Illustration',
        styles: [
            { id: '3d_illustration', label: '3D RENDER', icon: threeDRenderIconPng, previewType: 'low_poly' },
            { id: '3d_blocks', label: '3D BLOCKS', icon: threeDRenderIconPng, previewType: '3d_blocks' },
            { id: '3d_voxel', label: 'VOXEL ART', icon: threeDRenderIconPng, previewType: '3d_voxel' },
            { id: 'cartoon', label: 'CARTOON', icon: cartoonIconPng, previewType: 'comic' },
            { id: 'comic_book', label: 'COMIC BOOK', icon: comicBookIconPng, previewType: 'comic' },
            { id: 'diorama', label: 'DIORAMA', icon: dioramaIconPng },
            { id: 'ghibli', label: 'GHIBLI', icon: ghibliIconPng, previewType: 'watercolor' },
        ],
    },
    {
        name: 'Photography & Film',
        styles: [
            { id: 'chromatic_aberration', label: 'ABERRATION', icon: aberrationIconPng },
            { id: 'bokeh', label: 'BOKEH', icon: bokehIconPng },
            { id: 'cinematic', label: 'CINEMATIC', icon: cinematicIconPng },
            { id: 'golden_hour', label: 'GOLDEN HOUR', icon: goldenHourIconPng },
            { id: 'long_exposure', label: 'LONG EXPOSURE', icon: longExposureIconPng },
            { id: 'noir', label: 'NOIR', icon: noirIconPng },
            { id: 'realistic', label: 'REALISTIC', icon: realisticIconPng },
            { id: 'parallax', label: 'Parallax', icon: parallaxIconPng },
            { id: 'three_d_touch', label: '3D Pop-out', icon: ThreeDIcon },
        ]
    }
];

export const freeStyleIds = ['abstract_flow', 'geometric_synth', 'minimal_neon', 'retro_futurism', 'sci_fi', 'vaporwave', 'line_art', 'monochrome'];

export const freeEffectIds = [
    'sparkle', 'blur', 'particles', 'rain', 'snow', 'bubbles', 'sepia',
    'fireflies', 'matrix_rain', 'tv_static',
    'light_speed', 'equalizer', 'floating_embers'
];

const allStylesOriginal = initialStyleCategories.flatMap(c => c.styles);
const freeStylesList = freeStyleIds
    .map(id => allStylesOriginal.find(s => s.id === id))
    .filter((s): s is Option => s !== undefined)
    .sort((a, b) => a.label.localeCompare(b.label));

const otherCategories = initialStyleCategories.map(cat => ({
    ...cat,
    styles: cat.styles.filter(s => !freeStyleIds.includes(s.id))
})).filter(cat => cat.styles.length > 0);

export const styleCategories: StyleCategory[] = [
    {
        name: 'Free',
        styles: freeStylesList
    },
    ...otherCategories
];

export const styles: Option[] = initialStyleCategories.flatMap(category => category.styles);

export const uiStyleCategories: StyleCategory[] = [
    {
        name: 'All',
        styles: styles.sort((a, b) => a.label.localeCompare(b.label)),
    },
     {
        name: 'Free',
        styles: freeStylesList
    },
    ...initialStyleCategories,
];

export const animationOptions: AnimationOption[] = [
    { id: 'camera_pan', label: 'CAMERA PAN', icon: CameraPanIcon, isPremium: true, controls: ['pan'] },
    { id: 'zoom_in', label: 'ZOOM IN', icon: ZoomInIcon, isPremium: true, controls: ['zoom'] },
    { id: 'gentle_swirl', label: 'GENTLE SWIRL', icon: GentleSwirlIcon, isPremium: true, controls: ['swirl'] },
    { id: 'tilt', label: 'TILT', icon: TiltIcon, isPremium: true, controls: ['tilt'] },
    { id: 'arc', label: 'ARC', icon: ArcIcon, isPremium: true, controls: ['pan'] },
    { id: 'drone', label: 'DRONE SHOT', icon: DroneIcon, isPremium: true, controls: ['zoom'] },
    { id: 'handheld', label: 'HANDHELD', icon: HandheldIcon, isPremium: true, controls: [] },
    { id: 'boom', label: 'BOOM SHOT', icon: BoomIcon, isPremium: true, controls: ['tilt'] },
    { id: 'vertigo', label: 'DOLLY ZOOM', icon: VertigoIcon, isPremium: true, controls: [] },
    { id: 'spin', label: 'SPIN', icon: SpinIcon, isPremium: true, controls: ['swirl'] },
    { id: 'pulse', label: 'PULSE', icon: PulseIcon, isPremium: true, controls: [] },
];

export const animationPresets: AnimationPreset[] = [
  {
    id: 'slow-zoom',
    name: 'Slow Creep',
    description: 'A subtle, slow zoom-in for a dramatic reveal.',
    settings: {
      zoomAmount: 15,
      panDirection: 'right', // default
      swirlDirection: 'clockwise', // default
      tiltDirection: 'up',
    },
  },
  {
    id: 'fast-zoom',
    name: 'Rapid Rush',
    description: 'A quick, energetic zoom-in effect.',
    settings: {
      zoomAmount: 75,
      panDirection: 'right',
      swirlDirection: 'clockwise',
      tiltDirection: 'up',
    },
  },
  {
    id: 'gentle-pan-left',
    name: 'Gentle Pan Left',
    description: 'A smooth and slow camera pan to the left.',
    settings: {
      zoomAmount: 25,
      panDirection: 'left',
      swirlDirection: 'clockwise',
      tiltDirection: 'up',
    },
  },
  {
    id: 'gentle-pan-right',
    name: 'Gentle Pan Right',
    description: 'A smooth and slow camera pan to the right.',
    settings: {
      zoomAmount: 25,
      panDirection: 'right',
      swirlDirection: 'clockwise',
      tiltDirection: 'up',
    },
  },
  {
    id: 'vortex-swirl',
    name: 'Vortex Swirl',
    description: 'A mesmerizing clockwise swirl, pulling you in.',
    settings: {
      zoomAmount: 25,
      panDirection: 'right',
      swirlDirection: 'clockwise',
      tiltDirection: 'up',
    },
  },
  {
    id: 'reverse-vortex',
    name: 'Reverse Vortex',
    description: 'A disorienting counter-clockwise swirl.',
    settings: {
      zoomAmount: 25,
      panDirection: 'right',
      swirlDirection: 'counter-clockwise',
      tiltDirection: 'up',
    },
  },
];

export const dynamicEffects: EffectOption[] = [
    { id: 'particles', label: 'PARTICLES', icon: ParticlesIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Density', hasSpeedControl: true, speedLabel: 'Speed', hasSpreadControl: true, spreadLabel: 'Size' },
    { id: 'sparkle', label: 'SPARKLE', icon: SparkleIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Density', hasSpreadControl: true, spreadLabel: 'Size' },
    { id: 'rain', label: 'RAIN', icon: RainIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Intensity', hasSpeedControl: true, speedLabel: 'Speed', hasDirectionControl: true, directionLabel: 'Angle', hasSpreadControl: true, spreadLabel: 'Thickness' },
    { id: 'snow', label: 'SNOW', icon: SnowIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Flurry', hasSpeedControl: true, speedLabel: 'Speed', hasDirectionControl: true, directionLabel: 'Angle', hasSpreadControl: true, spreadLabel: 'Size' },
    { id: 'bubbles', label: 'BUBBLES', icon: BubblesIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Density', hasSpeedControl: true, speedLabel: 'Speed', hasSpreadControl: true, spreadLabel: 'Size' },
    { id: 'fireflies', label: 'FIREFLIES', icon: FireflyIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Density', hasSpeedControl: true, speedLabel: 'Speed', hasSpreadControl: true, spreadLabel: 'Size' },
    { id: 'matrix_rain', label: 'MATRIX', icon: MatrixIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Density', hasSpeedControl: true, speedLabel: 'Speed' },
    { id: 'tv_static', label: 'STATIC', icon: TvStaticIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Intensity' },
    { id: 'light_speed', label: 'LIGHT SPEED', icon: LightSpeedIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Speed' },
    { id: 'equalizer', label: 'EQUALIZER', icon: EqualizerIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Activity' },
    { id: 'floating_embers', label: 'EMBERS', icon: EmbersIcon, type: 'canvas', hasSlider: true, sliderLabel: 'Density', hasSpeedControl: true, speedLabel: 'Speed', hasSpreadControl: true, spreadLabel: 'Size' },
];

export const imageFilters: EffectOption[] = [
    { id: 'blur', label: 'BLUR', icon: BlurIcon, type: 'css', hasSlider: true, sliderLabel: 'Intensity' },
    { id: 'sepia', label: 'SEPIA', icon: SepiaIcon, type: 'css', hasSlider: true, sliderLabel: 'Intensity' },
    { id: 'neon_glow', label: 'NEON GLOW', icon: NeonGlowIcon, type: 'generative', hasSlider: true, sliderLabel: 'Intensity', hasColorControl: true, hasSpreadControl: true, spreadLabel: 'Spread' },
    { id: 'ambient_light', label: 'AMBIENT LIGHT', icon: AmbientLightIcon, type: 'overlay', hasSlider: true, sliderLabel: 'Intensity', hasColorControl: true },
    { id: 'vaporwave', label: 'VAPORWAVE', icon: vaporwaveIconPng, type: 'css', hasSlider: true, sliderLabel: 'Intensity' },
    { id: 'glitch', label: 'GLITCH', icon: glitchIconPng, type: 'generative', hasSlider: true, sliderLabel: 'Intensity' },
];

export const allEffects: EffectOption[] = [...dynamicEffects, ...imageFilters];

export const styleDescriptions: { [key: string]: { name: string; description: string } } = {
    // Artistic
    abstract_flow: { name: 'Abstract', description: 'Fluid, organic shapes and flowing lines in a non-representational style.' },
    art_deco: { name: 'Art Deco', description: 'Elegant, geometric patterns and bold lines from the 1920s.' },
    art_nouveau: { name: 'Art Nouveau', description: 'Ornate, flowing lines and natural forms inspired by plants and flowers.' },
    cubism: { name: 'Cubism', description: 'An early 20th-century art movement which revolutionized European painting and sculpture.' },
    expressionism: { name: 'Expressionism', description: 'A modernist movement, originating in Germany at the beginning of the 20th century.' },
    mosaic: { name: 'Mosaic', description: 'Images created from small, colored tiles (tesserae).' },
    oil_painting: { name: 'Oil Painting', description: 'Rich, textured brushstrokes and deep, blended colors.' },
    pop_art: { name: 'Pop Art', description: 'Bold, vibrant colors and imagery from popular culture, like comic books.' },
    suprematism: { name: 'Suprematism', description: 'An art movement focused on basic geometric forms, such as circles, squares, lines, and rectangles.' },
    tattoo: { name: 'Tattoo Art', description: 'Bold outlines and classic motifs inspired by traditional tattoo styles.' },
    ukiyo_e: { name: 'Ukiyo-e', description: 'Japanese woodblock prints with flowing lines and flat areas of color.' },
    watercolor: { name: 'Watercolor', description: 'Soft, translucent washes of color with a light, blended feel.' },
    // Craft & Traditional
    claymation: { name: 'Claymation', description: 'A charming, handcrafted look inspired by stop-motion clay animation.' },
    graffiti: { name: 'Graffiti', description: 'Bold, spray-painted aesthetics with stylized lettering and urban energy.' },
    low_poly: { name: 'Low Poly', description: 'A minimalist, faceted look using geometric polygons.' },
    origami: { name: 'Origami', description: 'Intricate designs that appear to be folded from a single sheet of paper.' },
    papercraft: { name: 'Papercraft', description: 'A layered, 3D effect that looks like it\'s built from cut and folded paper.' },
    sketch: { name: 'Sketch', description: 'A hand-drawn look with visible pencil lines and cross-hatching.' },
    stained_glass: { name: 'Stained Glass', description: 'Vibrant, colored panes held together by bold, dark lines.' },
    // Anime
    anime_manga: { name: 'Anime', description: 'The iconic Japanese animation style with expressive characters and dynamic action.' },
    shounen: { name: 'Shounen', description: 'Action-packed and energetic anime style, often featuring dynamic battles and heroes.' },
    shoujo: { name: 'Shoujo', description: 'Romantic and emotional anime style with soft colors and characters with large, expressive eyes.' },
    mecha: { name: 'Mecha', description: 'A genre of anime and manga that features giant robots or machines (mecha) controlled by people.' },
    // Minimalist
    line_art: { name: 'Line Art', description: 'Art created with simple, clean lines without shading, emphasizing form and outline.' },
    monochrome: { name: 'Monochrome', description: 'An image created using only one color or shades of one color.' },
    geometric_minimal: { name: 'Geo Minimal', description: 'A minimalist style focusing on the purity of simple geometric shapes and forms.' },
    minimal_neon: { name: 'Minimal', description: 'Simple, clean lines and shapes illuminated with a vibrant neon glow.' },
    // Surrealism
    dreamlike: { name: 'Dreamlike', description: 'Eerie, bizarre, and illogical scenes with a quality of a dream.' },
    scribble_art: { name: 'Scribble Art', description: 'Art created from random and abstract lines, often to express raw emotion.' },
    juxtaposition: { name: 'Juxtaposition', description: 'Placing unrelated objects or elements close together for a surprising or witty effect.' },
    dadaism: { name: 'Dadaism', description: 'Absurd, chaotic, and anti-art, often using collage and random elements.' },
    // Digital & Sci-Fi
    cyberpunk: { name: 'Cyberpunk', description: 'A high-tech, futuristic world of neon lights and dystopian cityscapes.' },
    geometric_synth: { name: 'Geometric', description: 'Clean, precise shapes and patterns for a modern, abstract feel.' },
    glitch_art: { name: 'Glitch', description: 'Digital errors and artifacts for a distorted, chaotic aesthetic.' },
    pixel_art: { name: 'Pixel Art', description: 'A retro, blocky style reminiscent of classic 8-bit video games.' },
    retro_futurism: { name: 'Retro Futurism', description: 'A vision of the future as imagined in past decades, like the 1950s.' },
    sci_fi: { name: 'Sci-Fi', description: 'Futuristic technology, spaceships, and alien worlds.' },
    vaporwave: { name: 'Vaporwave', description: 'A nostalgic, retro aesthetic of 80s and 90s internet culture, with pastel colors.' },
    // Fantasy & Thematic
    christmas: { name: 'Christmas', description: 'Festive holiday themes with snow, lights, and decorations.' },
    easter: { name: 'Easter', description: 'Cheerful spring themes with pastel colors, eggs, and bunnies.' },
    fantasy: { name: 'Fantasy', description: 'Mythical creatures, enchanted forests, and magical castles.' },
    gothic: { name: 'Gothic', description: 'Dark, mysterious themes with ornate architecture and a moody atmosphere.' },
    gothic_victorian: { name: 'Gothic Victorian', description: 'Combines dark gothic elements with 19th-century Victorian elegance.' },
    halloween: { name: 'Halloween', description: 'Spooky and fun themes with pumpkins, ghosts, and a dark color palette.' },
    medieval: { name: 'Medieval', description: 'Knights, castles, and scenes from the Middle Ages.' },
    steampunk: { name: 'Steampunk', description: 'A retro-futuristic world powered by steam and intricate clockwork.' },
    zombie: { name: 'Zombie', description: 'A fun, cartoonish take on the undead, inspired by games like \'Plants vs. Zombies\'.' },
        // Games & Pop Culture
    fallout: { name: 'Fallout', description: 'A retro-futuristic, post-apocalyptic world inspired by the video game series.' },
    lego_style: { name: 'LEGO', description: 'A vibrant, blocky world where everything is built from LEGO bricks.' },
    pixar: { name: 'PIXAR', description: 'The heartwarming, detailed 3D animation style of Pixar films.' },
    toy_look: { name: 'Toy Look', description: 'A shiny, plastic aesthetic of new action figures in their packaging.' },
    // General
    abstract_geometry: { name: 'Abstract Geo', description: 'A fusion of non-representational art and clean, geometric forms.' },
    organic_glow: { name: 'Organic', description: 'Flowing, natural shapes illuminated with a soft, internal light.' },
    pastel: { name: 'Pastel', description: 'Soft, gentle colors with a dreamy and light-hearted feel.' },
    retro: { name: 'Retro', description: 'A nostalgic style inspired by the design trends of the 1950s-70s.' },
    // Illustration
    '3d_illustration': { name: '3D Render', description: 'Clean, computer-generated images with a focus on depth and form.' },
    '3d_blocks': { name: '3D Blocks', description: 'A style featuring isometric 3D shapes and blocks with simple shading.' },
    '3d_voxel': { name: 'Voxel Art', description: 'A retro 3D style built from volumetric pixels (voxels), creating a blocky, 3D pixelated look.' },
    cartoon: { name: 'Cartoon', description: 'A playful, simplified style with bold outlines and bright colors.' },
    comic_book: { name: 'Comic Book', description: 'Dynamic panel layouts, bold inks, and halftone patterns of American comics.' },
    diorama: { name: 'Diorama', description: 'A miniature, 3D model scene with a tilt-shift effect to emphasize scale.' },
    ghibli: { name: 'Ghibli', description: 'The lush, hand-painted look of Studio Ghibli films, full of wonder and nature.' },
    // Photography & Film
    chromatic_aberration: { name: 'Aberration', description: 'A visual effect with color fringing around edges, like a distorted lens.' },
    bokeh: { name: 'Bokeh', description: 'Soft, out-of-focus circles of light in the background of an image.' },
    cinematic: { name: 'Cinematic', description: 'The look and feel of a high-budget Hollywood movie frame.' },
    golden_hour: { name: 'Golden Hour', description: 'The warm, soft light of sunrise or sunset, creating long shadows.' },
    long_exposure: { name: 'Long Exposure', description: 'A photography technique that blurs motion, creating light trails.' },
    noir: { name: 'Noir', description: 'High-contrast black and white with dramatic shadows, inspired by classic crime films.' },
    realistic: { name: 'Realistic', description: 'A photorealistic style that aims to mimic reality as closely as possible.' },
    parallax: { name: 'Parallax', description: 'Creates a 3D depth effect with distinct foreground and background layers.' },
    three_d_touch: { name: '3D Pop-out', description: 'An image with realistic 3D depth that responds to device motion.' },
};

export const effectDescriptions: { [key: string]: { name: string; description: string } } = {
    // Dynamic Effects
    particles: { name: 'Particles', description: 'Adds gently falling, multi-color glowing particles from the top of the screen.' },
    sparkle: { name: 'Sparkle', description: 'Adds shimmering sparkles that randomly appear and fade.' },
    rain: { name: 'Rain', description: 'Simulates raindrops hitting and trickling down the screen.' },
    snow: { name: 'Snow', description: 'Adds gently falling snowflakes with a slight parallax effect.' },
    bubbles: { name: 'Bubbles', description: 'Creates colorful bubbles that float up from the bottom.' },
    fireflies: { name: 'Fireflies', description: 'Simulates enchanting fireflies that drift and glow softly.' },
    matrix_rain: { name: 'Matrix Rain', description: 'A shower of glowing green digital characters, like in The Matrix.' },
    tv_static: { name: 'TV Static', description: 'Applies a classic television static or white noise effect.' },
    light_speed: { name: 'Light Speed', description: 'Creates the effect of traveling through space at high speed with light streaks.' },
    equalizer: { name: 'Equalizer', description: 'Adds animated vertical bars that mimic a music equalizer.' },
    floating_embers: { name: 'Floating Embers', description: 'Simulates glowing embers gently rising, as from a fire.' },
    // Image Filters
    vaporwave: { name: 'Vaporwave', description: 'Applies a retro, 80s-inspired aesthetic with pink and cyan tones.' },
    glitch: { name: 'Glitch', description: 'Introduces digital glitch artifacts and color separation.' },
    blur: { name: 'Blur', description: 'Applies a Gaussian blur to the image, making it appear out-of-focus.' },
    ambient_light: { name: 'Ambient Light', description: 'Casts a soft, colored light from the edges of the wallpaper, creating a moody glow.' },
    sepia: { name: 'Sepia', description: 'Applies a classic sepia tone for a warm, vintage photograph look.' },
    neon_glow: { name: 'Neon Glow', description: 'Adds a vibrant, glowing edge effect to elements in the image.' },
};

export const samplePrompts: string[] = [
  "A 1950s diner in a whimsical miniature diorama",
  "A battle between a giant mech and a sea monster",
  "A beautiful mosaic of a phoenix rising from ashes",
  "A bioluminescent mushroom in an enchanted forest at night",
  "A black and white noir scene of a detective's office",
  "A charming, whimsical robot tending to a garden of glowing flowers",
  "A city built inside a giant, hollowed-out geode",
  "A city skyline during the golden hour",
  "A close-up of a dragon's eye in a tattoo art style",
  "A colossal space whale swimming through the stars",
  "A colossal kraken attacking a pirate ship during a storm",
  "A coral reef thriving in the rings of a gas giant planet",
  "A crystal cave with shimmering, translucent walls",
  "A crystalline structure growing on a forgotten alien planet",
  "A cyberpunk detective walking down a rain-slicked alley",
  "A cyberpunk geisha with intricate tattoo art style markings",
  "A dark Victorian street under a full moon, in a gothic style",
  "A deer in a forest during golden hour, with long shadows",
  "A detailed cutaway view of an ant colony's nest",
  "A detailed papercraft model of a futuristic spaceship",
  "A diorama of a tiny medieval village inside a glass bottle",
  "A dragon made of crystal sleeping on a hoard of stars",
  "A dramatic shadow in a black and white noir alleyway",
  "A field of flowers made from colorful papercraft",
  "A field of sunflowers that turn to watch a binary sunset",
  "A flock of origami birds flying through a bamboo forest",
  "A floating island with a single, ancient tree",
  "A floating market in a city of canals, lit by lanterns",
  "A futuristic cyberpunk city with flying cars and neon signs",
  "A garden where the flowers are made of spun glass",
  "A ghost ship sailing on a misty sea under a full moon",
  "A glitch art portrait of a cyborg",
  "A golden hour landscape with a serene lake",
  "A gothic Victorian couple in an old, dusty library",
  "A hidden underwater city made of coral and light",
  "A hyper-detailed retro cassette player floating in space",
  "A knight battling a dragon in a medieval tapestry style",
  "A layered papercraft scene of a deep forest",
  "A library of glowing books on the branches of a giant tree",
  "A lone astronaut gazing at a swirling nebula",
  "A lone wanderer in a noir city street, with rain reflecting neon signs",
  "A lonely lighthouse during a stormy noir night",
  "A low-poly model of a wolf howling at a geometric moon",
  "A majestic griffin soaring over a medieval castle",
  "A majestic phoenix rising from ashes",
  "A massive, overgrown greenhouse filled with exotic, glowing plants",
  "A medieval castle built on the back of a giant turtle",
  "A medieval marketplace bustling with villagers and merchants",
  "A medieval scribe writing in a dimly lit room",
  "A minimalist zen garden on a spaceship orbiting Earth",
  "A miniature diorama of a bustling steampunk city",
  "A mosaic portrait of a mysterious woman",
  "A mysterious forest path in a whimsical miniature diorama",
  "A mystical owl with tattoo art style patterns on its feathers",
  "A neon-drenched ramen shop in a rainy Tokyo alley",
  "A network of glowing digital neurons firing",
  "A noir detective office on a rainy night on Venus",
  "A noir detective looking out a rain-streaked window",
  "A papercraft bouquet of intricate, colorful flowers",
  "A papercraft dragon breathing fire made of folded paper strips",
  "A papercraft landscape with mountains, trees, and a river",
  "A portrait of a woman in a classic tattoo art style",
  "A quiet medieval village at sunrise",
  "A quiet, snowy village in a snow globe",
  "A retro-futuristic diner with chrome details and holographic menus",
  "A Roman bathhouse depicted in an ancient mosaic style",
  "A samurai warrior with a laser katana facing a robot oni",
  "A secret garden revealed through a stone archway in a mosaic",
  "A secret library hidden behind a waterfall",
  "A sentient storm cloud with lightning for eyes",
  "A serene beach scene at golden hour",
  "A serene mountain landscape reflected in a crystal clear lake",
  "A spooky gothic Victorian mansion on a hill",
  "A stained glass window depicting a medieval battle",
  "A still life of fruit in a beautiful mosaic pattern",
  "A stylized wolf in a bold tattoo art style",
  "A surreal landscape made entirely of papercraft models",
  "A surrealist painting of a clock melting over a desert landscape",
  "A synthwave sunset over a digital ocean",
  "A tiny astronaut exploring a vast, alien dessert",
  "A traditional Japanese temple rendered in mosaic tiles",
  "A tranquil Japanese garden with a koi pond and cherry blossoms",
  "A tranquil koi pond in a whimsical miniature diorama",
  "A vintage car on a wet street in a noir film style",
  "A whimsical miniature diorama of a fairy tale cottage",
  "A whimsical miniature diorama of an alien planet",
  "Abstract geometric shapes floating in zero gravity",
  "An anchor and roses in a classic tattoo art style",
  "An ancient, moss-covered monolith in a misty forest",
  "An ancient Egyptian tomb with futuristic hieroglyphs",
  "An ancient tree with glowing runes in a medieval forest",
  "An art deco cityscape on Mars",
  "An elaborate gothic Victorian ballroom with dancers",
  "An enchanted sword stuck in a stone in a sun-dappled glade",
  "An enchanted vinyl record playing music that materializes as light",
  "An interdimensional portal opening in a subway station",
  "An intricate mechanical dragon powered by steam",
  "An intricate tattoo art style mandala",
  "An underwater scene with coral reefs in a mosaic",
  "Bioluminescent mushrooms in an enchanted forest at night",
  "City skyline during the golden hour",
  "Fantasy marketplace bustling with mythical creatures",
  "Forgotten god's statue overgrown with glowing vines",
  "Intricate gothic Victorian architecture with gargoyles",
  "Liquid marble with veins of gold and cyan swirling slowly",
  "Steampunk-inspired owl with glowing clockwork eyes",
  "The interior of a grand medieval cathedral",
  "The silhouette of a lone tree at golden hour",
  "A library inside a giant crystal cave, books glowing with inner light",
  "A tranquil scene of a Japanese zen garden on Mars",
  "An Art Nouveau city street with elegant, flowing architecture",
  "A massive, ancient tree whose roots are intertwined with a ruined city",
  "A cute, fluffy creature discovering a field of giant, sparkling mushrooms",
  "A steampunk observatory with intricate brass telescopes and gears",
  "A surreal desert landscape where the dunes are made of flowing liquid metal",
  "A lone astronaut fishing on the rings of Saturn",
  "A bustling medieval fantasy market filled with mythical creatures",
  "A neon-noir cityscape with flying cars seen from a high-rise balcony",
  "A portrait of a forest spirit, composed of leaves, moss, and branches",
  "An underwater city inhabited by elegant, jellyfish-like beings",
  "A whimsical candy-land with chocolate rivers and gingerbread houses",
  "A gothic castle perched on a cliff during a lightning storm",
  "A close-up of a complex mechanical butterfly with glowing wings",
  "A solarpunk city with lush vertical gardens and clean, futuristic architecture",
  "A majestic wolf made of constellations, howling at a cosmic moon",
  "A tiny boat sailing on a sea of clouds at sunset",
  "An ancient Roman villa in ruins, reclaimed by vibrant nature",
  "A retro-futuristic robot DJ at a packed dance club in the 1980s",
];

export const textColors = [
  '#FFFFFF', '#000000', '#22d3ee', '#a855f7', '#ec4899', '#facc15', '#4ade80', '#f87171',
  '#f97316', '#38bdf8', '#818cf8', '#c084fc', '#fb7185', '#34d399', '#60a5fa', '#a78bfa'
];

export const dynamicBackgroundOptions: DynamicBackgroundOption[] = [
    { id: 'none', label: 'Default', icon: NoneIcon },
    { id: 'aurora', label: 'Aurora', icon: AuroraIcon },
    { id: 'color-bends', label: 'Color Bends', icon: IridescenceIcon },
    { id: 'galaxy', label: 'Galaxy', icon: GalaxyIcon },
    { id: 'geometric', label: 'Geometric', icon: AbstractGeometryIcon },
    { id: 'hyperspeed', label: 'Hyperspeed', icon: LightSpeedIcon },
    { id: 'light-rays', label: 'Light Rays', icon: LightRaysIcon },
    { id: 'nebula', label: 'Nebula', icon: NebulaIcon },
    { id: 'particles', label: 'Particles', icon: ParticlesIcon },
    { id: 'pixel-blast', label: 'Pixel Blast', icon: PixelBlastIcon },
    { id: 'soft-lines', label: 'Soft Lines', icon: SoftLinesIcon },
    { id: 'starlight', label: 'Starlight', icon: SparkleIcon },
];

export const defaultColorPresets: ColorPreset[] = [
    { id: 'default', name: 'Deep Space', settings: { h: 255, s: 80, l: 10 } },
    { id: 'synthwave', name: 'Synthwave', settings: { h: 300, s: 90, l: 15 } },
    { id: 'cyber', name: 'Cyber Blue', settings: { h: 210, s: 90, l: 12 } },
    { id: 'forest', name: 'Enchanted Forest', settings: { h: 140, s: 70, l: 8 } },
];
