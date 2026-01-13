# Build Instructions for Good Lifer iOS App

This guide explains how to build and submit Good Lifer to the App Store.

## Prerequisites

1. **Apple Developer Account**
   - Enroll in Apple Developer Program ($99/year)
   - Access to App Store Connect

2. **Development Environment**
   - macOS (required for iOS builds)
   - Xcode (latest version recommended)
   - Node.js and pnpm installed
   - Expo CLI or EAS CLI

3. **Expo Account**
   - Create free account at [expo.dev](https://expo.dev)
   - Install EAS CLI: `npm install -g eas-cli`

## Build Methods

### Method 1: EAS Build (Recommended)

EAS Build is Expo's cloud-based build service. It's the easiest way to build for iOS without needing a Mac.

#### Setup

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS Build**
   ```bash
   eas build:configure
   ```
   This creates/updates `eas.json` with build profiles.

#### Build for App Store

```bash
# Build for iOS App Store
pnpm build:ios

# Or directly:
eas build --platform ios --profile production
```

#### Build Process

1. EAS will prompt for:
   - Apple ID credentials
   - App Store Connect API key (optional, recommended)
   - Distribution certificate (auto-generated if needed)

2. Build runs in the cloud (typically 10-20 minutes)

3. Download the `.ipa` file when complete

4. Upload to App Store Connect:
   ```bash
   pnpm submit:ios
   # Or: eas submit --platform ios
   ```

### Method 2: Local Build (Requires macOS)

If you have a Mac, you can build locally using Xcode.

#### Setup

1. **Prebuild Native Code**
   ```bash
   pnpm prebuild:ios
   ```
   This generates the `ios/` folder with native iOS project.

2. **Open in Xcode**
   ```bash
   open ios/good-lifer.xcworkspace
   ```
   ⚠️ Open `.xcworkspace`, not `.xcodeproj`

#### Configure Signing

1. In Xcode, select the project in navigator
2. Select "good-lifer" target
3. Go to "Signing & Capabilities"
4. Select your Team
5. Xcode will automatically manage certificates

#### Build and Archive

1. **Select Generic iOS Device** (not simulator) in device selector
2. **Product > Archive**
3. Wait for archive to complete
4. **Window > Organizer** opens automatically

#### Upload to App Store

1. In Organizer, select your archive
2. Click **Distribute App**
3. Select **App Store Connect**
4. Follow the wizard:
   - Choose distribution method: **Upload**
   - Select distribution options (defaults are fine)
   - Review and upload

### Method 3: Local Build with Expo CLI

```bash
# Prebuild
pnpm prebuild:ios

# Build release
pnpm build:ios:local

# This opens Xcode where you can archive
```

## Version Management

### Update Version Numbers

Before each build, update version in `app.config.ts`:

```typescript
version: "1.0.0",        // User-facing version (e.g., 1.0.0, 1.0.1, 1.1.0)
ios: {
  buildNumber: "1",      // Build number (increment for each submission: 1, 2, 3...)
}
```

**Version vs Build Number:**
- **Version** (CFBundleShortVersionString): What users see (1.0.0, 1.0.1, etc.)
- **Build Number** (CFBundleVersion): Internal counter (1, 2, 3, etc.)

**Best Practice:**
- Increment build number for each App Store submission
- Increment version when releasing new features

### Example Version History

```
Version 1.0.0, Build 1  - Initial release
Version 1.0.0, Build 2  - Bug fix resubmission
Version 1.0.1, Build 3  - Minor update
Version 1.1.0, Build 4  - Feature update
```

## Testing Before Submission

### Test on Device

1. **Development Build**
   ```bash
   eas build --platform ios --profile development
   ```

2. **Install on device** via TestFlight or direct install

3. **Test all features:**
   - Log achievements
   - Edit/delete achievements
   - Tree Hole journaling
   - Summary views
   - Data export
   - Clear data
   - App backgrounding/foregrounding

### TestFlight (Recommended)

1. Upload build to App Store Connect
2. Add to TestFlight
3. Invite internal testers
4. Test for 1-2 days before public release

## Common Issues and Solutions

### Issue: "No bundle identifier found"

**Solution:** Ensure `ios.bundleIdentifier` is set in `app.config.ts`

### Issue: Code signing errors

**Solution:**
- Verify Apple Developer account is active
- Check team selection in Xcode
- Ensure certificates are valid
- Use EAS Build (handles signing automatically)

### Issue: Build fails with "Module not found"

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
pnpm install
npx expo prebuild --clean
```

### Issue: App crashes on launch

**Solution:**
- Check console logs in Xcode
- Verify all dependencies are installed
- Test in development build first
- Check for missing assets

## App Store Connect Setup

### Create App Record

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. **My Apps > +** (Create new app)
3. Fill in:
   - **Platform**: iOS
   - **Name**: Good Lifer
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: `space.manus.good.lifer.t20260102000426`
   - **SKU**: `good-lifer-001` (unique identifier)

### Upload Build

1. Go to **App Store > iOS App**
2. Select version (or create new)
3. **Build** section > **+** > Select your uploaded build
4. Wait for processing (10-30 minutes)

### Complete App Information

See `APP_STORE_CHECKLIST.md` for complete list of required information.

## Submission Checklist

Before submitting:

- [ ] Version and build number updated
- [ ] All features tested on physical device
- [ ] Screenshots prepared
- [ ] Privacy policy URL ready
- [ ] App description written
- [ ] Keywords selected
- [ ] Support URL provided
- [ ] Build uploaded and processed
- [ ] All App Store Connect fields completed

## Post-Submission

### Monitor Review

1. Check App Store Connect daily
2. Typical review time: 24-48 hours
3. Respond promptly to any questions

### If Rejected

1. Read rejection reason carefully
2. Address all issues
3. Update app if needed
4. Resubmit with explanation

### After Approval

1. App goes live automatically (if set to auto-release)
2. Monitor user reviews
3. Plan for updates

## Resources

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo Submission Guide](https://docs.expo.dev/submit/ios/)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

## Quick Reference Commands

```bash
# Development
pnpm ios                    # Start development server
pnpm dev                    # Start dev server + backend

# Building
pnpm build:ios              # EAS build for App Store
pnpm prebuild:ios           # Generate native iOS project
pnpm build:ios:local        # Local build (requires Mac)

# Submission
pnpm submit:ios             # Submit to App Store Connect

# Testing
eas build --platform ios --profile development  # Test build
```

