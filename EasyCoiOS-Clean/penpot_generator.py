#!/usr/bin/env python3
"""
EasyCo iOS Design Generator for Penpot
Creates all screens with the EasyCo design system
"""

import requests
import json
import sys
from typing import Dict, Any, List, Optional

# Penpot Configuration
PENPOT_BASE_URL = "https://design.penpot.app"
PENPOT_API_URL = f"{PENPOT_BASE_URL}/api/rpc/command"

# Design Tokens - EasyCo Design System
COLORS = {
    "primary": "#4A148C",
    "primaryLight": "#6A1B9A",
    "primaryDark": "#38006B",
    "accentYellow": "#FFC107",
    "accentOrange": "#FF9800",
    "accentPink": "#E91E63",
    "success": "#4CAF50",
    "error": "#F44336",
    "warning": "#FF9800",
    "info": "#2196F3",
    "backgroundPrimary": "#FAFAFA",
    "backgroundSecondary": "#F5F5F5",
    "cardBackground": "#FFFFFF",
    "textPrimary": "#1A1A1A",
    "textSecondary": "#666666",
    "textTertiary": "#999999",
    "textOnPrimary": "#FFFFFF",
    "borderLight": "#E0E0E0",
    "divider": "#EEEEEE"
}

SPACING = {
    "xs": 8,
    "sm": 12,
    "md": 16,
    "lg": 24,
    "xl": 32,
    "xxl": 48
}

BORDER_RADIUS = {
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 20,
    "xxl": 24,
    "pill": 999
}

# iPhone 15 Pro dimensions
ARTBOARD_WIDTH = 393
ARTBOARD_HEIGHT = 852


class PenpotAPI:
    """Penpot API Client"""

    def __init__(self, token: str):
        self.token = token
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Token {token}",
            "Content-Type": "application/json"
        })

    def rpc_call(self, command: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Make an RPC call to Penpot API"""
        url = f"{PENPOT_API_URL}/{command}"

        try:
            response = self.session.post(url, json=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"❌ Error calling {command}: {e}")
            if hasattr(e.response, 'text'):
                print(f"Response: {e.response.text}")
            return None

    def get_profile(self) -> Optional[Dict]:
        """Get user profile"""
        return self.rpc_call("get-profile", {})

    def list_projects(self, team_id: str) -> List[Dict]:
        """List all projects for a team"""
        result = self.rpc_call("get-projects", {"team-id": team_id})
        return result if result else []

    def create_project(self, team_id: str, name: str) -> Optional[Dict]:
        """Create a new project"""
        return self.rpc_call("create-project", {
            "team-id": team_id,
            "name": name
        })

    def create_file(self, project_id: str, name: str) -> Optional[Dict]:
        """Create a new file in a project"""
        return self.rpc_call("create-file", {
            "project-id": project_id,
            "name": name,
            "is-shared": False
        })

    def get_file(self, file_id: str) -> Optional[Dict]:
        """Get file data"""
        return self.rpc_call("get-file", {"id": file_id})

    def update_file(self, file_id: str, changes: List[Dict]) -> Optional[Dict]:
        """Update file with changes"""
        return self.rpc_call("update-file", {
            "id": file_id,
            "revn": 0,
            "changes": changes
        })


class EasyCoDesignGenerator:
    """Generate EasyCo iOS designs in Penpot"""

    def __init__(self, api: PenpotAPI):
        self.api = api
        self.project_id = None
        self.file_id = None
        self.page_id = None

    def create_project(self) -> bool:
        """Create EasyCo iOS project"""
        print("📁 Creating EasyCo iOS project...")

        # Get user profile to find team ID
        profile = self.api.get_profile()
        if not profile:
            print("❌ Failed to get profile")
            return False

        team_id = profile.get("default-team-id")
        if not team_id:
            print("❌ No default team found")
            return False

        print(f"✅ Found team: {team_id}")

        # Check if project already exists
        projects = self.api.list_projects(team_id)
        for project in projects:
            if project.get("name") == "EasyCo iOS":
                print(f"✅ Project already exists: {project.get('id')}")
                self.project_id = project.get("id")
                return True

        # Create new project
        project = self.api.create_project(team_id, "EasyCo iOS")
        if not project:
            print("❌ Failed to create project")
            return False

        self.project_id = project.get("id")
        print(f"✅ Created project: {self.project_id}")
        return True

    def create_file(self) -> bool:
        """Create design file"""
        print("📄 Creating design file...")

        if not self.project_id:
            print("❌ No project ID")
            return False

        file_data = self.api.create_file(self.project_id, "EasyCo iOS Screens")
        if not file_data:
            print("❌ Failed to create file")
            return False

        self.file_id = file_data.get("id")

        # Get file to find page ID
        file_full = self.api.get_file(self.file_id)
        if not file_full:
            print("❌ Failed to get file data")
            return False

        pages = file_full.get("data", {}).get("pages", [])
        if pages:
            self.page_id = pages[0].get("id")

        print(f"✅ Created file: {self.file_id}")
        print(f"✅ Found page: {self.page_id}")
        return True

    def hex_to_rgb(self, hex_color: str) -> Dict[str, float]:
        """Convert hex color to RGB (0-1 range)"""
        hex_color = hex_color.lstrip('#')
        r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        return {
            "r": r / 255.0,
            "g": g / 255.0,
            "b": b / 255.0,
            "alpha": 1.0
        }

    def create_artboard(self, name: str, x: int, y: int) -> Dict:
        """Create an artboard/frame"""
        return {
            "type": "add-obj",
            "page-id": self.page_id,
            "obj": {
                "type": "frame",
                "name": name,
                "x": x,
                "y": y,
                "width": ARTBOARD_WIDTH,
                "height": ARTBOARD_HEIGHT,
                "fills": [{
                    "fill-color": self.hex_to_rgb(COLORS["backgroundPrimary"]),
                    "fill-opacity": 1.0
                }]
            }
        }

    def create_rectangle(self, parent_id: str, name: str, x: int, y: int,
                        width: int, height: int, color: str, radius: int = 0) -> Dict:
        """Create a rectangle shape"""
        return {
            "type": "add-obj",
            "page-id": self.page_id,
            "parent-id": parent_id,
            "obj": {
                "type": "rect",
                "name": name,
                "x": x,
                "y": y,
                "width": width,
                "height": height,
                "rx": radius,
                "ry": radius,
                "fills": [{
                    "fill-color": self.hex_to_rgb(color),
                    "fill-opacity": 1.0
                }]
            }
        }

    def create_text(self, parent_id: str, name: str, content: str,
                   x: int, y: int, size: int, color: str, weight: str = "normal") -> Dict:
        """Create a text element"""
        return {
            "type": "add-obj",
            "page-id": self.page_id,
            "parent-id": parent_id,
            "obj": {
                "type": "text",
                "name": name,
                "x": x,
                "y": y,
                "content": content,
                "typography": {
                    "font-family": "SF Pro Display",
                    "font-size": size,
                    "font-weight": weight,
                    "fill-color": self.hex_to_rgb(color)
                }
            }
        }

    def generate_welcome_screen(self) -> List[Dict]:
        """Generate Welcome Screen"""
        print("🎨 Generating Welcome Screen...")

        changes = []

        # Artboard
        artboard = self.create_artboard("Welcome Screen", 0, 0)
        changes.append(artboard)

        # TODO: Add glassmorphism sheet, buttons, etc.
        # This is a simplified version - full implementation would be more complex

        return changes

    def generate_all_screens(self) -> bool:
        """Generate all screens"""
        print("🎨 Generating all screens...")

        if not self.file_id or not self.page_id:
            print("❌ No file/page ID")
            return False

        all_changes = []

        # Generate each screen
        screens = [
            ("Welcome Screen", 0, 0),
            ("Login", 500, 0),
            ("Resident Dashboard", 1000, 0),
            ("Property List", 0, 1000),
            ("Property Detail", 500, 1000),
            ("Swipe Matching", 1000, 1000),
            ("Chat", 0, 2000),
            ("Profile", 500, 2000)
        ]

        for name, x, y in screens:
            artboard = self.create_artboard(name, x, y)
            all_changes.append(artboard)

        # Update file with all changes
        result = self.api.update_file(self.file_id, all_changes)

        if result:
            print(f"✅ Generated {len(screens)} screens")
            return True
        else:
            print("❌ Failed to generate screens")
            return False

    def run(self) -> bool:
        """Run the full generation process"""
        print("🚀 Starting EasyCo iOS Design Generation\n")

        if not self.create_project():
            return False

        if not self.create_file():
            return False

        if not self.generate_all_screens():
            return False

        print("\n✅ Design generation complete!")
        print(f"🌐 View your project: {PENPOT_BASE_URL}/dashboard/project/{self.project_id}")
        return True


def main():
    """Main entry point"""
    # Get token from environment or argument
    token = None

    if len(sys.argv) > 1:
        token = sys.argv[1]
    else:
        print("Usage: python penpot_generator.py <PENPOT_TOKEN>")
        print("\nOr set PENPOT_TOKEN environment variable")
        return 1

    if not token:
        print("❌ No Penpot token provided")
        return 1

    # Create API client
    api = PenpotAPI(token)

    # Test connection
    print("🔐 Testing Penpot connection...")
    profile = api.get_profile()

    if not profile:
        print("❌ Failed to connect to Penpot")
        print("Please check your token and try again")
        return 1

    print(f"✅ Connected as: {profile.get('fullname', 'Unknown')}")
    print()

    # Generate designs
    generator = EasyCoDesignGenerator(api)
    success = generator.run()

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
