import React, { useContext, useState } from 'react';
import './Fooditem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../Context/Storecontext';

const Fooditem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
    const [showNotification, setShowNotification] = useState(false);
    const [addedItemName, setAddedItemName] = useState('');

    const handleAddToCart = (id, name) => {
        addToCart(id);
        setAddedItemName(name);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 2000);
    };

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={image} alt='' />
                {!cartItems[id] ? (
                    <img className='add' onClick={() => handleAddToCart(id, name)} src={assets.add_icon_white} alt='' />
                ) : (
                    <div className='food-item-counter'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt='' />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => handleAddToCart(id, name)} src={assets.add_icon_green} alt='' />
                    </div>
                )}
            </div>
            <div className='food-item-info'>
                <div className='food-item-name-rating'>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt='' />
                </div>
                <p className='food-item-desc'>{description}</p>
                <p className='food-item-price'>${price}</p>
            </div>

            {showNotification && <div className='notification'>{addedItemName} added to cart!</div>}
        </div>
    );
};

export default Fooditem;
