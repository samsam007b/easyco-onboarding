#!/bin/bash

# Script pour remplacer les anciennes notifications par NotificationBell

FILES=(
  "components/layout/ModernOwnerHeader.tsx"
  "components/layout/ModernSearcherHeader.tsx"
  "components/layout/ModernPublicHeader.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Chercher la ligne avec "Notifications */"
    line_num=$(grep -n "{/\* Notifications \*/}" "$file" | cut -d: -f1 | head -1)

    if [ -n "$line_num" ]; then
      # Créer un fichier temporaire avec le remplacement
      awk -v line="$line_num" '
        NR==line {
          print "            {/* Notifications - New NotificationBell Component */}"
          print "            <NotificationBell />"
          skip=1
          next
        }
        skip && /<\/div>/ && ++count==2 { skip=0; next }
        !skip
      ' "$file" > "$file.tmp"

      mv "$file.tmp" "$file"
      echo "✓ NotificationBell ajouté dans $file"
    else
      echo "⚠ Section notifications non trouvée dans $file"
    fi
  fi
done

echo "✅ Modifications terminées!"
