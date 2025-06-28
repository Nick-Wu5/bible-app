import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import {
  borderRadius,
  colors,
  commonStyles,
  shadows,
  spacing,
} from "@/styles/theme";
import { themeUtils } from "@/styles/themeUtils";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [denomination, setDenomination] = useState("");
  const [preferredTranslation, setPreferredTranslation] = useState("NIV");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    console.log("📝 Registration form submitted");
    console.log("📋 Form data:", {
      name,
      phone,
      denomination,
      preferredTranslation,
    });

    setIsLoading(true);
    try {
      console.log("🔄 Calling register function...");
      const registeredUser = await register({
        name: name.trim(),
        phone: phone.trim(),
        denomination: denomination.trim() || undefined,
        preferredTranslation,
      });

      console.log("✅ Registration successful, user returned:", registeredUser);
      console.log("🔄 Navigating to home...");

      // Navigate to main app
      router.replace("/home");
    } catch (error) {
      console.error("❌ Registration error in UI:", error);
      console.error("❌ Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      Alert.alert("Error", "Failed to create account. Please try again.");
    } finally {
      console.log("🏁 Registration process finished, setting loading to false");
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Set up your Bible study profile</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Denomination (Optional)</Text>
            <TextInput
              style={styles.input}
              value={denomination}
              onChangeText={setDenomination}
              placeholder="e.g., Baptist, Catholic, Methodist"
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preferred Translation</Text>
            <View style={styles.pickerContainer}>
              {["NIV", "KJV", "ESV", "NLT", "NKJV"].map((translation) => (
                <TouchableOpacity
                  key={translation}
                  style={[
                    styles.translationOption,
                    preferredTranslation === translation &&
                      styles.selectedTranslation,
                  ]}
                  onPress={() => setPreferredTranslation(translation)}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.translationText,
                      preferredTranslation === translation &&
                        styles.selectedTranslationText,
                    ]}
                  >
                    {translation}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              themeUtils.createButton("primary"),
              isLoading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={commonStyles.buttonText}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={handleBackToLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.backToLoginText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    ...themeUtils.createText("2xl", { fontWeight: "700" }),
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    ...themeUtils.createText("base", { color: colors.textSecondary }),
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...themeUtils.createText("sm", { fontWeight: "600" }),
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
    ...shadows.sm,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  translationOption: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 60,
    alignItems: "center",
  },
  selectedTranslation: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  translationText: {
    ...themeUtils.createText("sm", { fontWeight: "500" }),
  },
  selectedTranslationText: {
    color: "white",
  },
  disabledButton: {
    opacity: 0.6,
  },
  backToLoginButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  backToLoginText: {
    ...themeUtils.createText("base", {
      color: colors.primary,
      textDecorationLine: "underline",
    }),
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  footerText: {
    ...themeUtils.createText("xs", {
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 18,
    }),
  },
});
