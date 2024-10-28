import { BASE_URL, RAZORPAY_KEY_ID } from "../../constants/apiconstants";


// load script for razorpay
export const loadScript = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => reject(false);
        document.body.appendChild(script);
    });
};


// Take all data and pass the data in backend
export const createRazorPayOrder = async (amount) => {
    const data = {
        amount: amount * 100,
        currency: "INR",
    };

    try {
        const response = await fetch(`${BASE_URL}/checkout`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        handleRazorpayScreen(responseData.order_id, amount);
    } catch (error) {
        console.error("Error during payment order creation:", error);
    }
};


// Opens the payment screen and send data in backend
const handleRazorpayScreen = async (order_id, amount) => {
    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Razorpay SDK failed to load. Check your internet connection.");
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: amount * 100,
            currency: 'INR',
            name: 'Tomato',
            description: 'Payment to Tomato',
            order_id,
            handler: async function (response) {
                await fetch(`${BASE_URL}/payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(response),
                });
            },
            theme: {
                color: "#ff6347",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    } catch (error) {
        console.error("Error initializing Razorpay:", error);
    }
};