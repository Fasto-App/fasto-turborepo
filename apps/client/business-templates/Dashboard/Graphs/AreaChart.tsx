import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, Heading, Stack, Button, Text, Skeleton, View } from "native-base";
import {
  DateType,
  useGetPaidCheckoutByDateQuery,
} from "../../../gen/generated";
import { useRouter } from "next/router";
import { parseToCurrency } from "app-helpers";
import { useTranslation } from "next-i18next";
// 
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "CashFlow",
    },
  },
  elements: {
    line: {
      tension: 0.4,
      animations: true,
    },
  },
};

type AreaChartProps = {
  selectedCheckoutFilter: DateType;
  setSelectedCheckoutFilter: React.Dispatch<React.SetStateAction<DateType>>;
  allTime: string;
  days30: string;
  days7: string;
};



export function AreaChart({ selectedCheckoutFilter, setSelectedCheckoutFilter, allTime, days30, days7 }: AreaChartProps) {
  const { t } = useTranslation("businessDashboard");
  const router = useRouter();
  const {
    loading,
    data: checkoutData,
    error,
  } = useGetPaidCheckoutByDateQuery({
    variables: {
      input: {
        type: selectedCheckoutFilter,
      },
    },
  });

  if (!checkoutData?.getPaidCheckoutByDate?.data && loading)
    return <Skeleton h="80" rounded={"md"} />;
  if (!checkoutData?.getPaidCheckoutByDate?.data)
    return (
      <View h="80" rounded={"md"}>
        <Text>No Data Available</Text>
      </View>
    );

  const labels = checkoutData?.getPaidCheckoutByDate.data.map(
    (day) => day?._id || ""
  );
  const values = checkoutData?.getPaidCheckoutByDate.data.map(
    (day) => (day?.totalAmount || 0) / 100
  );

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        fill: true,
        label: t("grossIncome"),
        data: values,
        borderColor: "rgb(31, 178, 80)",
        backgroundColor: "rgba(53, 235, 117, 0.5)",
        pointRadius: 5,
      },
    ],
  };

  const triggerShallowNav = (type: DateType) => () => {
    if (selectedCheckoutFilter === type) return;
    setSelectedCheckoutFilter(type);
  };

  return (
    <Border>
      <Stack
        mb="2.5"
        mt="1.5"
        direction={{
          base: "column",
          md: "row",
        }}
        space={2}
        mx={{
          base: "auto",
          md: "0",
        }}
      >
        <Button
          onPress={triggerShallowNav(DateType.AllTime)}
          isPressed={selectedCheckoutFilter === DateType.AllTime}
          size="sm"
          variant="ghost"
        >
          {allTime}
        </Button>
        <Button
          onPress={triggerShallowNav(DateType.ThirtyDays)}
          isPressed={selectedCheckoutFilter === DateType.ThirtyDays}
          size="sm"
          variant="ghost"
        >
          {days30}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          isPressed={selectedCheckoutFilter === DateType.SevenDays}
          onPress={triggerShallowNav(DateType.SevenDays)}
        >
          {days7}
        </Button>
      </Stack>
      <Line options={options} data={data} />
    </Border>
  );
}

const Border: React.FC = ({ children }) => (
  <Box
    flex={1}
    borderWidth={1}
    borderColor={"gray.200"}
    shadow={"2"}
    borderRadius={"md"}
    bgColor={"white"}
    justifyContent={"center"}
    p={4}
  >
    {children}
  </Box>
);
