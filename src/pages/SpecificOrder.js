import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SpecificOrder() {
    const { orderId } = useParams();

    const [orders, setOrders] = React.useState([]);
    const [status, setStatus] = React.useState('');

    const mobileToast = (msg) => toast.success(msg, {
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



    function convertToDateString(isoDate) {
        // Create a Date object from the ISO 8601 string
        const dateObj = new Date(isoDate);

        // Get the date components
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(dateObj.getDate()).padStart(2,
            '0');

        // Format the date as DD/MM/YYYY
        const indianDate = `${day}/${month}/${year}`;
        return indianDate;
    }

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

    const convertToDateString2 = (dateInMongoDB) => {
        const date = new Date(dateInMongoDB);

        return new Intl.DateTimeFormat('en-IN', options).format(date);
    }

    const fetchOrders = async () => {

        try {
            const res = await fetch(`https://ratna-backend-smp.onrender.com/api/v1/order/${orderId}`, {
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
                setStatus(data.data.status);

            } else {
                errorToast('Failed to fetch orders');
            }
        } catch (error) {
            errorToast('Failed to fetch orders');
            console.log(error);
        }

    }

    const handleStatusChange = async (e) => {
        try {
            const res = await fetch(`https://ratna-backend-smp.onrender.com/api/v1/order/updateorderstatus/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {                
                mobileToast('Status Changed Successfully');


            } else {
                errorToast('Failed to fetch orders');
            }
        } catch (error) {
            errorToast('Failed to fetch orders');
            console.log(error);
        }
    }


    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <div className='px-8 mt-2 mb-4'>
            <ToastContainer />
            <h1 className='text-xl font-semibold'>Order Details</h1>

            <div className='flex gap-10  '>
                <div className='w-[65%]'>


                    <div className='mt-4 flex flex-col gap-4'>
                        <div className='w-full'>
                            <h1 className='font-semibold'>Products</h1>
                            <div>
                                {orders.products?.map((product) => (
                                    <li key={product.id} className="flex py-6 bg-white border-purple-500 border-2 px-2 w-full my-2 rounded-lg ">
                                        <div className="flex-shrink-0">
                                            <img src={product.image} alt={product.imageAlt} className="w-20 rounded-md" />
                                        </div>

                                        <div className="ml-6 flex-1 flex flex-col">
                                            <div className="flex">
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-md">
                                                        <a href={product.href} className="capitalize font-medium text-gray-700 hover:text-gray-800">
                                                            {product.name}
                                                        </a>
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-500">Rs {product.price}</p>
                                                    <p className="mt-1 text-sm text-gray-500">Qty {product.quantity}</p>
                                                </div>


                                            </div>


                                        </div>
                                    </li>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleStatusChange} type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ">Save Changes</button>
                    </div>
                </div>

                <div className='flex flex-col w-[40%] gap-4 '>

                    <div>
                        <p className='font-semibold'>Status</p>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className='border-2 rounded-md p-1 w-full bg-white border-purple-500' name="status" id="">
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>

                        </select>
                    </div>

                    <div className='bg-purple-400 rounded-md p-4 mt-4'>

                        <div>
                            <div>
                                <h1 className='font-semibold text-md'>Amount</h1>
                                <div className='flex items-center justify-between'>
                                    <span className='font-semibold text-lg'>₹ {orders.amountAfterDiscount}</span>

                                    <span className={` text-sm border ${orders.status==="delivered" ? "bg-green-200  text-green-800 border border-green-800" : orders.deliveryMode==="Online Banking" ? "bg-green-200 text-green-800 border border-green-800" : "bg-red-200 text-sm text-red-800 border border-red-800"} px-2 py-0.5 rounded-lg`}>{orders.deliveryMode==="Online Banking" ? "Paid" : orders.status==="delivered" ? "Paid" : "Not Paid"}</span>
                                </div>
                            </div>
                            <div className='w-full h-[0.1rem] my-4 bg-white'></div>
                            <div className='flex flex-col gap-2 capitalize'>
                                <div className='flex gap-3'>
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clip-rule="evenodd" />
                                    </svg>
                                    <span>{orders.fullName}</span>
                                </div>
                                <div className='flex gap-3'>
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z" />
                                    </svg>
                                    <span>
                                        Processing
                                    </span>

                                </div>
                                <div className='flex gap-3'>
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z" />
                                    </svg>

                                    <span>
                                        {orders.deliveryMode === 'Online Banking' ? 'Paid Online' : 'Cash On Delivery'}
                                    </span>

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='bg-purple-400 rounded-md p-4 mt-4'>

                        <div>
                            <h1 className='text-md pb-2 font-semibold'>Shipping Details</h1>
                            <div className='flex flex-col gap-y-2 capitalize'>
                                <div className='flex gap-3'>
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-width="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>

                                    <span>{orders.fullName}</span>
                                </div>
                                <div className='flex gap-3'>
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z" />
                                    </svg>

                                    <span>
                                        {orders.phone}
                                    </span>

                                </div>
                                <div className='flex gap-3'>
                                    <div>

                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z" />
                                        </svg>
                                    </div>

                                    <span className='text-justify text-wrap'>
                                        {orders.address} , {orders.apartment}
                                        <br />
                                        {orders.city} - {orders.pincode}, {orders.state}
                                        <br />
                                        India
                                    </span>

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='bg-purple-400 rounded-md p-4 mt-4'>

                        <div>
                            <h1 className='text-md pb-2 font-semibold'>Coupon Details</h1>
                            <div className='flex flex-col gap-y-2 capitalize'>
                                <div className='flex gap-3'>
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.891 15.107 15.11 8.89m-5.183-.52h.01m3.089 7.254h.01M14.08 3.902a2.849 2.849 0 0 0 2.176.902 2.845 2.845 0 0 1 2.94 2.94 2.849 2.849 0 0 0 .901 2.176 2.847 2.847 0 0 1 0 4.16 2.848 2.848 0 0 0-.901 2.175 2.843 2.843 0 0 1-2.94 2.94 2.848 2.848 0 0 0-2.176.902 2.847 2.847 0 0 1-4.16 0 2.85 2.85 0 0 0-2.176-.902 2.845 2.845 0 0 1-2.94-2.94 2.848 2.848 0 0 0-.901-2.176 2.848 2.848 0 0 1 0-4.16 2.849 2.849 0 0 0 .901-2.176 2.845 2.845 0 0 1 2.941-2.94 2.849 2.849 0 0 0 2.176-.901 2.847 2.847 0 0 1 4.159 0Z" />
                                    </svg>


                                    <span className={`${orders.couponApplied ? 'uppercase' : ''}`}>{orders.couponApplied ? orders.couponApplied : 'no coupon applied'}</span>
                                </div>
                                <div className='flex gap-3'>
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                    </svg>


                                    <span>
                                        Discount :- {orders.totalDiscount}
                                    </span>

                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    )
}
