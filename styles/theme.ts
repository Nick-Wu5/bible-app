import { StyleSheet } from "react-native";

// Color palette
export const colors = {
  // Primary colors
  primary: "#007AFF",
  primaryDark: "#0056CC",
  primaryLight: "#4DA3FF",

  // Background colors
  background: "#F2F2F7",
  surface: "#FFFFFF",

  // Text colors
  textPrimary: "#1C1C1E",
  textSecondary: "#8E8E93",
  textTertiary: "#C7C7CC",

  // Status colors
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  info: "#5AC8FA",

  // Border colors
  border: "#E5E5EA",
  borderLight: "#F2F2F7",

  // Tab bar colors
  tabBarActive: "#007AFF",
  tabBarInactive: "#8E8E93",
  tabBarBackground: "#FFFFFF",
};

// Typography
export const typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },

  // Font weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Common styles using StyleSheet.create for better performance
export const commonStyles = StyleSheet.create({
  // Screen containers
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Centered containers
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.md,
  },

  // Card containers
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },

  // Text styles
  text: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },

  textLarge: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  textMedium: {
    fontSize: typography.fontSize.lg,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  textSmall: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  // Button styles
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: "500",
  },

  // Input styles
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },

  // Section styles
  section: {
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Status styles
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  successText: {
    fontSize: typography.fontSize.sm,
    color: colors.success,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
