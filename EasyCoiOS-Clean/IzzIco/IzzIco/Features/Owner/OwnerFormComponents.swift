//
//  OwnerFormComponents.swift
//  IzzIco
//
//  Composants de formulaire réutilisables pour le rôle Owner
//

import SwiftUI

// MARK: - Owner Form Field

struct OwnerFormField<Content: View>: View {
    let label: String
    let required: Bool
    let content: Content

    init(label: String, required: Bool, @ViewBuilder content: () -> Content) {
        self.label = label
        self.required = required
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 4) {
                Text(label)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))
                if required {
                    Text("*")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "EF4444"))
                }
            }
            content
        }
    }
}

// MARK: - Owner Custom TextField Style

struct OwnerCustomTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(14)
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
            )
            .font(.system(size: 16))
            .foregroundColor(Color(hex: "111827"))
    }
}
