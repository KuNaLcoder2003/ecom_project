import React, { useState } from "react";
import ProductStep from "../components/ProductStep";
import AddressStep from "../components/Addresses";
import useAddress from "../hooks/useAddress";
import useDetails from "../hooks/useDetails";
import { LoaderCircle } from "lucide-react";
import Navbar from "../components/Navbar";

type ProductImage = {
    id: string;
    product_id: string;
    image_url: string;
};

type Product = {
    id: string;
    product_name: string;
    product_description: string;
    images: ProductImage[];
    qunatity: number;
    price: number;
};

type Address = {
    id: string;
    house_no: string;
    street: string;
    land_mark: string;
    city: string;
    state: string;
    pin_code: string;
};



type Props = {
    products: Product[];
    addresses: Address[];
};

const CheckoutPage = ({ products, addresses }: Props) => {
    const [step, setStep] = useState<1 | 2>(1)
    const [selectedAddress, setSelectedAddress] = useState(null)

    return (
        <CheckoutLayout>
            <CheckoutSteps step={step} />

            {step === 1 && (
                <ProductStep
                    products={products}
                    onNext={() => setStep(2)}
                />
            )}

            {step === 2 && (
                <AddressStep
                    addresses={addresses}
                    selectedAddress={selectedAddress}
                    onSelect={setSelectedAddress}
                />
            )}
        </CheckoutLayout>
    )
}




const CheckOut: React.FC = () => {
    const { address } = useAddress()
    const { products, loading } = useDetails()
    return (
        // <CheckoutPage />
        <>
            <Navbar word="" />
            {
                loading ? <LoaderCircle /> : <CheckoutPage addresses={address} products={products} />
            }
        </>
    )
}

const CheckoutLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="mt-20 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">
                {children}
            </div>
        </div>
    )
}

const CheckoutSteps = ({ step }: { step: number }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            {["Products", "Address", "Payment"].map((label, index) => {
                const active = step === index + 1
                return (
                    <div key={label} className="flex items-center gap-3">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${active ? "bg-black text-white" : "bg-zinc-200 text-zinc-500"}`}
                        >
                            {index + 1}
                        </div>
                        <span className={`${active ? "text-black" : "text-zinc-400"} text-sm`}>
                            {label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}


export default CheckOut;
