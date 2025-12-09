#!/usr/bin/env python3
"""
Fix final duplicate struct/enum declarations in Features/ directory
Keep only declarations from Models/ directory
"""

import re

def comment_out_struct(file_path, start_line, num_lines):
    """Comment out a struct/enum declaration"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        start_idx = start_line - 1

        for i in range(start_idx, min(start_idx + num_lines, len(lines))):
            if not lines[i].strip().startswith('//'):
                lines[i] = '// ' + lines[i]

        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)

        print(f"  ✅ Commented out lines {start_line}-{start_line + num_lines - 1}")
        return True
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

# List of duplicate declarations to comment out
# Format: (file_path, start_line, num_lines, type_name)
duplicates = [
    # Conversation in ConversationsListView.swift
    ('EasyCo/Features/Messages/ConversationsListView.swift', 12, 11, 'Conversation'),

    # Message duplicates - need to find these
    # Announcement duplicates - need to find these
    # SearcherPreferences duplicates - need to find these
    # DocumentType member issues - need to check Models
]

print("🔧 Fixing final duplicate declarations...")
print()

for file_path, start, num_lines, type_name in duplicates:
    print(f"📝 {file_path.split('/')[-1]} - {type_name} (lines {start}-{start+num_lines-1})")
    comment_out_struct(file_path, start, num_lines)
    print()

print("✅ Initial duplicates fixed!")
print("💡 Need to search for Message, Announcement, SearcherPreferences duplicates")
