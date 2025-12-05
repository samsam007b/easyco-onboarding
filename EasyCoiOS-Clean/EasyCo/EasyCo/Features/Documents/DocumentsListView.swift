//
//  DocumentsListView.swift
//  EasyCo
//
//  Documents list for residents
//

import SwiftUI

struct DocumentsListView: View {
    @State private var documents: [ResidentDocument] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                if documents.isEmpty {
                    emptyState
                } else {
                    ForEach(documents) { document in
                        ResidentDocumentCard(document: document)
                    }
                }
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
        .navigationTitle("Mes Documents")
        .navigationBarTitleDisplayMode(.large)
        .onAppear {
            loadDocuments()
        }
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "doc.text")
                .font(.system(size: 60))
                .foregroundColor(Theme.Colors.textTertiary)

            Text("Aucun document")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Vos documents apparaîtront ici")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 100)
    }

    private func loadDocuments() {
        // Load documents from API
        // For now, empty
    }
}

private struct ResidentDocumentCard: View {
    let document: ResidentDocument

    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: iconForType(document.type))
                .font(.system(size: 24))
                .foregroundColor(Theme.Colors.primary)
                .frame(width: 48, height: 48)
                .background(Theme.Colors.primary.opacity(0.1))
                .cornerRadius(12)

            VStack(alignment: .leading, spacing: 4) {
                Text(document.name)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(document.formattedDate)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Spacer()

            Button(action: {
                // Download document
            }) {
                Image(systemName: "arrow.down.circle.fill")
                    .font(.system(size: 24))
                    .foregroundColor(Theme.Colors.primary)
            }
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    private func iconForType(_ type: String) -> String {
        switch type.lowercased() {
        case "lease": return "doc.text.fill"
        case "receipt": return "doc.plaintext.fill"
        case "invoice": return "doc.richtext.fill"
        default: return "doc.fill"
        }
    }
}

// MARK: - Models

struct ResidentDocument: Identifiable {
    let id: String
    let name: String
    let type: String
    let date: Date
    let url: String

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
}
