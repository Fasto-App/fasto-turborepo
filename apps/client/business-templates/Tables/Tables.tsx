import React from "react"
import { useSpacesMutationHook } from "../../graphQL/SpaceQL";
import { TablesScreen } from "./TablesScreen";

export const Tables = () => {
  const {
    allSpaces,
  } = useSpacesMutationHook();

  return <TablesScreen allSpaces={allSpaces} />;
}