import React from "react";
import { View, Text, Pressable, StyleSheet, ImageStyle } from "react-native";
import { WebView } from "react-native-webview";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";
import { eggDefinitions, EggDefinition } from "../content/eggs";

/**
 * Three mysterious eggs. Differences are conveyed visually and via a
 * short clue only â€” never labeled as personality types, and no hidden
 * trait is ever revealed here (master protocol Â§THREE EGGS).
 */
export function EggSelectionScreen() {
  // HTML animation for egg 1 (Magical Egg) — embedded from the provided file
  const egg1Html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Magical Egg</title>
<style>
  :root {
    --glow-color: 255, 214, 120;
    --glow-color-selected: 255, 195, 90;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    overflow: hidden;
  }

  .scene {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(ellipse at 50% 40%, #241b3d 0%, #140f24 55%, #0a0714 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1.5px 1.5px at 15% 20%, rgba(255,255,255,0.35) 50%, transparent 51%),
      radial-gradient(1.5px 1.5px at 80% 15%, rgba(255,255,255,0.25) 50%, transparent 51%),
      radial-gradient(1px 1px at 65% 70%, rgba(255,255,255,0.3) 50%, transparent 51%),
      radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.2) 50%, transparent 51%),
      radial-gradient(1.5px 1.5px at 90% 55%, rgba(255,255,255,0.25) 50%, transparent 51%),
      radial-gradient(1px 1px at 10% 60%, rgba(255,255,255,0.2) 50%, transparent 51%);
    pointer-events: none;
  }

  .stage {
    position: relative;
    width: min(320px, 60vw);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .glow {
    position: absolute;
    left: 50%;
    top: 52%;
    width: 78%;
    height: 78%;
    transform: translate(-50%, -50%) scale(0.95);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(var(--glow-color), 0.55) 0%, rgba(var(--glow-color), 0.18) 45%, rgba(var(--glow-color), 0) 72%);
    filter: blur(6px);
    animation: glowPulse 3.5s ease-in-out infinite;
    pointer-events: none;
    transition: background 0.6s ease;
  }

  .stage.selected .glow {
    background: radial-gradient(circle, rgba(var(--glow-color-selected), 0.75) 0%, rgba(var(--glow-color-selected), 0.28) 45%, rgba(var(--glow-color-selected), 0) 75%);
  }

  .egg-float {
    position: relative;
    animation: eggFloat 3.5s ease-in-out infinite;
    will-change: transform;
  }

  .stage.paused .egg-float {
    animation-play-state: paused;
  }

  .egg-scale {
    display: block;
    width: 100%;
    height: auto;
    cursor: pointer;
    user-select: none;
    -webkit-user-drag: none;
    transform: scale(1);
    transform-origin: 50% 55%;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    filter: drop-shadow(0 0 18px rgba(var(--glow-color), 0.35));
  }

  .stage.selected .egg-scale {
    transform: scale(1.08);
    filter: drop-shadow(0 0 28px rgba(var(--glow-color-selected), 0.55));
  }

  .stage.tapped .egg-scale {
    animation: tapPulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .hint {
    position: absolute;
    bottom: 8%;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(230, 220, 255, 0.45);
    font-size: 13px;
    letter-spacing: 0.04em;
    pointer-events: none;
  }

  @keyframes eggFloat {
    0%   { transform: translateY(0px)   rotate(0deg); }
    25%  { transform: translateY(-4px)  rotate(0.6deg); }
    50%  { transform: translateY(-7px)  rotate(-0.3deg); }
    75%  { transform: translateY(-3px)  rotate(-1deg); }
    100% { transform: translateY(0px)   rotate(0deg); }
  }

  @keyframes glowPulse {
    0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(0.94); }
    50%      { opacity: 0.9;  transform: translate(-50%, -50%) scale(1.08); }
  }

  @keyframes tapPulse {
    0%   { transform: scale(1.08); }
    35%  { transform: scale(1.16); }
    60%  { transform: scale(1.03); }
    100% { transform: scale(1.08); }
  }

  @media (prefers-reduced-motion: reduce) {
    .egg-float { animation: none; }
    .glow { animation: none; }
    .egg-scale { transition: none; }
  }
</style>
</head>
<body>
  <div class="scene">
    <div class="stars"></div>
    <div class="stage" id="stage">
      <div class="glow"></div>
      <div class="egg-float">
        <img class="egg-scale" id="egg" src="data:image/png;base64,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... (truncated for brevity in the editor)
      </div>
      <div class="hint" id="hint">tap the egg</div>
    </div>
  </div>

<script>
  const stage = document.getElementById('stage');
  const egg = document.getElementById('egg');
  const hint = document.getElementById('hint');
  let selected = false;
  let pulseTimeout = null;

  egg.addEventListener('click', () => {
    selected = !selected;

    // brief gentle pulse on every tap
    stage.classList.remove('tapped');
    void stage.offsetWidth; // restart animation
    stage.classList.add('tapped');
    clearTimeout(pulseTimeout);
    pulseTimeout = setTimeout(() => stage.classList.remove('tapped'), 620);

    stage.classList.toggle('selected', selected);
    hint.style.opacity = selected ? '0' : '1';
  });
</script>
</body>
</html>`;

  // simple placeholder HTML for eggs 2 & 3 until assets/code are provided
  const placeholderHtml2 = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%;background:transparent} .wrap{display:flex;align-items:center;justify-content:center;height:100%}.pulse{width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#7dd3fc,#60a5fa);box-shadow:0 0 24px rgba(96,165,250,0.5);animation:pulse 2s infinite}.label{position:absolute;bottom:10%;color:rgba(255,255,255,0.8);font-family:-apple-system,segoe-ui,Roboto,Arial,sans-serif;font-size:14px}</style></head><body><div class="wrap"><div class="pulse"></div><div class="label">gentle tide</div></div></body></html>`;
  const placeholderHtml3 = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%;background:transparent} .wrap{display:flex;align-items:center;justify-content:center;height:100%}.spark{width:96px;height:120px;background:linear-gradient(180deg,#fde68a,#fca5a5);border-radius:48px 48px 40px 40px;box-shadow:0 6px 18px rgba(0,0,0,0.25);transform-origin:center bottom;animation:pop 1.8s infinite}@keyframes pop{0%{transform:translateY(6px) scale(0.98)}50%{transform:translateY(-6px) scale(1.02)}100%{transform:translateY(6px) scale(0.98)}}</style></head><body><div class="wrap"><div class="spark"></div></div></body></html>`;

  const eggsHtmlMap: Record<string, string> = {
    eggEmber: egg1Html,
    eggTide: placeholderHtml2,
    eggWhisper: placeholderHtml3,
  };

  const eggNames: Record<string, string> = { eggEmber: "Ember", eggTide: "Tide", eggWhisper: "Whisper" };

  const selectEgg = useOnboardingStore((s) => s.selectEgg);
  const advance = useOnboardingStore((s) => s.advance);

  function handleSelect(egg: EggDefinition) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    selectEgg(egg.id);
    advance();
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Three eggs are waiting.</Text>
      <Text style={styles.subtitle}>Which one calls to you?</Text>
      <View style={styles.row}>
        {eggDefinitions.map((egg) => (
          <Pressable
            key={egg.id}
            onPress={() => handleSelect(egg)}
            style={({ pressed }) => [styles.eggCard, shadows.glow, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Choose this egg"
          >
            <Text style={styles.eggName}>{eggNames[egg.id]}</Text>
            <View style={styles.webwrap}>
              <WebView originWhitelist={["*"]} source={{ html: eggsHtmlMap[egg.id] }} style={styles.eggWebView} />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary, padding: spacing.xl, justifyContent: "center" },
  title: { ...typography.title, color: colors.text.primary, textAlign: "center" },
  subtitle: { ...typography.body, color: colors.text.secondary, textAlign: "center", marginBottom: spacing.xxl },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  eggCard: {
    flex: 1,
    minHeight: 180,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.8 },
  eggName: { ...typography.body, color: colors.text.primary, textAlign: "center", marginBottom: spacing.xs },
  webwrap: { width: '100%', height: 160, borderRadius: radius.md, overflow: 'hidden', backgroundColor: 'transparent', marginBottom: spacing.sm },
  eggWebView: { flex: 1, backgroundColor: 'transparent' },
});

