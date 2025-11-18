//
//  MessageTemplatesView.swift
//  EasyCo
//
//  Templates selection view for Owner quick replies
//

import SwiftUI

struct MessageTemplatesView: View {
    @Environment(\.dismiss) var dismiss
    let onSelectTemplate: (MessageTemplate) -> Void

    @State private var selectedCategory: TemplateCategory?
    @State private var searchText = ""
    @State private var showingVariablesSheet = false
    @State private var selectedTemplate: MessageTemplate?
    @State private var variableValues: [String: String] = [:]

    private let templates = MessageTemplate.predefinedTemplates

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Search bar
                searchBar

                // Category filters
                categoryFilters

                // Templates list
                if filteredTemplates.isEmpty {
                    emptyState
                } else {
                    templatesList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Modèles de messages")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .cancellationAction) {
                    Button("Fermer") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }
            }
            .sheet(isPresented: $showingVariablesSheet) {
                if let template = selectedTemplate {
                    TemplateVariablesView(
                        template: template,
                        variableValues: $variableValues,
                        onConfirm: {
                            let filledTemplate = MessageTemplate(
                                id: template.id,
                                name: template.name,
                                content: template.fillVariables(variableValues),
                                category: template.category,
                                variables: []
                            )
                            onSelectTemplate(filledTemplate)
                            dismiss()
                        }
                    )
                }
            }
        }
    }

    // MARK: - Search Bar

    private var searchBar: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(Color(hex: "9CA3AF"))

            TextField("Rechercher un modèle...", text: $searchText)
                .font(.system(size: 16))

            if !searchText.isEmpty {
                Button(action: { searchText = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
            }
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
        )
        .padding(16)
    }

    // MARK: - Category Filters

    private var categoryFilters: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                // All categories button
                Button(action: { selectedCategory = nil }) {
                    HStack(spacing: 6) {
                        Image(systemName: "square.grid.2x2")
                            .font(.system(size: 14))
                        Text("Tous")
                            .font(.system(size: 14, weight: .medium))
                    }
                    .foregroundColor(selectedCategory == nil ? .white : Color(hex: "6B7280"))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(selectedCategory == nil ? Color(hex: "6E56CF") : Color(hex: "F3F4F6"))
                    .cornerRadius(20)
                }

                // Category buttons
                ForEach(TemplateCategory.allCases, id: \.self) { category in
                    Button(action: { selectedCategory = category }) {
                        HStack(spacing: 6) {
                            Image(systemName: category.icon)
                                .font(.system(size: 14))
                            Text(category.displayName)
                                .font(.system(size: 14, weight: .medium))
                        }
                        .foregroundColor(
                            selectedCategory == category
                                ? Color.white
                                : Color(hex: "6B7280")
                        )
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(
                            selectedCategory == category
                                ? Color(hex: category.color)
                                : Color(hex: "F3F4F6")
                        )
                        .cornerRadius(20)
                    }
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 12)
    }

    // MARK: - Templates List

    private var templatesList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(filteredTemplates) { template in
                    TemplateCard(
                        template: template,
                        onSelect: {
                            if template.variables.isEmpty {
                                onSelectTemplate(template)
                                dismiss()
                            } else {
                                selectedTemplate = template
                                variableValues = Dictionary(uniqueKeysWithValues: template.variables.map { ($0, "") })
                                showingVariablesSheet = true
                            }
                        }
                    )
                }
            }
            .padding(16)
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "F3F0FF"))
                    .frame(width: 100, height: 100)

                Image(systemName: "doc.text.magnifyingglass")
                    .font(.system(size: 40))
                    .foregroundColor(Color(hex: "6E56CF"))
            }

            VStack(spacing: 8) {
                Text("Aucun modèle trouvé")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Essayez avec d'autres mots-clés")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Filtered Templates

    private var filteredTemplates: [MessageTemplate] {
        var result = templates

        // Filter by category
        if let category = selectedCategory {
            result = result.filter { $0.category == category }
        }

        // Filter by search text
        if !searchText.isEmpty {
            result = result.filter { template in
                template.name.localizedCaseInsensitiveContains(searchText) ||
                template.content.localizedCaseInsensitiveContains(searchText)
            }
        }

        return result
    }
}

// MARK: - Template Card

struct TemplateCard: View {
    let template: MessageTemplate
    let onSelect: () -> Void

    var body: some View {
        Button(action: onSelect) {
            VStack(alignment: .leading, spacing: 12) {
                // Header
                HStack {
                    HStack(spacing: 8) {
                        Image(systemName: template.category.icon)
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: template.category.color))

                        Text(template.category.displayName)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(Color(hex: template.category.color))
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color(hex: template.category.color).opacity(0.1))
                    .cornerRadius(12)

                    Spacer()

                    if !template.variables.isEmpty {
                        HStack(spacing: 4) {
                            Image(systemName: "doc.text.fill")
                                .font(.system(size: 10))
                            Text("\(template.variables.count)")
                                .font(.system(size: 11, weight: .medium))
                        }
                        .foregroundColor(Color(hex: "6E56CF"))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: "F3F0FF"))
                        .cornerRadius(8)
                    }
                }

                // Template name
                Text(template.name)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
                    .frame(maxWidth: .infinity, alignment: .leading)

                // Template preview
                Text(template.content)
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
                    .lineLimit(3)
                    .frame(maxWidth: .infinity, alignment: .leading)

                // Action hint
                HStack {
                    Spacer()
                    Image(systemName: "arrow.right.circle.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "6E56CF"))
                }
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Template Variables View

struct TemplateVariablesView: View {
    let template: MessageTemplate
    @Binding var variableValues: [String: String]
    let onConfirm: () -> Void

    @Environment(\.dismiss) var dismiss
    @FocusState private var focusedField: String?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Template info
                    VStack(alignment: .leading, spacing: 12) {
                        HStack(spacing: 8) {
                            Image(systemName: template.category.icon)
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: template.category.color))

                            Text(template.name)
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundColor(Color(hex: "111827"))
                        }

                        Text("Complétez les informations ci-dessous")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(12)

                    // Variable fields
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Variables")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        ForEach(template.variables, id: \.self) { variable in
                            VStack(alignment: .leading, spacing: 8) {
                                Text(variableDisplayName(variable))
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(Color(hex: "374151"))

                                TextField("Entrez \(variableDisplayName(variable))", text: Binding(
                                    get: { variableValues[variable] ?? "" },
                                    set: { variableValues[variable] = $0 }
                                ))
                                .focused($focusedField, equals: variable)
                                .font(.system(size: 15))
                                .padding(12)
                                .background(Color(hex: "F9FAFB"))
                                .cornerRadius(8)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(
                                            focusedField == variable ? Color(hex: "6E56CF") : Color(hex: "E5E7EB"),
                                            lineWidth: 1
                                        )
                                )
                            }
                        }
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(12)

                    // Preview
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Aperçu")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        Text(template.fillVariables(variableValues))
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "374151"))
                            .padding(12)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color(hex: "F3F0FF"))
                            .cornerRadius(8)
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(12)

                    // Confirm button
                    Button(action: onConfirm) {
                        Text("Utiliser ce modèle")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(
                                LinearGradient(
                                    colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(12)
                    }
                    .disabled(!allVariablesFilled)
                    .opacity(allVariablesFilled ? 1 : 0.5)
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Compléter le modèle")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }
            }
        }
    }

    private var allVariablesFilled: Bool {
        template.variables.allSatisfy { variable in
            !(variableValues[variable]?.isEmpty ?? true)
        }
    }

    private func variableDisplayName(_ variable: String) -> String {
        switch variable {
        case "candidateName": return "Nom du candidat"
        case "tenantName": return "Nom du locataire"
        case "propertyTitle": return "Titre du logement"
        case "propertyAddress": return "Adresse"
        case "visitDate": return "Date de visite"
        case "visitTime": return "Heure de visite"
        case "signatureDate": return "Date de signature"
        case "depositAmount": return "Montant du dépôt"
        case "moveInDate": return "Date d'entrée"
        case "month": return "Mois"
        case "rentAmount": return "Montant du loyer"
        case "chargesAmount": return "Montant des charges"
        case "totalAmount": return "Montant total"
        case "dueDate": return "Date d'échéance"
        case "missingDocuments": return "Documents manquants"
        case "question": return "Question"
        default: return variable
        }
    }
}
