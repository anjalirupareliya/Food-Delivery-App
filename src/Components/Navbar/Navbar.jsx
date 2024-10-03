import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../Context/Storecontext';
import { BiSolidUser } from "react-icons/bi";

const Navbar = ({ setShowLogin, userName, onLogout }) => {
  const [menu, setMenu] = useState('home');
  const { cartItems } = useContext(StoreContext);

  const getCartItems = () => {
    const uniqueItem = Object.keys(cartItems).filter(id => cartItems[id] > 0);
    return uniqueItem.length;
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt='' className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>menu</a>
        <a href='#app-download' onClick={() => setMenu('mobile-app')} className={menu === 'mobile-app' ? 'active' : ''}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>contact-us</a>
      </ul>
      <div className='navbar-right'>
        <img src={assets.search_icon} alt='' />
        <div className='navbar-search-icon'>
          <Link to='/cart'><img src={assets.basket_icon} alt='' /></Link>
          <div className={getCartItems() === 0 ? "" : "dot"}>
            {getCartItems() > 0 && <span>{getCartItems()}</span>}
          </div>
        </div>
        {userName ? (
          <div className="user-info">
            <BiSolidUser className="user-icon" />
            <p>{userName}</p>
            <button onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
