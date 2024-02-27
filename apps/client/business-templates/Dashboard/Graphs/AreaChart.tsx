import React from "react";
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
import { Text, Skeleton, View } from "native-base";
import {
  DateType,
  useGetPaidCheckoutByDateQuery,
} from "../../../gen/generated";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { DatePickerWithRange } from "../DatePicker";
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
};

export function AreaChart({ selectedCheckoutFilter, setSelectedCheckoutFilter, }: AreaChartProps) {
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
    <div className="bg-white">
      <DatePickerWithRange />
      <Line options={options} data={data} />
    </div>
  );
}