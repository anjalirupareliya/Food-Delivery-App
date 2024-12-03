import React, { useEffect, useState } from 'react';
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
                <h1 className="Icon1">Order Invoice</h1>
                {paymentStatus !== null && (
                    <p className={paymentStatus ? 'payment-success' : 'payment-failure'}>
                        {paymentStatus ? 'Success' : 'Failed'}
                    </p>)}
                <ul className='Date'>
                    <li className='order OrderDate'>
                        <strong>Order Date:</strong>{' '}
                        {invoice.order_date && (() => {
                            const date = new Date(invoice.order_date);

                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = String(date.getFullYear()).slice(-2);

                            const hours = date.getHours();
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            const ampm = hours >= 12 ? 'PM' : 'AM';
                            const hour12 = hours % 12 || 12;

                            return `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`;
                        })()}
                    </li>
                    <li className='order InvoiceID'><strong>Invoice ID: </strong>#{invoice.id}</li>
                </ul>
                {error && <p className="error1">{error}</p>}
                <div className="address-container">
                    <h2>Shipping Address</h2>
                    <div>
                        <p className='address'>{address.fullName}</p>
                        <p className='address'> +91  {address.number}</p>
                        <p className='add'>{address.address}</p>
                    </div>
                </div>
                {invoice && (
                    <>
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
                                            <td className="img-contanier">
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
                        <div className="payment-summary-container">
                            <div className="payment-box">
                                <p className="lead">Payment Methods:</p>
                                <div className="payment-icons">
                                    <img className='payment' src="https://w7.pngwing.com/pngs/667/172/png-transparent-logo-brand-visa-font-visa-blue-text-trademark-thumbnail.png" alt="Visa" />
                                    <img className='payment' src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/MasterCard-Logo.svg/2560px-MasterCard-Logo.svg.png" alt="Mastercard" />
                                    <img className='payment' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKXPN5n9zXmWG6mjYxilOMCu9lK8A74gqv3g&s" alt="American Express" />
                                    <img className='payment' src="https://icon2.cleanpng.com/20180810/ywr/d524e77dd45f2e6cbd2f72103119b8bf.webp" alt="Paypal" />
                                </div>
                                <p className="payment-description">
                                    Etsy doostang zoodles disqus groupon greplin oooj voxy zoodles, weebly ning heekya handango imeem
                                    plugg dopplr jibjab, movity jajah plickers sifteo edmodo ifttt zimbra.
                                </p>
                            </div>
                            <ul className='AllTotal'>
                                <li className="order1 Subtotal"><strong>Sub Total:</strong> ${subtotal.toFixed(2)}</li>
                                <li className="order1"><strong>Delivery Fee:</strong> ${deliveryFee.toFixed(2)}</li>
                                <li className="order1"><strong>Discount:</strong> ${discount.toFixed(2)}</li>
                                <li className="order1 Total"><strong>Total Amount:</strong> ${invoice.total_amount}</li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};

export default Invoice;