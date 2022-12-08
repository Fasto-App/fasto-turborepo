import { AddIcon, Box, Button, Divider, HStack, Icon, IconButton, MinusIcon, Spacer, Text, VStack } from "native-base"
import React from "react"
import { BsFillPersonFill } from "react-icons/bs";
import { GiRoundTable } from "react-icons/gi";
import { parseToCurrency } from "../../utils";

const StyledIconButton = ({ type, onPress }: { type: "plus" | "minus", onPress: () => void }) => {
  const Icon = type === "plus" ? AddIcon : MinusIcon
  return (
    <IconButton
      size={5}
      borderRadius="md"
      onPress={onPress}
      variant={"subtle"}
      backgroundColor={"primary.500"}
      icon={<Icon color={"white"} size={2} />}
    />
  )
};

type SummaryProps = {
  name: string;
  price: number;
  quantity: number;
  onPlusPress?: () => void;
  onMinusPress?: () => void;
  onRemovePress?: () => void;
  onEditPress?: () => void;
  lastItem: boolean;
  selectedUser: string;
}

const texts = {
  delete: "Delete",
  extras: "Extras",
}

export const SummaryComponent = ({ name,
  price,
  quantity,
  onEditPress,
  onMinusPress,
  onPlusPress,
  onRemovePress,
  lastItem,
  selectedUser
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
      <HStack space={2}>
        <StyledIconButton type={"minus"} onPress={onMinusPress} />
        <Text textAlign={"center"} w={4}>{quantity}</Text>
        <StyledIconButton type="plus" onPress={onPlusPress} />
      </HStack>
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
    {selectedUser ? (
      <HStack space={1} alignItems={"center"} pb={1}>
        <Icon color={"tertiary.500"} >
          <BsFillPersonFill />
        </Icon>
        <Text fontSize={"xs"} color={"tertiary.500"}>{selectedUser}</Text>
      </HStack>) :
      <HStack space={1} alignItems={"center"} pb={1}>
        <Icon color={"tertiary.500"}>
          <GiRoundTable />
        </Icon>
        <Text fontSize={"xs"} color={"tertiary.500"}>Table</Text>
      </HStack>
    }
    {lastItem ? null : <Divider thickness="1" />}
  </Box>
);