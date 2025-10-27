#!/bin/bash

# EasyCo Demo Mode Startup Script
# This script sets up and runs the demo version locally

set -e

echo "🎭 Starting EasyCo in DEMO mode..."
echo ""

# Check if we're on the demo branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "demo-version" ]; then
  echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH', not 'demo-version'"
  echo "   Switching to demo-version branch..."
  git checkout demo-version
fi

# Check if .env.local exists
if [ -f .env.local ]; then
  echo "⚠️  Found existing .env.local file"
  echo "   Backing up to .env.local.backup..."
  cp .env.local .env.local.backup
fi

# Copy demo environment
echo "📝 Setting up demo environment variables..."
cp .env.demo .env.local

# Add demo mode flag if not present
if ! grep -q "NEXT_PUBLIC_DEMO_MODE=true" .env.local; then
  echo "NEXT_PUBLIC_DEMO_MODE=true" >> .env.local
fi

echo "✅ Demo environment configured!"
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔥 Starting development server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   🎭 DEMO MODE ACTIVE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   Demo Credentials:"
echo "   ┌────────────────────────────────────────────────────┐"
echo "   │  Searcher: demo.searcher@easyco.demo / Demo2024!  │"
echo "   │  Owner:    demo.owner@easyco.demo / Demo2024!     │"
echo "   │  Resident: demo.resident@easyco.demo / Demo2024!  │"
echo "   └────────────────────────────────────────────────────┘"
echo ""
echo "   The demo banner and credentials will appear on login."
echo "   All data is fictional - safe for public testing."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the dev server
npm run dev
