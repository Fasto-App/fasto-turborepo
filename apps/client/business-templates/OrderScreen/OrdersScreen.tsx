import React, { FC, useState } from "react";
import { OrangeBox } from "../../components/OrangeBox";
import {
  Box,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
  Pressable,
  Badge,
  FlatList,
  Checkbox,
  ChevronRightIcon,
  ChevronLeftIcon,
  Select,
} from "native-base";
import { UpperSection } from "../../components/UpperSection";
import { FDSSelect } from "../../components/FDSSelect";
import { BottomSection } from "../../components/BottomSection";
import { useTranslation } from "next-i18next";
import {
  CheckoutStatusKeys,
  useGetCheckoutsByBusinessQuery,
} from "../../gen/generated";
import { LoadingItems } from "./LoadingItems";
import { parseToCurrency, typedKeys } from "app-helpers";
import format from "date-fns/format";
import { useRouter } from "next/router";
import { getLocale } from "../../authUtilities/utils";
import { ColorSchemeType } from "native-base/lib/typescript/components/types";
import { OrdersModal } from "./OrdersModal";
import { Icon } from "../../components/atoms/NavigationButton";
import { BottomCheckoutTableWithModal } from "./BottomCheckoutTableWithModalOrders";

const TableHeader: FC = ({ children }) => (
  <Heading textAlign={"center"} flex="1" size={"md"}>
    {children}
  </Heading>
);

const TableData: FC = ({ children }) => (
  <Text textAlign={"center"} flex="1" fontSize={"md"}>
    {children}
  </Text>
);

const Header = ({
  onPress,
  selectAll,
  deselectedAll,
}: {
  onPress: () => void;
  selectAll: () => void;
  deselectedAll: () => void;
}) => {
  const { t } = useTranslation("businessPayments");

  return (
    <>
      <HStack bgColor={"white"} width={"100%"}>
        <HStack p="2" space={4}>
          <Checkbox
            value="All"
            accessibilityLabel={"All"}
            onChange={(selected) => {
              console.log("change state", selected);
              if (selected) {
                selectAll();
                return;
              }

              deselectedAll();
            }}
          />
          <Pressable onPress={onPress}>
            <Icon type="TrashCan" size={"1.5em"} />
          </Pressable>
        </HStack>
        <HStack
          justifyContent={"space-between"}
          pb="2"
          bgColor={"white"}
          flex={1}
        >
          <TableHeader>{t("check")}</TableHeader>
          <TableHeader> {t("date")}</TableHeader>
          <TableHeader>{t("amount")}</TableHeader>
          <TableHeader>{t("status")}</TableHeader>
        </HStack>
      </HStack>
      <Divider />
    </>
  );
};

type OrderDetailsProps = {
  _id: string;
  date: string;
  total: string;
  status: string;
  colorScheme: ColorSchemeType;
  onPress: () => void;
  onDelete: () => void;
  selected: boolean;
};

const OrderDetails = ({
  _id,
  date,
  total,
  status,
  colorScheme = "info",
  onPress,
  onDelete,
  selected,
}: OrderDetailsProps) => {
  return (
    <HStack alignItems={"center"}>
      <HStack p="2" space={4}>
        <Checkbox
          value={_id}
          accessibilityLabel={total}
          onChange={onDelete}
          isChecked={selected}
        />
      </HStack>

      <Pressable
        _hover={{ backgroundColor: "secondary.100" }}
        onPress={onPress}
        flex={1}
      >
        <HStack justifyContent={"space-between"} py={2}>
          <TableData>{_id}</TableData>
          <TableData>{date}</TableData>
          <TableData>{total}</TableData>
          <TableData>
            <Badge w={"full"} variant={"subtle"} colorScheme={colorScheme}>
              {status}
            </Badge>
          </TableData>
        </HStack>
      </Pressable>
    </HStack>
  );
};

export const OrdersScreen = () => {
  const { t } = useTranslation("businessOrders");
  const [modalData, setModalData] = useState({ isOpen: false, checkoutId: "" });

  return (
    <Box flex="1">
      <OrangeBox height={"78"} />
      <VStack flex={1} p={4} space={4}>
        <UpperSection>
          <Heading>{t("orders")}</Heading>
          <HStack justifyContent={"space-between"}>
            <Text>{t("hereIsYourList")}</Text>
            <HStack space={"2"}>
              <FDSSelect
                w={"100px"}
                h={"8"}
                placeholder={"date"}
                setSelectedValue={function (value: string): void {
                  throw new Error("Function not implemented.");
                }}
                array={[]}
              />

              <FDSSelect
                w={"100px"}
                h={"8"}
                placeholder={"status"}
                setSelectedValue={function (value: string): void {
                  throw new Error("Function not implemented.");
                }}
                array={[]}
              />
            </HStack>
          </HStack>
        </UpperSection>
        <BottomCheckoutTableWithModal
          setModalData={setModalData}
          modalData={modalData}
        />
      </VStack>
    </Box>
  );
};

type CheckoutState = {
  isOpen: boolean;
  checkoutId: string;
};


