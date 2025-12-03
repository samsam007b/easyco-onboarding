#!/usr/bin/env python3
"""
Comment out remaining duplicate struct/enum declarations in view files
"""

import re

def comment_out_lines(file_path, start_line, num_lines):
    """Comment out a range of lines in a file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = start_line - 1  # Convert to 0-indexed

    for i in range(start_idx, min(start_idx + num_lines, len(lines))):
        if not lines[i].strip().startswith('//'):
            lines[i] = '// ' + lines[i]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    print(f"  ✅ Commented out lines {start_line}-{start_line + num_lines - 1}")

# Fix ApplicationDetail in ApplicationStatusView.swift
print("📝 Processing ApplicationStatusView.swift...")
comment_out_lines(
    'EasyCoiOS-Clean/EasyCo/EasyCo/Features/Applications/ApplicationStatusView.swift',
    253,  # struct ApplicationDetail {
    8     # through }
)

# Fix MaintenanceStatus in ResidentDashboardView.swift
print("📝 Processing ResidentDashboardView.swift...")
comment_out_lines(
    'EasyCoiOS-Clean/EasyCo/EasyCo/Features/Dashboard/ResidentDashboardView.swift',
    608,  # enum MaintenanceStatus {
    21    # through }
)

# Fix MaintenancePriority in ResidentDashboardView.swift
comment_out_lines(
    'EasyCoiOS-Clean/EasyCo/EasyCo/Features/Dashboard/ResidentDashboardView.swift',
    630,  # enum MaintenancePriority {
    21    # through }
)

print()
print("✅ All remaining duplicates commented out!")
print("💡 Now the compiler will use the enums/structs from Models/")
