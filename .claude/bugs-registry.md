# Bugs Registry - EasyCo iOS Project

This document tracks critical bugs and issues encountered during development to prevent recurrence.

---

## 🔴 CRITICAL: Duplicate Source Files Causing Build Issues

**Date:** 2025-11-17
**Severity:** Critical
**Time Lost:** ~3 hours

### Problem
Xcode was compiling an old version of `SupabaseClient.swift` despite modifications being made to a different file with the same name. This caused:
- Code changes not appearing in running app
- Confusion about whether files were being compiled
- Multiple clean builds with no effect
- Wasted debugging time thinking the issue was elsewhere

### Root Cause
Two copies of `SupabaseClient.swift` existed in the project:
1. `EasyCo/Core/Supabase/SupabaseClient.swift` - New location (being edited)
2. `EasyCo/Supabase/SupabaseClient.swift` - Old location (being compiled by Xcode)

Xcode's build system was configured to compile the old file, so all modifications to the new file had zero effect.

### Detection Method
```bash
# Use Spotlight to find all instances of a file
mdfind -name "SupabaseClient.swift" 2>/dev/null | grep -i easyco

# Output showed two files:
# /Users/.../EasyCo/Core/Supabase/SupabaseClient.swift
# /Users/.../EasyCo/Supabase/SupabaseClient.swift
```

### Resolution
1. Identified duplicate using `mdfind` command
2. Copied updated file to the location Xcode was actually compiling
3. Deleted duplicate file to prevent future confusion
4. Verified with visible debug logs that changes were now appearing

### Prevention
- **Always search for duplicate files** when code changes don't appear after rebuild
- Use `mdfind -name "filename"` to find all instances
- Check Xcode project navigator for duplicate entries
- When refactoring file structure, ensure old files are removed from both:
  - File system
  - Xcode project references

### Command Reference
```bash
# Find all instances of a file in the project
mdfind -name "YourFile.swift" 2>/dev/null | grep -i projectname

# List all Swift files in project to spot duplicates
find /path/to/project -name "*.swift" | sort

# Check what Xcode is actually compiling (in build logs)
# Product → Build → Check "Build" section in Report Navigator
```

### Related Issues
- File system refactoring
- Moving files between folders without proper cleanup
- Xcode project.pbxproj not updated after manual file moves

---

## Template for Future Bugs

**Date:**
**Severity:** [Critical/High/Medium/Low]
**Time Lost:**

### Problem
[Description of the bug]

### Root Cause
[Why it happened]

### Detection Method
[How to identify if this bug is occurring]

### Resolution
[Steps taken to fix]

### Prevention
[How to avoid in the future]

---

*Last Updated: 2025-11-17*
