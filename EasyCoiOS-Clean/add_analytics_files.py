#!/usr/bin/env python3
import sys
sys.path.insert(0, '/Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean')
from add_files_to_xcode import add_files_to_project

files_to_add = [
    {
        'name': 'Analytics.swift',
        'path': 'EasyCo/Models/Analytics.swift',
        'group': 'Models'
    },
    {
        'name': 'OwnerDashboardView.swift',
        'path': 'EasyCo/Components/Dashboard/OwnerDashboardView.swift',
        'group': 'Components'
    },
    {
        'name': 'OwnerDashboardViewModel.swift',
        'path': 'EasyCo/Components/Dashboard/OwnerDashboardViewModel.swift',
        'group': 'Components'
    },
    {
        'name': 'SearcherDashboardView.swift',
        'path': 'EasyCo/Components/Dashboard/SearcherDashboardView.swift',
        'group': 'Components'
    },
    {
        'name': 'SearcherDashboardViewModel.swift',
        'path': 'EasyCo/Components/Dashboard/SearcherDashboardViewModel.swift',
        'group': 'Components'
    }
]

project_path = 'EasyCo.xcodeproj/project.pbxproj'
add_files_to_project(project_path, files_to_add)
print("\n🎉 All analytics files added!")
