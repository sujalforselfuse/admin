import React from 'react'
import man from './man.png'
import employ from './employ.png'
import { Link } from 'react-router-dom'
import cover from './cover.jpg'

export default function Signup() {
  return (
    <div className='h-screen text-center p-4 py-16' style={{ "background-image": "linear-gradient(115deg, #9F7AEA, #FEE2FE)" }}>
      <h1 className='text-4xl font-bold text-white'>Welcome Again !!!</h1>
      <p className='italic underline'>Ratna Ayurvedas Pvt Ltd</p>
      <div className='mt-12 flex justify-center gap-32 border-2 mx-80 px-32 py-40 rounded-md border-[#399918] ' style={{ backgroundImage: `url(${cover})`,backgroundSize:"cover" }}>
        
        <Link to={'/login'} className='border-2 flex flex-col justify-center items-center font-semibold text-black px-16 py-4 gap-6 rounded-xl bg-purple-500 border-[#FFAAAA] shadow-md'>
          <img className='h-16' src={man} alt="" srcset="" />
          <h1>Admin</h1>
        </Link>
        <Link to={'/employeelogin'} className='border-2 flex flex-col justify-center items-center font-semibold text-black px-16 py-4 gap-6 rounded-xl bg-purple-500 border-[#FFAAAA] shadow-md'>
          <img className='h-16' src={employ} alt="" srcset="" />
          <h1>Employ</h1>
        </Link>

        

      </div>
    </div>
  )
}
