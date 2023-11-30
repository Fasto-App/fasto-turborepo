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
import { useTranslation } from "next-i18next";

export function VerticalBar() {
  const { t } = useTranslation("businessDashboard");
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('numbersOfOrdersPerMonth'),
      },
    },
  };
  
  const labels = [t('january'), t('february'), t('march'), t('april'), t('may'), t('june'), t('july'), t('august'), t('september'), t('october'), t('november'), t('december')];
  
  const data = {
    labels,
    datasets: [
      {
        label: t('totalOrders'),
        data: labels.map(() => Math.round(Math.random() * 100)),
        backgroundColor: 'rgba(38, 42, 160, 0.5)',
      },
    ],
  };
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
