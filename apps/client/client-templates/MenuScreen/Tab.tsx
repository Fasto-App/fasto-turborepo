import React from "react";
import { Box, Pressable, Text } from "native-base";

type TabProps = {
  title: string;
  index: number;
  onPress: (index: number) => void;
  last: boolean;
  selected: boolean;
};

export const Tab = (props: TabProps) => {
  const { title, index, onPress, selected } = props;

  return (
    <Pressable onPress={() => onPress(index)}>
      <Box backgroundColor={selected ? "red.200" : "white"} >
        <Text paddingX={4} paddingY={1}>{title}</Text>
      </Box>
    </Pressable>
  );
};