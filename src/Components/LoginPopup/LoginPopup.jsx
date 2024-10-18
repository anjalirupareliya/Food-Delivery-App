import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { API_BASE_URL } from "../../constants/apiconstants"
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { Icon } from 'react-icons-kit';
import { eye } from 'react-icons-kit/feather/eye'

const LoginPopup = ({ setShowLogin, setUserName }) => {
    const [currState, setCurrState] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [fullname, setName] = useState('');
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [errors, setErrors] = useState({});
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const [istype, setIsType] = useState('password');
    const [isicon, setIsIcon] = useState(eyeOff);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [nameError, setNameError] = useState('');
    const [checkboxError, setCheckboxError] = useState('');

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text')
        } else {
            setIcon(eyeOff)
            setType('password')
        }
    }

    const handleToggle1 = () => {
        if (istype === 'password') {
            setIsIcon(eye);
            setIsType('text')
        } else {
            setIsIcon(eyeOff);
            setIsType('password')
        }
    }

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

    const validateConfirmPassword = () => {
        if (confirmpassword !== password) {
            setConfirmPasswordError('Passwords do not match');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };


    const validateName = () => {
        if (!fullname) {
            setNameError('Name is required');
            return false;
        } else if (!/^[a-zA-Z]+$/.test(fullname)) {
            setNameError('Please enter a valid name (only letters).');
            return false;
        }
        setNameError('');
        return true;
    };

    const validateCheckbox = () => {
        if (!checkboxChecked) {
            setCheckboxError('You must agree to the terms and conditions');
            return false;
        }
        setCheckboxError('');
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
        const isConfirmPasswordValid = validateConfirmPassword();
        const isCheckboxValid = validateCheckbox();

        if (isEmailValid && isPasswordValid && isConfirmPasswordValid && isNameValid && isCheckboxValid) {
            const payload = {
                fullname,
                email,
                password,
                confirmpassword
            };

            axios.post(API_BASE_URL + '/register', payload)
                .then(response => {
                    debugger
                    if (response.data.status) {
                        setErrors({ message: response.data.message })
                    } else {
                        setErrors({ message1: response.data.message });
                    }
                })
                .catch(error => {
                    console.error('There was an error registering!', error);
                    setErrors({ message1: e.response.data })
                });
        }

    };


    return (
        <div className='login-popup'>
            <form className='login-popup-container' onSubmit={currState === 'Login' ? handleLogin : handleSignUp}>
                <div className='login-popup-title'>
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt='' />
                </div>
                {errors.message1 ? (
                    <div className="alert alert-danger">{errors.message1}</div>
                ) : null}

                {errors.message ? (
                    <div className="alert alert-success">{errors.message}</div>
                ) : null}
                <div className='login-popup-inputs'>
                    {currState === 'Sign Up' && (
                        <>
                            <input type='text' placeholder='Your name' value={fullname} onChange={(e) => setName(e.target.value)} onBlur={validateName} />
                            {nameError && <p className="error-message">{nameError}</p>}
                        </>
                    )}

                    <input type='email' placeholder='Your email' value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} />
                    {emailError && <p className="error-message">{emailError}</p>}

                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} />
                    {passwordError && <p className="error-message">{passwordError}</p>}

                    {currState === 'Sign Up' && (
                        <>
                            <div>
                                <input type={type} placeholder='Confirm Password' value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={validateConfirmPassword} />
                                <span onClick={handleToggle1}><Icon icon={isicon} size={18} /></span>
                                {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                            </div>
                        </>
                    )}
                </div>

                <button type='submit'>
                    {currState === 'Sign Up' ? 'Create Account' : 'Login'}
                </button>

                <div className='login-popup-condition'>
                    <input
                        type='checkbox'
                        checked={checkboxChecked}
                        onChange={(e) => setCheckboxChecked(e.target.checked)}
                        onBlur={validateCheckbox}
                    />
                    <p className='agree'>By continuing, I agree to the terms of use & privacy policy.</p>
                    {checkboxError && <p className="error-message">{checkboxError}</p>}
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
