package com.phoenixai.wallpapers.ui.screens.settings

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SettingsScreen() {
    val soundEnabled = remember { mutableStateOf(true) }
    Surface(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text(text = "Settings", style = androidx.compose.material3.MaterialTheme.typography.displayLarge)
            Switch(
                checked = soundEnabled.value,
                onCheckedChange = { soundEnabled.value = it }
            )
            Text(text = if (soundEnabled.value) "Sound Enabled" else "Sound Disabled")
        }
    }
}
