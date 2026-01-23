import type React from "react"
import { ProductCard } from "./NewArrivals"
const Women = [
    {
        product_id: "2b629c53-2b1c-438a-834e-d05bd19c82b4",
        product_name: "Skyline Sweat",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/BWWhfOFEXT1fwMJKufIWexbmJpw.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Gradient Zip",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/meNUvIFrqOr6z2XFxGCjX4.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Neon Fade",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/RPr0RShfbI1zWvHq8YmzI1AXX4.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Pacific Knit",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/hvUK4D2bQpept64Nd26CzZgdFQ.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Pine Fleece",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/FIMwYYJyeHaC91tQdY9pHwkA4.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Fusion Crew",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/5rU16OkZeKOsyJE2i5PnQL6zKOo.png"
    }
]

const Men = [
    {
        product_id: "508af869-6693-4b9e-8b1c-f6c35ea3de7b",
        product_name: "Nightfall Hoodie",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/yGluYsGwgJzhvCl9DklkFsu5g.png"
    },
    {
        product_id: "88c66642-3beb-4169-bb68-49812428121d",
        product_name: "Moss Layer",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/3UXm6eEVUQj5N8Mh38UO7cBR74.png"
    },
    {
        product_id: "25583016-db49-44d8-9be6-af17a6559391",
        product_name: "Eco Fleece",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/qv753nhXHN8tIVDjGrH9mHxIoso.png"
    },
    {
        product_id: "81dd98dd-b7f5-4c1d-b247-f135596c5ebb",
        product_name: "Blue Edge",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/TlSRAymQmyp6kGX4EZrGdUlL4.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Gradient Zip",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/meNUvIFrqOr6z2XFxGCjX4.png"
    },
]

const Bags = [
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Terra Pack",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/dSczfkBLlWBDyEfFJN0AjJqvc.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Vintage Tote",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/j8dOEwDYhYkHpG5Qs7cb3dQyeYA.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Modern Duo",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/FUa1ZcxOMGXapxrKPdg2e4DRsc.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Amber Carry",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/rW7QvKkYPTRjBLXet4JJ3IKqf8U.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Classic Arc",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/rW7QvKkYPTRjBLXet4JJ3IKqf8U.png"
    },
    {
        product_id: "5f78a731-71fe-4fce-a5c0-ff8b6fd3e979",
        product_name: "Crescent Bag",
        product_price: 650.60,
        product_image: "https://framerusercontent.com/images/EEgbfP3BEgdx0UGkLx7LQuj6Hk.png"
    },
]


interface Product {
    product_id: string;
    product_name: string;
    product_price: number;
    product_image: string;
}
const Category: React.FC<{ category: "Men" | "Women" | "Bags" }> = ({ category }) => {
    let products: Product[];
    if (category == "Bags") {
        products = [...Bags]
    }
    else if (category == "Men") {
        products = [...Men]
    } else {
        products = [...Women]
    }
    const arr1 = products.slice(0, 3)
    const arr2 = products.slice(3, products.length)
    return (
        <div className="w-[90%] lg:max-w-[83%] m-auto mt-8 mb-2 space-y-4 mb-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                {
                    arr1.map(item => {
                        return (
                            <ProductCard id={item.product_id} key={item.product_id} url={item.product_image} product_name={item.product_name} product_price={item.product_price} />
                        )
                    })
                }
            </div>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                {
                    arr2.map(item => {
                        return (
                            <ProductCard id={item.product_id} key={item.product_id} url={item.product_image} product_name={item.product_name} product_price={item.product_price} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Category;