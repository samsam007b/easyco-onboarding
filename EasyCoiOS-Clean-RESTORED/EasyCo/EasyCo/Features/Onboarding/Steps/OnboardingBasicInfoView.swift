import SwiftUI

// MARK: - Basic Info Step (Web App Design)

struct OnboardingBasicInfoView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header (matching web app)
            VStack(alignment: .leading, spacing: 8) {
                Text("Informations de base")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "FFA040")) // Orange gradient color

                Text("Commençons par les informations essentielles")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666")) // text-gray-600
            }
            .padding(.bottom, 8)

            // Form fields (24px spacing between fields = space-y-6)
            VStack(spacing: 24) {
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
                WebAppFormField(title: "Date de naissance", isRequired: true) {
                    DatePicker("", selection: $data.dateOfBirth, displayedComponents: .date)
                        .labelsHidden()
                        .datePickerStyle(.compact)
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
        .padding(.horizontal, 0) // Container handles padding
    }
}

// MARK: - Web App Form Field Component

struct WebAppFormField<Content: View>: View {
    let title: String
    let isRequired: Bool
    @ViewBuilder let content: Content
    @FocusState private var isFocused: Bool

    init(title: String, isRequired: Bool = false, @ViewBuilder content: () -> Content) {
        self.title = title
        self.isRequired = isRequired
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Label (text-sm font-medium text-gray-700 mb-2)
            HStack(spacing: 4) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151")) // text-gray-700

                if isRequired {
                    Text("*")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "EF4444")) // text-red-500
                }
            }

            // Input container (px-4 py-3 rounded-xl border)
            content
                .font(.system(size: 15))
                .padding(.horizontal, 16) // px-4
                .padding(.vertical, 12)   // py-3
                .background(Color.white)
                .overlay(
                    RoundedRectangle(cornerRadius: 16) // rounded-xl
                        .stroke(
                            isFocused ? Color(hex: "FFA040") : Color(hex: "D1D5DB"), // focus:border-orange-500 or border-gray-300
                            lineWidth: isFocused ? 2 : 1
                        )
                )
                .cornerRadius(16)
                // Focus ring effect (focus:ring-2 focus:ring-orange-100)
                .shadow(color: isFocused ? Color(hex: "FFA040").opacity(0.1) : .clear, radius: 4, x: 0, y: 0)
                .focused($isFocused)
        }
    }
}

// Helper for FocusState
extension View {
    func focused(_ condition: FocusState<Bool>) -> some View {
        self
    }
}
