# Demo Version Information

A separate **demo branch** has been created for user testing purposes.

## Quick Access

### Using NPM Scripts (Easiest)

```bash
# Start demo mode (switches branch, sets up env, starts server)
npm run demo

# Exit demo mode (returns to main branch, restores env)
npm run demo:exit
```

### Manual Access

```bash
# Switch to demo branch
git checkout demo-version

# View demo documentation
cat DEMO_README.md
cat DEMO_DEPLOYMENT.md

# Return to main
git checkout main
```

## What's Different in Demo Branch?

### Added Components
- `DemoBanner.tsx` - Persistent warning banner
- `DemoCredentials.tsx` - Login page with visible credentials
- `lib/demo/seed-data.ts` - Fictional data generator
- `scripts/seed-demo-data.sql` - Database seeding script

### Configuration Files
- `.env.demo` - Demo environment variables
- `DEMO_README.md` - User testing guide
- `DEMO_DEPLOYMENT.md` - Deployment instructions
- `scripts/start-demo.sh` - Automated demo startup
- `scripts/exit-demo.sh` - Exit demo and return to main

## Demo Accounts

Three pre-configured accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| Searcher | demo.searcher@easyco.demo | Demo2024! |
| Owner | demo.owner@easyco.demo | Demo2024! |
| Resident | demo.resident@easyco.demo | Demo2024! |

## Demo Data

- **8 fictional properties** across Belgian cities
- **Pre-filled user profiles** for each role
- **Sample conversations** and messages
- **Community events** and roommate data

## Security

**Safe for public testing:**
- Separate database (no production data)
- Demo-only email domain (@easyco.demo)
- Disabled payments, emails, SMS
- Public test credentials (documented)

## Deployment

### Quick Deploy to Vercel

```bash
git checkout demo-version
vercel --prod
```

Set environment variables in Vercel dashboard:
```
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=<demo_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<demo_key>
```

### Full Instructions

See `DEMO_DEPLOYMENT.md` in demo branch for complete deployment guide.

## Testing Scenarios

1. **As Searcher**: Browse properties, use filters, save favorites
2. **As Owner**: Manage listings, view dashboard, handle applications
3. **As Resident**: Community features, events, messaging

## Maintenance

The demo branch is maintained separately and includes:
- Fictional data that can be reset
- Demo-specific UI components
- Separate deployment configuration
- Testing documentation

## Switching Between Branches

```bash
# Production development
git checkout main

# Demo testing
git checkout demo-version

# Or use npm scripts
npm run demo          # Enter demo mode
npm run demo:exit     # Exit demo mode
```

## Important Notes

**Never merge demo branch into main**
- Demo branch contains test-specific code
- Keep branches separate for security
- Production should never show demo credentials

**Use demo branch only for:**
- User testing and feedback
- Investor demonstrations
- UI/UX showcases
- Feature previews

---

For complete documentation, switch to demo branch and read `DEMO_README.md`.
