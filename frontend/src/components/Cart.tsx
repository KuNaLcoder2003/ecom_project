import type React from "react";
import Navbar from "../components/Navbar";
import useCart from "../hooks/useCart";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
    const { cart, loading, error, route, handleCheckout } = useCart();
    const navigate = useNavigate();

    const totalAmount = cart?.reduce(
        (sum, item) => sum + item.price * item.qunatity,
        0
    );

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center h-[60vh]">
                    <Loader2 className="animate-spin" size={40} />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="text-center mt-20 text-red-500">
                    {error}
                </div>
            </>
        );
    }

    const handleCheckoutButton = async () => {
        if (cart?.length == 0 || !cart) {
            return
        } else {
            await handleCheckout(cart)
            if (!route) {
                return
            } else {
                navigate("/order")
            }
        }
    }

    return (
        <>
            <Navbar />

            {
                loading ? <div>Loading...</div> : <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* CART ITEMS */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h1 className="text-2xl font-semibold">Your Cart</h1>

                        {cart?.length === 0 && (
                            <p className="text-gray-500">Your cart is empty.</p>
                        )}

                        {cart?.map((item) => (
                            <div
                                key={item.cart_id}
                                className="flex items-center gap-6 border rounded-xl p-4"
                            >
                                {/* Image */}
                                <div className="w-[100px] h-[100px] rounded-lg overflow-hidden border">
                                    <img
                                        src={item.images[0]?.image_url}
                                        alt="product"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <p className="font-medium">
                                        Product ID: {item.product_id}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Quantity: {item.qunatity}
                                    </p>
                                    {
                                        item.err ? <p className="text-sm text-red-500">
                                            {item.err}
                                        </p> : null
                                    }
                                </div>

                                {/* Price */}
                                <div className="flex flex-col items-end gap-2">
                                    <p className="font-semibold">
                                        ₹ {item.price * item.qunatity}
                                    </p>
                                    <button className="text-sm text-red-500 hover:underline">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ORDER SUMMARY */}
                    <div className="border rounded-xl p-6 h-fit">
                        <h2 className="text-xl font-semibold mb-4">
                            Order Summary
                        </h2>

                        <div className="flex justify-between mb-2">
                            <p>Subtotal</p>
                            <p>₹ {totalAmount}</p>
                        </div>

                        <div className="flex justify-between mb-2">
                            <p>Shipping</p>
                            <p className="text-green-600">Free</p>
                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between text-lg font-semibold mb-6">
                            <p>Total</p>
                            <p>₹ {totalAmount}</p>
                        </div>

                        <button onClick={() => handleCheckoutButton()} className="w-full py-3 bg-black text-white rounded-lg hover:opacity-90 transition cursor-pointer">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            }
        </>
    );
};

export default Cart;
