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
    position: "absolute",
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
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
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.surface,
  },
  icon: {
    color: colors.textPrimary,
  },
  captureIcon: {
    color: colors.surface,
  },
});

export default CameraControls;
