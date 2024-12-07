import React, { useEffect, useState } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Register the required components
ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

// Function to process product sales data
const processProductSalesData = (orders) => {
  const productSales = {};

  orders?.forEach(order => {
    order?.products?.forEach(product => {
      if (productSales[product.name]) {
        productSales[product.name] += product.price * product.quantity;
      } else {
        productSales[product.name] = product.price * product.quantity;
      }
    });
  });

  const labels = Object.keys(productSales);
  const data = Object.values(productSales);

  return {
    labels,
    datasets: [
      {
        label: 'Product Sales',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
};

const BarChart = () => {
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
      if (data.success) {
        setOrders(data?.data);
        setChartData(processProductSalesData(data?.data));
      } else {
        errorToast('Failed to fetch orders');
      }
    } catch (error) {
      errorToast('Failed to fetch orders');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h2>Product Sales</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
