import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCartItemRoute, getcartitem } from "../utils/Apiroutes";
import './cart.css';

const Cart = () => {
  let navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (localStorage.getItem("User")) {
      const storedUser = localStorage.getItem("User");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(getcartitem, {
          params: { userId: user._id } // Sending user ID as query parameter
        });
        setCartItems(response.data.user.cart); // Assuming the response contains the user object with populated cart items
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (user._id) {
      fetchCartItems();
    }
  }, [user]);

  useEffect(() => {
    const sendCartSizeEmail = async () => {
      
      try {
        const storedUser = localStorage.getItem("User");
       
        const mail = JSON.parse(storedUser);
        console.log(mail.email);
        await axios.post('http://localhost:8080/send-email', {
          to: `${mail.email}`,
          subject: 'Cart Size Alert',
          text: `The cart size has reached ${cartItems.length} items. plzz buy your product and visit out website`,
          html: '<p>Click <a href="http://localhost:3000/">here</a> to visit our website.</p>'
        });
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };

    if (cartItems.length === 5) {
      sendCartSizeEmail();
    }
  }, [cartItems]);

  const handleDelete = async (itemId) => {
    try {
      let response=await axios.delete(deleteCartItemRoute, {
        data: { userId: user._id, itemId }
      });
      console.log(response.data.user);
      if(response.data.user.cart.length==0){
        window.location.reload();
      }else{
      setCartItems(response.data.user.cart);
      window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  return (
    <div>
      <h1 className='Heading'>Welcome To Cart</h1>
      <div className='itemContainer'>
        {cartItems.map(item => (
          <div key={item._id} className='itemIterator'>
            <img src={item.img} alt={item.name} style={{ width: '100px', height: '100px' }} className='itemImg' />
            <p className='itemName'>{item.name}</p>
            <p className='itemDesc'>Description: {item.desc}</p>
            <p className='itemPrice'>Price: {item.price}</p>
            <p className='itemPrice'>Sold item: {item.sold}</p>
            <button onClick={() => handleDelete(item._id)} className='deleteButton'>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
