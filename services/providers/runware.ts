import { Operation, GenerateVideosResponse } from "@google/genai";

// Placeholder function to simulate Runware image generation
export const runwareGenerateWallpaper = async (prompt: string, style: string, imageCount: number, color: string | null): Promise<string[]> => {
    console.log("Using placeholder Runware API for images.");

    const createPlaceholderSvg = (index: number) => {
        const svg = `
            <svg width="360" height="640" viewBox="0 0 360 640" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#4a00e0" />
                        <stop offset="100%" style="stop-color:#8e2de2" />
                    </linearGradient>
                </defs>
                <rect width="360" height="640" fill="url(#grad)" />
                <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="24" fill="white" font-weight="bold">Runware AI</text>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" fill="white">Image ${index + 1} / ${imageCount}</text>
                 <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="white" style="opacity: 0.7">${style}</text>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const images = Array.from({ length: imageCount }, (_, i) => createPlaceholderSvg(i));
    return images.map(svgDataUrl => svgDataUrl.split(',')[1]); // Return base64 part
};

// Placeholder function for Runware video generation
export const runwareStartVideoGeneration = async (
    prompt: string, 
    style: string, 
    animation: string, 
    settings: any
): Promise<Operation<GenerateVideosResponse>> => {
    console.log("Using placeholder Runware API for video.");
    throw new Error("Video generation is not implemented for the Runware provider yet.");
};

// FIX: Add placeholder for 'startImageAnimation' to match the provider interface and resolve type errors.
export const runwareStartImageAnimation = async (
    base64ImageDataUri: string
): Promise<Operation<GenerateVideosResponse>> => {
    console.log("Using placeholder Runware API for image animation.");
    throw new Error("Image animation is not implemented for the Runware provider yet.");
};

export const runwareCheckVideoGenerationStatus = async (operation: any): Promise<any> => {
    throw new Error("Video generation is not implemented for the Runware provider yet.");
};

export const runwareGetVideoResult = async (operation: any): Promise<Blob> => {
     throw new Error("Video generation is not implemented for the Runware provider yet.");
};

// Placeholder for editing. Runware might not support this, so we return the original.
export const runwareEditWallpaper = async (base64Image: string, effects: any): Promise<string> => {
    console.log("Runware edit placeholder: returning original image.");
    const match = base64Image.match(/^data:(image\/.+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid image format for editing.");
    }
    return match[2];
};