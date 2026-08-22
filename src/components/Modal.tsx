import React from "react";
import { View, StyleSheet, Modal as RNModal } from "react-native";
import { colors, spacing, radius } from "@theme";

interface WonderkinModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Centered modal primitive — used for confirmations, reward reveals. */
export function WonderkinModal({ visible, onClose, children }: WonderkinModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>{children}</View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.overlay,
    padding: spacing.xl,
  },
  card: {
    width: "100%",
    backgroundColor: colors.background.elevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
});
