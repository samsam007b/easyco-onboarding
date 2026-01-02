#!/bin/bash
# English Code Guard Hook
# Ensures all hardcoded strings in code are in English, not French
# This hook checks Write and Edit operations for French text patterns

# Read tool input from stdin
TOOL_INPUT=$(cat)

# Extract file path and content
FILE_PATH=$(echo "$TOOL_INPUT" | jq -r '.file_path // empty')
CONTENT=$(echo "$TOOL_INPUT" | jq -r '.content // .new_string // empty')

# Skip non-code files (allow French in .md, .json translations, etc.)
if [[ "$FILE_PATH" =~ \.(md|MD)$ ]] || \
   [[ "$FILE_PATH" =~ translations\.ts$ ]] || \
   [[ "$FILE_PATH" =~ /i18n/ ]] || \
   [[ "$FILE_PATH" =~ \.local\.md$ ]] || \
   [[ "$FILE_PATH" =~ CLAUDE\.md$ ]]; then
  echo '{"status": "continue"}'
  exit 0
fi

# Only check TypeScript/JavaScript/TSX/JSX files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
  echo '{"status": "continue"}'
  exit 0
fi

# Common French patterns that should be in English in code
# These are UI strings that are often hardcoded
FRENCH_PATTERNS=(
  "Chargement"
  "Retour"
  "Suivant"
  "Précédent"
  "Annuler"
  "Confirmer"
  "Enregistrer"
  "Supprimer"
  "Modifier"
  "Ajouter"
  "Créer"
  "Fermer"
  "Ouvrir"
  "Rechercher"
  "Filtrer"
  "Trier"
  "Voir plus"
  "Voir moins"
  "En cours"
  "Terminé"
  "Erreur"
  "Succès"
  "Attention"
  "Information"
  "Aucun résultat"
  "Sélectionner"
  "Télécharger"
  "Envoyer"
  "Répondre"
  "Partager"
  "Copier"
  "Coller"
  "Éditer"
  "Sauvegarder"
  "Valider"
  "Connexion"
  "Déconnexion"
  "Inscription"
  "Mot de passe"
  "Bienvenue"
  "Bonjour"
  "Merci"
  "S'il vous plaît"
  "Veuillez"
  "Obligatoire"
  "Optionnel"
  "Disponible"
  "Indisponible"
  "Actif"
  "Inactif"
  "Nouveau"
  "Ancien"
  "Tout"
  "Aucun"
  "Oui"
  "Non"
)

# Check for French patterns in content
FOUND_FRENCH=""
for pattern in "${FRENCH_PATTERNS[@]}"; do
  # Look for pattern in string literals (between quotes)
  if echo "$CONTENT" | grep -qE "([\"\'\`])[^\"\']*${pattern}[^\"\']*\1"; then
    if [ -z "$FOUND_FRENCH" ]; then
      FOUND_FRENCH="$pattern"
    else
      FOUND_FRENCH="$FOUND_FRENCH, $pattern"
    fi
  fi
done

# If French found, warn but allow (soft enforcement)
if [ -n "$FOUND_FRENCH" ]; then
  # Escape for JSON
  ESCAPED_FRENCH=$(echo "$FOUND_FRENCH" | sed 's/"/\\"/g')

  cat << EOF
{
  "status": "continue",
  "message": "⚠️ ENGLISH CODE GUARD: French text detected in code: [$ESCAPED_FRENCH]. Please use English for all hardcoded strings. Use i18n system for user-facing text."
}
EOF
  exit 0
fi

# All good - continue
echo '{"status": "continue"}'
