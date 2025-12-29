import { useEffect, useState } from "react";

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

const ProductStep = ({
    products,
    onNext,
}: {
    products: Product[];
    onNext: () => void;
}) => {
    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        const total = products.reduce((sum: number, product: Product) => {
            return sum + product.price * product.qunatity;
        }, 0);
        setTotal(total);
    }, [products])
    return (
        <>
            <h2 className="text-2xl font-semibold mb-6">
                🛒 Your Products
            </h2>

            <div className="space-y-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex gap-4 border rounded-lg p-4 shadow-sm"
                    >
                        {product.images?.[0] && (
                            <img
                                src={product.images[0].image_url}
                                alt=""
                                className="w-28 h-28 object-cover rounded-md"
                            />
                        )}

                        <div className="flex-1">
                            <h3 className="text-lg font-medium">
                                {product.product_name}
                            </h3>

                            <p className="text-gray-600 text-sm mt-1">
                                {product.product_description}
                            </p>

                            <div className="flex gap-6 mt-3 text-sm">
                                <span>
                                    Qty: <b>{product.qunatity}</b>
                                </span>
                                <span>
                                    Price: <b>₹{product.price}</b>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-right flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">Total :</p>
                    <p className="text-lg font-light">${total}</p>
                </div>
                <button
                    onClick={onNext}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
                >
                    Select Address
                </button>
            </div>
        </>
    );
};
export default ProductStep;
