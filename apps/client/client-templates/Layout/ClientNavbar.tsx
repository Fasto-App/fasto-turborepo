import React from "react"
import { useRouter } from "next/router";
import { Avatar, Box, HStack, Text, useTheme, VStack } from "native-base";

const texts = {
  navigationTitle: "Fasto App",
}

const ClientNavBar: React.FC = (props) => {
  const router = useRouter();
  let isBackButtonAvailable = true;

  const theme = useTheme();

  return (
    <>
      <Box
        bg={"primary.500"}
        padding={"1"}
        height={"12"}
        w={"100%"}
        position={"absolute"}
        zIndex={-1}
      >
      </Box>
      <HStack
        mt={2}
        mx={2}
        p={1}
        background={"white"}
        borderRadius={"lg"}
        justifyContent={"space-around"}
        alignItems={"center"}
        borderWidth={1}
        borderColor={"coolGray.300"}
      >
        <Avatar size="48px" source={{ uri: "https://cdn.logo.com/hotlink-ok/logo-social.png" }} />
        <Text fontSize={"lg"} color="coolGray.800" overflow={"break-word"} bold>
          Haruko
        </Text>
        <VStack alignItems={"center"}>
          <Text fontSize={"lg"} color="coolGray.800" overflow={"break-word"} bold>
            Table
          </Text>
          <Text fontSize={"lg"} color="coolGray.800" overflow={"break-word"} bold>
            12
          </Text>
        </VStack>
      </HStack>
    </>
  );
};

ClientNavBar.displayName = "ClientNavBar"

export { ClientNavBar };
