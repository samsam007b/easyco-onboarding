---
name: team-coordination
description: Coordinate multiple Claude Code agents working on the same project - prevents conflicts, manages file ownership, and enforces git best practices
---

# Team Coordination Protocol

You are part of a **team of Claude Code agents** working on the same project. Multiple agents may be active simultaneously, each with their own task. You MUST follow this protocol to avoid conflicts and maintain code integrity.

## 🆔 Agent Identification

At the START of every session, you MUST:

1. **Generate your Agent ID**: Use format `agent-{first-4-chars-of-task}-{random-4-digits}`
   - Example: `agent-fixb-7392` for "Fix button styling"
   - Example: `agent-addu-1847` for "Add user authentication"

2. **Register in the Team Registry**: Read and update `.claude/team-registry.md`

3. **Announce your presence**: State your Agent ID and task clearly

## 📋 Team Registry File

The team registry is located at `.claude/team-registry.md`. This file tracks:
- Active agents and their tasks
- Claimed files (files being actively worked on)
- Completed tasks awaiting review
- Protected files (do not touch)

### Registry Format

```markdown
# Team Registry
Last updated: [timestamp]

## Active Agents
| Agent ID | Task | Started | Claimed Files |
|----------|------|---------|---------------|
| agent-xxxx-0000 | Description | ISO date | file1.ts, file2.ts |

## Completed (Pending Review)
| Agent ID | Task | Completed | Modified Files |
|----------|------|-----------|----------------|
| agent-yyyy-1111 | Description | ISO date | file3.ts |

## Protected Files (DO NOT MODIFY)
- path/to/file.ts (reason: Agent agent-xxxx is working on this)
```

## 🔒 File Ownership Rules

### Before Modifying ANY File:

1. **Check the Team Registry** for claimed files
2. **If the file is claimed by another agent**: DO NOT MODIFY IT
   - You may READ the file for context
   - You may reference it in comments
   - You may NOT edit, write, or delete it
3. **If the file is unclaimed**: Claim it by updating the registry

### Claiming Files

```markdown
## How to Claim
1. Read .claude/team-registry.md
2. Check if file is already claimed
3. If unclaimed, add to your "Claimed Files" list
4. Proceed with modifications
```

### Releasing Files

When you complete work on a file:
1. Move your entry from "Active Agents" to "Completed (Pending Review)"
2. Keep the file listed so others know it was modified
3. DO NOT remove other agents' claims

## 🚫 Git Safety Protocol

### BEFORE Any Git Operation

You MUST verify:

1. **Only commit YOUR files**: Files you claimed and worked on
2. **Never commit unclaimed files**: Even if they show as modified
3. **Never commit other agents' files**: Check the registry first
4. **Use granular commits**: One logical change per commit

### Safe Commit Pattern

```bash
# 1. Check what's changed
git status

# 2. Cross-reference with team registry
# Read .claude/team-registry.md

# 3. Only stage YOUR files
git add path/to/your/claimed/file.ts
git add path/to/another/claimed/file.ts
# DO NOT use "git add ." or "git add -A"

# 4. Commit with agent ID in message
git commit -m "[agent-xxxx-0000] Fix button styling in header

- Changed Button component props
- Updated CSS for hover states

🤖 Generated with Claude Code"
```

### NEVER Do This

```bash
# ❌ NEVER stage all files
git add .
git add -A

# ❌ NEVER push without checking registry
git push  # Without verification

# ❌ NEVER amend other agents' commits
git commit --amend  # If last commit isn't yours

# ❌ NEVER force push
git push --force
```

## 🤝 Collaboration Patterns

### When You Need Another Agent's Work

If you depend on files another agent is working on:

1. **Check their status** in the registry
2. **Wait for completion**: Do not proceed until they move to "Completed"
3. **Reference, don't modify**: You can import/use their code, but don't edit it
4. **Coordinate via registry**: Add a note in the registry if blocking

### Handling Merge Conflicts

If git reports conflicts on files you don't own:

1. **STOP immediately**
2. **Do not resolve conflicts** on files you don't own
3. **Abort the operation**: `git merge --abort` or `git rebase --abort`
4. **Document in registry**: Note the conflict for the file owner
5. **Wait for resolution**: Let the file owner resolve it

### Communication Pattern

When you complete a task that affects others:

```markdown
## Add to Completed section:
| agent-xxxx-0000 | Implemented UserAuth component | 2025-01-15 | src/auth/*, hooks/useAuth.ts |

## Add note:
**Note from agent-xxxx-0000**: UserAuth is ready. Other agents can now import from `@/auth`. Breaking change: removed old `login()` function, use `signIn()` instead.
```

## 📁 File Categories

### Always Safe to Modify (No Claim Needed)
- `.claude/team-registry.md` (your own entry only)
- Files you created in this session
- Test files for code you wrote
- Your own documentation additions

### Requires Claim
- Any existing source code file
- Configuration files (package.json, tsconfig, etc.)
- Database migrations
- Shared utilities and hooks

### Never Modify Without Explicit Request
- `.env` files
- Lock files (package-lock.json, yarn.lock)
- CI/CD configurations
- Other agents' claimed files

## ⏰ Claim TTL (Time-To-Live)

Claims have expiration rules to prevent abandoned locks:

| Status | Threshold | Action |
|--------|-----------|--------|
| **Active** | < 2 hours | Normal - claim is valid |
| **Stale** | 2-4 hours | Warning - can be overridden if urgent |
| **Expired** | > 4 hours | Auto-invalidated - claim can be taken |

### Keeping Claims Fresh

Update your `Last Active` timestamp regularly:
```markdown
| agent-xxxx-0000 | Task | 2025-01-15T10:00:00 | 2025-01-15T12:30:00 | files... |
```

### Overriding Stale Claims

If you need a file claimed by a stale agent (2h+ inactive):

1. **Check their last activity** - are they really gone?
2. **Add a note** in the Agent Notes section
3. **Update the claim** to your agent ID
4. **Document the override** for when they return

### Running Cleanup

To check for stale claims, run:
```bash
.claude/hooks/team-cleanup.sh
```

## 🔄 Session Lifecycle

### Starting a Session

```
1. Read .claude/team-registry.md
2. Generate your Agent ID
3. Add your entry to "Active Agents" with current timestamp
4. Set "Last Active" to current time
5. List initial files you expect to modify
6. Begin work
```

### During Work

```
1. Before editing a file → Check registry
2. After completing a file → Update your claimed list if needed
3. Update "Last Active" every 30-60 minutes
4. If blocked by another agent → Add note to registry
5. Regular status updates → Keep your entry current
```

### Ending a Session

```
1. Move to "Completed (Pending Review)" section
2. List ALL files you modified
3. Add any notes for other agents
4. DO NOT remove other agents' entries
5. DO NOT push if other agents have uncommitted claimed files
```

## ⚠️ Conflict Resolution

### Priority Rules

1. **First claim wins**: Agent who claimed first has priority
2. **Core files over features**: Critical bug fixes take priority
3. **Ask if unsure**: Better to wait than to cause conflicts

### If You Accidentally Modified Another Agent's File

1. **Do not commit the change**
2. **Revert immediately**: `git checkout -- path/to/file`
3. **Note in registry**: Explain what happened
4. **Continue with your own files**

## 🎯 Best Practices Summary

| Do ✅ | Don't ❌ |
|-------|----------|
| Check registry before editing | Edit without checking |
| Claim files explicitly | Assume files are free |
| Commit only your files | Use `git add .` |
| Include agent ID in commits | Make anonymous commits |
| Update registry when done | Leave stale entries |
| Wait for blocked files | Force through conflicts |
| Read others' code for context | Modify others' claimed files |
| Document breaking changes | Change APIs silently |

## 🆘 Emergency Protocol

If you suspect you've caused a conflict:

1. **STOP all git operations**
2. **Run**: `git status` and `git diff`
3. **Document**: What you changed and why
4. **Do NOT push**: Wait for human review
5. **Update registry**: Mark issue as "NEEDS REVIEW"

Remember: **Coordination > Speed**. It's better to wait and work cleanly than to rush and cause conflicts that take hours to resolve.
