import { Checkbox, HStack, Text } from "native-base";
import React from "react";

type AddonProps = {
  name: string;
  price: string;
  value: string;
  onChange: (value: boolean) => void;
};

export const Addon = ({ name, price, value, onChange }: AddonProps) => {
  return (
    <HStack justifyContent={"space-between"}>
      <HStack>
        <Checkbox
          shadow={2}
          value={value}
          onChange={onChange}
          size={"md"}
        >
          {name}
        </Checkbox>
      </HStack>
      <Text alignSelf={"center"}>{price}</Text>
    </HStack>
  );
};