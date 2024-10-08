import React from 'react';
import './Order.css';
import { useNavigate } from 'react-router-dom';

const Order = ({ userName }) => {
    const navigate = useNavigate();
    return (
        <div className="thank-you-container">
            <div className="thank-you-card">
                <div className="icon-container">
                    <div className="icon">
                        <span className="checkmark">✔</span>
                    </div>
                </div>
                <h2>Thank you for ordering<p>{`${userName}!`}!</p> </h2>
                <p className="description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
                <div className="button-group">
                    <button onClick={() => navigate('/cart')} className="view-order-button">
                        View Order
                    </button>
                    <button onClick={() => navigate('/')} className="continue-shopping-button">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Order;
