// FIX: The type for video generation operations is `Operation`, not `VideosOperation`.
// FIX: Added `GenerateVideosResponse` as the generic type for `Operation` to specify the expected response structure for video generation operations.
import { GoogleGenAI, Modality, Operation, GenerateVideosResponse } from "@google/genai";
import { allEffects as effectOptions } from '../../constants';

// FIX: Switched from Vite-specific `import.meta.env` to `process.env.API_KEY` to match the configuration in `vite.config.ts` and resolve module loading errors.
const apiKey = process.env.API_KEY;

// Throw an error if the API key is missing to prevent silent failures
if (!apiKey) {
    throw new Error("API_KEY not found. Please check your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

// The rest of your code...
// ====================================================================================


interface EffectSettings {
    intensity: number;
    spread?: number;
    color?: string;
    direction?: string;
}

const buildEffectsPrompt = (effects: { [key: string]: EffectSettings }): string => {
    if (Object.keys(effects).length === 0) return '';

    let promptSuffix = '';
    const effectDescriptions = Object.entries(effects).map(([id, settings]) => {
        const { intensity, color, direction, spread } = settings;
        const effectDetail = effectOptions.find(e => e.id === id);
        if (!effectDetail) return '';

        let description = '';
        const level = intensity < 0.33 ? 'subtle' : intensity < 0.66 ? 'moderate' : 'heavy';

        switch (id) {
            case 'distort':
                description = `a ${level === 'heavy' ? 'heavy and pronounced' : level} wavy, heat-haze-like distortion effect`;
                break;
            case 'glitch':
                description = `a ${level === 'heavy' ? 'strong and very noticeable' : level} digital glitch artifact and color separation effect`;
                break;
            case 'pixelate':
                description = `a ${level === 'heavy' ? 'heavy' : level} pixelation effect, creating a ${level === 'heavy' ? 'very chunky' : 'retro'} 8-bit video game aesthetic`;
                break;
            case 'bokeh':
                description = `a ${level === 'heavy' ? 'very strong' : level} bokeh effect with large, soft, out-of-focus light circles`;
                break;
            case 'chromatic_abberation':
                description = `a ${level === 'heavy' ? 'heavy and distinct' : level} chromatic aberration effect, creating visible red and cyan color fringing around edges`;
                break;
            case 'gyroscope':
                promptSuffix = ' The image should be zoomed in by 20% to avoid dark edges when used with a parallax or gyroscopic effect.';
                description = 'a subtle 3D depth';
                break;
             case 'blur':
                description = `a ${level === 'heavy' ? 'very strong' : level} Gaussian blur effect`;
                break;
             case 'ambient_light':
                description = `a ${level} ${color || 'white'} ambient light glow emanating from the edges`;
                break;
            case 'sepia':
                description = `a ${level} sepia filter, giving the image a warm, brownish, vintage photograph look`;
                break;
            case 'neon_glow':
                const spreadLevel = !spread ? 'subtle' : spread < 0.33 ? 'tight' : spread < 0.66 ? 'moderate' : 'wide';
                description = `a ${level} ${color || 'cyan'} neon glow effect with a ${spreadLevel} spread`;
                break;
            default:
                description = effectDetail.label.toLowerCase();
                if (effectDetail.hasSlider) {
                    description = `${level} ${description}`;
                }
        }
        
        return description;
    }).filter(Boolean);

    if (effectDescriptions.length === 0) return promptSuffix;
    
    return `incorporating visual effects like ${effectDescriptions.join(', ')}.${promptSuffix}`;
};

// FIX: Renamed function to `generateWallpaper` as hinted by the error message to resolve import issues.
export const generateWallpaper = async (prompt: string, style: string, imageCount: number, color: string | null): Promise<string[]> => {
    
    // Text-to-Image generation
    const styleId = style.toLowerCase().replace(/ /g, '_');

    let fullPrompt: string;
    const basePrompt = `A high-resolution, 8k, detailed, cinematic mobile wallpaper of: "${prompt}".`;
    let stylePrompt = `The overall aesthetic should be ${style}.`;
    let themePrompt = `Use a dark theme with a visually appealing color palette that complements the subject. Avoid overly saturated, distracting neon colors unless specifically requested by the style.`;
    if (color) {
        themePrompt += ` The main color scheme should be based around ${color}.`;
    }
    let closingPrompt = `Make it visually stunning.`;

    switch (styleId) {
        case 'parallax':
            stylePrompt = `Create a wallpaper of "${prompt}" with a multi-layered scene for a parallax effect.`;
            themePrompt = `Ensure there is a distinct foreground element, a detailed mid-ground, and a deep, continuous background. Use a wide-angle lens and a cinematic depth of field to emphasize separation. ${themePrompt}`;
            break;
        case 'three_d_touch':
            stylePrompt = `Create a wallpaper of "${prompt}" with dramatic 3D realism.`;
            themePrompt = `Use strong directional lighting from top-left, pronounced drop shadows, clear object edges, and exaggerated size perspective. Objects should appear to have volume and physical presence, as if you could reach out and touch them. ${themePrompt}`;
            break;
        case 'pixel_art':
            stylePrompt = `Create a wallpaper in a retro 8-bit pixel art style, based on the prompt "${prompt}".`;
            themePrompt = `The style must be strictly 8-bit, with a limited color palette, no anti-aliasing, and a blocky, pixelated aesthetic. Ensure the final image has a low resolution feel typical of 8-bit graphics.`;
            break;
        case 'papercraft':
            stylePrompt = `Create a wallpaper of "${prompt}" in a layered papercraft style.`;
            themePrompt = `The entire scene should look like it is constructed from colorful, layered, and folded paper, with visible edges and a handcrafted, 3D feel.`;
            break;
        case 'gothic_victorian':
            stylePrompt = `Create a wallpaper in a dark, atmospheric Gothic Victorian style, based on the prompt "${prompt}".`;
            themePrompt = `Focus on ornate, dark architecture, vintage Victorian clothing, and a moody, mysterious environment. Use a desaturated color palette with deep shadows and dramatic lighting.`;
            break;
        case 'noir':
            stylePrompt = `Create a wallpaper in a classic black and white noir film style, based on the prompt "${prompt}".`;
            themePrompt = `The scene must be in high-contrast black and white, featuring dramatic shadows (chiaroscuro), rain-slicked streets, and a sense of mystery or suspense. The aesthetic should be reminiscent of 1940s and 1950s crime films.`;
            break;
        case 'diorama':
            stylePrompt = `Create a whimsical miniature diorama of "${prompt}".`;
            themePrompt = `The scene should look like a small, handcrafted model inside a box, with a shallow depth of field (tilt-shift effect) to emphasize the miniature scale. Use slightly exaggerated colors and a playful aesthetic.`;
            break;
        case 'tattoo':
        case 'tattoo_art':
            stylePrompt = `Create a wallpaper of "${prompt}" in a bold, traditional tattoo art style.`;
            themePrompt = `The image should feature bold black outlines, a limited color palette (like American traditional tattoos), and classic tattoo motifs. The composition should be clean and graphic.`;
            break;
        case 'golden_hour':
            stylePrompt = `Create a wallpaper depicting "${prompt}" during the golden hour.`;
            themePrompt = `The scene must be bathed in the warm, soft, low-angle sunlight characteristic of the period shortly after sunrise or before sunset. Emphasize long shadows, a warm color palette (golds, oranges, soft reds), and a peaceful, serene mood.`;
            break;
        case 'comic_book':
            stylePrompt = `Create a dynamic comic book page layout with multiple panels of varying shapes and sizes telling a simple story about "${prompt}".`;
            themePrompt = `Use vibrant, saturated colors, bold black outlines, and halftone dot patterns for shading. Include action words and onomatopoeia (e.g., 'BOOM!', 'ZAP!', 'WHOOSH!') in stylized lettering. The composition should be exciting and full of energy.`;
            break;
        case 'ghibli':
            stylePrompt = `Create a wallpaper in the iconic Studio Ghibli aesthetic, inspired by the prompt "${prompt}".`;
            themePrompt = `It should have a beautiful, hand-painted look with lush, vibrant nature, soft, warm lighting, and a sense of wonder and nostalgia. The scene should be peaceful and heartwarming.`;
            break;
        case 'pixar':
            stylePrompt = `Create a wallpaper in the iconic Pixar animation style, based on the prompt "${prompt}".`;
            themePrompt = `The scene should feature charming characters with expressive faces, vibrant colors, detailed textures, and beautiful cinematic lighting creating a sense of depth and realism. The overall mood should be heartwarming and magical.`;
            break;
        case 'lego_style':
            stylePrompt = `Create a wallpaper of "${prompt}" in the style of LEGO bricks.`;
            themePrompt = `The entire scene should look like it is constructed from colorful plastic toy bricks. The image should be vibrant, blocky, and have a playful aesthetic with visible studs on the bricks.`;
            break;
        case 'sketch':
            stylePrompt = `Create a detailed pencil sketch of "${prompt}".`;
            themePrompt = `The aesthetic should be a monochromatic, hand-drawn sketch with visible pencil strokes, cross-hatching for shading, and a focus on lines and form.`;
            break;
        case 'low_poly':
            stylePrompt = `Create a low-poly 3D render of "${prompt}".`;
            themePrompt = `The style should be geometric, faceted, and minimalist, using a vibrant color palette on the polygonal shapes to create a stylized, modern look.`;
            break;
        case 'graffiti':
            stylePrompt = `Create a vibrant graffiti street art mural of "${prompt}".`;
            themePrompt = `The image should feature a bold, colorful spray paint art style with stylized lettering, drips, sharp lines, and a dynamic composition, as if painted on a brick wall.`;
            break;
        case 'ukiyo_e':
            stylePrompt = `Create a wallpaper in the iconic Japanese Ukiyo-e woodblock print style, inspired by masters like Hokusai, Hiroshige, and Utamaro, based on the prompt "${prompt}".`;
            themePrompt = `The image must feature the characteristic aesthetics of Ukiyo-e: strong, flowing black outlines (key lines), flat areas of solid, muted color, and a sense of depth created by layering and perspective, not shading. Capture the 'pictures of the floating world' theme by depicting scenes from everyday life, beautiful geishas (bijin-ga), famous landscapes with Mount Fuji, or dramatic kabuki actors. The composition should be asymmetrical yet balanced. For example, a street in Edo with people walking during cherry blossom season, or a boat struggling in a great wave.`;
            break;
        case 'zombie':
            stylePrompt = `Create a wallpaper in a fun, cartoonish zombie style, heavily inspired by the vibrant and playful aesthetic of games like 'Plants vs. Zombies', based on the prompt "${prompt}".`;
            themePrompt = `The style must be bright, colorful, and family-friendly, not scary, gory, or realistic. Feature charming, goofy-looking zombies with exaggerated features and a clean, graphic look.`;
            break;
        case 'fallout':
            stylePrompt = `Create a wallpaper in the iconic art style of the mobile game 'Fallout Shelter', based on the prompt "${prompt}".`;
            themePrompt = `The scene should feature cartoonish characters with exaggerated features and cheerful expressions, reminiscent of the Vault Boy mascot. The aesthetic must be a blend of retro-futuristic 1950s Americana and a post-apocalyptic, underground vault setting. Use a clean, 2D vector art style with bold outlines and a limited, slightly desaturated color palette.`;
            break;
        case 'cinematic':
            stylePrompt = `Create a wallpaper with a cinematic, Hollywood movie aesthetic based on: "${prompt}".`;
            themePrompt = `The image must look like a frame from a high-end film, shot on 35mm film with a deep depth of field (similar to an f/11 aperture). Incorporate realistic ambient occlusion and atmospheric lighting, with moody, professionally color-graded colors. The scene should have a sense of motion blur consistent with a 24fps frame rate and a 180-degree shutter angle (1/48s shutter speed). The lighting must be balanced, preserving details in both shadows and highlights, avoiding clipping, like a flat or log picture profile.`;
            break;
        case 'long_exposure':
            stylePrompt = `Create a wallpaper using a long exposure photography aesthetic, based on the prompt "${prompt}".`;
            themePrompt = `The image should feature beautiful streaks of light created by the motion of objects. Capture the blur of moving elements like car light trails on a city street at night, the smooth, milky effect of flowing water in a river, or the paths of stars across the sky. Stationary objects should remain sharp and in focus, creating a strong contrast with the blurred motion.`;
            break;
        case 'toy_look':
            stylePrompt = `Create a wallpaper of "${prompt}" rendered as a brand-new, high-end action figure collectible.`;
            themePrompt = `The figure must be made of glossy plastic and sealed within a perfectly molded transparent plastic blister pack, attached to a branded cardboard backing card. The image should be captured with professional studio product photography, featuring bright, reflective lighting, sharp focus on the figure and packaging, and a clean, simple background.`;
            break;
             case 'metal':
                stylePrompt = `Create a wallpaper of "${prompt}" with objects made of polished or brushed metal.`;
                themePrompt = `The metal surfaces should have realistic reflections and be in various random vibrant colors. Use a dark background to make the colors pop.`;
                break;
        case 'anime_manga':
            stylePrompt = `Create a wallpaper of "${prompt}" in a soft, semi-realistic anime portrait style, emphasizing emotional realism and depth. The render should be a digital painting with smooth, blended brushwork, minimal and delicate line art, and very soft edges.`;
            themePrompt = `The composition should be a shoulder-up portrait with a shallow depth of field and a soft bokeh background, possibly a soft gradient sky. Facial proportions are an anime-realistic hybrid. Render skin with soft, diffused light. Eyes must be highly detailed with warm amber tones and subtle highlights. Hair should be highly detailed with a glowing rim light. The lighting is soft, warm daylight from the top-left, with low contrast. The color palette should be dominated by warm, soft tones like dusty rose, peach, and cream, with cool blue accents. Use cinematic color grading with warm midtones, a slight blue tint in shadows, and a peachy tint in highlights. The mood is melancholic serenity and dreamlike calm. Apply a soft glow filter and subtle film grain.`;
            break;
        }

    fullPrompt = [basePrompt, stylePrompt, themePrompt, closingPrompt].join(' ');
    
    try {
        const MAX_IMAGES_PER_REQUEST = 4;
        const requests = [];
        let remainingImages = imageCount;

        while (remainingImages > 0) {
            const countForThisRequest = Math.min(remainingImages, MAX_IMAGES_PER_REQUEST);
            const requestConfig = {
                model: 'imagen-4.0-generate-001',
                prompt: fullPrompt,
                config: {
                    numberOfImages: countForThisRequest,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '9:16',
                },
            };
            requests.push(ai.models.generateImages(requestConfig));
            remainingImages -= countForThisRequest;
        }
        
        const responses = await Promise.all(requests);
        const allImages = responses.flatMap(response => 
            response.generatedImages?.map(img => img.image.imageBytes) || []
        );

        if (allImages && allImages.length > 0) {
            return allImages;
        } else {
            throw new Error('No images were generated.');
        }
    } catch (error) {
        console.error("Error generating wallpaper with Gemini:", error);
        if (error instanceof Error) {
            if (error.message.includes('fetch')) {
                throw new Error("Network error. Please check your connection and try again.");
            }
            if (error.message.includes('400')) {
                 throw new Error("Invalid prompt. The model could not process your request.");
            }
            // A more robust way to check for moderation issues
            if (error.message.includes('moderation') || (error as any)?.response?.promptFeedback?.blockReason) {
                 throw new Error("Your prompt was flagged by our safety filters. Please try a different prompt.");
            }
            if (error.message.includes('API key not valid')) {
                throw new Error("Authentication error. The API key is not valid.");
            }
        }
        throw new Error("Failed to communicate with the AI. Please try again later.");
    }
};

export const startVideoGeneration = async (
    prompt: string, 
    style: string, 
    animation: string, 
    settings: { zoomAmount: number; panDirection: string; swirlDirection: string; tiltDirection: string; }
): Promise<Operation<GenerateVideosResponse>> => {
    let animationPrompt = '';

    switch(animation) {
        case 'camera_pan':
            animationPrompt = `A smooth, slow camera pan going ${settings.panDirection}.`;
            break;
        case 'zoom_in':
            animationPrompt = `A slow, steady ${settings.zoomAmount}% zoom-in on the main subject.`;
            break;
        case 'zoom_out':
            animationPrompt = `A slow, steady ${settings.zoomAmount}% zoom-out from the main subject.`;
            break;
        case 'tilt':
            animationPrompt = `A slow, smooth camera tilt moving ${settings.tiltDirection}.`;
            break;
        case 'gentle_swirl':
            animationPrompt = `A gentle, dreamlike ${settings.swirlDirection} swirling motion affecting the entire scene.`;
            break;
        case 'spin':
            animationPrompt = `A slow, steady camera rotation, spinning ${settings.swirlDirection}.`;
            break;
        case 'vertigo':
            animationPrompt = `A dramatic dolly zoom (vertigo effect), where the camera moves forward while the lens zooms out, keeping the subject the same size while the background appears to expand.`;
            break;
        case 'pulse':
            animationPrompt = `A gentle, rhythmic pulsing effect, slowly zooming in and out.`;
            break;
        case 'arc':
            animationPrompt = `A smooth camera arc moving to the ${settings.panDirection} around the subject.`;
            break;
        case 'drone':
            animationPrompt = `A drone shot, starting high and slowly zooming in by ${settings.zoomAmount}%.`;
            break;
        case 'handheld':
            animationPrompt = `A subtle, realistic handheld camera shake effect, as if filmed by a person.`;
            break;
        case 'boom':
            animationPrompt = `A camera boom shot, moving vertically ${settings.tiltDirection}.`;
            break;
    }

    const fullPrompt = `An animated, 4-second, seamlessly looping mobile wallpaper of "${prompt}". Style: ${style}. Animation: ${animationPrompt}. 8k, cinematic, high detail, dark theme.`;

    try {
        const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const operation = await videoAi.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: fullPrompt,
            config: {
                numberOfVideos: 1,
            },
        });
        return operation;
    } catch (error) {
        console.error("Error starting video generation:", error);
        if (error instanceof Error) {
            if (error.message.includes("was not found")) {
                throw new Error("API Key error. Please select a valid key with billing enabled for Veo.");
            }
            if (error.message.includes('moderation') || (error as any)?.response?.promptFeedback?.blockReason) {
                 throw new Error("Your prompt was flagged for safety reasons. Please try a different idea.");
            }
        }
        throw new Error("Failed to start video generation. Please try again.");
    }
};

export const checkVideoGenerationStatus = async (operation: Operation<GenerateVideosResponse>): Promise<Operation<GenerateVideosResponse>> => {
    try {
        const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const updatedOperation = await videoAi.operations.getVideosOperation({ operation: operation });
        return updatedOperation;
    } catch (error) {
        console.error("Error checking video generation status:", error);
         if (error instanceof Error && error.message.includes("was not found")) {
            throw new Error("API Key error. Please re-select your key.");
        }
        throw new Error("Failed to check video status. The connection may have been lost.");
    }
};

export const getVideoResult = async (operation: Operation<GenerateVideosResponse>): Promise<Blob> => {
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation succeeded but no download link was found.");
    }
    try {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
            const errorText = await response.text();
            if (errorText.includes("was not found")) {
                 throw new Error("API Key error. Please re-select your key as it may be invalid.");
            }
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        return videoBlob;
    } catch (error) {
        console.error("Error fetching video result:", error);
        if (error instanceof Error) {
            if (error.message.includes("API Key error")) { // Propagate specific errors
                throw error;
            }
            if (error.message.includes('fetch')) {
                 throw new Error("Network error while downloading video. Please try again.");
            }
        }
        throw new Error("Failed to download the generated video.");
    }
};


export const editWallpaper = async (base64Image: string, effects: { [key: string]: EffectSettings }): Promise<string> => {
    const editEffectsPrompt = buildEffectsPrompt(effects);
    if (Object.keys(effects).length === 0) {
        const match = base64Image.match(/^data:(image\/.+);base64,(.+)$/);
        return match ? match[2] : ''; // Return only base64 part
    }

    // More robust data URI parsing
    const match = base64Image.match(/^data:(image\/.+);base64,(.+)$/);
    if (!match) {
        console.error("Invalid base64 image data URI format for editing.", base64Image.substring(0, 100));
        throw new Error("Invalid image format for editing.");
    }
    const mimeType = match[1];
    const imageData = match[2];
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageData, mimeType: mimeType } },
                     // Simplified and more direct prompt
                    { text: `Apply the following visual effects to the image: ${editEffectsPrompt}. Only output the modified image.` },
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

        if (imagePart?.inlineData) {
            return imagePart.inlineData.data;
        } else {
            console.warn("Image editing did not return an image part. The model might have replied with text instead.", response.text);
            if (response.text?.toLowerCase().includes('safety')) {
                 throw new Error('The edit could not be completed due to safety filters.');
            }
            throw new Error('Image editing failed to produce an image.');
        }
    } catch (error) {
        console.error("Error editing wallpaper with Gemini:", error);
         if (error instanceof Error) {
            if (error.message.includes('safety')) {
                 throw new Error("The edit request was flagged for safety. Please try a different edit.");
            }
        }
        throw new Error("Failed to communicate with the AI model for editing.");
    }
};

export const startImageAnimation = async (
    base64ImageDataUri: string
): Promise<Operation<GenerateVideosResponse>> => {
    const match = base64ImageDataUri.match(/^data:(image\/.+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid image data URI for animation.");
    }
    const mimeType = match[1];
    const imageBytes = match[2];

    const prompt = "Subtly animate this image creating a seamless loop. If there are natural elements like clouds, water, leaves, fire, or hair, make them move gently. If characters are present, add subtle movements like blinking or breathing.";

    try {
        const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
        let operation = await videoAi.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: imageBytes,
                mimeType: mimeType,
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16'
            },
        });
        return operation;
    } catch (error) {
        console.error("Error starting image animation:", error);
        if (error instanceof Error) {
            if (error.message.includes("was not found")) {
                throw new Error("API Key error. Please select a valid key with billing enabled for Veo.");
            }
            if (error.message.includes('moderation') || (error as any)?.response?.promptFeedback?.blockReason) {
                 throw new Error("The animation request was flagged for safety reasons.");
            }
        }
        throw new Error("Failed to start image animation.");
    }
};