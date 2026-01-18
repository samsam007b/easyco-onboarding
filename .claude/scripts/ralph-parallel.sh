#!/bin/bash
# Lance 5 Ralph Loops en parallèle via tmux

# Vérifier que tmux est installé
if ! command -v tmux &> /dev/null; then
    echo "tmux n'est pas installé. Installation..."
    brew install tmux
fi

# Créer une nouvelle session tmux
SESSION="ralph-izzico-$(date +%Y%m%d-%H%M)"

# Tuer la session si elle existe déjà
tmux kill-session -t "$SESSION" 2>/dev/null

# Créer la session avec la première fenêtre
tmux new-session -d -s "$SESSION" -n "notifications"

# Feature 1: Notifications Push
tmux send-keys -t "$SESSION:notifications" "cd /Users/samuelbaudon/easyco-onboarding && caffeinate -i -s &" Enter
tmux send-keys -t "$SESSION:notifications" "claude --dangerously-skip-permissions" Enter
sleep 2
tmux send-keys -t "$SESSION:notifications" '/ralph-loop "Implémenter un système de notifications push pour Izzico:
1. Créer lib/services/notification-service.ts avec types NotificationType
2. Créer table notifications dans Supabase (migration numérotée)
3. Composant NotificationBell.tsx avec badge count
4. Intégrer dans app/layout.tsx (header)
5. Types: task_assigned, document_expiring, maintenance_update, payment_received
6. Marquer comme lu via API
7. AVANT de terminer: générer rapport Notion dans page 2ec98c38-d2a6-819c-9ed6-c1501a261d65
Output <promise>NOTIFICATIONS DONE</promise> quand fonctionnel." --max-iterations 25' Enter

# Feature 2: Recurring Tasks
tmux new-window -t "$SESSION" -n "recurring-tasks"
tmux send-keys -t "$SESSION:recurring-tasks" "cd /Users/samuelbaudon/easyco-onboarding && caffeinate -i -s &" Enter
tmux send-keys -t "$SESSION:recurring-tasks" "claude --dangerously-skip-permissions" Enter
sleep 2
tmux send-keys -t "$SESSION:recurring-tasks" '/ralph-loop "Ajouter les tâches récurrentes au système de Tasks:
1. Étendre types/tasks.types.ts avec recurrence_pattern (daily, weekly, monthly, custom)
2. Migration SQL pour champ recurrence dans tasks
3. Modifier task-service.ts pour auto-créer prochaine instance
4. UI dans /hub/tasks pour définir récurrence (toggle + select)
5. Edge function ou trigger pour génération automatique
6. Design V3-fun avec couleurs resident (orange)
7. AVANT de terminer: générer rapport Notion dans page 2ec98c38-d2a6-819c-9ed6-c1501a261d65
Output <promise>RECURRING TASKS DONE</promise> quand une tâche récurrente génère sa prochaine instance." --max-iterations 20' Enter

# Feature 3: Expense Analytics
tmux new-window -t "$SESSION" -n "expense-analytics"
tmux send-keys -t "$SESSION:expense-analytics" "cd /Users/samuelbaudon/easyco-onboarding && caffeinate -i -s &" Enter
tmux send-keys -t "$SESSION:expense-analytics" "claude --dangerously-skip-permissions" Enter
sleep 2
tmux send-keys -t "$SESSION:expense-analytics" '/ralph-loop "Créer un dashboard analytics pour les dépenses dans /hub/finances:
1. Installer recharts si pas présent
2. Composant ExpenseAnalytics.tsx avec:
   - Pie chart par catégorie
   - Line chart évolution mensuelle
   - Bar chart top dépensiers
3. Calcul prédiction budget restant
4. Export CSV des données
5. Design V3-fun avec couleurs resident (orange)
6. Intégrer dans page finances existante
7. AVANT de terminer: générer rapport Notion dans page 2ec98c38-d2a6-819c-9ed6-c1501a261d65
Output <promise>ANALYTICS DONE</promise> quand les 3 graphiques affichent des données." --max-iterations 20' Enter

# Feature 4: Digital Signatures
tmux new-window -t "$SESSION" -n "signatures"
tmux send-keys -t "$SESSION:signatures" "cd /Users/samuelbaudon/easyco-onboarding && caffeinate -i -s &" Enter
tmux send-keys -t "$SESSION:signatures" "claude --dangerously-skip-permissions" Enter
sleep 2
tmux send-keys -t "$SESSION:signatures" '/ralph-loop "Implémenter la signature électronique pour les documents:
1. Installer react-signature-canvas
2. Composant SignaturePad.tsx avec canvas
3. Migration SQL: signature_url, signed_at, signed_by dans documents
4. Stocker signatures dans Supabase Storage (bucket signatures)
5. Workflow: bouton Signer -> modal SignaturePad -> save -> badge Signé
6. Service signature-service.ts
7. Design V3-fun avec couleurs resident (orange)
8. AVANT de terminer: générer rapport Notion dans page 2ec98c38-d2a6-819c-9ed6-c1501a261d65
Output <promise>SIGNATURES DONE</promise> quand un document peut être signé et affiche le badge." --max-iterations 25' Enter

# Feature 5: Vendor Directory
tmux new-window -t "$SESSION" -n "vendors"
tmux send-keys -t "$SESSION:vendors" "cd /Users/samuelbaudon/easyco-onboarding && caffeinate -i -s &" Enter
tmux send-keys -t "$SESSION:vendors" "claude --dangerously-skip-permissions" Enter
sleep 2
tmux send-keys -t "$SESSION:vendors" '/ralph-loop "Créer un annuaire de prestataires pour la maintenance:
1. Migration SQL: table vendors (id, name, category, phone, email, rating, created_at)
2. Types dans types/maintenance.types.ts
3. Service vendor-service.ts (CRUD + rating)
4. Page /hub/maintenance/vendors avec:
   - Liste cards avec infos vendor
   - Filtres par catégorie et rating
   - Modal ajout/edit vendor
5. Lier vendor à ticket maintenance (foreign key)
6. Système notation 1-5 étoiles après intervention
7. Design V3-fun avec couleurs resident (orange)
8. AVANT de terminer: générer rapport Notion dans page 2ec98c38-d2a6-819c-9ed6-c1501a261d65
Output <promise>VENDORS DONE</promise> quand on peut ajouter un vendor et le lier à un ticket." --max-iterations 20' Enter

echo ""
echo "✅ 5 Ralph Loops lancés en parallèle!"
echo ""
echo "📺 Pour voir les sessions:"
echo "   tmux attach -t $SESSION"
echo ""
echo "🔄 Navigation entre fenêtres:"
echo "   Ctrl+B puis 0-4 (numéro fenêtre)"
echo "   Ctrl+B puis n (suivante)"
echo "   Ctrl+B puis p (précédente)"
echo ""
echo "❌ Pour tout arrêter:"
echo "   tmux kill-session -t $SESSION"
echo ""
