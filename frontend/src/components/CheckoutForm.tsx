import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-processing`
            }
        });

        if (error) {
            console.error(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button type="submit">Pay</button>
        </form>
    );
}
export default CheckoutForm;
