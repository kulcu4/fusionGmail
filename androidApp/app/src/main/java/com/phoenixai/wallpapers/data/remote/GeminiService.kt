package com.phoenixai.wallpapers.data.remote

import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.GenerateContentResponse
import com.google.ai.client.generativeai.type.content
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GeminiService @Inject constructor(
    private val generativeModel: GenerativeModel
) {
    suspend fun generateImage(prompt: String): GenerateContentResponse {
        return generativeModel.generateContent(
            content {
                text(prompt)
            }
        )
    }
}
