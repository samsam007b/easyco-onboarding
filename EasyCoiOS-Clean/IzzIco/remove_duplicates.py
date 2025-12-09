#!/usr/bin/env python3
"""
Script to remove duplicate file references from Xcode project.pbxproj
"""

import re
from collections import defaultdict

def remove_duplicate_sources(pbxproj_path):
    """Remove duplicate entries from PBXSourcesBuildPhase"""

    with open(pbxproj_path, 'r') as f:
        content = f.read()

    # Find all PBXSourcesBuildPhase sections
    sources_pattern = r'(\/\* Begin PBXSourcesBuildPhase section \*\/.*?\/\* End PBXSourcesBuildPhase section \*\/)'

    def deduplicate_files_section(match):
        section = match.group(0)
        lines = section.split('\n')

        # Track seen file references
        seen_refs = set()
        new_lines = []

        for line in lines:
            # Check if line contains a file reference
            ref_match = re.search(r'([A-F0-9]{24}) \/\* (.+?) in Sources \*\/', line)

            if ref_match:
                file_ref = ref_match.group(1)
                file_name = ref_match.group(2)

                # Create unique key based on filename (not ref ID, as duplicates have different IDs)
                if file_name not in seen_refs:
                    seen_refs.add(file_name)
                    new_lines.append(line)
                else:
                    print(f"Removing duplicate: {file_name}")
            else:
                new_lines.append(line)

        return '\n'.join(new_lines)

    # Apply deduplication
    new_content = re.sub(sources_pattern, deduplicate_files_section, content, flags=re.DOTALL)

    # Write back
    with open(pbxproj_path, 'w') as f:
        f.write(new_content)

    print("✅ Duplicates removed from project.pbxproj")

if __name__ == '__main__':
    pbxproj_path = '/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj'

    print("🔧 Removing duplicate file references from Xcode project...")
    remove_duplicate_sources(pbxproj_path)
    print("✅ Done! You can now build the project.")
