import type React from "react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import useProduct from "../hooks/useProduct";
import { Toaster, toast } from "react-hot-toast";
import addToCart from "../functions/addToCart";

const Product: React.FC = () => {
    const { product, error, valid } = useProduct();

    const [selectedImage, setSelectedImage] = useState<string>("");
    const [count, setCount] = useState<number>(1);

    useEffect(() => {
        if (product?.images?.length) {
            setSelectedImage(product.images[0].image_url);
        }
    }, [product]);

    if (!valid && error) {
        toast.error(error);
        return null;
    }

    if (!product) return null;

    return (
        <>
            <Navbar />
            <Toaster />
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">


                <div className="flex flex-col gap-4">
                    <div className="w-full h-[400px] border rounded-xl overflow-hidden">
                        <img
                            src={selectedImage}
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex gap-4">
                        {product.images.map((img) => (
                            <div
                                key={img.id}
                                onClick={() => setSelectedImage(img.image_url)}
                                className={`w-[90px] h-[90px] border rounded-lg overflow-hidden cursor-pointer
                                ${selectedImage === img.image_url ? "border-black" : "border-gray-300"}`}
                            >
                                <img
                                    src={img.image_url}
                                    alt="thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>


                <div className="flex flex-col gap-6">
                    <h1 className="text-3xl font-semibold">
                        {product.product_name}
                    </h1>

                    <p className="text-gray-600">
                        {product.product_description}
                    </p>

                    <p className="text-2xl font-bold">
                        ₹ {product.price}
                    </p>


                    <div className="flex items-center gap-4">
                        <p className="font-medium">Quantity</p>
                        <div className="flex border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setCount(prev => Math.max(1, prev - 1))}
                                className="px-4 py-2 hover:bg-gray-100"
                            >
                                −
                            </button>
                            <span className="px-6 py-2">{count}</span>
                            <button
                                onClick={() => setCount(prev => prev + 1)}
                                className="px-4 py-2 hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">
                            ({product.quantity} available)
                        </p>
                    </div>


                    <div className="flex gap-4 mt-4">
                        <button onClick={async () => {
                            const { error, message } = await addToCart(product.id, count, product.price)
                            if (message.length == 0) {
                                toast.error(error);
                            } else {
                                toast.success(message);
                            }
                        }} className="flex-1 py-3 border border-black rounded-lg hover:bg-black hover:text-white transition">
                            Add to Cart
                        </button>
                        <button className="flex-1 py-3 bg-black text-white rounded-lg hover:opacity-90 transition">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;
