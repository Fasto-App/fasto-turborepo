import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  HStack,
  Button,
  Center,
  Divider,
  ScrollView,
  Image,
  Pressable
} from "native-base";
import { useRouter } from "next/router";
import React from "react";
import { LeftSideBar } from "../../components";
import { BottomSection } from "../../components/BottomSection";
import { OrangeBox } from "../../components/OrangeBox";
import { SuccessAnimation } from "../../components/SuccessAnimation";
import { TileButton } from "../../components/TileButton";
import { UpperSection } from "../../components/UpperSection";
import {
  GetCheckoutByIdDocument,
  useGetCheckoutByIdQuery,
  useGetTabCheckoutByIdQuery,
  useMakeCheckoutPaymentMutation,
} from "../../gen/generated";
import { PayInFull } from "./PayInFull";
import { Split } from "./Split";
import { businessRoute } from "fasto-route";
import { useCheckoutStore } from "./checkoutStore";
import { useTranslation } from "next-i18next";
import {
  parseToCurrency,
  parseToFixedPoint,
} from "app-helpers";
import { PaymentTile } from "./TableComponents";
import { showToast } from "../../components/showToast";
import { CheckoutModal } from "./CheckoutModal";

const checkoutOptions = ["payFull", "splitBill", "success"] as const;

export const Checkout = () => {
  const [showOrdersModal, setShowOrdersModal] = React.useState(false);
  const [selectedOption, setSelectedOption] =
    React.useState<typeof checkoutOptions[number]>("payFull");
  const route = useRouter();
  const { checkoutId, tabId } = route.query;

  const setTotal = useCheckoutStore((state) => state.setTotal);
  const { t } = useTranslation("businessCheckout");

  const [makeCheckoutPayment, { loading }] = useMakeCheckoutPaymentMutation({
    refetchQueries: [
      {
        query: GetCheckoutByIdDocument,
        variables: {
          input: {
            _id: checkoutId as string,
          },
        },
      },
    ],
  });

  const { data: tabData } = useGetTabCheckoutByIdQuery({
    skip: !tabId,
    variables: {
      input: {
        _id: tabId as string,
      },
    },
  });

  // TODO: get the table number from either the Checkout or the Tab
  const { data } = useGetCheckoutByIdQuery({
    skip: !checkoutId,
    variables: {
      input: {
        _id: checkoutId as string,
      },
    },
    onCompleted: (data) => {
      const { status, paid, splitType, subTotal } = data?.getCheckoutByID || {};

      switch (splitType) {
        case "Full":
          console.log("Full");
          setSelectedOption("payFull");
          break;
        case "Equally":
        case "Custom":
        case "ByPatron":
          setSelectedOption("splitBill");
          break;
      }

      if (subTotal) {
        setTotal(subTotal);
      }

      if (status === "Paid" && paid) {
        console.log("success");
        setSelectedOption("success");
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
    splitType,
    payments,
    taxValue,
    serviceFeeValue,
    total,
  } = data?.getCheckoutByID || {};

  // if the cehckout has a split type that is not "Full", change the selected option
  // show some different UI that will allow to make the payments

  if (!subTotal) return null;
  return (
    <>
      <CheckoutModal
        setIsOpen={setShowOrdersModal}
        checkoutId={checkoutId as string}
        isOpen={showOrdersModal}
      />

      <Flex flexDirection={"row"} flex={1}>
        <LeftSideBar>
          <Pressable
            onPress={() => {
              route.push({
                pathname: businessRoute.dashboard,
              });
            }}
          >
            <Center>
              <Image
                src="/images/fasto-logo.svg"
                alt="Fasto Logo"
                height={36}
                width={180}
              />
            </Center>
          </Pressable>
          <Box flex={1} justifyContent={"center"}>
            <Text textAlign={"center"}>{t("leftText")}</Text>
          </Box>

          <Button.Group flexDirection={"column"}>
            <Button w={"full"} onPress={() => setShowOrdersModal(true)} mb={6}>
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
              <Heading>{t("checkout")}</Heading>
              <HStack space={"4"}>
                {checkoutOptions
                  .filter((option) => option !== "success")
                  .map((option) => (
                    <TileButton
                      isDisabled={
                        !!data?.getCheckoutByID?.splitType ||
                        (option === "splitBill" &&
                          !!tabData?.getTabByID?.users?.length &&
                          tabData?.getTabByID?.users?.length < 2)
                      }
                      key={option}
                      onPress={() =>
                        selectedOption !== "success" &&
                        setSelectedOption(option)
                      }
                      selected={selectedOption === option}
                    >
                      {option === "payFull" ? t("payInFull") : t("splitBill")}
                    </TileButton>
                  ))}
              </HStack>
            </UpperSection>
            <BottomSection>
              {selectedOption === "success" ? (
                <Center h={"full"}>
                  <Box size={"32"} mb={12}>
                    <SuccessAnimation />
                  </Box>
                  <Text fontSize={"2xl"} textAlign={"center"}>
                    {t("sessionEnded")}
                    <Button
                      flex={1}
                      p={0}
                      textDecoration={"underline"}
                      textDecorationColor={"info.500"}
                      variant="link"
                      size="med"
                      colorScheme="info"
                      onPress={() => route.push({ pathname: businessRoute.payments })}
                      justifyContent={"end"}
                    >
                      {t("goBack")}
                    </Button>
                  </Text>
                </Center>
              ) : !!splitType ? (
                <Center flex={1}>
                  {/* Pegar os dados da conta e mostrar para o business */}
                  <ScrollView w={"full"} flex={1}>
                    <VStack width={"full"} space={4}>
                      <SummaryRow label={t("splitType")} value={t(splitType)} />
                      <SummaryRow
                        label={t("subtotal")}
                        value={parseToCurrency(subTotal)}
                      />
                      <SummaryRow
                        label={t("serviceFee")}
                        value={parseToCurrency(serviceFeeValue)}
                      />
                      <SummaryRow
                        label={t("tip")}
                        value={parseToCurrency(
                          parseToFixedPoint(tip ?? 0) * (subTotal ?? 0)
                        )}
                      />
                      <SummaryRow
                        label={t("feesAndTax")}
                        value={parseToCurrency(taxValue)}
                      /> 
                      <Divider my={2} />
                      <SummaryRow
                        label={t("total")}
                        value={parseToCurrency(total)}
                      />
                    </VStack>
                    <Box height={"12"} />
                    <Text fontSize={"2xl"} textAlign={"center"} pb={4} bold>
                      {t("splitBill")}
                    </Text>
                    {payments?.map((payment, i) => (
                      <PaymentTile
                        key={payment?._id}
                        customer={`${t("customer")} ${++i}`}
                        subtotal={parseToCurrency(payment?.amount)}
                        tip={parseToCurrency(payment?.tip)}
                        loading={loading}
                        cta={t("pay")}
                        disable={!!payment?.paid}
                        onPress={async () => {
                          if (!payment) return;

                          // each of the payments will be made individually
                          // this will be a diferent function that will take the payment id, checkout id and user id
                          // and will make the payment, then it will update the checkout and the user
                          await makeCheckoutPayment({
                            variables: {
                              input: {
                                checkout: checkoutId as string,
                                payment: payment._id,
                              },
                            },
                          });
                        }}
                      />
                    ))}
                  </ScrollView>
                </Center>
              ) : selectedOption === "payFull" ? (
                <PayInFull
                  totalPaid={totalPaid}
                  status={status}
                  paid={paid}
                  tax={tax}
                  subTotal={subTotal}
                  tip={tip}
                  total={total}
                  setSelectedOption={setSelectedOption}
                  taxValue={taxValue}
                />
              ) : selectedOption === "splitBill" ? (
                <Split
                  tax={tax}
                  subTotal={subTotal}
                  payments={data?.getCheckoutByID?.payments || []}
                />
              ) : null}
            </BottomSection>
          </VStack>
        </Box>
      </Flex>
    </>
  );
};

export const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <HStack justifyContent={"space-between"} px={12}>
    <Text fontSize={"xl"}>{label}</Text>
    <Text fontSize={"lg"}>{value}</Text>
  </HStack>
);
