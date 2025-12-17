import type React from "react";

interface ProductPreviewProps {
    image_url: string,
    product_name: string,
    product_price: string
}
const ProductPreview: React.FC<ProductPreviewProps> = ({ image_url, product_name, product_price }) => {
    return (
        <div className="w-[264px] h-[434px] p-2">
            <div className="w-full h-full space-y-4">
                <div className="bg-stone-200 flex items-center justify-center w-full h-full">
                    <img src={image_url} />
                </div>
                <div className="flex flex-col gap-2 items-baseline">
                    <p>{product_name}</p>
                    <p>{product_price}</p>
                </div>
            </div>
        </div>
    )
}

export default ProductPreview;