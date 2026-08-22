module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@theme": "./src/theme",
            "@components": "./src/components",
            "@transitions": "./src/transitions",
            "@worlds": "./src/worlds",
            "@story": "./src/story",
            "@onboarding": "./src/onboarding",
            "@assets": "./src/assets",
            "@navigation": "./src/navigation",
            "@services": "./src/services",
            "@state": "./src/state",
            "@apptypes": "./src/types"
          }
        }
      ],
      "react-native-reanimated/plugin"
    ]
  };
};
