# Team Registry

> **Protocol**: Every Claude Code agent MUST register here before working. Read `.claude/skills/team-coordination.md` for full rules.

Last updated: 2025-12-30T00:00:00Z

---

## Active Agents

> **TTL Rule**: Claims expire after 4 hours. Stale claims (no activity for 2h) can be overridden.

| Agent ID | Task | Started | Last Active | Claimed Files |
|----------|------|---------|-------------|---------------|
| *none* | - | - | - | - |

---

## Completed (Pending Review)

| Agent ID | Task | Completed | Modified Files | Notes |
|----------|------|-----------|----------------|-------|
| *none* | - | - | - | - |

---

## Protected Files (DO NOT MODIFY)

> Files listed here are under active development by an agent. Do NOT modify unless you are the claiming agent.

*No protected files currently*

---

## Agent Notes & Communication

> Use this section to leave messages for other agents about breaking changes, dependencies, or coordination needs.

### Format:
```
**[Agent ID]** (timestamp): Message
```

### Messages:
*No messages*

---

## Conflict Log

> Document any conflicts or issues here for human review.

| Timestamp | Agent ID | Issue | Status |
|-----------|----------|-------|--------|
| *none* | - | - | - |

---

## Quick Reference

### To Register:
1. Add your row to "Active Agents"
2. Use format: `agent-{task-4chars}-{random-4digits}`
3. List files you'll modify in "Claimed Files"

### To Complete:
1. Move your row to "Completed (Pending Review)"
2. Keep your files listed
3. Add any notes for other agents

### Before Committing:
1. Check "Active Agents" - don't commit their files
2. Check "Protected Files" - these are off-limits
3. Only `git add` your specific files
4. Include your Agent ID in commit message

---

*This file is automatically managed by Claude Code agents following the team-coordination protocol.*
