import { Ionicons } from "@expo/vector-icons";
import { FlashMode } from "expo-camera";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, spacing } from "../../styles/theme";

interface CameraControlsProps {
  onFlashToggle: () => void;
  onCameraFlip: () => void;
  flashMode: FlashMode;
  isCapturing: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  onFlashToggle,
  onCameraFlip,
  flashMode,
  isCapturing,
}) => {
  const isFlashOn = flashMode === "on";

  return (
    <View style={styles.container}>
      {/* Flash toggle button */}
      <TouchableOpacity
        style={[
          styles.controlButton,
          isCapturing && styles.controlButtonDisabled,
        ]}
        onPress={onFlashToggle}
        disabled={isCapturing}
      >
        <Ionicons
          name={isFlashOn ? "flash" : "flash-off"}
          size={24}
          color={colors.surface}
        />
      </TouchableOpacity>

      {/* Camera flip button */}
      <TouchableOpacity
        style={[
          styles.controlButton,
          isCapturing && styles.controlButtonDisabled,
        ]}
        onPress={onCameraFlip}
        disabled={isCapturing}
      >
        <Ionicons name="camera-reverse" size={24} color={colors.surface} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
});

export default CameraControls;
