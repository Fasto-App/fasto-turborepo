import { typedKeys } from 'app-helpers'
import { Box, Flex, Heading, VStack, Text, ScrollView, HStack, Button } from 'native-base'
import { useRouter } from 'next/router'
import React from 'react'
import { LeftSideBar } from '../../components'
import { BottomSection } from '../../components/BottomSection'
import { OrangeBox } from '../../components/OrangeBox'
import { TileButton } from '../../components/TileButton'
import { UpperSection } from '../../components/UpperSection'
import { useGetCheckoutByIdQuery } from '../../gen/generated'
import { useCheckoutStore } from './checkoutStore'
import { PayInFull } from './PayInFull'
import { Split } from './Split'

const texts = {
  leftText: "Thank you for your order!\n You're almost there. Please review your items below and proceed to checkout when you're ready.",
  table: (table: string) => `Table ${table}`,
  viewSummary: "View Summary",
}

const checkoutOptions = {
  payFull: "Pay in Full",
  splitBill: "Split Bill"
}

export const Checkout = () => {
  const [selectedOption, setSelectedOption] = React.useState<keyof typeof checkoutOptions>("payFull")
  const route = useRouter()
  const { checkoutId } = route.query

  const { data } = useGetCheckoutByIdQuery({
    skip: !checkoutId,
    variables: {
      input: {
        _id: checkoutId as string
      }
    },
  });

  const {
    paid,
    status,
    subTotal,
    tax,
    tip,
    totalPaid,
    total } = data?.getCheckoutByID || {}

  return (
    <Flex flexDirection={"row"} flex={1}>
      <LeftSideBar>
        <Box flex={1} justifyContent={"center"}>
          <Text textAlign={"center"}>
            {texts.leftText}
          </Text>
        </Box>
        <Button
          w={"full"}
          onPress={() => console.log("View Summary")}
          mb={4}
        >
          {texts.viewSummary}
        </Button>
      </LeftSideBar>
      <Box flex={1}>
        <OrangeBox />
        <VStack flex={1} p={2} space={4}>
          <UpperSection>
            <Heading>
              {texts.table("3")}
            </Heading>
            <HStack space={"4"}>
              {typedKeys(checkoutOptions).map((option) => (
                <TileButton
                  key={option}
                  onPress={() => setSelectedOption(option)}
                  selected={selectedOption === option}
                >
                  {checkoutOptions[option]}
                </TileButton>
              ))}
            </HStack>
          </UpperSection>
          <BottomSection>
            {selectedOption === "payFull" ?
              <PayInFull
                totalPaid={totalPaid}
                status={status}
                paid={paid}
                tax={tax}
                subTotal={subTotal}
                tip={tip}
                total={total}
              /> : <Split
                totalPaid={totalPaid}
                status={status}
                paid={paid}
                tax={tax}
                subTotal={subTotal}
                tip={tip}
                total={total}
              />}
          </BottomSection>
        </VStack>
      </Box>
    </Flex>
  )
}
