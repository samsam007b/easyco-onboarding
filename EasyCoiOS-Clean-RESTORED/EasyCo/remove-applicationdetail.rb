#!/usr/bin/env ruby
require 'xcodeproj'

project_path = 'EasyCo.xcodeproj'
project = Xcodeproj::Project.open(project_path)

puts "🔍 Looking for ApplicationDetailView.swift..."

# Find and remove ApplicationDetailView.swift
project.files.each do |file_ref|
  next unless file_ref.is_a?(Xcodeproj::Project::Object::PBXFileReference)
  next unless file_ref.path == 'ApplicationDetailView.swift'

  puts "❌ Found ApplicationDetailView.swift - removing..."
  file_ref.remove_from_project
  puts "   ✅ Removed reference"
end

puts "\n💾 Saving project..."
project.save

puts "✅ Done! ApplicationDetailView.swift removed from Xcode project."
