package com.phoenixai.wallpapers.data.repository

import com.phoenixai.wallpapers.data.model.MediaItem
import com.phoenixai.wallpapers.data.model.MediaType
import com.phoenixai.wallpapers.data.remote.GeminiService
import com.phoenixai.wallpapers.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GenerationRepository @Inject constructor(
    private val geminiService: GeminiService
) {
    fun generateWallpaper(prompt: String, count: Int): Flow<Resource<List<MediaItem>>> = flow {
        emit(Resource.Loading)
        try {
            val response = geminiService.generateImage(prompt)
            val generatedItems = buildList {
                val baseCandidates = response.candidates ?: emptyList()
                baseCandidates.take(count).forEachIndexed { index, candidate ->
                    add(
                        MediaItem(
                            src = candidate.content?.parts?.firstOrNull()?.toString() ?: "generated-${'$'}index",
                            type = MediaType.IMAGE
                        )
                    )
                }
                if (isEmpty()) {
                    repeat(count) { index ->
                        add(
                            MediaItem(
                                src = "generated-${'$'}index",
                                type = MediaType.IMAGE
                            )
                        )
                    }
                }
            }
            emit(Resource.Success(generatedItems))
        } catch (t: Throwable) {
            emit(Resource.Error(t))
        }
    }
}
