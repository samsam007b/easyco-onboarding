#!/usr/bin/env python3
"""
Script to add ApplicationDetailView.swift to Xcode project
"""

import sys
import uuid

def add_file_to_xcodeproj():
    pbxproj_path = "/Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"

    # Read the file
    with open(pbxproj_path, 'r') as f:
        content = f.read()

    # Generate UUIDs
    file_ref_uuid = str(uuid.uuid4()).replace('-', '')[:24].upper()
    build_file_uuid = str(uuid.uuid4()).replace('-', '')[:24].upper()

    file_path = "EasyCo/Features/Owner/ApplicationDetailView.swift"
    file_name = "ApplicationDetailView.swift"

    # Create PBXFileReference entry
    file_ref_entry = f'''		{file_ref_uuid} /* {file_name} */ = {{isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = {file_name}; sourceTree = "<group>"; }};'''

    # Create PBXBuildFile entry
    build_file_entry = f'''		{build_file_uuid} /* {file_name} in Sources */ = {{isa = PBXBuildFile; fileRef = {file_ref_uuid} /* {file_name} */; }};'''

    # Find the PBXFileReference section
    file_ref_section_start = content.find("/* Begin PBXFileReference section */")
    if file_ref_section_start == -1:
        print("❌ Could not find PBXFileReference section")
        return False

    # Find the end of the first line after the section start
    first_line_end = content.find('\n', file_ref_section_start)

    # Insert the file reference
    content = content[:first_line_end + 1] + file_ref_entry + '\n' + content[first_line_end + 1:]

    # Find the PBXBuildFile section
    build_file_section_start = content.find("/* Begin PBXBuildFile section */")
    if build_file_section_start == -1:
        print("❌ Could not find PBXBuildFile section")
        return False

    # Find the end of the first line after the section start
    first_line_end = content.find('\n', build_file_section_start)

    # Insert the build file
    content = content[:first_line_end + 1] + build_file_entry + '\n' + content[first_line_end + 1:]

    # Find the Owner group
    owner_group_pattern = "/* Owner */ = {"
    owner_group_start = content.find(owner_group_pattern)

    if owner_group_start == -1:
        print("❌ Could not find Owner group")
        return False

    # Find the children array
    children_start = content.find("children = (", owner_group_start)
    if children_start == -1:
        print("❌ Could not find children array in Owner group")
        return False

    # Find the end of the first line after children start
    first_line_end = content.find('\n', children_start)

    # Insert the file reference in the group
    group_entry = f'''				{file_ref_uuid} /* {file_name} */,'''
    content = content[:first_line_end + 1] + group_entry + '\n' + content[first_line_end + 1:]

    # Find the PBXSourcesBuildPhase section
    sources_section = content.find("/* Sources */ = {")
    if sources_section == -1:
        print("❌ Could not find Sources build phase")
        return False

    # Find the files array
    files_start = content.find("files = (", sources_section)
    if files_start == -1:
        print("❌ Could not find files array in Sources build phase")
        return False

    # Find the end of the first line after files start
    first_line_end = content.find('\n', files_start)

    # Insert the build file
    sources_entry = f'''				{build_file_uuid} /* {file_name} in Sources */,'''
    content = content[:first_line_end + 1] + sources_entry + '\n' + content[first_line_end + 1:]

    # Write back
    with open(pbxproj_path, 'w') as f:
        f.write(content)

    print(f"✅ Added {file_name} to Xcode project")
    print(f"   File Reference UUID: {file_ref_uuid}")
    print(f"   Build File UUID: {build_file_uuid}")
    return True

if __name__ == "__main__":
    success = add_file_to_xcodeproj()
    sys.exit(0 if success else 1)
