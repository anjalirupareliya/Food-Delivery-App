import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder';
import Footer from './Components/Footer/Footer';
import LoginPopup from './Components/LoginPopup/LoginPopup';
import Order from './Pages/OrderSuccess/Order';
import Invoice from './Pages/invoiceId/invoice';
import Profile from './Pages/Profile/Profile';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    let pageTitle = 'Food Delivery';

    if (path === '/cart') {
      pageTitle = 'Food Delivery - Cart';
    } else if (path === '/') {
      pageTitle = 'Food Delivery - Home';
    } else if (path === '/order') {
      pageTitle = 'Food Delivery - Place Order';
    } else if (path === '/confirm') {
      pageTitle = 'Food Delivery - Order Confirmation';
    } else if (path === '/profile') {
      pageTitle = 'Food Delivery - Profile';
    } else if (path.includes('/invoice')) {
      pageTitle = `Food Delivery - Invoice ${id ? `#${id}` : ''}`;
    } else {
      pageTitle = 'Food Delivery';
    }

    document.title = pageTitle;
  }, [location]);

  const checkUserAuth = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUserName(storedUser.fullname);
    } else {
      setUserName('');
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  useEffect(() => {
    if (!userName && location.pathname !== '/') {
      navigate('/');
    }
  }, [userName, location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUserName('');
    navigate('/');
  };

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} setUserName={setUserName} />}
      <div className='App'>
        <Navbar setShowLogin={setShowLogin} userName={userName} onLogout={handleLogout} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart userName={userName} setShowLogin={setShowLogin} />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/confirm' element={<Order userName={userName} />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
