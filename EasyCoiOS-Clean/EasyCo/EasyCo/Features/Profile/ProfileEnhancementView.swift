//
//  ProfileEnhancementView.swift
//  EasyCo
//
//  Profile enhancement/completion wrapper for different user roles
//

import SwiftUI

struct ProfileEnhancementView: View {
    let userRole: UserRole
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ProfileCompletionView()
            .navigationTitle(navigationTitle)
            .navigationBarTitleDisplayMode(.inline)
    }

    private var navigationTitle: String {
        switch userRole {
        case .searcher:
            return "Compléter mon profil"
        case .owner:
            return "Améliorer mon profil"
        case .resident:
            return "Mon profil"
        }
    }
}

// MARK: - Preview

struct ProfileEnhancementView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            ProfileEnhancementView(userRole: .searcher)
        }
    }
}
