import React, { useEffect, useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import logo from './logo.png'
export default function Navbar() {
    const [property, setProperty] = useState('');
    const [logintype, setLogintype] = useState('');

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }

    //get url
    useEffect(() => {
        console.log("12", window.location.pathname);
        const path = window.location.pathname;
        if (path.includes('signup') || path.includes('login') || path.includes('sample')) {
            setProperty('Signup');
        }

        if (localStorage.getItem('ratnatoken')) {
            setLogintype('admin');
        }
        else if (localStorage.getItem('ratnaemploytoken')) {
            setLogintype('employ');
        }
    }, [])


    return (
        //nabvbar
        <div className={`hidden ${(localStorage.getItem('ratnatoken') || localStorage.getItem('ratnaemploytoken')) ? 'sm:flex' : ''} flex-col  overflow-hidden text-white bg-purple-800 h-screen min-w-60`}>
            {/* company name */}
            <div className='w-full flex flex-col items-center my-4'>
                <img className='h-24' src={logo} alt="" />
                <p className='font-bold text-xl underline'>Ratna Ayurveda</p>

            </div>

            <div className='flex flex-col gap-6 text-md font-semibold mx-4 mt-4'>
                {
                    logintype === 'admin' ?
                        <> <Link to="/">Dashboard</Link>
                            <Link to="/orders">View Orders</Link>
                            <Link to="/drafts">Drafts</Link>
                            <Link to="/abandoned">Abandoned Checkouts</Link>
                            <Link to="/visitor">Visitor Data</Link>

                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <MenuButton className="inline-flex w-full justify-start  items-center gap-x-4 rounded-md text-md font-semibold text-white shadow-sm ">
                                        Manage 
                                        <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                                    </MenuButton>
                                </div>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        <MenuItem>
                                            <Link className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900" to="/addproduct">Manage Product</Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900" to="/addcategory">Manage Category</Link>
                                        </MenuItem>

                                    </div>
                                </MenuItems>
                            </Menu>



                            <Link to="/generatecoupon">Generate Coupon</Link>
                            <Link to="/createemployee">Create Employee Credentials</Link>
                        </> : ''
                }

                {
                    logintype === 'employ' ? <Link to="/employ"> Employee Dashboard</Link> : ''
                }


                <div className='cursor-pointer' onClick={handleLogout} > Logout</div>



            </div>

        </div>
    )
}
