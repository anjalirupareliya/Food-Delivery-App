import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

const LoginPopup = ({ setShowLogin, setUserName }) => {
    const [currState, setCurrState] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.email === email && storedUser.password === password) {
            setUserName(storedUser.name);
            setShowLogin(false);
        } else {
            alert('Invalid email or password');
        }
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        const userData = { name, email, password };
        localStorage.setItem('user', JSON.stringify(userData));
        alert('Account created successfully! You can now log in.');
        setCurrState('Login');
    };

    return (
        <div className='login-popup'>
            <form className='login-popup-container' onSubmit={currState === 'Login' ? handleLogin : handleSignUp}>
                <div className='login-popup-title'>
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt='' />
                </div>
                <div className='login-popup-inputs'>
                    {currState === 'Sign Up' && (
                        <input type='text' placeholder='Your name' value={name} onChange={(e) => setName(e.target.value)} required />
                    )}
                    <input type='email' placeholder='Your email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button>{currState === 'Sign Up' ? 'Create Account' : 'Login'}</button>
                <div className='login-popup-condition'>
                    <input type='checkbox' required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login" ? (
                    <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
