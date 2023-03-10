import { Box, Button, Divider, HStack, Icon, Text } from "native-base"
import React from "react"
import { BsFillPersonFill } from "react-icons/bs";
import { GiRoundTable } from "react-icons/gi";
import { parseToCurrency } from 'app-helpers';
import { IncrementButtons } from "./IncrementButtons";



type SummaryProps = {
  name: string;
  price: number;
  quantity: number;
  onPlusPress?: () => void;
  onMinusPress?: () => void;
  onRemovePress?: () => void;
  onEditPress?: () => void;
  lastItem: boolean;
  assignedToPersonIndex?: number;
}

const texts = {
  delete: "Delete",
  extras: "Extras",
  table: "Table",
  person: "Person",
}

export const SummaryComponent = ({ name,
  price,
  quantity,
  onEditPress,
  onMinusPress,
  onPlusPress,
  onRemovePress,
  lastItem,
  assignedToPersonIndex
}: SummaryProps) => (
  <Box w={"full"} p={1} py={2}>
    <HStack justifyContent={"space-between"} pb={1}>
      <Text>{name}</Text>
      <Button
        p={0}
        size="sm"
        variant="link"
        colorScheme="danger"
        onPress={onRemovePress}
      >
        {texts.delete}
      </Button>
    </HStack>
    <HStack pb={3}>
      <IncrementButtons
        quantity={quantity}
        onPlusPress={onPlusPress}
        onMinusPress={onMinusPress}
      />
      <HStack justifyContent={"space-between"} flex={1} pl={8}>
        <Button
          size="sm"
          variant="link"
          colorScheme="tertiary"
          p={0}
          onPress={onEditPress}
        >
          {texts.extras}
        </Button>
        <Text>{parseToCurrency(price)}</Text>
      </HStack>
    </HStack>
    <HStack space={1} alignItems={"center"} pb={1}>
      <Icon color={"tertiary.500"} >
        {assignedToPersonIndex ? <BsFillPersonFill /> : <GiRoundTable />}
      </Icon>
      <Text fontSize={"xs"} color={"tertiary.500"}>{assignedToPersonIndex ? `${texts.person} ${assignedToPersonIndex}` : texts.table}</Text>
    </HStack>
    {lastItem ? null : <Divider thickness="1" />}
  </Box>
);