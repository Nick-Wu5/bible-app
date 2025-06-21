import { borderRadius, colors, shadows, spacing, typography } from "./theme";

// Utility functions for common style patterns
export const themeUtils = {
  // Create a card with consistent styling
  createCard: (additionalStyles = {}) => ({
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
    ...additionalStyles,
  }),

  // Create a button with consistent styling
  createButton: (
    variant: "primary" | "secondary" | "outline" = "primary",
    additionalStyles = {}
  ) => {
    const baseButton = {
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseButton,
          backgroundColor: colors.primary,
          ...additionalStyles,
        };
      case "secondary":
        return {
          ...baseButton,
          backgroundColor: colors.textSecondary,
          ...additionalStyles,
        };
      case "outline":
        return {
          ...baseButton,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.primary,
          ...additionalStyles,
        };
    }
  },

  // Create text styles with consistent typography
  createText: (
    size: keyof typeof typography.fontSize = "base",
    additionalStyles = {}
  ) => ({
    fontSize: typography.fontSize[size],
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize[size],
    ...additionalStyles,
  }),

  // Create spacing utilities
  spacing: {
    margin: (size: keyof typeof spacing) => ({ margin: spacing[size] }),
    marginVertical: (size: keyof typeof spacing) => ({
      marginVertical: spacing[size],
    }),
    marginHorizontal: (size: keyof typeof spacing) => ({
      marginHorizontal: spacing[size],
    }),
    marginBottom: (size: keyof typeof spacing) => ({
      marginBottom: spacing[size],
    }),
    marginTop: (size: keyof typeof spacing) => ({ marginTop: spacing[size] }),
    marginLeft: (size: keyof typeof spacing) => ({ marginLeft: spacing[size] }),
    marginRight: (size: keyof typeof spacing) => ({
      marginRight: spacing[size],
    }),
    padding: (size: keyof typeof spacing) => ({ padding: spacing[size] }),
    paddingVertical: (size: keyof typeof spacing) => ({
      paddingVertical: spacing[size],
    }),
    paddingHorizontal: (size: keyof typeof spacing) => ({
      paddingHorizontal: spacing[size],
    }),
  },

  // Create flex utilities
  flex: {
    center: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    row: {
      flexDirection: "row" as const,
    },
    column: {
      flexDirection: "column" as const,
    },
  },
};

// Example usage patterns
export const exampleUsage = {
  // Example: Creating a verse card
  verseCard: {
    ...themeUtils.createCard(),
    ...themeUtils.spacing.padding("lg"),
  },

  // Example: Creating a primary button
  primaryButton: {
    ...themeUtils.createButton("primary"),
  },

  // Example: Creating a large title
  largeTitle: {
    ...themeUtils.createText("2xl", { fontWeight: "600" as const }),
    marginBottom: spacing.lg,
  },

  // Example: Creating a flex container
  flexCenter: {
    ...themeUtils.flex.center,
    backgroundColor: colors.background,
  },
};
