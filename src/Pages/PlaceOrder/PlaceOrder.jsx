import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './PlaceOrder.css';
import { StoreContext } from '../../Components/Context/Storecontext';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../../constants/apiconstants";
import { AiFillDelete } from "react-icons/ai";
import { assets } from '../../assets/assets';
import { loadScript, createRazorPayOrder } from './Payment';

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
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    type: '',
    no: '',
    city: '',
    street: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const [errors, setErrors] = useState('');
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new_address");
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadScript();
    fetchAddressData();
  }, []);

  const fetchAddressData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/address`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setAddressList(response.data.data);
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId);

    if (addressId === "new_address") {
      setFormData({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        type: '',
        no: '',
        city: '',
        street: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
      });
    }
    else {
      const selectedAddress = addressList.find((address) => address.id === addressId);
      if (selectedAddress) {
        setFormData({
          id: selectedAddress.id || '',
          firstName: selectedAddress.fullName.split(' ')[0] || '',
          lastName: selectedAddress.fullName.split(' ')[1] || '',
          email: '',
          type: selectedAddress.type || '',
          no: selectedAddress.no || '',
          city: selectedAddress.city || '',
          street: selectedAddress.street || '',
          state: selectedAddress.state || '',
          zip: selectedAddress.zipCode || '',
          country: selectedAddress.country || '',
          phone: selectedAddress.number || '',
        });
      }
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      // const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE_URL}/delete/address/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.status) {
        setAddressList(addressList.filter((address) => address.id !== id));
        if (selectedAddressId === id) {
          handleAddressChange("new_address");
        }
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/confirm');
    }
  };

  const validateForm = () => {
    const { id, firstName, lastName, no, city, street, state, zip, country, phone, type } = formData;
    let newErrors = {};

    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!type) newErrors.type = 'Please select a type';
    if (isNaN(no)) newErrors.no = 'House No. must be numberic';
    if (!street) newErrors.street = 'Street is required';
    if (!city) newErrors.city = 'Please select a city';
    if (!state) newErrors.state = 'Please select a state';
    if (!zip) newErrors.zip = 'Zip code is required';
    if (!country) newErrors.country = 'Please select a country';
    if (!phone) newErrors.phone = 'Please Enter Your Number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveDefaultAddress = async () => {
    const { id, firstName, lastName, no, street, city, state, zip, country, phone, type } = formData;
    const addressId = id !== "new_address" ? id : null;

    try {
      const token = localStorage.getItem("token");
      const isNewDefault = addressId === "new_address";

      // if (isNewDefault) {
      //   await axios.patch(`${API_BASE_URL}/address`, {
      //     isDefault: false,
      //     user_Id: userId,
      //   }, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });
      // } else {
      //   const currentAddress = addressList.find(address => address.id === id);
      //   if (currentAddress && currentAddress.isDefault) {
      //     await axios.patch(`${API_BASE_URL}/address`, {
      //       isDefault: false,
      //       user_Id: userId,
      //     }, {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     });
      //   }
      // }

      const response = await axios.post(`${API_BASE_URL}/address`, {
        id,
        fullName: `${firstName} ${lastName}`,
        number: phone,
        no,
        type,
        street,
        city,
        state,
        country,
        zipCode: zip,
        isDefault: addressId === "new_address" ? true : false,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setSuccessMessage(response.data.message);
        fetchAddressData();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error saving default address:', error);
    }
  };


  const clearMessage = () => {
    setSuccessMessage('');
  };

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <div className='place-order-left'>
        <p className="title1">Select a delivery address</p>
        {addressList.length > 0 && (
          <div>
            {addressList.map((address) => (
              <div key={address.id} className="radio-container">
                <label>
                  <input type="radio" name="address" className='mr-10' value={address.id} checked={selectedAddressId === address.id} onChange={() => handleAddressChange(address.id)} />
                  <span className='font-500 pr-5'>{address.fullName}</span>
                  {` ${address.no}, ${address.street}, ${address.city}, ${address.state} - ${address.zipCode}, ${address.country}`}
                </label>
                <div>
                  <AiFillDelete className='cross1' onClick={() => handleDeleteAddress(address.id)} />
                </div>
              </div>
            ))}
            <div className="radio-container">
              <label>
                <input type="radio" name="address" className='mr-10' value="new_address" checked={selectedAddressId === "new_address"} onChange={() => handleAddressChange("new_address")} />
                <span className='font-500 pr-5'>Add new address</span>
              </label>
            </div>
          </div>
        )}
        <p className='title'>Delivery Information</p><img className="close-icon" onClick={clearMessage} src={assets.cross_icon} alt="close" />

        {successMessage && (
          <div >
            <p>{successMessage}</p>
            <img className="close-icon" onClick={clearMessage} src={assets.cross_icon} alt="close" />
          </div>
        )}
        <input type='hidden' name='id' value={formData.id} />

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
        <div className='form-group'>
          <input className='gk' type='text' name='phone' placeholder='Phone' pattern="[1-9]{1}[0-9]{9}" title="Enter 10 digit mobile number" value={formData.phone} onChange={handleChange} />
          {errors.phone && <span className='error-message'>{errors.phone}</span>}
        </div>
        <div className='form-group'>
          <select id="type" name="type" value={formData.type} onChange={handleChange}>
            <option value="type">Select Type</option>
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Office">Office</option>
          </select>
        </div>
        <div className='form-group'>
          <input className='gk' type='text' name='no' placeholder='House no.' value={formData.no} onChange={handleChange} />
          {errors.no && <span className='error-message'>{errors.no}</span>}
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
            <input className='gk' type='text' name='zip' placeholder='Zip' value={formData.zip} onChange={handleChange} />
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
        <button id='tb' type='button' onClick={() => { if (validateForm()) { saveDefaultAddress() } }}>
          {selectedAddressId === "new_address" ? "Save" : "Update"}
        </button>
      </div>
      <div className='place-order-right'>
        <div className='cart-total'>
          <div className='cart-total-details'>
            <h2>Cart Totals</h2>
            <Link to='/cart' className='editCartLinkBtn'>Edit Cart</Link>
          </div>
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
          <button type='submit' onClick={() => createRazorPayOrder(getTotalCartAmount() + 5)}>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
