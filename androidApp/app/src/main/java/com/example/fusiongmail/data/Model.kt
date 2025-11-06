package com.example.fusiongmail.data

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

enum class GenerationProvider {
    IMAGE,
    VIDEO,
    ANIMATION
}

data class Style(
    val id: String,
    val name: String,
    val description: String,
    val isPremium: Boolean = false,
    val accent: Brush
)

data class StyleCategory(
    val name: String,
    val styles: List<Style>
)

data class PromptSuggestion(
    val prompt: String,
    val accent: Brush
)

data class GalleryItem(
    val id: String,
    val title: String,
    val prompt: String,
    val imageUrl: String,
    val provider: GenerationProvider,
    val isVideo: Boolean = false
)

private fun gradient(vararg colors: Color): Brush = Brush.linearGradient(colors = colors.toList())

val styleCategories: List<StyleCategory> = listOf(
    StyleCategory(
        name = "Artistic",
        styles = listOf(
            Style("abstract_flow", "Abstract Flow", "Dreamy organic gradients and flowing light", accent = gradient(Color(0xFF39D2FF), Color(0xFF8F53FF))),
            Style("watercolor", "Watercolor", "Soft pigments with gentle bleeds", accent = gradient(Color(0xFF95F6FF), Color(0xFF4A97FF))),
            Style("comic", "Comic Book", "Halftones with bold inked outlines", accent = gradient(Color(0xFFFF7ED2), Color(0xFFFFB86C)))
        )
    ),
    StyleCategory(
        name = "Futuristic",
        styles = listOf(
            Style("cyberpunk", "Cyberpunk", "Neon soaked megacity vibes", accent = gradient(Color(0xFF00E5FF), Color(0xFF8A2BE2))),
            Style("synthwave", "Synthwave", "Retro sunset grids and chrome", accent = gradient(Color(0xFFFF8A00), Color(0xFFEA4C89))),
            Style("holographic", "Holographic", "Iridescent refractions and volumetric light", accent = gradient(Color(0xFFA7FFEB), Color(0xFF00BFA5)), isPremium = true)
        )
    ),
    StyleCategory(
        name = "Minimal",
        styles = listOf(
            Style("line_art", "Line Art", "Elegant contour drawing", accent = gradient(Color(0xFFFFFFFF), Color(0xFFE0E0E0))),
            Style("pastel", "Pastel", "Soft muted palettes", accent = gradient(Color(0xFFFFC1CC), Color(0xFFC7CEEA))),
            Style("monochrome", "Monochrome", "High contrast noir imagery", accent = gradient(Color(0xFF141414), Color(0xFF434343)))
        )
    )
)

val promptSuggestions = listOf(
    PromptSuggestion("Celestial jellyfish drifting across a neon skyline", gradient(Color(0xFF00C6FF), Color(0xFF0072FF))),
    PromptSuggestion("Retro rover exploring a candy-colored planet", gradient(Color(0xFFFF8A8A), Color(0xFFFFD3A5))),
    PromptSuggestion("Sunbeams pouring through a glasshouse rainforest", gradient(Color(0xFF76FFB9), Color(0xFF34D399)))
)

val galleryItems = listOf(
    GalleryItem(
        id = "1",
        title = "Chromatic Bloom",
        prompt = "Bioluminescent forest with crystalline blossoms",
        imageUrl = "https://images.unsplash.com/photo-1526318472351-c75fcf07081f?auto=format&fit=crop&w=800&q=80",
        provider = GenerationProvider.IMAGE
    ),
    GalleryItem(
        id = "2",
        title = "Voxel Alley",
        prompt = "Pixel city alleyway lit by holographic billboards",
        imageUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        provider = GenerationProvider.VIDEO,
        isVideo = true
    ),
    GalleryItem(
        id = "3",
        title = "Dreamwave",
        prompt = "Synthwave surfer riding aurora tides",
        imageUrl = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
        provider = GenerationProvider.ANIMATION
    ),
    GalleryItem(
        id = "4",
        title = "Nebula Bloom",
        prompt = "Macro shot of a nebula blooming like a flower",
        imageUrl = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80",
        provider = GenerationProvider.IMAGE
    )
)
