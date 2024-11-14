import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from "../../constants/apiconstants"
import { StoreContext } from '../../Components/Context/Storecontext';

const Invoice = () => {
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({});
    const { id } = useParams();
    const { food_list, cartItems } = useContext(StoreContext);

    useEffect(() => {
        const fetchInvoices = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                axios.get(API_BASE_URL + `/invoice/${id}`, config)
                    .then((res) => {
                        if (res.status) {
                            setInvoice(res.data.invoice.invoice);
                        }
                    })
            } catch (err) {
                setError('An error occurred while fetching invoices.');
            }
        };
        fetchInvoices();
    }, [id]);

    return (
        <div className="thank-you-container">
            <div className="thank-you-card">
                {error && <p className="error">{error}</p>}
                <h1 className="Icon1">
                    Your Order <span className="status-icon">✔</span>
                </h1>
                <ul>
                    <li><strong >Invoice ID:</strong> {invoice.id}</li>
                    <li><strong>User ID:</strong> {invoice.user_id}</li>
                    <li><strong>Transaction ID:</strong> {invoice.transaction_id}</li>
                    <li><strong>Discount ID:</strong> {invoice.discount_id ? invoice.discount_id : "N/A"}</li>
                    <li><strong>Order Date:</strong> {invoice.order_date}</li>
                    <li><strong>Total Amount:</strong> {invoice.total_amount}</li>
                </ul>
                {/* <ul>
                    {Object.keys(cartItems).length > 0 ? (
                        food_list.filter(item => cartItems[item._id] > 0)
                            .map(item => (
                                <li key={item._id}>
                                    <strong>{item.name}</strong> - {cartItems[item._id]} x ${item.price} = ${cartItems[item._id] * item.price}
                                </li>
                            ))
                    ) : (
                        <li>No items in this order.</li>
                    )}
                </ul> */}
                {/* 
                <div className="invoice-items">
                    <h2>Ordered Items</h2>
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Items</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {food_list
                                .filter(item => cartItems[item._id] > 0)
                                .map(item => (
                                    <tr key={item._id}>
                                        <td>
                                            <img src={item.image} alt={item.name} className="item-image" />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>${item.price}</td>
                                        <td>{cartItems[item._id]}</td>
                                        <td>${(cartItems[item._id] * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div> */}

            </div>
        </div>
    );
};

export default Invoice;