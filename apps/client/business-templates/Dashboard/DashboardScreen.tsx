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
import { ScrollArea, ScrollBar } from "@/shadcn/components/ui/scroll-area";
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
        <ScrollArea className="h-full">
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
                <AreaChart
                  selectedCheckoutFilter={selectedCheckoutFilter}
                  setSelectedCheckoutFilter={setSelectedCheckoutFilter}
                />
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
    <div className="p-4 space-y-2 border border-gray-50 shadow-md rounded-md mt-[20px] sm:mt-0 bg-white z-10">
      <h1 className="text-lg">
        {`${t("hello")} ${userData?.data?.getUserInformation?.name}`}
      </h1>
      <h1 className="text-xs">{t("welcomeDashBoard")}</h1>
      <div className="flex gap-3">
        <div className="p-3 border border-cool-gray-200 rounded-md min-w-min">
          <p className="text-md">{t("totalRevenue")}</p>
          <p className="text-md font-bold">
            {loading ? (
              <>
                <span className="animate-spin mr-1">⏳</span>
                <span className="text-primary-500">Loading...</span>
              </>
            ) : (
              revenue
            )}
          </p>
        </div>
        <div className="p-3 border border-cool-gray-200 rounded-md min-w-min">
          <p className="text-md">{t("mostSellingItem")}</p>
          <p className="text-md font-bold">
            {loading ? (
              <>
                <span className="animate-spin mr-1">⏳</span>
                <span className="text-primary-500">Loading...</span>
              </>
            ) : (
              mostSellingItem
            )}
          </p>
        </div>
        <div className="p-3 border border-cool-gray-200 rounded-md min-w-min">
          <p className="text-md">{t("numberOfOrders")}</p>
          <p className="text-md font-bold">+132</p>
        </div>
      </div>
    </div>
  );
};
