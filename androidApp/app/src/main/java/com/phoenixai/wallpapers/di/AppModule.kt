package com.phoenixai.wallpapers.di

import android.content.Context
import androidx.room.Room
import com.google.ai.client.generativeai.GenerativeModel
import com.phoenixai.wallpapers.data.local.AIFusionDatabase
import com.phoenixai.wallpapers.data.remote.GeminiService
import com.phoenixai.wallpapers.data.repository.GenerationRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideGenerativeModel(): GenerativeModel {
        return GenerativeModel(
            modelName = "gemini-1.5-pro",
            apiKey = System.getenv("GEMINI_API_KEY") ?: ""
        )
    }

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AIFusionDatabase {
        return Room.databaseBuilder(
            context,
            AIFusionDatabase::class.java,
            "ai_fusion.db"
        ).build()
    }

    @Provides
    fun provideMediaDao(database: AIFusionDatabase) = database.mediaDao()

    @Provides
    @Singleton
    fun provideGeminiService(model: GenerativeModel) = GeminiService(model)

    @Provides
    @Singleton
    fun provideGenerationRepository(service: GeminiService) = GenerationRepository(service)
}
