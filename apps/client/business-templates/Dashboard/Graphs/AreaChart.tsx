import React, { useState } from 'react';
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Heading, Stack, Button, Text, Skeleton } from 'native-base';
import { DateType, useGetPaidCheckoutByDateQuery } from '../../../gen/generated';
import { useRouter } from 'next/router';
import { parseToCurrency } from 'app-helpers';

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
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'CashFlow',
    },
  },
  elements: {
    line: {
      tension: 0.4,
      animations: true
    }
  }
};



export function AreaChart() {
  const router = useRouter()

  const [selectedCheckoutFilter, setSelectedCheckoutFilter] = useState(DateType.SevenDays)

  const { loading, data: checkoutData, error } = useGetPaidCheckoutByDateQuery({
    variables: {
      input: {
        type: selectedCheckoutFilter
      }
    }
  })

  if (!checkoutData?.getPaidCheckoutByDate.data) return <Skeleton h="80" rounded={"md"} />

  const labels = checkoutData?.getPaidCheckoutByDate.data.map(day => day?._id || "")
  const values = checkoutData?.getPaidCheckoutByDate.data.map(day => (day?.totalAmount || 0) / 100)

  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Rendimento Bruto R$',
        data: values,
        borderColor: 'rgb(31, 178, 80)',
        backgroundColor: 'rgba(53, 235, 117, 0.5)',
        pointRadius: 5,
      },
    ],
  };

  const triggerShallowNav = (type: DateType) => () => {
    if (selectedCheckoutFilter === type) return
    setSelectedCheckoutFilter(type)
  }


  return (
    <Border>
      <Stack mb="2.5" mt="1.5" direction={{
        base: "column",
        md: "row"
      }} space={2} mx={{
        base: "auto",
        md: "0"
      }}>
        <Button
          size="sm" variant="ghost"
          isPressed={selectedCheckoutFilter === DateType.SevenDays}
          onPress={triggerShallowNav(DateType.SevenDays)}
        >
          7 Days
        </Button>
        <Button
          onPress={triggerShallowNav(DateType.ThirtyDays)}
          isPressed={selectedCheckoutFilter === DateType.ThirtyDays}
          size="sm" variant="ghost" >
          30 Days
        </Button>
      </Stack>
      <Line options={options} data={data} />
    </Border>
  )
}

const Border: React.FC = ({ children }) =>
  <Box flex={1}
    borderWidth={1}
    borderColor={"gray.200"}
    shadow={"2"}
    borderRadius={"md"}
    bgColor={"white"}
    justifyContent={"center"}
    p={4}>
    {children}
  </Box>
