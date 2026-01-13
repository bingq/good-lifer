import { useState, useRef } from "react";
import { View, Pressable, Text, Animated, Platform } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface VoiceInputButtonProps {
  onTranscript?: (text: string) => void;
  size?: number;
  disabled?: boolean;
}

export function VoiceInputButton({
  onTranscript,
  size = 56,
  disabled = false,
}: VoiceInputButtonProps) {
  const colors = useColors();
  const [isRecording, setIsRecording] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  async function handlePressIn() {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRecording(true);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // TODO: Integrate iOS Speech Recognition
    // For now, simulate transcription after a delay
    if (Platform.OS === "ios") {
      // Placeholder for future iOS Speech Recognition implementation
      // const recognition = new SpeechRecognition();
      // recognition.start();
    }
  }

  async function handlePressOut() {
    if (disabled || !isRecording) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRecording(false);
    scaleAnim.setValue(1);
    scaleAnim.stopAnimation();

    // TODO: Stop speech recognition and get transcript
    // For now, show placeholder
    if (onTranscript) {
      // Simulate transcript (remove in production)
      if (__DEV__) {
        onTranscript("[Voice input - iOS Speech Recognition coming soon]");
      }
    }
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={({ pressed }) => ({
        opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
      })}
    >
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isRecording ? colors.error : colors.primary,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale: scaleAnim }],
          shadowColor: isRecording ? colors.error : colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {isRecording ? (
          <View
            style={{
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: 4,
              backgroundColor: colors.surface,
            }}
          />
        ) : (
          <IconSymbol name="mic.fill" size={size * 0.4} color="#FFFFFF" />
        )}
      </Animated.View>
    </Pressable>
  );
}

