import type React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface Props {
    image_url: string;
    product_name: string;
    product_price: string;
}

const ProductPreview: React.FC<Props> = ({ image_url, product_name, product_price }) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    return (
        <div
            onClick={() => navigate(isLoggedIn ? "/product/1" : "/signin")}
            className="group cursor-pointer"
        >
            <div className="rounded-2xl overflow-hidden bg-stone-100 h-[320px] flex items-center justify-center">
                <img
                    src={image_url}
                    className="group-hover:scale-105 transition-transform"
                />
            </div>

            <div className="mt-4">
                <p className="font-semibold">{product_name}</p>
                <p className="text-stone-500">{product_price}</p>
            </div>
        </div>
    );
};

export default ProductPreview;
