import { typedKeys } from 'app-helpers'
import { Box, Flex, Heading, VStack, Text, HStack, Button, Center } from 'native-base'
import { Link } from '../../components/atoms/Link';
import { useRouter } from 'next/router'
import React from 'react'
import { LeftSideBar } from '../../components'
import { BottomSection } from '../../components/BottomSection'
import { OrangeBox } from '../../components/OrangeBox'
import { SuccessAnimation } from '../../components/SuccessAnimation'
import { TileButton } from '../../components/TileButton'
import { UpperSection } from '../../components/UpperSection'
import { useGetCheckoutByIdQuery } from '../../gen/generated'
import { PayInFull } from './PayInFull'
import { Split } from './Split'
import { texts } from './texts'
import { businessRoute } from '../../routes';

const checkoutOptions = {
  payFull: "Pay in Full",
  splitBill: "Split Bill",
  success: "Success",
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
    onCompleted: (data) => {
      const { status, paid } = data?.getCheckoutByID || {}
      if (status === "Paid" && paid) {
        setSelectedOption("success")
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
              {typedKeys(checkoutOptions).filter((option) => option !== "success").map((option) => (
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
              /> : selectedOption === "splitBill" ? <Split
                totalPaid={totalPaid}
                status={status}
                paid={paid}
                tax={tax}
                subTotal={subTotal}
                tip={tip}
                total={total}
              /> : selectedOption === "success" ?
                <Center h={"full"}>
                  <Box size={"32"} mb={12}>
                    <SuccessAnimation />
                  </Box>
                  <Text fontSize={"2xl"}>
                    {texts.sessionEnded}
                    <Link fontSize={"2xl"} href={businessRoute.tables}>
                      {texts.backToManageTables}
                    </Link>
                  </Text>
                </Center>
                : null}
          </BottomSection>
        </VStack>
      </Box>
    </Flex>
  )
}
