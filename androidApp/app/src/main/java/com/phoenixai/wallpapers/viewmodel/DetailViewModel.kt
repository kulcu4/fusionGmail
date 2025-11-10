package com.phoenixai.wallpapers.viewmodel

import androidx.lifecycle.ViewModel
import com.phoenixai.wallpapers.data.model.EffectOption
import com.phoenixai.wallpapers.data.model.TextOverlayState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class DetailViewModel : ViewModel() {
    private val _selectedEffects = MutableStateFlow<List<EffectOption>>(emptyList())
    val selectedEffects: StateFlow<List<EffectOption>> = _selectedEffects

    private val _textOverlayState = MutableStateFlow(
        TextOverlayState(
            enabled = false,
            text = "",
            fontFamily = com.phoenixai.wallpapers.data.model.FontFamilyOption.SANS_SERIF,
            fontSize = 48,
            color = "#FFFFFFFF",
            isItalic = false,
            fontWeight = com.phoenixai.wallpapers.data.model.FontWeight.NORMAL,
            rotation = 0f,
            position = com.phoenixai.wallpapers.data.model.OverlayPosition(50f, 50f)
        )
    )
    val textOverlayState: StateFlow<TextOverlayState> = _textOverlayState

    fun toggleEffect(effect: EffectOption) {
        val current = _selectedEffects.value
        _selectedEffects.value = if (current.any { it.id == effect.id }) {
            current.filterNot { it.id == effect.id }
        } else {
            current + effect
        }
    }

    fun updateTextOverlay(state: TextOverlayState) {
        _textOverlayState.value = state
    }
}
