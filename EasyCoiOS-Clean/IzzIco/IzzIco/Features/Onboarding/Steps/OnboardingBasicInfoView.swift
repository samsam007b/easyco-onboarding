import SwiftUI

// MARK: - Basic Info Step (Web App Design)

struct OnboardingBasicInfoView: View {
    @Binding var data: OnboardingData
    @State private var showDatePicker = false

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            // Header (matching web app)
            VStack(alignment: .leading, spacing: 8) {
                Text("Informations de base")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "FFA040"))

                Text("Commençons par les informations essentielles")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            // Form fields
            VStack(spacing: 20) {
                // First Name
                WebAppFormField(title: "Prénom", isRequired: true) {
                    TextField("Votre prénom", text: $data.firstName)
                        .textContentType(.givenName)
                        .autocapitalization(.words)
                }

                // Last Name
                WebAppFormField(title: "Nom", isRequired: true) {
                    TextField("Votre nom", text: $data.lastName)
                        .textContentType(.familyName)
                        .autocapitalization(.words)
                }

                // Date of Birth
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 4) {
                        Text("Date de naissance")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "374151"))

                        Text("*")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "EF4444"))
                    }

                    Button(action: { showDatePicker = true }) {
                        HStack {
                            Text(formattedDate(data.dateOfBirth))
                                .font(.system(size: 15))
                                .foregroundColor(Color(hex: "111827"))

                            Spacer()

                            Image(systemName: "calendar")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "9CA3AF"))
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 14)
                        .background(Color.white)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "D1D5DB"), lineWidth: 1)
                        )
                        .cornerRadius(12)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
                .sheet(isPresented: $showDatePicker) {
                    VStack(spacing: 0) {
                        // Header
                        HStack {
                            Button("Annuler") {
                                showDatePicker = false
                            }
                            .foregroundColor(Color(hex: "6B7280"))

                            Spacer()

                            Text("Date de naissance")
                                .font(.system(size: 17, weight: .semibold))
                                .foregroundColor(Color(hex: "111827"))

                            Spacer()

                            Button("OK") {
                                showDatePicker = false
                            }
                            .foregroundColor(Color(hex: "FFA040"))
                            .fontWeight(.semibold)
                        }
                        .padding(.horizontal, 20)
                        .padding(.vertical, 16)
                        .background(Color(hex: "F9FAFB"))

                        Divider()

                        // Date Picker
                        DatePicker(
                            "",
                            selection: $data.dateOfBirth,
                            in: ...Date(),
                            displayedComponents: .date
                        )
                        .datePickerStyle(.wheel)
                        .labelsHidden()
                        .padding(.vertical, 20)
                    }
                    .presentationDetents([.height(400)])
                    .presentationDragIndicator(.visible)
                }

                // Nationality
                WebAppFormField(title: "Nationalité", isRequired: true) {
                    TextField("Votre nationalité", text: $data.nationality)
                        .autocapitalization(.words)
                }

                // Phone Number
                WebAppFormField(title: "Numéro de téléphone", isRequired: true) {
                    TextField("+32 XXX XX XX XX", text: $data.phoneNumber)
                        .textContentType(.telephoneNumber)
                        .keyboardType(.phonePad)
                }
            }

            Spacer()
        }
        .padding(.horizontal, 0)
    }

    private func formattedDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM yyyy"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date)
    }
}

// MARK: - Web App Form Field Component

struct WebAppFormField<Content: View>: View {
    let title: String
    let isRequired: Bool
    @ViewBuilder let content: Content
    @State private var isFocused: Bool = false

    init(title: String, isRequired: Bool = false, @ViewBuilder content: () -> Content) {
        self.title = title
        self.isRequired = isRequired
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Label
            HStack(spacing: 4) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                if isRequired {
                    Text("*")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "EF4444"))
                }
            }

            // Input container
            content
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "111827"))
                .padding(.horizontal, 16)
                .padding(.vertical, 14)
                .background(Color.white)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color(hex: "D1D5DB"), lineWidth: 1)
                )
                .cornerRadius(12)
        }
    }
}
