package com.phoenixai.wallpapers.viewmodel

import androidx.lifecycle.ViewModel
import com.phoenixai.wallpapers.data.model.SubscriptionTier
import com.phoenixai.wallpapers.data.model.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class UserViewModel : ViewModel() {
    private val _user = MutableStateFlow(
        User(
            id = "user-1",
            username = "Phoenix",
            subscription = SubscriptionTier.PREMIUM,
            coins = 420,
            avatarUrl = null
        )
    )
    val user: StateFlow<User> = _user
}
