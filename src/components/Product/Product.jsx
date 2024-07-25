import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteproduct, productroute } from '../../utils/Apiroutes';
import './product.css';

const Product = () => {
    let navigate = useNavigate();
    const [product, setProduct] = useState([]);
    const [user, setUser] = useState({});
    const [likedProducts, setLikedProducts] = useState([]);
    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        if (localStorage.getItem("Scaler")) {
            const storedUser = localStorage.getItem("User");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(productroute);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchData(); // Call the async function
    }, []); // Pass an empty array as the second argument to useEffect

    const isProductLiked = (productId) => likedProducts.includes(productId);

    const handleLike = (productId) => {
        if (isProductLiked(productId)) {
            // Unlike the product
            setLikedProducts(likedProducts.filter(id => id !== productId));
        } else {
            // Like the product
            setLikedProducts([...likedProducts, productId]);
        }
    };

    const handleDelete = async (productId) => {
        try {
            if (!user) {
                throw new Error("User data is missing");
            }
    
            const storeduser = localStorage.getItem("User");
            const top= JSON.parse(storeduser);
            const id=top._id
            console.log(top);
            const response = await axios.post(`${deleteproduct}/${productId}`, {
                data: { id }
            });
            if (response.status === 200) {
                toast.success(response.data.message);
                setProduct(product.filter(item => item._id !== productId));
            }
        }  catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else if (error.request) {
                toast.error('No response received from server');
            } else {
                toast.error('Error: ' + error.message);
            }
        }
    };
  
    return (
        <div className='ff'>
            <ToastContainer />
            {product.map((item) => (
                <div className="product-container" key={item._id}>
                    {/* Render each product item */}
                    <img src={item.img} alt={item.name} className='productImg' />
                    <h3 className='productName'>{item.name}</h3>
                    <p className='productDesc'>{item.description}</p>
                    <p className='productPrice'>Price: {item.price}</p>
                    <Link to={`/product/view/${item._id}`}>view</Link>
                    <div className="action-buttons">
                        <div className="like-button">
                            {isProductLiked(item._id) ? (
                                <FaHeart color="red" size="30" onClick={() => handleLike(item._id)} />
                            ) : (
                                <FaRegHeart color="white" size="30" onClick={() => handleLike(item._id)} />
                            )}
                        </div>
                        {user.role === 'seller' && (
                            <button onClick={() => handleDelete(item._id)} className="delete-button">
                                Delete
                            </button>
                            
                        )}
                    

                    </div>
                </div>
            ))}
            {cartMessage && <p>{cartMessage}</p>}
        </div>
    );
};

export default Product;
