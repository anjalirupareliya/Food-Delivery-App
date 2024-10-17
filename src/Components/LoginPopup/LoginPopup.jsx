import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

const LoginPopup = ({ setShowLogin, setUserName }) => {
    const [currState, setCurrState] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');

    const validateEmail = () => {
        if (!email) {
            setEmailError('Email is required');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is not valid');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('Password is required');
            return false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const validateName = () => {
        if (currState === 'Sign Up' && !name) {
            setNameError('Name is required');
            return false;
        }
        setNameError('');
        return true;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser.email === email && storedUser.password === password) {
                setUserName(storedUser.name);
                setShowLogin(false);
            } else {
                setPasswordError('Invalid email or password');
            }
        }
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isNameValid = validateName();

        if (isEmailValid && isPasswordValid && isNameValid) {
            const userData = { name, email, password };
            localStorage.setItem('user', JSON.stringify(userData));
            alert('Account created successfully!');
            setCurrState('Login');
        }
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
                        <>
                            <input type='text' placeholder='Your name' value={name} onChange={(e) => setName(e.target.value)} onBlur={validateName} />
                            {nameError && <p className="error-message">{nameError}</p>}
                        </>
                    )}

                    <input type='email' placeholder='Your email' value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} />
                    {emailError && <p className="error-message">{emailError}</p>}

                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                </div>

                <button type='submit'>
                    {currState === 'Sign Up' ? 'Create Account' : 'Login'}
                </button>
                <div className='login-popup-condition'>
                    <input type='checkbox' />
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
