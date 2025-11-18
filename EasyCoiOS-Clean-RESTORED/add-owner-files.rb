#!/usr/bin/env ruby

require 'xcodeproj'

# Chemin vers le projet Xcode
project_path = 'EasyCo/EasyCo.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Trouver le target principal
target = project.targets.first

# Trouver le groupe Features/Owner
features_group = project.main_group.groups.find { |g| g.path == 'Features' }
if features_group.nil?
  features_group = project.main_group.new_group('Features', 'EasyCo/Features')
end

owner_group = features_group.groups.find { |g| g.path == 'Owner' }
if owner_group.nil?
  owner_group = features_group.new_group('Owner', 'EasyCo/Features/Owner')
end

# Liste des nouveaux fichiers à ajouter
new_files = [
  'CreatePropertyView.swift',
  'CreatePropertyViewModel.swift',
  'PropertyFormStep1View.swift',
  'PropertyFormStep2View.swift',
  'PropertyFormStep3View.swift',
  'PropertyFormStep4View.swift',
  'PropertyFormStep5View.swift'
]

# Ajouter chaque fichier
new_files.each do |filename|
  file_path = "EasyCo/Features/Owner/#{filename}"

  # Vérifier si le fichier n'est pas déjà dans le projet
  existing_file = owner_group.files.find { |f| f.path == filename }

  if existing_file.nil?
    # Ajouter le fichier au groupe
    file_ref = owner_group.new_file(file_path)

    # Ajouter le fichier au target (compile sources)
    target.add_file_references([file_ref])

    puts "✅ Ajouté: #{filename}"
  else
    puts "⏭️  Déjà présent: #{filename}"
  end
end

# Sauvegarder le projet
project.save

puts "\n🎉 Tous les fichiers Owner ont été ajoutés au projet Xcode !"
puts "📂 Ouvre maintenant le projet dans Xcode:"
puts "   open EasyCo/EasyCo.xcodeproj"
