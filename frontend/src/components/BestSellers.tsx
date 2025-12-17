import type React from "react";
import ProductPreview from "./ProductPreview";

const BestSellers: React.FC = () => {
    return (
        <div className="max-w-7xl m-auto mt-25 space-y-6">
            <div className="flex flex-col items-center">
                <p className="text-stone-400 font-[InterSerif] text-sm">Shop Now</p>
                <h2 className="text-4xl font-bold font-[InterSerif]">Best Selling</h2>
            </div>
            <div className="w-full p-2 flex items-center justify-around gap-4">
                <ProductPreview image_url="./assets/cover.png" product_name="Classic Monochrome Tees" product_price="$35.00" />
                <ProductPreview image_url="./assets/cover.png" product_name="Classic Monochrome Tees" product_price="$35.00" />
                <ProductPreview image_url="./assets/cover.png" product_name="Classic Monochrome Tees" product_price="$35.00" />
                <ProductPreview image_url="./assets/cover.png" product_name="Classic Monochrome Tees" product_price="$35.00" />
            </div>
        </div>
    )
}

export default BestSellers;