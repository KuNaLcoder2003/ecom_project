import type React from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import useProduct from "../hooks/useProduct";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion"
import { Minus, Plus } from "lucide-react";
import { ProductCard, SectionHeading } from "./NewArrivals";
import Footer from "./Footer";
import addToCart from "../functions/addToCart";

const Product: React.FC = () => {
    const { product, error, valid, loading, sizes, colors, varinats } = useProduct();
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("")
    const [selectedSize, setSelectedSize] = useState<string>("")


    useEffect(() => {
        if (product?.images?.length) {
            setSelectedImage(product.images[0].image_url);
        }
        setSelectedColor(colors[0])
        setSelectedSize(sizes[0])
    }, [product]);

    if (!valid && error) {
        toast.error(error);
        return null;
    }

    async function addToCartHandler() {
        if (!selectedColor || !selectedSize) {
            toast.error("Please select size and color")
            return
        }
        const obj = varinats.find((item) => item.color == selectedColor && item.size == selectedSize)
        if (!obj) {
            toast.error("No product exists")
            return
        }
        const response = await addToCart(obj?.product_id, cartCount, obj?.price, obj?.id)
        if (response.error) {
            toast.error(response.message)
        } else {
            toast.success(response.message)
        }
    }


    const [cartCount, setCartCount] = useState<number>(1);

    return (
        <>
            {
                loading ? <ProductSkeleton /> : product && <>
                    <Navbar word="" />
                    <Toaster />

                    <div className="mt-16 sm:mt-20 max-w-[95%] sm:max-w-[90%] lg:max-w-[85%] m-auto px-2 sm:px-4">
                        <div className="flex flex-col items-center lg:flex-row lg:items-start gap-10 lg:gap-20">

                            {/* IMAGE SECTION */}
                            <div className="w-full flex flex-col lg:flex-row gap-4">
                                {/* Thumbnails */}
                                <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
                                    {product.images.map((item) => (
                                        <div
                                            key={item.id}
                                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shrink-0 cursor-pointer"
                                        >
                                            <img
                                                src={item.image_url}
                                                className="rounded-lg object-cover w-full h-full"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div className="w-full sm:w-[90%] m-auto lg:w-170  overflow-hidden">
                                    <img
                                        src={selectedImage}
                                        className="rounded-lg w-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* PRODUCT DETAILS */}
                            <div className="w-full space-y-8">
                                <div className="space-y-4">
                                    {/* <p className="text-sm sm:text-lg font-[Interif] text-orange-400">
                                        Out of stock
                                    </p> */}

                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[Interif]">
                                        {product.product_name}
                                    </h2>

                                    <p className="text-xl sm:text-2xl font-bold font-[Interif]">
                                        $ {product.variants[0].price}
                                    </p>

                                    <div className="space-y-2">
                                        <div className="w-full border border-stone-100" />
                                        <p className="text-sm sm:text-base max-w-5xl">
                                            {product.product_description}
                                        </p>
                                        <div className="w-full border border-stone-100" />
                                    </div>
                                </div>

                                {/* SIZE */}
                                <div className="space-y-2">
                                    <p className="text-sm font-light font-[Interif]">Size</p>
                                    <div className="flex flex-wrap gap-3">
                                        {sizes.map((item) => (
                                            <div
                                                key={item}
                                                onClick={() => setSelectedSize(item)}
                                                className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-light ${selectedSize === item
                                                    ? "bg-[#D1B7A4] text-black"
                                                    : "bg-stone-200"
                                                    }`}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* COLOR */}
                                <div className="space-y-2">
                                    <p className="text-sm font-light font-[Interif]">Color</p>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((item) => (
                                            <div
                                                key={item}
                                                onClick={() => setSelectedColor(item)}
                                                className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-light ${selectedColor === item
                                                    ? "bg-[#D1B7A4] text-black"
                                                    : "bg-stone-200"
                                                    }`}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* QUANTITY & CART */}
                                <div className="space-y-4 mt-10 sm:mt-16 lg:mt-20">
                                    <div className="max-w-sm w-full py-3 px-4 flex items-center justify-between bg-zinc-100 rounded-lg">
                                        <Minus className="cursor-pointer" onClick={() => {
                                            setCartCount(val => val == 0 ? 0 : val - 1)
                                        }} />
                                        <div>{cartCount}</div>
                                        <Plus className="cursor-pointer" onClick={() => setCartCount(val => val + 1)} />
                                    </div>

                                    <button onClick={() => addToCartHandler()} className="w-full max-w-sm py-3 bg-black text-white rounded-lg cursor-pointer">
                                        Add to cart
                                    </button>
                                </div>

                                {/* ACCORDIONS */}
                                <div className="mt-12">
                                    <Accordians />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RELATED PRODUCTS */}
                    <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[83%] m-auto mt-16 mb-10">
                        <SectionHeading
                            heading="You might also like"
                            subHeading="People who bought this product also visited"
                        />

                        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                            {[
                                {
                                    product_name: "Skyline Sweat",
                                    product_price: 650.6,
                                    product_image:
                                        "https://framerusercontent.com/images/BWWhfOFEXT1fwMJKufIWexbmJpw.png",
                                },
                                {
                                    product_name: "Nightfall Hoodie",
                                    product_price: 650.6,
                                    product_image:
                                        "https://framerusercontent.com/images/yGluYsGwgJzhvCl9DklkFsu5g.png",
                                },
                                {
                                    product_name: "Moss Layer",
                                    product_price: 650.6,
                                    product_image:
                                        "https://framerusercontent.com/images/3UXm6eEVUQj5N8Mh38UO7cBR74.png",
                                },
                            ].map((item, index) => (
                                <ProductCard
                                    id={`${item.product_name}_${item.product_price}`}
                                    key={index}
                                    product_name={item.product_name}
                                    product_price={item.product_price}
                                    url={item.product_image}
                                />
                            ))}
                        </div>
                    </div>

                    <Footer />
                </>
            }
        </>
    );
};

const Accordians: React.FC = () => {
    const accordians = [
        {
            id: 1,
            title: "Delivery & Return",
            description: "We offer fast shipping and hassle-free returns within 30 days"
        },
        {
            id: 2,
            title: "Size & Fit",
            description: "Refer to our size guide for the perfect fit tailored to your measurements"
        },
        {
            id: 3,
            title: "How this was made",
            description: "Each item is crafted with careusing sustainble materials and ethical practices"
        },
    ]
    const [open, setOpen] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (

        <div className="w-full flex flex-col items-baseline gap-8">
            {
                accordians.map(item => {
                    return (
                        <motion.div
                            initial={{ height: "auto" }}
                            whileInView={open == item.id ? { height: "100px" } : { height: "auto" }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            onClick={() => { setIsOpen(true); setOpen(item.id) }} className={`w-full space-y-4 cursor-pointer`}>
                            <div className="w-full flex items-center justify-between">
                                <h2 className="font-[Interif] font-medium text-lg">{item.title}</h2>
                            </div>
                            {
                                open == item.id && isOpen &&
                                <p
                                    className="font-thin"

                                >{item.description}</p>
                            }
                            <div className="w-full border border-stone-100" />

                        </motion.div>
                    )
                })
            }
        </div>
    )
}

const ProductSkeleton = () => {
    return (
        <div className="mt-16 sm:mt-20 max-w-[95%] sm:max-w-[90%] lg:max-w-[85%] m-auto px-2 sm:px-4 animate-pulse">
            <div className="flex flex-col items-center lg:flex-row lg:items-start gap-10 lg:gap-20">

                {/* IMAGE SECTION */}
                <div className="w-full flex flex-col lg:flex-row gap-4">

                    {/* Thumbnails */}
                    <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg bg-zinc-200"
                            />
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="w-full sm:w-[90%] m-auto lg:w-170">
                        <div className="w-full aspect-[3/4] rounded-lg bg-zinc-200" />
                    </div>
                </div>

                {/* PRODUCT DETAILS */}
                <div className="w-full space-y-8">

                    {/* Title & Price */}
                    <div className="space-y-4">
                        <div className="h-8 w-3/4 bg-zinc-200 rounded-md" />
                        <div className="h-6 w-32 bg-zinc-200 rounded-md" />

                        <div className="space-y-3">
                            <div className="h-4 w-full bg-zinc-200 rounded-md" />
                            <div className="h-4 w-5/6 bg-zinc-200 rounded-md" />
                            <div className="h-4 w-4/6 bg-zinc-200 rounded-md" />
                        </div>
                    </div>

                    {/* SIZE */}
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-zinc-200 rounded-md" />
                        <div className="flex gap-3">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-9 w-14 bg-zinc-200 rounded-lg"
                                />
                            ))}
                        </div>
                    </div>

                    {/* COLOR */}
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-zinc-200 rounded-md" />
                        <div className="flex gap-3">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-9 w-20 bg-zinc-200 rounded-lg"
                                />
                            ))}
                        </div>
                    </div>

                    {/* QUANTITY & BUTTON */}
                    <div className="space-y-4 mt-10 sm:mt-16 lg:mt-20">
                        <div className="max-w-sm h-12 bg-zinc-200 rounded-lg" />
                        <div className="max-w-sm h-12 bg-zinc-300 rounded-lg" />
                    </div>

                    {/* ACCORDION */}
                    <div className="space-y-3 mt-12">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-12 w-full bg-zinc-200 rounded-lg"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* RELATED PRODUCTS */}
            <div className="mt-16 mb-10">
                <div className="h-6 w-64 bg-zinc-200 rounded-md mb-2" />
                <div className="h-4 w-96 bg-zinc-200 rounded-md mb-8" />

                <div className="flex flex-col gap-8 lg:flex-row">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="w-full h-80 bg-zinc-200 rounded-xl"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Product;
