package com.phoenixai.wallpapers.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.phoenixai.wallpapers.data.model.MediaItem
import com.phoenixai.wallpapers.data.repository.GenerationRepository
import com.phoenixai.wallpapers.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: GenerationRepository
) : ViewModel() {

    private val _prompt = MutableStateFlow("")
    val prompt: StateFlow<String> = _prompt

    private val _imageCount = MutableStateFlow(1)
    val imageCount: StateFlow<Int> = _imageCount

    private val _media = MutableStateFlow<Resource<List<MediaItem>>>(Resource.Success(emptyList()))
    val media: StateFlow<Resource<List<MediaItem>>> = _media

    fun onPromptChange(value: String) {
        _prompt.value = value
    }

    fun onImageCountChange(count: Int) {
        _imageCount.value = count
    }

    fun generate() {
        viewModelScope.launch {
            repository.generateWallpaper(_prompt.value, _imageCount.value).collect { result ->
                _media.value = result
            }
        }
    }

    fun surpriseMe() {
        val surprises = listOf(
            "Neon cyberpunk skyline",
            "Celestial dragon over glass city",
            "Synthwave forest at dusk"
        )
        val selection = surprises.random()
        _prompt.value = selection
        generate()
    }
}
