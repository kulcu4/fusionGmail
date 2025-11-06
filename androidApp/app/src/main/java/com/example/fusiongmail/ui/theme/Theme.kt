package com.example.fusiongmail.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val darkColorScheme = darkColorScheme(
    primary = PrimaryCyan,
    onPrimary = BackgroundDark,
    secondary = SecondaryMagenta,
    background = BackgroundDark,
    surface = SurfaceDark,
    onBackground = OnBackground,
    onSurface = OnBackground,
)

private val lightColorScheme = lightColorScheme(
    primary = PrimaryCyan,
    onPrimary = BackgroundDark,
    secondary = SecondaryMagenta,
    background = BackgroundDark,
    surface = SurfaceDark,
    onBackground = OnBackground,
    onSurface = OnBackground,
)

@Composable
fun FusionGmailTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) darkColorScheme else lightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            window.navigationBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
