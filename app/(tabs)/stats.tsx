import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  loadAchievements,
  loadCategories,
  Category,
  Achievement,
  getWeekDates,
  getMonthDates,
  getYearDates,
  formatDate,
} from "@/lib/storage";

type ViewMode = "weekly" | "monthly" | "yearly";

export default function StatsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadData();
  }, [currentDate, viewMode]);

  async function loadData() {
    const cats = await loadCategories();
    setCategories(cats);

    const allAchievements = await loadAchievements();
    
    let startDate: string, endDate: string;
    
    if (viewMode === "weekly") {
      const dates = getWeekDates(currentDate);
      startDate = dates.start;
      endDate = dates.end;
    } else if (viewMode === "monthly") {
      const dates = getMonthDates(currentDate);
      startDate = dates.start;
      endDate = dates.end;
    } else {
      const dates = getYearDates(currentDate);
      startDate = dates.start;
      endDate = dates.end;
    }

    const filtered = allAchievements.filter((a) => a.date >= startDate && a.date <= endDate);
    setAchievements(filtered);
  }

  function navigatePrevious() {
    const newDate = new Date(currentDate);
    if (viewMode === "weekly") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === "monthly") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  }

  function navigateNext() {
    const newDate = new Date(currentDate);
    if (viewMode === "weekly") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === "monthly") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  }

  function getCategoryStats() {
    const stats: { [key: string]: { count: number; time: number } } = {};
    
    achievements.forEach((achievement) => {
      if (!stats[achievement.category]) {
        stats[achievement.category] = { count: 0, time: 0 };
      }
      stats[achievement.category].count++;
      
      // Convert to minutes
      let minutes = 0;
      if (achievement.unit === "hours") {
        minutes = achievement.quantity * 60;
      } else if (achievement.unit === "minutes") {
        minutes = achievement.quantity;
      } else {
        minutes = 30; // Default estimate
      }
      stats[achievement.category].time += minutes;
    });

    return stats;
  }

  function getTotalTime(): number {
    let totalMinutes = 0;
    achievements.forEach((achievement) => {
      if (achievement.unit === "hours") {
        totalMinutes += achievement.quantity * 60;
      } else if (achievement.unit === "minutes") {
        totalMinutes += achievement.quantity;
      } else {
        totalMinutes += 30; // Default estimate
      }
    });
    return totalMinutes;
  }

  function getDateRangeText(): string {
    if (viewMode === "weekly") {
      const { start, end } = getWeekDates(currentDate);
      const startDate = new Date(start);
      const endDate = new Date(end);
      return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else if (viewMode === "monthly") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else {
      return currentDate.getFullYear().toString();
    }
  }

  function getWeekDays(): { date: string; count: number }[] {
    const { start } = getWeekDates(currentDate);
    const startDate = new Date(start);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = formatDate(date);
      const count = achievements.filter((a) => a.date === dateStr).length;
      days.push({ date: dateStr, count });
    }

    return days;
  }

  function handleDayPress(date: string) {
    router.push({
      pathname: "/day-detail",
      params: { date },
    } as any);
  }

  const categoryStats = getCategoryStats();
  const totalAchievements = achievements.length;
  const totalTime = getTotalTime();
  const totalHours = Math.round((totalTime / 60) * 10) / 10;
  const weekDays = viewMode === "weekly" ? getWeekDays() : [];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Stats</Text>
            <Text className="text-sm text-muted">Track your progress over time</Text>
          </View>

          {/* View Mode Selector */}
          <View className="flex-row bg-surface rounded-2xl p-1 border border-border">
            {(["weekly", "monthly", "yearly"] as ViewMode[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setViewMode(mode)}
                className="flex-1 rounded-xl p-3 items-center"
                style={({ pressed }) => ({
                  backgroundColor: viewMode === mode ? colors.primary : "transparent",
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text
                  className="text-sm font-semibold capitalize"
                  style={{ color: viewMode === mode ? "#FFFFFF" : colors.foreground }}
                >
                  {mode}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Date Navigator */}
          <View className="flex-row items-center justify-between bg-surface rounded-2xl p-4 border border-border">
            <Pressable
              onPress={navigatePrevious}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
            </Pressable>
            <Text className="text-lg font-semibold text-foreground">{getDateRangeText()}</Text>
            <Pressable
              onPress={navigateNext}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <IconSymbol name="chevron.right" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Total Achievements */}
          <View className="bg-surface rounded-2xl p-6 items-center border border-border">
            <Text className="text-sm text-muted mb-2">Total Achievements</Text>
            <Text className="text-5xl font-bold text-primary">{totalAchievements}</Text>
            {totalTime > 0 && (
              <Text className="text-base text-muted mt-2">Total Time: {totalHours} hours</Text>
            )}
          </View>

          {/* Category Breakdown */}
          {Object.keys(categoryStats).length > 0 && (
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-4">By Category</Text>
              <View className="gap-3">
                {Object.entries(categoryStats).map(([categoryId, stats]) => {
                  const category = categories.find((c) => c.id === categoryId);
                  const percentage = totalAchievements > 0 ? (stats.count / totalAchievements) * 100 : 0;
                  
                  return (
                    <View key={categoryId} className="gap-2">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2 flex-1">
                          <Text className="text-lg">
                            {categoryId === "study" || categoryId === "reading" ? "📚" : 
                             categoryId === "exercise" ? "💪" : 
                             categoryId === "work" ? "💼" : 
                             categoryId === "meditation" ? "🧘" : "📝"}
                          </Text>
                          <Text className="text-sm font-medium text-foreground">
                            {category?.name || "Unknown"}
                          </Text>
                          <Text className="text-sm text-muted">
                            {stats.count} ({Math.round(percentage)}%)
                          </Text>
                        </View>
                        {/* Visual bar representation */}
                        <View className="flex-row items-center gap-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <View
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: percentage > i * 10 ? (category?.color || colors.primary) : colors.background,
                              }}
                            />
                          ))}
                        </View>
                      </View>
                      <View className="h-2 bg-background rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: category?.color || colors.primary,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Weekly Day Breakdown */}
          {viewMode === "weekly" && weekDays.length > 0 && (
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-4">
                Daily Breakdown (Tap to view)
              </Text>
              <View className="flex-row justify-between">
                {weekDays.map((day, index) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                  const isToday = day.date === formatDate(new Date());
                  
                  return (
                    <Pressable
                      key={day.date}
                      onPress={() => handleDayPress(day.date)}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                      className="items-center gap-2"
                    >
                      <Text className="text-xs text-muted">{dayName}</Text>
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center border-2"
                        style={{
                          backgroundColor: day.count > 0 ? colors.primary : colors.background,
                          borderColor: isToday ? colors.primary : colors.border,
                        }}
                      >
                        <Text
                          className="text-base font-bold"
                          style={{ color: day.count > 0 ? "#FFFFFF" : colors.muted }}
                        >
                          {day.count}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Motivational Message */}
          {totalAchievements > 0 && (
            <View
              className="rounded-2xl p-6 items-center"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              <Text className="text-4xl mb-3">🏆</Text>
              <Text className="text-xl font-bold text-white mb-2">
                {viewMode === "weekly" && "Great week!"}
                {viewMode === "monthly" && "Fantastic month!"}
                {viewMode === "yearly" && "Amazing year!"}
              </Text>
              <Text className="text-base text-white/90 text-center">
                You logged {totalAchievements} achievement{totalAchievements !== 1 ? "s" : ""}. Keep up the great work!
              </Text>
            </View>
          )}

          {/* Empty State */}
          {totalAchievements === 0 && (
            <View className="bg-surface rounded-2xl p-8 items-center border border-border">
              <Text className="text-6xl mb-4">📊</Text>
              <Text className="text-lg font-semibold text-foreground mb-2">No Data Yet</Text>
              <Text className="text-sm text-muted text-center">
                Start logging achievements to see your progress here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
