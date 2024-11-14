import React, { useEffect, useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import Footer from './Components/Footer/Footer'
import LoginPopup from './Components/LoginPopup/LoginPopup'
import Order from './Pages/OrderSuccess/Order'
import Invoice from './Pages/invoiceId/invoice'

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState('');

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUserName('');
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
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App;
