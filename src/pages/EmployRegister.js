import React from 'react'
import { useState, useEffect } from 'react'
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
export default function EmployRegister() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');

    const [employ, setEmploy] = useState([]);

    const [employLoading, setEmployLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState([]);

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



    const togglePasswordVisibility = (index) => {
        const updatedShowPasswords = [...showPasswords];
        updatedShowPasswords[index] = !updatedShowPasswords[index];
        setShowPasswords(updatedShowPasswords);
    };


    const handleSubmit = async (e) => {
        const res = await fetch(`https://ratna-backend-smp.onrender.com/api/employ/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
            },
            body: JSON.stringify({
                mobile: mobile,
                email: email,
                password: password
            })

        })


        const data = await res.json();
        if (data.success) {
            successToast("Employee created successfully");
            window.location.reload();
        }
        else {
            errorToast("Failed to create employee");
        }
    }

    const handleGetEmploy = async () => {
        setEmployLoading(true);

        try {
            const res = await fetch(`https://ratna-backend-smp.onrender.com/api/employ/getallemploy`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
                }
            })
            const data = await res.json();
            console.log(data);

            if (data.success) {
                setEmploy(data.data);
                setShowPasswords(new Array(data.data.length).fill(false));
            }
            else {
                errorToast("Failed to fetch employees");
            }
            setEmployLoading(false);
        } catch (error) {
            errorToast("Failed to fetch employees");
        }

    }

    useEffect(() => {
        handleGetEmploy();
    }, [])

    return (
        <div className='px-4 mt-2 mb-4'>
            <ToastContainer />
            <div>
                <h1 className='text-xl font-bold'>Generate Employee Credentials</h1>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
                    <form action="#" method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Mobile
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={mobile}
                                    onChange={(e) => { setMobile(e.target.value) }}
                                    required
                                    autoComplete="name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <span className='text-xs text-red-500'>Rememeber password , it cannot be changed later</span>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="flex w-full justify-center rounded-md bg-purple-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>


                </div>
            </div>
            <div>
                <h1 className='text-xl font-bold'>View Employees</h1>
                <div class="pt-6 relative overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead class="text-xs text-white uppercase bg-purple-800 ">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Mobile of Employ
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Password
                                </th>

                            </tr>
                        </thead>
                        <tbody>

                            {
                                employLoading ? <tr><td colSpan={2} className='text-center'> <l-ring
                                    className=''
                                    size="60"
                                    stroke="3"
                                    bg-opacity="0"
                                    speed="2"
                                    color="white"
                                ></l-ring></td></tr> :
                                    employ.map((item, index) => {
                                        return (
                                            <tr class="bg-white border-b ">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                    {item.mobile}
                                                </th>
                                                <td class="px-6 py-4">
                                                    {item.email}
                                                </td>
                                                <td className="px-6 py-4 flex items-center">
                                                    {showPasswords[index] ? item.password : ''}
                                                    <button onClick={() => togglePasswordVisibility(index)} className="">
                                                        {showPasswords[index] ? (
                                                             <svg class="w-6 h-6 text-gray-800 ml-2 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                           </svg>
                                                          
                                                        ) : (
                                                           
                                                          <svg class="w-6 h-6 text-gray-800 ml-2 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                          <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                                          <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                        </svg>
                                                          
                                                        )}
                                                    </button>
                                                </td>

                                            </tr>
                                        )
                                    })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
