import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

export default function LibraryScreen() {
  const { currentUser } = useAuth();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const database = getDatabaseService();

  const loadVerses = async () => {
    if (!currentUser) return;

    try {
      const userVerses = await database.getVersesByUser(currentUser.id);
      setVerses(userVerses);
    } catch (error) {
      console.error("Error loading verses:", error);
      Alert.alert("Error", "Failed to load your verses");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVerses();
    setRefreshing(false);
  };

  const handleDeleteVerse = async (verseId: string) => {
    Alert.alert("Delete Verse", "Are you sure you want to delete this verse?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await database.deleteVerse(verseId);
            await loadVerses(); // Reload the list
            Alert.alert("Success", "Verse deleted successfully");
          } catch (error) {
            Alert.alert("Error", "Failed to delete verse");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadVerses();
  }, [currentUser]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!currentUser) {
    return (
      <View style={commonStyles.centeredContainer}>
        <Text style={commonStyles.textMedium}>
          Please log in to view your library
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={commonStyles.screenContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <Text style={styles.subtitle}>
          {verses.length} {verses.length === 1 ? "verse" : "verses"} saved
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your verses...</Text>
        </View>
      ) : verses.length > 0 ? (
        <View style={styles.versesContainer}>
          {verses.map((verse) => (
            <View key={verse.id} style={themeUtils.createCard()}>
              <View style={styles.verseHeader}>
                <View style={styles.verseInfo}>
                  <Text style={styles.verseReference}>{verse.reference}</Text>
                  <Text style={styles.verseTranslation}>
                    {verse.translation}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteVerse(verse.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#dc3545" />
                </TouchableOpacity>
              </View>

              <Text style={styles.verseContent}>"{verse.content}"</Text>

              <View style={styles.verseFooter}>
                <Text style={styles.verseDate}>
                  Added {formatDate(verse.createdAt)}
                </Text>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View in Context</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="library-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyStateTitle}>Your library is empty</Text>
          <Text style={styles.emptyStateText}>
            Start building your collection by adding Bible verses
          </Text>
          <TouchableOpacity style={themeUtils.createButton("primary")}>
            <Text style={commonStyles.buttonText}>Add Your First Verse</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    ...themeUtils.createText("2xl", { fontWeight: "700" }),
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...themeUtils.createText("base", { color: colors.textSecondary }),
  },
  loadingContainer: {
    ...themeUtils.flex.center,
    padding: spacing.xl,
  },
  loadingText: {
    ...themeUtils.createText("base", {
      color: colors.textSecondary,
      fontStyle: "italic",
    }),
  },
  versesContainer: {
    padding: spacing.lg,
  },
  verseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  verseInfo: {
    flex: 1,
  },
  verseReference: {
    ...themeUtils.createText("lg", { fontWeight: "600" }),
    marginBottom: spacing.xs,
  },
  verseTranslation: {
    ...themeUtils.createText("xs", {
      color: colors.textSecondary,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
      alignSelf: "flex-start",
    }),
  },
  deleteButton: {
    padding: spacing.xs,
  },
  verseContent: {
    ...themeUtils.createText("base", {
      lineHeight: 24,
      marginBottom: spacing.md,
      fontStyle: "italic",
    }),
  },
  verseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verseDate: {
    ...themeUtils.createText("xs", { color: colors.textSecondary }),
  },
  viewButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  viewButtonText: {
    ...themeUtils.createText("xs", {
      fontWeight: "600",
      color: "white",
    }),
  },
  emptyState: {
    ...themeUtils.flex.center,
    padding: spacing.xl,
  },
  emptyStateTitle: {
    ...themeUtils.createText("lg", { fontWeight: "600" }),
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...themeUtils.createText("base", {
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: spacing.lg,
    }),
  },
});
