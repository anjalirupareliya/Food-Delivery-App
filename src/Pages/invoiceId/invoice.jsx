import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './invoice.css';
import axios from 'axios';
import { API_BASE_URL } from "../../constants/apiconstants"

const Invoice = () => {
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({});
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [address, setAddress] = useState({});
    const { id } = useParams();

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
                        debugger
                        if (res.status) {
                            setInvoice(res.data.invoice);
                            setInvoiceDetails(res.data.invoice.invoiceDetails);
                            setPaymentStatus(res.data.invoice.status);
                            setAddress(res.data.invoice.address);
                        } else {
                            setError('Invoice not found.');
                        }
                    })
            } catch (err) {
                setError('An error occurred while fetching invoices.');
            }
        };
        fetchInvoices();
    }, [id]);


    const subtotal = invoiceDetails.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    let deliveryFee = 5;
    const discount = 0;

    const totalAmount = subtotal + deliveryFee - discount;

    return (
        <div className="invoice-container">
            <div className="invoice-card">
                <h1 className="Icon1">Your Order <span className="status-icon">✔</span>  </h1>
                {paymentStatus !== null && (
                    <p className={paymentStatus ? 'payment-success' : 'payment-failure'}>
                        {paymentStatus ? 'Success' : 'Failed'}
                    </p>)}
                {error && <p className="error1">{error}</p>}
                {invoice && (
                    <>
                        <ul>
                            <li>
                                <strong>Order Date:</strong>{' '}
                                {invoice.order_date && (() => {
                                    const date = new Date(invoice.order_date);
                                    const time = date.toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        second: 'numeric',
                                        hour12: true,
                                    });
                                    const formattedDate = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}, ${date.getFullYear()}`;
                                    return `${time} at ${formattedDate}`;
                                })()}
                            </li>
                            <li ><strong>Invoice ID:</strong>#{invoice.id}</li>
                        </ul>
                        {address && (
                            <div className="address-container">
                                <h2>Shipping Address</h2>
                                <p><strong>{address.name}</strong></p>
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} {address.zip}</p>
                                <p>{address.country}</p>
                            </div>
                        )}
                        <div className="table-container">
                            <table className="invoice-table">
                                <thead>
                                    <tr>
                                        <th>Items</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceDetails.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                                                <img src={item.product.image} alt={item.product.name} className="item-image" />
                                                <p>{item.product.name}</p>
                                            </td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>{item.qty}</td>
                                            <td>${(item.qty * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <ul>
                            <li style={{ marginTop: "-30px" }}><strong>Sub Total:</strong> ${subtotal.toFixed(2)}</li>
                            <li><strong>Delivery Fee:</strong> ${deliveryFee.toFixed(2)}</li>
                            <li><strong>Discount:</strong> ${discount.toFixed(2)}</li>
                            <li><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</li>
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default Invoice;  