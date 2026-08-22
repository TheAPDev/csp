import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { PrimaryButton } from "@components/PrimaryButton";
import { SecondaryButton } from "@components/SecondaryButton";
import { Toast } from "@components/Toast";
import { LoadingIndicator } from "@components/LoadingIndicator";
import { colors, typography, spacing, radius } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";
import { signUpWithEmail, signInWithEmail } from "@services/supabase/auth";

type Mode = "create" | "signIn";

/**
 * Account entry. Always falls forward — if Supabase isn't configured
 * yet, or the network call fails, the child can still continue as a
 * guest rather than hitting a dead end (a parent can link the account
 * later from Parent Space, a future batch).
 */
export function AccountEntryScreen() {
  const advance = useOnboardingStore((s) => s.advance);
  const [mode, setMode] = useState<Mode>("create");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  async function handleSubmit() {
    if (!email || !password) {
      setToast("A parent or grown-up can fill this in together.");
      return;
    }
    setBusy(true);
    try {
      const { error } =
        mode === "create"
          ? await signUpWithEmail(email, password)
          : await signInWithEmail(email, password);
      setBusy(false);
      if (error) {
        setToast(error.message);
        return;
      }
      advance();
    } catch {
      setBusy(false);
      setToast("Couldn't reach the server — continuing as a guest for now.");
      advance();
    }
  }

  if (busy) return <LoadingIndicator />;

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{mode === "create" ? "Create a family account" : "Welcome back"}</Text>
      <Text style={styles.subtitle}>A grown-up's email keeps progress safe.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.text.disabled}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
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
        label={mode === "create" ? "Create Account" : "Sign In"}
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
