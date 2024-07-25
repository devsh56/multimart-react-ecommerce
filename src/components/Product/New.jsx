import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addproduct } from '../../utils/Apiroutes';
import './New.css';

const New = () => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    img: '',
    price: 0,
    desc: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, img, price, desc } = formData;
      const storedUser = localStorage.getItem("User");
      if (!storedUser) {
        throw new Error("User not found in local storage");
      }
      const user = JSON.parse(storedUser);
      const userId = user._id; // Assuming the user ID is stored as '_id'

      const response = await axios.post(addproduct, {
        name,
        img,
        price,
        desc,
        userId // Include the user ID in the request
      });

      console.log('Product added:', response.data);

      // Optionally, you can reset the form after successful submission
      setFormData({
        name: '',
        img: '',
        price: 0,
        desc: ''
      });

      navigate("/shop"); // Redirect to the shop page after adding the product
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className='AddNew'>
      <h2 className='Heading'>Add New Product</h2>
      <form onSubmit={handleSubmit} className='formContainer'>
        <div className='inputField'>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className='imageUpload'>
          <label htmlFor="img">Image URL:</label>
          <input type="text" id="img" name="img" value={formData.img} onChange={handleChange} required />
        </div>
        <div className='priceInput'>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className='currency'>
          <label htmlFor="desc">Description:</label>
          <textarea id="desc" name="desc" value={formData.desc} onChange={handleChange} required />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default New;
