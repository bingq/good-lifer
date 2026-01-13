import { View, Text, Pressable, Modal, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface ChooseLogTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onQuickLog: () => void;
  onProjectLog: () => void;
}

export function ChooseLogTypeModal({
  visible,
  onClose,
  onQuickLog,
  onProjectLog,
}: ChooseLogTypeModalProps) {
  const colors = useColors();

  function handleQuickLog() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onQuickLog();
  }

  function handleProjectLog() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onProjectLog();
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
          className="rounded-t-3xl p-6"
          style={{ backgroundColor: colors.surface }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
              Log Achievement
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

          <View className="gap-4">
            <Pressable
              onPress={handleQuickLog}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 16,
                  padding: 20,
                },
              ]}
            >
              <Text className="text-xl font-semibold" style={{ color: colors.foreground }}>
                ⚡ Quick Log
              </Text>
              <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                One-time achievement
              </Text>
            </Pressable>

            <Pressable
              onPress={handleProjectLog}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 16,
                  padding: 20,
                },
              ]}
            >
              <Text className="text-xl font-semibold" style={{ color: colors.foreground }}>
                📁 Log for Project
              </Text>
              <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                Track progress on a goal
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
