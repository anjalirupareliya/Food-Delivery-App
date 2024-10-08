import React, { useRef } from 'react';
import './Exploremenu.css';
import { menu_list } from '../../assets/assets';

const Exploremenu = ({ category, setCategory }) => {
    const menuListRef = useRef(null);

    const scrollRight = () => {
        menuListRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    };

    const scrollLeft = () => {
        menuListRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Explore our menu</h1>
            <p className='explore-menu-text'>
                Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience.
            </p>
            <div className='explore-menu-container'>
                <button className='scroll-button left' onClick={scrollLeft}>
                    &#8249;
                </button>

                <div className='explore-menu-list' ref={menuListRef}>
                    {menu_list.map((item, index) => (
                        <div
                            onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)} key={index} className='explore-menu-list-item'>
                            <img className={category === item.menu_name ? 'active' : ''} src={item.menu_image} alt={item.menu_name} />
                            <p>{item.menu_name}</p>
                        </div>
                    ))}
                </div>
                <button className='scroll-button right' onClick={scrollRight}> &#8250; </button>
            </div>
            <hr />
        </div>
    );
};

export default Exploremenu;
