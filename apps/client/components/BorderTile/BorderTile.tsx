
import React from "react"
import { Avatar, Box, VStack, Text, HStack, Button, Badge } from "native-base";

export const BorderTile: React.FC<{ width: string | number }> = ({ children, ...props }) => {
  return (
    <Box
      w={props.width}
      p={"1"}
      px={"4"}
      mr={"4"}
      mb={4}
      shadow="4"
      backgroundColor={"white"}
      justifyContent={"center"}
      borderRadius={"md"}
      {...props}>
      {children}
    </Box>
  );
};

type EmployeeTileProps = {
  picture: string;
  name: string;
  privilege: string;
  email: string;
  jobTitle: string;
  onPress: () => void;
  ctaTitle: string;
  isPending: boolean;
}

export const EmployeeTile = ({
  name,
  picture,
  privilege,
  email,
  jobTitle,
  onPress,
  ctaTitle,
  isPending
}: EmployeeTileProps) => {
  return (
    <BorderTile width={420}>
      <HStack alignItems="center"
        justifyContent={"space-between"}
        space={3}
        flex={1}
      >
        <Avatar size="48px" source={{ uri: picture }} />
        <VStack flex={1}>
          <Box flexDirection={"row"}>
            <Text fontSize={"lg"} color="coolGray.800" overflow={"break-word"} bold >
              {name}
            </Text>
            {isPending ? <Badge ml={"4"} colorScheme="warning" alignSelf="center" variant={"outline"}>
              Pending
            </Badge> : null}
          </Box>
          <Text color="coolGray.600" bold>
            {privilege}
          </Text>
          <Text color="coolGray.600">
            {email}
          </Text>
          <Text color="coolGray.600">
            {jobTitle}
          </Text>
        </VStack>
        <HStack
          alignItems="center"
          space={2}
          justifyContent="space-between"
          py={4}>
          <Button w={"100"} colorScheme="tertiary"
            onPress={onPress}>{ctaTitle}
          </Button>
        </HStack>
      </HStack>
    </BorderTile>
  )
}