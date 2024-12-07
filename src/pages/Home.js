import React, { useState, useEffect } from 'react'
import Sample from './DoughnutChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ring } from 'ldrs'
/* import { set } from 'mongoose'; */
ring.register()
export default function Home() {
  const [totals, setTotals] = useState({ totalAmount: 0, totalDiscount: 0, amountAfterDiscount: 0 });
  const [orderLength, setOrderLength] = useState(0);
  const [visitorLength, setVisitorLength] = useState(0);
  const [visitorLoading, setVisitorLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [draftLength, setDraftLength] = useState(0);

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

    setOrderLoading(true);
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
        const product_list = data.data;
        const totals = product_list?.reduce((acc, order) => {
          acc.totalAmount += order.totalAmount;
          acc.totalDiscount += order.totalDiscount;
          acc.amountAfterDiscount += order.amountAfterDiscount;
          return acc;
        }, { totalAmount: 0, totalDiscount: 0, amountAfterDiscount: 0 });

        setTotals(totals);
        setOrderLength(product_list.length);
        setDraftLength(product_list.filter((order) => order.orderedBy === 'Employ').length);

      } else {
        errorToast('Failed to fetch orders');
      }
    } catch (error) {
      errorToast('Failed to fetch orders');
      console.log(error);
    }
    setOrderLoading(false);
  };



  const fetchVisitor = async () => {
    setVisitorLoading(true);
    try {

      const res = await fetch('https://ratna-backend-smp.onrender.com/api/v1/visitors/getallvisitor', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
        },
      });

      const data = await res.json();

      if (data.success) {

        setVisitorLength(data.data.length);

      } else {

        errorToast('Failed to fetch visitor');

      }

    } catch (error) {

      errorToast('Failed to fetch visitor');

    }
    setVisitorLoading(false);

  }

  useEffect(() => {
    fetchOrders();
    fetchVisitor();
  }, []);

  return (
    <div className='' style={{ "background-image": "linear-gradient(115deg, #9F7AEA, #FEE2FE)" }}>
      <ToastContainer />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <h1 className='text-2xl font-bold mb-2 text-white'>Statistics</h1>
          <div className="flex flex-wrap -m-4 text-center">
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-200 bg-white px-4 py-6 rounded-lg">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="text-purple-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
                  <path d="M8 17l4 4 4-4m-4-5v9"></path>
                  <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"></path>
                </svg>
                <h2 className="title-font font-medium text-2xl text-gray-900">
                  {
                    visitorLoading ? <l-ring
                      size="16"

                      stroke="1"
                      bg-opacity="0"
                      speed="2"
                      color="black"
                    ></l-ring> : visitorLength
                  }
                </h2>
                <p className="leading-relaxed">Visitors</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-200 bg-white px-4 py-6 rounded-lg">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="text-purple-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"></path>
                </svg>
                <h2 className="title-font font-medium text-3xl text-gray-900">{
                    orderLoading ? <l-ring
                      size="16"

                      stroke="1"
                      bg-opacity="0"
                      speed="2"
                      color="black"
                    ></l-ring> : draftLength
                  }</h2>
                <p className="leading-relaxed">Drafts</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-200 bg-white px-4 py-6 rounded-lg">
                <svg className="text-purple-500 w-12 h-12 mb-3 inline-block" fill='currentColor' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M5.617 2.076a1 1 0 0 1 1.09.217L8 3.586l1.293-1.293a1 1 0 0 1 1.414 0L12 3.586l1.293-1.293a1 1 0 0 1 1.414 0L16 3.586l1.293-1.293A1 1 0 0 1 19 3v18a1 1 0 0 1-1.707.707L16 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L12 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L8 20.414l-1.293 1.293A1 1 0 0 1 5 21V3a1 1 0 0 1 .617-.924ZM9 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clip-rule="evenodd" />
                </svg>

                <h2 className="title-font font-medium text-2xl text-gray-900">
                  {
                    orderLoading ? <l-ring
                      size="16"

                      stroke="1"
                      bg-opacity="0"
                      speed="2"
                      color="black"
                    ></l-ring> :
                      orderLength
                  }
                  </h2>
                  
                <p className="leading-relaxed">Orders</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-200 bg-white px-4 py-6 rounded-lg">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="text-purple-500 w-12 h-12 mb-3 inline-block" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z" />
                </svg>

                <h2 className="title-font font-medium text-2xl text-gray-900">
                  {
                    orderLoading ? <l-ring
                      size="16"

                      stroke="1"
                      bg-opacity="0"
                      speed="2"
                      color="black"
                    ></l-ring> :
                      totals.amountAfterDiscount
                  }
                  </h2>
                <p className="leading-relaxed">Total Payment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='flex justify-around'>
        <div className='w-80 flex flex-col items-center border-2 p-4 bg-white'>
          <h1 className='font-semibold mb-6 text-xl'>Total Amount BreakDown</h1>
          <Sample totals={totals}></Sample>

        </div>
        <div className='w-80 flex flex-col items-center border-2 p-4 bg-white'>
          <h1 className='font-semibold mb-6 text-xl'>Product Vs Quantity</h1>
          <PieChart></PieChart>

        </div>
      </div>

      <div className='bg-black h-[0.1rem] my-4'></div>

      <div className='text-center mt-12 bg-white mx-20 py-4 px-40'>

        <h1 className='font-semibold mb-6 text-2xl'>Product Sales</h1>
        <BarChart></BarChart>

      </div>


      <div className='bg-black h-[0.1rem] my-4'></div>


    </div>
  )
}
