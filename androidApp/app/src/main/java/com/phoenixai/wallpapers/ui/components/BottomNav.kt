package com.phoenixai.wallpapers.ui.components

import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.phoenixai.wallpapers.ui.navigation.AIFusionDestination

@Composable
fun BottomNav(navController: NavHostController, destinations: List<BottomNavItem>) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    NavigationBar {
        destinations.forEach { destination ->
            val selected = currentDestination?.hierarchy?.any { it.route == destination.route } == true
            NavigationBarItem(
                selected = selected,
                onClick = {
                    if (!selected) {
                        navController.navigate(destination.route) {
                            popUpTo(navController.graph.startDestinationId) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                icon = {
                    destination.icon?.let { icon ->
                        Icon(imageVector = icon, contentDescription = destination.label)
                    }
                },
                label = { Text(destination.label) }
            )
        }
    }
}

data class BottomNavItem(
    val route: String,
    val label: String,
    val icon: ImageVector?
)

val bottomDestinations = listOf(
    BottomNavItem(AIFusionDestination.Home.route, "Home", null),
    BottomNavItem(AIFusionDestination.Collections.route, "Collections", null),
    BottomNavItem(AIFusionDestination.Shop.route, "Shop", null),
    BottomNavItem(AIFusionDestination.Profile.route, "Profile", null)
)
