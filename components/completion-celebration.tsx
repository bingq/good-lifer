import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Project } from "@/lib/storage";

interface CompletionCelebrationProps {
  visible: boolean;
  project: Project | null;
  onClose: () => void;
}

export function CompletionCelebration({ visible, project, onClose }: CompletionCelebrationProps) {
  const colors = useColors();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (visible && project) {
      setShowConfetti(true);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      // Hide confetti after animation
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, project]);

  if (!project) return null;

  const totalHours = Math.round((project.totalTime / 60) * 10) / 10;
  const createdAt = new Date(project.createdAt);
  const completedAt = project.completedAt ? new Date(project.completedAt) : new Date();
  const daysDiff = Math.ceil((completedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className="rounded-3xl p-8 m-6 items-center"
          style={{ backgroundColor: colors.surface, maxWidth: 400 }}
        >
          {/* Confetti Animation (Emoji-based) */}
          {showConfetti && (
            <View className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <Text
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: 0.8,
                  }}
                >
                  {["🎉", "🎊", "✨", "🏆", "⭐"][Math.floor(Math.random() * 5)]}
                </Text>
              ))}
            </View>
          )}

          <Text className="text-6xl mb-4">🎉 🏆 🎉</Text>
          
          <Text className="text-3xl font-bold text-foreground mb-2 text-center">
            Project Completed!
          </Text>
          
          <Text className="text-xl text-foreground mb-6 text-center">
            {project.name}
          </Text>
          
          <View className="gap-2 mb-6">
            <Text className="text-base text-muted text-center">
              Total time: {totalHours} hours
            </Text>
            <Text className="text-base text-muted text-center">
              Completed in {daysDiff} day{daysDiff !== 1 ? "s" : ""}
            </Text>
          </View>
          
          <Pressable
            onPress={onClose}
            className="rounded-full px-8 py-4"
            style={({ pressed }) => ({
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text className="text-white font-semibold text-lg">Awesome!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

