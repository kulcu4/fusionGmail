package com.phoenixai.wallpapers.data.model

data class Option(
    val id: String,
    val label: String,
    val icon: String? = null,
    val previewImage: String? = null,
    val previewType: String? = null
)

data class AnimationOption(
    val option: Option,
    val isPremium: Boolean = false,
    val controls: List<String> = emptyList()
)

data class AnimationPreset(
    val id: String,
    val name: String,
    val description: String,
    val settings: AnimationSettings
)

data class AnimationSettings(
    val zoomAmount: Float,
    val panDirection: String,
    val swirlDirection: String,
    val tiltDirection: String
)

data class StyleCategory(
    val name: String,
    val styles: List<Option>
)

data class EffectOption(
    val id: String,
    val label: String,
    val icon: String? = null,
    val type: EffectType,
    val hasSlider: Boolean,
    val sliderLabel: String? = null,
    val hasDirectionControl: Boolean = false,
    val directionLabel: String? = null,
    val hasColorControl: Boolean = false,
    val hasSpreadControl: Boolean = false,
    val spreadLabel: String? = null,
    val hasSpeedControl: Boolean = false,
    val speedLabel: String? = null
)

enum class EffectType {
    GENERATIVE, CSS, CANVAS, JS, OVERLAY
}

data class User(
    val id: String,
    val username: String,
    val subscription: SubscriptionTier,
    val coins: Int,
    val avatarUrl: String? = null
)

enum class SubscriptionTier { NONE, SIMPLE, PREMIUM }

data class CustomPreset(
    val id: String,
    val name: String
)

enum class FontFamilyOption {
    SANS_SERIF,
    SERIF,
    MONOSPACE,
    IMPACT,
    COURIER_NEW,
    COMIC_SANS_MS,
    ARIAL,
    VERDANA,
    GEORGIA,
    ROBOTO,
    OPEN_SANS,
    LATO,
    MONTSERRAT,
    OSWALD,
    RALEWAY,
    PLAYFAIR_DISPLAY
}

data class CollectionItem(
    val id: String,
    val src: String,
    val name: String,
    val type: MediaType,
    val cost: Int,
    val isFree: Boolean,
    val category: String
)

enum class MediaType { IMAGE, VIDEO }

data class TextOverlayState(
    val enabled: Boolean,
    val text: String,
    val fontFamily: FontFamilyOption,
    val fontSize: Int,
    val color: String,
    val isItalic: Boolean,
    val fontWeight: FontWeight,
    val rotation: Float,
    val position: OverlayPosition
)

data class OverlayPosition(val x: Float, val y: Float)

enum class FontWeight { NORMAL, BOLD }

data class DynamicBackgroundOption(
    val id: String,
    val label: String,
    val icon: String
)

data class ColorSettings(
    val h: Float,
    val s: Float,
    val l: Float
)

data class ColorPreset(
    val id: String,
    val name: String,
    val settings: ColorSettings
)

data class MediaItem(
    val src: String,
    val type: MediaType,
    val styleId: String? = null
)

enum class GenerationProvider { GEMINI, RUNWARE }
