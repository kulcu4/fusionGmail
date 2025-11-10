package com.phoenixai.wallpapers.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.phoenixai.wallpapers.data.model.MediaItem
import com.phoenixai.wallpapers.data.model.Option
import com.phoenixai.wallpapers.data.model.StyleCategory
import com.phoenixai.wallpapers.util.Resource
import com.phoenixai.wallpapers.viewmodel.HomeViewModel

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigateToDetail: () -> Unit
) {
    val prompt by viewModel.prompt.collectAsState()
    val imageCount by viewModel.imageCount.collectAsState()
    val mediaState by viewModel.media.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(color = Color.Transparent)
                .padding(24.dp),
            verticalArrangement = Arrangement.Top
        ) {
            Text(text = "Create Futuristic Wallpapers", style = MaterialTheme.typography.displayLarge)
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = prompt,
                onValueChange = viewModel::onPromptChange,
                label = { Text("Describe your vision") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(12.dp))
            Button(onClick = viewModel::generate) {
                when (mediaState) {
                    Resource.Loading -> CircularProgressIndicator()
                    is Resource.Error, is Resource.Success -> Text("Generate (${imageCount})")
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Button(onClick = viewModel::surpriseMe) {
                Text("Surprise Me")
            }
            Spacer(modifier = Modifier.height(16.dp))
            GenerationResults(mediaState = mediaState, onNavigateToDetail = onNavigateToDetail)
        }
    }
}

@Composable
private fun GenerationResults(
    mediaState: Resource<List<MediaItem>>,
    onNavigateToDetail: () -> Unit
) {
    when (mediaState) {
        Resource.Loading -> CircularProgressIndicator()
        is Resource.Error -> Text("Failed to generate: ${'$'}{mediaState.throwable.localizedMessage}")
        is Resource.Success -> {
            if (mediaState.data.isEmpty()) {
                Text("Results will appear here once generated.")
            } else {
                Button(onClick = onNavigateToDetail) {
                    Text("View Results (${mediaState.data.size})")
                }
            }
        }
    }
}

@Composable
fun StyleCarousel(categories: List<StyleCategory>) {
    LazyRow {
        categories.forEach { category ->
            items(category.styles) { style: Option ->
                Column(modifier = Modifier.padding(end = 16.dp)) {
                    Text(text = style.label)
                }
            }
        }
    }
}
