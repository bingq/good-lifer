// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

// Bundle ID - use reverse domain notation (e.g., com.company.appname)
const bundleId = "com.bing.goodlifer";
// Deep link scheme - simpler format based on app name
const schemeFromBundleId = "goodlifer";

const env = {
  // App branding - update these values directly (do not use env vars)
  appName: "Good Lifer",
  appSlug: "good-lifer",
  // S3 URL of the app logo - set this to the URL returned by generate_image when creating custom logo
  // Leave empty to use the default icon from assets/images/icon.png
  logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663269033029/iCcoRTYRgPFLvepW.png",
  scheme: schemeFromBundleId,
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "0.4",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
    // buildNumber is managed remotely when appVersionSource is "remote"
    // App Store information
    infoPlist: {
      // Privacy descriptions required by App Store
      NSUserTrackingUsageDescription: "Good Lifer does not track users. This permission is not used.",
      NSMicrophoneUsageDescription: "Good Lifer does not use the microphone. This permission is not used.",
      NSCameraUsageDescription: "Good Lifer does not use the camera. This permission is not used.",
      NSPhotoLibraryUsageDescription: "Good Lifer does not access your photo library. This permission is not used.",
      // Required for App Store
      ITSAppUsesNonExemptEncryption: false, // Set to true if you use encryption beyond standard HTTPS
    },
    // App Store category
    category: "lifestyle",
    // Minimum iOS version
    deploymentTarget: "15.1",
    // App Store configuration
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS"],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: env.scheme,
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-audio",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
      },
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "15.1",
          useFrameworks: "static",
        },
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "2cba94e2-a013-44db-8071-f38be4889eb8",
    },
  },
};

export default config;
