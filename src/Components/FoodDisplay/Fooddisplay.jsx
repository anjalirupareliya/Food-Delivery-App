import React, { useEffect, useState, useContext } from 'react';
import './Fooddisplay.css';
import { StoreContext } from '../Context/Storecontext';
import axios from 'axios';
import Fooditem from '../FoodItems/Fooditem';
import { API_BASE_URL } from "../../constants/apiconstants";

const Fooddisplay = ({ category }) => {
    // const { food_list } = useContext(StoreContext)
    const [food_list, setFoodList] = useState([]);

    useEffect(() => {
        axios.get(API_BASE_URL + '/products')
            .then((res) => {
                if (res.data.status) {
                    setFoodList(res.data.data);
                }
            })
    }, []);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near for you</h2>
            <div className='food-display-list'>
                {food_list.map((item, index) => {
                    if (category === 'All' || category === item.category_id) {
                        return <Fooditem key={index} id={item.id} name={item.name} description={item.description} price={item.price} image={item.image} />
                    }
                })}
            </div>
        </div>
    )
}

export default Fooddisplay;