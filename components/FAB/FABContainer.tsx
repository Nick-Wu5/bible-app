import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../../styles/theme";
import FABButton from "./FABButton";

interface FABContainerProps {
  onPress: () => void;
  disabled?: boolean;
  visible?: boolean;
}

const FABContainer: React.FC<FABContainerProps> = ({
  onPress,
  disabled = false,
  visible = true,
}) => {
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          bottom: Math.max(spacing.xl, insets.bottom + spacing.xl + 49), // 49px is typical tab bar height
        },
      ]}
      pointerEvents="box-none"
    >
      <FABButton
        onPress={onPress}
        disabled={disabled}
        icon="camera"
        size="large"
        accessibilityLabel="Scan Bible verse"
        accessibilityHint="Opens camera to scan underlined Bible verses"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
  },
});

export default FABContainer;
