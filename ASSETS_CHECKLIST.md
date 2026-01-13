# Assets Checklist for App Store Submission

This document verifies all required assets for iOS App Store submission.

## Required Assets

### 1. App Icon
- [ ] **File**: `assets/images/icon.png`
- [ ] **Size**: 1024x1024 pixels
- [ ] **Format**: PNG
- [ ] **Requirements**:
  - No transparency
  - No rounded corners (Apple adds them automatically)
  - No text or UI elements
  - Square format
  - High quality, sharp edges
  - Follows Apple Human Interface Guidelines

**Current Status**: ✅ File exists at `assets/images/icon.png`

**Action Required**: Verify the icon is 1024x1024px and meets all requirements above.

### 2. Splash Screen
- [ ] **File**: `assets/images/splash-icon.png`
- [ ] **Configuration**: Set in `app.config.ts` under `expo-splash-screen` plugin
- [ ] **Requirements**:
  - Appropriate size for splash screen
  - Matches app branding
  - Works in light and dark mode

**Current Status**: ✅ File exists and configured in `app.config.ts`

### 3. App Store Screenshots

#### iPhone 6.7" Display (Required)
- [ ] **Devices**: iPhone 14 Pro Max, 15 Pro Max
- [ ] **Resolution**: 1290 x 2796 pixels
- [ ] **Required**: At least 1 screenshot
- [ ] **Recommended**: 3-5 screenshots showing key features

**Screenshot Suggestions**:
1. Home screen with achievements
2. Achievement entry modal
3. Tree Hole journaling screen
4. Summary view (weekly/monthly)
5. Settings screen

#### iPhone 6.5" Display (Optional but Recommended)
- [ ] **Devices**: iPhone 11 Pro Max, XS Max
- [ ] **Resolution**: 1242 x 2688 pixels
- [ ] **Required**: Optional
- [ ] **Recommended**: Same screenshots as 6.7" display

#### iPhone 5.5" Display (Optional)
- [ ] **Devices**: iPhone 8 Plus
- [ ] **Resolution**: 1242 x 2208 pixels
- [ ] **Required**: Optional

#### iPad Pro 12.9" (Optional - if supporting iPad)
- [ ] **Devices**: iPad Pro 12.9-inch
- [ ] **Resolution**: 2048 x 2732 pixels
- [ ] **Required**: Optional (only if `supportsTablet: true`)

**Current Status**: ⚠️ Screenshots need to be generated

**How to Generate Screenshots**:

1. **Using iOS Simulator**:
   ```bash
   # Start app in simulator
   pnpm ios
   
   # In simulator:
   # - Navigate to each screen
   # - Cmd + S to save screenshot
   # - Screenshots saved to Desktop
   ```

2. **Using Physical Device**:
   - Take screenshots on device
   - Transfer to Mac
   - Resize if needed using Preview or image editor

3. **Using Xcode**:
   - Run app in simulator
   - Use Xcode's screenshot capture tool
   - Export at required resolutions

### 4. App Preview Video (Optional but Recommended)

- [ ] **Duration**: 15-30 seconds
- [ ] **Format**: MP4 or MOV
- [ ] **Resolutions**: Same as screenshots
- [ ] **Content**: Showcase key features and user flow

**Current Status**: ⚠️ Not created (optional)

### 5. Privacy Policy

- [ ] **File**: `PRIVACY_POLICY.md` (created)
- [ ] **URL**: Must be hosted publicly accessible
- [ ] **Requirements**:
  - Accessible via HTTPS
  - Clearly states data collection practices
  - Explains how data is used
  - Contact information included

**Current Status**: ✅ Document created at `PRIVACY_POLICY.md`

**Action Required**: 
- Host privacy policy on a public URL
- Update App Store Connect with the URL

## Asset Verification Steps

### Step 1: Verify App Icon

```bash
# Check icon dimensions (requires ImageMagick or similar)
identify assets/images/icon.png

# Should show: 1024x1024
```

**Manual Check**:
- Open `assets/images/icon.png` in image editor
- Verify dimensions are 1024x1024
- Check for transparency (should be none)
- Verify no text or UI elements
- Ensure high quality

### Step 2: Generate Screenshots

1. **Prepare App State**:
   - Add sample achievements
   - Create sample tree hole entry
   - Ensure app looks polished

2. **Capture Screenshots**:
   - Use iOS Simulator or physical device
   - Navigate through key screens
   - Capture at highest resolution
   - Save with descriptive names

3. **Organize Screenshots**:
   ```
   screenshots/
     iphone-6.7/
       screenshot-1-home.png
       screenshot-2-achievement.png
       screenshot-3-tree-hole.png
       screenshot-4-summary.png
       screenshot-5-settings.png
   ```

### Step 3: Optimize Assets

- [ ] Compress screenshots if needed (but maintain quality)
- [ ] Verify all images are in correct format (PNG for icons, PNG/JPG for screenshots)
- [ ] Check file sizes (icons should be < 500KB, screenshots < 5MB each)

## Current Asset Status

| Asset | Status | Location | Action Required |
|-------|--------|----------|-----------------|
| App Icon (1024x1024) | ✅ Exists | `assets/images/icon.png` | Verify dimensions |
| Splash Screen | ✅ Configured | `assets/images/splash-icon.png` | None |
| Screenshots (6.7") | ⚠️ Missing | N/A | Generate |
| Screenshots (6.5") | ⚠️ Optional | N/A | Generate if desired |
| Screenshots (iPad) | ⚠️ Optional | N/A | Generate if supporting iPad |
| App Preview Video | ⚠️ Optional | N/A | Create if desired |
| Privacy Policy | ✅ Created | `PRIVACY_POLICY.md` | Host publicly |

## Quick Commands

### Generate Screenshots from Simulator

```bash
# Start app
pnpm ios

# In simulator, navigate to screens and press:
# Cmd + S (saves to Desktop)

# Or use command line:
xcrun simctl io booted screenshot ~/Desktop/screenshot.png
```

### Verify Icon Dimensions

```bash
# Using sips (macOS built-in)
sips -g pixelWidth -g pixelHeight assets/images/icon.png

# Should output:
# pixelWidth: 1024
# pixelHeight: 1024
```

## Next Steps

1. ✅ Verify app icon is 1024x1024px
2. ⚠️ Generate App Store screenshots
3. ⚠️ Host privacy policy publicly
4. ⚠️ (Optional) Create app preview video
5. ✅ Upload all assets to App Store Connect

## Resources

- [Apple App Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [App Store Screenshot Requirements](https://developer.apple.com/app-store/product-page/)
- [Expo Asset Guidelines](https://docs.expo.dev/guides/app-icons/)

