#!/usr/bin/env ruby
require 'xcodeproj'

project_path = 'EasyCo.xcodeproj'
project = Xcodeproj::Project.open(project_path)

puts "🔍 Searching for files with duplicate paths..."

# Find all file references with duplicate paths
project.files.each do |file_ref|
  next unless file_ref.is_a?(Xcodeproj::Project::Object::PBXFileReference)

  path = file_ref.path
  next unless path

  # Check for duplicate path segments
  if path.include?('EasyCo/Features/EasyCo/Features/') ||
     path.include?('Owner/EasyCo/Features/Owner/')
    puts "❌ Found duplicate path: #{path}"

    # Remove this file reference
    file_ref.remove_from_project
    puts "   ✅ Removed bad reference"
  end
end

puts "\n💾 Saving project..."
project.save

puts "✅ Done! Now Clean & Build in Xcode."
