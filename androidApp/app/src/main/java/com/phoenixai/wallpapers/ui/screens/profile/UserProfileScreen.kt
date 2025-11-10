package com.phoenixai.wallpapers.ui.screens.profile

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.phoenixai.wallpapers.viewmodel.UserViewModel

@Composable
fun UserProfileScreen(userViewModel: UserViewModel = viewModel()) {
    val user by userViewModel.user.collectAsState()
    Surface(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text(text = user.username, style = androidx.compose.material3.MaterialTheme.typography.displayLarge)
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = "Subscription: ${'$'}{user.subscription}")
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = "Coins: ${'$'}{user.coins}")
        }
    }
}
