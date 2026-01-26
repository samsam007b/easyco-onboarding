#!/bin/bash

# Script de vérification avant migration d'une vue
# Usage: ./check_before_migrate.sh Features/Auth/LoginView.swift

VIEW_FILE=$1

if [ -z "$VIEW_FILE" ]; then
    echo "❌ Usage: ./check_before_migrate.sh <path_to_view>"
    exit 1
fi

if [ ! -f "$VIEW_FILE" ]; then
    echo "❌ Fichier introuvable: $VIEW_FILE"
    exit 1
fi

echo "🔍 Vérification avant migration de $(basename $VIEW_FILE)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Extraire les types définis dans la vue
echo "📦 Types définis dans cette vue :"
grep -E "^(struct|enum|class|protocol) \w+" "$VIEW_FILE" | while read line; do
    TYPE_DEF=$(echo "$line" | awk '{print $1, $2}')
    TYPE_NAME=$(echo "$line" | awk '{print $2}')

    echo "  • $TYPE_DEF"

    # Vérifier si existe dans Models/
    MODELS_DIR="$(dirname "$(dirname "$VIEW_FILE")")/Models"
    if [ -d "$MODELS_DIR" ]; then
        if grep -rq "^$TYPE_DEF " "$MODELS_DIR"/*.swift 2>/dev/null; then
            echo "    ⚠️  ATTENTION : $TYPE_NAME existe déjà dans Models/"
            grep -rn "^$TYPE_DEF " "$MODELS_DIR"/*.swift 2>/dev/null | head -1
        else
            echo "    ✅ $TYPE_NAME peut être créé (pas de conflit)"
        fi
    fi
done
echo ""

# 2. Extraire les types UTILISÉS (référencés)
echo "📚 Types référencés (utilisés mais pas définis) :"
grep -oE ": \w+(\?|!)?" "$VIEW_FILE" | grep -v ": String\|: Int\|: Double\|: Bool\|: Date\|: UUID\|: CGFloat" | sed 's/: //g' | sed 's/?//g' | sed 's/!//g' | sort -u | while read TYPE_NAME; do
    echo "  • $TYPE_NAME"

    # Vérifier si défini quelque part
    FOUND=$(find "$(dirname "$(dirname "$VIEW_FILE")")" -name "*.swift" -exec grep -l "struct $TYPE_NAME\|enum $TYPE_NAME\|class $TYPE_NAME" {} \; 2>/dev/null | head -1)

    if [ -n "$FOUND" ]; then
        echo "    ✅ Défini dans: $(basename "$FOUND")"
    else
        echo "    ⚠️  NON TROUVÉ - devra être créé"
    fi
done
echo ""

# 3. Couleurs hardcodées
HARDCODED_COLORS=$(grep -c 'Color(hex:' "$VIEW_FILE")
echo "🎨 Couleurs hardcodées : $HARDCODED_COLORS"
if [ "$HARDCODED_COLORS" -gt 0 ]; then
    echo "   ⚠️  À remplacer par IzzicoWeb.Colors tokens"
fi
echo ""

# 4. Spacing/radius hardcodés
HARDCODED_SPACING=$(grep -cE '\.padding\([0-9]+\)|\.frame\(width: [0-9]+|spacing: [0-9]+' "$VIEW_FILE")
echo "📏 Spacing/radius hardcodés : $HARDCODED_SPACING"
if [ "$HARDCODED_SPACING" -gt 0 ]; then
    echo "   ⚠️  À remplacer par IzzicoWeb.Spacing/Radius tokens"
fi
echo ""

# 5. Composants custom (non-IzzicoWeb)
echo "🧩 Composants à migrer vers IzzicoWeb :"
grep -E "TextField|SecureField|Button|Text\(" "$VIEW_FILE" | head -5 | while read line; do
    echo "  • $(echo "$line" | sed 's/^[[:space:]]*//' | cut -c1-60)..."
done
echo ""

# 6. Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RÉSUMÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$HARDCODED_COLORS" -eq 0 ] && [ "$HARDCODED_SPACING" -eq 0 ]; then
    echo "✅ Vue propre, prête pour migration"
else
    echo "⚠️  Cleanup nécessaire avant migration :"
    [ "$HARDCODED_COLORS" -gt 0 ] && echo "   - Remplacer $HARDCODED_COLORS couleurs hardcodées"
    [ "$HARDCODED_SPACING" -gt 0 ] && echo "   - Remplacer $HARDCODED_SPACING spacing/radius hardcodés"
fi
echo ""
