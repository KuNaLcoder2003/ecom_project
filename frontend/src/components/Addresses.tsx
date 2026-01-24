import toast, { Toaster } from "react-hot-toast";
import useCart from "../hooks/useCart";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { LoaderPinwheel } from "lucide-react";

type Address = {
    id: string;
    house_no: string;
    street: string;
    land_mark: string;
    city: string;
    state: string;
    pin_code: string;
};
const AddressStep = ({
    addresses,
    selectedAddress,
    onSelect,
}: {
    addresses: Address[];
    selectedAddress: Address | null;
    onSelect: any;
}) => {
    const { cart } = useCart();
    const [loading, setLoading] = useState<boolean>(false)
    const handleAddress = async () => {

        if (!selectedAddress) {
            toast.error("Please select one address")
            return
        }
        if (!cart) {
            toast.error("Inavlid Request")
            return
        }
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem('token') as string
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/order/createOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },
                body: JSON.stringify({
                    address_id: selectedAddress.id as string,
                    cart_id: cart[0].cart_id as string
                })
            })
            const data = await response.json()
            if (data.order_id && data.session_url) {
                const stripe = await loadStripe('pk_test_51RcKdXR48JIxDpQaaxdy5RNiUohNvfvx2lEiazKNohgp3A18SFiRYHbhcHp87idSOX7ui3SQgRsQdNGUOuXEgUbY00RHbl0TSd')
                if (!stripe) {
                    toast.error("Stripe failed to load");
                    return;
                }
                setLoading(false);
                window.location.href = data.session_url;
            } else {
                toast.error(data.message);
                setLoading(false);
            }
        } catch (error) {
            toast.error("Something went wrong")
            setLoading(false);
        }
    }
    return (
        <>
            <Toaster />
            {
                loading ? <div className="w-screen h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h3 className="text-3xl font-semibold font-[Interif] text-center">Please wait we're setting up payment</h3>
                        <LoaderPinwheel />
                    </div>
                </div> : <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">

                    <h2 className="text-2xl font-semibold font-[Interif]">
                        Select Delivery Address
                    </h2>

                    <div className="space-y-4">
                        {addresses.map((addr: any) => {
                            const active = selectedAddress?.id === addr.id
                            return (
                                <div
                                    key={addr.id}
                                    onClick={() => onSelect(addr)}
                                    className={`p-4 rounded-xl cursor-pointer border transition
                            ${active ? "border-black bg-zinc-50" : "border-stone-100 hover:border-zinc-300"}`}
                                >
                                    <p className="font-medium">
                                        {addr.house_no}, {addr.street}
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        {addr.city}, {addr.state} - {addr.pin_code}
                                    </p>
                                </div>
                            )
                        })}
                    </div>

                    <button
                        onClick={async () => await handleAddress()}
                        disabled={!selectedAddress}
                        className={`w-full py-3 rounded-xl transition
                ${selectedAddress
                                ? "bg-black text-white"
                                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"}`}
                    >
                        Place Order
                    </button>
                </div>
            }
        </>
    );
};


export default AddressStep;
