import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { getDatabaseService } from "@/services/DatabaseService";
import {
  borderRadius,
  colors,
  commonStyles,
  spacing,
} from "@/styles/theme";
import { themeUtils } from "@/styles/themeUtils";
import { Verse } from "@/types/database";

export default function HomeScreen() {
  const { currentUser, isAuthenticated } = useAuth();
  const [recentVerses, setRecentVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const database = getDatabaseService();

  // Log authentication state for debugging
  useEffect(() => {
    console.log("🏠 Home screen - Authentication state:", {
      isAuthenticated,
      currentUser: currentUser
        ? { id: currentUser.id, name: currentUser.name }
        : null,
    });
  }, [isAuthenticated, currentUser]);

  const loadRecentVerses = async () => {
    if (!currentUser) {
      console.log("📖 No current user, skipping verse loading");
      return;
    }

    try {
      console.log("📖 Loading verses for user:", currentUser.name);
      const verses = await database.getVersesByUser(currentUser.id);
      setRecentVerses(verses.slice(0, 5)); // Show last 5 verses
      console.log("✅ Loaded", verses.length, "verses");
    } catch (error) {
      console.error("❌ Error loading recent verses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecentVerses();
    setRefreshing(false);
  };

  useEffect(() => {
    console.log("🏠 Home screen useEffect - loading verses");
    loadRecentVerses();
  }, [currentUser]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!currentUser) {
    console.log("🏠 Home screen - showing not authenticated message");
    return (
      <View style={commonStyles.centeredContainer}>
        <Text style={commonStyles.textMedium}>
          Please log in to view your content
        </Text>
      </View>
    );
  }

  console.log("🏠 Home screen - rendering authenticated content");

  return (
    <ScrollView
      style={commonStyles.screenContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {currentUser.name}! 👋
        </Text>
        <Text style={styles.subtitle}>Continue your Bible study journey</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={themeUtils.styles.card}>
          <Text style={styles.statNumber}>{recentVerses.length}</Text>
          <Text style={styles.statLabel}>Saved Verses</Text>
        </View>
        <View style={themeUtils.styles.card}>
          <Text style={styles.statNumber}>
            {currentUser.preferredTranslation}
          </Text>
          <Text style={styles.statLabel}>Preferred Translation</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.sectionTitle}>Recent Verses</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading your verses...</Text>
        ) : recentVerses.length > 0 ? (
          recentVerses.map((verse) => (
            <View key={verse.id} style={themeUtils.styles.card}>
              <View style={styles.verseHeader}>
                <Text style={styles.verseReference}>{verse.reference}</Text>
                <Text style={styles.verseTranslation}>{verse.translation}</Text>
              </View>
              <Text style={styles.verseContent} numberOfLines={3}>
                "{verse.content}"
              </Text>
              <Text style={styles.verseDate}>
                Added {formatDate(verse.createdAt)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No verses yet</Text>
            <Text style={styles.emptyStateText}>
              Start by adding your first Bible verse to your collection
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    ...themeUtils.styles.paddingLg,
    paddingTop: spacing.xl,
  },
  greeting: {
    ...themeUtils.styles.text2xl,
    fontWeight: "700",
    ...themeUtils.styles.marginBottomXs,
  },
  subtitle: {
    ...themeUtils.styles.textBase,
    color: colors.textSecondary,
  },
  statsContainer: {
    ...themeUtils.styles.flexRow,
    ...themeUtils.styles.paddingHorizontalLg,
    ...themeUtils.styles.marginBottomLg,
    gap: spacing.md,
  },
  statNumber: {
    ...themeUtils.styles.text2xl,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    ...themeUtils.styles.marginBottomXs,
  },
  statLabel: {
    ...themeUtils.styles.textXs,
    color: colors.textSecondary,
    textAlign: "center",
  },
  section: {
    ...themeUtils.styles.paddingHorizontalLg,
    ...themeUtils.styles.marginBottomXl,
  },
  loadingText: {
    ...themeUtils.styles.textBase,
    color: colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  verseHeader: {
    ...themeUtils.styles.flexRow,
    justifyContent: "space-between",
    alignItems: "center",
    ...themeUtils.styles.marginBottomSm,
  },
  verseReference: {
    ...themeUtils.styles.textBase,
    fontWeight: "600",
  },
  verseTranslation: {
    ...themeUtils.styles.textXs,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    ...themeUtils.styles.paddingHorizontalXs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  verseContent: {
    ...themeUtils.styles.textSm,
    lineHeight: 20,
    ...themeUtils.styles.marginBottomSm,
  },
  verseDate: {
    ...themeUtils.styles.textXs,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    ...themeUtils.styles.paddingVerticalXl,
  },
  emptyStateTitle: {
    ...themeUtils.styles.textLg,
    fontWeight: "600",
    ...themeUtils.styles.marginBottomSm,
  },
  emptyStateText: {
    ...themeUtils.styles.textBase,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
