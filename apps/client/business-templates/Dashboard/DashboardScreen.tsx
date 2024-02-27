import React, { useState } from "react";
import { Box, HStack, Heading, Text, VStack, Spinner } from "native-base";
import { AreaChart } from "./Graphs/AreaChart";
import { PieChart } from "./Graphs/PieChart";
import { VerticalBar } from "./Graphs/VerticalBar";
import { OrangeBox } from "../../components/OrangeBox";
import { useTranslation } from "next-i18next";
import {
  DateType,
  useGetMostSellingProductsQuery,
  useGetPaidCheckoutByDateQuery,
  useGetUserInformationQuery,
} from "../../gen/generated";
import { parseToCurrency } from "app-helpers";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/shadcn/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/components/ui/tabs";
import { RecentSales } from "./Graphs/RecentSales";

export const DashboardScreen = () => {
  const [selectedCheckoutFilter, setSelectedCheckoutFilter] = useState(
    DateType.SevenDays
  );
  const {
    data: checkoutData,
    error,
    loading,
  } = useGetPaidCheckoutByDateQuery({
    variables: {
      input: {
        type: selectedCheckoutFilter,
      },
    },
  });

  const { data } = useGetMostSellingProductsQuery()

  return (
    <div className="flex flex-1">
      <OrangeBox />
      <div className="flex flex-1 gap-4 p-4 flex-col">
        <Panel
          loading={loading}
          mostSellingItem={data?.getMostSellingProducts?.[0]?.name}
          revenue={parseToCurrency(checkoutData?.getPaidCheckoutByDate?.total)}
        />
        <ScrollArea className="h-full flex flex-1 ">
          <Card className="h-full p-2">
            <Tabs defaultValue="pagamentos" className="flex flex-1 flex-col p-2 gap-4 h-full">
              <TabsList className="flex justify-end w-full">
                <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
                <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
              </TabsList>

              <TabsContent value="pedidos" className="grid grid-cols-6 gap-4">
                <Card className="col-span-6 xl:col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VerticalBar />
                  </CardContent>
                </Card>

                <Card className="col-span-6 xl:col-span-2">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChart data={data} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pagamentos" className="grid grid-cols-6 gap-4">

                <Card className="col-span-6 xl:col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AreaChart
                      selectedCheckoutFilter={selectedCheckoutFilter}
                      setSelectedCheckoutFilter={setSelectedCheckoutFilter}
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-6 xl:col-span-2">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>

              </TabsContent>
            </Tabs>
          </Card>
        </ScrollArea>
      </div>
    </div>
  );
};
const Panel = ({ loading, revenue, mostSellingItem }: any) => {
  const userData = useGetUserInformationQuery();
  const { t } = useTranslation("businessDashboard");

  return (
    <VStack
      p={4}
      space={2}
      borderWidth={1}
      borderColor={"gray.50"}
      shadow={"2"}
      borderRadius={"md"}
      bgColor={"white"}
    >
      <Heading size="md">
        {`${t("hello")} ${userData
          ?.data?.getUserInformation
          ?.name}`}
      </Heading>
      <Heading size="xs">{t("welcomeDashBoard")}</Heading>

      <HStack space={"3"}>
        <Box
          p={"3"}
          borderRadius={"md"}
          borderColor={"coolGray.200"}
          borderWidth={1}
          w={"48"}
        >
          <Text fontSize={"md"}>{t("totalRevenue")}</Text>
          <Text fontSize={"md"} bold>
            {loading
              ? <>
                <Spinner accessibilityLabel="Loading posts" />  <Heading color="primary.500" fontSize="md">
                </Heading>
              </>
              : revenue}
          </Text>
        </Box>

        <Box
          p={"3"}
          borderRadius={"md"}
          borderWidth={1}
          borderColor={"coolGray.200"}
          w={"48"}
        >
          <Text fontSize={"md"}>{t("mostSellingItem")}</Text>
          <Text fontSize={"md"} bold>
            {loading ? <>
              {/* TODO: accessibility should be translated as well */}
              <Spinner accessibilityLabel="Loading posts" />  <Heading color="primary.500" fontSize="md">
              </Heading>
            </> : mostSellingItem}
          </Text>
        </Box>
        <Box
          p={"3"}
          borderRadius={"md"}
          borderWidth={1}
          borderColor={"coolGray.200"}
          w={"48"}
        >
          <Text fontSize={"md"}>{t("numberOfOrders")}</Text>
          <Text fontSize={"md"} bold>
            +132
          </Text>
        </Box>
      </HStack>
    </VStack>
  );
};
