import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@components/PrimaryButton";
import { SecondaryButton } from "@components/SecondaryButton";
import { Toast } from "@components/Toast";
import { LoadingIndicator } from "@components/LoadingIndicator";
import { colors, typography, spacing, radius } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";

type Mode = "create" | "signIn";

/**
 * First-run entry. For now, any username/password works and the user can
 * continue immediately. This keeps the app moving while preserving the exact
 * welcome-to-story flow for the first-time experience.
 */
export function AccountEntryScreen() {
  const advance = useOnboardingStore((s) => s.advance);
  const [mode, setMode] = useState<Mode>("create");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      setToast("Enter any username and password to continue.");
      return;
    }

    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      advance();
    }, 250);
  }

  if (busy) return <LoadingIndicator />;

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{mode === "create" ? "Create your account" : "Welcome back"}</Text>
      <Text style={styles.subtitle}>For now, any username and password will work.</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={colors.text.disabled}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.text.disabled}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <PrimaryButton
        label={mode === "create" ? "Continue" : "Sign In"}
        onPress={handleSubmit}
        style={styles.cta}
      />
      <SecondaryButton
        label={mode === "create" ? "I already have an account" : "Create a new account instead"}
        onPress={() => setMode(mode === "create" ? "signIn" : "create")}
        style={styles.secondaryCta}
      />
      <SecondaryButton label="Continue as Guest" onPress={advance} style={styles.secondaryCta} />

      <Toast message={toast} visible={!!toast} onHide={() => setToast("")} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary, padding: spacing.xxl, justifyContent: "center" },
  title: { ...typography.title, color: colors.text.primary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.xl },
  input: {
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  cta: { marginTop: spacing.sm },
  secondaryCta: { marginTop: spacing.md },
});

