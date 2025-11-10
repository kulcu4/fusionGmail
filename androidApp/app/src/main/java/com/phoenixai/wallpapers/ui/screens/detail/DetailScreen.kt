package com.phoenixai.wallpapers.ui.screens.detail

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.phoenixai.wallpapers.data.model.EffectOption
import com.phoenixai.wallpapers.data.model.EffectType
import com.phoenixai.wallpapers.viewmodel.DetailViewModel

@Composable
fun DetailScreen(
    onBack: () -> Unit,
    viewModel: DetailViewModel = remember { DetailViewModel() }
) {
    Surface(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .padding(24.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = "Generated Artwork", style = androidx.compose.material3.MaterialTheme.typography.titleLarge)
            Spacer(modifier = Modifier.height(16.dp))
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(text = "Effects")
                EffectCarousel(
                    options = sampleEffects(),
                    onToggle = viewModel::toggleEffect
                )
            }
            Button(onClick = onBack) {
                Text("Back")
            }
        }
    }
}

@Composable
private fun EffectCarousel(
    options: List<EffectOption>,
    onToggle: (EffectOption) -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        options.forEach { option ->
            Row(horizontalArrangement = Arrangement.SpaceBetween) {
                Text(option.label)
                Button(onClick = { onToggle(option) }) {
                    Text("Toggle")
                }
            }
        }
    }
}

private fun sampleEffects(): List<EffectOption> = listOf(
    EffectOption(
        id = "glow",
        label = "Neon Glow",
        icon = null,
        type = EffectType.CSS,
        hasSlider = true,
        sliderLabel = "Intensity"
    ),
    EffectOption(
        id = "particles",
        label = "Particle Drift",
        icon = null,
        type = EffectType.CANVAS,
        hasSlider = true,
        sliderLabel = "Density"
    )
)
