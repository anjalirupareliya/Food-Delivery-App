import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../constants/apiconstants";
import { assets } from '../../assets/assets';
import { AiFillDelete } from "react-icons/ai";
import { BsEyeFill } from "react-icons/bs";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        image: "",
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                const response = await axios.get(`${API_BASE_URL}/me`, config);
                if (response.data.status) {
                    const { user, addresses, invoices } = response.data;
                    setUserData(user);
                    setAddresses(addresses || []);
                    setInvoices(invoices || []);
                    setFormData({
                        fullName: user.fullName || "",
                        email: user.email || "",
                        image: user.image || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };

        const formDataObj = new FormData();
        formDataObj.append("fullName", formData.fullName);
        formDataObj.append("email", formData.email);
        if (formData.image instanceof File) {
            formDataObj.append("image", formData.image);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/editProfile/${userData.id}`, formDataObj, config);
            if (response.data.status) {
                setUserData(response.data.user);
                setFormData({
                    fullName: response.data.user.fullName,
                    email: response.data.user.email,
                    image: response.data.user.image,
                });
                setMessage({ text: response.data.message, type: "success" });
            } else {
                setMessage({ text: response.data.message, type: "error" });
            }
        } catch (error) {
            setMessage({ text: "An error occurred. Please try again.", type: "error" });
        }
    };

    const handleViewInvoice = (invoiceId) => {
        navigate(`/invoice/${invoiceId}`);
    };

    const clearMessage = () => setMessage({});

    return (
        <div className="profile-container">
            <div className="profile-left">
                <div className="address-section">
                    <h1>Addresses</h1>
                    <ul>
                        {addresses.map((address) => (
                            <li key={address.id}>
                                <div>
                                    <input className="AllAdd" type="radio" name="selectedAddress" value={address.id} />
                                    {address.fullName}, {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}
                                </div>
                                <div><AiFillDelete className='cross1' /></div>
                            </li>
                        ))}
                        <div className="add-address">
                            <input type="radio" name="address" className='mr-10' value="new_address" />
                            <span className='font-500 pr-5'>Add new address</span>
                        </div>
                    </ul>
                    <div>
                        <p className='title'>Delivery Information</p>
                        <div className='multi-fields'>
                            <div className='form-group w100'>
                                <input type='text' name='firstName' placeholder='First name' />
                                {/* {errors.firstName && <span className='error-message'>{errors.firstName}</span>} */}
                            </div>

                            <div className='form-group w100'>
                                <input type='text' name='lastName' placeholder='Last name' />
                                {/* {errors.lastName && <span className='error-message'>{errors.lastName}</span>} */}
                            </div>
                        </div>
                        <div className='form-group'>
                            <input className='gk' type='text' name='phone' placeholder='Phone' pattern="[1-9]{1}[0-9]{9}" title="Enter 10 digit mobile number" />
                            {/* {errors.phone && <span className='error-message'></span>} */}
                        </div>
                        <div className='form-group'>
                            <select id="type" name="type" >
                                <option value="type">Select Type</option>
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Office">Office</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <input className='gk' type='text' name='no' placeholder='House no.' />
                            {/* {errors.no && <span className='error-message'></span>} */}
                        </div>
                        <div className='form-group'>
                            <input className='gk' type='text' name='street' placeholder='Enter Your Street' />
                            {/* {errors.street && <span className='error-message'></span>} */}
                        </div>

                        <div className='multi-fields'>
                            <div className='form-group w100'>
                                <select className='gk' name='city'>
                                    <option value=''>Select City</option>
                                    {/* {formData.state && cities[formData.state]?.map((city, index) => (
                                    <option key={index} value={city}>{city}</option>
                                ))} */}
                                </select>
                                {/* {errors.city && <span className='error-message'></span>} */}
                            </div>
                            <div className='form-group w100'>
                                <select className='gk' name='state' >
                                    <option value=''>Select State</option>
                                    {/* {states.map((state, index) => (
                                    <option key={index} value={state}>{state}</option>
                                ))} */}
                                </select>
                                {/* {errors.state && <span className='error-message'>{errors.state}</span>} */}
                            </div>
                        </div>

                        <div className='multi-fields'>
                            <div className='form-group w100'>
                                <input className='gk' type='text' name='zip' placeholder='Zip' />
                                {/* {errors.zip && <span className='error-message'>{errors.zip}</span>} */}
                            </div>

                            <div className='form-group w100'>
                                <select className='gk' name='country' >
                                    <option value=''>Select Country</option>
                                    {/* {countrys.map((country, index) => (
                                    <option key={index} value={country}></option>
                                ))} */}
                                </select>
                                {/* {errors.country && <span className='error-message'></span>} */}
                            </div>
                        </div>
                        <button id='tb1' type='button'>Save</button>
                    </div>
                </div>
            </div>
            <div className="profile-right">
                <h1>User Profile</h1>
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                        <img className="close-icon2" onClick={clearMessage} src={assets.cross_icon} alt="close" />
                    </div>
                )}
                <div className="profile-card">
                    <form method="post" className="profile-form" onSubmit={handleFormSubmit}>
                        <div>
                            <label>Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Profile Image</label>
                            {formData.image && (
                                <img src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image} className="profile-image" />
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        <button type="submit">Update Profile</button>
                    </form>
                </div>
                <div className="invoice-section">
                    <h1 style={{ marginTop: "50px" }}>Invoices</h1>
                    {invoices.length > 0 ? (
                        <table className="invoice-table1">
                            <thead>
                                <tr>
                                    <th>Order Date</th>
                                    <th >Total Amount</th>
                                    <th >Status</th>
                                    <th >Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id}>
                                        <td>{new Date(invoice.order_date).toLocaleString()}</td>
                                        <td>${invoice.total_amount.toFixed(2)}</td>
                                        <td>
                                            <span className={`status-badge ${invoice.status ? "" : "status-fail"}`}>
                                                {invoice.status ? "Success" : "Fail"}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "large" }}>
                                            <p className="details" onClick={() => handleViewInvoice(invoice.id)} >Details</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No invoices available.</p>
                    )}
                </div>
                {isPopupVisible && selectedInvoice && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <button className="close-popup" onClick={() => setIsPopupVisible(false)}>X</button>
                            <h2>Invoice Details</h2>
                            <p><strong>Address:</strong> {selectedInvoice.address}</p>
                            <p><strong>Order Date:</strong> {new Date(selectedInvoice.order_date).toLocaleString()}</p>
                            <p><strong>Total Amount:</strong> ${selectedInvoice.total_amount.toFixed(2)}</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile; 