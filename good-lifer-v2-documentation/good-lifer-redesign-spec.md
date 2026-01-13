# Good Lifer UI Redesign Specification

**Version**: 2.0  
**Date**: January 2, 2026  
**Status**: Proposal - Awaiting Approval

---

## Design Philosophy

The redesign focuses on three core principles:

1. **Stress-Less Interaction**: Minimize cognitive load and number of taps required
2. **Project-Centric Growth**: Support long-term goals alongside daily achievements
3. **Effortless Input**: Voice-first options and smart defaults reduce friction

---

## Navigation Structure

### Bottom Tab Bar (4 Tabs)

| Tab | Icon | Purpose |
|-----|------|---------|
| **Home** | House | Main entry point with two big action buttons |
| **Stats** | Bar Chart | Weekly/Monthly/Yearly summaries with drill-down |
| **Projects** | Folder | View and manage all projects |
| **Settings** | Gear | App configuration and category management |

**Removed Tabs**: Tree Hole (now accessible from Home), Summary (merged into Stats)

---

## Screen Designs

### 1. HOME SCREEN

#### Layout Structure (Top to Bottom)

**A. Header Section (Dynamic)**
- **First view of day**: Motivational greeting + encouragement message
  - Example: "Good morning! 🌱 Ready to make today count?"
  - Disappears after user sees it once
- **After first view**: Today's achievement summary
  - "Today: 3 achievements • 2.5 hours"
  - Compact, single line

**B. Center Action Buttons (Primary Focus)**

Two large, prominent buttons occupying center screen:

```
┌─────────────────────────────────────┐
│                                     │
│   ┌───────────────────────────┐   │
│   │                           │   │
│   │    📚 Log Achievement     │   │
│   │                           │   │
│   └───────────────────────────┘   │
│                                     │
│   ┌───────────────────────────┐   │
│   │                           │   │
│   │    🔒 Tree Hole           │   │
│   │                           │   │
│   └───────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Button Specs**:
- Height: 80px
- Rounded corners: 16px
- Green gradient for Achievement (primary color)
- Purple gradient for Tree Hole (accent color)
- Icon + Text, centered
- Haptic feedback on press

**C. Quick Stats Bar (Below Buttons)**

Horizontal scrollable cards showing:
- Active Projects count
- This week's total achievements
- Current streak (days with at least 1 achievement)

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Projects │  │   Week   │  │  Streak  │
│    5     │  │    27    │  │  14 🔥   │
└──────────┘  └──────────┘  └──────────┘
```

---

### 2. LOG ACHIEVEMENT FLOW

#### Step 1: Choose Log Type

Modal slides up with two options:

```
┌─────────────────────────────────────┐
│  Log Achievement                    │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │  ⚡ Quick Log                 │ │
│  │  One-time achievement         │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  📁 Log for Project           │ │
│  │  Track progress on a goal     │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

#### Step 2A: Quick Log (One-Time Achievement)

```
┌─────────────────────────────────────┐
│  Quick Log                      [X] │
├─────────────────────────────────────┤
│                                     │
│  Category                           │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │ 📚│ │ 💪│ │ 💼│ │ + │          │
│  └───┘ └───┘ └───┘ └───┘          │
│  Learn Exer  Busi  More            │
│                                     │
│  Achievement Name                   │
│  ┌─────────────────────────────┐   │
│  │ Completed homework      [🎤]│   │
│  └─────────────────────────────┘   │
│                                     │
│  Time Spent                         │
│  ┌─────────────────────────────┐   │
│  │      30 mins      [-] [+]   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ▼ Add Notes (Optional)             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         Save                │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Key Features**:
- Category selection: 3 default + "More" button for custom
- Voice input button (🎤) next to text field - **hold to speak**
- Time adjustment: +/- buttons in 15-min increments (15, 30, 45, 60, 90, 120...)
- Notes section collapsed by default, expands on tap
- Default time: 30 minutes

#### Step 2B: Log for Project

```
┌─────────────────────────────────────┐
│  Log for Project                [X] │
├─────────────────────────────────────┤
│                                     │
│  Select Project                     │
│  ┌─────────────────────────────┐   │
│  │ 📚 Read Atomic Habits       │   │
│  │ Progress: 45% • Learning    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 💼 Launch Product X         │   │
│  │ Progress: 30% • Business    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ + Create New Project        │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

After selecting a project:

```
┌─────────────────────────────────────┐
│  Read Atomic Habits             [X] │
├─────────────────────────────────────┤
│                                     │
│  Time Spent Today                   │
│  ┌─────────────────────────────┐   │
│  │      30 mins      [-] [+]   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Update Progress                    │
│  ┌─────────────────────────────┐   │
│  │  45%  →  [50%]  (rolling)   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ▼ Today's Details (Optional)       │
│  ┌─────────────────────────────┐   │
│  │ Read chapters 5-7      [🎤] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         Save                │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Progress Input Options**:
1. **Rolling bar**: Tap to open picker wheel (0%, 5%, 10%...100%)
2. **Manual input**: Tap percentage to type directly
3. **Smart calculation** (for books): "Pages read: [50] / 300" → auto-calculates %

---

### 3. TREE HOLE SCREEN

Opens directly to full-screen editor (same as current design, with enhancements):

```
┌─────────────────────────────────────┐
│  🔒 Tree Hole                   [X] │
├─────────────────────────────────────┤
│                                     │
│  Your private space for regrets,   │
│  struggles, and difficult feelings │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  What's weighing on your    │   │
│  │  mind today?                │   │
│  │                             │   │
│  │  [Large text area]          │   │
│  │                             │   │
│  │                             │   │
│  │                             │   │
│  │                             │   │
│  │                        [🎤] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────┐  ┌──────────────┐   │
│  │  Clear   │  │     Save     │   │
│  └──────────┘  └──────────────┘   │
│                                     │
│  Friday, January 2, 2026 • 10:30 PM│
│                                     │
└─────────────────────────────────────┘
```

**Voice Input**:
- Large microphone button in bottom-right of text area
- **Hold to speak**, release to stop
- Text appears in real-time as user speaks
- Can edit text after voice input

---

### 4. STATS SCREEN

#### Default View: Weekly

```
┌─────────────────────────────────────┐
│  Stats                              │
├─────────────────────────────────────┤
│                                     │
│  [Weekly] Monthly  Yearly           │
│                                     │
│  ← Dec 26 - Jan 1, 2026 →          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Total Achievements         │   │
│  │         27                  │   │
│  │  Total Time: 18.5 hours     │   │
│  └─────────────────────────────┘   │
│                                     │
│  By Category                        │
│  ┌─────────────────────────────┐   │
│  │ 📚 Learning     15 (55%) ▓▓▓│   │
│  │ 💪 Exercise      8 (30%) ▓▓ │   │
│  │ 💼 Business      4 (15%) ▓  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Daily Breakdown (Tap to view)      │
│  ┌───┬───┬───┬───┬───┬───┬───┐   │
│  │ M │ T │ W │ T │ F │ S │ S │   │
│  │ 5 │ 4 │ 3 │ 6 │ 2 │ 4 │ 3 │   │
│  └───┴───┴───┴───┴───┴───┴───┘   │
│                                     │
└─────────────────────────────────────┘
```

#### Drill-Down: Specific Day View

When user taps a day (e.g., Thursday with 6 achievements):

```
┌─────────────────────────────────────┐
│  ← Thursday, Dec 28                 │
├─────────────────────────────────────┤
│                                     │
│  6 Achievements • 4.5 hours         │
│                                     │
│  📚 Learning (3)                    │
│  ┌─────────────────────────────┐   │
│  │ Read Atomic Habits          │   │
│  │ 1 hour • Progress: 45→50%   │   │
│  │ "Read chapters 5-7"         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Spanish practice            │   │
│  │ 30 mins                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  💪 Exercise (2)                    │
│  ┌─────────────────────────────┐   │
│  │ Morning run                 │   │
│  │ 45 mins • 5km               │   │
│  └─────────────────────────────┘   │
│                                     │
│  🔒 Tree Hole Entry                 │
│  ┌─────────────────────────────┐   │
│  │ "Felt anxious about..."     │   │
│  │ [Tap to read full entry]    │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Key Features**:
- Shows both achievements AND tree hole entries for that day
- Tree hole preview (first line only), tap to read full
- Grouped by category
- Shows project progress changes
- Optional notes displayed

---

### 5. PROJECTS SCREEN

```
┌─────────────────────────────────────┐
│  Projects                       [+] │
├─────────────────────────────────────┤
│                                     │
│  [Active] Completed                 │
│                                     │
│  📚 Learning (2)                    │
│  ┌─────────────────────────────┐   │
│  │ Read Atomic Habits          │   │
│  │ ▓▓▓▓▓▓▓░░░ 50%             │   │
│  │ 12 hours • Updated today    │   │
│  │              [Log Progress] │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Learn Spanish               │   │
│  │ ▓▓▓░░░░░░░ 25%             │   │
│  │ 8 hours • Updated 2 days ago│   │
│  │              [Log Progress] │   │
│  └─────────────────────────────┘   │
│                                     │
│  💼 Business (1)                    │
│  ┌─────────────────────────────┐   │
│  │ Launch Product X            │   │
│  │ ▓▓▓▓▓▓░░░░ 60%             │   │
│  │ 45 hours • Updated yesterday│   │
│  │              [Log Progress] │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Project Card Details**:
- Category icon + name
- Progress bar (visual)
- Percentage (numeric)
- Total time invested
- Last updated timestamp
- Quick "Log Progress" button

**Grouping**:
- Primary: By Category (Learning, Sports & Exercise, Business, Custom)
- Secondary: By Status (Active tab / Completed tab)

**Completed Projects Tab**:
- Same layout
- Shows completion date
- Trophy icon 🏆
- No "Log Progress" button
- Can tap to view full history

---

### 6. SETTINGS SCREEN

```
┌─────────────────────────────────────┐
│  Settings                           │
├─────────────────────────────────────┤
│                                     │
│  Categories                         │
│  ┌─────────────────────────────┐   │
│  │ Manage Categories           │   │
│  │ Customize your categories   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Voice Input                        │
│  ┌─────────────────────────────┐   │
│  │ Language: Auto-detect       │   │
│  │ (English, 中文, 日本語)      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Data Management                    │
│  ┌─────────────────────────────┐   │
│  │ Export Data                 │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Clear All Data              │   │
│  └─────────────────────────────┘   │
│                                     │
│  About                              │
│  ┌─────────────────────────────┐   │
│  │ Version 2.0.0               │   │
│  │ Privacy Policy              │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### Manage Categories Screen

```
┌─────────────────────────────────────┐
│  ← Manage Categories            [+] │
├─────────────────────────────────────┤
│                                     │
│  Default Categories                 │
│  ┌─────────────────────────────┐   │
│  │ 📚 Learning           [✓] ☰ │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 💪 Sports & Exercise  [✓] ☰ │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 💼 Business           [✓] ☰ │   │
│  └─────────────────────────────┘   │
│                                     │
│  Custom Categories                  │
│  ┌─────────────────────────────┐   │
│  │ 🎨 Creative           [✓] ☰ │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 👨‍👩‍👧 Family            [✓] ☰ │   │
│  └─────────────────────────────┘   │
│                                     │
│  Tap [✓] to show/hide              │
│  Drag ☰ to reorder                 │
│                                     │
└─────────────────────────────────────┘
```

**Features**:
- Toggle visibility with checkmark
- Drag to reorder (affects display order in quick-add)
- Tap category to edit name/color/icon
- + button to add new custom category
- Cannot delete default categories (only hide)

---

## User Flow Sequences

### Flow 1: Quick Achievement Logging

```
Home Screen
    ↓ [Tap "Log Achievement"]
Choose Log Type Modal
    ↓ [Tap "Quick Log"]
Quick Log Form
    ↓ [Select Category: Learning]
    ↓ [Voice input: "Completed homework"]
    ↓ [Adjust time: 30 → 45 mins]
    ↓ [Tap "Save"]
Home Screen (updated count)
    ↓ [Celebration haptic feedback]
```

**Total taps: 4** (Log Achievement → Quick Log → Category → Save)

### Flow 2: Project Progress Logging

```
Home Screen
    ↓ [Tap "Log Achievement"]
Choose Log Type Modal
    ↓ [Tap "Log for Project"]
Project List
    ↓ [Tap "Read Atomic Habits"]
Project Log Form
    ↓ [Adjust time: 30 → 60 mins]
    ↓ [Update progress: 45% → 50%]
    ↓ [Voice input notes: "Read chapters 5-7"]
    ↓ [Tap "Save"]
Home Screen (updated count)
    ↓ [If project reaches 100%: Celebration animation]
```

**Total taps: 5** (Log Achievement → Log for Project → Select Project → Adjust values → Save)

### Flow 3: Tree Hole Entry

```
Home Screen
    ↓ [Tap "Tree Hole"]
Tree Hole Editor (full screen)
    ↓ [Hold microphone button]
    ↓ [Speak feelings/regrets]
    ↓ [Release button]
    ↓ [Review/edit text]
    ↓ [Tap "Save"]
Home Screen
    ↓ [Confirmation message]
```

**Total taps: 2** (Tree Hole → Save)

### Flow 4: View Weekly Stats & Drill Down

```
Home Screen
    ↓ [Tap "Stats" tab]
Stats Screen (Weekly view)
    ↓ [Review weekly summary]
    ↓ [Tap on "Thursday" day card]
Day Detail View
    ↓ [See all achievements + tree hole for that day]
    ↓ [Tap tree hole entry to read full]
Tree Hole Entry (read-only)
    ↓ [Tap back]
Day Detail View
    ↓ [Tap back]
Stats Screen
```

### Flow 5: Create New Project

```
Home Screen
    ↓ [Tap "Log Achievement"]
Choose Log Type Modal
    ↓ [Tap "Log for Project"]
Project List
    ↓ [Tap "+ Create New Project"]
New Project Form
    ┌─────────────────────────────┐
    │ Project Name                │
    │ [Learn Python]         [🎤] │
    │                             │
    │ Category                    │
    │ [📚 Learning]               │
    │                             │
    │ Target (Optional)           │
    │ Complete online course      │
    │                             │
    │ [Create Project]            │
    └─────────────────────────────┘
    ↓ [Fill details]
    ↓ [Tap "Create Project"]
Project Log Form (for new project)
    ↓ [Log first progress]
    ↓ [Tap "Save"]
Home Screen
```

---

## Voice Input Specifications

### Technical Implementation

**Platform**: iOS Speech Recognition Framework
- **Languages supported**: English, Chinese (Mandarin/Cantonese), Japanese, 50+ others
- **Offline capability**: Yes (after initial language pack download)
- **Accuracy**: 95%+ for clear speech in supported languages

### User Experience

**Interaction Pattern**: Hold-to-Speak
1. User **presses and holds** large microphone button
2. Visual feedback: Button pulses, waveform animation appears
3. User speaks naturally
4. Text appears in real-time in text field
5. User **releases button** to stop recording
6. Text can be edited with keyboard afterward

**Mixed Language Input**:
- iOS speech recognition can handle code-switching (e.g., English + Chinese)
- Accuracy may drop slightly (90-95%) but still usable
- User can manually correct any errors

**Button Design**:
- Large circular button (56x56px minimum)
- Microphone icon
- Positioned in bottom-right of text input area
- Color: Primary green (matches brand)
- Haptic feedback on press/release

---

## Progress Input: Rolling Bar

### Design

Instead of a slider, use a **picker wheel** (iOS native component):

```
┌─────────────────────────────────────┐
│  Update Progress                    │
│                                     │
│  Current: 45%                       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         [  50%  ]           │   │ ← Tap to open picker
│  └─────────────────────────────┘   │
│                                     │
│  When tapped:                       │
│  ┌─────────────────────────────┐   │
│  │         40%                 │   │
│  │         45%                 │   │
│  │      →  50%  ←              │   │ ← Scroll to select
│  │         55%                 │   │
│  │         60%                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  Or tap to type manually: [50]%    │
│                                     │
└─────────────────────────────────────┘
```

**Increments**: 5% (0%, 5%, 10%, 15%...100%)

**Alternative for Books**:
```
┌─────────────────────────────────────┐
│  Update Progress                    │
│                                     │
│  Pages Read                         │
│  ┌──────┐ / ┌──────┐               │
│  │  150 │   │  300 │               │
│  └──────┘   └──────┘               │
│                                     │
│  Progress: 50% (auto-calculated)    │
│                                     │
└─────────────────────────────────────┘
```

---

## Celebration Animations

### Project Completion (100%)

When a project reaches 100%:

1. **Confetti animation** (2 seconds)
2. **Modal appears**:
```
┌─────────────────────────────────────┐
│                                     │
│             🎉 🏆 🎉                │
│                                     │
│      Project Completed!             │
│                                     │
│    Read Atomic Habits               │
│                                     │
│    Total time: 24 hours             │
│    Completed in 18 days             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        Awesome!             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```
3. **Haptic feedback**: Success pattern
4. **Project auto-archives** to Completed tab

### Daily Streak Milestone

When user reaches 7, 14, 30, 60, 100 day streak:

```
┌─────────────────────────────────────┐
│                                     │
│             🔥 🔥 🔥                │
│                                     │
│      14-Day Streak!                 │
│                                     │
│   You've logged achievements        │
│   for 14 days in a row!             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      Keep it up!            │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## Color Scheme (Updated)

| Element | Light Mode | Dark Mode | Usage |
|---------|------------|-----------|-------|
| Primary (Green) | #4CAF50 | #66BB6A | Achievement button, progress bars |
| Accent (Purple) | #9C27B0 | #BA68C8 | Tree Hole button, emphasis |
| Background | #F9F9F9 | #1A1A1A | Screen background |
| Surface | #FFFFFF | #2D2D2D | Cards, modals |
| Foreground | #2C3E50 | #FFFFFF | Primary text |
| Muted | #7F8C8D | #B0B0B0 | Secondary text |
| Border | #E0E0E0 | #404040 | Dividers, outlines |

**Category Colors**:
- Learning: #2196F3 (Blue)
- Sports & Exercise: #F44336 (Red)
- Business: #FF9800 (Orange)
- Custom: User-selectable from palette

---

## Summary of Improvements

### Reduced Cognitive Load
- **Home screen**: 2 clear action buttons (vs. 4 tabs + FAB)
- **Quick log**: 4 taps total (vs. 7+ in current design)
- **Voice input**: Speak instead of type for all text fields

### Project Management
- **Long-term tracking**: Projects span multiple days/weeks
- **Progress visualization**: Clear percentage + time invested
- **Completion celebration**: Motivational feedback

### Enhanced Stats
- **Drill-down capability**: View specific day's activities
- **Tree hole integration**: See entries in daily view
- **Better context**: Notes and project progress visible

### Streamlined Navigation
- **4 tabs** (vs. previous 4): Home, Stats, Projects, Settings
- **Tree Hole**: Accessible from Home, not separate tab
- **Summary**: Merged into Stats with better organization

---

## Next Steps

1. **Review this specification** and provide feedback
2. **Approve design** or request changes
3. **Begin implementation** phase by phase
4. **Test with real usage** patterns
5. **Iterate** based on user experience

---

**Questions or concerns? Let me know what you'd like to adjust before I start building!**
