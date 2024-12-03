import React, { useContext,useState,useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../Components/Context/Storecontext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from "../../constants/apiconstants"
import { AiFillDelete } from "react-icons/ai";

const Cart = ({ setShowLogin }) => {
  const { cartItems, addToCart, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const [food_list, setFoodList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_BASE_URL + '/products')
      .then((res) => {
        if (res.data.status) {
          setFoodList(res.data.data);
        }
      })
  }, []);

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
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
        {
          Object.keys(cartItems).length == 0 ? <div className="cart-items-empty">Card is empty!! Please add item into cart.</div> :
            food_list.map((item) => {
              if (cartItems[item.id] > 0) {
                return (
                  <div key={item.id}>
                    <div className='cart-items-title cart-items-item'>
                      <img src={item.image} alt='' />
                      <p>{item.name}</p>
                      <p>${item.price}</p>
                      <div className="quantity-control">
                        <button onClick={() => removeFromCart(item.id)} className='minus-btn'>-</button>
                        <span>{cartItems[item.id]}</span>
                        <button onClick={() => addToCart(item.id)} className='plus-btn'>+</button>
                      </div>
                      <p>${item.price * cartItems[item.id]}</p>
                      <AiFillDelete onClick={() => removeFromCart(item.id, true)} className='cross' />
                    </div>
                    <hr />
                  </div>
                );
              }
              return null;
            })
        }
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
          <button onClick={handleCheckout} disabled={(Object.keys(cartItems).length == 0)}>PROCEED TO CHECKOUT</button>
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
