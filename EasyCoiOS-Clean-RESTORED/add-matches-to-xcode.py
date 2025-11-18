#!/usr/bin/env python3
"""
Script to add MatchesView.swift to the Xcode project in the correct Matches folder
"""

import re
import uuid

PROJECT_FILE = "EasyCo/EasyCo.xcodeproj/project.pbxproj"

# Generate unique IDs for the file
file_ref_id = str(uuid.uuid4()).replace('-', '').upper()[:24]
build_file_id = str(uuid.uuid4()).replace('-', '').upper()[:24]

print(f"📝 Adding MatchesView.swift to Xcode project...")
print(f"   File Reference ID: {file_ref_id}")
print(f"   Build File ID: {build_file_id}")

with open(PROJECT_FILE, 'r') as f:
    content = f.read()

# Add PBXBuildFile entry
build_file_entry = f"\t\t{build_file_id} /* MatchesView.swift in Sources */ = {{isa = PBXBuildFile; fileRef = {file_ref_id} /* MatchesView.swift */; }};\n"
content = content.replace(
    "/* Begin PBXBuildFile section */\n",
    f"/* Begin PBXBuildFile section */\n{build_file_entry}"
)

# Add PBXFileReference entry
file_ref_entry = f"\t\t{file_ref_id} /* MatchesView.swift */ = {{isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = MatchesView.swift; sourceTree = \"<group>\"; }};\n"
content = content.replace(
    "/* Begin PBXFileReference section */\n",
    f"/* Begin PBXFileReference section */\n{file_ref_entry}"
)

# Create Matches folder group if it doesn't exist
matches_group = f"""		F4MATCHES000000000000000 /* Matches */ = {{
			isa = PBXGroup;
			children = (
				{file_ref_id} /* MatchesView.swift */,
			);
			path = Matches;
			sourceTree = "<group>";
		}};
"""

# Find Features group and add Matches to it
features_pattern = r'(F46BC4642EC2D70D003F453A /\* Features \*/ = \{[\s\S]*?children = \()([\s\S]*?)(\);)'
matches_ref = f"\t\t\t\tF4MATCHES000000000000000 /* Matches */,\n"

def add_matches_to_features(match):
    start = match.group(1)
    children = match.group(2)
    end = match.group(3)
    if "Matches" not in children:
        children = children.rstrip() + "\n" + matches_ref
    return start + children + end

content = re.sub(features_pattern, add_matches_to_features, content)

# Add Matches group definition after Features
content = re.sub(
    r'(F46BC4642EC2D70D003F453A /\* Features \*/ = \{[\s\S]*?\};)',
    r'\1\n' + matches_group,
    content
)

# Add to PBXSourcesBuildPhase
sources_pattern = r'(/\* Begin PBXSourcesBuildPhase section \*/[\s\S]*?files = \()([\s\S]*?)(\);)'

def add_to_sources(match):
    start = match.group(1)
    files = match.group(2)
    end = match.group(3)
    build_ref = f"\t\t\t\t{build_file_id} /* MatchesView.swift in Sources */,\n"
    if build_file_id not in files:
        files = files.rstrip() + "\n" + build_ref
    return start + files + end

content = re.sub(sources_pattern, add_to_sources, content)

# Write back
with open(PROJECT_FILE, 'w') as f:
    f.write(content)

print("✅ Successfully added MatchesView.swift to the Xcode project!")
print("\nNext steps:")
print("1. Open EasyCo.xcodeproj in Xcode")
print("2. Clean Build Folder (Cmd+Shift+K)")
print("3. Build (Cmd+B)")
