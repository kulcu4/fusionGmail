package com.phoenixai.wallpapers.ui.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Collections
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import com.phoenixai.wallpapers.ui.components.BottomNav
import com.phoenixai.wallpapers.ui.components.BottomNavItem
import com.phoenixai.wallpapers.ui.components.DynamicBackground
import com.phoenixai.wallpapers.ui.screens.collections.CollectionsScreen
import com.phoenixai.wallpapers.ui.screens.detail.DetailScreen
import com.phoenixai.wallpapers.ui.screens.home.HomeScreen
import com.phoenixai.wallpapers.ui.screens.profile.UserProfileScreen
import com.phoenixai.wallpapers.ui.screens.settings.SettingsScreen
import com.phoenixai.wallpapers.ui.screens.shop.ShopScreen
import com.phoenixai.wallpapers.viewmodel.HomeViewModel

sealed class AIFusionDestination(val route: String) {
    object Home : AIFusionDestination("home")
    object Detail : AIFusionDestination("detail")
    object Profile : AIFusionDestination("profile")
    object Collections : AIFusionDestination("collections")
    object Shop : AIFusionDestination("shop")
    object Settings : AIFusionDestination("settings")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AIFusionNavHost(navController: NavHostController) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val showBottomBar = currentRoute != AIFusionDestination.Detail.route

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                BottomNav(
                    navController = navController,
                    destinations = listOf(
                        BottomNavItem(AIFusionDestination.Home.route, "Home", Icons.Filled.Home),
                        BottomNavItem(AIFusionDestination.Collections.route, "Collections", Icons.Filled.Collections),
                        BottomNavItem(AIFusionDestination.Shop.route, "Shop", Icons.Filled.ShoppingCart),
                        BottomNavItem(AIFusionDestination.Profile.route, "Profile", Icons.Filled.Person)
                    )
                )
            }
        }
    ) { paddingValues ->
        Box(modifier = androidx.compose.ui.Modifier
            .fillMaxSize()
            .padding(paddingValues)) {
            DynamicBackground(modifier = androidx.compose.ui.Modifier.matchParentSize())
            NavHost(
                navController = navController,
                startDestination = AIFusionDestination.Home.route,
                modifier = androidx.compose.ui.Modifier.fillMaxSize()
            ) {
                composable(AIFusionDestination.Home.route) {
                    val homeViewModel = hiltViewModel<HomeViewModel>()
                    HomeScreen(
                        viewModel = homeViewModel,
                        onNavigateToDetail = { navController.navigate(AIFusionDestination.Detail.route) }
                    )
                }
                composable(AIFusionDestination.Detail.route) {
                    DetailScreen(onBack = { navController.popBackStack() })
                }
                composable(AIFusionDestination.Profile.route) {
                    UserProfileScreen()
                }
                composable(AIFusionDestination.Collections.route) {
                    CollectionsScreen()
                }
                composable(AIFusionDestination.Shop.route) {
                    ShopScreen()
                }
                composable(AIFusionDestination.Settings.route) {
                    SettingsScreen()
                }
            }
        }
    }
}
