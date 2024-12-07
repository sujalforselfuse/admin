import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { ring } from 'ldrs'
ring.register()

export default function Product() {

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productRating, setProductRating] = useState(4);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description1Name, setDescription1Name] = useState('');
  const [description1Value, setDescription1Value] = useState('');
  const [description2Name, setDescription2Name] = useState('');
  const [description2Value, setDescription2Value] = useState('');
  const [description3Name, setDescription3Name] = useState('');
  const [description3Value, setDescription3Value] = useState('');
  const [description4Name, setDescription4Name] = useState('');
  const [description4Value, setDescription4Value] = useState('');
  const [image1URL, setImage1URL] = useState("");
  const [image2URL, setImage2URL] = useState("");
  const [image3URL, setImage3URL] = useState("");
  const [image4URL, setImage4URL] = useState("");
  const [image1Loading, setImage1Loading] = useState(false);
  const [image2Loading, setImage2Loading] = useState(false);
  const [image3Loading, setImage3Loading] = useState(false);
  const [image4Loading, setImage4Loading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleProductNameChange = (e) => setProductName(e.target.value);
  const handleProductDescriptionChange = (e) => setProductDescription(e.target.value);
  const handleProductRatingChange = (e) => setProductRating(e.target.value);
  const handleOriginalPriceChange = (e) => setOriginalPrice(e.target.value);
  const handleDiscountedPriceChange = (e) => setDiscountedPrice(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

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

const infoToast= (msg) => toast.info(msg, {
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



  const categoryFunc = async () => {
    const response = await fetch('https://ratna-backend-smp.onrender.com/api/category/getcategory');
    const data = await response.json();
    if (data.success) {
      setCategory(data?.categories);
    }
    console.log(data);
  }

  const handleFileChange1 = async (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileChange(file, setImage1Loading, setImage1URL);
    }

  }
  const handleFileChange2 = async (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileChange(file, setImage2Loading, setImage2URL);
    }

  }
  const handleFileChange3 = async (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileChange(file, setImage3Loading, setImage3URL);
    }

  }
  const handleFileChange4 = async (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileChange(file, setImage4Loading, setImage4URL);
    }

  }


  const handleFileChange = async (file, setImageLoading, setImageURL) => {

    infoToast('Feautre is disable as it may reflect in main website');
    return ;

    if (file) {
      try {
        setImageLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'aowwz6ns'); // replace 'your_upload_preset' with your actual upload preset

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dmix1720n/image/upload`,
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

  const resetForm = () => {
    setCategory([]);
    setProductName('');
    setProductDescription('');
    setProductRating(4);
    setOriginalPrice(0);
    setDiscountedPrice(0);
    setSelectedCategory('');
    setDescription1Name('');
    setDescription1Value('');
    setDescription2Name('');
    setDescription2Value('');
    setDescription3Name('');
    setDescription3Value('');
    setDescription4Name('');
    setDescription4Value('');
    setImage1URL('');
    setImage2URL('');
    setImage3URL('');
    setImage4URL('');
    setImage1Loading(false);
    setImage2Loading(false);
    setImage3Loading(false);
    setImage4Loading(false);
  };

  const handleSubmit = async (e) => {

    infoToast('Feautre is disable as it may reflect in main website');
    return ;

    setSubmitLoading(true);
    try {
      const data = await fetch('https://ratna-backend-smp.onrender.com/api/product/addproduct', {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
        },
        body: JSON.stringify({
          name: productName,
          description: productDescription,
          rating: productRating,
          originalPrice: originalPrice,
          discountedPrice: discountedPrice,
          category: selectedCategory,
          details: [
            {
              name: description1Name,
              description: description1Value
            },
            {
              name: description2Name,
              description: description2Value
            },
            {
              name: description3Name,
              description: description3Value
            },
            {
              name: description4Name,
              description: description4Value
            }
          ],
          images: [
            {
              name: 'Product Image 1',
              src: image1URL,
              alt: 'Product image 1'
            },
            {
              name: 'Product Image 2',
              src: image2URL,
              alt: 'Product image 2'
            },
            {
              name: 'Product Image 3',
              src: image3URL,
              alt: 'Product image 3'
            },
            {
              name: 'Product Image 4',
              src: image4URL,
              alt: 'Product image 4'
            }
          ]
        })
      })
      const res = await data.json();
      console.log(res);
      if (res.success) {
        successToast('Product added successfully');

      }
      else {
        errorToast('Failed to add product');
      }
    } catch (error) {

      errorToast('Failed to add product');
    }
    setSubmitLoading(false);
    resetForm();
  }

  const handleDelete = async (id) => {

    infoToast('Feautre is disable as it may reflect in main website');
    return ;

    try {
      const res = await fetch(`https://ratna-backend-smp.onrender.com/api/product/deleteproduct/${id}`, {
        method: 'DELETE',
        headers: {

          'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`
        },
      });

      const data = await res.json();

      if (data.success) {
        successToast('Product deleted successfully');
        window.location.reload();
      }
      else {
        errorToast('Failed to delete product');
      }

    } catch (error) {
      errorToast('Failed to delete product');
    }

  }

  const handlePopular = async (id) => {

    infoToast('Feautre is disable as it may reflect in main website');

    return '';

    try {
      const res = await fetch(`https://ratna-backend-smp.onrender.com/api/product/updatedemandingproduct/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`,
        }
      })

      const data = await res.json();

      if (data.success) {
        successToast('Product updated successfully');
        window.location.reload();
      }
      else {
        errorToast('Failed to update product');
      }
    } catch (error) {

      errorToast('Failed to update product');
    }

  }

  const handleUnPopular = async (id) => {
    infoToast('Feautre is disable as it may reflect in main website');
    return ;
    try {
      const res = await fetch(`https://ratna-backend-smp.onrender.com/api/product/updateundemandingproduct/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ratnatoken')}`,
        }
      })

      const data = await res.json();

      if (data.success) {
        successToast('Product updated successfully');
        window.location.reload();
      }
      else {
        errorToast('Failed to update product');
      }
    } catch (error) {
      errorToast('Failed to update product');

    }

  }

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

  useEffect(() => {
    categoryFunc();
    getAllProduct();
  }, []);



  return (
    <div className='px-4 mt-2 mb-6 flex flex-col'>
<ToastContainer />
      

      <div>

        <div>
          <h1 className='text-xl font-bold mt-4'>Add Products</h1>
        </div>
        <div className='bg-black h-1 mx-12 my-4'></div>

        <div className='flex flex-col gap-6'>
          <div className='flex gap-12'>
            <div className='flex flex-col'>
              <label className='font-semibold text-md' htmlFor="">Name of Product</label>
              <input value={productName} onChange={handleProductNameChange} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Enter Name of Category' />
            </div>

            <div className='flex flex-col'>
              <label className='font-semibold text-md' htmlFor="">Description of Product</label>
              <input value={productDescription} onChange={handleProductDescriptionChange} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Enter Description' />
            </div>

            <div className='flex flex-col'>
              <label className='font-semibold text-md' htmlFor="">Rating of Product</label>
              <input value={productRating} onChange={handleProductRatingChange} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Enter Rating' />
            </div>

          </div>
          <div className='flex gap-12'>
            <div className='flex flex-col'>
              <label className='font-semibold text-md' htmlFor="">Original Price</label>
              <input value={originalPrice} onChange={handleOriginalPriceChange} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="number" placeholder='Original Price' />
            </div>

            <div className='flex flex-col'>
              <label className='font-semibold text-md' htmlFor="">Discounted Price</label>
              <input value={discountedPrice} onChange={handleDiscountedPriceChange} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="number" placeholder='Discounted Price' />
            </div>

            <div className='flex flex-col'>
              <label className='font-semibold text-md' htmlFor="">Select Category Of Product</label>

              <select value={selectedCategory} onChange={handleCategoryChange} required className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md'>
                <option value="">Select Category</option>
                {category?.map(option => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
          <div className='font-semibold text-lg underline'>Details Section</div>
          <div className='gap-2 flex flex-col'>

            <div className='flex gap-12'>
              <div className='flex flex-col'>
                <label className='font-semibold text-md' htmlFor="">Name of Detail 1</label>
                <input value={description1Name} onChange={(e) => setDescription1Name(e.target.value)} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Name of Detail 1' />
              </div>

              <div className='flex flex-col'>
                <label className='font-semibold text-md' htmlFor="">Description of Detail 1</label>
                <input value={description1Value} onChange={(e) => setDescription1Value(e.target.value)} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Description of Detail 1' />
              </div>
            </div>
            <div className='flex gap-12'>
              <div className='flex flex-col'>
                <label className='font-semibold text-md' htmlFor="">Name of Detail 2</label>
                <input value={description2Name} onChange={(e) => setDescription2Name(e.target.value)} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Name of Detail 2' />
              </div>

              <div className='flex flex-col'>
                <label className='font-semibold text-md' htmlFor="">Description of Detail 2</label>
                <input value={description2Value} onChange={(e) => setDescription2Value(e.target.value)} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Description of Detail 2' />
              </div>
            </div>
            <div className='flex gap-12'>
              <div className='flex flex-col'>
                <label className='font-semibold text-md' htmlFor="">Name of Detail 3</label>
                <input value={description3Name} onChange={(e) => setDescription3Name(e.target.value)} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Name of Detail 3' />
              </div>

              <div className='flex flex-col'>
                <label className='font-semibold text-md' htmlFor="">Description of Detail 3</label>
                <input value={description3Value} onChange={(e) => setDescription3Value(e.target.value)} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="tetx" placeholder='Description of Detail 3' />
              </div>
            </div>
            <div className='flex gap-12'>
              <div className='flex flex-col'>
                <label className='font-semibold text-md' htmlFor="">Name of Detail 4</label>
                <input value={description4Name} onChange={(e) => setDescription4Name(e.target.value)} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Name of Detail 4' />
              </div>

              <div className='flex flex-col'>
                <label className='font-semibold text-md' htmlFor="">Description of Detail 4</label>
                <input value={description4Value} onChange={(e) => setDescription4Value(e.target.value)} className='mt-1 border-2 border-[#006400] w-80 p-1 rounded-md' type="text" placeholder='Description of Detail 4' />
              </div>
            </div>
          </div>

          <div className='font-semibold text-lg underline'>Image Section</div>

          <div className='flex gap-12'>
            <div className=' flex flex-col'>
              <label className='font-semibold text-md mb-1' htmlFor="">Upload Product Image 1</label>
              <input
                className='hidden'
                type='file'
                accept='image/*'
                id='product-image-1'
                onChange={handleFileChange1}
              />
              <label
                htmlFor='product-image-1'
                className=' rounded-md border-2 border-dashed border-[#006400] px-16 py-2 text-sm text-[#006400] '
              >
                {image1Loading ? "Uploading .." : image1URL !== "" ? "Upload Done" : "Upload Image"}
              </label>
            </div>
            <div className=' flex flex-col'>
              <label className='font-semibold text-md mb-1' htmlFor="">Upload Product Image 2</label>
              <input
                className='hidden'
                type='file'
                accept='image/*'
                id='product-image-2'
                onChange={handleFileChange2}
              />
              <label
                htmlFor='product-image-2'
                className=' rounded-md border-2 border-dashed border-[#006400] px-16 py-2 text-sm text-[#006400] '
              >
                {image2Loading ? "Uploading .." : image2URL !== "" ? "Upload Done" : "Upload Image"}
              </label>
            </div>
            <div className=' flex flex-col'>
              <label className='font-semibold text-md mb-1' htmlFor="">Upload Product Image 3</label>
              <input
                className='hidden'
                type='file'
                accept='image/*'
                id='product-image-3'
                onChange={handleFileChange3}
              />
              <label
                htmlFor='product-image-3'
                className=' rounded-md border-2 border-dashed border-[#006400] px-16 py-2 text-sm text-[#006400] '
              >
                {image3Loading ? "Uploading .." : image3URL !== "" ? "Upload Done" : "Upload Image"}
              </label>
            </div>
            <div className=' flex flex-col'>
              <label className='font-semibold text-md mb-1' htmlFor="">Upload Product Image 4</label>
              <input
                className='hidden'
                type='file'
                accept='image/*'
                id='product-image-4'
                onChange={handleFileChange4}
              />
              <label
                htmlFor='product-image-4'
                className=' rounded-md border-2 border-dashed border-[#006400] px-16 py-2 text-sm text-[#006400] '
              >
                {image4Loading ? "Uploading .." : image4URL !== "" ? "Upload Done" : "Upload Image"}
              </label>
            </div>
          </div>
        </div>
        <div className='my-4'>
          <button onClick={handleSubmit} type="button" class="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-6 py-2.5 text-center me-2 mb-2">
            {
              submitLoading ? <l-ring
                size="16"

                stroke="1"
                bg-opacity="0"
                speed="2"
                color="white"
              ></l-ring> : "Submit"
            }
          </button>
        </div>

      </div>

      <div>
        <div>
          <h1 className='text-xl font-bold mb-4'>View All Products</h1>
        </div>
        {fetchLoading ? <div className='flex justify-center'>
          <l-ring
            size="60"
            stroke="3"
            bg-opacity="0"
            speed="2"
            color="white"
          ></l-ring>
        </div> :

          <div className='grid grid-cols-4 gap-6'>
            {
              products?.map((product) => (
                <>

                  <div className=' border-2 bg-white border-[#006400] rounded-md' key={product.id}>
                    <div className="relative pb-2 sm:p-2">
                      <div className="relative w-full h-28 sm:border-2 sm:h-60 sm:rounded-lg overflow-hidden">
                        <img
                          src={product.images[0].src}
                          alt={product.imageAlt}
                          className="w-full h-full object-center object-cover"
                        />

                      </div>
                      <div className="relative mt-2 sm:mt-4 px-2">
                        <h3 className="text-md font-bold text-[#006400]">{product.name}</h3>
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

                    <div onClick={() => handleDelete(product._id)} className='w-full cursor-pointer text-center bg-red-700 text-white font-medium p-1'>
                      Delete Product
                    </div>
                    {
                      product.demanding ?
                        <div onClick={() => handleUnPopular(product._id)} className='w-full cursor-pointer text-center bg-[#006400] text-yellow-400 font-medium p-1'>
                          Mark as UnPopular
                        </div>
                        : <div onClick={() => handlePopular(product._id)} className='w-full cursor-pointer text-center bg-[#006400] text-white font-medium p-1'>
                          Mark as Popular
                        </div>
                    }

                  </div>
                </>
              ))
            }
          </div>
        }
      </div>
    </div>
  )
}
