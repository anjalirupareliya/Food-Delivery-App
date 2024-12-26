import React, { useEffect, useState, useRef } from 'react';
import './ExploreMenu.css';
import axios from 'axios';
import { API_BASE_URL } from "../../constants/apiconstants";

const Exploremenu = ({ category, setCategory }) => {
    const menuListRef = useRef(null);
    const [menu_list, setMenuList] = useState([]);

    useEffect(() => {
        axios.get(API_BASE_URL + '/category')
            .then((res) => {
                if (res.data.status) {
                    setMenuList(res.data.data);
                }
            })
    }, []);

    const scrollRight = () => {
        menuListRef.current.scroll({ left: 200, behavior: 'smooth' });
    };

    const scrollLeft = () => {
        menuListRef.current.scroll({ left: -200, behavior: 'smooth' });
    };

    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Explore our menu</h1>
            <p className='explore-menu-text'>
                Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience.</p>
            <div className='explore-menu-container'>
                <button className='scroll-button left' onClick={scrollLeft}>&#8249;</button>

                <div className='explore-menu-list' ref={menuListRef}>
                    {menu_list.map((item, index) => (
                        <div onClick={() => setCategory(prev => prev === item.id ? 'All' : item.id)} key={index} className='explore-menu-list-item'>
                            <img className={category === item.id ? 'active' : ''} src={item.menu_image} alt={item.id} />
                            <p>{item.menu_name}</p>
                        </div>
                    ))}
                </div>
                <button className='scroll-button right' onClick={scrollRight}>&#8250;</button>
            </div>
            <hr />
        </div>
    );
};

export default Exploremenu;