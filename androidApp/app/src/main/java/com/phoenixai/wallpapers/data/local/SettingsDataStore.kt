package com.phoenixai.wallpapers.data.local

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore by preferencesDataStore(name = "ai_fusion_settings")

@Singleton
class SettingsDataStore @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val soundEnabledKey = booleanPreferencesKey("sound_enabled")
    private val backgroundHueKey = floatPreferencesKey("background_hue")

    val isSoundEnabled: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[soundEnabledKey] ?: true
    }

    val backgroundHue: Flow<Float> = context.dataStore.data.map { preferences ->
        preferences[backgroundHueKey] ?: 180f
    }

    suspend fun setSoundEnabled(enabled: Boolean) {
        context.dataStore.edit { prefs ->
            prefs[soundEnabledKey] = enabled
        }
    }

    suspend fun setBackgroundHue(hue: Float) {
        context.dataStore.edit { prefs ->
            prefs[backgroundHueKey] = hue
        }
    }
}
