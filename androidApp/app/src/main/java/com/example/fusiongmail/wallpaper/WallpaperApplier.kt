package com.example.fusiongmail.wallpaper

import android.app.WallpaperManager
import android.content.Context
import android.os.Build
import androidx.core.graphics.drawable.toBitmap
import coil.imageLoader
import coil.request.ErrorResult
import coil.request.ImageRequest
import coil.request.SuccessResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

enum class WallpaperTarget(val description: String) {
    HOME("Home screen"),
    LOCK("Lock screen"),
    BOTH("Home and lock screens")
}

sealed class WallpaperResult {
    object Success : WallpaperResult()
    data class Error(val message: String) : WallpaperResult()
}

class WallpaperApplier(private val context: Context) {

    private val wallpaperManager: WallpaperManager = WallpaperManager.getInstance(context)

    suspend fun applyFromUrl(imageUrl: String, target: WallpaperTarget): WallpaperResult = withContext(Dispatchers.IO) {
        return@withContext try {
            val request = ImageRequest.Builder(context)
                .data(imageUrl)
                .allowHardware(false)
                .build()

            when (val result = context.imageLoader.execute(request)) {
                is SuccessResult -> {
                    val bitmap = result.drawable.toBitmap()
                    applyBitmap(bitmap, target)
                    WallpaperResult.Success
                }

                is ErrorResult -> WallpaperResult.Error(result.throwable.localizedMessage ?: "Unable to load image")
                else -> WallpaperResult.Error("Unable to load image")
            }
        } catch (security: SecurityException) {
            WallpaperResult.Error(security.localizedMessage ?: "Wallpaper permission denied")
        } catch (throwable: Throwable) {
            WallpaperResult.Error(throwable.localizedMessage ?: "Failed to set wallpaper")
        }
    }

    private fun applyBitmap(bitmap: android.graphics.Bitmap, target: WallpaperTarget) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            val flag = when (target) {
                WallpaperTarget.HOME -> WallpaperManager.FLAG_SYSTEM
                WallpaperTarget.LOCK -> WallpaperManager.FLAG_LOCK
                WallpaperTarget.BOTH -> WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK
            }
            wallpaperManager.setBitmap(bitmap, null, true, flag)
        } else {
            wallpaperManager.setBitmap(bitmap)
        }
    }
}

