#!/usr/bin/env python3
"""
Comment out duplicate struct declarations in view files
"""

import re

fixes = [
    {
        'file': 'EasyCoiOS-Clean/EasyCo/EasyCo/Features/Matches/SwipeMatchesViewModel.swift',
        'start_line': 265,
        'end_pattern': r'^}$',  # Find the closing brace of the struct
        'marker': '// MARK: - Match Filters'
    },
    {
        'file': 'EasyCoiOS-Clean/EasyCo/EasyCo/Features/SavedSearches/SavedSearchesView.swift',
        'start_line': 264,
        'end_pattern': r'^}$',
        'marker': '// MARK: - Saved Search Model'
    },
    {
        'file': 'EasyCoiOS-Clean/EasyCo/EasyCo/Features/Visits/VisitSchedulerView.swift',
        'start_line': 371,
        'end_pattern': r'^}$',
        'marker': 'struct TimeSlot'
    }
]

for fix in fixes:
    file_path = fix['file']
    print(f"📝 Processing {file_path.split('/')[-1]}...")

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find the start and end of the struct
    start_idx = fix['start_line'] - 1  # Convert to 0-indexed
    end_idx = start_idx

    # Skip the MARK comment if present
    if lines[start_idx].strip().startswith('// MARK:'):
        start_idx += 1
        end_idx = start_idx

    # Skip empty lines
    while end_idx < len(lines) and lines[end_idx].strip() == '':
        end_idx += 1
        start_idx = end_idx

    # Should be on the struct line now
    if 'struct' not in lines[end_idx]:
        print(f"  ❌ Expected struct at line {end_idx + 1}, found: {lines[end_idx].strip()}")
        continue

    # Find matching closing brace
    brace_count = 0
    found_opening = False

    for i in range(start_idx, len(lines)):
        line = lines[i]

        # Count braces
        for char in line:
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

    print(f"  ✅ Found struct from line {start_idx + 1} to {end_idx + 1}")

    # Comment out these lines
    for i in range(start_idx, end_idx + 1):
        if not lines[i].strip().startswith('//'):
            lines[i] = '// ' + lines[i]

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    print(f"  ✅ Commented out duplicate struct")
    print()

print("✅ All duplicates commented out!")
print("💡 Now the compiler will use the structs from Models/")
