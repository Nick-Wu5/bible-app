import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../../styles/theme";
import { themeUtils } from "../../styles/themeUtils";

const CameraOverlay: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Scanning guide lines */}
      <View style={styles.guideContainer}>
        {/* Top guide line */}
        <View style={styles.guideLine} />

        {/* Center scanning area */}
        <View style={styles.scanningArea}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>

        {/* Bottom guide line */}
        <View style={styles.guideLine} />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionText}>
          Position underlined Bible verses within the frame
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scanArea: {
    width: 300,
    height: 200,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  guideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  guideLine: {
    width: "80%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginVertical: spacing.xl,
  },
  scanningArea: {
    width: "85%",
    height: 200,
    position: "relative",
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  instructionText: {
    ...themeUtils.styles.textBase,
    color: colors.surface,
    textAlign: "center",
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
});

export default CameraOverlay;
