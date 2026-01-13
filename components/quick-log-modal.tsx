import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView, Alert, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { getVisibleCategories, addAchievement, Category, getTodayDate } from "@/lib/storage";

interface QuickLogModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuickLogModal({ visible, onClose, onSuccess }: QuickLogModalProps) {
  const colors = useColors();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [achievementName, setAchievementName] = useState("");
  const [timeMinutes, setTimeMinutes] = useState(30);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCategoriesData();
      // Reset form when opened
      setAchievementName("");
      setTimeMinutes(30);
      setNotes("");
      setShowNotes(false);
    }
  }, [visible]);

  async function loadCategoriesData() {
    const cats = await getVisibleCategories();
    setCategories(cats);
    if (cats.length > 0) {
      setSelectedCategory(cats[0].id);
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
    if (!achievementName.trim()) {
      Alert.alert("Error", "Please enter an achievement name");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    setIsSaving(true);

    try {
      const today = getTodayDate();
      
      // Convert time to quantity and unit based on the time
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
        category: selectedCategory,
        name: achievementName.trim(),
        quantity,
        unit,
        notes: notes.trim() || undefined,
      });

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Reset form
      setAchievementName("");
      setTimeMinutes(30);
      setNotes("");
      setShowNotes(false);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save achievement. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // Get first 3 categories
  const visibleCategories = categories.slice(0, 3);
  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

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
                  Quick Log
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

              {/* Category Selector - Horizontal with icons and labels below */}
              <View className="gap-2">
                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                  Category
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
                  {visibleCategories.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    const categoryEmoji = 
                      category.id === "study" || category.id === "reading" ? "📚" :
                      category.id === "exercise" ? "💪" :
                      category.id === "work" ? "💼" : "📝";
                    return (
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
                            opacity: isSelected ? 1 : 0.4,
                          }}
                        >
                          <Text className="text-2xl">{categoryEmoji}</Text>
                        </View>
                        <Text 
                          className="text-xs text-center"
                          style={{ 
                            color: isSelected ? colors.foreground : colors.muted,
                            fontWeight: isSelected ? "600" : "400",
                          }}
                        >
                          {category.name.length > 6 ? category.name.substring(0, 6) : category.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Pressable
                    onPress={() => {
                      Alert.alert("More Categories", "Coming soon - you can manage categories in Settings");
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
                    <Text className="text-xs text-center" style={{ color: colors.foreground }}>
                      More
                    </Text>
                  </Pressable>
                </ScrollView>
              </View>

              {/* Achievement Name - with voice button on the right */}
              <View className="gap-2">
                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                  Achievement Name
                </Text>
                <View className="flex-row gap-2 items-center">
                  <TextInput
                    value={achievementName}
                    onChangeText={setAchievementName}
                    placeholder="Completed homework"
                    placeholderTextColor={colors.muted}
                    className="flex-1 border rounded-xl p-4 text-base"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.foreground,
                      minHeight: 52,
                    }}
                    returnKeyType="done"
                    autoFocus
                  />
                  <Pressable
                    onPress={() => {
                      Alert.alert("Voice Input", "Hold to speak - coming soon!");
                    }}
                    className="w-14 h-14 rounded-full items-center justify-center border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    }}
                  >
                    <Text className="text-2xl">🎤</Text>
                  </Pressable>
                </View>
              </View>

              {/* Time Spent - with +/- buttons */}
              <View className="gap-2">
                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                  Time Spent
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

              {/* Notes (Collapsible) - shows ▼ Add Notes when collapsed */}
              {!showNotes && (
                <Pressable
                  onPress={() => setShowNotes(true)}
                  className="py-2"
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    ▼ Add Notes (Optional)
                  </Text>
                </Pressable>
              )}

              {showNotes && (
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                      Notes (Optional)
                    </Text>
                    <Pressable
                      onPress={() => setShowNotes(false)}
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      <Text className="text-sm" style={{ color: colors.muted }}>
                        ▲ Hide
                      </Text>
                    </Pressable>
                  </View>
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Any additional details..."
                    placeholderTextColor={colors.muted}
                    multiline
                    numberOfLines={3}
                    className="border rounded-xl p-4 text-base"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.foreground,
                      minHeight: 80,
                      textAlignVertical: "top",
                    }}
                  />
                </View>
              )}

              {/* Save Button - Full width */}
              <Pressable
                onPress={handleSave}
                disabled={isSaving}
                className="rounded-xl items-center justify-center py-4"
                style={({ pressed }) => ({
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : isSaving ? 0.6 : 1,
                  minHeight: 52,
                })}
              >
                <Text className="text-base font-semibold text-white">
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
