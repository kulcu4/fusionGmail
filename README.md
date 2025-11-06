# Fusion Gmail Android

Fusion Gmail Android is a fully native Jetpack Compose application that reimagines the original web experience as a Kotlin-based creative studio. The app showcases style-driven wallpaper prompts, curated inspiration, and gallery previews that highlight how prompts map to generated artwork.

## Features

- ✨ Compose-powered UI with Material 3 styling and custom gradients
- 🧠 Prompt entry with curated quick suggestions to inspire ideas
- 🎨 Dynamic style carousel organised by category with premium callouts
- 🖼️ Responsive gallery grid that works for image, video, and animation showcases
- 🌙 Immersive dark theme aligned with the brand palette

## Project structure

```
FusionGmail/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties
└── androidApp/
    └── app/
        ├── build.gradle.kts
        └── src/main/
            ├── AndroidManifest.xml
            ├── java/com/example/fusiongmail/
            │   ├── MainActivity.kt
            │   ├── data/Model.kt
            │   └── ui/theme/
            │       ├── Color.kt
            │       ├── Theme.kt
            │       └── Type.kt
            └── res/
                ├── drawable/
                ├── mipmap-anydpi-v26/
                └── values/
```

## Getting started

1. **Open in Android Studio**
   - From the welcome screen select *Open*, then choose the repository root.
2. **Sync Gradle**
   - Android Studio will automatically sync the included Gradle wrapper and download dependencies.
3. **Run the app**
   - Choose an Android device or emulator running API level 24+ and press **Run ▶️**.

## Notes

- Remote gallery imagery is powered by royalty-free Unsplash URLs.
- Google Fonts integration is handled lazily at runtime; if the Play Services fonts provider is unavailable, the system font will be used instead.
