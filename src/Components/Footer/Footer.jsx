import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className='footer-content'>
                <div className='footer-content-left'>
                    <img src={assets.logo} alt='' />
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique numquam iste aliquid facilis voluptas reprehenderit atque laborum totam ullam quis ab repellat ipsam, optio praesentium, soluta doloremque? Libero, impedit nisi.</p>
                    <div className='footer-social-icons'>
                        <a href='https://www.facebook.com' target='_blank' rel='noopener noreferrer'>
                            <img src={assets.facebook_icon} alt='Facebook' />
                        </a>
                        <a href='https://www.twitter.com' target='_blank' rel='noopener noreferrer'>
                            <img src={assets.twitter_icon} alt='Twitter' />
                        </a>
                        <a href='https://www.linkedin.com' target='_blank' rel='noopener noreferrer'>
                            <img src={assets.linkedin_icon} alt='LinkedIn' />
                        </a>
                    </div>
                </div>
                <div className='footer-content-center'>
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className='footer-content-right'>
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+1-212-453-5635</li>
                        <li>contact@tomato.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className='footer-copyright'>Copyright 2024 Ⓒ Tomato.com - All Rights Reserved.</p>
        </div>
    )
}

export default Footer;