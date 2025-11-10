<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1BBGLFqyj0_Q2utTveslDCU3LYftdDqxz

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Android Implementation

An Android version of the AI Fusion experience lives under [`androidApp/`](androidApp/). It follows an MVVM architecture with Jetpack Compose, Hilt, Room, and the Google AI SDK for Gemini. Key folders:

- `app/src/main/java/com/phoenixai/wallpapers/data` – data models, repositories, local/remote data sources.
- `app/src/main/java/com/phoenixai/wallpapers/ui` – Compose screens, components, navigation, and theming.
- `app/src/main/java/com/phoenixai/wallpapers/viewmodel` – ViewModels that expose UI state via Kotlin Flows.
- `app/src/main/java/com/phoenixai/wallpapers/di` – Hilt modules wiring the dependency graph.

Open the module in Android Studio ("Open" ➜ select `androidApp/`) to sync Gradle and run the Compose-first Android app.
