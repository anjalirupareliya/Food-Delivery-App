import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../constants/apiconstants";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCartItems = localStorage.getItem("cartItems");
        return savedCartItems ? JSON.parse(savedCartItems) : {};
    });
    const [foodList, setFoodList] = useState([]);

    useEffect(() => {
        axios.get(API_BASE_URL + '/products')
            .then((res) => {
                if (res.data.status) {
                    setFoodList(res.data.data); 
                }
            }).catch(error => {
                console.error("Failed to fetch products:", error);
            });
    }, []);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (itemId) => {
        setCartItems((prev) => {
            const newCartItems = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
            localStorage.setItem("cartItems", JSON.stringify(newCartItems));
            return newCartItems;
        });
    };

    const removeFromCart = (itemId, removeAll = false) => {
        setCartItems((prev) => {
            if (removeAll || prev[itemId] <= 1) {
                const updatedCart = { ...prev };
                delete updatedCart[itemId];
                localStorage.setItem("cartItems", JSON.stringify(updatedCart));
                return updatedCart;
            } else {
                const updatedCart = { ...prev, [itemId]: prev[itemId] - 1 };
                localStorage.setItem("cartItems", JSON.stringify(updatedCart));
                return updatedCart;
            }
        });
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        if (foodList.length > 0 && Object.keys(cartItems).length > 0) {
            for (const itemId in cartItems) {
                if (cartItems[itemId] > 0) {
                    const itemInfo = foodList.find((product) => product.id === parseInt(itemId));
                    if (itemInfo) {
                        totalAmount += itemInfo.price * cartItems[itemId]; 
                    }
                }
            }
        }
        return totalAmount;
    };

    const contextValue = {
        foodList, 
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider; 