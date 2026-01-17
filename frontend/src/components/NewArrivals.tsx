import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

const New_Arrival = [
    {
        product_id: "1",
        product_name: "Skyline Sweat",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/BWWhfOFEXT1fwMJKufIWexbmJpw.png"
    },
    {
        product_id: "2",
        product_name: "Nightfall Hoodie",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/yGluYsGwgJzhvCl9DklkFsu5g.png"
    },
    {
        product_id: "3",
        product_name: "Moss Layer",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/3UXm6eEVUQj5N8Mh38UO7cBR74.png"
    },
    {
        product_id: "4",
        product_name: "Gradient Zip",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/meNUvIFrqOr6z2XFxGCjX4.png"
    },
    {
        product_id: "5",
        product_name: "Eco Fleece",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/qv753nhXHN8tIVDjGrH9mHxIoso.png"
    },
    {
        product_id: "6",
        product_name: "Blue Edge",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/TlSRAymQmyp6kGX4EZrGdUlL4.png"
    },
]
const arr1 = New_Arrival.slice(0, 3);

const arr2 = New_Arrival.slice(3, 6);
const NewArrivals: React.FC = () => {
    console.log(arr2)
    return (
        <div className="w-[90%] lg:max-w-[83%] m-auto mt-8 mb-2 space-y-4">
            <SectionHeading subHeading="Shop the Latest Styles: Stay ahead of the curve with our newest arrivals" heading="New Arrivals" />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                {
                    arr1.map(item => {
                        return (
                            <ProductCard key={item.product_id} url={item.product_image} product_name={item.product_name} product_price={item.product_price} />
                        )
                    })
                }
            </div>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                {
                    arr2.map(item => {
                        return (
                            <ProductCard key={item.product_id} url={item.product_image} product_name={item.product_name} product_price={item.product_price} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export const SectionHeading: React.FC<{ heading: string, subHeading: string }> = ({ heading, subHeading }) => {
    const [borderLength, setBorderLenght] = useState<number>(50)
    return (
        <div className="w-full p-2 flex flex-col items-baseline gap-2">
            <h1 className="text-4xl font-semibold font-[Interif]">{heading}</h1>
            <div className="w-full flex items-center justify-between text-xl font-[Interif]">
                <p className="w-[60%] lg:w-auto">{subHeading}</p>
                <div className="flex flex-col items-end">
                    <p className="cursor-pointer" onMouseEnter={() => setBorderLenght(100)} onMouseLeave={() => setBorderLenght(50)}>All Products</p>
                    <div style={{
                        width: `${borderLength}%`,
                        borderBottom: "2px solid black",
                        transition: "width",
                        transitionDelay: "0.1s",
                        transitionTimingFunction: "ease",
                        transitionDuration: "0.5s"
                    }}></div>
                </div>
            </div>
        </div>
    )
}

export const ProductCard: React.FC<{ url: string, product_name: string, product_price: number }> = ({ url, product_name, product_price }) => {
    const [hovered, setHovered] = useState<boolean>(false)
    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="w-[100%] lg:w-[32%] flex flex-col items-baseline gap-2">
            <div className="w-full h-auto relative overflow-hidden scale-[1] realtive">
                <div className="w-full h-auto flex items-center justify-center">
                    <img src={url} className="object-fit rounded-lg hover:scale-[1.07]" style={{
                        transitionDuration: "1s",
                        transitionDelay: "0.2s",

                    }} />
                </div>
                {
                    hovered && <motion.div initial={{ y: 20 }} whileInView={{ y: 0 }} exit={{ y: 20 }} transition={{ duration: 0.2 }} className="absolute w-full h-[40px] rounded-t-lg bottom-0 bg-black text-white font-[Interif] text-center text-lg flex items-center justify-center hover:bg-transparent hover:text-black transition:color transition:text cursor-pointer" style={{ transitionDuration: "0.5s" }}>View Product</motion.div>
                }
            </div>

            <div className="flex flex-col items-baseline font-[Interif] text-md">
                <p>{product_name}</p>
                <p className="font-semibold">$ {product_price}</p>
            </div>
        </div>
    )
}

export default NewArrivals; 