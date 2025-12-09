#!/usr/bin/env python3
"""
Add files to Xcode build phase
"""
import re
import uuid

project_file = "EasyCo.xcodeproj/project.pbxproj"

# Files that need PBXBuildFile entries
files_to_add = {
    "NetworkManager.swift": "F44281502EDFC9E200F004E7",
    "PaymentService.swift": "F44281512EDFC9E200F004E7",
    "AuthTranslations.swift": "F44281522EDFCA1100F004E7",
    "AnalyticsService.swift": None,  # Need to find UUID
    "UserRole.swift": None,
    "TimePeriod.swift": None,
    "PendingPayment.swift": None,
    "PaymentMethod.swift": None,
}

# Read project file
with open(project_file, 'r') as f:
    content = f.read()

# Find UUIDs for files without them
for filename, file_uuid in files_to_add.items():
    if file_uuid is None:
        # Search for the file reference
        pattern = rf'([A-F0-9]+) /\* {re.escape(filename)} \*/ = \{{isa = PBXFileReference'
        match = re.search(pattern, content)
        if match:
            files_to_add[filename] = match.group(1)
            print(f"Found UUID for {filename}: {match.group(1)}")
        else:
            # Try alternate pattern
            pattern2 = rf'([A-F0-9]+) = \{{isa = PBXFileReference.*path = {re.escape(filename)}'
            match2 = re.search(pattern2, content)
            if match2:
                files_to_add[filename] = match2.group(1)
                print(f"Found UUID for {filename}: {match2.group(1)}")
            else:
                print(f"⚠️  Could not find UUID for {filename}")

# Find the PBXSourcesBuildPhase section for the main target
sources_build_phase_pattern = r'(F[A-F0-9]+) /\* Sources \*/ = \{\s*isa = PBXSourcesBuildPhase;.*?files = \((.*?)\);'
match = re.search(sources_build_phase_pattern, content, re.DOTALL)

if not match:
    print("❌ Could not find PBXSourcesBuildPhase")
    exit(1)

sources_section_uuid = match.group(1)
current_files = match.group(2)

print(f"\n📝 Found Sources build phase: {sources_section_uuid}")

# Create PBXBuildFile entries
new_build_files = []
build_file_section_start = content.find("/* Begin PBXBuildFile section */")
build_file_section_end = content.find("/* End PBXBuildFile section */")

if build_file_section_start == -1:
    print("❌ Could not find PBXBuildFile section")
    exit(1)

# Generate new PBXBuildFile entries
build_file_entries = []
file_references_to_add = []

for filename, file_uuid in files_to_add.items():
    if file_uuid is None:
        print(f"⚠️  Skipping {filename} (no UUID found)")
        continue

    # Check if build file already exists
    if f"{file_uuid} in Sources" in content:
        print(f"✅ {filename} already in build phase")
        continue

    # Generate new UUID for PBXBuildFile
    build_file_uuid = uuid.uuid4().hex[:24].upper()
    build_file_uuid = f"F{build_file_uuid[1:]}"  # Ensure it starts with F

    # Create PBXBuildFile entry
    build_file_entry = f"\t\t{build_file_uuid} /* {filename} in Sources */ = {{isa = PBXBuildFile; fileRef = {file_uuid} /* {filename} */; }};\n"
    build_file_entries.append(build_file_entry)

    # Create file reference to add to sources
    file_ref = f"\t\t\t\t{build_file_uuid} /* {filename} in Sources */,\n"
    file_references_to_add.append(file_ref)

    print(f"✅ Created build file entry for {filename}")

# Insert PBXBuildFile entries
if build_file_entries:
    insert_pos = build_file_section_end
    content = content[:insert_pos] + "".join(build_file_entries) + content[insert_pos:]
    print(f"\n📝 Added {len(build_file_entries)} PBXBuildFile entries")

# Add file references to Sources build phase
if file_references_to_add:
    # Find the files section again (position may have changed)
    match = re.search(sources_build_phase_pattern, content, re.DOTALL)
    if match:
        files_section = match.group(2)
        # Add new files before the closing );
        new_files_section = files_section.rstrip() + "\n" + "".join(file_references_to_add) + "\t\t\t"
        content = content.replace(
            f"files = ({files_section});",
            f"files = ({new_files_section});"
        )
        print(f"📝 Added {len(file_references_to_add)} files to Sources build phase")

# Write back
with open(project_file, 'w') as f:
    f.write(content)

print("\n✅ Done! Files added to build phase.")
print("💡 Now run: xcodebuild -scheme EasyCo -sdk iphonesimulator clean build")
