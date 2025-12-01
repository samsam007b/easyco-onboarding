import SwiftUI

// MARK: - Devices Settings View

struct DevicesSettingsView: View {
    @StateObject private var viewModel = DevicesSettingsViewModel()
    @State private var showRenameDevice = false
    @State private var deviceToRename: ConnectedDevice?

    var body: some View {
        List {
            // Current device section
            currentDeviceSection

            // Other devices section
            if !viewModel.otherDevices.isEmpty {
                otherDevicesSection
            }

            // Push notifications section
            pushNotificationsSection

            // Trusted devices section
            trustedDevicesSection
        }
        .listStyle(.insetGrouped)
        .navigationTitle("Appareils")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(item: $deviceToRename) { device in
            RenameDeviceSheet(device: device) { newName in
                viewModel.renameDevice(device, newName: newName)
            }
        }
        .task {
            await viewModel.loadDevices()
        }
    }

    // MARK: - Current Device Section

    private var currentDeviceSection: some View {
        Section {
            if let currentDevice = viewModel.currentDevice {
                CurrentDeviceCard(device: currentDevice)
            }
        } header: {
            Text("Cet appareil")
        }
    }

    // MARK: - Other Devices Section

    private var otherDevicesSection: some View {
        Section {
            ForEach(viewModel.otherDevices) { device in
                DeviceRow(
                    device: device,
                    onRename: {
                        deviceToRename = device
                    },
                    onRemove: {
                        viewModel.removeDevice(device)
                    },
                    onTrust: {
                        viewModel.toggleTrust(device)
                    }
                )
            }
        } header: {
            HStack {
                Text("Autres appareils")
                Spacer()
                Text("\(viewModel.otherDevices.count)")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color(hex: "6B7280"))
                    .cornerRadius(999)
            }
        } footer: {
            Text("Ces appareils sont connectés à votre compte EasyCo.")
        }
    }

    // MARK: - Push Notifications Section

    private var pushNotificationsSection: some View {
        Section {
            Toggle(isOn: $viewModel.pushOnAllDevices) {
                HStack(spacing: 12) {
                    Image(systemName: "bell.badge.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "FFA040"))
                        .frame(width: 28)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Notifications sur tous les appareils")
                            .font(.system(size: 15))

                        Text("Recevoir les notifications push partout")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
            .tint(Color(hex: "FFA040"))

            if !viewModel.pushOnAllDevices {
                NavigationLink {
                    DeviceNotificationSettings(devices: viewModel.allDevices)
                } label: {
                    HStack {
                        Image(systemName: "slider.horizontal.3")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "6B7280"))
                            .frame(width: 28)

                        Text("Configurer par appareil")
                            .font(.system(size: 15))
                    }
                }
            }
        } header: {
            Text("Notifications")
        }
    }

    // MARK: - Trusted Devices Section

    private var trustedDevicesSection: some View {
        Section {
            ForEach(viewModel.trustedDevices) { device in
                TrustedDeviceRow(device: device) {
                    viewModel.removeTrust(device)
                }
            }

            if viewModel.trustedDevices.isEmpty {
                HStack {
                    Image(systemName: "shield.slash")
                        .foregroundColor(Color(hex: "D1D5DB"))

                    Text("Aucun appareil de confiance")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
            }
        } header: {
            Text("Appareils de confiance")
        } footer: {
            Text("Les appareils de confiance ne nécessitent pas de vérification supplémentaire lors de la connexion.")
        }
    }
}

// MARK: - Current Device Card

struct CurrentDeviceCard: View {
    let device: ConnectedDevice

    var body: some View {
        VStack(spacing: 16) {
            HStack(spacing: 16) {
                // Device icon
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FFD580")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 60, height: 60)

                    Image(systemName: device.icon)
                        .font(.system(size: 28))
                        .foregroundColor(.white)
                }

                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 6) {
                        Text(device.name)
                            .font(.system(size: 17, weight: .semibold))

                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "10B981"))
                    }

                    Text(device.model)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))

                    Text("Connecté maintenant")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "10B981"))
                }

                Spacer()
            }

            // Device info
            HStack(spacing: 20) {
                DeviceInfoItem(icon: "cpu", label: "iOS", value: device.osVersion)
                DeviceInfoItem(icon: "app.badge", label: "App", value: device.appVersion)
                DeviceInfoItem(icon: "location.fill", label: "Lieu", value: device.location)
            }
        }
        .padding(.vertical, 8)
    }
}

struct DeviceInfoItem: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "FFA040"))

            Text(label)
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "9CA3AF"))

            Text(value)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(hex: "374151"))
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Device Row

struct DeviceRow: View {
    let device: ConnectedDevice
    let onRename: () -> Void
    let onRemove: () -> Void
    let onTrust: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // Device icon
            ZStack {
                Circle()
                    .fill(Color(hex: "F3F4F6"))
                    .frame(width: 44, height: 44)

                Image(systemName: device.icon)
                    .font(.system(size: 20))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(device.name)
                        .font(.system(size: 15, weight: .medium))

                    if device.isTrusted {
                        Image(systemName: "checkmark.shield.fill")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "10B981"))
                    }
                }

                Text("\(device.model) • \(device.lastActive)")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))

                Text(device.location)
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }

            Spacer()

            Menu {
                Button(action: onRename) {
                    Label("Renommer", systemImage: "pencil")
                }

                Button(action: onTrust) {
                    Label(
                        device.isTrusted ? "Retirer la confiance" : "Marquer comme fiable",
                        systemImage: device.isTrusted ? "shield.slash" : "checkmark.shield"
                    )
                }

                Divider()

                Button(role: .destructive, action: onRemove) {
                    Label("Déconnecter", systemImage: "rectangle.portrait.and.arrow.right")
                }
            } label: {
                Image(systemName: "ellipsis")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .frame(width: 32, height: 32)
            }
        }
    }
}

// MARK: - Trusted Device Row

struct TrustedDeviceRow: View {
    let device: ConnectedDevice
    let onRemoveTrust: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: device.icon)
                .font(.system(size: 20))
                .foregroundColor(Color(hex: "10B981"))
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 2) {
                Text(device.name)
                    .font(.system(size: 15))

                Text("Ajouté \(device.trustedSince ?? "récemment")")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()

            Button(action: onRemoveTrust) {
                Text("Retirer")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(Color(hex: "EF4444"))
            }
        }
    }
}

// MARK: - Rename Device Sheet

struct RenameDeviceSheet: View {
    let device: ConnectedDevice
    let onSave: (String) -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var newName: String = ""

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Nom de l'appareil", text: $newName)
                } header: {
                    Text("Nouveau nom")
                } footer: {
                    Text("Choisissez un nom qui vous permet d'identifier facilement cet appareil.")
                }

                Section {
                    HStack {
                        Text("Modèle")
                        Spacer()
                        Text(device.model)
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    HStack {
                        Text("Dernière activité")
                        Spacer()
                        Text(device.lastActive)
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                } header: {
                    Text("Informations")
                }
            }
            .navigationTitle("Renommer l'appareil")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") { dismiss() }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Enregistrer") {
                        onSave(newName)
                        dismiss()
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(newName.isEmpty ? Color(hex: "D1D5DB") : Color(hex: "FFA040"))
                    .disabled(newName.isEmpty)
                }
            }
            .onAppear {
                newName = device.name
            }
        }
        .presentationDetents([.medium])
    }
}

// MARK: - Device Notification Settings

struct DeviceNotificationSettings: View {
    let devices: [ConnectedDevice]
    @State private var deviceSettings: [UUID: Bool] = [:]

    var body: some View {
        List {
            ForEach(devices) { device in
                Toggle(isOn: Binding(
                    get: { deviceSettings[device.id] ?? true },
                    set: { deviceSettings[device.id] = $0 }
                )) {
                    HStack(spacing: 12) {
                        Image(systemName: device.icon)
                            .font(.system(size: 20))
                            .foregroundColor(Color(hex: "6B7280"))
                            .frame(width: 28)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(device.name)
                                .font(.system(size: 15))

                            Text(device.model)
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                }
                .tint(Color(hex: "FFA040"))
            }
        }
        .navigationTitle("Notifications par appareil")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            for device in devices {
                deviceSettings[device.id] = device.notificationsEnabled
            }
        }
    }
}

// MARK: - Models

struct ConnectedDevice: Identifiable {
    let id: UUID
    var name: String
    let model: String
    let icon: String
    let osVersion: String
    let appVersion: String
    let location: String
    let lastActive: String
    var isTrusted: Bool
    var trustedSince: String?
    var notificationsEnabled: Bool
    let isCurrent: Bool
}

// MARK: - ViewModel

@MainActor
class DevicesSettingsViewModel: ObservableObject {
    @Published var currentDevice: ConnectedDevice?
    @Published var otherDevices: [ConnectedDevice] = []
    @Published var pushOnAllDevices = true

    var allDevices: [ConnectedDevice] {
        var devices: [ConnectedDevice] = []
        if let current = currentDevice {
            devices.append(current)
        }
        devices.append(contentsOf: otherDevices)
        return devices
    }

    var trustedDevices: [ConnectedDevice] {
        allDevices.filter { $0.isTrusted }
    }

    func loadDevices() async {
        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 300_000_000)

            currentDevice = ConnectedDevice(
                id: UUID(),
                name: "Mon iPhone",
                model: "iPhone 15 Pro",
                icon: "iphone",
                osVersion: "17.1",
                appVersion: "2.1.0",
                location: "Paris, France",
                lastActive: "Maintenant",
                isTrusted: true,
                trustedSince: "il y a 30j",
                notificationsEnabled: true,
                isCurrent: true
            )

            otherDevices = [
                ConnectedDevice(
                    id: UUID(),
                    name: "MacBook Pro",
                    model: "MacBook Pro 14\"",
                    icon: "laptopcomputer",
                    osVersion: "14.1",
                    appVersion: "2.1.0",
                    location: "Paris, France",
                    lastActive: "Il y a 2h",
                    isTrusted: true,
                    trustedSince: "il y a 60j",
                    notificationsEnabled: true,
                    isCurrent: false
                ),
                ConnectedDevice(
                    id: UUID(),
                    name: "iPad",
                    model: "iPad Air",
                    icon: "ipad",
                    osVersion: "17.1",
                    appVersion: "2.0.5",
                    location: "Lyon, France",
                    lastActive: "Il y a 3j",
                    isTrusted: false,
                    trustedSince: nil,
                    notificationsEnabled: false,
                    isCurrent: false
                )
            ]
        }
    }

    func removeDevice(_ device: ConnectedDevice) {
        otherDevices.removeAll { $0.id == device.id }
    }

    func renameDevice(_ device: ConnectedDevice, newName: String) {
        if let index = otherDevices.firstIndex(where: { $0.id == device.id }) {
            otherDevices[index].name = newName
        }
    }

    func toggleTrust(_ device: ConnectedDevice) {
        if let index = otherDevices.firstIndex(where: { $0.id == device.id }) {
            otherDevices[index].isTrusted.toggle()
            if otherDevices[index].isTrusted {
                otherDevices[index].trustedSince = "à l'instant"
            } else {
                otherDevices[index].trustedSince = nil
            }
        }
    }

    func removeTrust(_ device: ConnectedDevice) {
        if device.isCurrent {
            currentDevice?.isTrusted = false
            currentDevice?.trustedSince = nil
        } else if let index = otherDevices.firstIndex(where: { $0.id == device.id }) {
            otherDevices[index].isTrusted = false
            otherDevices[index].trustedSince = nil
        }
    }
}

// MARK: - Preview

struct DevicesSettingsView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            DevicesSettingsView()
        }
    }
}
