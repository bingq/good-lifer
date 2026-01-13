import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { ChooseLogTypeModal } from "@/components/choose-log-type-modal";
import { QuickLogModal } from "@/components/quick-log-modal";
import { ProjectSelectModal } from "@/components/project-select-modal";
import { ProjectLogModal } from "@/components/project-log-modal";
import {
  shouldShowGreeting,
  markGreetingShown,
  getTodayStats,
  getWeekStats,
  getStreak,
  getActiveProjects,
} from "@/lib/storage";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [showGreeting, setShowGreeting] = useState(false);
  const [todayStats, setTodayStats] = useState({ count: 0, totalTime: 0 });
  const [weekStats, setWeekStats] = useState({ count: 0, totalTime: 0 });
  const [streak, setStreak] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [showChooseLogType, setShowChooseLogType] = useState(false);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showProjectSelect, setShowProjectSelect] = useState(false);
  const [showProjectLog, setShowProjectLog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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

  function getGreeting(): { text: string; emoji: string } {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning!", emoji: "🌿" };
    if (hour < 18) return { text: "Good afternoon!", emoji: "☀️" };
    return { text: "Good evening!", emoji: "🌙" };
  }

  function handleLogAchievement() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowChooseLogType(true);
  }

  function handleQuickLog() {
    setShowChooseLogType(false);
    setShowQuickLog(true);
  }

  function handleProjectLog() {
    setShowChooseLogType(false);
    setShowProjectSelect(true);
  }

  function handleSelectProject(projectId: string) {
    setSelectedProjectId(projectId);
    setShowProjectSelect(false);
    setShowProjectLog(true);
  }

  function handleTreeHole() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/tree-hole");
  }

  const totalHours = Math.round((todayStats.totalTime / 60) * 10) / 10; // Round to 1 decimal
  const greeting = getGreeting();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          {/* Header Section */}
          <View className="gap-2 mb-6">
            {showGreeting ? (
              <View>
                <Text className="text-4xl font-bold text-foreground">
                  {greeting.text} {greeting.emoji}
                </Text>
                <Text className="text-lg text-muted mt-2">Ready to make today count?</Text>
              </View>
            ) : (
              <View>
                <Text className="text-2xl font-semibold text-foreground">
                  Today: {todayStats.count} achievement{todayStats.count !== 1 ? "s" : ""}
                  {todayStats.totalTime > 0 && ` • ${totalHours}h`}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons - Centered and Prominent (Primary Focus) */}
          <View className="gap-4 justify-center mt-4">
            <Pressable
              onPress={handleLogAchievement}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                  minHeight: 80,
                  borderRadius: 16,
                  overflow: "hidden",
                },
              ]}
            >
              <LinearGradient
                colors={["#4CAF50", "#66BB6A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  minHeight: 80,
                  borderRadius: 16,
                  padding: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-2xl mb-2">📚</Text>
                <Text className="text-xl font-semibold text-white">Log Achievement</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={handleTreeHole}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                  minHeight: 80,
                  borderRadius: 16,
                  overflow: "hidden",
                },
              ]}
            >
              <LinearGradient
                colors={["#9C27B0", "#BA68C8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  minHeight: 80,
                  borderRadius: 16,
                  padding: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-2xl mb-2">🔒</Text>
                <Text className="text-xl font-semibold text-white">Tree Hole</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Quick Stats Bar */}
          <View className="flex-row gap-3 mt-8">
            <View
              className="flex-1 rounded-xl p-4"
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">📁</Text>
                <Text className="text-base font-semibold text-foreground">
                  Projects: {projectCount}
                </Text>
              </View>
            </View>
            <View
              className="flex-1 rounded-xl p-4"
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">📅</Text>
                <Text className="text-base font-semibold text-foreground">
                  Week: {weekStats.count}
                </Text>
              </View>
            </View>
            <View
              className="flex-1 rounded-xl p-4"
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-foreground">
                  Streak: {streak}
                </Text>
                {streak > 0 && <Text className="text-lg">🔥</Text>}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <ChooseLogTypeModal
        visible={showChooseLogType}
        onClose={() => setShowChooseLogType(false)}
        onQuickLog={handleQuickLog}
        onProjectLog={handleProjectLog}
      />
      <QuickLogModal
        visible={showQuickLog}
        onClose={() => setShowQuickLog(false)}
        onSuccess={loadData}
      />
      <ProjectSelectModal
        visible={showProjectSelect}
        onClose={() => setShowProjectSelect(false)}
        onSelectProject={handleSelectProject}
      />
      <ProjectLogModal
        visible={showProjectLog}
        onClose={() => {
          setShowProjectLog(false);
          setSelectedProjectId(null);
        }}
        projectId={selectedProjectId}
        onSuccess={loadData}
      />
    </ScreenContainer>
  );
}
