import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Components/Context/Storecontext';
import { useNavigate } from 'react-router-dom';
import { AiFillDelete, AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

const Cart = () => {
  const { food_list, cartItems, addToCart, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [isPromoValid, setIsPromoValid] = useState(false);

  const validPromoCodes = ['SAVE10', 'FREESHIP'];

  const handlePromoSubmit = () => {
    if (!promoCode.trim()) {
      setPromoMessage('');
      setIsPromoValid(false);
      return;
    }

    if (validPromoCodes.includes(promoCode)) {
      setPromoMessage('Promo code applied successfully!');
      setIsPromoValid(true);
    } else {
      setPromoMessage('Promo code is not available.');
      setIsPromoValid(false);
    }
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
            <p>Total</p>
            <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</p>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className='cart-promocode'>
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type='text' placeholder='promo code' value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <button onClick={handlePromoSubmit}>Submit</button>
            </div>
            {promoMessage && (
              <p className={`promo-message ${isPromoValid ? 'success' : 'error'}`}>
                {isPromoValid ? (
                  <> <AiFillCheckCircle className='check-icon' /> {promoMessage} </>
                ) : (
                  <> <AiFillCloseCircle className='close-icon' /> {promoMessage} </>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
