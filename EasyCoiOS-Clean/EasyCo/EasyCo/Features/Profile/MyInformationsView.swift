//
//  MyInformationsView.swift
//  EasyCo
//
//  User personal information management
//

import SwiftUI

struct MyInformationsView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var dateOfBirth = Date()
    @State private var address = ""
    @State private var city = ""
    @State private var postalCode = ""
    @State private var showSaveAlert = false
    @State private var isEditing = false

    var body: some View {
        ScrollView {
            VStack(spacing: Theme.Spacing.lg) {
                // Profile Picture Section
                VStack(spacing: Theme.Spacing.md) {
                    if let profileImageURL = authManager.currentUser?.profileImageURL,
                       let url = URL(string: profileImageURL) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Circle()
                                .fill(Theme.Colors.primary.opacity(0.2))
                                .overlay {
                                    Text(initials)
                                        .font(Theme.Typography.title1(.bold))
                                        .foregroundColor(Theme.Colors.primary)
                                }
                        }
                        .frame(width: 100, height: 100)
                        .clipShape(Circle())
                    } else {
                        Circle()
                            .fill(Theme.Colors.primary.opacity(0.2))
                            .frame(width: 100, height: 100)
                            .overlay {
                                Text(initials)
                                    .font(Theme.Typography.title1(.bold))
                                    .foregroundColor(Theme.Colors.primary)
                            }
                    }

                    Button {
                        // TODO: Image picker
                    } label: {
                        Text("Changer la photo")
                            .font(Theme.Typography.caption(.semibold))
                            .foregroundColor(Theme.Colors.primary)
                    }
                }
                .padding(.top, Theme.Spacing.lg)

                // Information Sections
                VStack(spacing: Theme.Spacing.md) {
                    // Personal Info Section
                    SectionCard(title: "Informations personnelles") {
                        VStack(spacing: Theme.Spacing.sm) {
                            InfoField(label: "Prénom", text: $firstName, isEditing: isEditing)
                            InfoField(label: "Nom", text: $lastName, isEditing: isEditing)
                            DateField(label: "Date de naissance", date: $dateOfBirth, isEditing: isEditing)
                        }
                    }

                    // Contact Section
                    SectionCard(title: "Contact") {
                        VStack(spacing: Theme.Spacing.sm) {
                            InfoField(label: "Email", text: $email, isEditing: false) // Email non modifiable
                            InfoField(label: "Téléphone", text: $phone, isEditing: isEditing, keyboardType: .phonePad)
                        }
                    }

                    // Address Section
                    SectionCard(title: "Adresse") {
                        VStack(spacing: Theme.Spacing.sm) {
                            InfoField(label: "Adresse", text: $address, isEditing: isEditing)
                            InfoField(label: "Ville", text: $city, isEditing: isEditing)
                            InfoField(label: "Code postal", text: $postalCode, isEditing: isEditing, keyboardType: .numberPad)
                        }
                    }
                }
                .padding(.horizontal)

                // Action Buttons
                if isEditing {
                    HStack(spacing: Theme.Spacing.md) {
                        Button {
                            loadUserData()
                            isEditing = false
                        } label: {
                            Text("Annuler")
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(Theme.Colors.textSecondary)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Theme.Colors.backgroundSecondary)
                                .cornerRadius(Theme.CornerRadius.md)
                        }

                        Button {
                            saveChanges()
                        } label: {
                            Text("Enregistrer")
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Theme.Colors.primary)
                                .cornerRadius(Theme.CornerRadius.md)
                        }
                    }
                    .padding(.horizontal)
                } else {
                    Button {
                        isEditing = true
                    } label: {
                        Text("Modifier")
                            .font(Theme.Typography.body(.semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Theme.Colors.primary)
                            .cornerRadius(Theme.CornerRadius.md)
                    }
                    .padding(.horizontal)
                }
            }
            .padding(.bottom, Theme.Spacing.xl)
        }
        .navigationTitle("Mes informations")
        .navigationBarTitleDisplayMode(.large)
        .onAppear {
            loadUserData()
        }
        .alert("Modifications enregistrées", isPresented: $showSaveAlert) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Vos informations ont été mises à jour avec succès")
        }
    }

    private var initials: String {
        guard let user = authManager.currentUser else { return "?" }

        if let first = user.firstName, let last = user.lastName {
            return "\(first.prefix(1))\(last.prefix(1))".uppercased()
        } else if let first = user.firstName {
            return String(first.prefix(1)).uppercased()
        } else if let last = user.lastName {
            return String(last.prefix(1)).uppercased()
        } else {
            return String(user.email.prefix(1)).uppercased()
        }
    }

    private func loadUserData() {
        guard let user = authManager.currentUser else { return }

        firstName = user.firstName ?? ""
        lastName = user.lastName ?? ""
        email = user.email
        phone = "" // TODO: Add phone to User model
        // dateOfBirth, address, city, postalCode would come from user model
    }

    private func saveChanges() {
        // TODO: Save to backend
        isEditing = false
        showSaveAlert = true
    }
}

// MARK: - Section Card

struct SectionCard<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.md) {
            Text(title)
                .font(Theme.Typography.title3(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: Theme.Spacing.md) {
                content
            }
            .padding()
            .background(Theme.Colors.backgroundSecondary)
            .cornerRadius(Theme.CornerRadius.md)
        }
    }
}

// MARK: - Info Field

struct InfoField: View {
    let label: String
    @Binding var text: String
    let isEditing: Bool
    var keyboardType: UIKeyboardType = .default

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(Theme.Typography.caption())
                .foregroundColor(Theme.Colors.textSecondary)

            if isEditing {
                TextField("", text: $text)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textPrimary)
                    .keyboardType(keyboardType)
                    .padding(.vertical, 8)
                    .padding(.horizontal, 12)
                    .background(Color.white)
                    .cornerRadius(8)
            } else {
                Text(text.isEmpty ? "Non renseigné" : text)
                    .font(Theme.Typography.body())
                    .foregroundColor(text.isEmpty ? Theme.Colors.textTertiary : Theme.Colors.textPrimary)
                    .padding(.vertical, 8)
            }
        }
    }
}

// MARK: - Date Field

struct DateField: View {
    let label: String
    @Binding var date: Date
    let isEditing: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(Theme.Typography.caption())
                .foregroundColor(Theme.Colors.textSecondary)

            if isEditing {
                DatePicker("", selection: $date, displayedComponents: .date)
                    .datePickerStyle(.compact)
                    .labelsHidden()
            } else {
                Text(date.formatted(date: .long, time: .omitted))
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textPrimary)
                    .padding(.vertical, 8)
            }
        }
    }
}

// MARK: - Preview

struct MyInformationsView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            MyInformationsView()
                .environmentObject(AuthManager.shared)
        }
    }
}
