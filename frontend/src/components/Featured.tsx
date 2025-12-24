import type React from "react";
import ProductPreview from "./ProductPreview";

const Featured: React.FC = () => {
    return (
        <div className="max-w-7xl m-auto mt-25 space-y-6">
            <div className="flex flex-col items-center rounded-lg p-2 border border-stone-100 w-[100px] m-auto mb-10">
                <p className="text-stone-400 font-[InterSerif] text-sm">Featured</p>
            </div>
            <div className="w-full p-2 flex items-center justify-around gap-8">
                <ProductPreview image_url="./assets/cover.png" product_name="Classic Monochrome Tees" product_price="$35.00" />
                <ProductPreview image_url="./assets/cover.png" product_name="Classic Monochrome Tees" product_price="$35.00" />
                <ProductPreview image_url="./assets/cover.png" product_name="Classic Monochrome Tees" product_price="$35.00" />
                <ProductPreview image_url="./assets/cover.png" product_name="Classic Monochrome Tees" product_price="$35.00" />
            </div>
        </div>
    )
}

export default Featured;