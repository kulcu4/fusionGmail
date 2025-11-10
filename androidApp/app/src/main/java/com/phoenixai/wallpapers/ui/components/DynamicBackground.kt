package com.phoenixai.wallpapers.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import kotlin.random.Random

@Composable
fun DynamicBackground(modifier: Modifier = Modifier) {
    val colors = listOf(
        Color(0xFF0F172A),
        Color(0xFF1E293B),
        Color(0xFF334155)
    )
    val transition = rememberInfiniteTransition(label = "background")
    val offset by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 6000, easing = LinearEasing)
        ),
        label = "offset"
    )

    Canvas(modifier = modifier.fillMaxSize()) {
        val width = size.width
        val height = size.height
        drawRect(
            brush = Brush.linearGradient(
                colors = colors,
                start = Offset.Zero,
                end = Offset(width * offset, height)
            )
        )
        repeat(25) {
            val x = Random.nextFloat() * width
            val y = Random.nextFloat() * height
            drawCircle(
                color = Color.White.copy(alpha = 0.05f),
                radius = Random.nextFloat() * 10f + 4f,
                center = Offset(x, y)
            )
        }
    }
}
