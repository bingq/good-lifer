import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { getVisibleCategories, addProject, Category } from "@/lib/storage";
import { VoiceInputButton } from "@/components/voice-input-button";

interface CreateProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateProjectModal({ visible, onClose, onSuccess }: CreateProjectModalProps) {
  const colors = useColors();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [projectName, setProjectName] = useState("");
  const [target, setTarget] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCategoriesData();
    }
  }, [visible]);

  async function loadCategoriesData() {
    const cats = await getVisibleCategories();
    setCategories(cats);
    if (cats.length > 0) {
      setSelectedCategory(cats[0].id);
    }
  }

  async function handleCreate() {
    if (!projectName.trim()) {
      Alert.alert("Error", "Please enter a project name");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    setIsCreating(true);

    try {
      const newProject = await addProject({
        name: projectName.trim(),
        category: selectedCategory,
        progress: 0,
        totalTime: 0,
        target: target.trim() || undefined,
        status: "active",
      });

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Reset form
      setProjectName("");
      setTarget("");
      setSelectedCategory(categories.length > 0 ? categories[0].id : "");

      onSuccess?.();
      onClose();

      // TODO: Navigate to project log modal to log first progress
      // router.push({ pathname: "/project-log", params: { projectId: newProject.id } });
    } catch (error) {
      Alert.alert("Error", "Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  const visibleCategories = categories.slice(0, 3);

  return (
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
                  Create Project
                </Text>
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text className="text-2xl" style={{ color: colors.muted }}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              {/* Project Name */}
              <View className="gap-2">
                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                  Project Name
                </Text>
                <View className="flex-row gap-2">
                  <TextInput
                    value={projectName}
                    onChangeText={setProjectName}
                    placeholder="e.g., Read Atomic Habits"
                    placeholderTextColor={colors.muted}
                    className="flex-1 border rounded-xl p-4 text-lg"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.foreground,
                      minHeight: 52,
                    }}
                    returnKeyType="done"
                    autoFocus
                  />
                  <VoiceInputButton
                    onTranscript={(text) => {
                      setProjectName((prev) => prev + (prev ? " " : "") + text);
                    }}
                    size={52}
                  />
                </View>
              </View>

              {/* Category Selector */}
              <View className="gap-2">
                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                  Category
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
                  {visibleCategories.map((category) => (
                    <Pressable
                      key={category.id}
                      onPress={() => setSelectedCategory(category.id)}
                      className="items-center gap-1"
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      <View
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{
                          backgroundColor: category.color,
                          opacity: selectedCategory === category.id ? 1 : 0.4,
                        }}
                      >
                        <Text className="text-white text-2xl font-bold">
                          {category.name.charAt(0)}
                        </Text>
                      </View>
                      <Text className="text-xs" style={{ color: colors.foreground }}>
                        {category.name}
                      </Text>
                    </Pressable>
                  ))}
                  <Pressable
                    onPress={() => {
                      Alert.alert("More Categories", "Coming soon");
                    }}
                    className="items-center gap-1"
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                  >
                    <View
                      className="w-16 h-16 rounded-full items-center justify-center border-2"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                      }}
                    >
                      <Text className="text-2xl">+</Text>
                    </View>
                    <Text className="text-xs" style={{ color: colors.foreground }}>
                      More
                    </Text>
                  </Pressable>
                </ScrollView>
              </View>

              {/* Target (Optional) */}
              <View className="gap-2">
                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                  Target (Optional)
                </Text>
                <TextInput
                  value={target}
                  onChangeText={setTarget}
                  placeholder="e.g., Complete online course"
                  placeholderTextColor={colors.muted}
                  className="border rounded-xl p-4 text-base"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                    minHeight: 52,
                  }}
                  returnKeyType="done"
                  multiline
                />
              </View>

              {/* Create Button */}
              <Pressable
                onPress={handleCreate}
                disabled={isCreating}
                className="rounded-full items-center justify-center"
                style={({ pressed }) => ({
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : isCreating ? 0.6 : 1,
                  minHeight: 52,
                })}
              >
                <Text className="text-base font-semibold text-white py-3">
                  {isCreating ? "Creating..." : "Create Project"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

