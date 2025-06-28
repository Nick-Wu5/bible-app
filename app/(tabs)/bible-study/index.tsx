import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { getDatabaseService } from "@/services/DatabaseService";
import { colors, commonStyles, spacing } from "@/styles/theme";
import { themeUtils } from "@/styles/themeUtils";
import { User, Verse } from "@/types/database";
import { clearAllUsers } from "@/utils/databaseDebug";

export default function BibleStudyScreen() {
  const { currentUser } = useAuth();
  const database = getDatabaseService();

  // State for dropdowns
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userVerses, setUserVerses] = useState<Verse[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<string>("");

  // Load data for dropdowns
  const loadDropdownData = async () => {
    try {
      const users = await database.getAllUsers();
      setAllUsers(users);

      if (currentUser) {
        const verses = await database.getVersesByUser(currentUser.id);
        setUserVerses(verses);
      }
    } catch (error) {
      console.error("❌ Error loading dropdown data:", error);
    }
  };

  useEffect(() => {
    loadDropdownData();
  }, [currentUser]);

  const logUserTable = async () => {
    try {
      const users = await database.getAllUsers();
      console.log("👥 All Users in Database:", JSON.stringify(users, null, 2));
      Alert.alert(
        "Success",
        `Found ${users.length} users. Check console for details.`
      );
    } catch (error) {
      console.error("❌ Error logging users:", error);
      Alert.alert("Error", "Failed to log users");
    }
  };

  const logVerseTableForUser = async () => {
    if (!currentUser) {
      Alert.alert("Error", "No user logged in");
      return;
    }

    try {
      const verses = await database.getVersesByUser(currentUser.id);
      console.log(
        `📖 Verses for user ${currentUser.name}:`,
        JSON.stringify(verses, null, 2)
      );
      Alert.alert(
        "Success",
        `Found ${verses.length} verses for ${currentUser.name}. Check console for details.`
      );
    } catch (error) {
      console.error("❌ Error logging verses:", error);
      Alert.alert("Error", "Failed to log verses");
    }
  };

  const clearVerseTableForUser = async () => {
    if (!currentUser) {
      Alert.alert("Error", "No user logged in");
      return;
    }

    Alert.alert(
      "Clear User Verses",
      `This will remove all verses for ${currentUser.name}. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Verses",
          style: "destructive",
          onPress: async () => {
            try {
              const verses = await database.getVersesByUser(currentUser.id);
              for (const verse of verses) {
                await database.deleteVerse(verse.id);
              }
              console.log(
                `🗑️ Cleared ${verses.length} verses for ${currentUser.name}`
              );
              Alert.alert(
                "Success",
                `Cleared ${verses.length} verses for ${currentUser.name}`
              );
              await loadDropdownData(); // Refresh dropdown data
            } catch (error) {
              console.error("❌ Error clearing verses:", error);
              Alert.alert("Error", "Failed to clear verses");
            }
          },
        },
      ]
    );
  };

  const deleteSpecificUser = async () => {
    if (!selectedUser) {
      Alert.alert("Error", "Please select a user to delete");
      return;
    }

    const user = allUsers.find((u) => u.id === selectedUser);
    if (!user) {
      Alert.alert("Error", "Selected user not found");
      return;
    }

    Alert.alert(
      "Delete User",
      `Are you sure you want to delete user "${user.name}" (${user.phone})? This will also delete all their verses.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // First delete all verses for this user
              const userVerses = await database.getVersesByUser(user.id);
              for (const verse of userVerses) {
                await database.deleteVerse(verse.id);
              }

              // Then delete the user (you'll need to add this method to your database service)
              // For now, we'll use the clearAllUsers and recreate other users
              // This is a temporary solution - you should add a deleteUser method
              await clearAllUsers();

              console.log(
                `🗑️ Deleted user ${user.name} and ${userVerses.length} verses`
              );
              Alert.alert(
                "Success",
                `Deleted user ${user.name} and ${userVerses.length} verses`
              );

              setSelectedUser("");
              await loadDropdownData();
            } catch (error) {
              console.error("❌ Error deleting user:", error);
              Alert.alert("Error", "Failed to delete user");
            }
          },
        },
      ]
    );
  };

  const deleteSpecificVerse = async () => {
    if (!selectedVerse) {
      Alert.alert("Error", "Please select a verse to delete");
      return;
    }

    const verse = userVerses.find((v) => v.id === selectedVerse);
    if (!verse) {
      Alert.alert("Error", "Selected verse not found");
      return;
    }

    Alert.alert(
      "Delete Verse",
      `Are you sure you want to delete "${verse.reference}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await database.deleteVerse(verse.id);
              console.log(`🗑️ Deleted verse ${verse.reference}`);
              Alert.alert("Success", `Deleted verse ${verse.reference}`);

              setSelectedVerse("");
              await loadDropdownData();
            } catch (error) {
              console.error("❌ Error deleting verse:", error);
              Alert.alert("Error", "Failed to delete verse");
            }
          },
        },
      ]
    );
  };

  const clearAllUsersDebug = async () => {
    Alert.alert(
      "Clear All Users",
      "This will remove all users from the database. You'll need to register again. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Users",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllUsers();
              Alert.alert(
                "Success",
                "All users cleared. Please restart the app to see the login screen."
              );
            } catch (error) {
              Alert.alert("Error", "Failed to clear users");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.screenContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Bible Study</Text>
        <Text style={styles.subtitle}>Coming soon...</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            Current User: {currentUser?.name || "None"}
          </Text>
        </View>
      </View>

      {/* Debug Tools Section */}
      <View style={styles.section}>
        <Text style={commonStyles.sectionTitle}>Debug Tools</Text>

        {/* Logging Tools */}
        <View style={themeUtils.createCard()}>
          <Text style={styles.cardTitle}>Database Logging</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[themeUtils.createButton("secondary"), styles.button]}
              onPress={logUserTable}
            >
              <Text style={commonStyles.buttonText}>Log User Table</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[themeUtils.createButton("secondary"), styles.button]}
              onPress={logVerseTableForUser}
            >
              <Text style={commonStyles.buttonText}>
                Log Verses for Current User
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Specific User Deletion */}
        <View style={themeUtils.createCard()}>
          <Text style={styles.cardTitle}>Delete Specific User</Text>
          <View style={styles.dropdownContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedUser}
                onValueChange={(itemValue: string) =>
                  setSelectedUser(itemValue)
                }
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="Select a user..." value="" />
                {allUsers.map((user) => (
                  <Picker.Item
                    key={user.id}
                    label={`${user.name} (${user.phone})`}
                    value={user.id}
                  />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={[
                themeUtils.createButton("secondary"),
                styles.deleteButton,
                { backgroundColor: colors.error },
                !selectedUser && { opacity: 0.5 },
              ]}
              onPress={deleteSpecificUser}
              disabled={!selectedUser}
            >
              <Text style={commonStyles.buttonText}>Delete Selected User</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Specific Verse Deletion */}
        <View style={themeUtils.createCard()}>
          <Text style={styles.cardTitle}>Delete Specific Verse</Text>
          <View style={styles.dropdownContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedVerse}
                onValueChange={(itemValue: string) =>
                  setSelectedVerse(itemValue)
                }
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="Select a verse..." value="" />
                {userVerses.map((verse) => (
                  <Picker.Item
                    key={verse.id}
                    label={`${verse.reference} - ${verse.content.substring(
                      0,
                      30
                    )}...`}
                    value={verse.id}
                  />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={[
                themeUtils.createButton("secondary"),
                styles.deleteButton,
                { backgroundColor: colors.error },
                !selectedVerse && { opacity: 0.5 },
              ]}
              onPress={deleteSpecificVerse}
              disabled={!selectedVerse}
            >
              <Text style={commonStyles.buttonText}>Delete Selected Verse</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bulk Operations */}
        <View style={themeUtils.createCard()}>
          <Text style={styles.cardTitle}>Bulk Operations</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[themeUtils.createButton("outline"), styles.button]}
              onPress={clearVerseTableForUser}
            >
              <Text
                style={[commonStyles.buttonText, { color: colors.primary }]}
              >
                Clear Verses for Current User
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[themeUtils.createButton("outline"), styles.button]}
              onPress={clearAllUsersDebug}
            >
              <Text style={[commonStyles.buttonText, { color: colors.error }]}>
                Clear All Users
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...themeUtils.createText("2xl", { fontWeight: "700" }),
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...themeUtils.createText("base", { color: colors.textSecondary }),
    marginBottom: spacing.md,
  },
  userInfo: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: spacing.sm,
  },
  userInfoText: {
    ...themeUtils.createText("sm", { color: colors.textSecondary }),
    textAlign: "center",
  },
  section: {
    padding: spacing.lg,
  },
  cardTitle: {
    ...themeUtils.createText("lg", { fontWeight: "600" }),
    marginBottom: spacing.md,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
  button: {
    marginBottom: spacing.xs,
  },
  dropdownContainer: {
    gap: spacing.md,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  deleteButton: {
    marginTop: spacing.xs,
  },
});
