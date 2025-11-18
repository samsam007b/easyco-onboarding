#!/usr/bin/env ruby

require 'xcodeproj'

project_path = 'EasyCo/EasyCo.xcodeproj'
project = Xcodeproj::Project.open(project_path)

target = project.targets.first

puts "🧹 Nettoyage des références incorrectes à OwnerFormComponents.swift..."

# Supprimer TOUTES les références à OwnerFormComponents.swift
project.files.each do |file|
  if file.display_name == 'OwnerFormComponents.swift'
    puts "  🗑️  Suppression de: #{file.path}"
    file.remove_from_project
  end
end

# Nettoyer les build phases
target.source_build_phase.files.each do |build_file|
  if build_file.file_ref && build_file.file_ref.display_name == 'OwnerFormComponents.swift'
    puts "  🗑️  Suppression de build phase: #{build_file.file_ref.path}"
    target.source_build_phase.files.delete(build_file)
  end
end

puts "\n✅ Nettoyage terminé"
puts "\n📋 Maintenant ajoute le fichier manuellement dans Xcode:"
puts "  1. Ferme Xcode (⌘Q)"
puts "  2. Ouvre ce script: open -R EasyCo/EasyCo/Features/Owner/OwnerFormComponents.swift"
puts "  3. Ouvre Xcode: open EasyCo/EasyCo.xcodeproj"
puts "  4. Drag & drop OwnerFormComponents.swift dans le groupe Owner"
puts "  5. DÉCOCHE 'Copy items if needed'"
puts "  6. SÉLECTIONNE 'Create groups'"
puts "  7. COCHE le target 'EasyCo'"
puts "  8. Clean (⇧⌘K) et Build (⌘B)"

# Sauvegarder
project.save

puts "\n💾 Projet sauvegardé"
