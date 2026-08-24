import React from "react";
import { View, StyleSheet, Modal as RNModal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radius, elevation } from "@theme";

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Bottom sheet primitive â€” used for Companion detail, inventory peek, etc. */
export function Sheet({ visible, onClose, children }: SheetProps) {
  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>{children}</View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.background.overlay,
  },
  sheet: {
    backgroundColor: colors.background.elevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    minHeight: 200,
    zIndex: elevation.sheet,
  },
});

