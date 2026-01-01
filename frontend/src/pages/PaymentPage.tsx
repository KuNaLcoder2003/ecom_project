import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useEffect, useState } from "react";
const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

function CheckoutPage({ orderId }: any) {
    const [clientSecret, setClientSecret] = useState<string>("");

    useEffect(() => {
        fetch(`/payAndConfirm/${orderId}`, { method: "POST" })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));
    }, []);

    return (
        clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
            </Elements>
        )
    );
}
export default CheckoutPage;
