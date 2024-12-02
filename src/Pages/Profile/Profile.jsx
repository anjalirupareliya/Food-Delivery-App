import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../constants/apiconstants";
import { assets } from '../../assets/assets';
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [formData1, setFormData1] = useState({
        fullName: "",
        email: "",
        image: "",
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        fullName: '',
        no: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        number: '',
        type: '',
    });
    const [errors, setErrors] = useState({});
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
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
                    setFormData1({
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
        // setFormData1((prev) => ({ ...prev, [name]: value }));
        setFormData({ ...formData, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData1((prev) => ({ ...prev, image: file }));
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
        formDataObj.append("fullName", formData1.fullName);
        formDataObj.append("email", formData1.email);
        if (formData1.image instanceof File) {
            formDataObj.append("image", formData1.image);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/editProfile/${userData.id}`, formDataObj, config);
            if (response.data.status) {
                setUserData(response.data.user);
                setFormData1({
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

    useEffect(() => {
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

        fetchAddressData();
    }, []);

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
            setErrors({});
        } else {
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

                setErrors({});
            }
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
        const { firstName, lastName, no, street, city, state, zip, country, phone, type } = formData;
        const id = selectedAddressId !== "new_address" ? selectedAddressId : null;

        try {
            setErrorMessage('');
            setSuccessMessage('');
            const token = localStorage.getItem("token");

            const response = await axios.post(`${API_BASE_URL}/address`, {
                id,
                fullName: `${firstName} ${lastName}`,
                no,
                type,
                street,
                city,
                state,
                zipCode: zip,
                country,
                number: phone,
                isDefault: true,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status) {
                setSuccessMessage(response.data.message);
                setAddressList((prevList) => [
                    ...prevList,
                    {
                        id: response.data.address.id,
                        fullName: `${firstName} ${lastName}`,
                        no,
                        street,
                        city,
                        state,
                        zipCode: zip,
                        country,
                        number: phone,
                        isDefault: true,
                    },
                ]);
                setSelectedAddressId(response.data.address.id);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage('An error occurred while updating the address.');
        }
    };

    const handleConfirmDelete = async () => {
        setShowConfirmationPopup(false);
        if (addressToDelete) {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.delete(`${API_BASE_URL}/delete/address/${addressToDelete}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.status) {
                    setAddressList(addressList.filter((address) => address.id !== addressToDelete));
                    setdeleteMessage("Address successfully deleted.");
                    if (selectedAddressId === addressToDelete) {
                        handleAddressChange("new_address");
                    }
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                setErrorMessage("An error occurred while deleting the address.");
            }
        }
    };

    const handleSaveOrUpdate = () => {
        if (validateForm()) {
            saveDefaultAddress();
        }
    };

    const handleclearMessage = () => {
        setSuccessMessage('');
    };

    const handleerrorMessage = () => {
        setErrorMessage('');
    }

    const confirmDeleteAddress = (id) => {
        setShowConfirmationPopup(true);
        setAddressToDelete(id);
    };

    const handleCancelDelete = () => {
        setShowConfirmationPopup(false);
        setAddressToDelete(null);
    };

    return (
        <div className="profile-container">
            <div className="profile-left">
                <h1>Addresses</h1>
                <div className="address-list">
                    <p className="title2">Select a delivery address</p>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {addressList.map((address) => (
                        <div>
                            <div key={address.id} className="radio-container1">
                                <label>
                                    <input type="radio" name="address" className='Add' value={address.id} checked={selectedAddressId === address.id} onChange={() => handleAddressChange(address.id)} />
                                    <span className='font-500 pr-5'>{address.fullName}</span>
                                    {` ${address.no}, ${address.street}, ${address.city}, ${address.state} - ${address.zipCode}, ${address.country}`}
                                </label>
                                <div>
                                    <AiFillDelete className='cross1' onClick={() => confirmDeleteAddress(address.id)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="radio-container1">
                        <label>
                            <input type="radio" name="address" className='mr-10' value="new_address" checked={selectedAddressId === "new_address"} onChange={() => handleAddressChange("new_address")} />
                            <span className='font-500 pr-5'>Add new address</span>
                        </label>
                    </div>
                </div>

                <p className='title3'>Delivery Information</p>
                {successMessage && (
                    <div className='success-container'>
                        <p className='success-message'>{successMessage}</p>
                        <img src={assets.cross_icon} alt="Close" className="close-img" onClick={handleclearMessage} />
                    </div>
                )}

                {errorMessage && (
                    <div className='error-container'>
                        <p className='error-message1'>{errorMessage}</p>
                        <img src={assets.cross_icon} alt="Close" className="close-img" onClick={handleerrorMessage} />
                    </div>
                )}
                <div className='multi-fields1'>
                    <div className='form-group1 w100'>
                        <input type='text' name='firstName' placeholder='First name' value={formData.firstName} onChange={handleAddressChange} />
                        {errors.firstName && <span className='error-message'>{errors.firstName}</span>}
                    </div>

                    <div className='form-group1 w100'>
                        <input type='text' name='lastName' placeholder='Last name' value={formData.lastName} onChange={handleAddressChange} />
                        {errors.lastName && <span className='error-message'>{errors.lastName}</span>}
                    </div>
                </div>
                <div className='form-group1'>
                    <input className='gk' type='text' name='phone' placeholder='Phone' pattern="[1-9]{1}[0-9]{9}" title="Enter 10 digit mobile number" value={formData.phone} onChange={handleAddressChange} />
                    {errors.phone && <span className='error-message'>{errors.phone}</span>}
                </div>
                <div className='form-group1'>
                    <select id="type" name="type" value={formData.type} onChange={handleAddressChange}>
                        <option value="type">Select Type</option>
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Office">Office</option>
                    </select>
                </div>
                <div className='form-group1'>
                    <input className='gk' type='text' name='no' placeholder='House no.' value={formData.no} onChange={handleAddressChange} />
                    {errors.no && <span className='error-message'>{errors.no}</span>}
                </div>
                <div className='form-group1'>
                    <input className='gk' type='text' name='street' placeholder='Enter Your Street' value={formData.street} onChange={handleAddressChange} />
                    {errors.street && <span className='error-message'>{errors.street}</span>}
                </div>

                <div className='multi-fields1'>
                    <div className='form-group1 w100'>
                        <select className='gk' name='city' value={formData.city} onChange={handleAddressChange}>
                            <option value=''>Select City</option>
                            {formData.state && cities[formData.state]?.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                        {errors.city && <span className='error-message'>{errors.city}</span>}
                    </div>
                    <div className='form-group1 w100'>
                        <select className='gk' name='state' value={formData.state} onChange={handleAddressChange}>
                            <option value=''>Select State</option>
                            {states.map((state, index) => (
                                <option key={index} value={state}>{state}</option>
                            ))}
                        </select>
                        {errors.state && <span className='error-message'>{errors.state}</span>}
                    </div>
                </div>

                <div className='multi-fields1'>
                    <div className='form-group1 w100'>
                        <input className='gk' type='text' name='zip' placeholder='Zip' value={formData.zip} onChange={handleAddressChange} />
                        {errors.zip && <span className='error-message'>{errors.zip}</span>}
                    </div>

                    <div className='form-group1 w100'>
                        <select className='gk' name='country' value={formData.country} onChange={handleAddressChange}>
                            <option value=''>Select Country</option>
                            {countrys.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                        {errors.country && <span className='error-message'>{errors.country}</span>}
                    </div>
                </div>
                <button id='tb1' type='button' onClick={handleSaveOrUpdate}>
                    {selectedAddressId === "new_address" ? "Save" : "Update"}
                </button>

                {showConfirmationPopup && (
                    <div className="confirmation-popup">
                        <div className="popup-content">
                            <div className="popup-header">
                                <p>Are you sure you want to delete this address?</p>
                                <button className="close-button" onClick={handleCancelDelete}>×</button>
                            </div>
                            <div className="button-container">
                                <button onClick={handleConfirmDelete} className="confirm-button">Yes</button>
                                <button onClick={handleCancelDelete} className="cancel-button">No</button>
                            </div>
                        </div>
                    </div>
                )}
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
                            <input type="text" name="fullName" value={formData1.fullName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="email" name="email" value={formData1.email} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Profile Image</label>
                            {formData1.image && (
                                <img src={formData1.image instanceof File ? URL.createObjectURL(formData1.image) : formData1.image} className="profile-image" />
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
        </div >
    );
};

export default Profile; 