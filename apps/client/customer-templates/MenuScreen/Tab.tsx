import React from "react";
import { Box, Pressable, Text } from "native-base";

type TabProps = {
  title: string;
  index: number;
  selected: boolean;
  onPress: () => void;
};

export const Tab = (props: TabProps) => {
  const { title, onPress, selected } = props;

  return (
    <Pressable onPress={onPress}>
      <Box backgroundColor={selected ? "red.100" : "white"} >
        <Text fontSize={"lg"} paddingX={4} paddingY={1}>{title}</Text>
      </Box>
    </Pressable>
  );
};