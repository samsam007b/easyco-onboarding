//
//  Config.swift
//  IzzIco
//
//  Created by Claude on 09/12/2024.
//

import Foundation

enum Config {
    // MARK: - Supabase Configuration
    static let supabaseURL = "https://fgthoyilfupywmpmiuwd.supabase.co"
    static let supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGhveWlsZnVweXdtcG1pdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTE4OTAsImV4cCI6MjA3NTY2Nzg5MH0._X7ouZG-SqvQ-iU1zWTvFRJ1WRwbothNjMDUk5LkJMA"

    // MARK: - Environment
    #if DEBUG
    static let environment = "development"
    #else
    static let environment = "production"
    #endif
}
