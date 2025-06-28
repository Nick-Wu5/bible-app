import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFAB } from "@/components/FAB";
import { borderRadius, colors, shadows, spacing } from "@/styles/theme";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<"front" | "back">("back");
  const [flashMode, setFlashMode] = useState<"on" | "off">("off");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { hideFAB, showFAB } = useFAB();

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    // Hide FAB when camera screen is active
    hideFAB();

    // Show FAB when leaving camera screen
    return () => {
      showFAB();
    };
  }, [hideFAB, showFAB]);

  useEffect(() => {
    console.log("📸 Camera permission status:", permission);

    // Request permission if not determined
    if (permission && permission.status === "undetermined") {
      requestPermission();
    }

    if (
      permission &&
      !permission.granted &&
      permission.status !== "undetermined"
    ) {
      Alert.alert(
        "Camera Permission Required",
        "Please grant camera permission to scan Bible verses.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              // This will open device settings
              console.log("Opening device settings...");
            },
          },
        ]
      );
    }
  }, [permission, requestPermission]);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        skipProcessing: false,
      });

      // For now, just show success and go back
      // We'll implement processing later
      Alert.alert(
        "Photo Captured",
        "Image captured successfully! Processing will be implemented soon.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error capturing photo:", error);
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFlashToggle = () => {
    setFlashMode(flashMode === "off" ? "on" : "off");
  };

  const handleCameraFlip = () => {
    setCameraType(cameraType === "back" ? "front" : "back");
  };

  const handleClose = () => {
    router.back();
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="camera" size={64} color={colors.textSecondary} />
        <Text style={styles.errorTitle}>Camera Access Denied</Text>
        <Text style={styles.errorText}>
          Please enable camera access in your device settings to scan Bible
          verses.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleClose}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        enableTorch={flashMode === "on"}
        ratio="4:3"
      >
        {/* <CameraOverlay /> */}

        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.controls}>
          <CameraControls
            onFlashToggle={handleFlashToggle}
            onCameraFlip={handleCameraFlip}
            flashMode={flashMode}
            isCapturing={isCapturing}
          />
        </View> */}

        <View style={styles.captureContainer}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              isCapturing && styles.captureButtonDisabled,
            ]}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator size="large" color={colors.surface} />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  controls: {
    position: "absolute",
    top: "50%",
    right: spacing.lg,
    transform: [{ translateY: -50 }],
    zIndex: 10,
  },
  captureContainer: {
    position: "absolute",
    bottom: spacing.xl,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.surface,
  },
});
