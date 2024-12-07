import React from 'react'
import { useEffect, useState } from 'react'
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ring } from 'ldrs'
ring.register()

export default function Visitor() {

    const [visitor, setVisitor] = useState([]);
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


    const fetchVisitor = async () => {

        setLoading(true);
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

                setVisitor(data.data);

            } else {

                errorToast('Failed to fetch visitor');

            }

        } catch (error) {

            errorToast('Failed to fetch visitor');

        }

        setLoading(false);

    }

    useEffect(() => {
        fetchVisitor();
    }, [])
    return (
        <div className='px-8 mt-2 mb-4'>
            <ToastContainer />
            <h1 className='text-xl font-bold'>Visitor's Data</h1>
            <div class="pt-6 relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead class="text-xs text-white uppercase bg-purple-800 ">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Name of visitor
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Mobile
                            </th>

                        </tr>
                    </thead>
                    <tbody>

                        {
                            loading ? <tr><td colSpan={2} className='text-center'> <l-ring
                            className=''
                            size="60"
                            stroke="3"
                            bg-opacity="0"
                            speed="2"
                            color="white"
                          ></l-ring></td></tr> :
                            visitor.map((item) => {
                                return (
                                    <tr class="bg-white border-b ">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                            {item.name}
                                        </th>
                                        <td class="px-6 py-4">
                                            {item.mobile}
                                        </td>

                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}
