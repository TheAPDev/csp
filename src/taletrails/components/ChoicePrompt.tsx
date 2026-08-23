import React from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import * as Haptics from "expo-haptics";
import { AssetImage } from "@components/AssetImage";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { StoryChoicePrompt, StoryChoiceOption } from "@apptypes";

interface ChoicePromptProps {
  prompt: StoryChoicePrompt;
  companionName: string;
  onChoose: (option: StoryChoiceOption) => void;
}

/**
 * The one branching moment in an episode. Deliberately just two big,
 * equally-weighted options — no scoring, no "correct" choice framing.
 */
export function ChoicePrompt({ prompt, companionName, onChoose }: ChoicePromptProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.dialogueRow}>
          <AssetImage id="COMPANION_CURIOUS" style={styles.portrait} />
          <View style={[styles.bubble, shadows.sm]}>
            <Text style={styles.speaker}>{prompt.speaker.replace("{companionName}", companionName)}</Text>
            <Text style={styles.line}>{prompt.line}</Text>
          </View>
        </View>

        <View style={styles.options}>
          {prompt.options.map((option) => (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              onPress={() => {
                Haptics.selectionAsync();
                onChoose(option);
              }}
              style={({ pressed }) => [styles.option, shadows.md, pressed && styles.optionPressed]}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, justifyContent: "flex-end", padding: spacing.lg, gap: spacing.lg },
  dialogueRow: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
  portrait: { width: 48, height: 48, borderRadius: radius.pill },
  bubble: {
    flex: 1,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  speaker: { ...typography.label, color: colors.accent.secondary, marginBottom: spacing.xxs },
  line: { ...typography.body, color: colors.text.primary },
  options: { gap: spacing.sm, marginBottom: spacing.xxl },
  option: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  optionPressed: { opacity: 0.85 },
  optionLabel: { ...typography.heading, color: colors.text.primary, textAlign: "center" },
});
