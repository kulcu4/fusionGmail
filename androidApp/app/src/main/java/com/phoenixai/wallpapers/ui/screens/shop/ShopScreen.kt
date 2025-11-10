package com.phoenixai.wallpapers.ui.screens.shop

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ShopScreen() {
    val tiers = listOf("Simple", "Premium", "Ultimate")
    Surface(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text(text = "Upgrade Your Experience", style = androidx.compose.material3.MaterialTheme.typography.displayLarge)
            tiers.forEach { tier ->
                Column(modifier = Modifier.padding(vertical = 12.dp)) {
                    Text(text = tier, style = androidx.compose.material3.MaterialTheme.typography.titleLarge)
                    Button(onClick = { /* TODO: purchase */ }) {
                        Text("Select ${'$'}tier")
                    }
                }
            }
        }
    }
}
