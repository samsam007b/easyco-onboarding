#!/usr/bin/env ruby

require 'xcodeproj'

# Chemin vers le projet Xcode
project_path = 'EasyCo/EasyCo.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Trouver le target principal
target = project.targets.first

puts "🔍 Nettoyage des références incorrectes..."

# Liste des fichiers Owner
owner_files = [
  'CreatePropertyView.swift',
  'CreatePropertyViewModel.swift',
  'PropertyFormStep1View.swift',
  'PropertyFormStep2View.swift',
  'PropertyFormStep3View.swift',
  'PropertyFormStep4View.swift',
  'PropertyFormStep5View.swift'
]

# Supprimer toutes les références incorrectes
project.main_group.recursive_children.each do |child|
  if child.is_a?(Xcodeproj::Project::Object::PBXFileReference)
    if owner_files.include?(child.path)
      # Vérifier si le chemin est incorrect (dupliqué)
      if child.real_path.to_s.include?('Features/EasyCo/Features')
        puts "🗑️  Suppression référence incorrecte: #{child.path}"
        child.remove_from_project
      end
    end
  end
end

# Trouver ou créer le groupe Features
features_group = project.main_group.children.find { |g| g.display_name == 'Features' }
if features_group.nil?
  puts "📁 Création du groupe Features"
  features_group = project.main_group.new_group('Features', 'Features')
end

# Trouver ou créer le groupe Owner
owner_group = features_group.children.find { |g| g.display_name == 'Owner' }
if owner_group.nil?
  puts "📁 Création du groupe Owner"
  owner_group = features_group.new_group('Owner', 'Features/Owner')
end

# Supprimer les anciennes références du groupe Owner
owner_group.children.dup.each do |child|
  if owner_files.include?(child.path) || owner_files.include?(child.display_name)
    puts "🗑️  Nettoyage ancienne référence: #{child.display_name}"
    child.remove_from_project
  end
end

puts "\n✅ Ajout des fichiers avec les bons chemins..."

# Ajouter chaque fichier avec le bon chemin
owner_files.each do |filename|
  # Chemin relatif depuis la racine du projet
  file_path = "Features/Owner/#{filename}"

  # Créer la référence au fichier
  file_ref = owner_group.new_file(file_path)

  # Ajouter au target pour compilation
  target.add_file_references([file_ref])

  puts "✅ Ajouté: #{filename}"
end

# Sauvegarder le projet
project.save

puts "\n🎉 Projet corrigé avec succès !"
puts "📂 Les fichiers Owner sont maintenant correctement référencés"
puts "\n⚠️  IMPORTANT: Ferme et rouvre Xcode pour que les changements prennent effet"
puts "   1. Ferme Xcode complètement (⌘Q)"
puts "   2. Rouvre le projet: open EasyCo/EasyCo.xcodeproj"
