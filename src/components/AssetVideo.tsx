import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { AssetId, getAsset } from "@assets/registry";
import { AssetImage } from "./AssetImage";

interface AssetVideoProps {
  id: AssetId;
  style?: StyleProp<ViewStyle>;
  shouldPlay?: boolean;
  isLooping?: boolean;
  resizeMode?: ResizeMode;
}

export function AssetVideo({
  id,
  style,
  shouldPlay = true,
  isLooping = true,
  resizeMode = ResizeMode.COVER,
}: AssetVideoProps) {
  const entry = getAsset(id);

  if (!entry.source || entry.kind !== "video") {
    return <AssetImage id={id.replace("_VIDEO", "_BACKGROUND") as any} style={style as any} />;
  }

  return (
    <Video
      source={entry.source as any}
      style={style}
      shouldPlay={shouldPlay}
      isLooping={isLooping}
      resizeMode={resizeMode}
      useNativeControls={false}
      onPlaybackStatusUpdate={(status) => {
        const playback = status as AVPlaybackStatus & { didJustFinish?: boolean };
        if (playback.didJustFinish && isLooping) {
          // The Video component handles looping cleanly when isLooping is true;
          // this is just to keep the intent explicit for future custom behavior.
        }
      }}
    />
  );
}
