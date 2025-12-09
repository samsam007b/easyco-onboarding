#!/usr/bin/env python3
"""
Comment out duplicate View/Component declarations in Features/
"""

import re

def find_and_comment_struct(file_path, struct_name, start_line):
    """Find a struct by name starting at a line and comment it out"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # Find the struct declaration
        start_idx = start_line - 1
        if start_idx >= len(lines):
            print(f"  ⚠️  Line {start_line} out of range in {file_path}")
            return False

        # Find matching closing brace
        brace_count = 0
        found_opening = False
        end_idx = start_idx

        for i in range(start_idx, len(lines)):
            for char in lines[i]:
                if char == '{':
                    brace_count += 1
                    found_opening = True
                elif char == '}':
                    brace_count -= 1
                    if found_opening and brace_count == 0:
                        end_idx = i
                        break
            if found_opening and brace_count == 0:
                break

        # Comment out the lines
        for i in range(start_idx, end_idx + 1):
            if not lines[i].strip().startswith('//'):
                lines[i] = '// ' + lines[i]

        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)

        print(f"  ✅ Commented out {struct_name} (lines {start_idx + 1}-{end_idx + 1})")
        return True

    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

# List of redeclarations to comment out
# (file, struct_name, line_number)
redeclarations = [
    ('EasyCo/Features/Dashboard/DashboardViewModels.swift', 'SearcherDashboardViewModel', 14),
    ('EasyCo/Features/Dashboard/OwnerDashboardView.swift', 'OwnerPropertyCard', 506),
    ('EasyCo/Features/Dashboard/ResidentDashboardView.swift', 'QuickActionCard', 742),
    ('EasyCo/Features/Groups/GroupDetailView.swift', 'MemberRow', 336),
    ('EasyCo/Features/Matches/MatchSwipeView.swift', 'StatBadge', 324),
    ('EasyCo/Features/Messages/ChatView.swift', 'ChatView', 5),
    ('EasyCo/Features/Messages/ChatView.swift', 'MessageBubble', 180),
    ('EasyCo/Features/Owner/OwnerFinanceView.swift', 'TransactionRow', 442),
    ('EasyCo/Features/Profile/MyAnnouncementsView.swift', 'AnnouncementCard', 116),
    ('EasyCo/Features/Profile/MyAnnouncementsView.swift', 'CreateAnnouncementView', 184),
    ('EasyCo/Features/Profile/SettingsView.swift', 'LanguageSettingsView', 473),
    ('EasyCo/Features/Profile/SettingsView.swift', 'LanguageRow', 501),
    ('EasyCo/Features/Properties/RoomCardView.swift', 'DetailItem', 178),
    ('EasyCo/Features/Properties/RoomsListView.swift', 'DetailRow', 318),
    ('EasyCo/Features/Properties/SavedSearchesWrapper.swift', 'SavedSearchesWrapper', 6),
]

print("🔧 Commenting out duplicate View/Component declarations...")
print()

for file_path, struct_name, line_num in redeclarations:
    print(f"📝 {file_path.split('/')[-1]} - {struct_name}")
    find_and_comment_struct(file_path, struct_name, line_num)
    print()

print("✅ All redeclarations commented out!")
