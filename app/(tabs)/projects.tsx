import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { loadCategories, Project, Category, getActiveProjects, getCompletedProjects } from "@/lib/storage";
import { CreateProjectModal } from "@/components/create-project-modal";
import { ProjectLogModal } from "@/components/project-log-modal";

type ProjectTab = "active" | "completed";

export default function ProjectsScreen() {
  const colors = useColors();
  const [tab, setTab] = useState<ProjectTab>("active");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showProjectLog, setShowProjectLog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    const [cats, activeProjs, completedProjs] = await Promise.all([
      loadCategories(),
      getActiveProjects(),
      getCompletedProjects(),
    ]);
    
    setCategories(cats);
    setProjects(tab === "active" ? activeProjs : completedProjs);
  }

  function getCategoryById(id: string): Category | undefined {
    return categories.find((c) => c.id === id);
  }

  function formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = Math.round((minutes / 60) * 10) / 10;
    return `${hours}h`;
  }

  function formatUpdatedAt(timestamp: number): string {
    const updatedDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (formatDate(updatedDate) === formatDate(today)) {
      return "Updated today";
    } else if (formatDate(updatedDate) === formatDate(yesterday)) {
      return "Updated yesterday";
    } else {
      const daysAgo = Math.floor((today.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Updated ${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
    }
  }

  function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  function groupProjectsByCategory(projs: Project[]): Record<string, Project[]> {
    const grouped: Record<string, Project[]> = {};
    projs.forEach((project) => {
      if (!grouped[project.category]) {
        grouped[project.category] = [];
      }
      grouped[project.category].push(project);
    });
    return grouped;
  }

  function handleLogProgress(project: Project) {
    setSelectedProjectId(project.id);
    setShowProjectLog(true);
  }

  function handleCreateProject() {
    setShowCreateProject(true);
  }

  function getCategoryEmoji(categoryId: string): string {
    return categoryId === "study" || categoryId === "reading" ? "📚" :
           categoryId === "exercise" ? "💪" :
           categoryId === "work" ? "💼" : "📝";
  }

  const groupedProjects = groupProjectsByCategory(projects);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          {/* Header with + button */}
          <View className="flex-row items-center justify-between">
            <View className="gap-2">
              <Text className="text-3xl font-bold text-foreground">Projects</Text>
              <Text className="text-sm text-muted">Track your long-term goals</Text>
            </View>
            <Pressable
              onPress={handleCreateProject}
              className="w-12 h-12 rounded-full items-center justify-center"
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-2xl text-white font-bold">+</Text>
            </Pressable>
          </View>

          {/* Tab Switcher */}
          <View className="flex-row bg-surface rounded-2xl p-1 border border-border">
            <Pressable
              onPress={() => setTab("active")}
              className="flex-1 rounded-xl p-3 items-center"
              style={({ pressed }) => ({
                backgroundColor: tab === "active" ? colors.primary : "transparent",
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: tab === "active" ? "#FFFFFF" : colors.foreground }}
              >
                Active
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab("completed")}
              className="flex-1 rounded-xl p-3 items-center"
              style={({ pressed }) => ({
                backgroundColor: tab === "completed" ? colors.primary : "transparent",
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: tab === "completed" ? "#FFFFFF" : colors.foreground }}
              >
                Completed
              </Text>
            </Pressable>
          </View>

          {/* Projects List - Grouped by Category */}
          {projects.length === 0 ? (
            <View className="bg-surface rounded-2xl p-8 items-center border border-border">
              <Text className="text-6xl mb-4">{tab === "active" ? "📁" : "🏆"}</Text>
              <Text className="text-lg font-semibold text-foreground mb-2">
                {tab === "active" ? "No Active Projects" : "No Completed Projects"}
              </Text>
              <Text className="text-sm text-muted text-center">
                {tab === "active"
                  ? "Create a new project to start tracking your long-term goals"
                  : "Completed projects will appear here"}
              </Text>
            </View>
          ) : (
            <View className="gap-6">
              {Object.entries(groupedProjects).map(([categoryId, categoryProjects]) => {
                const category = getCategoryById(categoryId);
                return (
                  <View key={categoryId} className="gap-3">
                    {/* Category Header */}
                    <View className="flex-row items-center gap-2">
                      <Text className="text-lg">{getCategoryEmoji(categoryId)}</Text>
                      <Text className="text-base font-semibold text-foreground">
                        {category?.name || "Unknown"} ({categoryProjects.length})
                      </Text>
                    </View>

                    {/* Project Cards */}
                    {categoryProjects.map((project) => (
                      <View
                        key={project.id}
                        className="bg-surface rounded-2xl p-4 border border-border"
                      >
                        <View className="gap-3">
                          {/* Project Name */}
                          <View className="flex-row items-center gap-2">
                            <Text className="text-xl">
                              {getCategoryEmoji(project.category)}
                            </Text>
                            <Text className="text-lg font-semibold text-foreground flex-1">
                              {project.name}
                              {tab === "completed" && " 🏆"}
                            </Text>
                          </View>

                          {/* Progress Bar - Visual representation */}
                          <View className="gap-2">
                            <View className="flex-row items-center gap-2">
                              <View className="h-3 flex-1 bg-background rounded-full overflow-hidden">
                                <View
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${project.progress}%`,
                                    backgroundColor: category?.color || colors.primary,
                                  }}
                                />
                              </View>
                              <Text className="text-sm font-semibold text-foreground">
                                {project.progress}%
                              </Text>
                            </View>
                          </View>

                          {/* Footer - Time and Updated info */}
                          <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-muted">
                              {formatTime(project.totalTime)} • {formatUpdatedAt(project.updatedAt)}
                            </Text>
                            {tab === "active" && (
                              <Pressable
                                onPress={() => handleLogProgress(project)}
                                className="px-4 py-2 rounded-full"
                                style={({ pressed }) => ({
                                  backgroundColor: colors.primary,
                                  opacity: pressed ? 0.8 : 1,
                                })}
                              >
                                <Text className="text-sm font-semibold text-white">
                                  Log Progress
                                </Text>
                              </Pressable>
                            )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <CreateProjectModal
        visible={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        onSuccess={loadData}
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
