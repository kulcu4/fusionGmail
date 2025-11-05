import { GenerationProvider } from '../types';
import { Operation, GenerateVideosResponse } from "@google/genai";

import * as gemini from './providers/gemini';
import * as runware from './providers/runware';

// FIX: 'ProviderFunctions' was defined using a union type as an index, which is not allowed.
// It is now explicitly defined as the type of one of the provider implementations.
// The 'providers' object is also explicitly typed as a Record to ensure type safety.
type ProviderFunctions = typeof gemini;

const providers: Record<GenerationProvider, ProviderFunctions> = {
  gemini: {
    generateWallpaper: gemini.generateWallpaper,
    startVideoGeneration: gemini.startVideoGeneration,
    checkVideoGenerationStatus: gemini.checkVideoGenerationStatus,
    getVideoResult: gemini.getVideoResult,
    editWallpaper: gemini.editWallpaper,
    // FIX: Add missing 'startImageAnimation' function to conform to the 'ProviderFunctions' type.
    startImageAnimation: gemini.startImageAnimation,
  },
  runware: {
    generateWallpaper: runware.runwareGenerateWallpaper,
    startVideoGeneration: runware.runwareStartVideoGeneration,
    checkVideoGenerationStatus: runware.runwareCheckVideoGenerationStatus,
    getVideoResult: runware.runwareGetVideoResult,
    editWallpaper: runware.runwareEditWallpaper,
    // FIX: Add missing 'startImageAnimation' function to conform to the 'ProviderFunctions' type.
    startImageAnimation: runware.runwareStartImageAnimation,
  }
};

const getProvider = (provider: GenerationProvider): ProviderFunctions => {
    // FIX: Typing `providers` as a Record resolves the indexing error, as TypeScript now knows `provider` is a valid key.
    if (!providers[provider]) {
        throw new Error(`Unknown generation provider: ${provider}`);
    }
    return providers[provider];
};

export const generateWallpaper = (
    provider: GenerationProvider,
    prompt: string,
    style: string,
    imageCount: number,
    color: string | null
): Promise<string[]> => {
    return getProvider(provider).generateWallpaper(prompt, style, imageCount, color);
};

export const startVideoGeneration = (
    provider: GenerationProvider,
    prompt: string, 
    style: string, 
    animation: string, 
    settings: { zoomAmount: number; panDirection: string; swirlDirection: string; tiltDirection: string; }
): Promise<Operation<GenerateVideosResponse>> => {
    return getProvider(provider).startVideoGeneration(prompt, style, animation, settings);
};

export const checkVideoGenerationStatus = (
    provider: GenerationProvider,
    operation: Operation<GenerateVideosResponse>
): Promise<Operation<GenerateVideosResponse>> => {
    return getProvider(provider).checkVideoGenerationStatus(operation);
};

export const getVideoResult = (
    provider: GenerationProvider,
    operation: Operation<GenerateVideosResponse>
): Promise<Blob> => {
    return getProvider(provider).getVideoResult(operation);
};

export const editWallpaper = (
    provider: GenerationProvider,
    base64Image: string,
    effects: { [key: string]: any }
): Promise<string> => {
    return getProvider(provider).editWallpaper(base64Image, effects);
};

// FIX: Add and export 'startImageAnimation' to make it available as a generation service function.
export const startImageAnimation = (
    provider: GenerationProvider,
    base64ImageDataUri: string
): Promise<Operation<GenerateVideosResponse>> => {
    return getProvider(provider).startImageAnimation(base64ImageDataUri);
};