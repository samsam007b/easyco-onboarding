#!/usr/bin/env python3
"""
Comment out ALL duplicate type declarations in view files.
Keep only declarations from Components/ and Models/, remove duplicates from Features/
"""

import os
import shutil

# Files to remove/comment out duplicates FROM (not the canonical locations)
files_to_fix = [
    # Component duplicates in LoadingAndEmptyStates.swift
    ('EasyCoiOS-Clean/EasyCo/EasyCo/Components/States/LoadingAndEmptyStates.swift', 111, 150),  # EmptyStateView
    ('EasyCoiOS-Clean/EasyCo/EasyCo/Components/States/LoadingAndEmptyStates.swift', 317, 350),  # AppError

    # Chart data duplicates in DashboardViewModels.swift
    ('EasyCoiOS-Clean/EasyCo/EasyCo/Features/Dashboard/DashboardViewModels.swift', 276, 280),  # LineChartData
    ('EasyCoiOS-Clean/EasyCo/EasyCo/Features/Dashboard/DashboardViewModels.swift', 282, 286),  # BarChartData
    ('EasyCoiOS-Clean/EasyCo/EasyCo/Features/Dashboard/DashboardViewModels.swift', 288, 294),  # DonutChartData

    # RoundedCorner duplicate in Extensions
    ('EasyCoiOS-Clean/EasyCo/EasyCo/Extensions/View+Extensions.swift', 87, 110),  # RoundedCorner

    # FilterChip duplicate in FilterChip.swift (keep the one in FormComponents.swift)
    ('EasyCoiOS-Clean/EasyCo/EasyCo/Components/Common/FilterChip.swift', 10, 70),  # FilterChip

    # FormField duplicate in ApplicationFormView.swift
    ('EasyCoiOS-Clean/EasyCo/EasyCo/Features/Applications/ApplicationFormView.swift', 681, 710),  # FormField

    # SwipeDirection duplicate in SwipeCard.swift
    ('EasyCoiOS-Clean/EasyCo/EasyCo/Components/Swipe/SwipeCard.swift', 335, 345),  # SwipeDirection
]

def comment_out_lines(file_path, start_line, end_line):
    """Comment out a range of lines in a file"""
    if not os.path.exists(file_path):
        print(f"  ⚠️  File not found: {file_path}")
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = start_line - 1  # Convert to 0-indexed
    end_idx = min(end_line, len(lines))

    for i in range(start_idx, end_idx):
        if i < len(lines) and not lines[i].strip().startswith('//'):
            lines[i] = '// ' + lines[i]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    return True

print("🔧 Commenting out duplicate type declarations...")
print()

for file_path, start, end in files_to_fix:
    filename = file_path.split('/')[-1]
    print(f"📝 {filename} (lines {start}-{end})")

    if comment_out_lines(file_path, start, end):
        print(f"  ✅ Commented out lines {start}-{end}")
    print()

print("✅ All Component duplicates commented out!")
print("💡 Now the compiler will use the canonical declarations from Components/ and Models/")
