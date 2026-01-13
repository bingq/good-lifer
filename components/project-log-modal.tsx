import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView, Alert, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import {
  getProjectById,
  updateProject,
  addAchievement,
  getTodayDate,
  Project,
} from "@/lib/storage";
import { CompletionCelebration } from "@/components/completion-celebration";
import { VoiceInputButton } from "@/components/voice-input-button";

interface ProjectLogModalProps {
  visible: boolean;
  onClose: () => void;
  projectId: string | null;
  onSuccess?: () => void;
}

const PROGRESS_OPTIONS = Array.from({ length: 21 }, (_, i) => i * 5); // 0, 5, 10, ..., 100

export function ProjectLogModal({ visible, onClose, projectId, onSuccess }: ProjectLogModalProps) {
  const colors = useColors();
  const [project, setProject] = useState<Project | null>(null);
  const [timeMinutes, setTimeMinutes] = useState(30);
  const [progress, setProgress] = useState(0);
  const [details, setDetails] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showProgressPicker, setShowProgressPicker] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedProject, setCompletedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (visible && projectId) {
      loadProject();
    }
  }, [visible, projectId]);

  useEffect(() => {
    if (project) {
      setProgress(project.progress);
    }
  }, [project]);

  async function loadProject() {
    if (!projectId) return;
    const proj = await getProjectById(projectId);
    setProject(proj);
    if (proj) {
      setProgress(proj.progress);
    }
  }

  function adjustTime(delta: number) {
    const newTime = timeMinutes + delta;
    if (newTime >= 15) {
      setTimeMinutes(newTime);
    }
  }

  function formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
    return `${hours}h ${mins}m`;
  }

  async function handleSave() {
    if (!project) {
      Alert.alert("Error", "Project not found");
      return;
    }

    setIsSaving(true);

    try {
      const today = getTodayDate();

      // Add achievement linked to project
      let quantity: number;
      let unit: string;
      if (timeMinutes >= 60) {
        quantity = Math.round((timeMinutes / 60) * 10) / 10;
        unit = "hours";
      } else {
        quantity = timeMinutes;
        unit = "minutes";
      }

      await addAchievement({
        date: today,
        category: project.category,
        name: project.name,
        quantity,
        unit,
        notes: details.trim() || undefined,
      });

      // Update project progress and total time
      const updatedProject = await updateProject(project.id, {
        progress,
        totalTime: project.totalTime + timeMinutes,
      });

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Check if project completed
      if (updatedProject && updatedProject.status === "completed" && project.status === "active") {
        setCompletedProject(updatedProject);
        setShowCelebration(true);
      } else {
        // Reset form and close only if not completed
        setTimeMinutes(30);
        setDetails("");
        setShowDetails(false);
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save progress. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!project) {
    return null;
  }

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
                <View className="flex-1">
                  <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
                    {project.name}
                  </Text>
                </View>
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text className="text-2xl" style={{ color: colors.muted }}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              {/* Time Spent Today */}
              <View className="gap-2">
                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                  Time Spent Today
                </Text>
                <View
                  className="flex-row items-center justify-between border rounded-xl p-4"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  }}
                >
                  <Pressable
                    onPress={() => adjustTime(-15)}
                    disabled={timeMinutes <= 15}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.6 : timeMinutes <= 15 ? 0.3 : 1,
                      minWidth: 44,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    })}
                  >
                    <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
                      −
                    </Text>
                  </Pressable>
                  <Text className="text-xl font-semibold" style={{ color: colors.foreground }}>
                    {formatTime(timeMinutes)}
                  </Text>
                  <Pressable
                    onPress={() => adjustTime(15)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.6 : 1,
                      minWidth: 44,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    })}
                  >
                    <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
                      +
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Update Progress - with rolling bar style */}
              <View className="gap-2">
                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                  Update Progress
                </Text>
                <Pressable
                  onPress={() => setShowProgressPicker(!showProgressPicker)}
                  className="border rounded-xl p-4"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold" style={{ color: colors.foreground }}>
                      {project.progress}% → {progress}%
                      {showProgressPicker && <Text className="text-sm text-muted"> (rolling)</Text>}
                    </Text>
                  </View>
                </Pressable>

                {showProgressPicker && (
                  <View className="gap-2">
                    <Text className="text-xs text-muted">Tap a percentage to select:</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="gap-2"
                    >
                      {PROGRESS_OPTIONS.map((percent) => (
                        <Pressable
                          key={percent}
                          onPress={() => {
                            setProgress(percent);
                            setShowProgressPicker(false);
                          }}
                          className="px-4 py-2 rounded-full border"
                          style={({
                            pressed,
                          }: {
                            pressed: boolean;
                          }) => ({
                            backgroundColor: progress === percent ? colors.primary : colors.background,
                            borderColor: progress === percent ? colors.primary : colors.border,
                            opacity: pressed ? 0.7 : 1,
                          })}
                        >
                          <Text
                            className="text-sm font-semibold"
                            style={{
                              color: progress === percent ? "#FFFFFF" : colors.foreground,
                            }}
                          >
                            {percent}%
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Today's Details (Optional) */}
              {!showDetails && (
                <Pressable
                  onPress={() => setShowDetails(true)}
                  className="py-3"
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    ▼ Today's Details (Optional)
                  </Text>
                </Pressable>
              )}

              {showDetails && (
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                      Today's Details (Optional)
                    </Text>
                    <Pressable
                      onPress={() => setShowDetails(false)}
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      <Text className="text-sm" style={{ color: colors.muted }}>
                        ▲ Hide
                      </Text>
                    </Pressable>
                  </View>
                  <View className="flex-row gap-2">
                    <TextInput
                      value={details}
                      onChangeText={setDetails}
                      placeholder="What did you accomplish today?"
                      placeholderTextColor={colors.muted}
                      className="flex-1 border rounded-xl p-4 text-base"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.foreground,
                        minHeight: 52,
                      }}
                      returnKeyType="done"
                      multiline
                    />
                    <View className="absolute bottom-4 right-4">
                      <VoiceInputButton
                        onTranscript={(text) => {
                          setDetails((prev) => prev + (prev ? " " : "") + text);
                        }}
                        size={48}
                      />
                    </View>
                    <View className="w-14 h-14" />
                    <Pressable
                      onPress={() => {
                        Alert.alert("Voice Input", "Coming soon");
                      }}
                      className="w-14 h-14 rounded-full items-center justify-center border opacity-0"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      }}
                    >
                      <Text className="text-2xl">🎤</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Save Button */}
              <Pressable
                onPress={handleSave}
                disabled={isSaving}
                className="rounded-full items-center justify-center"
                style={({ pressed }) => ({
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : isSaving ? 0.6 : 1,
                  minHeight: 52,
                })}
              >
                <Text className="text-base font-semibold text-white py-3">
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Celebration Modal */}
      <CompletionCelebration
        visible={showCelebration}
        project={completedProject}
        onClose={() => {
          setShowCelebration(false);
          setCompletedProject(null);
          // Reset form and close modal
          setTimeMinutes(30);
          setDetails("");
          setShowDetails(false);
          onSuccess?.();
          onClose();
        }}
      />
    </Modal>
  );
}

