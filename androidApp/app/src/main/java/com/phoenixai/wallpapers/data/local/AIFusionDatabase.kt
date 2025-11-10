package com.phoenixai.wallpapers.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.phoenixai.wallpapers.data.local.dao.MediaDao
import com.phoenixai.wallpapers.data.local.entity.MediaEntity

@Database(
    entities = [MediaEntity::class],
    version = 1,
    exportSchema = true
)
abstract class AIFusionDatabase : RoomDatabase() {
    abstract fun mediaDao(): MediaDao
}
