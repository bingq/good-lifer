import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeContext } from "@/lib/theme-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { colorScheme, setColorScheme } = useThemeContext();

  async function handleExportData() {
    try {
      const achievements = await AsyncStorage.getItem("@good_lifer:achievements");
      const treeHoleEntries = await AsyncStorage.getItem("@good_lifer:tree_hole_entries");
      const categories = await AsyncStorage.getItem("@good_lifer:categories");
      const projects = await AsyncStorage.getItem("@good_lifer:projects");

      const exportData = {
        achievements: achievements ? JSON.parse(achievements) : [],
        treeHoleEntries: treeHoleEntries ? JSON.parse(treeHoleEntries) : [],
        categories: categories ? JSON.parse(categories) : [],
        projects: projects ? JSON.parse(projects) : [],
        exportedAt: new Date().toISOString(),
      };

      Alert.alert(
        "Export Data",
        `Your data has been prepared for export.\n\nAchievements: ${exportData.achievements.length}\nTree Hole Entries: ${exportData.treeHoleEntries.length}\nProjects: ${exportData.projects.length}\n\nNote: In a production app, this would save to a file or cloud storage.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to export data");
    }
  }

  async function handleClearAllData() {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your achievements, tree hole entries, and projects. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                "@good_lifer:achievements",
                "@good_lifer:tree_hole_entries",
                "@good_lifer:categories",
                "@good_lifer:user_profile",
                "@good_lifer:projects",
                "@good_lifer:greeting_shown",
              ]);
              Alert.alert("Success", "All data has been cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  }

  function handleManageCategories() {
    router.push("/manage-categories" as any);
  }

  async function handleToggleTheme() {
    const newScheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newScheme);
    // Save preference
    try {
      await AsyncStorage.setItem("@good_lifer:theme", newScheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  }

  useEffect(() => {
    // Load saved theme preference
    AsyncStorage.getItem("@good_lifer:theme").then((savedTheme) => {
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        setColorScheme(savedTheme as "light" | "dark");
      }
    });
  }, []);

  function handleVoiceInputSettings() {
    Alert.alert("Voice Input Language", "Coming soon - this will let you select language preferences");
  }

  function handlePrivacyPolicy() {
    Alert.alert("Privacy Policy", "Good Lifer stores all data locally. We don't collect, store, or share any information.");
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
            <Text className="text-sm text-muted">Manage your app preferences</Text>
          </View>

          {/* Appearance */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Appearance</Text>
            <Pressable
              onPress={handleToggleTheme}
              className="flex-row items-center justify-between p-3 bg-background rounded-xl"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <View className="flex-1 gap-1">
                <Text className="text-base font-semibold text-foreground">Theme</Text>
                <Text className="text-sm text-muted">
                  {colorScheme === "dark" ? "Dark Mode" : "Light Mode"}
                </Text>
              </View>
              <View className="w-10 h-6 rounded-full bg-muted items-center justify-center">
                <View
                  className="w-5 h-5 rounded-full absolute"
                  style={{
                    backgroundColor: colors.surface,
                    left: colorScheme === "dark" ? 18 : 2,
                  }}
                />
              </View>
            </Pressable>
          </View>

          {/* Categories */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Categories</Text>
            <Pressable
              onPress={handleManageCategories}
              className="flex-row items-center justify-between p-3 bg-background rounded-xl"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <View className="flex-1 gap-1">
                <Text className="text-base font-semibold text-foreground">Manage Categories</Text>
                <Text className="text-sm text-muted">Customize your categories</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </Pressable>
          </View>

          {/* Voice Input */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Voice Input</Text>
            <Pressable
              onPress={handleVoiceInputSettings}
              className="flex-row items-center justify-between p-3 bg-background rounded-xl"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <View className="flex-1 gap-1">
                <Text className="text-base font-semibold text-foreground">Language: Auto-detect</Text>
                <Text className="text-sm text-muted">(English, 中文, 日本語)</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </Pressable>
          </View>

          {/* Data Management */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Data Management</Text>
            <View className="gap-3">
              <Pressable
                onPress={handleExportData}
                className="flex-row items-center justify-between p-3 bg-background rounded-xl"
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text className="text-base text-foreground">Export Data</Text>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </Pressable>

              <Pressable
                onPress={handleClearAllData}
                className="flex-row items-center justify-between p-3 bg-background rounded-xl"
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text className="text-base" style={{ color: colors.error }}>
                  Clear All Data
                </Text>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </Pressable>
            </View>
          </View>

          {/* About */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">About</Text>
            <View className="gap-3">
              <Pressable
                onPress={() => {}}
                className="flex-row items-center justify-between p-3 bg-background rounded-xl"
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text className="text-base text-foreground">Version 2.0.0</Text>
              </Pressable>
              <Pressable
                onPress={handlePrivacyPolicy}
                className="flex-row items-center justify-between p-3 bg-background rounded-xl"
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text className="text-base text-foreground">Privacy Policy</Text>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center py-4">
            <Text className="text-xs text-muted text-center">
              Made with 💚 for your personal growth
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
