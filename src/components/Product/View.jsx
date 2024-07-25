import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cartroute, reviewroute, viewroute } from '../../utils/Apiroutes';
import './View.css';

const View = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [review, setReview] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${viewroute}${id}`);
        setProduct(response.data.foundProduct); 
        setReview(response.data.foundProduct.reviews);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
    }
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${reviewroute}${id}/`, { rating, comment });
      const newReview = response.data.review;
      setReview(prevReviews => [...prevReviews, newReview]);
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review.');
    }
  };

  const addToCart = async () => {
    try {
      const response = await axios.post(`${cartroute}${id}`, { user });
      console.log(response.data.message);
      toast.success('Product added to cart!');
      // Optionally, you can handle success message or other UI updates here
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Failed to add product to cart.');
    }
  };

  return (
    <div className="view-container">
      <div className="product-details">
        {product && (
          <div>
            <div className="product-container" key={product._id}>
              <img src={product.img} className='productImg' alt="Product"></img>
              <h3 className='productName'>{product.name}</h3>
              <p className='productDesc'>{product.description}</p>
              <p className='productPrice'>Price: {product.price}</p>
              {user.role === 'seller' && (
                <>
                  <Link to={`/product/update/${product._id}`}>update</Link>
                </>
              )}
               <button onClick={addToCart}>Add to Cart</button>
            </div>
            <h3 className='ReviewsTitle'>Reviews</h3>
            {review.length > 0 ? (
              <div className="reviews-container">
                {review.map(reviewproduct => (
                  <div key={reviewproduct._id} className="review-product">
                    <p className="rating">Rating: {reviewproduct.rating}</p>
                    <p className="comment">Comment: {reviewproduct.comment}</p>
                    <hr className="review-divider" />
                  </div>
                ))}
              </div>
            ) : (
              <p className='noReview'>No reviews yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="review-form">
        <h3>Leave a Review</h3>
        <form onSubmit={handleReviewSubmit}>
          <div className='star-ratings'>
            <label htmlFor="rating">Rating:</label>
            <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} className='ratingSelect'>
              <option value="0">Select</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div className='commentInput'>
            <label htmlFor="comment">Comment:</label>
            <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default View;
