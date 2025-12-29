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
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    return (
        <div className="max-w-4xl mx-auto p-4">
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
        </div>
    );
};



const CheckOut: React.FC = () => {
    const { address } = useAddress()
    const { products, loading } = useDetails()
    return (
        // <CheckoutPage />
        <>
            <Navbar />
            {
                loading ? <LoaderCircle /> : <CheckoutPage addresses={address} products={products} />
            }
        </>
    )
}

export default CheckOut;
