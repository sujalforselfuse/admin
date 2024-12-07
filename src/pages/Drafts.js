import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ring } from 'ldrs'
ring.register()

export default function Drafts() {

    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = useState(false);

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


    // Indian Standard Time (IST) is UTC +5:30
    const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',   // You can use 'numeric' or 'short' for different formats
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true     // Use false for 24-hour format
    };

    const convertToDateString = (dateInMongoDB) => {
        const date = new Date(dateInMongoDB);

        return new Intl.DateTimeFormat('en-IN', options).format(date);
    }


    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://ratna-backend-smp.onrender.com/api/v1/order/getorder', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
                },
            });
            const data = await res.json();
            if (data.success) {
                console.log(data.data);
                setOrders(data.data);

            } else {
                errorToast('Failed to fetch orders');
            }
        } catch (error) {
            errorToast('Failed to fetch orders');
            console.log(error);
        }
        setLoading(false);

    }

    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <div className='px-4 mt-2 mb-6 flex flex-col'>
            <ToastContainer />
            <h1 className='text-2xl font-bold mb-2 '>Draft Orders</h1>

            <div class="pt-2 w-screen relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead class="text-xs text-white uppercase bg-purple-800 ">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Order Id
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Order Date
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Customer
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Amount
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Payment Status
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Fulfillment Status
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Items
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Mobile
                            </th>

                            <th scope="col" class="px-6 py-3">
                                More
                            </th>

                        </tr>
                    </thead>

                    {
                        loading ? <tr><td colSpan={2} className='text-center'>
                            <l-ring
                                className=''
                                size="60"
                                stroke="3"
                                bg-opacity="0"
                                speed="2"
                                color="white"
                            ></l-ring>
                        </td></tr>
                            :

                            <tbody>

                                {
                                    orders.filter((item) => item.orderedBy === "Employ").map((item) => {
                                        return (
                                            <tr class="bg-white border-b ">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                    {item._id}
                                                </th>
                                                <th scope="row" class="px-6 py-4 font-normal text-gray-900 whitespace-nowrap ">
                                                    {convertToDateString(item.createdAt)}
                                                </th>
                                                <td class="px-6 py-4">
                                                    {item.fullName}
                                                </td>
                                                <td class="px-6 py-4">
                                                    ₹ {item.amountAfterDiscount}
                                                </td>
                                                <td class="px-6 py-4">
                                                    {(item.deliveryMode === 'Online Banking' || item.deliveryMode === 'Already Paid') ? <span className='bg-green-300 px-2 py-1 rounded-lg text-xs text-green-800'>Paid</span> : <span className='bg-red-300 p-1 rounded-lg text-xs text-red-800'>Not Paid</span>}
                                                </td>
                                                <td class={`px-6 py-4 ${item?.status === "delivered" ? 'text-green-600' : 'text-red-600'} `}>
                                                    {item.status === "delivered" ? <span className='bg-green-300 p-1 rounded-lg text-xs text-green-800 capitalize'>Fulfilled</span> : <span className='bg-red-300 p-1 rounded-lg text-xs text-red-800 capitalize'>Unfulfilled</span>}
                                                </td>
                                                <td class="px-6 py-4 capitalize">
                                                    {item.status}
                                                </td>
                                                <td class="px-6 py-4">
                                                    {item?.products?.length}
                                                </td>
                                                <td class="px-6 py-4">
                                                    {item.phone}
                                                </td>

                                                <td class="px-6 py-4">
                                                    <Link to={`/order/${item._id}`} class="text-sm font-bold underline text-blue-600">
                                                        View More
                                                    </Link>
                                                </td>


                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                    }
                </table>
            </div>

        </div>
    )
}
