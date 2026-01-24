import type React from "react";
import { motion } from "framer-motion"
import useCart, { type Cart as CartType } from "../hooks/useCart";
import { Loader, LucideDelete, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart: React.FC<{ setCart: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setCart }) => {
    const { cart, loading, error, route, handleCheckout, cartTotal } = useCart();
    const navigate = useNavigate();

    if (error) {
        return (
            <div className="absolute inset-0 bg-black/20 flex items-center h-auto z-[9999] overflow-hidden">
                <div onClick={() => setCart(false)} className="flex-1 w-full h-full">
                </div>

                <div className="w-128 bg-white p-2 h-full flex items-center justify-center">
                    {error}
                </div>

            </div>
        )
    }

    const handleCheckoutButton = async () => {

        if (cart?.length == 0 || !cart) {
            return
        } else {
            await handleCheckout(cart)
            if (!route) {
                return
            } else {
                navigate('/order')
            }
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-60 flex items-center">
                <div onClick={() => setCart(false)} className="flex-1 w-full h-full">
                </div>
                <motion.div
                    className="bg-white w-[85%] sm:w-[380px] lg:w-128 h-full"
                    initial={{ x: 320 }}
                    whileInView={{ x: 0 }}
                    exit={{ x: -100 }}
                    transition={{ delay: 0, duration: 0.7, ease: "easeIn" }}
                >
                    {
                        loading ? <div className="flex items-center justify-center h-full w-full">
                            <Loader />
                        </div> : cart && <motion.div

                            className="w-full h-full flex flex-col items-baseline justify-between">
                            <div className="flex items-center w-full justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                    <h3 className="text-2xl font-[Interif] font-thin">Your Cart</h3>
                                    <p className="w-6 h-6 bg-black flex items-center justify-center text-white rounded-full">{cart.length}</p>
                                </div>

                                <X onClick={() => setCart(false)} className="cursor-pointer" fill="black" size={16} />
                            </div>

                            <div className="flex flex-col items-baseline gap-4 w-full h-auto overflow-scroll flex-2 mt-5">
                                {
                                    cart.map((item) => {
                                        return (
                                            <ProductEntry props={item} />
                                        )
                                    })
                                }
                            </div>

                            <div className="space-y-4 w-full p-2">
                                <div className="w-full border border-stone-100" />
                                <div className="font-[Interif] font-light flex items-center justify-between w-ful text-xl">
                                    <p className="font-lg">Cart Total</p>
                                    <p className="font-lg">$ {cartTotal}</p>
                                </div>
                                <button onClick={async () => await handleCheckoutButton()} className="w-full py-3 text-center bg-black text-white rounded-lg cursor-pointer">Checkout</button>
                            </div>


                        </motion.div>
                    }
                </motion.div>
            </div>

        </>
    );
};



const ProductEntry: React.FC<{ props: CartType }> = ({ props }) => {
    return (
        <div className="w-full p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex gap-4">


                <div className="w-24 h-28 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                    <img
                        src={props.images[0].image_url}
                        className="object-cover w-full h-full"
                    />
                </div>


                <div className="flex flex-col gap-3 w-full">


                    <div className="flex items-start justify-between">
                        <h3 className="text-lg sm:text-xl font-semibold font-[Interif] leading-tight">
                            {props.product_name}
                        </h3>

                        <button className="text-red-400 hover:text-red-600 transition-colors">
                            <LucideDelete size={18} className="cursor-pointer" />
                        </button>
                    </div>


                    <div className="flex flex-col items-baseline text-sm sm:text-base w-full">
                        <div className="flex justify-between col-span-2 sm:col-span-1 w-full">
                            <span className="text-zinc-500">Price</span>
                            <span className="font-medium">$ {props.price}</span>
                        </div>

                        <div className="flex justify-between col-span-2 sm:col-span-1 w-full">
                            <span className="text-zinc-500">Quantity</span>
                            <span className="font-medium">{props.qunatity}</span>
                        </div>
                    </div>


                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                        <span className="text-zinc-500 text-sm">Total</span>
                        <span className="text-lg font-semibold">
                            $ {props.price * props.qunatity}
                        </span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Cart;
