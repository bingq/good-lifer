import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { addTreeHoleEntry, getTodayDate } from "@/lib/storage";

export default function TreeHoleScreen() {
  const colors = useColors();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>("");

  async function handleSave() {
    if (!content.trim()) {
      Alert.alert("Empty Entry", "Please write something before saving");
      return;
    }

    setIsSaving(true);

    try {
      const today = getTodayDate();
      await addTreeHoleEntry(content, today);

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      lastSavedContentRef.current = content;
      
      Alert.alert("Saved", "Your thoughts are safely stored", [
        {
          text: "OK",
          onPress: () => {
            setContent("");
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save your entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // Auto-save functionality for bedtime use
  useEffect(() => {
    if (content.trim() && content !== lastSavedContentRef.current) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Auto-save after 3 seconds of no typing
      autoSaveTimerRef.current = setTimeout(async () => {
        if (content.trim() && content !== lastSavedContentRef.current) {
          try {
            const today = getTodayDate();
            await addTreeHoleEntry(content, today);
            lastSavedContentRef.current = content;
            // Silent save - no alert to avoid disturbing sleep
          } catch (error) {
            console.error("Auto-save failed:", error);
          }
        }
      }, 3000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content]);

  const now = new Date();
  const timestamp = now.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ScreenContainer
      className="bg-accent/10"
      containerClassName="bg-accent/10"
    >
      <View className="flex-1 p-6">
        {/* Header with back button and close */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              className="w-10 h-10 items-center justify-center"
            >
              <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
            </Pressable>
            <View className="flex-row items-center gap-2">
              <IconSymbol name="lock.fill" size={28} color={colors.accent} />
              <Text className="text-3xl font-bold" style={{ color: colors.accent }}>
                Tree Hole
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              if (content.trim()) {
                Alert.alert("Discard changes?", "Are you sure you want to close without saving?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Discard", style: "destructive", onPress: () => router.back() },
                ]);
              } else {
                router.back();
              }
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            className="w-10 h-10 items-center justify-center"
          >
            <Text className="text-2xl" style={{ color: colors.muted }}>
              ✕
            </Text>
          </Pressable>
        </View>

        {/* Privacy Message */}
        <View className="bg-surface rounded-2xl p-4 mb-6 border border-border">
          <Text className="text-sm text-muted text-center leading-5">
            Your private space for regrets, struggles, and difficult feelings
          </Text>
        </View>

        {/* Text Editor - Large area with microphone button in bottom-right */}
        <View className="flex-1 bg-surface rounded-2xl p-4 border border-border relative">
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="What's weighing on your mind today?&#10;&#10;This is your safe space. Your thoughts are automatically saved..."
              placeholderTextColor={colors.muted}
              multiline
              className="text-lg text-foreground flex-1"
              style={{
                minHeight: 400,
                textAlignVertical: "top",
                lineHeight: 28,
                paddingBottom: 60, // Space for microphone button
              }}
              autoFocus={false}
            />
          </ScrollView>
          
          {/* Microphone button in bottom-right */}
          <Pressable
            onPress={() => {
              Alert.alert("Voice Input", "Hold to speak - coming soon!");
            }}
            className="absolute bottom-4 right-4 w-14 h-14 rounded-full items-center justify-center border-2"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.accent,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text className="text-2xl">🎤</Text>
          </Pressable>
        </View>

        {/* Bottom Actions */}
        <View className="flex-row gap-3 mt-6">
          <Pressable
            onPress={() => {
              if (content.trim()) {
                Alert.alert("Clear", "Clear what you've written?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Clear",
                    style: "destructive",
                    onPress: () => {
                      setContent("");
                      lastSavedContentRef.current = "";
                    },
                  },
                ]);
              }
            }}
            className="flex-1 bg-background border border-border rounded-full items-center justify-center"
            style={({ pressed }) => ({ 
              opacity: pressed ? 0.6 : 1,
              minHeight: 52,
            })}
            disabled={!content.trim()}
          >
            <Text
              className="text-base font-semibold py-3"
              style={{ color: content.trim() ? colors.foreground : colors.muted }}
            >
              Clear
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            className="flex-1 rounded-full items-center justify-center"
            style={({ pressed }) => ({
              backgroundColor: colors.accent,
              opacity: pressed ? 0.8 : isSaving ? 0.6 : 1,
              minHeight: 52,
            })}
            disabled={isSaving || !content.trim()}
          >
            <Text className="text-base font-semibold text-white py-3">
              {isSaving ? "Saving..." : "Save"}
            </Text>
          </Pressable>
        </View>
        
        {/* Auto-save indicator */}
        {content.trim() && content === lastSavedContentRef.current && (
          <Text className="text-xs text-muted text-center mt-2">
            ✓ Auto-saved
          </Text>
        )}

        {/* Timestamp */}
        <Text className="text-xs text-muted text-center mt-4">
          {timestamp}
        </Text>
      </View>
    </ScreenContainer>
  );
}
