import { useAuth } from "@/contexts/AuthContext";
import {
  borderRadius,
  colors,
  commonStyles,
  spacing,
  typography,
} from "@/styles/theme";
import { themeUtils } from "@/styles/themeUtils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    // Dismiss keyboard first
    Keyboard.dismiss();

    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(phone.trim());
      if (user) {
        // Don't navigate manually - let the auth state change handle it
        console.log("✅ Login successful, auth state will trigger navigation");
      } else {
        Alert.alert(
          "Error",
          "No account found with this phone number. Please create an account first."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push("/auth/register");
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to access your Bible study collection
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          <TouchableOpacity
            style={[
              themeUtils.styles.buttonPrimary,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={themeUtils.styles.buttonOutline}
            onPress={handleCreateAccount}
            activeOpacity={0.8}
          >
            <Text style={styles.backToRegisterText}>Create New Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  header: {
    alignItems: "center",
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...themeUtils.styles.text2xl,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...themeUtils.styles.textBase,
    color: colors.textSecondary,
    textAlign: "center",
  },
  form: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...themeUtils.styles.textSm,
    fontWeight: "600",
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...themeUtils.styles.textSm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  buttonText: {
    ...themeUtils.styles.textBase,
    fontWeight: "600",
    color: colors.surface,
  },
  buttonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  footer: {
    alignItems: "center",
    padding: spacing.lg,
  },
  footerText: {
    ...themeUtils.styles.textBase,
    color: colors.textSecondary,
    textAlign: "center",
  },
  backToRegisterText: {
    ...themeUtils.styles.textBase,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...themeUtils.styles.textBase,
    marginHorizontal: spacing.md,
  },
});
