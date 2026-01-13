import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  getAchievementsByDate,
  getTreeHoleEntriesByDate,
  loadCategories,
  getProjectById,
  Category,
  Achievement,
  TreeHoleEntry,
  Project,
  formatDate,
} from "@/lib/storage";

export default function DayDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams();
  const date = (params.date as string) || formatDate(new Date());

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [treeHoleEntries, setTreeHoleEntries] = useState<TreeHoleEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Map<string, Project>>(new Map());
  const [selectedTreeHoleEntry, setSelectedTreeHoleEntry] = useState<TreeHoleEntry | null>(null);
  const [showTreeHoleModal, setShowTreeHoleModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [date]);

  async function loadData() {
    const [cats, achievementsForDate, entriesForDate] = await Promise.all([
      loadCategories(),
      getAchievementsByDate(date),
      getTreeHoleEntriesByDate(date),
    ]);

    setCategories(cats);
    setAchievements(achievementsForDate);
    setTreeHoleEntries(entriesForDate);

    // Load projects for achievements that have projectId
    const projectIds = new Set(
      achievementsForDate.map(a => a.projectId).filter((id): id is string => !!id)
    );
    const projectMap = new Map<string, Project>();
    await Promise.all(
      Array.from(projectIds).map(async (projectId) => {
        try {
          const project = await getProjectById(projectId);
          if (project) {
            projectMap.set(projectId, project);
          }
        } catch (error) {
          console.error(`Failed to load project ${projectId}:`, error);
        }
      })
    );
    setProjects(projectMap);
  }

  function getCategoryById(id: string): Category | undefined {
    return categories.find((c) => c.id === id);
  }

  function formatTime(quantity: number, unit: string): string {
    if (unit === "hours") {
      return `${quantity} hour${quantity !== 1 ? "s" : ""}`;
    } else if (unit === "minutes") {
      return `${quantity} min${quantity !== 1 ? "s" : ""}`;
    }
    return `${quantity} ${unit}`;
  }

  function groupAchievementsByCategory(achievements: Achievement[]): Record<string, Achievement[]> {
    const grouped: Record<string, Achievement[]> = {};
    achievements.forEach((achievement) => {
      if (!grouped[achievement.category]) {
        grouped[achievement.category] = [];
      }
      grouped[achievement.category].push(achievement);
    });
    return grouped;
  }

  function getTotalTime(): number {
    let totalMinutes = 0;
    achievements.forEach((achievement) => {
      if (achievement.unit === "hours") {
        totalMinutes += achievement.quantity * 60;
      } else if (achievement.unit === "minutes") {
        totalMinutes += achievement.quantity;
      } else {
        totalMinutes += 30;
      }
    });
    return totalMinutes;
  }

  function handleTreeHolePress(entry: TreeHoleEntry) {
    setSelectedTreeHoleEntry(entry);
    setShowTreeHoleModal(true);
  }

  const dateObj = new Date(date);
  const dateText = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const totalTime = getTotalTime();
  const totalHours = Math.round((totalTime / 60) * 10) / 10;
  const groupedAchievements = groupAchievementsByCategory(achievements);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          {/* Header */}
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
            </Pressable>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-foreground">{dateText}</Text>
            </View>
          </View>

          {/* Summary */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground">
              {achievements.length} Achievement{achievements.length !== 1 ? "s" : ""}
              {totalTime > 0 && ` • ${totalHours}h`}
            </Text>
          </View>

          {/* Achievements Grouped by Category */}
          {Object.keys(groupedAchievements).length > 0 && (
            <View className="gap-4">
              {Object.entries(groupedAchievements).map(([categoryId, categoryAchievements]) => {
                const category = getCategoryById(categoryId);
                return (
                  <View key={categoryId} className="gap-3">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-lg">
                        {categoryId === "study" || categoryId === "reading" ? "📚" : 
                         categoryId === "exercise" ? "💪" : 
                         categoryId === "work" ? "💼" : 
                         categoryId === "meditation" ? "🧘" : "📝"}
                      </Text>
                      <Text className="text-base font-semibold text-foreground">
                        {category?.name || "Unknown"} ({categoryAchievements.length})
                      </Text>
                    </View>
                    {categoryAchievements.map((achievement) => (
                      <View
                        key={achievement.id}
                        className="bg-surface rounded-2xl p-4 border border-border"
                      >
                        <View className="gap-2">
                          <Text className="text-lg font-semibold text-foreground">
                            {achievement.name}
                          </Text>
                          <View className="flex-row items-center gap-2 flex-wrap">
                            <Text className="text-sm text-muted">
                              {formatTime(achievement.quantity, achievement.unit)}
                            </Text>
                            {achievement.projectId && projects.has(achievement.projectId) && (
                              <View
                                className="px-2 py-1 rounded-full"
                                style={{ backgroundColor: category?.color + "20" }}
                              >
                                <Text className="text-xs font-medium" style={{ color: category?.color }}>
                                  📁 {projects.get(achievement.projectId)?.name}
                                </Text>
                              </View>
                            )}
                          </View>
                          {achievement.notes && (
                            <Text className="text-sm text-muted italic">
                              "{achievement.notes}"
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}

          {/* Tree Hole Entries */}
          {treeHoleEntries.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="lock.fill" size={20} color={colors.accent} />
                <Text className="text-base font-semibold text-foreground">
                  Tree Hole Entry{treeHoleEntries.length !== 1 ? "s" : ""}
                </Text>
              </View>
              {treeHoleEntries.map((entry) => {
                const firstLine = entry.content.split("\n")[0];
                const preview = firstLine.length > 60 ? firstLine.substring(0, 60) + "..." : firstLine;
                return (
                  <Pressable
                    key={entry.id}
                    onPress={() => handleTreeHolePress(entry)}
                    className="bg-surface rounded-2xl p-4 border border-border"
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <Text className="text-base text-foreground italic">
                      "{preview}"
                    </Text>
                    <Text className="text-xs text-muted mt-2">Tap to read full entry</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Empty State */}
          {achievements.length === 0 && treeHoleEntries.length === 0 && (
            <View className="bg-surface rounded-2xl p-8 items-center border border-border">
              <Text className="text-6xl mb-4">📅</Text>
              <Text className="text-lg font-semibold text-foreground mb-2">No Activity</Text>
              <Text className="text-sm text-muted text-center">
                No achievements or tree hole entries for this day
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Tree Hole Entry Modal */}
      <Modal
        visible={showTreeHoleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTreeHoleModal(false)}
      >
        <View className="flex-1 justify-center bg-black/50">
          <View
            className="rounded-3xl p-6 m-6"
            style={{ backgroundColor: colors.surface, maxHeight: "80%" }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <IconSymbol name="lock.fill" size={24} color={colors.accent} />
                    <Text className="text-xl font-bold text-foreground">Tree Hole Entry</Text>
                  </View>
                  <Pressable
                    onPress={() => setShowTreeHoleModal(false)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                  >
                    <Text className="text-2xl" style={{ color: colors.muted }}>
                      ✕
                    </Text>
                  </Pressable>
                </View>
                {selectedTreeHoleEntry && (
                  <>
                    <Text className="text-xs text-muted">
                      {new Date(selectedTreeHoleEntry.createdAt).toLocaleString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    <Text className="text-base text-foreground leading-6">
                      {selectedTreeHoleEntry.content}
                    </Text>
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

