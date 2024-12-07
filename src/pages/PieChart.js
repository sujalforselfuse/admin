import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const successToast = (msg) => toast.success(msg, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    transition: Slide,
    theme: "light",

});;

const errorToast = (msg) => toast.error(msg, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    transition: Slide,
    theme: "light",

});;


  const fetchOrders = async () => {
    try {
      const res = await fetch('https://ratna-backend-smp.onrender.com/api/v1/order/getorder', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`,
        },
      });
      const data = await res.json();
      if (data?.success) {
        setOrders(data?.data);
        processChartData(data?.data);
      } else {
        errorToast('Failed to fetch orders');
      }
    } catch (error) {
      errorToast('Failed to fetch orders');
      console.log(error);
    }
  };

  const processChartData = (orders) => {
    const productQuantities = {};

    orders?.forEach(order => {
      order?.products?.forEach(product => {
        if (productQuantities[product.name]) {
          productQuantities[product.name] += product.quantity;
        } else {
          productQuantities[product.name] = product.quantity;
        }
      });
    });

    const labels = Object.keys(productQuantities);
    const data = Object.values(productQuantities);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Product Quantity Distribution',
          data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <ToastContainer />
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
