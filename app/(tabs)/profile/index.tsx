import { useAuth } from "@/contexts/AuthContext";
import {
  borderRadius,
  colors,
  commonStyles,
  shadows,
  spacing,
} from "@/styles/theme";
import { themeUtils } from "@/styles/themeUtils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { currentUser, logout, updateUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const handleUpdateTranslation = async (translation: string) => {
    try {
      await updateUser({ preferredTranslation: translation });
      Alert.alert("Success", "Translation preference updated!");
    } catch (error) {
      Alert.alert("Error", "Failed to update translation preference");
    }
  };

  if (!currentUser) {
    return (
      <View style={commonStyles.centeredContainer}>
        <Text style={commonStyles.textMedium}>
          Please log in to view your profile
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.screenContainer}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.userName}>{currentUser.name}</Text>
        <Text style={styles.userPhone}>{currentUser.phone}</Text>
        {currentUser.denomination && (
          <Text style={styles.userDenomination}>
            {currentUser.denomination}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.sectionTitle}>Account Settings</Text>

        <View style={themeUtils.styles.card}>
          <View style={styles.settingInfo}>
            <Ionicons name="book" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Preferred Translation</Text>
          </View>
          <Text style={styles.settingValue}>
            {currentUser.preferredTranslation}
          </Text>
        </View>

        <TouchableOpacity
          style={themeUtils.styles.card}
          onPress={() => {
            Alert.alert(
              "Change Translation",
              "Select your preferred Bible translation:",
              [
                { text: "Cancel", style: "cancel" },
                { text: "NIV", onPress: () => handleUpdateTranslation("NIV") },
                { text: "KJV", onPress: () => handleUpdateTranslation("KJV") },
                { text: "ESV", onPress: () => handleUpdateTranslation("ESV") },
                { text: "NLT", onPress: () => handleUpdateTranslation("NLT") },
                {
                  text: "NKJV",
                  onPress: () => handleUpdateTranslation("NKJV"),
                },
              ]
            );
          }}
        >
          <View style={styles.settingInfo}>
            <Ionicons name="settings" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Change Translation</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.sectionTitle}>App Settings</Text>

        <View style={themeUtils.styles.card}>
          <View style={styles.settingInfo}>
            <Ionicons
              name="notifications"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.settingLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={notificationsEnabled ? "white" : colors.textSecondary}
          />
        </View>

        <View style={themeUtils.styles.card}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={darkModeEnabled ? "white" : colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.sectionTitle}>Support</Text>

        <TouchableOpacity style={themeUtils.styles.card}>
          <View style={styles.settingInfo}>
            <Ionicons
              name="help-circle"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.settingLabel}>Help & FAQ</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={themeUtils.styles.card}>
          <View style={styles.settingInfo}>
            <Ionicons name="mail" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Contact Support</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={themeUtils.styles.card}>
          <View style={styles.settingInfo}>
            <Ionicons
              name="document-text"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Bible App v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  avatarText: {
    ...themeUtils.styles.text3xl,
    fontWeight: "700",
    color: "white",
  },
  userName: {
    ...themeUtils.styles.text2xl,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  userPhone: {
    ...themeUtils.styles.textBase,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  userDenomination: {
    ...themeUtils.styles.textSm,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingLabel: {
    ...themeUtils.styles.textBase,
    marginLeft: spacing.sm,
  },
  settingValue: {
    ...themeUtils.styles.textSm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  logoutButtonText: {
    ...themeUtils.styles.textBase,
    fontWeight: "600",
    color: "white",
    marginLeft: spacing.sm,
  },
  footer: {
    alignItems: "center",
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  versionText: {
    ...themeUtils.styles.textXs,
    color: colors.textSecondary,
  },
});
