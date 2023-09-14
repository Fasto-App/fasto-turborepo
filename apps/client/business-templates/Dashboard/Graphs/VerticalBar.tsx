import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box } from 'native-base';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Numbers os Orders per month',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Total Orders',
      data: labels.map(() => Math.round(Math.random() * 100)),
      backgroundColor: 'rgba(38, 42, 160, 0.5)',
    },
  ],
};

export function VerticalBar() {
  return <Box borderWidth={0.5}
    borderColor={"gray.200"}
    shadow={"2"}
    borderRadius={"md"}
    bgColor={"white"}
    p={2}
    flex={1}
  ><Bar options={options} data={data} />
  </Box>;
}
