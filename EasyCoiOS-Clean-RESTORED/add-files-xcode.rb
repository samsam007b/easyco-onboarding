#!/usr/bin/env ruby
require 'xcodeproj'

# Chemin vers le projet
project_path = '/Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Target principal
target = project.targets.first

# Fichiers à ajouter (chemin relatif depuis le dossier du projet)
files_to_add = [
  'EasyCo/Models/Household.swift',
  'EasyCo/Models/Lease.swift',
  'EasyCo/Models/ResidentTask.swift',
  'EasyCo/Models/Expense.swift',
  'EasyCo/Models/Event.swift',
  'EasyCo/Features/Resident/ResidentHubViewModel.swift'
]

puts "🚀 Ajout des fichiers au projet Xcode..."
puts "📁 Projet: #{project_path}"
puts "🎯 Target: #{target.name}"
puts ""

files_to_add.each do |file_path|
  file_name = File.basename(file_path)

  # Vérifier si le fichier existe déjà dans le projet
  existing_file = project.files.find { |f| f.path == file_path }

  if existing_file
    puts "⚠️  #{file_name} existe déjà dans le projet, skip..."
    next
  end

  # Vérifier que le fichier existe physiquement
  full_path = File.join(File.dirname(project_path), '..', file_path)
  unless File.exist?(full_path)
    puts "❌ #{file_name} n'existe pas sur le disque!"
    next
  end

  # Déterminer le groupe parent
  group_path = File.dirname(file_path).split('/')

  # Trouver ou créer le groupe
  group = project.main_group
  group_path.each do |folder|
    next if folder == 'EasyCo' # Skip le dossier racine
    existing_group = group.groups.find { |g| g.name == folder || g.path == folder }
    if existing_group
      group = existing_group
    else
      group = group.new_group(folder, folder)
    end
  end

  # Ajouter le fichier au groupe
  file_ref = group.new_file(file_path)

  # Ajouter le fichier au target (pour qu'il soit compilé)
  target.add_file_references([file_ref])

  puts "✅ #{file_name} ajouté avec succès!"
end

# Sauvegarder le projet
project.save

puts ""
puts "✅ Projet sauvegardé avec succès!"
puts ""
puts "📱 Prochaines étapes:"
puts "   1. Fermez Xcode s'il est ouvert"
puts "   2. Ouvrez le projet: open #{project_path}"
puts "   3. Clean Build: Cmd+Shift+K"
puts "   4. Build: Cmd+B"
