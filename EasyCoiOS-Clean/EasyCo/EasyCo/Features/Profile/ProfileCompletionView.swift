//
//  ProfileCompletionView.swift
//  EasyCo
//
//  Created by Claude on 11/18/2025.
//

import SwiftUI

// MARK: - Profile Completion View

struct ProfileCompletionView: View {
    @StateObject private var viewModel = ProfileCompletionViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header with progress
                    headerSection

                    // Profile steps
                    profileStepsSection

                    // Benefits section
                    benefitsSection
                }
                .padding()
            }
            .navigationTitle("Complete Your Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .task {
                await viewModel.loadProfile()
            }
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        VStack(spacing: 16) {
            // Progress Circle
            ZStack {
                Circle()
                    .stroke(Color(.systemGray5), lineWidth: 12)
                    .frame(width: 120, height: 120)

                Circle()
                    .trim(from: 0, to: CGFloat(viewModel.completionPercentage) / 100)
                    .stroke(
                        LinearGradient(
                            colors: [Theme.Colors.primary, Theme.Colors.secondary],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        style: StrokeStyle(lineWidth: 12, lineCap: .round)
                    )
                    .frame(width: 120, height: 120)
                    .rotationEffect(.degrees(-90))
                    .animation(.spring(), value: viewModel.completionPercentage)

                VStack(spacing: 4) {
                    Text("\(viewModel.completionPercentage)%")
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(Theme.Colors.primary)

                    Text("Complete")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }

            // Status message
            VStack(spacing: 8) {
                Text(viewModel.statusMessage)
                    .font(.headline)
                    .multilineTextAlignment(.center)

                Text(viewModel.statusDescription)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
        }
        .padding(.vertical)
    }

    // MARK: - Profile Steps Section

    private var profileStepsSection: some View {
        VStack(spacing: 12) {
            ForEach(viewModel.profileSteps) { step in
                ProfileStepCard(step: step) {
                    viewModel.selectedStep = step
                    viewModel.showingStepView = true
                }
            }
        }
        .sheet(isPresented: $viewModel.showingStepView) {
            if let step = viewModel.selectedStep {
                profileStepView(for: step)
            }
        }
    }

    // MARK: - Benefits Section

    private var benefitsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Why complete your profile?")
                .font(.headline)

            VStack(spacing: 12) {
                CompletionBenefitRow(
                    icon: "sparkles",
                    title: "Better Matches",
                    description: "Find roommates who truly match your lifestyle"
                )

                CompletionBenefitRow(
                    icon: "eye",
                    title: "Increased Visibility",
                    description: "Complete profiles get 3x more views"
                )

                CompletionBenefitRow(
                    icon: "checkmark.seal.fill",
                    title: "Build Trust",
                    description: "Show you're serious about finding the right home"
                )

                CompletionBenefitRow(
                    icon: "bell.fill",
                    title: "Smart Alerts",
                    description: "Get notified about perfect matches instantly"
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    // MARK: - Step Views

    @ViewBuilder
    private func profileStepView(for step: ProfileStep) -> some View {
        switch step.type {
        case .livingSituation:
            EnhancedLivingSituationView(profile: $viewModel.profile)
        case .lifestyle:
            EnhancedLifestyleView(profile: $viewModel.profile)
        case .dailyHabits:
            EnhancedDailyHabitsView(profile: $viewModel.profile)
        case .homeLifestyle:
            EnhancedHomeLifestyleView(profile: $viewModel.profile)
        case .socialVibe:
            EnhancedSocialVibeView(profile: $viewModel.profile)
        case .personality:
            EnhancedPersonalityView(profile: $viewModel.profile)
        case .idealColiving:
            EnhancedIdealColivingView(profile: $viewModel.profile)
        case .verification:
            EnhancedVerificationView(profile: $viewModel.profile)
        }
    }
}

// MARK: - Profile Step Card

struct ProfileStepCard: View {
    let step: ProfileStep
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                // Icon
                ZStack {
                    Circle()
                        .fill(step.isCompleted ? Theme.Colors.primary : Color(.systemGray5))
                        .frame(width: 44, height: 44)

                    Image(systemName: step.isCompleted ? "checkmark" : step.icon)
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(step.isCompleted ? .white : .secondary)
                }

                // Content
                VStack(alignment: .leading, spacing: 4) {
                    Text(step.title)
                        .font(.headline)
                        .foregroundColor(.primary)

                    Text(step.description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }

                Spacer()

                // Chevron
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color(.systemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(
                        step.isCompleted ? Theme.Colors.primary.opacity(0.3) : Color(.systemGray5),
                        lineWidth: 1
                    )
            )
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Benefit Row

private struct CompletionBenefitRow: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(Theme.Colors.primary)
                .frame(width: 32)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.semibold)

                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()
        }
    }
}

// MARK: - Profile Step Model

struct ProfileStep: Identifiable {
    let id = UUID()
    let type: StepType
    let title: String
    let description: String
    let icon: String
    let isCompleted: Bool

    enum StepType {
        case livingSituation
        case lifestyle
        case dailyHabits
        case homeLifestyle
        case socialVibe
        case personality
        case idealColiving
        case verification
    }
}

// MARK: - View Model

@MainActor
class ProfileCompletionViewModel: ObservableObject {
    @Published var profile: EnhancedProfile?
    @Published var completionPercentage: Int = 0
    @Published var profileSteps: [ProfileStep] = []
    @Published var showingStepView = false
    @Published var selectedStep: ProfileStep?
    @Published var isLoading = false

    var statusMessage: String {
        switch completionPercentage {
        case 0..<25:
            return "Just Getting Started"
        case 25..<50:
            return "Making Progress!"
        case 50..<75:
            return "Halfway There!"
        case 75..<100:
            return "Almost Done!"
        case 100:
            return "Profile Complete! 🎉"
        default:
            return "Keep Going!"
        }
    }

    var statusDescription: String {
        switch completionPercentage {
        case 0..<50:
            return "Complete your profile to get better matches and more visibility"
        case 50..<100:
            return "You're doing great! Just a few more steps to go"
        case 100:
            return "Your profile is complete and optimized for the best matches"
        default:
            return ""
        }
    }

    func loadProfile() async {
        isLoading = true

        // TODO: Replace with actual API call
        try? await Task.sleep(nanoseconds: 500_000_000)

        // Use mock data for now
        profile = EnhancedProfile.mockIncomplete
        completionPercentage = profile?.calculateCompletion() ?? 0

        // Generate steps based on profile
        if let profile = profile {
            profileSteps = generateSteps(from: profile)
        }

        isLoading = false
    }

    private func generateSteps(from profile: EnhancedProfile) -> [ProfileStep] {
        [
            ProfileStep(
                type: .livingSituation,
                title: "Living Situation",
                description: "Current situation and move-in timeline",
                icon: "house.fill",
                isCompleted: profile.currentLivingSituation != nil &&
                             profile.moveInTimeframe != nil &&
                             profile.budgetRange != nil
            ),
            ProfileStep(
                type: .lifestyle,
                title: "Lifestyle",
                description: "Work, pets, smoking, and diet",
                icon: "figure.walk",
                isCompleted: profile.occupationStatus != nil &&
                             profile.smokingHabits != nil
            ),
            ProfileStep(
                type: .dailyHabits,
                title: "Daily Habits",
                description: "Sleep, cleanliness, noise, and guests",
                icon: "moon.stars.fill",
                isCompleted: profile.sleepSchedule != nil &&
                             profile.cleanlinessLevel != nil &&
                             profile.noiseLevel != nil
            ),
            ProfileStep(
                type: .homeLifestyle,
                title: "Home Life",
                description: "Cooking, exercise, hobbies, and entertainment",
                icon: "fork.knife",
                isCompleted: profile.cookingFrequency != nil &&
                             !(profile.hobbies?.isEmpty ?? true)
            ),
            ProfileStep(
                type: .socialVibe,
                title: "Social Vibe",
                description: "Communication style and social preferences",
                icon: "person.3.fill",
                isCompleted: profile.socialLevel != nil &&
                             profile.communicationStyle != nil
            ),
            ProfileStep(
                type: .personality,
                title: "Personality",
                description: "Traits, values, and deal-breakers",
                icon: "heart.fill",
                isCompleted: !(profile.personalityTraits?.isEmpty ?? true) &&
                             !(profile.values?.isEmpty ?? true)
            ),
            ProfileStep(
                type: .idealColiving,
                title: "Ideal Home",
                description: "Perfect property and neighborhood",
                icon: "star.fill",
                isCompleted: profile.idealPropertyType != nil &&
                             !(profile.mustHaveAmenities?.isEmpty ?? true)
            ),
            ProfileStep(
                type: .verification,
                title: "Verification",
                description: "Verify your identity and documents",
                icon: "checkmark.seal.fill",
                isCompleted: profile.verificationStatus == .verified
            )
        ]
    }

    func saveProfile() async {
        guard let profile = profile else { return }

        // TODO: Implement API call to save profile
        print("📝 Saving profile: \(profile.id)")

        // Update completion percentage
        completionPercentage = profile.calculateCompletion()

        // Refresh steps
        profileSteps = generateSteps(from: profile)
    }
}

// MARK: - Preview

#Preview {
    ProfileCompletionView()
}
