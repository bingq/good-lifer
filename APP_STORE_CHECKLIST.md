# App Store Submission Checklist for Good Lifer

This document outlines all the steps and requirements for submitting Good Lifer to the Apple App Store.

## Pre-Submission Requirements

### 1. Apple Developer Account
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Verify your Apple ID has access to App Store Connect
- [ ] Set up two-factor authentication (required)

### 2. App Store Connect Setup
- [ ] Create new app in App Store Connect
- [ ] Fill in app information:
  - [ ] App Name: "Good Lifer"
  - [ ] Primary Language: English (U.S.)
  - [ ] Bundle ID: `space.manus.good.lifer.t20260102000426`
  - [ ] SKU: `good-lifer-001` (or your unique identifier)

### 3. App Information & Privacy

#### App Information
- [ ] **Subtitle** (30 characters max): "Track achievements, reflect privately"
- [ ] **Category**: Primary: Lifestyle, Secondary: Health & Fitness
- [ ] **Content Rights**: Confirm you have rights to all content
- [ ] **Age Rating**: 4+ (No objectionable content)

#### Privacy Policy
- [ ] Create privacy policy URL (required)
- [ ] Privacy policy must state:
  - All data is stored locally on device
  - No data collection or tracking
  - No third-party analytics
  - No user accounts required
- [ ] See `PRIVACY_POLICY.md` for template

#### App Privacy Details
- [ ] Data Collection: Select "No, we do not collect data from this app"
- [ ] Data Types: None (all data is local)
- [ ] Data Use: None
- [ ] Data Sharing: None
- [ ] Tracking: No tracking

### 4. App Store Listing

#### Screenshots (Required)
- [ ] **iPhone 6.7" Display** (iPhone 14 Pro Max, 15 Pro Max):
  - [ ] 1-10 screenshots (at least 1 required)
  - [ ] Recommended: 3-5 screenshots showing key features
- [ ] **iPhone 6.5" Display** (iPhone 11 Pro Max, XS Max):
  - [ ] 1-10 screenshots (optional but recommended)
- [ ] **iPhone 5.5" Display** (iPhone 8 Plus):
  - [ ] 1-10 screenshots (optional)
- [ ] **iPad Pro (12.9-inch)** (if supporting iPad):
  - [ ] 1-10 screenshots (optional)

#### App Preview Video (Optional but Recommended)
- [ ] Create 15-30 second video showcasing app features
- [ ] Upload in App Store Connect
- [ ] Same sizes as screenshots

#### Description
- [ ] **Name**: Good Lifer (30 characters max)
- [ ] **Subtitle**: Track achievements, reflect privately (30 characters max)
- [ ] **Description** (4000 characters max):
  ```
  Good Lifer is your personal wellness companion that helps you celebrate daily achievements while providing a safe, private space for emotional reflection.

  KEY FEATURES:
  • Daily Achievement Tracking - Log your accomplishments with categories like Study, Exercise, Reading, Work, and more
  • Private Tree Hole Journaling - A secure space for your thoughts, feelings, and reflections
  • Progress Summaries - View your achievements weekly, monthly, and yearly
  • Category-Based Organization - Track different areas of your life with color-coded categories
  • Offline-First Design - All data stored locally on your device, no internet required
  • Privacy-First - Your data never leaves your device

  Perfect for anyone looking to:
  - Build positive habits through achievement tracking
  - Maintain emotional balance with private journaling
  - Reflect on personal growth over time
  - Celebrate small wins and daily progress

  Good Lifer combines positive reinforcement with private reflection, helping you maintain perspective and build momentum in your personal growth journey.

  All your data is stored securely on your device. We don't collect, track, or share any information.
  ```

#### Keywords (100 characters max)
- [ ] Suggested: "wellness,achievement,tracking,journal,diary,habits,productivity,reflection,personal growth,mindfulness"

#### Support URL
- [ ] Provide support website or email
- [ ] Example: `mailto:support@goodlifer.app` or website URL

#### Marketing URL (Optional)
- [ ] Website URL if available

#### Promotional Text (170 characters max, optional)
- [ ] Example: "Start your journey of personal growth today. Track achievements, reflect privately, and celebrate your progress with Good Lifer."

### 5. App Icons and Assets

#### App Icon
- [ ] Verify `assets/images/icon.png` exists (1024x1024px)
- [ ] Icon must:
  - Be 1024x1024 pixels
  - PNG format
  - No transparency
  - No rounded corners (Apple adds them)
  - No text or UI elements
  - Follow Apple's Human Interface Guidelines

#### Screenshots
- [ ] Generate screenshots from actual device or simulator
- [ ] Recommended screenshots:
  1. Home screen with achievements
  2. Achievement entry modal
  3. Tree Hole journaling screen
  4. Summary view (weekly/monthly)
  5. Settings screen

### 6. Build Configuration

#### Version Management
- [ ] Update version in `app.config.ts`:
  - `version`: "1.0.0" (user-facing version)
  - `ios.buildNumber`: "1" (build number, increment for each submission)

#### Build Requirements
- [ ] Minimum iOS version: 13.4 (configured in app.config.ts)
- [ ] Test on physical iOS device
- [ ] Test on different iOS versions (if possible)
- [ ] Test on iPad (if supportsTablet: true)

### 7. Testing & Quality Assurance

#### Functionality Testing
- [ ] Test all core features:
  - [ ] Log achievements
  - [ ] Edit/delete achievements
  - [ ] Tree Hole journaling
  - [ ] Summary views (weekly/monthly/yearly)
  - [ ] Data export
  - [ ] Clear data
- [ ] Test edge cases:
  - [ ] Empty states
  - [ ] Large amounts of data
  - [ ] App backgrounding/foregrounding
  - [ ] Device rotation (if supported)

#### Performance Testing
- [ ] App launches quickly (< 3 seconds)
- [ ] Smooth scrolling and animations
- [ ] No memory leaks
- [ ] Battery usage is reasonable

#### Accessibility
- [ ] Test with VoiceOver
- [ ] Verify minimum touch targets (44x44px)
- [ ] Test with Dynamic Type
- [ ] Color contrast meets WCAG AA standards

### 8. Build and Upload

#### Create Production Build
```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS Build
eas build:configure

# Build for iOS App Store
eas build --platform ios --profile production
```

#### Alternative: Local Build (Requires macOS)
```bash
# Prebuild native code
npx expo prebuild --platform ios

# Open in Xcode
open ios/good-lifer.xcworkspace

# Archive and upload from Xcode
# Product > Archive > Distribute App > App Store Connect
```

#### Upload to App Store Connect
- [ ] Upload build using:
  - EAS Build (recommended)
  - Xcode Organizer
  - Transporter app
- [ ] Wait for processing (usually 10-30 minutes)

### 9. App Store Connect Submission

#### Version Information
- [ ] Select uploaded build
- [ ] Add "What's New in This Version":
  ```
  Welcome to Good Lifer! The first version includes:
  - Daily achievement tracking
  - Private tree hole journaling
  - Weekly, monthly, and yearly summaries
  - Category-based organization
  - Offline-first design
  - Complete privacy - all data stays on your device
  ```

#### App Review Information
- [ ] **Contact Information**:
  - First Name, Last Name
  - Phone Number
  - Email Address
- [ ] **Demo Account** (if applicable): N/A (no accounts required)
- [ ] **Notes** (optional):
  ```
  Good Lifer is an offline-first app. All data is stored locally on the device using AsyncStorage. No user accounts, authentication, or internet connection is required. The app does not collect, track, or share any user data.
  ```

#### Export Compliance
- [ ] **Uses Encryption**: No (or Yes if using HTTPS)
- [ ] **Uses Non-Exempt Encryption**: No (configured in app.config.ts)

#### Content Rights
- [ ] Confirm you have rights to all content
- [ ] No third-party content requiring attribution

### 10. Submit for Review

#### Final Checks
- [ ] All required fields completed
- [ ] Screenshots uploaded
- [ ] Privacy policy URL provided
- [ ] Build uploaded and processed
- [ ] App information accurate
- [ ] Pricing and availability set

#### Submission
- [ ] Click "Submit for Review"
- [ ] Review typically takes 24-48 hours
- [ ] Monitor App Store Connect for status updates

### 11. Post-Submission

#### Monitor Review Status
- [ ] Check App Store Connect regularly
- [ ] Respond to any review questions promptly
- [ ] If rejected, address issues and resubmit

#### Common Rejection Reasons
- Missing privacy policy
- Missing or incorrect privacy descriptions
- App crashes or bugs
- Misleading app description
- Missing required information

#### After Approval
- [ ] App will be available in App Store
- [ ] Monitor user reviews and ratings
- [ ] Plan for updates and improvements

## Additional Resources

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Expo App Store Submission Guide](https://docs.expo.dev/submit/ios/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

## Version History

- **1.0.0** (Build 1) - Initial release
  - Daily achievement tracking
  - Tree Hole journaling
  - Summary views
  - Local data storage

