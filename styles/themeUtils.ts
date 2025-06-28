import { StyleSheet } from "react-native";
import { borderRadius, colors, shadows, spacing, typography } from "./theme";

// Cached StyleSheet styles for better performance
const cachedStyles = StyleSheet.create({
  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },

  // Button base styles
  buttonBase: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  // Button variants
  buttonPrimary: {
    backgroundColor: colors.primary,
  },

  buttonSecondary: {
    backgroundColor: colors.textSecondary,
  },

  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },

  // Text styles by size
  textXs: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
  },

  textSm: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },

  textBase: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },

  textLg: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.lg,
  },

  textXl: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xl,
  },

  text2xl: {
    fontSize: typography.fontSize["2xl"],
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize["2xl"],
  },

  text3xl: {
    fontSize: typography.fontSize["3xl"],
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize["3xl"],
  },

  text4xl: {
    fontSize: typography.fontSize["4xl"],
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize["4xl"],
  },

  // Flex utilities
  flexCenter: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },

  flexRow: {
    flexDirection: "row" as const,
  },

  flexColumn: {
    flexDirection: "column" as const,
  },

  // Spacing utilities (cached for common sizes)
  marginXs: { margin: spacing.xs },
  marginSm: { margin: spacing.sm },
  marginMd: { margin: spacing.md },
  marginLg: { margin: spacing.lg },
  marginXl: { margin: spacing.xl },
  margin2xl: { margin: spacing["2xl"] },
  margin3xl: { margin: spacing["3xl"] },

  marginVerticalXs: { marginVertical: spacing.xs },
  marginVerticalSm: { marginVertical: spacing.sm },
  marginVerticalMd: { marginVertical: spacing.md },
  marginVerticalLg: { marginVertical: spacing.lg },
  marginVerticalXl: { marginVertical: spacing.xl },
  marginVertical2xl: { marginVertical: spacing["2xl"] },
  marginVertical3xl: { marginVertical: spacing["3xl"] },

  marginHorizontalXs: { marginHorizontal: spacing.xs },
  marginHorizontalSm: { marginHorizontal: spacing.sm },
  marginHorizontalMd: { marginHorizontal: spacing.md },
  marginHorizontalLg: { marginHorizontal: spacing.lg },
  marginHorizontalXl: { marginHorizontal: spacing.xl },
  marginHorizontal2xl: { marginHorizontal: spacing["2xl"] },
  marginHorizontal3xl: { marginHorizontal: spacing["3xl"] },

  marginBottomXs: { marginBottom: spacing.xs },
  marginBottomSm: { marginBottom: spacing.sm },
  marginBottomMd: { marginBottom: spacing.md },
  marginBottomLg: { marginBottom: spacing.lg },
  marginBottomXl: { marginBottom: spacing.xl },
  marginBottom2xl: { marginBottom: spacing["2xl"] },
  marginBottom3xl: { marginBottom: spacing["3xl"] },

  marginTopXs: { marginTop: spacing.xs },
  marginTopSm: { marginTop: spacing.sm },
  marginTopMd: { marginTop: spacing.md },
  marginTopLg: { marginTop: spacing.lg },
  marginTopXl: { marginTop: spacing.xl },
  marginTop2xl: { marginTop: spacing["2xl"] },
  marginTop3xl: { marginTop: spacing["3xl"] },

  paddingXs: { padding: spacing.xs },
  paddingSm: { padding: spacing.sm },
  paddingMd: { padding: spacing.md },
  paddingLg: { padding: spacing.lg },
  paddingXl: { padding: spacing.xl },
  padding2xl: { padding: spacing["2xl"] },
  padding3xl: { padding: spacing["3xl"] },

  paddingVerticalXs: { paddingVertical: spacing.xs },
  paddingVerticalSm: { paddingVertical: spacing.sm },
  paddingVerticalMd: { paddingVertical: spacing.md },
  paddingVerticalLg: { paddingVertical: spacing.lg },
  paddingVerticalXl: { paddingVertical: spacing.xl },
  paddingVertical2xl: { paddingVertical: spacing["2xl"] },
  paddingVertical3xl: { paddingVertical: spacing["3xl"] },

  paddingHorizontalXs: { paddingHorizontal: spacing.xs },
  paddingHorizontalSm: { paddingHorizontal: spacing.sm },
  paddingHorizontalMd: { paddingHorizontal: spacing.md },
  paddingHorizontalLg: { paddingHorizontal: spacing.lg },
  paddingHorizontalXl: { paddingHorizontal: spacing.xl },
  paddingHorizontal2xl: { paddingHorizontal: spacing["2xl"] },
  paddingHorizontal3xl: { paddingHorizontal: spacing["3xl"] },
});

// Optimized utility functions
export const themeUtils = {
  // Create a card with consistent styling (now cached)
  createCard: (additionalStyles = {}) => ({
    ...cachedStyles.card,
    ...additionalStyles,
  }),

  // Create a button with consistent styling (now cached)
  createButton: (
    variant: "primary" | "secondary" | "outline" = "primary",
    additionalStyles = {}
  ) => {
    const baseButton = cachedStyles.buttonBase;

    switch (variant) {
      case "primary":
        return {
          ...baseButton,
          ...cachedStyles.buttonPrimary,
          ...additionalStyles,
        };
      case "secondary":
        return {
          ...baseButton,
          ...cachedStyles.buttonSecondary,
          ...additionalStyles,
        };
      case "outline":
        return {
          ...baseButton,
          ...cachedStyles.buttonOutline,
          ...additionalStyles,
        };
    }
  },

  // Create text styles with consistent typography (now cached)
  createText: (
    size: keyof typeof typography.fontSize = "base",
    additionalStyles = {}
  ) => {
    const sizeMap = {
      xs: cachedStyles.textXs,
      sm: cachedStyles.textSm,
      base: cachedStyles.textBase,
      lg: cachedStyles.textLg,
      xl: cachedStyles.textXl,
      "2xl": cachedStyles.text2xl,
      "3xl": cachedStyles.text3xl,
      "4xl": cachedStyles.text4xl,
    };

    return {
      ...sizeMap[size],
      ...additionalStyles,
    };
  },

  // Optimized spacing utilities (using cached styles)
  spacing: {
    margin: (size: keyof typeof spacing) => {
      const sizeMap = {
        xs: cachedStyles.marginXs,
        sm: cachedStyles.marginSm,
        md: cachedStyles.marginMd,
        lg: cachedStyles.marginLg,
        xl: cachedStyles.marginXl,
        "2xl": cachedStyles.margin2xl,
        "3xl": cachedStyles.margin3xl,
      };
      return sizeMap[size];
    },

    marginVertical: (size: keyof typeof spacing) => {
      const sizeMap = {
        xs: cachedStyles.marginVerticalXs,
        sm: cachedStyles.marginVerticalSm,
        md: cachedStyles.marginVerticalMd,
        lg: cachedStyles.marginVerticalLg,
        xl: cachedStyles.marginVerticalXl,
        "2xl": cachedStyles.marginVertical2xl,
        "3xl": cachedStyles.marginVertical3xl,
      };
      return sizeMap[size];
    },

    marginHorizontal: (size: keyof typeof spacing) => {
      const sizeMap = {
        xs: cachedStyles.marginHorizontalXs,
        sm: cachedStyles.marginHorizontalSm,
        md: cachedStyles.marginHorizontalMd,
        lg: cachedStyles.marginHorizontalLg,
        xl: cachedStyles.marginHorizontalXl,
        "2xl": cachedStyles.marginHorizontal2xl,
        "3xl": cachedStyles.marginHorizontal3xl,
      };
      return sizeMap[size];
    },

    marginBottom: (size: keyof typeof spacing) => {
      const sizeMap = {
        xs: cachedStyles.marginBottomXs,
        sm: cachedStyles.marginBottomSm,
        md: cachedStyles.marginBottomMd,
        lg: cachedStyles.marginBottomLg,
        xl: cachedStyles.marginBottomXl,
        "2xl": cachedStyles.marginBottom2xl,
        "3xl": cachedStyles.marginBottom3xl,
      };
      return sizeMap[size];
    },

    marginTop: (size: keyof typeof spacing) => {
      const sizeMap = {
        xs: cachedStyles.marginTopXs,
        sm: cachedStyles.marginTopSm,
        md: cachedStyles.marginTopMd,
        lg: cachedStyles.marginTopLg,
        xl: cachedStyles.marginTopXl,
        "2xl": cachedStyles.marginTop2xl,
        "3xl": cachedStyles.marginTop3xl,
      };
      return sizeMap[size];
    },

    padding: (size: keyof typeof spacing) => {
      const sizeMap = {
        xs: cachedStyles.paddingXs,
        sm: cachedStyles.paddingSm,
        md: cachedStyles.paddingMd,
        lg: cachedStyles.paddingLg,
        xl: cachedStyles.paddingXl,
        "2xl": cachedStyles.padding2xl,
        "3xl": cachedStyles.padding3xl,
      };
      return sizeMap[size];
    },

    paddingVertical: (size: keyof typeof spacing) => {
      const sizeMap = {
        xs: cachedStyles.paddingVerticalXs,
        sm: cachedStyles.paddingVerticalSm,
        md: cachedStyles.paddingVerticalMd,
        lg: cachedStyles.paddingVerticalLg,
        xl: cachedStyles.paddingVerticalXl,
        "2xl": cachedStyles.paddingVertical2xl,
        "3xl": cachedStyles.paddingVertical3xl,
      };
      return sizeMap[size];
    },

    paddingHorizontal: (size: keyof typeof spacing) => {
      const sizeMap = {
        xs: cachedStyles.paddingHorizontalXs,
        sm: cachedStyles.paddingHorizontalSm,
        md: cachedStyles.paddingHorizontalMd,
        lg: cachedStyles.paddingHorizontalLg,
        xl: cachedStyles.paddingHorizontalXl,
        "2xl": cachedStyles.paddingHorizontal2xl,
        "3xl": cachedStyles.paddingHorizontal3xl,
      };
      return sizeMap[size];
    },
  },

  // Optimized flex utilities (using cached styles)
  flex: {
    center: cachedStyles.flexCenter,
    row: cachedStyles.flexRow,
    column: cachedStyles.flexColumn,
  },

  // Direct access to cached styles for maximum performance
  styles: cachedStyles,
};

// Example usage patterns (now using cached styles)
export const exampleUsage = {
  // Example: Creating a verse card
  verseCard: {
    ...cachedStyles.card,
    ...cachedStyles.paddingLg,
  },

  // Example: Creating a primary button
  primaryButton: {
    ...cachedStyles.buttonBase,
    ...cachedStyles.buttonPrimary,
  },

  // Example: Creating a large title
  largeTitle: {
    ...cachedStyles.text2xl,
    fontWeight: "600" as const,
    ...cachedStyles.marginBottomLg,
  },

  // Example: Creating a flex container
  flexCenter: {
    ...cachedStyles.flexCenter,
    backgroundColor: colors.background,
  },
};

// Performance comparison utilities
export const performanceUtils = {
  // Use this for maximum performance when you know the exact style you need
  getCachedStyle: (styleName: keyof typeof cachedStyles) =>
    cachedStyles[styleName],

  // Use this for dynamic styles that can't be cached
  createDynamicStyle: (dynamicStyles: any) => dynamicStyles,

  // Use this to combine cached and dynamic styles efficiently
  combineStyles: (cachedStyle: any, dynamicStyles: any) => ({
    ...cachedStyle,
    ...dynamicStyles,
  }),
};
