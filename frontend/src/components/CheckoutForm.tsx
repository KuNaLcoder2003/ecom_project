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
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6"
        >
            {/* Stripe Payment UI */}
            <div className="border rounded-lg p-4">
                <PaymentElement />
            </div>

            {/* Pay Button */}
            <button
                type="submit"
                disabled={!stripe}
                className="
      w-full py-3 rounded-lg font-semibold text-white
      bg-black hover:bg-gray-800 transition
      disabled:opacity-50 disabled:cursor-not-allowed
    "
            >
                Pay Now
            </button>

            {/* Small trust text */}
            <p className="text-xs text-center text-gray-500">
                Your payment is securely processed by Stripe
            </p>
        </form>

    );
}
export default CheckoutForm;
