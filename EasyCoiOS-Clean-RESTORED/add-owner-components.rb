#!/usr/bin/env ruby

require 'xcodeproj'

project_path = 'EasyCo/EasyCo.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Target principal
target = project.targets.first

puts "🔧 Ajout de OwnerFormComponents.swift au projet..."

# Trouver le groupe Features
features_group = project.main_group.children.find { |g| g.display_name == 'Features' }

if features_group.nil?
  puts "❌ Groupe Features non trouvé!"
  exit 1
end

# Trouver le groupe Owner
owner_group = features_group.children.find { |g| g.display_name == 'Owner' }

if owner_group.nil?
  puts "❌ Groupe Owner non trouvé!"
  exit 1
end

# Vérifier si le fichier est déjà dans le projet
existing_file = owner_group.children.find { |f| f.display_name == 'OwnerFormComponents.swift' }

if existing_file
  puts "⚠️  OwnerFormComponents.swift existe déjà, suppression de l'ancienne référence..."
  existing_file.remove_from_project
end

# Chemin du fichier
file_path = 'Features/Owner/OwnerFormComponents.swift'

# Vérifier que le fichier existe physiquement
full_path = File.join(Dir.pwd, 'EasyCo/EasyCo', file_path)
unless File.exist?(full_path)
  puts "❌ Fichier non trouvé: #{full_path}"
  exit 1
end

# Créer la référence
file_ref = owner_group.new_reference(file_path)
file_ref.source_tree = '<group>'

# Ajouter au target
target.source_build_phase.add_file_reference(file_ref)

# Sauvegarder
project.save

puts "✅ OwnerFormComponents.swift ajouté avec succès!"
puts "\n📋 Prochaines étapes:"
puts "  1. Ferme Xcode (⌘Q) si ouvert"
puts "  2. Rouvre: open EasyCo/EasyCo.xcodeproj"
puts "  3. Clean (⇧⌘K)"
puts "  4. Build (⌘B)"
