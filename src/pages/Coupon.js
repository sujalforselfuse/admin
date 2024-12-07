/* import { set } from 'mongoose'; */
import React from 'react'
import { useState, useEffect } from 'react'
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CouponModal from '../components/CouponModal';
import { ring } from 'ldrs'
ring.register()
export default function Coupon() {
    /*
        code: { type: String, required: true, unique: true },
      discountType: { type: String, enum: ['percentage', 'fixed'], required: true }, // Type of discount: percentage or fixed amount
      discountValue: { type: Number, required: true }, // Value of the discount
      expirationDate: { type: Date, required: true }, // Expiration date of the coupon
      minimumOrderAmount: { type: Number, required: false }, // Minimum order amount to apply the coupon
      usageLimit: { type: Number, required: false }, // Maximum number of times the coupon can be used
      usedCount: { type: Number, default: 0 }, // Number of times the coupon has been used
      isActive: { type: Boolean, default: true }, // Status of the coupon
      
      createdAt: { type: Date, default: Date.now }, // Date when the coupon was created
      updatedAt: { type: Date, default: Date.now } // Date when the coupon was last updated
      */

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expirationDate: '',
        minimumOrderAmount: '',
        usageLimit: ''
    });
    const [coupons, setCoupons] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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


    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'code' ? value.toUpperCase() : value;
        setFormData({
            ...formData,
            [name]: newValue
        });
    };


    const handleSubmit = async () => {
        setAddLoading(true);

        try {
            console.log(localStorage.getItem('ratnatoken'));
            const res = await fetch('https://ratna-backend-smp.onrender.com/api/v1/coupon/addcoupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();




            console.log("formdata", data);
            window.location.reload();

        } catch (error) {
            errorToast('Failed to add coupon');
            console.log("error");

        }

        setAddLoading(false);

    }

    const fetchCoupons = async () => {
        setFetchLoading(true);
        try {
            const res = await fetch('https://ratna-backend-smp.onrender.com/api/v1/coupon/getallcoupon',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
                    },
                }
            );
            const data = await res.json();

            if (data.success) {
                setCoupons(data.data);
                console.log(data.data)
            }
            else {
                errorToast('Error in fetching coupons');
            }
        } catch (error) {
            errorToast('Error in fetching coupons');
        }
        setFetchLoading(false);

    }

    const handleDelete = async (id) => {
        setDeleteLoading(true);
        try {
            const res = await fetch(`https://ratna-backend-smp.onrender.com/api/v1/coupon/deletecoupon/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
                },
            });

            const data = await res.json();

            if (data.success) {
                successToast('Coupon deleted successfully');
                window.location.reload();
            }
            else {
                errorToast('Failed to delete coupon');
            }
        } catch (error) {
            errorToast('Failed to delete coupon');
        }
        setDeleteLoading(false);

    }

    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <div className='px-4 mt-2 mb-4'>
            <ToastContainer />
            <h1 className='text-2xl font-bold'>Generate Coupon</h1>
            <div>

                <div className='flex flex-col gap-6 mt-2'>
                    <div className='flex gap-12'>
                        <div className='flex flex-col'>
                            <label className='font-semibold text-md ' htmlFor="">Coupon Code</label>
                            <input name='code' value={formData.code} onChange={handleChange} className='mt-1 uppercase border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Generate Code (WELCOME20)' />
                        </div>

                        <div className='flex flex-col'>
                            <label className='font-semibold text-md' htmlFor="">Usage Limit</label>
                            <input name='usageLimit' value={formData.usageLimit} onChange={handleChange} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="number" placeholder='Usage Limit' />
                        </div>

                        <div className='flex flex-col'>
                            <label className='font-semibold text-md' htmlFor="">Minimum Order Amount</label>
                            <input name='minimumOrderAmount' value={formData.minimumOrderAmount} onChange={handleChange} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="number" placeholder='Minimum Order Amount' />
                        </div>

                    </div>
                    <div className='flex gap-12'>
                        <div className='flex flex-col'>
                            <label className='font-semibold text-md' htmlFor="">Discount Type</label>

                            <select
                                id="discountType"
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                required
                                className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md'
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed</option>
                            </select>
                        </div>

                        <div className='flex flex-col'>
                            <label className='font-semibold text-md' htmlFor="">Discount Value</label>
                            <input name='discountValue' value={formData.discountValue} onChange={handleChange} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="number" placeholder={formData.discountType === 'percentage' ? 'Percentage Value (if 10% , write only 10)' : 'Fixed Value (if 100Rs, write only 100)'} />
                        </div>

                        <div className='flex flex-col'>
                            <label className='font-semibold text-md' htmlFor="">Expiry Date</label>


                            <input name='expirationDate' value={formData.expirationDate} onChange={handleChange} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="date" placeholder='Date' />

                        </div>

                    </div>



                </div>
                <div className='my-4'>


                    <button onClick={handleSubmit} type="button" class="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-6 py-2.5 text-center me-2 mb-2">
                        {addLoading ? <l-ring
                            size="16"
                            stroke="1"
                            bg-opacity="0"
                            speed="2"
                            color="white"
                        ></l-ring> : 'Generate Coupon'}
                    </button>
                </div>
            </div>

            <h1 className='text-2xl font-bold'>Manage Coupons</h1>

            <div className='px-12 mt-4'>
                <div className='grid grid-cols-6 border-3 mb-6 p-3 font-semibold rounded-lg bg-purple-500 border-black text-white '>
                    <div>
                        Coupon Code
                    </div>
                    <div>
                        Discount Type
                    </div>
                    <div>
                        Discount Value
                    </div>
                    <div>
                        Times redeemed
                    </div>
                    <div>
                        Active/Inactive
                    </div>
                    <div>
                        Delete
                    </div>
                </div>

                {
                    fetchLoading ? <div className='flex justify-center'>

                        <l-ring
                            size="60"
                            stroke="3"
                            bg-opacity="0"
                            speed="2"
                            color="white"
                        ></l-ring>
                    </div> :
                        coupons && coupons.map((coupon) => (
                            <>
                                <div className='grid grid-cols-6 border-2 mb-6 p-3 rounded-lg border-purple-500 bg-white '>
                                    <div>
                                        {coupon.code}
                                    </div>
                                    <div>
                                        {coupon.discountType}
                                    </div>
                                    <div>
                                        {coupon.discountValue}
                                    </div>
                                    <div>
                                        {coupon.usedCount}
                                    </div>
                                    <div>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                    <div className='underline text-red-500 font-medium cursor-pointer'>
                                        {
                                            deleteLoading ? <l-ring
                                                size="16"
                                                stroke="1"
                                                bg-opacity="0"
                                                speed="2"
                                                color="red"
                                            ></l-ring> :
                                                <svg onClick={() => { handleDelete(coupon._id) }} className='h-6' fill='currentColor' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" /></svg>
                                        }

                                    </div>
                                </div>
                            </>)
                        )
                }

            </div>

        </div>
    )
}
