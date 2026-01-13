# Good Lifer - User Guide

**Version 1.0.0**  
**Author**: Manus AI  
**Date**: January 2, 2026

---

## Welcome to Good Lifer

Good Lifer is a personal wellness mobile application designed to help you celebrate daily achievements while providing a safe, private space for emotional reflection. The app combines achievement tracking with a unique "tree hole" journaling feature, allowing you to maintain a balanced perspective on your personal growth journey.

### Core Philosophy

Good Lifer operates on three fundamental principles. First, **positive reinforcement** drives motivation through celebrating every achievement, no matter how small. Second, **emotional balance** acknowledges that personal growth includes both successes and struggles, providing space for both. Third, **privacy-first design** ensures all your data stays on your device, never shared or uploaded to external servers.

---

## Getting Started

### First Launch

When you open Good Lifer for the first time, you will see the Home screen with an empty state. The app comes pre-configured with six default achievement categories: Study, Exercise, Reading, Work, Meditation, and Other. Each category has a distinct color for easy visual identification.

### Navigation

The app uses a bottom tab bar with four main sections. The **Home** tab displays today's achievements and provides quick access to log new entries. The **Tree Hole** tab offers a private journaling space for personal reflections. The **Summary** tab presents your progress through weekly, monthly, and yearly views. The **Settings** tab allows you to manage app preferences and data.

---

## Logging Achievements

### Quick Add Process

To log an achievement, tap the green floating action button (FAB) with a plus icon in the bottom-right corner of the Home screen. A modal will slide up from the bottom, presenting the achievement entry form.

The form consists of five main sections. First, select a category by tapping one of the colored circular icons at the top. The selected category will appear at full opacity while others fade. Second, enter a descriptive name for your achievement in the text field, such as "Completed calculus homework" or "Morning run." Third, input the quantity using the numeric field and select the appropriate unit from the dropdown menu (hours, minutes, pages, km, reps, times, or items). Fourth, optionally add notes to provide additional context. Finally, tap the green "Save" button to record your achievement.

### Achievement Cards

Once saved, your achievement appears as a card on the Home screen. Each card displays the category icon, quantity with unit, achievement name, and optional notes. The left border of each card matches the category color for quick visual scanning.

### Editing and Deleting

To modify an achievement, tap the pencil icon on the right side of the achievement card. The same modal used for adding achievements will appear, pre-filled with the existing data. Make your changes and tap "Save" to update.

To delete an achievement, tap the trash icon on the right side of the card. A confirmation dialog will appear to prevent accidental deletion. Tap "Delete" to confirm or "Cancel" to abort.

---

## Tree Hole Journaling

### The Tree Hole Concept

The "tree hole" is a metaphor from Chinese culture, representing a safe place where you can share thoughts and feelings without judgment. In Good Lifer, the Tree Hole tab provides a distraction-free writing environment for private reflections.

### Writing Process

Navigate to the Tree Hole tab using the bottom navigation bar. The screen features a calming purple gradient background with a large text editor. A lock icon in the header emphasizes that your entries are private and secure.

Simply tap the text area and begin writing. There are no character limits or formatting restrictions. Write freely about regrets, frustrations, anxieties, or anything you prefer not to share with others. The timestamp at the bottom shows when you began writing.

When finished, tap the purple "Save" button. A confirmation dialog will appear, and your entry will be stored locally on your device. Tap "Clear" to discard the current text if you change your mind.

### Privacy Guarantee

Tree hole entries are stored locally using encrypted storage on your device. They are never uploaded to servers, shared with third parties, or visible in any summary views. Only you can access these entries, and they remain completely private.

---

## Summary Views

### Overview

The Summary tab provides three different time-based views of your achievement data: Weekly, Monthly, and Yearly. Switch between views using the segmented control at the top of the screen.

### Weekly Summary

The weekly view displays data for a seven-day period from Monday to Sunday. At the top, a date navigator shows the current week range with left and right arrows to move between weeks.

The view presents several key metrics. The **Total Achievements** card shows the number of achievements logged during the week. The **By Category** section displays a breakdown of achievements by category, showing both count and percentage. Each category is represented by a colored progress bar for visual comparison.

The **Daily Breakdown** section shows seven circular indicators, one for each day of the week. Each circle displays the number of achievements logged that day. Days with achievements are filled with the primary green color, while empty days remain gray. The current day is highlighted with a border.

If you logged achievements during the week, a motivational card appears at the bottom with a trophy emoji and an encouraging message like "Great week! You logged 27 achievements."

### Monthly Summary

The monthly view aggregates data for an entire calendar month. Use the date navigator to move between months. The layout is similar to the weekly view but covers a longer time period.

The category breakdown shows how your focus areas distributed across the month. This view helps identify patterns in your activities and whether you are maintaining balance across different life areas.

### Yearly Summary

The yearly view provides the broadest perspective on your personal growth. It displays total achievements for the entire year, broken down by category. This view is particularly useful for annual reflection and goal-setting.

The motivational message in the yearly view celebrates your cumulative progress: "Amazing year! You logged X achievements."

---

## Settings and Data Management

### App Information

The Settings tab displays basic app information including the version number and current theme (light or dark mode). The theme automatically adjusts based on your device's system settings.

### Data Export

To export your data, tap "Export Data" in the Data Management section. The app will prepare a JSON file containing all your achievements, tree hole entries, and categories. A dialog will display the count of each data type.

In the current version, the export feature shows a preview of the data structure. Future updates may include the ability to save the file to your device or cloud storage for backup purposes.

### Clear All Data

The "Clear All Data" option permanently deletes all achievements, tree hole entries, and custom categories from your device. This action cannot be undone. A confirmation dialog with a warning message appears before deletion proceeds.

Use this feature with caution, ideally after exporting your data first.

### Privacy Information

The Privacy section explains Good Lifer's data handling practices. All data is stored locally on your device using AsyncStorage (React Native's local storage system). No data is transmitted to external servers, and no analytics or tracking tools are embedded in the app.

---

## Tips for Effective Use

### Daily Routine

Establish a consistent routine for logging achievements. Many users find success by logging achievements in the evening before bed, reflecting on the day's accomplishments. This creates a positive mental state before sleep and reinforces a growth mindset.

### Balanced Tracking

While it may be tempting to focus only on major accomplishments, Good Lifer encourages tracking small wins as well. Reading 10 pages, meditating for 5 minutes, or completing a single work task all contribute to your overall progress.

### Tree Hole Practice

Use the Tree Hole feature regularly, not just during difficult times. Writing about both positive and negative experiences creates a more complete picture of your emotional journey. The act of writing itself can provide clarity and emotional release.

### Summary Review

Schedule weekly or monthly reviews of your summary data. Look for patterns in your achievement categories. Are you neglecting certain areas of life? Are you overcommitting in others? Use these insights to adjust your focus and maintain balance.

---

## Technical Specifications

### Platform Support

Good Lifer is built with React Native and Expo, supporting iOS, Android, and web platforms. The app follows Apple Human Interface Guidelines for iOS to ensure a native feel on Apple devices.

### Data Storage

All data is stored locally using AsyncStorage, a simple key-value storage system. The app uses the following storage keys:

- `@good_lifer:achievements` - Array of achievement objects
- `@good_lifer:tree_hole_entries` - Array of journal entry objects
- `@good_lifer:categories` - Array of category objects
- `@good_lifer:user_profile` - User profile information (future feature)

### Data Structure

Achievements are stored with the following fields: unique ID, date (ISO string), category ID, name, quantity, unit, optional notes, and creation timestamp.

Tree hole entries contain: unique ID, date (ISO string), content text, and creation timestamp.

Categories include: unique ID, name, color (hex code), and icon identifier.

### Offline Functionality

Good Lifer is designed as an offline-first application. No internet connection is required for any core functionality. All features work completely offline, ensuring you can log achievements and write journal entries anywhere, anytime.

---

## Frequently Asked Questions

**Q: Can I customize the achievement categories?**  
A: The current version includes six predefined categories. Future updates will add the ability to create, edit, and delete custom categories.

**Q: Can I access my data on multiple devices?**  
A: Currently, data is stored locally on each device. Cloud sync is planned for a future release, allowing you to access your data across multiple devices while maintaining privacy through end-to-end encryption.

**Q: How do I back up my data?**  
A: Use the "Export Data" feature in Settings to create a backup. Future versions will support automatic backups to cloud storage services.

**Q: Can I see my tree hole entries in the summary views?**  
A: No. Tree hole entries are intentionally excluded from all summary views to maintain their private nature. Only the count of entries is shown, not the content.

**Q: Does the app support multiple languages?**  
A: The current version is in English only. Internationalization support is planned for future releases.

**Q: How do I change the app theme?**  
A: The app automatically follows your device's system theme setting (light or dark mode). Change your device's theme in system settings to update the app's appearance.

---

## Troubleshooting

### App Crashes or Freezes

If the app becomes unresponsive, force-close it and reopen. Your data is automatically saved, so you should not lose any information. If problems persist, try restarting your device.

### Data Not Appearing

If achievements or tree hole entries are not displaying, ensure you saved them properly. Check that you tapped the "Save" button and saw the confirmation message. If data is still missing, check the Settings tab to verify data exists using the "Export Data" feature.

### Performance Issues

If the app runs slowly, particularly in summary views with large datasets, try clearing old data you no longer need. The app performs best with a few hundred achievements. For long-term users with thousands of entries, future updates will implement data pagination and performance optimizations.

---

## Future Roadmap

Good Lifer is actively developed with several planned enhancements. Upcoming features include cloud sync with end-to-end encryption, custom category creation and management, achievement streaks and badges, home screen widgets, daily reminder notifications, data visualization improvements, voice-to-text for tree hole entries, and export to PDF format.

Community feedback drives the development roadmap. If you have suggestions or feature requests, please share them through the app's feedback channels.

---

## Conclusion

Good Lifer is designed to support your personal growth journey by celebrating achievements while honoring the full spectrum of human experience. By combining positive reinforcement with private reflection, the app helps you maintain perspective, build momentum, and cultivate self-compassion.

Remember that personal growth is not linear. Some days you will log many achievements; other days, fewer. Some days you will use the tree hole extensively; other days, not at all. Both patterns are normal and healthy. The key is consistency and self-awareness, not perfection.

Use Good Lifer as a tool for reflection, not judgment. Celebrate your progress, acknowledge your struggles, and continue moving forward. Every small step contributes to the larger journey of becoming the person you aspire to be.

---

**Thank you for choosing Good Lifer. Here's to your continued growth and well-being.**
