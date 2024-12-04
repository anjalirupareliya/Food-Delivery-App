import React, { useState } from 'react';
import './Header.css';

const Header = () => {
    const [menu, setMenu] = useState('home');

    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Order your <br /> favourite food here</h2>
                <p>Choose form a diverse menu featuring a delectable array of dishes crafted with the finest<br /> ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your<br /> dining experience.  Our delicious meal at a time.</p>
                <a href='#explore-menu' onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}><button>View menu</button></a>
            </div>
        </div>
    )
}

export default Header;