import React from 'react';
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
import { Box, Heading, Stack, Button } from 'native-base';

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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'March', 'April', 'May', 'June', 'July', 'March', 'April', 'May', 'June', 'July'];

export const data: ChartData<'line'> = {
  labels,
  datasets: [
    {
      // fill: true,
      // label: 'Rendimento Bruto',
      data: labels.map(() => Math.round(Math.random() * 100)),
      borderColor: 'rgb(31, 178, 80)',
      backgroundColor: 'rgba(53, 235, 117, 0.5)',
      pointRadius: 5,
    },
  ],
};

export function AreaChart() {

  return (
    <Box flex={1}
      borderWidth={1}
      borderColor={"gray.200"}
      shadow={"2"}
      borderRadius={"md"}
      bgColor={"white"}
      justifyContent={"center"}>

      <Stack p={4} pt={8} mb="2.5" mt="1.5" direction={{
        base: "column",
        md: "row"
      }} space={2} mx={{
        base: "auto",
        md: "0"
      }}>
        <Button size="sm" variant="ghost">
          PRIMARY
        </Button>
        <Button size="sm" variant="ghost">
          SECONDARY
        </Button>
        <Button size="sm" variant="ghost" isDisabled>
          DISABLED
        </Button>
      </Stack>
      <Line options={options} data={data} />
    </Box>
  )
}
