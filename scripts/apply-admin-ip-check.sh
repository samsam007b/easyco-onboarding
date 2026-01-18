#!/bin/bash

# Script to apply IP allowlist check to all admin API routes
# VULN-007 fix: Ensure validateAdminRequest is used in all admin routes

ADMIN_ROUTES=(
  "app/api/admin/design-screenshots/upload/route.ts"
  "app/api/admin/assistant-stats/route.ts"
  "app/api/admin/invite/route.ts"
  "app/api/admin/invite/accept/route.ts"
  "app/api/admin/security/sentry-issues/route.ts"
  "app/api/admin/security/notifications/route.ts"
  "app/api/admin/security/errors-404/route.ts"
  "app/api/admin/test-security-alert/route.ts"
  "app/api/admin/invite/validate/route.ts"
)

echo "🔒 Applying IP allowlist check to ${#ADMIN_ROUTES[@]} admin routes..."
echo ""

for route in "${ADMIN_ROUTES[@]}"; do
  if [ -f "$route" ]; then
    # Check if already using validateAdminRequest
    if grep -q "validateAdminRequest" "$route"; then
      echo "✅ $route - Already protected"
    else
      echo "⚠️  $route - Needs update (manual review required)"
    fi
  else
    echo "❌ $route - File not found"
  fi
done

echo ""
echo "Note: agent-stats/route.ts was already updated as example"
echo "Apply the same pattern to routes marked ⚠️"
