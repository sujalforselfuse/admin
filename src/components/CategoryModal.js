'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

export default function CategoryModal({ open, setOpen,pName,pDesc,pImage,id }) {

    const [imageLoading, setImageLoading] = useState(false)
    const [saved, setSaved] = useState(false);
    const [imageURL, setImageURL] = useState(pImage);
    const [newImageURL, setNewImageURL] = useState('');
    const [name, setName] = useState(pName);
    const [description, setDescription] = useState(pDesc);

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

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                setImageLoading(true);

                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'aowwz6ns'); // replace 'your_upload_preset' with your actual upload preset


                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/dmix1720n/image/upload`, // replace 'your_cloud_name' with your actual cloud name
                    formData
                );

                setNewImageURL(response.data.secure_url);
                console.log('Image uploaded successfully:', response.data.secure_url);
                setSaved(true);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
            setImageLoading(false);
            
        }
    };

    const handleEditCategory = async () => {
        //fetching edit category
        
        console.log(name, description, newImageURL);
        const data = await fetch(`https://ratna-backend-smp.onrender.com/api/category/editcategory/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description,imageURL: newImageURL ? newImageURL : imageURL })
        });

        const json = await data.json();

        if (json.success) {

            successToast('Category updated successfully');

            window.location.reload();

        }
        else {
            errorToast('Failed to update category');
        }

    }



    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <ToastContainer />
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
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
                                        Edit Category
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <div className='w-full mb-2'>
                                            <label htmlFor="" className="block text-sm font-medium text-gray-700">Category Name</label>
                                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="mt-1 block w-80  border-2 p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " placeholder='Edit Name' />
                                        </div>
                                        <div className='w-full mb-2'>
                                            <label htmlFor="" className="block text-sm font-medium text-gray-700">Category Description</label>
                                            <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="mt-1 block w-80  border-2 p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " placeholder='Edit Description' />
                                        </div>
                                        <div className='w-full mb-2'>
                                            <label className='block text-sm font-medium text-gray-700 mb-4' htmlFor="">Upload Cover Image</label>
                                            <input
                                            
                                                className='hidden'
                                                type='file'
                                                accept='image/*'
                                                id='category-cover-image'
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor='category-cover-image'
                                                className=' rounded-md border-2 border-dashed border-[#006400] px-16 py-2 text-sm text-[#006400] '
                                            >                                                
                                                {imageLoading ? "Uploading .." : saved ? "Uploaded" : "Upload Image"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={handleEditCategory}
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
