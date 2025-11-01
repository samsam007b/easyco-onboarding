#!/bin/bash

# Script pour ajouter NotificationBell dans tous les headers

# Fonction pour ajouter l'import
add_import() {
  local file=$1

  # Vérifier si l'import existe déjà
  if grep -q "import NotificationBell" "$file"; then
    echo "✓ Import déjà présent dans $file"
    return
  fi

  # Ajouter l'import après les imports de components/ui
  sed -i.bak "/import.*from '@\/components\/ui\/button';/a\\
import NotificationBell from '@/components/notifications/NotificationBell';
" "$file"

  echo "✓ Import ajouté dans $file"
}

# Ajouter dans tous les headers
add_import "components/layout/ModernResidentHeader.tsx"
add_import "components/layout/ModernOwnerHeader.tsx"
add_import "components/layout/ModernSearcherHeader.tsx"
add_import "components/layout/ModernPublicHeader.tsx"

echo "✅ Tous les imports ajoutés!"
