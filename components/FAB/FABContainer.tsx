import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "../../styles/theme";
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
    right: spacing.xl,
    zIndex: 1000,
  },
});

export default FABContainer;
