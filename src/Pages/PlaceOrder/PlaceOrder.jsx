import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './PlaceOrder.css';
import { StoreContext } from '../../Components/Context/Storecontext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../../constants/apiconstants";

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const countrys = ['Australia', 'Japan', 'Egypt', 'Germany', 'Canada', 'India', 'Brazil', 'France', 'Nepal', 'Malaysia', 'Russia', 'Saudi Arabia', "America", "Spain", "Turkey", "Vietnam"];
  const states = ['Maharashtra', 'Karnataka', 'Gujarat', 'Delhi', 'Punjab', 'Tamil Nadu', 'Goa', 'Bihar', 'Sikkim', 'Rajasthan', 'Kerela'];
  const cities = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Karnataka": ["Bengaluru", "Mangalore", "Mysuru"],
    "Gujarat": ["Surat", "Bhavnagar", "Ahemdabad", "Rajkot", "Vadodra", "Gandhinagar", "Anand", "Junagadh", "Morbi"],
    "Delhi": ["Chandni Chowk", "Babarpur", "New Delhi", "East Delhi"],
    "Punjab": ["Lahore", "Ludhiana", "Chandigarh", "Amritsar", "Jalandhar", "Ajitgarh"],
    "Tamil Nadu": ["Chennai", "Madurai", "Tiruppur", "Salem"],
    "Goa": ["Panaji", "Madgaon", "Marmagao"],
    "Bihar": ["Patna", "Nalanda", "Muzaffarpur", "Hajipur", "Bhagalpur"],
    "Sikkim": ["Gangtok", "Mangan", "Gyalshing", "Soreng", "Namchi"],
    "Rajasthan": ["Jaipur", "Ajmer", "Jaisalmer", "Udaipur", "Jodhpur", "Bikaner", "Alwar", "Kota"],
    'Kerela': ["Thiruvananthapuram", "Kannur", "Kochi", "Varkala", "Kannur"],
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    street: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [addressList, setAddressList] = useState([]);
  const [showAddressInputs, setShowAddressInputs] = useState(false);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      const [firstName, lastName] = storedUser.fullname.split(' ');
      setFormData({
        ...formData,
        firstName: firstName || '',
        lastName: lastName || '',
        email: storedUser.email || ''
      });
    }

    const fetchAddressData = async () => {
      try {
        const response = await axios.get(API_BASE_URL + '/address');
        if (response.data.status) {
          setAddressList(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching address data:', error);
      }
    };
    fetchAddressData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, [name]: value,
    });
    setErrors({
      ...errors, [name]: '',
    });
  };

  const handleAddressSelect = (e) => {
    debugger
    const selectedAddressId = e.target.value;
    const selectedAddress = addressList.find(address => address.id === Number(selectedAddressId));

    if (selectedAddress) {
      debugger
      setFormData({
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        email: selectedAddress.email,
        city: selectedAddress.city,
        street: selectedAddress.street,
        state: selectedAddress.state,
        zip: selectedAddress.zip,
        country: selectedAddress.country,
        phone: selectedAddress.phone,
      });
      // setShowAddressInputs(false);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        city: '',
        street: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
      });
      setShowAddressInputs(true);
    }
  };

  const validateForm = () => {
    const { firstName, lastName, email, city, street, state, zip, country, phone } = formData;
    let newErrors = {};

    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is not valid';
    }
    if (!street) newErrors.street = 'Street is required';
    if (!city) newErrors.city = 'Please select a city';
    if (!state) newErrors.state = 'Please select a State';
    if (!zip) newErrors.zip = 'Zip code is required';
    if (!country) newErrors.country = 'Please select a country';
    if (!phone) newErrors.phone = 'Please Enter Your Number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/confirm');
    }
  };

  const handleAddNewAddress = () => {
    setShowAddressInputs(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      city: '',
      street: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
    });
  };

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>

        <div className='form-group'>
          <p className='new'>Your addresses:</p>
          {addressList.map((address, index) => (
            <div key={index} className="address-option">
              <input type="radio" name="defaultAddress" value={address.id} id={`address-${address.id}`} onChange={handleAddressSelect} className="address-radio" />
              <label htmlFor={`address-${address.id}`}>
                <span className="full-name">{address.fullName}</span> {address.no}, {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}
              </label>
            </div>
          ))}
        </div>


        <button id="button" type="button" onClick={handleAddNewAddress}>+ Add New Address</button>

        {showAddressInputs && (
          <div className='multi-fields'>
            <div className='form-group w100'>
              <input type='text' name='firstName' placeholder='First name' value={formData.firstName} onChange={handleChange} />
              {errors.firstName && <span className='error-message'>{errors.firstName}</span>}
            </div>

            <div className='form-group w100'>
              <input type='text' name='lastName' placeholder='Last name' value={formData.lastName} onChange={handleChange} />
              {errors.lastName && <span className='error-message'>{errors.lastName}</span>}
            </div>
          </div>
        )}

        {showAddressInputs && (
          <>
            <div className='form-group'>
              <input className='gk' type='email' name='email' placeholder='Email Address' value={formData.email} onChange={handleChange} />
              {errors.email && <span className='error-message'>{errors.email}</span>}
            </div>

            <div className='form-group'>
              <input className='gk' type='text' name='street' placeholder='Enter Your Street' value={formData.street} onChange={handleChange} />
              {errors.street && <span className='error-message'>{errors.street}</span>}
            </div>

            <div className='multi-fields'>
              <div className='form-group w100'>
                <select className='gk' name='city' value={formData.city} onChange={handleChange}>
                  <option value=''>Select City</option>
                  {formData.state && cities[formData.state]?.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <span className='error-message'>{errors.city}</span>}
              </div>
              <div className='form-group w100'>
                <select className='gk' name='state' value={formData.state} onChange={handleChange}>
                  <option value=''>Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <span className='error-message'>{errors.state}</span>}
              </div>
            </div>

            <div className='multi-fields'>
              <div className='form-group w100'>
                <input className='gk' type='text' name='zip' placeholder='Zip Code' value={formData.zip} onChange={handleChange} />
                {errors.zip && <span className='error-message'>{errors.zip}</span>}
              </div>
              <div className='form-group w100'>
                <select className='gk' name='country' value={formData.country} onChange={handleChange}>
                  <option value=''>Select Country</option>
                  {countrys.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && <span className='error-message'>{errors.country}</span>}
              </div>
            </div>

            <div className='form-group'>
              <input className='gk' type='text' name='phone' placeholder='Phone' pattern="[1-9]{1}[0-9]{9}" title="Enter 10 digit mobile number" value={formData.phone} onChange={handleChange} />
              {errors.phone && <span className='error-message'>{errors.phone}</span>}
            </div>
          </>
        )}
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
            <p>Discount</p>
            <p>${0}</p>
          </div>
          <div className='cart-total-details'>
            <p>Total</p>
            <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</p>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
