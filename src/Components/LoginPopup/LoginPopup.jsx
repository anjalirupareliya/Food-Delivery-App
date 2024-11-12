import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { API_BASE_URL } from "../../constants/apiconstants";
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

    const [passwordType, setPasswordType] = useState('password');
    const [passwordIcon, setPasswordIcon] = useState(eyeOff);

    const [confirmPasswordType, setConfirmPasswordType] = useState('password');
    const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(eyeOff);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [nameError, setNameError] = useState('');
    const [checkboxError, setCheckboxError] = useState('');

    const togglePassword = () => {
        if (passwordType === 'password') {
            setPasswordIcon(eye);
            setPasswordType('text');
        } else {
            setPasswordIcon(eyeOff);
            setPasswordType('password');
        }
    };

    const toggleConfirmPassword = () => {
        if (confirmPasswordType === 'password') {
            setConfirmPasswordIcon(eye);
            setConfirmPasswordType('text');
        } else {
            setConfirmPasswordIcon(eyeOff);
            setConfirmPasswordType('password');
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

    const handleLogin = async (e) => {
        e.preventDefault();

        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            try {
                const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
                if (response.data.status) {

                    const { fullName, email, image } = response.data.data;
                    const user = { fullname: fullName, email: email, image: image };

                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('token', response.data.token);

                    setUserName(user.fullname);
                    setShowLogin(false);
                } else {
                    setErrors({ type: 'error', message1: response.data.message[0].msg });
                }
            } catch (error) {
                setErrors({ type: 'error', message1: 'Something went wrong. Please try again later.' });
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
                    if (response.data.status) {
                        setErrors({ type: 'success', message: response.data.message });
                    } else {
                        setCurrState('Login');
                        setErrors({ type: 'error', message1: response.data.message[0].msg });
                    }
                });
        }
    };
    const clearMessage = () => setErrors({});

    return (
        <div className='login-popup'>
            <form className='login-popup-container' onSubmit={currState === 'Login' ? handleLogin : handleSignUp}>
                <div className='login-popup-title'>
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt='' />
                </div>

                {errors.type && (
                    <div className={`alert alert-${errors.type}`}>
                        {errors.type === 'error' ? errors.message1 : errors.message}
                        <img className="close-icon" onClick={clearMessage} src={assets.cross_icon} alt="close" />
                    </div>
                )}

                <div className='login-popup-inputs'>
                    {currState === 'Sign Up' && (
                        <>
                            <input type='text' placeholder='Your name' value={fullname} onChange={(e) => setName(e.target.value)} onBlur={validateName} />
                            {nameError && <p className="error-message">{nameError}</p>}
                        </>
                    )}

                    <input type='email' placeholder='Your email' value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} />
                    {emailError && <p className="error-message">{emailError}</p>}

                    <div className='password-wrapper'>
                        <input type={passwordType} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} />
                        <span className="icon-toggle" onClick={togglePassword}> <Icon icon={passwordIcon} size={18} /></span>
                    </div>
                    {passwordError && <p className="error-message">{passwordError}</p>}

                    {currState === 'Sign Up' && (
                        <>
                            <div className='password-wrapper'>
                                <input type={confirmPasswordType} placeholder='Confirm Password' value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={validateConfirmPassword} />
                                <span className="icon-toggle" onClick={toggleConfirmPassword}><Icon icon={confirmPasswordIcon} size={18} /></span>
                            </div>
                            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                        </>
                    )}
                </div>

                <button type='submit'>
                    {currState === 'Sign Up' ? 'Create Account' : 'Login'}
                </button>

                {currState === "Sign Up" && (
                    <div className='login-popup-condition'>
                        <input type='checkbox' checked={checkboxChecked} onChange={(e) => setCheckboxChecked(e.target.checked)} onBlur={validateCheckbox} />
                        <p className='agree'>By continuing, I agree to the terms of use & privacy policy.</p>
                        {checkboxError && <p className="error-message">{checkboxError}</p>}
                    </div>
                )}

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
