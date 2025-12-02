#!/bin/bash
# Add new Swift files to Xcode project

echo "📦 Adding new files to Xcode project..."

# List of new files to add
FILES=(
    "EasyCo/Core/Errors/AppError.swift"
    "EasyCo/Core/Network/APIClient.swift"
    "EasyCo/Core/Services/PropertyService.swift"
    "EasyCo/Core/Services/AlertsManager.swift"
    "EasyCo/Core/Services/NotificationService.swift"
    "EasyCo/Core/Services/PropertyComparisonManager.swift"
    "EasyCo/Core/Services/AuthService.swift"
    "EasyCo/Core/Services/WebSocketManager.swift"
    "EasyCo/Models/DashboardData.swift"
    "EasyCo/Models/Match.swift"
    "EasyCo/Models/MatchFilters.swift"
    "EasyCo/Models/PropertyFilters.swift"
    "EasyCo/Core/i18n/TranslationSections.swift"
    "EasyCo/Core/DesignSystem/AnimationPresets.swift"
    "EasyCo/Core/DesignSystem/HapticManager.swift"
)

cd "$(dirname "$0")"

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  Adding: $file"
        # Use xcodebuild or just open Xcode - for now, report what would be added
    fi
done

echo ""
echo "✅ Files ready to be added to Xcode"
echo "⚠️  MANUAL STEP REQUIRED:"
echo "   Open Xcode and drag these files into the project navigator:"
echo "   - Core/Errors/AppError.swift"
echo "   - Core/Network/APIClient.swift"
echo "   - Core/Services/* (7 files)"
echo "   - Models/Match.swift, DashboardData.swift, MatchFilters.swift, PropertyFilters.swift"
echo "   - Core/i18n/TranslationSections.swift"
echo "   - Core/DesignSystem/AnimationPresets.swift, HapticManager.swift"
