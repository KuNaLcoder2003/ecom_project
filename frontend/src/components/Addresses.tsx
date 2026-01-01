import toast, { Toaster } from "react-hot-toast";
import useCart from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

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
    onSelect: (address: Address) => void;
}) => {
    const navigate = useNavigate();
    const { cart } = useCart();
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
            const response = await fetch(`${BACKEND_URL}/order/createOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                    'address_id': selectedAddress.id as string,
                    'cart_id': cart[0].cart_id as string
                },
            })
            const data = await response.json()
            if (data.order_id) {
                navigate(`/payment/${data.order_id}`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }
    return (
        <>
            <Toaster />
            <h2 className="text-2xl font-semibold mb-6">
                📍 Select Address
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((address) => {
                    const isSelected = selectedAddress?.id === address.id;

                    return (
                        <div
                            key={address.id}
                            onClick={() => onSelect(address)}
                            className={`cursor-pointer border rounded-lg p-4 transition
                ${isSelected
                                    ? "border-green-500 bg-green-50"
                                    : "hover:border-gray-400"
                                }`}
                        >
                            <p className="font-medium">
                                {address.house_no}, {address.street}
                            </p>

                            <p className="text-sm text-gray-600 mt-1">
                                {address.land_mark}, {address.city}
                            </p>

                            <p className="text-sm text-gray-600">
                                {address.state} - {address.pin_code}
                            </p>
                        </div>
                    );
                })}
            </div>

            {selectedAddress && (
                <div className="mt-6 text-right">
                    <button onClick={() => handleAddress()} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                        Confirm Address
                    </button>
                </div>
            )}
        </>
    );
};


export default AddressStep;
