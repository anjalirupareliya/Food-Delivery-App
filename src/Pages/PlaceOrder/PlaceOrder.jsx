import React, { useContext } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Components/Context/Storecontext'
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const { getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <form className='place-order'>

      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>

        <div className='multi-fields'>
          <input type='text' placeholder='First name' required />
          <input type='text' placeholder='Last name' required />
        </div>

        <input type='email' placeholder='Email Address' required />
        <input type='text' placeholder='street' required />
        <div className='multi-fields'>
          <input type='text' placeholder='city' required />
          <input type='text' placeholder='state' required />
        </div>

        <div className='multi-fields'>
          <input type='text' placeholder='Zip code' required />
          <input type='text' placeholder='Country' required />
        </div>

        <input type='text' placeholder='Phone' required />
      </div>

      <div className='place-order-right'>
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
          <button onClick={() => navigate('/confirm')}>PROCEED TO PAYMENT</button>

        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
