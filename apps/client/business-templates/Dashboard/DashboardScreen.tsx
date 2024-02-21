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
      {/* <div className="flex flex-1 bg-gray-100"> */}
      <OrangeBox />
      {/* <VStack space={4} p={4} flex={1} borderWidth={1}> */}
      <div className="flex flex-1 gap-4 p-4 flex-col">
        <Panel
          loading={loading}
          mostSellingItem={data?.getMostSellingProducts?.[0]?.name}
          revenue={parseToCurrency(checkoutData?.getPaidCheckoutByDate?.total)}
        />
        <Card className="h-full">
          <Tabs defaultValue="pagamentos" className="flex flex-1 flex-col p-2">
            <div className="flex justify-end w-full">
              <TabsList className="w-[400px]">
                <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
                <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="pedidos">
              <div className="grid xl:grid-cols-6 gap-4 border-1 border-red-500">
                <ScrollArea className="p-2 border-1 border-red-500">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <VerticalBar />
                    </CardContent>
                  </Card>

                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <PieChart data={data} />
                    </CardContent>
                  </Card>
                </ScrollArea>
              </div>

            </TabsContent>
            <TabsContent value="pagamentos">
              <div className="grid lg:grid-cols-6 gap-4 border-1 border-red-500">
                <Card className="lg:col-span-4">
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
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <RecentSales />
                  </CardContent>
                </Card>

              </div>
            </TabsContent>


          </Tabs>
        </Card>
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
