import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function PaymentPage() {
    const [clientSecret, setClientSecret] = useState<string>("");
    const path = useLocation();

    useEffect(() => {
        const orderId = path.pathname.split('/').at(-1);
        const token = localStorage.getItem('token') as string;
        fetch(`${BACKEND_URL}/order/payAndConfirm/${orderId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
        })
            .then(res => res.json())
            .then(data => {
                setClientSecret(data.clientSecret)
                console.log(data);
            });
    }, []);

    return (
        clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
            </Elements>
        )
    );
}
export default PaymentPage;
