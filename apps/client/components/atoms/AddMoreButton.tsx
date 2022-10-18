import React from 'react';
import { Box, Pressable, Text } from 'native-base';
import { AiOutlinePlus } from 'react-icons/ai';

type AddMoreButtonProps = { onPress: () => void, empty?: boolean, horizontal?: boolean, widthProps?: number | string };

const AddMoreButton = ({ onPress, empty = false, horizontal = false, widthProps }: AddMoreButtonProps) => {
  const width = widthProps ? widthProps : horizontal ? "450px" : "280px"
  const height = horizontal ? "75px" : "300px"

  const innerWidth = horizontal ? "100%" : "120px"
  const innerHeight = horizontal ? "100%" : "120px"

  return (
    <Pressable onPress={onPress}>
      <Box
        w={width}
        h={height}
        justifyContent={"center"}
        alignItems={empty ? "" : "center"}
        mr={"4"}
      >
        <Box
          w={innerWidth}
          h={innerHeight}
          borderRadius={'lg'}
          borderColor={"trueGray.300"}
          borderWidth={"1"} justifyContent={"center"}
          alignItems={"center"}
        >
          <Box borderWidth={1} borderRadius={'full'} p={"2"}>
            <AiOutlinePlus size={horizontal ? "2em" : "3em"} />
          </Box>

        </Box>
      </Box>
    </Pressable>
  );
};

export { AddMoreButton };
