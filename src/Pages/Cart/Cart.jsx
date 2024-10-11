import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Components/Context/Storecontext';
import { useNavigate } from 'react-router-dom';
import { AiFillDelete, AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

const Cart = ({ userName, setShowLogin }) => {
  const { food_list, cartItems, addToCart, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!userName) {
      setShowLogin(true);
      return;
    }
    navigate('/order');
  };

  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-items-title'>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={item.image} alt='' />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <div className="quantity-control">
                    <button onClick={() => removeFromCart(item._id)} className='minus-btn'>-</button>
                    <span>{cartItems[item._id]}</span>
                    <button onClick={() => addToCart(item._id)} className='plus-btn'>+</button>
                  </div>
                  <p>${item.price * cartItems[item._id]}</p>
                  <AiFillDelete onClick={() => removeFromCart(item._id, true)} className='cross' />
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className='cart-bottom'>
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div className='cart-total-details'>
            <p>SubTotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <div className='cart-total-details'>
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 5}</p>
          </div>
          <div className='cart-total-details'>
            <p>Discount</p>
            <p>${0}</p>
          </div>
          <div className='cart-total-details'>
            <p>Total</p>
            <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</p>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className='cart-promocode'>
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type='text' placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
