import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { API_BASE_URL } from "../../constants/apiconstants";
import { assets } from '../../assets/assets';

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        image: "",
    });
    const [message, setMessage] = useState({ text: "", type: "" });

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
                setMessage({ text: response.data.message || "Profile update failed.", type: "error" });
            }
        } catch (error) {
            setMessage({ text: "An error occurred. Please try again.", type: "error" });
            console.error("Error updating profile:", error);
        }
    };

    const clearMessage = () => setMessage({});

    return (
        <div className="profile-container">
            <div className="profile-left">
                <div className="address-section">
                    <h2>Select an Address:</h2>
                    <ul>
                        {addresses.map((address) => (
                            <li key={address.id}>
                                <div>
                                    <input type="radio" name="selectedAddress" value={address.id} />
                                    {address.fullName}, {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="invoice-section">
                    <h2>Invoices</h2>
                    <ul>
                        {invoices.map((invoice) => (
                            <li key={invoice.id}>Invoice #{invoice.id}</li>
                        ))}
                    </ul>
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
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Profile Image</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        <button type="submit">Update Profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
