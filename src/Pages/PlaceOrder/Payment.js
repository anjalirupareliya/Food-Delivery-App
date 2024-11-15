import { BASE_URL, RAZORPAY_KEY_ID } from "../../constants/apiconstants";

// load script for razorpay
export const loadScript = (url) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = () => resolve(true);
        script.onerror = () => reject(false);
        document.body.appendChild(script);
    });
};

// Take all data and pass the data in backend
export const createRazorPayOrder = async (amount, cartItems, addressId) => {
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

        handleRazorpayScreen(responseData.order_id, amount, cartItems, addressId);
    } catch (error) {
        console.error("Error during payment order creation:", error);
    }
};

// Opens the payment screen and sends data to backend
const handleRazorpayScreen = async (order_id, amount, cartItems, addressId) => {
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
            cartItems: cartItems,
            name: 'Tomato',
            description: 'Payment to Tomato',
            order_id,
            handler: async function (response) {
                const razorpayData = {
                    payment_id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                    cartItems,  // Pass cartItems here
                    address_id: addressId,
                };
                await fetch(`${BASE_URL}/payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(razorpayData),
                }).then(response => response.json())
                    .then(response => {
                        if (response.status) {
                            window.location.href = `/confirm?invoiceId=${response.invoiceId}`;
                        } else {
                            alert("Payment verification failed. Please try again.");
                        }
                    })
                    .catch(err => 'Payment error: ' + console.error(err));
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