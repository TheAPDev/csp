import React from "react";
import { RootNavigator } from "@navigation/RootNavigator";

/** Entry route — hands off immediately to the World navigator. */
export default function Index() {
  return <RootNavigator />;
}
