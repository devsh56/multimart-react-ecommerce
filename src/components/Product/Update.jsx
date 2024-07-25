import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateroute, viewroute } from '../../utils/Apiroutes';
import './update.css';

const Update = () => {
    let navigate = useNavigate();
    const [name, setName] = useState('');
    const [img, setImg] = useState('');
    const [price, setPrice] = useState('');
    const [desc, setDesc] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${viewroute}${id}`);
                const foundProduct = response.data.foundProduct;
                setName(foundProduct.name);
                setImg(foundProduct.img);
                setPrice(foundProduct.price);
                setDesc(foundProduct.desc);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        try {
            const response = await axios.post(`${updateroute}${id}`, {
                name,
                img,
                price,
                desc
            });
            console.log('Update response:', response);
            navigate("/shop"); // Navigate to "/" route upon successful form submission
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    console.log('ID:', id);
    console.log('Name:', name);
    console.log('Image:', img);
    console.log('Price:', price);
    console.log('Description:', desc);

    return (
        <div className="update-container">
            <h2>Update Product</h2>
            <form onSubmit={handleUpdate}>
                <div className='title'>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='InputImg'>
                    <label htmlFor="img">Image URL:</label>
                    <input
                        type="text"
                        id="img"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                    />
                </div>
                <div className='inputPrice'>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div className='inputDesc'>
                    <label htmlFor="desc">Description:</label>
                    <textarea
                        id="desc"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default Update;