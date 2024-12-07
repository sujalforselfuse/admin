import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cover from './cover.jpg'
import { ring } from 'ldrs'
ring.register()

export default function Login() {

    const [email, setEmail] = useState('guestuser@gmail.com');
    const [password, setPassword] = useState('guest');
    const [loading, setLoading] = useState(false);

    const successToast = (msg) => toast.warn(msg, {
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


    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        const res = await fetch(`https://ratna-backend-smp.onrender.com/api/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })

        })

        const data = await res.json();
        if (data.success) {

            localStorage.setItem('ratnatoken', data.token);
            localStorage.removeItem('ratnaemploytoken');
            window.location.href = "/";

        } else {
            successToast("Invalid credentials")

        }
        setLoading(false);
    }


    return (
        <div className='overflow-none'>
            <ToastContainer />
            {/* <div class="min-h-screen py-40" style="background-image: linear-gradient(115deg, #9F7AEA, #FEE2FE)"> */}
            <div class="h-screen py-40 overflow-none" style={{ "background-image": "linear-gradient(115deg, #9F7AEA, #FEE2FE)" }}>
                <div class="container mx-auto">

                    <div class="flex flex-col lg:flex-row w-10/12 lg:w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
                        {/* <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 bg-no-repeat bg-center bg-cover" style="background-image: url('https://jmdevelopments77.files.wordpress.com/2020/11/pexels-photo-572897.jpeg')"> */}
                        <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${cover})` }}>


                            <h1 class="text-white text-3xl font-bold mb-3">Welcome</h1>
                            <div>
                                <p class="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean suspendisse aliquam varius rutrum purus maecenas ac </p>
                            </div>
                        </div>

                        <div class="w-full lg:w-1/2 py-16 px-12">
                            <h2 class="text-3xl mb-4 font-semibold">Admin Login</h2>
                            <p class="mb-4">Welcome to Ratna Ayurveda</p>

                            <div class="mt-5">
                                <input type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    required
                                    autoComplete="email" class="border border-gray-400 py-1 px-2 w-full" placeholder="Email" />
                            </div>
                            <div class="mt-5">
                                <input type="password"
                                    id="password"
                                    name="password"

                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    required placeholder="Password" class="border border-gray-400 py-1 px-2 w-full" />
                            </div>
                            <div className='mt-2'>

                                <Link to="/reset" className="italic text-xs font-medium text-purple-500 ">
                                    Forgot password
                                </Link>
                            </div>

                            <div class="mt-5">
                                <button onClick={handleSubmit} class="bg-purple-800 w-full text-center text-white py-3">
                                    {loading ? <l-ring
                                                size="16"

                                                stroke="1"
                                                bg-opacity="0"
                                                speed="2"
                                                color="white"
                                            ></l-ring> : 'Login'}
                                </button>
                            </div>

                            <div class="mt-5 text-center">
                                <p class="text-gray-500">Are you employ? <Link to="/employeelogin" class="text-purple-500">Login as Employ</Link></p>
                            </div>

                        </div>


                    </div>
                </div>




            </div>
        </div>
    )
}
