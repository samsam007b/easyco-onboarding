#!/usr/bin/env python3
"""
Migration Cleanup Script
Identifies duplicate and invalid migration files
"""

import os
import re
from pathlib import Path
from collections import defaultdict

MIGRATIONS_DIR = Path("/Users/samuelbaudon/easyco-onboarding/supabase/migrations")

def parse_migration_filename(filename):
    """Extract version number from migration filename"""
    match = re.match(r'^(\d+|2024\d+|2025\d+|2026\d+|999)_', filename)
    if match:
        return match.group(1)
    return None

def should_keep_migration(filename):
    """Heuristic to determine if this is the 'canonical' version"""
    # Prefer files with these keywords (more refined/fixed versions)
    prefer_keywords = ['_clean', '_fixed', '_enhanced', '_safe', '_complete', '_final']

    # Avoid files with these keywords (temporary/backup)
    avoid_keywords = ['_old', '_backup', '_temp', '_test']

    # Check for preferred keywords
    for keyword in prefer_keywords:
        if keyword in filename.lower():
            return 10  # High score

    # Check for avoided keywords
    for keyword in avoid_keywords:
        if keyword in filename.lower():
            return -10  # Low score

    # Base score
    return 0

def analyze_migrations():
    """Analyze migration files and identify duplicates"""
    migrations_by_version = defaultdict(list)
    invalid_files = []

    # Group by version
    for filepath in MIGRATIONS_DIR.glob("*.sql"):
        filename = filepath.name
        version = parse_migration_filename(filename)

        if version:
            migrations_by_version[version].append(filename)
        else:
            # Invalid pattern
            invalid_files.append(filename)

    return migrations_by_version, invalid_files

def select_files_to_keep(migrations_by_version):
    """Select which files to keep for each version"""
    to_keep = {}
    to_delete = []

    for version, files in migrations_by_version.items():
        if len(files) == 1:
            # No duplicates
            to_keep[version] = files[0]
        else:
            # Duplicates - score each file
            scored_files = [(f, should_keep_migration(f), os.path.getsize(MIGRATIONS_DIR / f)) for f in files]

            # Sort by score (desc), then by size (desc)
            scored_files.sort(key=lambda x: (x[1], x[2]), reverse=True)

            # Keep the best one
            to_keep[version] = scored_files[0][0]

            # Mark others for deletion
            for f, _, _ in scored_files[1:]:
                to_delete.append(f)

    return to_keep, to_delete

def main():
    print("🔍 Analyzing migrations...\n")

    migrations_by_version, invalid_files = analyze_migrations()

    print(f"📊 Found {len(migrations_by_version)} unique versions")
    print(f"⚠️  Found {len(invalid_files)} invalid files\n")

    # Show duplicates
    duplicates = {v: f for v, f in migrations_by_version.items() if len(f) > 1}
    if duplicates:
        print(f"🔁 Versions with duplicates ({len(duplicates)}):")
        for version, files in sorted(duplicates.items()):
            print(f"  {version}: {len(files)} files")
            for f in files:
                size = os.path.getsize(MIGRATIONS_DIR / f)
                score = should_keep_migration(f)
                print(f"    - {f} ({size} bytes, score: {score})")
        print()

    # Select files to keep/delete
    to_keep, to_delete = select_files_to_keep(migrations_by_version)

    print(f"✅ Files to KEEP: {len(to_keep)}")
    print(f"🗑️  Files to DELETE: {len(to_delete) + len(invalid_files)}")
    print()

    # Output delete commands
    print("=" * 70)
    print("FILES TO DELETE:")
    print("=" * 70)

    all_to_delete = to_delete + invalid_files
    for filename in sorted(all_to_delete):
        print(filename)

    print()
    print("=" * 70)
    print(f"Total: {len(all_to_delete)} files to delete")
    print("=" * 70)

    # Generate delete script
    delete_script_path = MIGRATIONS_DIR / "DELETE_DUPLICATES.sh"
    with open(delete_script_path, 'w') as f:
        f.write("#!/bin/bash\n")
        f.write("# Auto-generated script to delete duplicate migrations\n")
        f.write("# Review carefully before running!\n\n")
        f.write("cd /Users/samuelbaudon/easyco-onboarding/supabase/migrations\n\n")
        for filename in sorted(all_to_delete):
            f.write(f'rm "{filename}"\n')
        f.write(f'\necho "Deleted {len(all_to_delete)} files"\n')

    os.chmod(delete_script_path, 0o755)
    print(f"\n📝 Delete script generated: {delete_script_path}")
    print("   Review it, then run: ./supabase/migrations/DELETE_DUPLICATES.sh")

if __name__ == "__main__":
    main()
