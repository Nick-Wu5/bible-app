import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { borderRadius, colors, shadows, spacing } from "../../styles/theme";

interface FABButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: "small" | "medium" | "large";
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const FABButton: React.FC<FABButtonProps> = ({
  onPress,
  icon = "camera",
  size = "large",
  color = colors.primary,
  disabled = false,
  style,
  accessibilityLabel = "Scan Bible verse",
  accessibilityHint = "Opens camera to scan underlined Bible verses",
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Size configurations
  const sizeConfig = {
    small: { width: 40, height: 40, iconSize: 20 },
    medium: { width: 48, height: 48, iconSize: 24 },
    large: { width: 56, height: 56, iconSize: 28 },
  };

  const { width, height, iconSize } = sizeConfig[size];

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
      opacity: opacity.value,
    };
  });

  // Press animation
  const handlePressIn = () => {
    if (disabled) return;

    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    rotation.value = withSequence(
      withSpring(-5, { damping: 15, stiffness: 300 }),
      withSpring(5, { damping: 15, stiffness: 300 }),
      withSpring(0, { damping: 15, stiffness: 300 })
    );

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (disabled) return;

    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled) return;

    // Success haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Call the onPress handler
    onPress();
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <Pressable
        style={[
          styles.button,
          {
            width,
            height,
            backgroundColor: disabled ? colors.textTertiary : color,
          },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <Ionicons
          name={icon}
          size={iconSize}
          color={colors.surface}
          style={styles.icon}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    zIndex: 1000,
  },
  button: {
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
    elevation: 8,
  },
  icon: {
    // Ensure icon is centered
  },
});

export default FABButton;
