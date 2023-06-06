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
import { businessRoute } from '../../routes';
import { useCheckoutStore } from './checkoutStore';
import { useTranslation } from 'next-i18next';

const checkoutOptions = ["payFull", "splitBill", "success"] as const

export const Checkout = () => {
  const [selectedOption, setSelectedOption] = React.useState<typeof checkoutOptions[number]>("payFull")
  const route = useRouter()
  const { checkoutId } = route.query

  const setTotal = useCheckoutStore(state => state.setTotal)
  const { t } = useTranslation("businessCheckout")

  // todo: get the table number from either the Checkout or the Tab
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

      if (data.getCheckoutByID.subTotal) {
        setTotal(data.getCheckoutByID.subTotal)
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
            {t("leftText")}
          </Text>
        </Box>

        <Button.Group flexDirection={"column"} >
          <Button
            w={"full"}
            onPress={() => console.log("View Summary")}
            mb={6}
          >
            {t("viewSummary")}
          </Button>
          <Button
            flex={1}
            p={0}
            variant="link"
            size="sm"
            colorScheme="info"
            onPress={() => route.back()}
            justifyContent={"end"}
          >
            {t("back")}
          </Button>
        </Button.Group>
      </LeftSideBar>
      <Box flex={1}>
        <OrangeBox />
        <VStack flex={1} p={2} space={4}>
          <UpperSection>
            <Heading>
              {t("table", { number: checkoutId as string })}
            </Heading>
            <HStack space={"4"}>
              {checkoutOptions.filter((option) => option !== "success").map((option) => (
                <TileButton
                  key={option}
                  onPress={() => selectedOption !== "success" && setSelectedOption(option)}
                  selected={selectedOption === option}
                >
                  {option === "payFull" ? t("payInFull") : t("splitBill")}
                </TileButton>
              ))}
            </HStack>
          </UpperSection>
          <BottomSection>
            {selectedOption === "payFull" ? (
              <PayInFull
                totalPaid={totalPaid}
                status={status}
                paid={paid}
                tax={tax}
                subTotal={subTotal}
                tip={tip}
                total={total}
              />) : selectedOption === "splitBill" ? (
                <Split
                  tax={tax}
                  subTotal={subTotal}
                  payments={data?.getCheckoutByID?.payments || []}
                />
              ) : selectedOption === "success" ?
              <Center h={"full"}>
                <Box size={"32"} mb={12}>
                  <SuccessAnimation />
                </Box>
                <Text fontSize={"2xl"}>
                  {t("sessionEnded")}
                  <Link fontSize={"2xl"} href={businessRoute.tables}>
                    {t("backToManageTables")}
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
