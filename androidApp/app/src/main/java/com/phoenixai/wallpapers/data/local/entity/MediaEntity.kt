package com.phoenixai.wallpapers.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "media_items")
data class MediaEntity(
    @PrimaryKey val id: String,
    val src: String,
    val type: String,
    val styleId: String?
)
