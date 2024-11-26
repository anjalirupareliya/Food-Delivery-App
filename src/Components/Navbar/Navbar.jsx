import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../Context/Storecontext';
import { BiSolidUser } from "react-icons/bi";
import { FaArrowUp } from "react-icons/fa6";

const Navbar = ({ setShowLogin, userName, onLogout }) => {
  const [menu, setMenu] = useState('home');
  const { cartItems } = useContext(StoreContext);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showArrow, setShowArrow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [Image, setImage] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.image) {
      setImage(userData.image);
    }
  }, []);

  const getCartItems = () => {
    const uniqueItem = Object.keys(cartItems).filter(id => cartItems[id] > 0);
    return uniqueItem.length;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setShowArrow(currentScrollY > window.innerHeight * 0.1);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showNavbar && (
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
              <Link to='/cart'><img src={assets.basket_icon} alt='' />
              </Link>
              <div className={getCartItems() === 0 ? "" : "dot"}>
                {getCartItems() > 0 && <span>{getCartItems()}</span>}
              </div>
            </div>
            {userName ? (
              <div className="user-info">
                {Image ? (
                  <Link to="/profile">
                    <img src={Image} alt="User" className="user-icon user-image" /></Link>
                ) : (
                  <BiSolidUser className="user-icon" />
                )}
                <Link to="/profile"><p>{userName}</p></Link>
                <button onClick={onLogout}>Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)}>Sign in</button>
            )}
          </div>
        </div>
      )}

      {showArrow && (
        <div className="scroll-to-top-arrow" onClick={scrollToTop}>
          <FaArrowUp size={25} />
        </div>
      )}
    </>
  );
};

export default Navbar;
