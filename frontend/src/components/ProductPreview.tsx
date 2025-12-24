import type React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface ProductPreviewProps {
    image_url: string,
    product_name: string,
    product_price: string
}
const ProductPreview: React.FC<ProductPreviewProps> = ({ image_url, product_name, product_price }) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    return (
        <div onClick={() => {
            if (isLoggedIn) {
                navigate("/product/1")
            } else {
                navigate("/signin")
            }
        }} className="w-[264px] h-[434px] p-2 cursor-pointer">
            <div className="w-full h-full space-y-4">
                <div className="bg-stone-200 flex items-center justify-center w-full h-full">
                    <img src={image_url} />
                </div>
                <div className="flex flex-col gap-2 items-baseline font-[InterSerif]">
                    <p className="text-lg font-semibold">{product_name}</p>
                    <p className="text-md font-light">{product_price}</p>
                </div>
            </div>
        </div>
    )
}

export default ProductPreview;