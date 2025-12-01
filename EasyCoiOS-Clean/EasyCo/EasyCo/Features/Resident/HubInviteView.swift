import SwiftUI

// MARK: - Hub Invite View (Resident)

struct HubInviteView: View {
    @StateObject private var viewModel = HubInviteViewModel()
    @State private var showShareSheet = false
    @State private var inviteEmail = ""
    @State private var showEmailInvite = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header illustration
                    headerSection

                    // Invite link card
                    inviteLinkCard

                    // Quick invite methods
                    quickInviteMethods

                    // Email invite section
                    emailInviteSection

                    // Pending invites
                    if !viewModel.pendingInvites.isEmpty {
                        pendingInvitesSection
                    }

                    // Tips
                    tipsSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Inviter des colocataires")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
            .sheet(isPresented: $showShareSheet) {
                ShareSheet(items: [viewModel.inviteLink])
            }
        }
        .task {
            await viewModel.loadInviteData()
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "10B981").opacity(0.2), Color(hex: "34D399").opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)

                Image(systemName: "person.badge.plus")
                    .font(.system(size: 44))
                    .foregroundColor(Color(hex: "10B981"))
            }

            VStack(spacing: 8) {
                Text("Agrandissez votre coloc'!")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Invitez vos colocataires à rejoindre votre espace pour gérer ensemble les tâches, dépenses et événements")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 20)
    }

    // MARK: - Invite Link Card

    private var inviteLinkCard: some View {
        VStack(spacing: 16) {
            HStack {
                Image(systemName: "link")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "10B981"))

                Text("Lien d'invitation")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                // Expiry badge
                HStack(spacing: 4) {
                    Image(systemName: "clock")
                        .font(.system(size: 11))
                    Text("Expire dans 7j")
                        .font(.system(size: 11, weight: .medium))
                }
                .foregroundColor(Color(hex: "F59E0B"))
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color(hex: "F59E0B").opacity(0.1))
                .cornerRadius(999)
            }

            // Link display
            HStack {
                Text(viewModel.inviteLink)
                    .font(.system(size: 13, design: .monospaced))
                    .foregroundColor(Color(hex: "6B7280"))
                    .lineLimit(1)
                    .truncationMode(.middle)

                Spacer()

                Button(action: {
                    UIPasteboard.general.string = viewModel.inviteLink
                    viewModel.showCopiedFeedback = true
                }) {
                    HStack(spacing: 4) {
                        Image(systemName: viewModel.showCopiedFeedback ? "checkmark" : "doc.on.doc")
                            .font(.system(size: 14))
                        Text(viewModel.showCopiedFeedback ? "Copié!" : "Copier")
                            .font(.system(size: 14, weight: .medium))
                    }
                    .foregroundColor(Color(hex: "10B981"))
                }
            }
            .padding(14)
            .background(Color(hex: "F9FAFB"))
            .cornerRadius(10)

            // Share button
            Button(action: { showShareSheet = true }) {
                HStack(spacing: 8) {
                    Image(systemName: "square.and.arrow.up")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Partager le lien")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "10B981"), Color(hex: "34D399")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(12)
            }
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(20)
        .shadow(color: .black.opacity(0.06), radius: 10, x: 0, y: 4)
    }

    // MARK: - Quick Invite Methods

    private var quickInviteMethods: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Partager via")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            HStack(spacing: 16) {
                QuickShareButton(
                    icon: "message.fill",
                    title: "iMessage",
                    color: Color(hex: "34C759")
                ) {
                    // Open Messages with invite link
                    if let url = URL(string: "sms:&body=\(viewModel.inviteLink.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")") {
                        UIApplication.shared.open(url)
                    }
                }

                QuickShareButton(
                    icon: "paperplane.fill",
                    title: "WhatsApp",
                    color: Color(hex: "25D366")
                ) {
                    if let url = URL(string: "whatsapp://send?text=\(viewModel.inviteLink.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")") {
                        UIApplication.shared.open(url)
                    }
                }

                QuickShareButton(
                    icon: "envelope.fill",
                    title: "Email",
                    color: Color(hex: "6366F1")
                ) {
                    showEmailInvite = true
                }

                QuickShareButton(
                    icon: "ellipsis",
                    title: "Plus",
                    color: Color(hex: "6B7280")
                ) {
                    showShareSheet = true
                }
            }
        }
    }

    // MARK: - Email Invite Section

    private var emailInviteSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Inviter par email")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            HStack(spacing: 12) {
                TextField("Adresse email", text: $inviteEmail)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .padding(14)
                    .background(Color.white)
                    .cornerRadius(10)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                    )

                Button(action: {
                    viewModel.sendEmailInvite(to: inviteEmail)
                    inviteEmail = ""
                }) {
                    Image(systemName: "paperplane.fill")
                        .font(.system(size: 18))
                        .foregroundColor(.white)
                        .frame(width: 50, height: 50)
                        .background(
                            inviteEmail.contains("@") ? Color(hex: "10B981") : Color(hex: "D1D5DB")
                        )
                        .cornerRadius(10)
                }
                .disabled(!inviteEmail.contains("@"))
            }
        }
    }

    // MARK: - Pending Invites Section

    private var pendingInvitesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Invitations en attente")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Text("\(viewModel.pendingInvites.count)")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color(hex: "F59E0B"))
                    .cornerRadius(10)

                Spacer()
            }

            VStack(spacing: 0) {
                ForEach(viewModel.pendingInvites) { invite in
                    PendingInviteRow(
                        invite: invite,
                        onResend: {
                            viewModel.resendInvite(invite)
                        },
                        onCancel: {
                            viewModel.cancelInvite(invite)
                        }
                    )

                    if invite.id != viewModel.pendingInvites.last?.id {
                        Divider()
                            .padding(.horizontal, 16)
                    }
                }
            }
            .background(Color.white)
            .cornerRadius(16)
        }
    }

    // MARK: - Tips Section

    private var tipsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: "lightbulb.fill")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "F59E0B"))

                Text("Conseils")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            VStack(spacing: 10) {
                InviteTipRow(
                    icon: "checkmark.shield.fill",
                    text: "Les invitations expirent après 7 jours pour plus de sécurité"
                )
                InviteTipRow(
                    icon: "person.2.fill",
                    text: "Chaque colocataire pourra voir et gérer les tâches et dépenses"
                )
                InviteTipRow(
                    icon: "bell.badge.fill",
                    text: "Vous recevrez une notification quand quelqu'un rejoint"
                )
            }
            .padding(16)
            .background(Color(hex: "FFFBEB"))
            .cornerRadius(12)
        }
    }
}

// MARK: - Quick Share Button

struct QuickShareButton: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 22))
                    .foregroundColor(.white)
                    .frame(width: 52, height: 52)
                    .background(color)
                    .cornerRadius(14)

                Text(title)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Pending Invite Row

struct PendingInviteRow: View {
    let invite: PendingInvite
    let onResend: () -> Void
    let onCancel: () -> Void

    var body: some View {
        HStack(spacing: 14) {
            // Avatar
            ZStack {
                Circle()
                    .fill(Color(hex: "F3F4F6"))
                    .frame(width: 44, height: 44)

                Text(invite.email.prefix(1).uppercased())
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(invite.email)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))

                Text("Envoyée \(invite.sentAgo)")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }

            Spacer()

            HStack(spacing: 8) {
                Button(action: onResend) {
                    Image(systemName: "arrow.clockwise")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "10B981"))
                        .frame(width: 36, height: 36)
                        .background(Color(hex: "10B981").opacity(0.1))
                        .cornerRadius(8)
                }

                Button(action: onCancel) {
                    Image(systemName: "xmark")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "EF4444"))
                        .frame(width: 36, height: 36)
                        .background(Color(hex: "EF4444").opacity(0.1))
                        .cornerRadius(8)
                }
            }
        }
        .padding(16)
    }
}

// MARK: - Tip Row

private struct InviteTipRow: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "F59E0B"))
                .frame(width: 20)

            Text(text)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "78716C"))
        }
    }
}

// MARK: - Share Sheet

struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

// MARK: - Models

struct PendingInvite: Identifiable {
    let id: UUID
    let email: String
    let sentDate: Date

    var sentAgo: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.unitsStyle = .short
        return formatter.localizedString(for: sentDate, relativeTo: Date())
    }
}

// MARK: - ViewModel

@MainActor
class HubInviteViewModel: ObservableObject {
    @Published var inviteLink: String = "https://easyco.app/invite/abc123"
    @Published var pendingInvites: [PendingInvite] = []
    @Published var showCopiedFeedback = false

    func loadInviteData() async {
        // Demo data
        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 300_000_000)

            inviteLink = "https://easyco.app/invite/\(UUID().uuidString.prefix(8))"

            pendingInvites = [
                PendingInvite(
                    id: UUID(),
                    email: "marie.dupont@email.com",
                    sentDate: Calendar.current.date(byAdding: .day, value: -2, to: Date())!
                ),
                PendingInvite(
                    id: UUID(),
                    email: "thomas.martin@email.com",
                    sentDate: Calendar.current.date(byAdding: .hour, value: -5, to: Date())!
                )
            ]
        }
    }

    func sendEmailInvite(to email: String) {
        let invite = PendingInvite(
            id: UUID(),
            email: email,
            sentDate: Date()
        )
        pendingInvites.insert(invite, at: 0)
    }

    func resendInvite(_ invite: PendingInvite) {
        // TODO: Resend API call
    }

    func cancelInvite(_ invite: PendingInvite) {
        pendingInvites.removeAll { $0.id == invite.id }
    }
}

// MARK: - Preview

struct HubInviteView_Previews: PreviewProvider {
    static var previews: some View {
        HubInviteView()
    }
}
