import React, { useState } from 'react'
import emailjs from 'emailjs-com';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Reset() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

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


    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
    };

    const handleSendOtp = (e) => {
        e.preventDefault();
        const otp = generateOtp();
        setGeneratedOtp(otp); // Save the OTP for verification

        if (email !== 'sujalforselfuse@gmail.com') {
            errorToast('Invalid email address');
            return;
        }

        emailjs.send('service_r50lvbp', 'template_ppd70fw', { email, otp }, 'NvUfUAKpArf-snmov')
            .then((response) => {
                console.log('OTP sent successfully:', response);
                successToast('OTP sent successfully');
                setOtpSent(true);
            }, (error) => {
                console.error('Error sending OTP:', error);
            });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp === generatedOtp) {
            // Handle password update or further processing
            
            try {
                const res = await fetch(`https://ratna-backend-smp.onrender.com/api/admin/setpassword`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                })
                const data = await res.json();
                if (data.success) {
                    successToast("Password updated successfully");
                    window.location.reload();
                }
                else {
                    errorToast("Failed to update password");
                }
            } catch (error) {
                errorToast("Failed to update password");
            }

        } else {
            errorToast("Invalid OTP");
            window.location.reload();
        }
    };


    return (
        <div className='p-8 flex flex-col gap-6'>
            <ToastContainer />
            <div className='flex flex-col'>
                <label className='font-semibold' htmlFor="">Enter email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className='border-2 p-1' type="text" name="" id="" placeholder='enter email' />
            </div>
            <button onClick={handleSendOtp} className='bg-green-500 w-24 text-white p-1 rounded-md'>Send OTP</button>


            {otpSent && <> <div className='flex flex-col'>
                <label className='font-semibold ' htmlFor="">Enter OTP</label>
                <input value={otp} onChange={(e) => setOtp(e.target.value)} className='border-2 p-1' type="text" name="" id="" placeholder='enter otp' />
            </div>
                <div className='flex flex-col'>
                    <label className='font-semibold' htmlFor="">Set Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className='border-2 p-1' type="text" name="" id="" placeholder='set password' />
                </div>

                <button onClick={handleSubmit} className='bg-green-500 text-white p-1 rounded-md'>Submit</button></>}
        </div>
    )
}
