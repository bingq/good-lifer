# Good Lifer - Mobile App Interface Design

## Design Philosophy

Good Lifer is a **mobile-first iOS app** designed for **portrait orientation (9:16)** and **one-handed usage**. The app celebrates daily achievements while providing a safe, private space for emotional reflection. The design follows **Apple Human Interface Guidelines (HIG)** to feel like a native first-party iOS app.

## Screen List

### 1. Home Screen (Today's Achievements)
**Primary Content**:
- Date display with personalized greeting based on time of day
- List of today's logged achievements (card-based)
- Quick stats showing total achievements logged today
- Floating action button (FAB) for quick entry

**Functionality**:
- View all achievements logged today
- Tap achievement card to view details
- Swipe card left to reveal edit/delete options
- Tap FAB to open quick-add modal

### 2. Quick Add Achievement Modal
**Primary Content**:
- Category selector (horizontal scrollable icons)
- Achievement name input field
- Quantity input with unit selector
- Optional notes field
- Save button

**Functionality**:
- Select category from predefined list (Study, Exercise, Reading, Work, Meditation, Other)
- Enter achievement description
- Input quantity with appropriate unit (hours, pages, km, reps, etc.)
- Add optional notes
- Save to local database

### 3. Tree Hole Screen (Private Journal)
**Primary Content**:
- Full-screen text editor with minimal UI
- Privacy indicator (lock icon)
- Timestamp (subtle, bottom)
- Voice-to-text button
- Save button

**Functionality**:
- Write private reflections without character limit
- Auto-save drafts
- Voice-to-text input
- Entries stored locally with encryption
- No sharing or export (emphasizes privacy)

### 4. Summary Screen (Weekly View - Default)
**Primary Content**:
- Week selector with left/right navigation
- Horizontal bar chart showing category breakdown
- 7 daily summary cards (Mon-Sun) with achievement counts
- Motivational insight card
- Tab switcher (Weekly / Monthly / Yearly)

**Functionality**:
- Navigate between weeks
- View category distribution
- Tap day card to see that day's details
- Switch to monthly or yearly view

### 5. Summary Screen (Monthly View)
**Primary Content**:
- Month selector (calendar picker)
- Calendar heatmap showing activity intensity
- Category totals table
- Monthly trend chart
- Comparison with previous month

**Functionality**:
- Navigate between months
- Tap calendar day to see details
- View category trends over time
- Compare with previous periods

### 6. Summary Screen (Yearly View)
**Primary Content**:
- Year selector
- Large category total numbers
- Monthly breakdown (small multiples)
- Yearly milestones and achievements
- Year-over-year comparison

**Functionality**:
- Navigate between years
- View long-term progress
- Celebrate milestones
- Reflect on annual growth

### 7. Settings Screen
**Primary Content**:
- Profile section (name, avatar)
- Categories management (add, edit, delete custom categories)
- Theme toggle (light/dark mode)
- Data management (export, backup)
- About and help

**Functionality**:
- Customize user profile
- Manage achievement categories
- Toggle dark mode
- Export data as JSON
- View app information

## Key User Flows

### Flow 1: Log Daily Achievement
1. User opens app → Home screen
2. User taps green FAB (+) button
3. Quick Add modal slides up
4. User selects category (e.g., Study)
5. User enters achievement name ("Completed calculus homework")
6. User enters quantity (2) and unit (hours)
7. User taps Save
8. Modal closes with haptic feedback
9. Achievement card appears on Home screen
10. Success message appears briefly

### Flow 2: Write Tree Hole Entry
1. User taps "Tree Hole" tab in bottom navigation
2. Full-screen editor appears with calming purple background
3. User sees privacy lock icon (reassurance)
4. User taps text area and begins writing
5. User can optionally tap microphone for voice-to-text
6. Entry auto-saves every 30 seconds
7. User taps Save when done
8. Confirmation message appears
9. User returns to Home or stays to write more

### Flow 3: View Weekly Summary
1. User taps "Summary" tab in bottom navigation
2. Weekly view loads by default (current week)
3. User sees colorful bar chart of category distribution
4. User sees 7 day cards showing daily totals
5. User sees motivational message ("Great week! You logged 27 achievements")
6. User swipes left/right to navigate weeks
7. User taps day card to see that day's details
8. User can switch to Monthly or Yearly tabs

### Flow 4: Edit Achievement
1. User on Home screen
2. User swipes left on achievement card
3. Edit and Delete buttons appear
4. User taps Edit
5. Quick Add modal opens with pre-filled data
6. User modifies fields
7. User taps Save
8. Card updates with new information

## Color Choices

### Brand Colors
- **Primary Green** (#4CAF50): Growth, achievement, positivity, success
- **Warm Orange** (#FF9800): Energy, motivation, warmth, enthusiasm
- **Soft Purple** (#9C27B0): Reflection, inner peace, tree hole privacy

### Category Colors
- **Study** (#2196F3): Blue - Focus, learning, intellect
- **Exercise** (#F44336): Red - Energy, physical activity, vitality
- **Reading** (#9C27B0): Purple - Wisdom, knowledge, calm
- **Work** (#FF9800): Orange - Productivity, professional growth
- **Meditation** (#4CAF50): Green - Peace, mindfulness, balance
- **Other** (#9E9E9E): Gray - Neutral, flexible

### UI Colors
- **Background** (#F9F9F9): Off-white, easy on eyes
- **Surface** (#FFFFFF): Pure white for cards
- **Text Primary** (#2C3E50): Dark gray for readability
- **Text Secondary** (#7F8C8D): Medium gray for secondary info
- **Border** (#E0E0E0): Light gray for subtle dividers
- **Success** (#81C784): Light green for confirmations
- **Error** (#EF5350): Soft red for alerts

## Layout Principles

### One-Handed Usage
- Bottom navigation bar for primary navigation
- Floating action button in bottom-right (thumb-reachable)
- Important actions within lower 2/3 of screen
- Swipe gestures for secondary actions

### Visual Hierarchy
- Large, bold headers (24-28px)
- Clear section separation with whitespace
- Color-coded categories for quick scanning
- Icons paired with labels for clarity

### Consistency with iOS
- SF Symbols for icons (Material Icons fallback on Android)
- System fonts (San Francisco on iOS)
- Native iOS animations and transitions
- Respect safe areas (notch, home indicator)
- Standard iOS gestures (swipe back, pull to refresh)

## Interaction Design

### Feedback
- Haptic feedback on button taps (light impact)
- Success haptic on achievement save (notification)
- Visual press states (scale 0.97 or opacity 0.7)
- Smooth animations (200-300ms)

### Gestures
- Swipe left on card: Reveal edit/delete
- Swipe left/right on week selector: Navigate weeks
- Pull down on Home: Refresh (future feature)
- Long press on card: Quick actions (future feature)

### Empty States
- Encouraging illustrations
- Friendly, motivational copy
- Clear call-to-action buttons
- No shame or guilt (positive framing)

## Data Storage Strategy

### Local-First Approach
- All data stored in AsyncStorage (React Native)
- No user accounts required
- No internet connection needed
- Privacy-first design

### Data Structure
```
achievements: [
  {
    id: string,
    date: ISO string,
    category: string,
    name: string,
    quantity: number,
    unit: string,
    notes: string,
    createdAt: timestamp
  }
]

treeHoleEntries: [
  {
    id: string,
    date: ISO string,
    content: string,
    createdAt: timestamp
  }
]

categories: [
  { id: string, name: string, color: string, icon: string }
]
```

## Accessibility

- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 (WCAG AA)
- VoiceOver labels on all interactive elements
- Dynamic type support (respect user font size)
- Dark mode with adjusted colors

## Future Enhancements (Not MVP)

- Cloud sync with user accounts
- Widgets for home screen
- Daily reminder notifications
- Streak tracking
- Achievement badges
- Export to PDF
- Share summary (optional)
- Custom themes
