import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, Button, Center } from 'native-base';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Pastel', 'Nata', 'Chicken', 'Peas', 'Coke'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export function PieChart() {
  return <Center borderWidth={0.5}
    borderColor={"gray.50"}
    shadow={"2"}
    borderRadius={"md"}
    bgColor={"white"}
  >
    <Pie data={data} />
    <Center
      w={"full"}
      borderWidth={0.5}
      borderColor={"gray.50"}
      shadow={"2"}
      borderRadius={"md"}
      bgColor={"white"}
      flex={1}
    >
      <Button>
        Learn morel
      </Button>
    </Center>
  </Center>
}
