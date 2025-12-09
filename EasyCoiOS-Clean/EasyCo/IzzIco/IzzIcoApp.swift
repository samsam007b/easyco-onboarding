//
//  IzzIcoApp.swift
//  IzzIco
//
//  Created by Samuel Baudon on 11/11/2025.
//

import SwiftUI

@main
struct IzzIcoApp: App {
    @StateObject private var authManager = AuthManager.shared
    @StateObject private var languageManager = LanguageManager.shared

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(authManager)
                .environmentObject(languageManager)
        }
    }
}
