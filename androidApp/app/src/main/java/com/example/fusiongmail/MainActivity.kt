package com.example.fusiongmail

import android.Manifest
import android.app.DownloadManager
import android.content.Context
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.matchParentSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.weight
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Collections
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Wallpaper
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.AssistChip
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.IconToggleButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.example.fusiongmail.data.GalleryItem
import com.example.fusiongmail.data.GenerationProvider
import com.example.fusiongmail.data.Style
import com.example.fusiongmail.data.StyleCategory
import com.example.fusiongmail.data.galleryItems
import com.example.fusiongmail.data.promptSuggestions
import com.example.fusiongmail.data.styleCategories
import com.example.fusiongmail.ui.theme.FusionGmailTheme
import com.example.fusiongmail.ui.theme.SurfaceDark
import com.example.fusiongmail.wallpaper.WallpaperApplier
import com.example.fusiongmail.wallpaper.WallpaperResult
import com.example.fusiongmail.wallpaper.WallpaperTarget
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FusionGmailTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    FusionGmailApp()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun FusionGmailApp() {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }
    val wallpaperApplier = remember { WallpaperApplier(context) }

    var prompt by remember { mutableStateOf("") }
    var selectedStyle by remember { mutableStateOf<Style?>(styleCategories.firstOrNull()?.styles?.firstOrNull()) }
    var selectedCategory by remember { mutableStateOf(styleCategories.firstOrNull()) }
    var selectedTab by remember { mutableStateOf(0) }
    var selectedItem by remember { mutableStateOf<GalleryItem?>(null) }
    var favorites by remember { mutableStateOf(setOf<String>()) }
    var showWallpaperDialog by remember { mutableStateOf(false) }
    var wallpaperPendingItem by remember { mutableStateOf<GalleryItem?>(null) }
    var isApplyingWallpaper by remember { mutableStateOf(false) }
    var pendingDownloadItem by remember { mutableStateOf<GalleryItem?>(null) }

    val wallpaperPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            showWallpaperDialog = true
        } else {
            coroutineScope.launch {
                snackbarHostState.showSnackbar("Wallpaper permission is required to continue.")
            }
        }
    }

    val storagePermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        val item = pendingDownloadItem
        if (granted && item != null) {
            enqueueDownload(context, item)
            coroutineScope.launch {
                snackbarHostState.showSnackbar("Download started for ${item.title}.")
            }
        } else if (!granted) {
            coroutineScope.launch {
                snackbarHostState.showSnackbar("Storage permission is required to download images.")
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Fusion", style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.primary)
                        Text("Creative Studio", style = MaterialTheme.typography.bodyMedium)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent),
                actions = {
                    IconButton(onClick = { /* settings placeholder */ }) {
                        Icon(Icons.Default.Add, contentDescription = "New Project")
                    }
                }
            )
        },
        bottomBar = {
            BottomAppBar(containerColor = SurfaceDark, tonalElevation = 4.dp) {
                BottomBarItem(icon = Icons.Default.Dashboard, label = "Discover", selected = selectedTab == 0) { selectedTab = 0 }
                BottomBarItem(icon = Icons.Default.Collections, label = "Library", selected = selectedTab == 1) { selectedTab = 1 }
                BottomBarItem(icon = Icons.Default.CameraAlt, label = "Capture", selected = selectedTab == 2) { selectedTab = 2 }
            }
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp)
        ) {
            PromptSection(
                prompt = prompt,
                onPromptChange = { prompt = it },
                onSuggestionSelected = { prompt = it }
            )

            Spacer(modifier = Modifier.height(16.dp))
            CategoryTabs(
                categories = styleCategories,
                selected = selectedCategory,
                onSelected = {
                    selectedCategory = it
                    selectedStyle = it.styles.firstOrNull()
                }
            )
            Spacer(modifier = Modifier.height(12.dp))
            selectedCategory?.let { category ->
                StyleCarousel(
                    category = category,
                    selectedStyle = selectedStyle,
                    onStyleSelected = { selectedStyle = it }
                )
            }
            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Trending Creations",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(12.dp))
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(bottom = 140.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(galleryItems) { item ->
                    GalleryCard(
                        item = item,
                        accent = selectedStyle?.accent
                            ?: Brush.linearGradient(listOf(Color(0xFF00E5FF), Color(0xFF8A2BE2))),
                        onDoubleTap = { selectedItem = item }
                    )
                }
            }
        }

        selectedItem?.let { item ->
            GalleryDetailOverlay(
                item = item,
                isFavorite = favorites.contains(item.id),
                isApplyingWallpaper = isApplyingWallpaper,
                onDismiss = { selectedItem = null },
                onSetWallpaper = {
                    wallpaperPendingItem = item
                    val permissionStatus = ContextCompat.checkSelfPermission(
                        context,
                        Manifest.permission.SET_WALLPAPER
                    )
                    if (permissionStatus == PackageManager.PERMISSION_GRANTED) {
                        showWallpaperDialog = true
                    } else {
                        wallpaperPermissionLauncher.launch(Manifest.permission.SET_WALLPAPER)
                    }
                },
                onDownload = {
                    pendingDownloadItem = item
                    val requiresPermission = Build.VERSION.SDK_INT < Build.VERSION_CODES.Q
                    if (requiresPermission) {
                        val permissionStatus = ContextCompat.checkSelfPermission(
                            context,
                            Manifest.permission.WRITE_EXTERNAL_STORAGE
                        )
                        if (permissionStatus == PackageManager.PERMISSION_GRANTED) {
                            enqueueDownload(context, item)
                            coroutineScope.launch {
                                snackbarHostState.showSnackbar("Download started for ${item.title}.")
                            }
                        } else {
                            storagePermissionLauncher.launch(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        }
                    } else {
                        enqueueDownload(context, item)
                        coroutineScope.launch {
                            snackbarHostState.showSnackbar("Download started for ${item.title}.")
                        }
                    }
                },
                onToggleFavorite = {
                    favorites = if (favorites.contains(item.id)) {
                        favorites - item.id
                    } else {
                        favorites + item.id
                    }
                }
            )
        }

        if (showWallpaperDialog) {
            val item = wallpaperPendingItem
            if (item == null) {
                showWallpaperDialog = false
            } else {
                WallpaperOptionDialog(
                    itemTitle = item.title,
                    isProcessing = isApplyingWallpaper,
                    onDismiss = {
                        if (!isApplyingWallpaper) {
                            showWallpaperDialog = false
                            wallpaperPendingItem = null
                        }
                    },
                    onOptionSelected = { target ->
                        coroutineScope.launch {
                            isApplyingWallpaper = true
                            when (val result = wallpaperApplier.applyFromUrl(item.imageUrl, target)) {
                                is WallpaperResult.Success -> {
                                    snackbarHostState.showSnackbar("Wallpaper applied to ${target.description}.")
                                }
                                is WallpaperResult.Error -> {
                                    snackbarHostState.showSnackbar(result.message)
                                }
                            }
                            isApplyingWallpaper = false
                            showWallpaperDialog = false
                            wallpaperPendingItem = null
                        }
                    }
                )
            }
        }
    }
}

@Composable
private fun PromptSection(prompt: String, onPromptChange: (String) -> Unit, onSuggestionSelected: (String) -> Unit) {
    Column(modifier = Modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = prompt,
            onValueChange = onPromptChange,
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            label = { Text("Describe your vision") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = false,
            supportingText = { Text("Try combining subjects, moods and colors") }
        )
        Spacer(modifier = Modifier.height(12.dp))
        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            items(promptSuggestions.size) { index ->
                val suggestion = promptSuggestions[index]
                AssistChip(
                    onClick = { onSuggestionSelected(suggestion.prompt) },
                    label = { Text(suggestion.prompt, maxLines = 1, overflow = TextOverflow.Ellipsis) },
                    leadingIcon = {
                        Icon(Icons.Default.PlayArrow, contentDescription = null, tint = MaterialTheme.colorScheme.onPrimary)
                    },
                    colors = androidx.compose.material3.AssistChipDefaults.assistChipColors(
                        containerColor = Color.Transparent,
                        labelColor = MaterialTheme.colorScheme.onBackground
                    ),
                    modifier = Modifier
                        .clip(MaterialTheme.shapes.large)
                        .background(suggestion.accent, MaterialTheme.shapes.large)
                        .padding(horizontal = 2.dp)
                )
            }
        }
    }
}

@Composable
private fun CategoryTabs(
    categories: List<StyleCategory>,
    selected: StyleCategory?,
    onSelected: (StyleCategory) -> Unit
) {
    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        items(categories.size) { index ->
            val category = categories[index]
            FilterChip(
                selected = category == selected,
                onClick = { onSelected(category) },
                label = { Text(category.name) }
            )
        }
    }
}

@Composable
private fun StyleCarousel(
    category: StyleCategory,
    selectedStyle: Style?,
    onStyleSelected: (Style) -> Unit
) {
    LazyRow(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
        items(category.styles.size) { index ->
            val style = category.styles[index]
            StyleCard(style = style, selected = style == selectedStyle, onClick = { onStyleSelected(style) })
        }
    }
}

@Composable
private fun StyleCard(style: Style, selected: Boolean, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .width(180.dp)
            .height(140.dp)
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = Color.Transparent),
        border = if (selected) BorderStroke(1.5.dp, MaterialTheme.colorScheme.primary) else null
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(style.accent, MaterialTheme.shapes.medium)
                .padding(16.dp)
        ) {
            Column(modifier = Modifier.align(Alignment.BottomStart)) {
                Text(style.name.uppercase(), style = MaterialTheme.typography.labelSmall)
                Spacer(Modifier.height(4.dp))
                Text(style.description, style = MaterialTheme.typography.bodyMedium, maxLines = 2, overflow = TextOverflow.Ellipsis)
                if (style.isPremium) {
                    Spacer(Modifier.height(4.dp))
                    Text("Premium", color = MaterialTheme.colorScheme.secondary, style = MaterialTheme.typography.labelSmall)
                }
            }
        }
    }
}

@Composable
private fun GalleryCard(item: GalleryItem, accent: Brush, onDoubleTap: (GalleryItem) -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(220.dp)
            .pointerInput(item.id) {
                detectTapGestures(onDoubleTap = { onDoubleTap(item) })
            },
        colors = CardDefaults.cardColors(containerColor = Color.Transparent),
        shape = MaterialTheme.shapes.large
    ) {
        Box {
            AsyncImage(
                model = ImageRequest.Builder(LocalContext.current)
                    .data(item.imageUrl)
                    .crossfade(true)
                    .build(),
                contentDescription = item.title,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .background(Brush.verticalGradient(listOf(Color.Transparent, Color(0xAA000000))))
            )
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(16.dp)
            ) {
                Text(item.title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(4.dp))
                Text(item.prompt, style = MaterialTheme.typography.bodyMedium, maxLines = 2, overflow = TextOverflow.Ellipsis)
                Spacer(Modifier.height(12.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .clip(MaterialTheme.shapes.small)
                            .background(accent)
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        val label = when (item.provider) {
                            GenerationProvider.IMAGE -> "Image"
                            GenerationProvider.VIDEO -> if (item.isVideo) "Video" else "Clip"
                            GenerationProvider.ANIMATION -> "Animation"
                        }
                        Text(label, style = MaterialTheme.typography.labelSmall)
                    }
                }
            }
        }
    }
}

@Composable
private fun GalleryDetailOverlay(
    item: GalleryItem,
    isFavorite: Boolean,
    isApplyingWallpaper: Boolean,
    onDismiss: () -> Unit,
    onSetWallpaper: () -> Unit,
    onDownload: () -> Unit,
    onToggleFavorite: () -> Unit
) {
    val scrollState = rememberScrollState()
    val context = LocalContext.current
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xCC000000))
            .padding(24.dp)
    ) {
        Surface(
            modifier = Modifier
                .align(Alignment.Center)
                .fillMaxWidth(),
            shape = MaterialTheme.shapes.extraLarge
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(scrollState)
            ) {
                Box {
                    AsyncImage(
                        model = ImageRequest.Builder(context)
                            .data(item.imageUrl)
                            .crossfade(true)
                            .build(),
                        contentDescription = item.title,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(320.dp),
                        contentScale = ContentScale.Crop
                    )
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(12.dp)
                            .background(Color(0x66000000), shape = MaterialTheme.shapes.small)
                    ) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                    }
                }
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(item.title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    Text(item.prompt, style = MaterialTheme.typography.bodyLarge)
                    Spacer(Modifier.height(24.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Button(
                            onClick = onSetWallpaper,
                            modifier = Modifier.weight(1f),
                            enabled = !isApplyingWallpaper
                        ) {
                            if (isApplyingWallpaper) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(18.dp),
                                    strokeWidth = 2.dp,
                                    color = MaterialTheme.colorScheme.onPrimary
                                )
                                Spacer(Modifier.width(8.dp))
                                Text("Applying...")
                            } else {
                                Icon(Icons.Default.Wallpaper, contentDescription = null)
                                Spacer(Modifier.width(8.dp))
                                Text("Set wallpaper")
                            }
                        }
                        OutlinedButton(
                            onClick = onDownload,
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.Download, contentDescription = null)
                            Spacer(Modifier.width(8.dp))
                            Text("Download")
                        }
                        IconToggleButton(
                            checked = isFavorite,
                            onCheckedChange = { onToggleFavorite() },
                            colors = IconButtonDefaults.iconToggleButtonColors(
                                checkedContainerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                            )
                        ) {
                            val icon = if (isFavorite) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder
                            val description = if (isFavorite) "Remove from favorites" else "Add to favorites"
                            Icon(icon, contentDescription = description)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun WallpaperOptionDialog(
    itemTitle: String,
    isProcessing: Boolean,
    onDismiss: () -> Unit,
    onOptionSelected: (WallpaperTarget) -> Unit
) {
    AlertDialog(
        onDismissRequest = {
            if (!isProcessing) {
                onDismiss()
            }
        },
        title = { Text("Set wallpaper") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("Where would you like to apply \"$itemTitle\"?")
                WallpaperTarget.values().forEach { target ->
                    FilledTonalButton(
                        onClick = { onOptionSelected(target) },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = !isProcessing
                    ) {
                        Text(target.description)
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss, enabled = !isProcessing) {
                Text("Cancel")
            }
        }
    )
}

@Composable
private fun BottomBarItem(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, selected: Boolean, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .weight(1f)
            .padding(vertical = 8.dp)
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Icon(icon, contentDescription = label, tint = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface)
        Text(label, style = MaterialTheme.typography.labelSmall, color = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface)
    }
}

private fun enqueueDownload(context: Context, item: GalleryItem) {
    try {
        val sanitizedName = item.title.replace("\\s+".toRegex(), "_")
        val request = DownloadManager.Request(Uri.parse(item.imageUrl))
            .setTitle(item.title)
            .setDescription("Saving inspiration to your library")
            .setMimeType("image/*")
            .setAllowedOverMetered(true)
            .setAllowedOverRoaming(true)
            .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            .setDestinationInExternalPublicDir(Environment.DIRECTORY_PICTURES, "FusionGmail/${sanitizedName}_${item.id}.jpg")

        val manager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
        manager.enqueue(request)
    } catch (throwable: Throwable) {
        Toast.makeText(context, throwable.localizedMessage ?: "Unable to start download", Toast.LENGTH_LONG).show()
    }
}
