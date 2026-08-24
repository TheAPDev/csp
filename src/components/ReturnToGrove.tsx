import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing } from "@theme";
import { SecondaryButton } from "./SecondaryButton";

interface ReturnToGroveProps {
  onPress: () => void;
}

/**
 * Every non-Grove World needs a way back now that world-switching is
 * gateway-based rather than a tab bar (see WorldGateway). This is the
 * single consistent "way home" affordance every World screen uses â€”
 * do not invent a per-World variant.
 */
export function ReturnToGrove({ onPress }: ReturnToGroveProps) {
  return <SecondaryButton label="Return to the Grove" onPress={onPress} style={styles.button} />;
}

const styles = StyleSheet.create({
  button: { marginHorizontal: spacing.xl, marginTop: spacing.xl, alignSelf: "flex-start" },
});

