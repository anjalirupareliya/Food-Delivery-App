import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Components/Context/Storecontext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { firstName, lastName, email, street, city, state, zip, country, phone } = formData;
    if (!firstName || !lastName || !email || !street || !city || !state || !zip || !country || !phone) {
      setError('Please fill in all the fields.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/confirm');
    }
  };

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>

        <div className='multi-fields'>
          <input type='text' name='firstName' placeholder='First name' value={formData.firstName} onChange={handleChange} required />
          <input type='text' name='lastName' placeholder='Last name' value={formData.lastName} onChange={handleChange} required />
        </div>

        <input type='email' name='email' placeholder='Email Address' value={formData.email} onChange={handleChange} required />
        <input type='text' name='street' placeholder='Street' value={formData.street} onChange={handleChange} required />

        <div className='multi-fields'>
          <input type='text' name='city' placeholder='City' value={formData.city} onChange={handleChange} required />
          <input type='text' name='state' placeholder='State' value={formData.state} onChange={handleChange} required />
        </div>

        <div className='multi-fields'>
          <input type='text' name='zip' placeholder='Zip code' value={formData.zip} onChange={handleChange} required />
          <input type='text' name='country' placeholder='Country' value={formData.country} onChange={handleChange} required />
        </div>

        <input type='text' name='phone' placeholder='Phone' value={formData.phone} onChange={handleChange} required />
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
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>

      {/* Error message if form is incomplete */}
      {error && <p className='error-message'>{error}</p>}
    </form>
  );
};

export default PlaceOrder;
