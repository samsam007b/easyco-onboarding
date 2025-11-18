#!/bin/bash

# Script to add new Swift files to Xcode project
# Run this after Xcode finishes downloading

echo "🔍 Checking for new Swift files..."

PROJECT_DIR="/Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo"
cd "$PROJECT_DIR"

# List of new files to add
NEW_FILES=(
    "EasyCo/Features/Matches/MatchesView.swift"
    "EasyCo/Features/Owner/OwnerPropertiesView.swift"
    "EasyCo/Features/Owner/ApplicationsView.swift"
    "EasyCo/Features/Resident/ResidentHubView.swift"
    "EasyCo/Features/Resident/TasksView.swift"
    "EasyCo/Features/Profile/SettingsView.swift"
    "EasyCo/Features/Messages/MessagesListView.swift"
    "EasyCo/Features/Groups/GroupsListView.swift"
    "EasyCo/Models/Conversation.swift"
    "EasyCo/Models/Group.swift"
)

echo "📝 Files to add:"
for file in "${NEW_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
    fi
done

echo ""
echo "⚠️  Important: These files need to be added to the Xcode project manually:"
echo ""
echo "1. Open EasyCo.xcodeproj in Xcode"
echo "2. Right-click on the appropriate folder in the Project Navigator"
echo "3. Select 'Add Files to EasyCo'"
echo "4. Select the files listed above"
echo "5. Make sure 'Copy items if needed' is UNCHECKED"
echo "6. Make sure 'Add to targets: EasyCo' is CHECKED"
echo ""
echo "Or simply drag and drop the files from Finder into Xcode."
