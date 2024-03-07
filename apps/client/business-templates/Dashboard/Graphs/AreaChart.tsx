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
  useGetPaidCheckoutToAndFromDateQuery,
} from "../../../gen/generated";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { DatePickerWithRange } from "../DatePicker";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/shadcn/components/ui/card";
import { Button } from "@/shadcn/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { DateRange } from "react-day-picker"
import { subDays } from "date-fns";

function setToEndOfDay(date: Date) {
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  date.setMilliseconds(999); // Optional but ensures that the milliseconds are also set to the maximum
  return date;
}

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

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: setToEndOfDay(subDays(new Date(), 7)),
    to: setToEndOfDay(new Date()),
  })

  const { loading,
    data: checkoutData,
    error,
    refetch
  } = useGetPaidCheckoutToAndFromDateQuery({
    variables: {
      input: {
        fromDate: date?.from?.toDateString()!,
        toDate: date?.to?.toDateString()!,
      },
    },
  })

  if (!checkoutData?.getPaidCheckoutToAndFromDate?.data && loading)
    return <Skeleton h="80" rounded={"md"} />;
  if (!checkoutData?.getPaidCheckoutToAndFromDate?.data)
    return (
      <View h="80" rounded={"md"}>
        <Text>No Data Available</Text>
      </View>
    );

  const labels = checkoutData?.getPaidCheckoutToAndFromDate.data.map(
    (day) => day?._id || ""
  );
  const values = checkoutData?.getPaidCheckoutToAndFromDate.data.map(
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

  const triggerRefetch = () => {
    alert(JSON.stringify({
      date
    }))

    refetch({
      input: {
        fromDate: date?.from?.toDateString()!,
        toDate: date?.to?.toDateString()!,
      },
    })
  }

  return (
    <Card className="col-span-6 xl:col-span-4">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription className="flex flex-1 flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-4">
            <DatePickerWithRange
              date={date}
              setDate={setDate}
            />
            <Button variant="default" size="icon" onClick={triggerRefetch}>
              <MagnifyingGlassIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-white">
          <Line options={options} data={data} />
        </div>
      </CardContent>
    </Card>
  );
}