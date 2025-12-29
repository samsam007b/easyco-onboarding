#!/bin/bash

# Script pour construire l'application iOS

echo "🚀 Construction de l'application Izzico pour iOS..."
echo ""

# Étape 1 : Build Next.js avec la config Capacitor
echo "📦 Étape 1/3 : Construction de Next.js (export statique)..."
next build -c next.config.capacitor.mjs

if [ $? -ne 0 ]; then
  echo "❌ Erreur lors du build Next.js"
  exit 1
fi

echo "✅ Build Next.js terminé"
echo ""

# Étape 2 : Copier les fichiers nécessaires
echo "📋 Étape 2/3 : Copie des assets..."
if [ -d "out" ]; then
  echo "✅ Dossier 'out' créé avec succès"
else
  echo "❌ Erreur : Le dossier 'out' n'a pas été créé"
  exit 1
fi

echo ""

# Étape 3 : Synchroniser avec Capacitor
echo "🔄 Étape 3/3 : Synchronisation avec Capacitor..."
npx cap sync ios

if [ $? -ne 0 ]; then
  echo "❌ Erreur lors de la synchronisation Capacitor"
  exit 1
fi

echo "✅ Synchronisation terminée"
echo ""
echo "🎉 Build terminé avec succès !"
echo ""
echo "Pour ouvrir le projet dans Xcode, exécutez :"
echo "  npm run cap:open:ios"
echo ""
echo "Ou directement :"
echo "  npx cap open ios"
