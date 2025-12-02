#!/bin/bash

# Icon mapping: iOS_name -> Lucide_name
declare -A icons=(
    # TabBar icons
    ["home"]="home"
    ["search"]="search"
    ["heart"]="heart"
    ["bell"]="bell"
    ["bookmark"]="bookmark"
    
    # Menu icons - Searcher
    ["doc-text"]="file-text"
    ["calendar-badge-clock"]="calendar-clock"
    ["person-3"]="users"
    ["message"]="message-circle"
    
    # Menu icons - Common
    ["person-crop-circle"]="user"
    ["slider-horizontal-3"]="sliders-horizontal"
    ["gear"]="settings"
    ["chart-bar"]="bar-chart"
    
    # Property icons
    ["building-2"]="building-2"
    ["eurosign-circle"]="euro"
    ["mappin"]="map-pin"
    
    # Tools icons
    ["wrench-screwdriver"]="wrench"
    ["checklist"]="list-checks"
    ["calendar"]="calendar"
    ["creditcard"]="credit-card"
    ["megaphone"]="megaphone"
    
    # Additional icons
    ["sparkles"]="sparkles"
    ["plus"]="plus"
    ["trash"]="trash-2"
    ["chevron-right"]="chevron-right"
    ["chevron-left"]="chevron-left"
    ["xmark"]="x"
)

BASE_URL="https://unpkg.com/lucide-static@latest/icons"
OUTPUT_DIR="/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/temp-icons"

echo "Downloading Lucide icons..."
for lucide_name in "${icons[@]}"; do
    echo "  - $lucide_name.svg"
    curl -sL "$BASE_URL/$lucide_name.svg" -o "$OUTPUT_DIR/$lucide_name.svg"
done

echo "✓ Downloaded ${#icons[@]} icons to $OUTPUT_DIR"
