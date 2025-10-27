# EasyCo Demo Version 🎭

This is a **demo/test version** of the EasyCo coliving platform, designed for user testing and feedback collection without exposing production features or real data.

## 🎯 Purpose

- Showcase the app's UI/UX to potential users and investors
- Collect feedback on the user experience
- Test the application flow with fictional data
- Demonstrate key features without revealing business logic

## ⚠️ Important Notes

- **All data is fictional** - Properties, users, messages are fake
- **No real transactions** - Payments and bookings are disabled
- **Reset regularly** - Data may be cleared periodically
- **Not for production use** - This is a testing environment only

## 🚀 Quick Start

### Demo Accounts

Three pre-configured accounts are available to test different user roles:

#### 1. Searcher Account
```
Email: demo.searcher@easyco.demo
Password: Demo2024!
```
**Test as:** Someone looking for a coliving space
**Features:** Browse properties, save favorites, send messages, complete profile

#### 2. Owner Account
```
Email: demo.owner@easyco.demo
Password: Demo2024!
```
**Test as:** Property owner managing listings
**Features:** Add/edit properties, view applications, manage listings, owner dashboard

#### 3. Resident Account
```
Email: demo.resident@easyco.demo
Password: Demo2024!
```
**Test as:** Current resident in a coliving
**Features:** Community page, roommate interactions, events, messaging

## 🎨 Demo Features

### Included in Demo:
- ✅ Full UI/UX showcase
- ✅ Navigation and routing
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Search and filtering (with fake properties)
- ✅ Profile management
- ✅ Dashboard for all 3 roles
- ✅ Messaging interface (UI only)
- ✅ Community features (UI only)
- ✅ Multilingual support (FR, EN, NL, DE)

### Disabled in Demo:
- ❌ Real payment processing
- ❌ Email/SMS notifications
- ❌ Real property bookings
- ❌ Data persistence (may reset)
- ❌ File uploads to production storage
- ❌ Integration with external services

## 📦 Demo Data

The demo includes:
- **8 fictional properties** across Belgian cities
- **3 pre-filled user profiles** (one per role)
- **Sample conversations** in the messaging system
- **Community events** and roommate profiles
- **Realistic property details** (prices, descriptions, locations)

## 🔧 Setup for Testing

### Option 1: Use Deployed Demo
Visit: `https://demo.easyco.app` (or your demo URL)

### Option 2: Run Locally
```bash
# Clone the demo branch
git clone -b demo-version https://github.com/yourusername/easyco-onboarding.git
cd easyco-onboarding

# Install dependencies
npm install

# Copy demo environment
cp .env.demo .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🧪 Testing Scenarios

### Scenario 1: As a Searcher
1. Login with searcher account
2. Complete onboarding flow
3. Browse properties with filters
4. Save favorite properties
5. Send messages to property owners
6. View and edit profile

### Scenario 2: As an Owner
1. Login with owner account
2. Add a new property listing
3. View dashboard statistics
4. Manage existing properties
5. Check applications (UI showcase)
6. Update profile and payment info

### Scenario 3: As a Resident
1. Login with resident account
2. View community page
3. See roommate profiles
4. Check upcoming events
5. Use messaging system
6. Update personal profile

## 🎯 What to Test

### UI/UX Feedback
- [ ] Is the navigation intuitive?
- [ ] Are the colors and design appealing?
- [ ] Is the mobile experience smooth?
- [ ] Are buttons and actions clear?
- [ ] Is the text readable and understandable?

### Functionality Feedback
- [ ] Do search filters work as expected?
- [ ] Is the property browsing experience good?
- [ ] Are dashboards informative?
- [ ] Is the onboarding process clear?
- [ ] Do forms validate properly?

### Overall Experience
- [ ] Would you use this platform?
- [ ] What features are missing?
- [ ] What would you improve?
- [ ] Any bugs or issues encountered?

## 📝 Providing Feedback

Please send your feedback to: feedback@easyco.app

Or create an issue on GitHub with:
- Screenshots (if applicable)
- Steps to reproduce (for bugs)
- Suggestions for improvements
- General comments

## 🔐 Security Notes

- Demo accounts are public and shared
- Don't enter real personal information
- Passwords are intentionally simple for testing
- Data may be visible to other testers

## 🚫 Limitations

### Known Issues
- Real-time messaging requires backend (not fully functional)
- File uploads don't persist
- Some animations may lag on older devices
- Demo data resets every 24 hours

### Not Implemented (Demo Only)
- Payment gateway integration
- Email verification
- SMS notifications
- Photo uploads to cloud storage
- Real property availability checks

## 📞 Support

For questions about the demo:
- Email: demo-support@easyco.app
- Documentation: https://docs.easyco.app

## 🔄 Demo Data Reset

Demo data is automatically reset:
- **Daily** at 02:00 UTC
- **On-demand** when requested
- **After major updates** to the platform

After a reset:
- All user-generated data is cleared
- Demo accounts are recreated
- Sample properties are reseeded

## 🎉 Next Steps

Interested in the full version?
- Contact us: hello@easyco.app
- Request early access: https://easyco.app/early-access
- Follow development: https://twitter.com/easycoapp

---

**Thank you for testing EasyCo!** 🏠✨

Your feedback helps us build a better coliving platform for everyone.
