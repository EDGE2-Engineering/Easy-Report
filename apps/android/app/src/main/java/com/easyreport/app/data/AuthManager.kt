package com.easyreport.app.data

import android.content.Context
import android.util.Log
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin
import com.amplifyframework.core.Amplify
import com.amplifyframework.core.AmplifyConfiguration

object AuthManager {
    fun initialize(context: Context) {
        try {
            Amplify.addPlugin(AWSCognitoAuthPlugin())
            Amplify.configure(context)
            Log.i("AuthManager", "Initialized Amplify")
        } catch (error: Exception) {
            Log.e("AuthManager", "Could not initialize Amplify", error)
        }
    }

    fun login(username: String, password: String, onSuccess: () -> Unit, onError: (String) -> Unit) {
        Amplify.Auth.signIn(username, password,
            { result ->
                if (result.isSignedIn) {
                    onSuccess()
                } else {
                    onError("Sign in not complete")
                }
            },
            { error -> onError(error.message ?: "Unknown error") }
        )
    }

    fun logout(onSuccess: () -> Unit) {
        Amplify.Auth.signOut { onSuccess() }
    }
}
