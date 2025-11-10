package com.phoenixai.wallpapers.ui.screens.collections

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.phoenixai.wallpapers.data.model.CollectionItem
import com.phoenixai.wallpapers.data.model.MediaType

@Composable
fun CollectionsScreen() {
    val collections = sampleCollections()
    Surface(modifier = Modifier.fillMaxSize()) {
        LazyColumn(modifier = Modifier.padding(24.dp)) {
            collections.forEach { (title, items) ->
                item {
                    Column(modifier = Modifier.padding(bottom = 16.dp)) {
                        Text(text = title, style = androidx.compose.material3.MaterialTheme.typography.titleLarge)
                        LazyRow {
                            items(items) { item ->
                                Text(text = item.name, modifier = Modifier.padding(end = 12.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun sampleCollections(): Map<String, List<CollectionItem>> = mapOf(
    "Cyberpunk" to List(6) { index ->
        CollectionItem(
            id = "cyber-${'$'}index",
            src = "",
            name = "Neon City ${'$'}index",
            type = MediaType.IMAGE,
            cost = 0,
            isFree = true,
            category = "cyberpunk"
        )
    },
    "Galactic" to List(4) { index ->
        CollectionItem(
            id = "galactic-${'$'}index",
            src = "",
            name = "Galaxy ${'$'}index",
            type = MediaType.IMAGE,
            cost = 10,
            isFree = false,
            category = "space"
        )
    }
)
