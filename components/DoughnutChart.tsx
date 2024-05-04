'use client'

import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

// rest of your code

const DoughnutChart = ({accounts}: DoughnutChartProps) => {


  const data = {
    labels: ['Bank 1', 'Bank 2', 'Bank 3'],
    datasets: [
      {
        label: 'Banks',
        data: [1245, 2346, 7432, 1234],
        backgroundColor: ['#003f5c', '#2f4b7c', '#665191', '#a05195'],
      }, 
    ],
  }

  return ( 
    <Doughnut 
      data={data} 
      options={{
        cutout: '60%',
        plugins: {
          legend: {
            display: false
          }
        }
      }}
    />
  )
}

export default DoughnutChart