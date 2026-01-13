import type React from "react";
import useProductSearch from "../hooks/useProductSearch";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const ProductList: React.FC = () => {
    const { products, loading } = useProductSearch();
    const navigate = useNavigate()

    /* ------------------ Loading Skeleton ------------------ */
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto mt-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="w-full h-24 bg-gray-200 animate-pulse rounded-xl"
                    />
                ))}
            </div>
        );
    }

    /* ------------------ Empty State ------------------ */
    if (!loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center mt-20">
                <p className="text-gray-500 text-lg">
                    No products found
                </p>
            </div>
        );
    }



    /* ------------------ Product List ------------------ */
    return (
        <>
            <Navbar word="" />
            <div className="max-w-6xl mx-auto mt-6 space-y-4 px-2">

                {products.map((product) => (
                    <div
                        key={product.id}
                        className="w-full flex items-center gap-6 p-4 border rounded-xl hover:shadow-md transition"
                    >
                        {/* Image */}
                        <img
                            src={product.images[0]?.image_url}
                            alt={product.product_name}
                            className="w-20 h-20 object-cover rounded-lg border"
                        />

                        {/* Product Info */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                                {product.product_name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1">
                                {product.product_description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="w-28 text-center">
                            <p className="text-lg font-semibold">
                                ₹{product.price}
                            </p>
                            <p className="text-sm text-gray-400">
                                Qty: {product.quantity}
                            </p>
                        </div>

                        {/* Action */}
                        <button onClick={() => navigate(`/product/${product.id}`)} className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition">
                            View
                        </button>
                    </div>
                ))}
            </div>
        </>

    );
};

export default ProductList;
