import React from 'react'
import { useState, useEffect } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { ring } from 'ldrs'
ring.register()

export default function Employ() {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [price, setPrice] = useState([]);
    const [cng, setCng] = useState(false);
    const [code, setCode] = useState(""); //coupon code
    const [couponApply, setCouponApply] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    const [addcartLoading, setAddcartLoading] = useState(false);
    const [id, setId] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorName, setErrorName] = useState("");
    const phoneRegex = /^[6789]\d{9}$/;
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        apartment: '',
        state: '',
        city: '',
        phone: '',
        pincode: '',
        deliveryMode: '',
        products: [],
        totalAmount: 0,
        couponApplied: '',
        totalDiscount: 0,
        amountAfterDiscount: 0,
    });
    const navigate = useNavigate();

    const mobileToast = (msg) => toast.warn(msg, {
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


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const getAllProduct = async () => {        
        setFetchLoading(true);
        const res = await fetch('https://ratna-backend-smp.onrender.com/api/product/getallproduct');
        const data = await res.json();
        if (data.success) {
            setProducts(data.data);
            console.log(data.data);
        }
        setFetchLoading(false);
    }


    const generateSignature = (data) => {
        return CryptoJS.HmacSHA256(JSON.stringify(data), secretKey).toString();
    };



    const verifySignature = (data, signature) => {
        const newSignature = generateSignature(data);
        return newSignature === signature;
    };

    const handleCart = async (id, name, discountedPrice, url) => {
        setId(id);
        setAddcartLoading(true);
        const newItem = {
            id: id,
            name: name,
            price: discountedPrice,
            quantity: 1,
            image: url
        };

        let cart = JSON.parse(localStorage.getItem('employcart')) || [];

        const existingItemIndex = cart.findIndex(item => item.id === newItem.id);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(newItem);
        }

        const signature = generateSignature(cart);
        console.log('signature', signature);
        localStorage.setItem('employcart', JSON.stringify(cart));
        localStorage.setItem('employ_cart_signature', signature);
        setCng(true);
        setAddcartLoading(false);
        


        //redirect to router

    }

    const handleCoupon = async () => {
        console.log(code);
        const res = await fetch(`https://ratna-backend-smp.onrender.com/api/v1/coupon/apply`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: code.toUpperCase(), orderAmount: subtotal }),
            }
        );
        const data = await res.json();

        if (data.success) {
            setDiscount(data.data);
            const discount = data.data;
            setCouponApply(true);
            console.log("discount is", discount);

            setFormData({
                ...formData,
                couponApplied: code,
                totalDiscount: discount,
                amountAfterDiscount: Math.floor(subtotal - discount + 60),
                totalAmount: subtotal + 60
            })

            setCouponError(false);

        }
        else {
            setCouponError(true);
            setErrorName(data.error);
        }
        console.log(data);
    }

    const fetchProducts = () => {


        setCartLoading(true);

        const cartData = localStorage.getItem('employcart');
        const signature = localStorage.getItem('employ_cart_signature');

        if (!cartData || !signature) {
            // No cart data or signature means it's a first-time visit or cart is empty

            setProduct(null);
            return;
        }

        const data = JSON.parse(cartData);

        if (!verifySignature(data, signature)) {
            console.error('Cart data has been tampered with or signature is invalid.');
            errorToast('Cart data has been tampered');
            localStorage.removeItem('employcart');
            localStorage.removeItem('employ_cart_signature');
            return [];
        }

        console.log("data is ", data);

        setProduct(data);
        setFormData({
            ...formData,


        });

        const priceArray = [];
        let totalPrice = 0;

        for (let index = 0; index < data?.length; index++) {
            const element = data[index];

            priceArray.push(element?.price);

            totalPrice += (element?.price * element?.quantity);
            console.log(totalPrice);

        }

        setPrice(priceArray);
        setSubtotal(totalPrice);

        setFormData({
            ...formData,
            totalAmount: totalPrice+60,
            amountAfterDiscount: totalPrice+60,
        });

        setCartLoading(false);

    }



    const handleQuantityDecrement = (id) => {
        let cart = JSON.parse(localStorage.getItem('employcart')) || [];
        const signature = localStorage.getItem('employ_cart_signature');

        if (!verifySignature(cart, signature)) {
            console.error('Cart data has been tampered with or signature is invalid.');
            errorToast('Cart data has been tampered.');
            localStorage.removeItem('employcart');
            localStorage.removeItem('employ_cart_signature');
            return;
        }

        cart = cart.map(item => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });

        if (cart.find(item => item.quantity === 0)) {
            cart = cart.filter(item => item.quantity !== 0);
        }

        const newSignature = generateSignature(cart);
        localStorage.setItem('employcart', JSON.stringify(cart));
        localStorage.setItem('employ_cart_signature', newSignature);

        console.log("cart after decrement", cart);

        setCng(true);
    }

    const handleQuantityIncrement = (id) => {
        let cart = JSON.parse(localStorage.getItem('employcart')) || [];
        const signature = localStorage.getItem('employ_cart_signature');

        if (!verifySignature(cart, signature)) {
            console.error('Cart data has been tampered with or signature is invalid.');
            errorToast('Cart data has been tampered.');
            localStorage.removeItem('employcart');
            localStorage.removeItem('employ_cart_signature');
            return;
        }

        cart = cart.map(item => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });

        const newSignature = generateSignature(cart);
        localStorage.setItem('employcart', JSON.stringify(cart));
        localStorage.setItem('employ_cart_signature', newSignature);

        console.log("cart after increment", cart);

        setCng(true);
    }

    const removeItem = (id) => {
        let cart = JSON.parse(localStorage.getItem('employcart')) || [];
        const signature = localStorage.getItem('employ_cart_signature');

        if (!verifySignature(cart, signature)) {
            console.error('Cart data has been tampered with or signature is invalid.');
            errorToast('Cart data has been tampered.');
            localStorage.removeItem('employcart');
            localStorage.removeItem('employ_cart_signature');
            return;
        }

        cart = cart.filter(item => item.id !== id);

        const newSignature = generateSignature(cart);
        localStorage.setItem('employcart', JSON.stringify(cart));
        localStorage.setItem('employ_cart_signature', newSignature);

        console.log("cart after removal", cart);
        setCng(true);
    }

    const handleCheckout = async () => {
        setSubmitLoading(true);

        if (!subtotal) {
            mobileToast('Cart is empty');
            setSubmitLoading(false);
            return;
        }

        if (formData.name === "" || formData.email === "" || formData.address === "" || formData.city === "" || formData.state === "" || formData.country === "" || formData.pincode === "" || formData.phone === "") {
            mobileToast('Please fill all the fields');
            setSubmitLoading(false);
            return;
        }

        if (formData.state.length < 3) {
            mobileToast('Enter valid state');
            setSubmitLoading(false);
            return;
        }

        if (formData.city.length < 2) {
            mobileToast('Enter valid city');
            setSubmitLoading(false);
            return;
        }

        if (formData.pincode.length !== 6) {
            mobileToast('Enter valid pincode');
            setSubmitLoading(false);
            return;
        }

        if (!phoneRegex.test(formData.phone) || formData?.phone?.length !== 10 || !formData?.phone) {
            mobileToast('Enter valid phone number !');
            setSubmitLoading(false);
            return;
        }

        if (formData.deliveryMode === "") {
            mobileToast('Please select delivery mode');
            setSubmitLoading(false);
            return;
        }
        try {
            const res = await fetch(`https://ratna-backend-smp.onrender.com/api/v1/order/addorder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, products: product,orderedBy:'Employ' }),
            });
            const json = await res.json();
            console.log('orders', json);
            if (!json.success) {
                throw new Error("Try after some time");
            }


            successToast('Order placed successfully');
            localStorage.removeItem('employcart');
            localStorage.removeItem('employ_cart_signature');
        } catch (error) {

        }
        setSubmitLoading(false);
    }

    useEffect(() => {
        getAllProduct();
        fetchProducts();
    }, []);

    useEffect(() => {
        setCng(false);
        fetchProducts();
    }, [cng]);


    return (
        <div className='px-4 mt-2 mb-4'>
            <ToastContainer />

            <div className='text-2xl font-bold'>
                Choose Products
            </div>

            {
                fetchLoading ? <div className='flex justify-center'>
                    <l-ring
                        size="60"
                        stroke="3"
                        bg-opacity="0"
                        speed="2"
                        color="black"
                    ></l-ring>
                </div> :

                    <div className='mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6'>
                        {
                            products?.map((product) => (
                                <>

                                    <div className=' border-2 border-purple-500 bg-white rounded-md' key={product.id}>
                                        <div className="relative pb-2 sm:p-2">
                                            <div className="relative w-full h-28 sm:border-2 sm:h-60 sm:rounded-lg overflow-hidden">
                                                <img
                                                    src={product.images[0].src}
                                                    alt={product.imageAlt}
                                                    className="w-full h-full object-center object-cover"
                                                />

                                            </div>
                                            <div className="relative mt-2 sm:mt-4 px-2">
                                                <h3 className="text-md font-bold text-purple-500">{product.name}</h3>
                                                <p className="mt-1 text-sm text-gray-500">100 grams</p>
                                                <div class="flex items-center mt-2.5  mb-2 sm:mb-5">
                                                    <div class="flex items-center space-x-1 rtl:space-x-reverse">
                                                        <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                        </svg>
                                                        <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                        </svg>
                                                        <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                        </svg>
                                                        <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                        </svg>
                                                        <svg class="w-4 h-4 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                        </svg>
                                                    </div>
                                                    <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">{product.rating}</span>
                                                </div>
                                            </div>
                                            <div className="inset-x-0 rounded-lg flex px-2">

                                                <p className="relative text-lg mr-2 font-semibold text-gray-400 line-through">Rs {product.originalPrice}</p>
                                                <p className="relative text-lg font-semibold text-black">Rs {product.discountedPrice}</p>
                                            </div>
                                        </div>
                                        <div onClick={() => { handleCart(product._id, product.name, product.discountedPrice, product.images[0].src) }} className='w-full cursor-pointer text-center bg-purple-500 text-white font-medium p-1'>
                                            {
                                                addcartLoading && product._id === id ?
                                                    <div className='flex justify-center py-2'>
                                                        <l-ring
                                                            size="16"
                                                            stroke="1"
                                                            bg-opacity="0"
                                                            speed="2"
                                                            color="black"
                                                        ></l-ring>
                                                    </div>
                                                    :

                                                    <p>Add to cart</p>


                                            }
                                        </div>
                                    </div>
                                </>
                            ))
                        }
                    </div>
            }

            <div className='mt-4'>


                {product === null || product?.length === 0 ? <p className='text-center text-lg font-semibold text-purple-500 mt-16'> 😔 Your cart is empty</p> :

                    cartLoading ?
                        <div className='flex justify-center'>
                            <l-ring
                                size="60"
                                stroke="3"
                                bg-opacity="0"
                                speed="2"
                                color="black"
                            ></l-ring>
                        </div>
                        :

                        <div className="max-w-4xl mx-auto  pt-16">
                            <h1 className="text-3xl font-extrabold tracking-tight text-black">Shopping Cart</h1>



                            <form className="mt-12 flex flex-col ">
                                <section aria-labelledby="cart-heading">


                                    <ul className="border-2 border-purple-500 divide-y px-4 sm:px-8 bg-white rounded-md  divide-purple-500">
                                        {product?.map((product, productIdx) => (
                                            <li key={product.id} className="flex py-6 sm:py-10 bg-white">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        loading='lazy'
                                                        src={product.image}
                                                        alt={product.imageAlt}
                                                        className="w-24 h-24 rounded-lg object-center object-cover sm:w-32 sm:h-32"
                                                    />
                                                </div>

                                                <div className="relative ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                                    <div>
                                                        <div className="flex justify-between sm:grid sm:grid-cols-2">
                                                            <div className="pr-6">
                                                                <h3 className="">
                                                                    <a href={product.href} className="font-semibold text-md text-gray-700 hover:text-gray-800">
                                                                        {product.name}
                                                                    </a>
                                                                </h3>


                                                            </div>

                                                            <p className="text-sm font-medium text-gray-900 text-right">Rs {product.price * product.quantity}</p>
                                                        </div>

                                                        <div className="mt-4 flex justify-center items-center sm:block sm:absolute sm:top-0 sm:left-1/2 sm:mt-0">
                                                            <label htmlFor={`quantity-${productIdx}`} className="sr-only">
                                                                Quantity, {product.name}
                                                            </label>
                                                            <div className='flex flex-col'>

                                                                <div class="flex items-center ">
                                                                    <button class="bg-purple-500 rounded-l-lg px-2 py-1" onClick={() => handleQuantityDecrement(product.id)}  >-</button>
                                                                    <span class="mx-2 text-gray-600">{product.quantity}</span>
                                                                    <button class="bg-purple-500 rounded-r-lg px-2 py-1" onClick={() => handleQuantityIncrement(product.id)} >+</button>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(product.id)}
                                                                    className="text-sm mt-1 font-medium text-red-600 hover:text-red-500 sm:ml-0 sm:mt-3"
                                                                >
                                                                    <span>Remove</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>


                                {/* Order summary */}
                                <section aria-labelledby="summary-heading" className="mt-10 ">
                                    <div className="bg-gray-50 border-2 rounded-lg px-4 py-6 sm:p-6 lg:p-8">


                                        <div className="flow-root">
                                            <div className='flex justify-center '>
                                                <input
                                                    type="text"
                                                    id="mobile-number"
                                                    name="coupon"
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value)}
                                                    placeholder='apply coupon'
                                                    className=" uppercase border-2 block p-2 border-purple-800 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                                <button onClick={handleCoupon} type='button' className='text-sm rounded-r-md px-2 text-white bg-purple-800'>Apply</button>
                                            </div>
                                            {couponApply && <div className='flex justify-center gap-2 font-semibold'>
                                                <span className='text-red-600'>Coupon Applied Succefully</span>
                                                <svg class="w-6 h-6 text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.891 15.107 15.11 8.89m-5.183-.52h.01m3.089 7.254h.01M14.08 3.902a2.849 2.849 0 0 0 2.176.902 2.845 2.845 0 0 1 2.94 2.94 2.849 2.849 0 0 0 .901 2.176 2.847 2.847 0 0 1 0 4.16 2.848 2.848 0 0 0-.901 2.175 2.843 2.843 0 0 1-2.94 2.94 2.848 2.848 0 0 0-2.176.902 2.847 2.847 0 0 1-4.16 0 2.85 2.85 0 0 0-2.176-.902 2.845 2.845 0 0 1-2.94-2.94 2.848 2.848 0 0 0-.901-2.176 2.848 2.848 0 0 1 0-4.16 2.849 2.849 0 0 0 .901-2.176 2.845 2.845 0 0 1 2.941-2.94 2.849 2.849 0 0 0 2.176-.901 2.847 2.847 0 0 1 4.159 0Z" />
                                                </svg>
                                            </div>}
                                            {couponError && <div className='flex justify-center gap-2 font-semibold'>
                                                <span className='text-red-600'>{errorName} !</span>

                                            </div>}
                                            <dl className="-my-4 text-sm divide-y divide-gray-200">
                                                <div className="py-4 flex items-center justify-between">
                                                    <dt className="text-gray-600">Subtotal</dt>
                                                    <dd className="font-medium text-gray-900">Rs {subtotal}</dd>
                                                </div>
                                                {
                                                    couponApply &&
                                                    <div className="py-4 flex items-center justify-between">
                                                        <dt className="text-sm">Discount</dt>
                                                        <dd className="text-sm font-medium text-gray-900">- Rs {discount}</dd>
                                                    </div>
                                                }
                                                <div className="py-4 flex items-center justify-between">
                                                    <dt className="text-gray-600">Shipping</dt>
                                                    <dd className="font-medium text-gray-900">Rs 60</dd>
                                                </div>

                                                <div className="py-4 flex items-center justify-between">
                                                    <dt className="text-base font-medium text-gray-900">Order total</dt>
                                                    <dd className="text-base font-medium text-gray-900"> Rs {Math.floor(subtotal + 60 - discount)}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>




                                </section>
                            </form>
                        </div>}


            </div>


            {/* Address */}


            <div>
                <form className="lg:grid lg:grid-cols-1 lg:px-30 lg:gap-x-12 xl:gap-x-16">
                    <div>
                        {/* {!success && <div>
                            <h2 className="text-xl font-medium text-purple-500">Contact information</h2>

                            <div className="mt-4">

                                <label htmlFor="mobile-number" className="block text-sm font-medium text-gray-700">
                                    Mobile
                                </label>
                                <div className="mt-1 flex">
                                    <input
                                        type="text"
                                        id="mobile-number"
                                        name="mobile-number"
                                        maxLength={10}
                                        value={ph}
                                        onChange={(e) => setPh(e.target.value)}

                                        className="border-2 block p-2 border-purple-500 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <button type='button' onClick={onSignup} className='text-sm rounded-r-md px-2 text-white bg-purple-500'>Send</button>
                                </div>
                                <div className='my-4' id="recaptcha"></div>
                                {user && <>
                                    <label htmlFor="mobile-number" className="mt-2 block text-sm font-medium text-gray-700">
                                        OTP
                                    </label>
                                    <div className="mt-1 flex">
                                        <input
                                            type="text"
                                            id="otp"
                                            name="otp"

                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}

                                            className="border-2 block p-2 border-purple-500 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        <button type='button' onClick={otpVerify} className='text-sm rounded-r-md px-2 text-white bg-purple-500'>Verify</button>
                                    </div>
                                </>}
                            </div>
                        </div>} */}

                        <div className="mt-10 border-t-2 border-purple-500 pt-10 sm:px-40">
                            <h2 className="text-xl font-semibold text-white  ">Shipping information</h2>

                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div>
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                        Full name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            autoComplete="given-name"
                                            className="block w-full border p-1 border-purple-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>




                                <div className="sm:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="address"
                                            id="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            autoComplete="street-address"
                                            className="block w-full border p-1 border-purple-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                                        Apartment, suite, etc.
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="apartment"
                                            id="apartment"
                                            autoComplete="apartment"
                                            value={formData.apartment}
                                            onChange={handleChange}
                                            className="block w-full border p-1 border-purple-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                        State
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="state"
                                            id="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            autoComplete="address-level1"
                                            className="capitalize block w-full p-1 border border-purple-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            autoComplete="address-level2"
                                            className="block w-full p-1 border border-purple-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>





                                <div>
                                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                                        PIN Code
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="pincode"
                                            id="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            autoComplete="pincode"
                                            className="block w-full p-1 border border-purple-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            autoComplete="tel"
                                            className="block w-full p-1 border border-purple-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>




                    </div>


                </form>
            </div>

            {/* payment */}

            <div className='sm:px-40 mt-5'>
                <ul className="grid w-full gap-6 md:grid-cols-2">
                    <li>
                        <input
                            type="radio"
                            id="hosting-small"
                            name="deliveryMode"
                            value="Cash On Delivery"
                            className="hidden peer"
                            required
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="hosting-small"
                            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-purple-500 peer-checked:text-purple-500 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <div className="block">
                                <div className="w-full text-lg font-semibold">Cash On Delivery</div>
                            </div>
                            <svg className="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </label>
                    </li>
                    <li>
                        <input
                            type="radio"
                            id="hosting-big"
                            name="deliveryMode"
                            value="Already Paid"
                            className="hidden peer"
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="hosting-big"
                            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-purple-500 peer-checked:text-purple-500 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <div className="block">
                                <div className="w-full text-lg font-semibold">Already Paid</div>
                            </div>
                            <svg className="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </label>
                    </li>
                </ul>
            </div>


            <div className='flex justify-center mt-6'>
                <button onClick={handleCheckout} type="button" class="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg w-60 text-sm px-6 py-2.5 text-center me-2 mb-2">
                    {
                        submitLoading ? <l-ring
                            size="20"
                            stroke="2"
                            bg-opacity="0"
                            speed="2"
                            color="white"
                        ></l-ring> : "Checkout"
                    }
                </button>

            </div>
        </div>
    )
}
