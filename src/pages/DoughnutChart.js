import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
/* import { set } from 'mongoose'; */

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ totals }) => {
  
  

  const data = {
    labels: ['Total Amount', 'Total Discount', 'Amount After Discount'],
    datasets: [
      {
        label: 'Amount Breakdown',
        data: [totals.totalAmount, totals.totalDiscount, totals.amountAfterDiscount], // Corresponding amounts
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Doughnut data={data} />
    </div>
  );
};

export default DoughnutChart;
