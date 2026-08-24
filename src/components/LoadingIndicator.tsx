import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@theme";

export function LoadingIndicator() {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.accent.secondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center" },
});

