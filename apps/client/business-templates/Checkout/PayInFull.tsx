import { Button, Center, Divider, Heading, HStack, Input, Text, VStack } from 'native-base'
import React from 'react'
import { texts } from './texts'

export const PayInFull = () => {
  return (
    <Center>
      <Heading size={"2xl"} p={4}>
        {texts.checkout}
      </Heading>
      <VStack w={"70%"} minW={"lg"} space={4}>
        <Divider />
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{texts.subtotal}</Text>
          <Text fontSize={"2xl"}>{"$100.00"}</Text>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{texts.feesAndTax}</Text>
          <Text fontSize={"2xl"}>{"$8.30"}</Text>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{texts.discount}</Text>
          <HStack space={2}>
            <Input h={"6"} value='0%' w={100} />
            <Input h={"6"} value='$0.00' w={100} isDisabled={true} />
          </HStack>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{texts.tip}</Text>
          <HStack space={2}>
            <Input h={"6"} value='20%' w={100} />
            <Input h={"6"} value='$20.00' w={100} isDisabled={true} />
          </HStack>
        </HStack>
        <Divider marginY={6} />
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"3xl"} bold>{texts.total}</Text>
          <Text fontSize={"3xl"} bold>{"$128.30"}</Text>
        </HStack>
        <Button
          w={"full"}
          onPress={() => console.log("View Summary")}
          mb={4}
          mt={6}
          colorScheme={"tertiary"}
        >
          {texts.pay}
        </Button>
      </VStack>
    </Center>
  )
}
