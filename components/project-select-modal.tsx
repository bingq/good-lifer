import { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { getActiveProjects, loadCategories, Project, Category } from "@/lib/storage";
import { CreateProjectModal } from "./create-project-modal";

interface ProjectSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
}

export function ProjectSelectModal({ visible, onClose, onSelectProject }: ProjectSelectModalProps) {
  const colors = useColors();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  async function loadData() {
    const [projs, cats] = await Promise.all([
      getActiveProjects(),
      loadCategories(),
    ]);
    setProjects(projs);
    setCategories(cats);
  }

  function getCategoryById(id: string): Category | undefined {
    return categories.find((c) => c.id === id);
  }

  function handleSelectProject(project: Project) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelectProject?.(project.id);
    onClose();
  }

  function handleCreateProject() {
    setShowCreateProject(true);
  }

  const categoryEmoji = (categoryId: string) => {
    return categoryId === "study" || categoryId === "reading" ? "📚" :
           categoryId === "exercise" ? "💪" :
           categoryId === "work" ? "💼" : "📝";
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View
            className="rounded-t-3xl p-6 pb-8"
            style={{ backgroundColor: colors.surface, maxHeight: "90%" }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-6">
                {/* Header */}
                <View className="flex-row justify-between items-center">
                  <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
                    Log for Project
                  </Text>
                  <Pressable
                    onPress={onClose}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    className="w-10 h-10 items-center justify-center"
                  >
                    <Text className="text-2xl" style={{ color: colors.muted }}>
                      ✕
                    </Text>
                  </Pressable>
                </View>

                {/* Select Project */}
                <View className="gap-3">
                  <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                    Select Project
                  </Text>
                  
                  {projects.length === 0 ? (
                    <View className="bg-background rounded-xl p-6 items-center border border-border">
                      <Text className="text-4xl mb-2">📁</Text>
                      <Text className="text-base font-semibold text-foreground mb-1">
                        No Active Projects
                      </Text>
                      <Text className="text-sm text-muted text-center">
                        Create a project to start tracking progress
                      </Text>
                    </View>
                  ) : (
                    <View className="gap-3">
                      {projects.map((project) => {
                        const category = getCategoryById(project.category);
                        return (
                          <Pressable
                            key={project.id}
                            onPress={() => handleSelectProject(project)}
                            className="border rounded-xl p-4"
                            style={({ pressed }) => ({
                              backgroundColor: colors.background,
                              borderColor: colors.border,
                              opacity: pressed ? 0.7 : 1,
                            })}
                          >
                            <View className="flex-row items-center gap-3">
                              <Text className="text-2xl">
                                {categoryEmoji(project.category)}
                              </Text>
                              <View className="flex-1 gap-1">
                                <Text className="text-lg font-semibold text-foreground">
                                  {project.name}
                                </Text>
                                <Text className="text-sm text-muted">
                                  Progress: {project.progress}% • {category?.name || "Unknown"}
                                </Text>
                              </View>
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}

                  {/* Create New Project Button */}
                  <Pressable
                    onPress={handleCreateProject}
                    className="border-2 border-dashed rounded-xl p-4 items-center"
                    style={({ pressed }) => ({
                      borderColor: colors.primary,
                      backgroundColor: colors.background,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text className="text-2xl mb-1">+</Text>
                    <Text className="text-base font-semibold" style={{ color: colors.primary }}>
                      Create New Project
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Create Project Modal */}
      <CreateProjectModal
        visible={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        onSuccess={() => {
          loadData();
          setShowCreateProject(false);
        }}
      />
    </>
  );
}

