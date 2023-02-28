import { typedKeys } from 'app-helpers'
import { HStack, Heading, Center, Divider, Pressable, Box, Input, Text, VStack, Button } from 'native-base'
import React, { FC, useState } from 'react'
import { texts } from './texts'

const splitTypes = {
  byPatron: "By Patron",
  equally: "Equally",
}


const Cell: FC<{ bold?: boolean }> = ({ children, bold }) => {
  return (
    <Text
      w={140}
      alignSelf={"center"}
      textAlign={"center"}
      fontSize={"lg"}
      bold={bold}
    >
      {children}
    </Text>
  )
}

const Header = () => {
  return (
    <HStack py={2}>
      <Cell bold>
        {texts.patron}
      </Cell>
      <Cell bold>
        {texts.subtotal}
      </Cell>
      <Cell bold>
        {texts.sharedByTable}
      </Cell>
      <Cell bold>
        {texts.feesAndTax}
      </Cell>
      <Cell bold>
        {texts.tip}
      </Cell>
      <Cell bold>
        {texts.total}
      </Cell>
      <Box flex={1} />
    </HStack>
  )
}

const Row = () => {
  return (<HStack>
    <Cell>
      Person 1
    </Cell >
    <Cell>
      $1000.00
    </Cell>
    <Cell>
      $10000.00
    </Cell>
    <Cell>
      $10000.00
    </Cell>
    <Cell>
      $100000.00
    </Cell>
    <Cell bold>
      $1000000.00
    </Cell>
    <Box flex={1} justifyContent={"center"} alignItems={"center"} >
      <Button w={"80%"} minW={"100"} fontSize={"2xl"} h={"80%"} colorScheme={"tertiary"}>
        Pay
      </Button>
    </Box>
  </HStack>)
}

export const Split = () => {
  const [selectedOption, setSelectedOption] = useState<keyof typeof splitTypes>("byPatron")

  return (
    <Box flex={1}>
      <Center>
        <HStack justifyContent={"space-around"} w={"70%"} pb={4} space={2}>
          {typedKeys(splitTypes).map((type) => (
            <Pressable
              key={type}
              flex={1}
              justifyContent={"center"}
              onPress={() => setSelectedOption(type)}
            >
              <Heading
                textAlign={"center"}
                size={"md"}
                color={selectedOption === type ? "primary.500" : "gray.400"}
              >
                {splitTypes[type]}
              </Heading>
              <Divider mt={1} backgroundColor={selectedOption === type ? "primary.500" : "gray.400"} />
            </Pressable>
          ))}
        </HStack>
      </Center>
      <Box flex={1}>
        <Box flex={1} >
          <Header />
          <Row />
          <Row />
          <Row />
          <Row />
        </Box>

        <VStack w={"50%"} minW={"lg"} pt={8} space={4}>
          {true ? <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"lg"}>{texts.AllByTable}</Text>
            <Text fontSize={"lg"}>{"$80.00"}</Text>
          </HStack> : null}
          <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"lg"}>{texts.subtotal}</Text>
            <Text fontSize={"lg"}>{"$100.00"}</Text>
          </HStack>
          <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"lg"}>{texts.feesAndTax}</Text>
            <Text fontSize={"lg"}>{"$8.30"}</Text>
          </HStack>
          <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"lg"}>{texts.discount}</Text>
            <HStack space={2}>
              <Input value='0%' w={100} />
              <Input value='$0.00' w={100} isDisabled={true} />
            </HStack>
          </HStack>
          <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"lg"}>{texts.tip}</Text>
            <HStack space={2}>
              <Input value='20%' w={100} />
              <Input value='$20.00' w={100} isDisabled={true} />
            </HStack>
          </HStack>
          <Divider marginY={2} />
          <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"xl"} bold>{texts.total}</Text>
            <Text fontSize={"xl"} bold>{"$128.30"}</Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}
