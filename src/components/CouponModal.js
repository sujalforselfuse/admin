'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

export default function CouponModal({ open, setOpen,couponActive,id }) {



    const [isActive, setIsActive] = useState(couponActive);

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


    const handleToggle = () => {
      setIsActive(!isActive);
    };

    const handlSave=async()=>{
        const res = await fetch(`https://ratna-backend-smp.onrender.com/api/v1/coupon/makecouponinactiveoractive`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isActive: isActive,
                id:id
            }),
        });

        const data = await res.json();

        if (data.success) {
            successToast('Coupon updated successfully');
            window.location.reload();
        } else {
            errorToast('Failed to update coupon');
        }
    }




    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <ToastContainer />
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-20 transition-opacity data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">

                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-lg font-bold mb-2 leading-6 text-gray-900">
                                        Edit Coupon
                                    </DialogTitle>
                                    <div className='mt-4 flex flex-col'>
                                        <label class="relative inline-flex cursor-pointer items-center">
                                            <input checked={isActive} onChange={handleToggle} id="switch-2" type="checkbox" class="peer sr-only" />
                                            <label for="switch-2" class="hidden"></label>
                                            <div class="peer h-4 w-11 rounded-full border bg-slate-200 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-300 peer-checked:after:translate-x-full peer-focus:ring-green-300"></div>
                                        </label>
                                        <p className='mt-2 font-medium text-red-500'>Coupon is {isActive ? 'Active' : 'Inactive'}</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={handlSave}
                                className="inline-flex w-full justify-center rounded-md bg-[#006400] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                data-autofocus
                                onClick={() => setOpen(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
