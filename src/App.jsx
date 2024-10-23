import React, { useEffect, useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import Footer from './Components/Footer/Footer'
import LoginPopup from './Components/LoginPopup/LoginPopup'
import Order from './Pages/OrderSuccess/Order'

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserName(storedUser.fullname);
    }
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
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App;
