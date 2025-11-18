#!/usr/bin/env ruby

require 'xcodeproj'

project_path = 'EasyCo/EasyCo.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Target principal
target = project.targets.first

puts "🔧 Ajout final des fichiers Owner au projet..."

# Trouver le groupe Features
features_group = project.main_group.children.find { |g| g.display_name == 'Features' }

if features_group.nil?
  puts "❌ Groupe Features non trouvé!"
  exit 1
end

# Trouver le groupe Owner
owner_group = features_group.children.find { |g| g.display_name == 'Owner' }

if owner_group.nil?
  puts "📁 Création du groupe Owner"
  owner_group = features_group.new_group('Owner', 'Features/Owner')
end

# Nettoyer les anciennes références
puts "🧹 Nettoyage des anciennes références..."
owner_group.children.dup.each do |child|
  child.remove_from_project
end

# Liste des fichiers
owner_files = [
  'CreatePropertyView.swift',
  'CreatePropertyViewModel.swift',
  'PropertyFormStep1View.swift',
  'PropertyFormStep2View.swift',
  'PropertyFormStep3View.swift',
  'PropertyFormStep4View.swift',
  'PropertyFormStep5View.swift'
]

puts "\n✅ Ajout des fichiers Owner..."

owner_files.each do |filename|
  # Chemin absolu du fichier
  file_path = File.join(Dir.pwd, 'EasyCo/Features/Owner', filename)

  # Vérifier que le fichier existe
  unless File.exist?(file_path)
    puts "  ⚠️  Fichier non trouvé: #{filename}"
    next
  end

  # Créer la référence avec chemin relatif depuis EasyCo/
  file_ref = owner_group.new_reference("Features/Owner/#{filename}")
  file_ref.source_tree = '<group>'

  # Ajouter au target
  target.source_build_phase.add_file_reference(file_ref)

  puts "  ✅ #{filename}"
end

# Sauvegarder
project.save

puts "\n🎉 Fichiers Owner ajoutés avec succès!"
puts "\n📋 Actions:"
puts "  1. Ferme Xcode (⌘Q)"
puts "  2. Rouvre: open EasyCo/EasyCo.xcodeproj"
puts "  3. Clean (⇧⌘K)"
puts "  4. Build (⌘B)"
