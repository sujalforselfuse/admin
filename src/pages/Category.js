import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryModal from '../components/CategoryModal';
import { ring } from 'ldrs'
ring.register()


export default function Category() {

    const [category, setCategory] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [open, setOpen] = useState(false);


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

    const infoToast = (msg) => toast.info(msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
    });


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

                setImageURL(response.data.secure_url);
                console.log('Image uploaded successfully:', response.data.secure_url);

            } catch (error) {
                console.error('Error uploading image:', error);
            }
            setImageLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {

        infoToast('Feautre is disable as it may reflect in main website');
        return;

        const confirm = window.confirm('Are you sure you want to delete?');
        if (!confirm) {
            return;
        }
        try {
            const data = await fetch(`https://ratna-backend-smp.onrender.com/api/category/deletecategory/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
                }
            });
            const json = await data.json();
            if (json.success) {

                successToast('Category deleted successfully');
            }
            else {

                errorToast('Failed to delete category');
            }
            window.location.reload();
        } catch (error) {

            errorToast('Failed to delete category');
        }

    }

    const handleEditCategory = async (id) => {
        infoToast('Feautre is disable as it may reflect in main website');
        return;
        setOpen(true);
    }

    const handleSubmit = async () => {
        infoToast('Feautre is disable as it may reflect in main website');
        return;
        console.log(name, description, imageURL);

        setAddLoading(true);

        try {
            const data = await fetch('https://ratna-backend-smp.onrender.com/api/category/addcategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    imageURL: imageURL
                })
            });
            const json = await data.json();
            if (json.success) {
                successToast('Category added successfully');
                window.location.reload();
            }
            else {

                errorToast('Failed to add category');
            }
        } catch (error) {

            errorToast('Failed to add category');
        }

        setAddLoading(false);


    }


    const categoryFunc = async () => {
        setFetchLoading(true);
        const response = await fetch('https://ratna-backend-smp.onrender.com/api/category/getcategory');
        const data = await response.json();
        if (data.success) {
            setCategory(data?.categories);
        }
        setFetchLoading(false);
    }

    useEffect(() => {
        categoryFunc();
    }, []);


    return (
        <div className='px-4 mt-2 mb-4'>
            <ToastContainer />

            <div className='mb-4'>
                <h1 className='text-xl font-bold mt-2'>Add New Category</h1>

                <div className='mt-2'>
                    <div className='flex gap-12'>
                        <div className='flex flex-col'>
                            <label className='font-semibold text-md' htmlFor="">Name</label>
                            <input onChange={(e) => setName(e.target.value)} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Enter Name of Category' />
                        </div>

                        <div className='flex flex-col'>
                            <label className='font-semibold text-md' htmlFor="">Description</label>
                            <input onChange={(e) => setDescription(e.target.value)} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Enter Description' />
                        </div>
                        <div className=' flex flex-col'>
                            <label className='font-semibold text-md mb-1' htmlFor="">Upload Cover Image</label>
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
                                {imageLoading ? "Uploading .." : imageURL !== "" ? "Upload Done" : "Upload Image"}
                            </label>
                        </div>
                    </div>

                    <div className='mt-4'>


                        <button onClick={handleSubmit} type="button" class="text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-6 py-2.5 text-center me-2 mb-2">
                            {
                                addLoading ? <l-ring
                                    size="20"
                                    stroke="2"
                                    bg-opacity="0"
                                    speed="2"
                                    color="white"
                                ></l-ring> : "Add Category"
                            }
                        </button>
                    </div>



                </div>
            </div>
            <div className='bg-black h-1 mx-12 my-4'></div>

            <div>
                <h1 className='text-xl font-bold'>Current Categories</h1>

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

                        <div>
                            <div className="mt-4 flow-root">
                                <div className="-my-2">
                                    <div className="box-content py-2 relative h-80 xl:h-auto overflow-x-auto xl:overflow-visible">
                                        <div className="absolute min-w-screen-xl  px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-x-8 xl:gap-y-8">
                                            {category?.map((category) => (
                                                <div
                                                    key={category.name}

                                                    className="relative w-56 h-80 border-2 border-[#493b1c] rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                                                >
                                                    <span aria-hidden="true" className="absolute inset-0">
                                                        <img src={category.imageURL} alt="" className="w-full h-full object-center object-cover" />
                                                    </span>
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#7afd8f] opacity-50"
                                                    />
                                                    <span className="relative mt-auto text-center text-xl font-bold text-[#493b1c]">{category.name}</span>
                                                    <div className='flex flex-col absolute text-red-700 right-2 top-2 cursor-pointer gap-4'>

                                                        <svg onClick={() => handleDeleteCategory(category._id)} className='h-6' fill='currentColor' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" /></svg>
                                                        <svg onClick={() => handleEditCategory(category._id)} className='text-white h-6' fill='currentColor' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" /></svg>
                                                    </div>
                                                    <CategoryModal open={open} setOpen={setOpen} pName={category.name} pDesc={category.description} id={category._id} pImage={category.imageURL}></CategoryModal>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}
