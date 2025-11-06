package com.example.fusiongmail.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.googlefonts.GoogleFont
import androidx.compose.ui.text.googlefonts.Font

private val provider = GoogleFont.Provider(
    providerAuthority = "com.google.android.gms.fonts",
    providerPackage = "com.google.android.gms",
    certificates = com.example.fusiongmail.R.array.com_google_android_gms_fonts_certs
)

private val spaceGrotesk = GoogleFont("Space Grotesk")

val Typography = Typography(
    displayLarge = androidx.compose.ui.text.TextStyle(
        fontFamily = FontFamily(Font(googleFont = spaceGrotesk, fontProvider = provider)),
        fontWeight = FontWeight.SemiBold
    ),
    titleLarge = androidx.compose.ui.text.TextStyle(
        fontFamily = FontFamily(Font(googleFont = spaceGrotesk, fontProvider = provider)),
        fontWeight = FontWeight.Medium
    ),
    bodyMedium = androidx.compose.ui.text.TextStyle(
        fontFamily = FontFamily(Font(googleFont = spaceGrotesk, fontProvider = provider))
    ),
    labelSmall = androidx.compose.ui.text.TextStyle(
        fontFamily = FontFamily(Font(googleFont = spaceGrotesk, fontProvider = provider)),
        fontWeight = FontWeight.Medium
    )
)
