#!/usr/bin/env python3
"""
Script to add Swift files to Xcode project.pbxproj
"""
import re
import random
import string

def generate_uuid():
    """Generate 24-character hex UUID like Xcode uses"""
    return ''.join(random.choices('0123456789ABCDEF', k=24))

def add_files_to_project(project_path, files_to_add):
    """Add files to Xcode project"""

    with open(project_path, 'r') as f:
        content = f.read()

    # Store original for backup
    backup_path = project_path + '.backup2'
    with open(backup_path, 'w') as f:
        f.write(content)
    print(f"✅ Backup created at {backup_path}")

    # Find the Models group UUID by looking for Group.swift which is in Models
    models_group_match = re.search(r'([\dA-F]{24}) /\* Models \*/', content)
    if models_group_match:
        models_group_uuid = models_group_match.group(1)
        print(f"Found Models group: {models_group_uuid}")
    else:
        print("⚠️  Models group not found, using fallback")
        models_group_uuid = "F46BC4BE2EC2D863003F453A"  # From earlier analysis

    # Find Properties group - look for PropertyCardView.swift or similar
    properties_group_match = re.search(r'([\dA-F]{24}) /\* List \*/.*?isa = PBXGroup', content, re.DOTALL)
    if properties_group_match:
        # Go back to find the parent Properties group
        # Look for the Properties group that contains List
        properties_section = content[max(0, properties_group_match.start() - 5000):properties_group_match.start()]
        parent_match = re.findall(r'([\dA-F]{24}) /\* Properties \*/ = \{', properties_section)
        if parent_match:
            properties_group_uuid = parent_match[-1]
            print(f"Found Properties group: {properties_group_uuid}")
        else:
            properties_group_uuid = "F46BC4752EC2D70D003F453A"  # Fallback
    else:
        properties_group_uuid = "F46BC4752EC2D70D003F453A"  # Fallback
        print(f"Using fallback Properties group: {properties_group_uuid}")

    # Find the three target UUIDs by looking at existing PBXSourcesBuildPhase sections
    source_phase_matches = re.findall(r'([\dA-F]{24}) /\* Sources \*/ = \{', content)
    if len(source_phase_matches) >= 3:
        target_source_phases = source_phase_matches[:3]
        print(f"Found {len(target_source_phases)} build targets")
    else:
        print("ERROR: Could not find 3 source build phases")
        return False

    # Process each file
    for file_info in files_to_add:
        file_path = file_info['path']
        file_name = file_info['name']
        group_uuid = models_group_uuid if file_info['group'] == 'Models' else properties_group_uuid

        print(f"\n📝 Adding {file_name} to {file_info['group']} group...")

        # Generate UUIDs
        file_ref_uuid = generate_uuid()
        build_file_uuids = [generate_uuid() for _ in range(3)]

        print(f"  FileRef UUID: {file_ref_uuid}")
        print(f"  BuildFile UUIDs: {', '.join(build_file_uuids)}")

        # 1. Add to PBXBuildFile section (add 3 entries, one per target)
        build_file_section_match = re.search(r'/\* Begin PBXBuildFile section \*/', content)
        if build_file_section_match:
            insert_pos = build_file_section_match.end() + 1
            build_file_entries = '\n'.join([
                f"\t\t{uuid} /* {file_name} in Sources */ = {{isa = PBXBuildFile; fileRef = {file_ref_uuid} /* {file_name} */; }};"
                for uuid in build_file_uuids
            ]) + '\n'
            content = content[:insert_pos] + build_file_entries + content[insert_pos:]
            print(f"  ✅ Added to PBXBuildFile section")

        # 2. Add to PBXFileReference section
        file_ref_section_match = re.search(r'/\* Begin PBXFileReference section \*/', content)
        if file_ref_section_match:
            insert_pos = file_ref_section_match.end() + 1
            file_ref_entry = f"\t\t{file_ref_uuid} /* {file_name} */ = {{isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = {file_name}; sourceTree = \"<group>\"; }};\n"
            content = content[:insert_pos] + file_ref_entry + content[insert_pos:]
            print(f"  ✅ Added to PBXFileReference section")

        # 3. Add to PBXGroup (Models or Properties group)
        # Find the group and add before the closing );
        group_pattern = rf'{group_uuid} /\* {file_info["group"]} \*/ = \{{.*?children = \((.*?)\);'
        group_match = re.search(group_pattern, content, re.DOTALL)
        if group_match:
            children_section = group_match.group(1)
            # Find the end of children array (the last UUID before );)
            last_child_match = list(re.finditer(r'([\dA-F]{24}) /\*', children_section))
            if last_child_match:
                # Insert after the last child
                insert_pos = group_match.start(1) + children_section.rindex(',') + 1
                new_child = f"\n\t\t\t\t{file_ref_uuid} /* {file_name} */,"
                content = content[:insert_pos] + new_child + content[insert_pos:]
                print(f"  ✅ Added to {file_info['group']} group")

        # 4. Add to PBXSourcesBuildPhase sections (one for each target)
        for i, phase_uuid in enumerate(target_source_phases):
            phase_pattern = rf'{phase_uuid} /\* Sources \*/ = \{{.*?files = \((.*?)\);'
            phase_match = re.search(phase_pattern, content, re.DOTALL)
            if phase_match:
                files_section = phase_match.group(1)
                # Find the last file in the list
                last_file_match = list(re.finditer(r'([\dA-F]{24}) /\*', files_section))
                if last_file_match:
                    insert_pos = phase_match.start(1) + files_section.rindex(',') + 1
                    new_file = f"\n\t\t\t\t{build_file_uuids[i]} /* {file_name} in Sources */,"
                    content = content[:insert_pos] + new_file + content[insert_pos:]
        print(f"  ✅ Added to all {len(target_source_phases)} build phases")

    # Write the modified content
    with open(project_path, 'w') as f:
        f.write(content)

    print(f"\n✅ Successfully modified {project_path}")
    return True

# Files to add
files_to_add = [
    {
        'name': 'Room.swift',
        'path': 'EasyCo/Models/Room.swift',
        'group': 'Models'
    },
    {
        'name': 'RoomCardView.swift',
        'path': 'EasyCo/Features/Properties/RoomCardView.swift',
        'group': 'Properties'
    },
    {
        'name': 'RoomsListView.swift',
        'path': 'EasyCo/Features/Properties/RoomsListView.swift',
        'group': 'Properties'
    },
    {
        'name': 'RoomsViewModel.swift',
        'path': 'EasyCo/Features/Properties/RoomsViewModel.swift',
        'group': 'Properties'
    }
]

if __name__ == '__main__':
    project_path = 'EasyCo.xcodeproj/project.pbxproj'
    success = add_files_to_project(project_path, files_to_add)

    if success:
        print("\n🎉 All files added successfully!")
    else:
        print("\n❌ Failed to add files")
