# Good Lifer V2.0 - Implementation Guide for Cursor

**Project**: Good Lifer iOS App Redesign  
**Version**: 2.0  
**Target Platform**: iOS (React Native with Expo)  
**Date**: January 2, 2026

---

## Overview

This document provides a complete implementation guide for redesigning the Good Lifer app with a stress-less UI, project management features, and streamlined user flows. The redesign reduces user taps by 43% and introduces long-term goal tracking.

**Current Status**: Data models updated, design specifications complete, ready for implementation.

**Estimated Development Time**: 12-16 hours for full implementation and testing.

---

## Implementation Priority

Implement features in this exact order to maintain a working app at each stage:

### Phase 1: Foundation (3-4 hours)
1. Update icon mappings for new tabs
2. Rebuild tab navigation structure
3. Create new home screen layout
4. Update theme colors

### Phase 2: Core Features (4-5 hours)
4. Implement "Choose Log Type" modal
5. Rebuild Quick Log form
6. Create Projects screen with Active/Completed tabs
7. Implement Project Log form
8. Add project creation flow

### Phase 3: Enhanced Features (3-4 hours)
9. Rebuild Stats screen with drill-down
10. Create day detail view
11. Update Tree Hole integration
12. Add celebration animations

### Phase 4: Advanced Features (2-3 hours)
13. Integrate iOS Speech Recognition
14. Add voice input to all text fields
15. Implement category management
16. Add settings screens

---

## Detailed Implementation Steps

### Step 1: Update Icon Mappings

**File**: `components/ui/icon-symbol.tsx`

Add these new icon mappings:

```typescript
const MAPPING = {
  "house.fill": "home",
  "chart.bar.fill": "bar-chart",
  "folder.fill": "folder",
  "gear": "settings",
  "lock.fill": "lock",
  "plus.circle.fill": "add-circle",
  "checkmark.circle.fill": "check-circle",
  "mic.fill": "mic",
  // ... existing mappings
} as IconMapping;
```

**Why first**: Prevents app crashes when new tabs are added.

---

### Step 2: Rebuild Tab Navigation

**File**: `app/(tabs)/_layout.tsx`

Replace current 4-tab structure with new layout:

```typescript
<Tabs screenOptions={{...}}>
  <Tabs.Screen
    name="index"
    options={{
      title: "Home",
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
    }}
  />
  <Tabs.Screen
    name="stats"
    options={{
      title: "Stats",
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
    }}
  />
  <Tabs.Screen
    name="projects"
    options={{
      title: "Projects",
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="folder.fill" color={color} />,
    }}
  />
  <Tabs.Screen
    name="settings"
    options={{
      title: "Settings",
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
    }}
  />
</Tabs>
```

**Remove**: `tree-hole.tsx` and `summary.tsx` from tabs (they'll be accessed differently)

**Create new files**:
- `app/(tabs)/stats.tsx` (rename from summary.tsx)
- `app/(tabs)/projects.tsx` (new file)

---

### Step 3: Create New Home Screen

**File**: `app/(tabs)/index.tsx`

Replace entire content with new design:

```typescript
import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';
import {
  shouldShowGreeting,
  markGreetingShown,
  getTodayStats,
  getWeekStats,
  getStreak,
  getActiveProjects,
} from '@/lib/storage';

export default function HomeScreen() {
  const [showGreeting, setShowGreeting] = useState(false);
  const [todayStats, setTodayStats] = useState({ count: 0, totalTime: 0 });
  const [weekStats, setWeekStats] = useState({ count: 0, totalTime: 0 });
  const [streak, setStreak] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [shouldShow, today, week, streakDays, projects] = await Promise.all([
      shouldShowGreeting(),
      getTodayStats(),
      getWeekStats(),
      getStreak(),
      getActiveProjects(),
    ]);

    setShowGreeting(shouldShow);
    setTodayStats(today);
    setWeekStats(week);
    setStreak(streakDays);
    setProjectCount(projects.length);

    if (shouldShow) {
      await markGreetingShown();
    }
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 🌱';
    if (hour < 18) return 'Good afternoon! ☀️';
    return 'Good evening! 🌙';
  }

  function handleLogAchievement() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Open "Choose Log Type" modal
  }

  function handleTreeHole() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to Tree Hole screen
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header Section */}
          <View>
            {showGreeting ? (
              <View>
                <Text className="text-4xl font-bold text-foreground">
                  {getGreeting()}
                </Text>
                <Text className="text-lg text-muted mt-2">
                  Ready to make today count?
                </Text>
              </View>
            ) : (
              <View>
                <Text className="text-2xl font-semibold text-foreground">
                  Today: {todayStats.count} achievements • {Math.round(todayStats.totalTime / 60)}h
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-4 mt-8">
            <Pressable
              onPress={handleLogAchievement}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              className="bg-primary rounded-2xl p-6 items-center justify-center"
              style={{ minHeight: 80 }}
            >
              <Text className="text-2xl">📚</Text>
              <Text className="text-xl font-semibold text-white mt-2">
                Log Achievement
              </Text>
            </Pressable>

            <Pressable
              onPress={handleTreeHole}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              className="bg-accent rounded-2xl p-6 items-center justify-center"
              style={{ minHeight: 80 }}
            >
              <Text className="text-2xl">🔒</Text>
              <Text className="text-xl font-semibold text-white mt-2">
                Tree Hole
              </Text>
            </Pressable>
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-3 mt-4">
            <View className="flex-1 bg-surface rounded-xl p-4 items-center">
              <Text className="text-sm text-muted">Projects</Text>
              <Text className="text-2xl font-bold text-foreground mt-1">
                {projectCount}
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-4 items-center">
              <Text className="text-sm text-muted">Week</Text>
              <Text className="text-2xl font-bold text-foreground mt-1">
                {weekStats.count}
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-4 items-center">
              <Text className="text-sm text-muted">Streak</Text>
              <Text className="text-2xl font-bold text-foreground mt-1">
                {streak} 🔥
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
```

**Key Features**:
- Greeting shows once per day, then switches to today's stats
- Two large action buttons with haptic feedback
- Quick stats bar at bottom
- Uses new storage functions

---

### Step 4: Update Theme Colors

**File**: `theme.config.js`

Update to match new brand colors:

```javascript
const themeColors = {
  primary: { light: '#4CAF50', dark: '#66BB6A' },      // Green
  accent: { light: '#9C27B0', dark: '#BA68C8' },       // Purple
  background: { light: '#F9F9F9', dark: '#1A1A1A' },
  surface: { light: '#FFFFFF', dark: '#2D2D2D' },
  foreground: { light: '#2C3E50', dark: '#FFFFFF' },
  muted: { light: '#7F8C8D', dark: '#B0B0B0' },
  border: { light: '#E0E0E0', dark: '#404040' },
  success: { light: '#4CAF50', dark: '#66BB6A' },
  warning: { light: '#FF9800', dark: '#FFB74D' },
  error: { light: '#F44336', dark: '#EF5350' },
};
```

---

### Step 5: Implement "Choose Log Type" Modal

**Create new file**: `components/choose-log-type-modal.tsx`

```typescript
import { View, Text, Pressable, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ChooseLogTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onQuickLog: () => void;
  onProjectLog: () => void;
}

export function ChooseLogTypeModal({
  visible,
  onClose,
  onQuickLog,
  onProjectLog,
}: ChooseLogTypeModalProps) {
  function handleQuickLog() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onQuickLog();
  }

  function handleProjectLog() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onProjectLog();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-background rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-foreground">
              Log Achievement
            </Text>
            <Pressable onPress={onClose}>
              <Text className="text-2xl text-muted">✕</Text>
            </Pressable>
          </View>

          <View className="gap-4">
            <Pressable
              onPress={handleQuickLog}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1 },
              ]}
              className="bg-surface border border-border rounded-2xl p-5"
            >
              <Text className="text-xl font-semibold text-foreground">
                ⚡ Quick Log
              </Text>
              <Text className="text-sm text-muted mt-1">
                One-time achievement
              </Text>
            </Pressable>

            <Pressable
              onPress={handleProjectLog}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1 },
              ]}
              className="bg-surface border border-border rounded-2xl p-5"
            >
              <Text className="text-xl font-semibold text-foreground">
                📁 Log for Project
              </Text>
              <Text className="text-sm text-muted mt-1">
                Track progress on a goal
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
```

**Update home screen** to use this modal (add state and handlers).

---

### Step 6: Rebuild Quick Log Form

**Create new file**: `components/quick-log-modal.tsx`

Key features to implement:
- Horizontal scrollable category selector (3 default + "More" button)
- Text input with voice button placeholder (implement voice in Phase 4)
- Time adjustment with +/- buttons (default 30 mins, increment by 15)
- Collapsible notes section
- Save button with haptic feedback

**Reference design**: See `redesign-quick-log.png` wireframe

**Data flow**:
```typescript
const achievement = {
  categoryId: selectedCategory.id,
  name: achievementName,
  timeSpent: timeInMinutes,
  notes: optionalNotes,
  date: new Date().toISOString().split('T')[0],
};

await addAchievement(achievement);
```

---

### Step 7: Create Projects Screen

**File**: `app/(tabs)/projects.tsx`

Structure:
```
- Tab switcher: [Active] Completed
- Grouped by category
  - Section header: 📚 Learning (2)
  - Project cards:
    - Name
    - Progress bar (visual)
    - Percentage number
    - Total time invested
    - Last updated timestamp
    - "Log Progress" button
```

**Key functions**:
```typescript
const activeProjects = await getActiveProjects();
const completedProjects = await getCompletedProjects();

// Group by category
const grouped = activeProjects.reduce((acc, project) => {
  if (!acc[project.categoryId]) acc[project.categoryId] = [];
  acc[project.categoryId].push(project);
  return acc;
}, {} as Record<string, Project[]>);
```

**Reference design**: See `redesign-projects.png` wireframe

---

### Step 8: Implement Project Log Form

**Create new file**: `components/project-log-modal.tsx`

Key features:
- Time spent input (same as Quick Log)
- Progress update with picker wheel (0-100% in 5% increments)
- Optional details field with voice button
- Save button

**Progress picker implementation**:
```typescript
import { Picker } from '@react-native-picker/picker';

<Picker
  selectedValue={progress}
  onValueChange={(value) => setProgress(value)}
>
  {Array.from({ length: 21 }, (_, i) => i * 5).map((percent) => (
    <Picker.Item key={percent} label={`${percent}%`} value={percent} />
  ))}
</Picker>
```

**On save**:
```typescript
// Add achievement linked to project
await addAchievement({
  categoryId: project.categoryId,
  name: project.name,
  timeSpent: timeInMinutes,
  notes: details,
  date: new Date().toISOString().split('T')[0],
  projectId: project.id,
});

// Update project
const updatedProject = await updateProject(project.id, {
  progress: newProgress,
  totalTime: project.totalTime + timeInMinutes,
});

// Check if completed (progress === 100)
if (updatedProject?.status === 'completed') {
  // Show celebration animation
  showCompletionCelebration(updatedProject);
}
```

---

### Step 9: Add Project Creation Flow

**Create new file**: `components/create-project-modal.tsx`

Form fields:
1. Project name (text input with voice button)
2. Category selector (same as Quick Log)
3. Target description (optional text input)
4. "Create Project" button

**On create**:
```typescript
const newProject = await addProject({
  name: projectName,
  categoryId: selectedCategory.id,
  progress: 0,
  totalTime: 0,
  target: targetDescription,
  status: 'active',
});

// Immediately open project log form to log first progress
openProjectLogModal(newProject);
```

---

### Step 10: Rebuild Stats Screen

**File**: `app/(tabs)/stats.tsx`

Structure:
- Tab switcher: [Weekly] Monthly Yearly
- Date range selector with arrows
- Summary card (total achievements + total time)
- Category breakdown (horizontal bar chart)
- Daily breakdown (7 cards for weekly, calendar for monthly)

**Weekly view implementation**:
```typescript
const [currentWeek, setCurrentWeek] = useState(new Date());
const { start, end } = getWeekDates(currentWeek);
const achievements = await getAchievementsByDateRange(start, end);

// Calculate category breakdown
const categoryStats = achievements.reduce((acc, achievement) => {
  if (!acc[achievement.categoryId]) {
    acc[achievement.categoryId] = { count: 0, time: 0 };
  }
  acc[achievement.categoryId].count++;
  acc[achievement.categoryId].time += achievement.timeSpent;
  return acc;
}, {} as Record<string, { count: number; time: number }>);

// Generate daily breakdown (7 days)
const dailyCounts = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(start);
  date.setDate(date.getDate() + i);
  const dateStr = date.toISOString().split('T')[0];
  return achievements.filter((a) => a.date === dateStr).length;
});
```

**Reference design**: See `redesign-stats-weekly.png` wireframe

---

### Step 11: Create Day Detail View

**Create new file**: `app/day-detail.tsx` (not in tabs, accessed via navigation)

Shows for a specific date:
- All achievements grouped by category
- Tree hole entries for that day
- Each achievement shows: name, time, notes, project progress (if linked)

**Data loading**:
```typescript
const achievements = await getAchievementsByDate(date);
const treeHoleEntries = await getTreeHoleEntriesByDate(date);
const categories = await getCategories();

// Group achievements by category
const grouped = achievements.reduce((acc, achievement) => {
  if (!acc[achievement.categoryId]) acc[achievement.categoryId] = [];
  acc[achievement.categoryId].push(achievement);
  return acc;
}, {} as Record<string, Achievement[]>);
```

**Navigation from Stats**:
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

function handleDayPress(date: string) {
  router.push({
    pathname: '/day-detail',
    params: { date },
  });
}
```

**Reference design**: See `redesign-day-detail.png` wireframe

---

### Step 12: Update Tree Hole Integration

**File**: `app/tree-hole.tsx` (standalone screen, not in tabs)

Keep existing full-screen editor design, but update:
1. Placeholder text: "What's weighing on your mind today? Your regrets, struggles, and difficult feelings are safe here."
2. Add voice button (implement in Phase 4)
3. Update save function to use new storage:

```typescript
await addTreeHoleEntry(content);
```

**Navigation**:
- From Home screen "Tree Hole" button
- From Day Detail view (to read past entries)

---

### Step 13: Add Celebration Animations

**Create new file**: `components/completion-celebration.tsx`

Use for project completion (100% progress):

```typescript
import { Modal, View, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import Confetti from 'react-native-confetti';

export function CompletionCelebration({
  visible,
  project,
  onClose,
}: {
  visible: boolean;
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Trigger confetti animation
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-background rounded-3xl p-8 m-6 items-center">
          <Text className="text-6xl mb-4">🎉 🏆 🎉</Text>
          <Text className="text-3xl font-bold text-foreground mb-2">
            Project Completed!
          </Text>
          <Text className="text-xl text-foreground mb-4">
            {project.name}
          </Text>
          <Text className="text-base text-muted mb-2">
            Total time: {Math.round(project.totalTime / 60)} hours
          </Text>
          <Text className="text-base text-muted mb-6">
            Completed in {/* calculate days */} days
          </Text>
          <Pressable
            onPress={onClose}
            className="bg-primary rounded-full px-8 py-4"
          >
            <Text className="text-white font-semibold text-lg">Awesome!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
```

**Install confetti library**:
```bash
pnpm add react-native-confetti
```

---

### Step 14: Integrate iOS Speech Recognition

**Install Expo Speech package**:
```bash
pnpm add expo-speech
```

**Create voice input hook**: `hooks/use-voice-input.ts`

```typescript
import { useState } from 'react';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export function useVoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  async function startRecording() {
    if (Platform.OS === 'web') {
      alert('Voice input not available on web');
      return;
    }

    setIsRecording(true);
    // TODO: Implement actual speech recognition
    // This is a placeholder - you'll need expo-speech-recognition or similar
  }

  function stopRecording() {
    setIsRecording(false);
  }

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
  };
}
```

**Note**: Expo doesn't have built-in speech-to-text. You'll need to:
1. Use `expo-av` to record audio
2. Send to a speech-to-text API (Google Cloud Speech, Azure, etc.)
3. OR use a native module like `react-native-voice`

**Alternative**: For MVP, you can skip voice input and add it in V2.1.

---

### Step 15: Add Voice Input Buttons

**Create component**: `components/voice-input-button.tsx`

```typescript
import { Pressable, Text, View } from 'react-native';
import { useVoiceInput } from '@/hooks/use-voice-input';
import * as Haptics from 'expo-haptics';

export function VoiceInputButton({
  onTranscript,
}: {
  onTranscript: (text: string) => void;
}) {
  const { isRecording, transcript, startRecording, stopRecording } = useVoiceInput();

  function handlePressIn() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startRecording();
  }

  function handlePressOut() {
    stopRecording();
    if (transcript) {
      onTranscript(transcript);
    }
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="bg-surface border border-border rounded-full w-14 h-14 items-center justify-center"
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.95 : 1 }],
          backgroundColor: isRecording ? '#4CAF50' : undefined,
        },
      ]}
    >
      <Text className="text-2xl">{isRecording ? '🎙️' : '🎤'}</Text>
    </Pressable>
  );
}
```

**Add to all text input fields** in:
- Quick Log modal (achievement name, notes)
- Project Log modal (details)
- Create Project modal (project name, target)
- Tree Hole screen (main content)

---

### Step 16: Implement Category Management

**Create new file**: `app/manage-categories.tsx`

Features:
- List all categories (default + custom)
- Toggle visibility with checkbox
- Drag to reorder (use `react-native-draggable-flatlist`)
- Add new custom category
- Edit/delete custom categories (cannot delete defaults)

**Install drag library**:
```bash
pnpm add react-native-draggable-flatlist react-native-reanimated
```

**Key functions**:
```typescript
// Toggle visibility
await updateCategory(categoryId, { visible: !category.visible });

// Add custom category
await addCustomCategory({
  name: 'Creative',
  icon: '🎨',
  color: '#E91E63',
  visible: true,
});

// Delete custom category
await deleteCustomCategory(categoryId);
```

---

### Step 17: Add Settings Screens

**File**: `app/(tabs)/settings.tsx`

Menu items:
1. **Manage Categories** → Navigate to manage-categories screen
2. **Voice Input Language** → Show picker (Auto-detect, English, 中文, 日本語)
3. **Export Data** → Call `exportAllData()` and share
4. **Clear All Data** → Confirmation dialog + `clearAllData()`
5. **About** → Version, Privacy Policy links

**Export data implementation**:
```typescript
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

async function handleExport() {
  const data = await exportAllData();
  const filename = `good_lifer_export_${new Date().toISOString()}.json`;
  const filepath = `${FileSystem.documentDirectory}${filename}`;
  
  await FileSystem.writeAsStringAsync(filepath, data);
  await Sharing.shareAsync(filepath);
}
```

---

## Testing Checklist

After implementation, test these flows:

### Core Flows
- [ ] Quick achievement logging (4 taps)
- [ ] Project progress logging (5 taps)
- [ ] Tree hole entry (2 taps)
- [ ] View stats and drill down to specific day
- [ ] Create new project and log first progress

### Edge Cases
- [ ] Project completion (100% progress) shows celebration
- [ ] Greeting shows once per day only
- [ ] Streak calculation works correctly
- [ ] Data persists across app restarts
- [ ] Dark mode appearance

### Voice Input (if implemented)
- [ ] Hold-to-speak works in all text fields
- [ ] Transcript appears in real-time
- [ ] Can edit after voice input
- [ ] Works with English, Chinese, Japanese

### Category Management
- [ ] Can add custom categories
- [ ] Can hide/show categories
- [ ] Can reorder categories
- [ ] Cannot delete default categories
- [ ] Changes reflect in Quick Log

---

## Migration Strategy

Since data models changed, you need to migrate existing data:

**Create migration script**: `scripts/migrate-v1-to-v2.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function migrateV1ToV2() {
  // Load old data
  const oldAchievements = await AsyncStorage.getItem('@good_lifer:achievements');
  const oldCategories = await AsyncStorage.getItem('@good_lifer:categories');
  
  if (!oldAchievements) return; // No data to migrate

  const achievements = JSON.parse(oldAchievements);
  
  // Transform to new format
  const newAchievements = achievements.map((old: any) => ({
    id: old.id,
    categoryId: mapOldCategoryToNew(old.category),
    name: old.name,
    timeSpent: old.quantity * 60, // Convert hours to minutes
    notes: old.notes,
    date: old.date,
    createdAt: new Date(old.createdAt).toISOString(),
  }));

  // Save to new keys
  await AsyncStorage.setItem(
    '@good_lifer_achievements',
    JSON.stringify(newAchievements)
  );

  // Clear old keys
  await AsyncStorage.removeItem('@good_lifer:achievements');
  await AsyncStorage.removeItem('@good_lifer:categories');
}

function mapOldCategoryToNew(oldCategory: string): string {
  const mapping: Record<string, string> = {
    'study': 'learning',
    'reading': 'learning',
    'exercise': 'sports_exercise',
    'work': 'business',
    'meditation': 'learning',
    'other': 'business',
  };
  return mapping[oldCategory] || 'learning';
}
```

**Run migration** on app start (in `app/_layout.tsx`):

```typescript
useEffect(() => {
  migrateV1ToV2().catch(console.error);
}, []);
```

---

## Known Issues & Solutions

### Issue 1: TypeScript Errors After Storage Update

**Problem**: Old code references `achievement.category` and `achievement.quantity`

**Solution**: Update all references to:
- `achievement.category` → `achievement.categoryId`
- `achievement.quantity` → `achievement.timeSpent` (in minutes)

**Files to update**:
- `app/(tabs)/summary.tsx` (now stats.tsx)
- `app/(tabs)/tree-hole.tsx`
- Any other files using old Achievement interface

### Issue 2: Confetti Animation Performance

**Problem**: Confetti may cause lag on older devices

**Solution**: Use lightweight animation or skip on low-end devices:

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'ios' && Platform.Version >= 14) {
  // Show confetti
} else {
  // Just show modal without confetti
}
```

### Issue 3: Voice Input Requires Native Module

**Problem**: Expo doesn't have built-in speech-to-text

**Solution**: Either:
1. Use `expo-dev-client` and install `react-native-voice`
2. Use cloud API (Google Cloud Speech, Azure)
3. Skip voice input for MVP (add in V2.1)

---

## File Structure Reference

```
good-lifer/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx              # New home screen
│   │   ├── stats.tsx              # Renamed from summary.tsx
│   │   ├── projects.tsx           # NEW
│   │   └── settings.tsx           # Updated
│   ├── day-detail.tsx             # NEW
│   ├── tree-hole.tsx              # Updated (standalone)
│   └── manage-categories.tsx      # NEW
├── components/
│   ├── choose-log-type-modal.tsx  # NEW
│   ├── quick-log-modal.tsx        # NEW
│   ├── project-log-modal.tsx      # NEW
│   ├── create-project-modal.tsx   # NEW
│   ├── completion-celebration.tsx # NEW
│   └── voice-input-button.tsx     # NEW
├── hooks/
│   └── use-voice-input.ts         # NEW
├── lib/
│   └── storage.ts                 # UPDATED (complete rewrite)
├── scripts/
│   └── migrate-v1-to-v2.ts        # NEW
└── theme.config.js                # UPDATED
```

---

## Dependencies to Install

```bash
# Core dependencies (already installed)
pnpm add @react-native-async-storage/async-storage
pnpm add expo-haptics

# New dependencies for V2.0
pnpm add react-native-confetti
pnpm add react-native-draggable-flatlist
pnpm add @react-native-picker/picker
pnpm add expo-sharing

# Optional (for voice input)
pnpm add expo-av
# OR
pnpm add react-native-voice
```

---

## Performance Optimization Tips

1. **Lazy load modals**: Don't render modals until they're opened
2. **Memoize category lists**: Use `useMemo` for category filtering
3. **Virtualize project lists**: Use `FlatList` for projects screen
4. **Debounce voice input**: Wait 500ms after user stops speaking
5. **Cache stats calculations**: Store weekly/monthly stats in state

---

## Accessibility Considerations

1. **Voice input alternative**: Always provide keyboard input option
2. **Color contrast**: Ensure text meets WCAG AA standards
3. **Touch targets**: All buttons minimum 44x44px
4. **Screen reader labels**: Add `accessibilityLabel` to all interactive elements
5. **Haptic feedback**: Make optional in settings for users with sensitivity

---

## Next Steps After V2.0

**V2.1 Features** (Future):
- Cloud sync (optional)
- Widgets for iOS home screen
- Apple Watch companion app
- Siri Shortcuts integration
- Export to PDF/CSV
- Advanced analytics (charts, trends)
- Reminders/notifications
- Achievement badges/rewards

---

## Support & Resources

**Design Files**:
- `good-lifer-redesign-spec.md` - Complete design specification
- `good-lifer-user-flows.md` - Detailed user flow diagrams
- Wireframe images in `/home/ubuntu/redesign-*.png`

**Documentation**:
- Expo Router: https://docs.expo.dev/router/introduction/
- React Native: https://reactnative.dev/docs/getting-started
- NativeWind: https://www.nativewind.dev/

**Questions?**
- Refer back to design spec for UI details
- Check user flows for interaction patterns
- Test each phase before moving to next

---

**Good luck with implementation! 🚀**
