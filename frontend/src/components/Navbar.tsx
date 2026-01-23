import type React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
    Loader,
    LogIn,
    LogOut,
    SearchIcon,
    ShoppingCart,
    User2Icon,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RandomLetterSwapPingPong } from "./RandomLetterSwap";
import useCart from "../hooks/useCart";
import Cart from "./Cart";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Navbar: React.FC<{ word: string }> = () => {
    const { isLoggedIn, onLogout } = useAuth();
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [sideBar, setIsSideBar] = useState<boolean>(false);
    const navigate = useNavigate();
    const { cartCount } = useCart()
    const [cartOpen, setCartOpen] = useState<boolean>(false)

    const navigations = [
        { id: 1, title: "Shop", navigate: "/shop" },
        { id: 2, title: "Categories", navigate: "/categories" },
        { id: 3, title: "About", navigate: "/about" },
        { id: 4, title: "Contact", navigate: "/contact" },
    ];

    return (
        <>
            {sideBar && <SideBar setSideBar={setIsSideBar} />}
            {(cartOpen) && < Cart setCart={setCartOpen} />}

            <div className="max-w-[85%] mx-auto px-4 md:px-6 mt-4 flex items-center justify-between">

                <div className="hidden md:flex items-center gap-6">
                    {navigations.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(item.navigate)}
                            className="text-lg font-[Interif] cursor-pointer"
                        >
                            <RandomLetterSwapPingPong label={item.title} />
                        </div>
                    ))}
                </div>


                <div className="text-2xl text-center font-[Interif] md:mr-10">
                    Sabina
                </div>


                <div className="flex items-center gap-4 md:gap-6">

                    <div
                        onClick={() => setIsSideBar(true)}
                        className="cursor-pointer flex items-center justify-center"
                    >
                        <SearchIcon />
                    </div>


                    <div className="relative flex items-center justify-center">
                        <ShoppingCart onClick={() => {
                            if (isLoggedIn) {
                                setCartOpen(true)
                            } else {
                                navigate('/signin')
                            }
                        }} className="cursor-pointer" />
                        <div
                            className="absolute -top-2 -right-2  md:left-4 md:bottom-4 bg-black
                                w-5 h-5 md:w-6 md:h-6 rounded-full
                                text-white text-xs md:text-sm
                                flex items-center justify-center font-[Interif]"
                        >
                            {isLoggedIn ? cartCount : 0}
                        </div>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsOpened(!isOpened)}
                            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200
              flex items-center justify-center transition cursor-pointer"
                        >
                            <User2Icon size={18} className="text-stone-700" />
                        </button>

                        {isOpened && (
                            <div
                                className="absolute right-0 mt-3 w-44 rounded-xl bg-white
                shadow-xl border border-stone-200 overflow-hidden
                z-50 animate-in fade-in zoom-in-95"
                            >
                                {isLoggedIn ? (
                                    <button
                                        onClick={() => {
                                            onLogout();
                                            setIsOpened(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3
                    text-sm text-stone-700 hover:bg-stone-100 transition"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            navigate("/signin");
                                            setIsOpened(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3
                    text-sm text-stone-700 hover:bg-stone-100 transition"
                                    >
                                        <LogIn size={16} />
                                        Sign In
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const useDebounce = (word: string) => {
    const [debouncedValue, setDebouncedValue] = useState<string>("")
    useEffect(() => {
        const timeOut = setTimeout(() => {
            setDebouncedValue(word)
        }, 500);
        return () => clearInterval(timeOut)
    }, [word])
    return { debouncedValue }
}
interface ProductImage {
    id: string;
    image_url: string;
    product_id: string;
}

interface Product_Type {
    id: string;
    product_name: string;
    product_description: string;
    images: ProductImage[];
}

const SideBar: React.FC<{
    setSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setSideBar }) => {
    const [word, setWord] = useState<string>("");
    const { debouncedValue } = useDebounce(word);
    const [products, setProducts] = useState<Product_Type[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const naviagte = useNavigate()
    useEffect(() => {

        if (!debouncedValue.trim()) {
            return
        }
        setLoading(true)
        const controller = new AbortController();
        fetch(`${BACKEND_URL}/product/getProduct/${debouncedValue}`, {
            signal: controller.signal,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (response: Response) => {
            const data = await response.json();
            if (!data || !data.valid) {
                setLoading(false)
                setProducts([])
            } else {
                setProducts(data.products)
                setLoading(false)
            }
        })
        return () => controller.abort()

    }, [debouncedValue])
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex">
            <motion.div
                initial={{ x: -380 }}
                animate={{ x: 0 }}
                exit={{ x: -380 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="bg-white w-[85%] sm:w-[380px] lg:w-128 h-full"
            >
                <div className="w-full flex flex-col items-baseline p-2 mt-5">
                    <div className="flex items-center gap-2 w-full">


                        <div className="flex items-center w-full bg-stone-100 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-black transition">
                            <SearchIcon className="text-stone-500 mr-3" size={18} />
                            <input
                                value={word}
                                onChange={(e) => setWord(e.target.value)}
                                type="text"
                                placeholder="Search products..."
                                style={{ border: "0px" }}
                                className="w-full bg-transparent border-none outline-none text-sm text-stone-800 placeholder:text-stone-500 focus:outline-none focus:ring-0"
                            />
                        </div>


                        <X onClick={() => setSideBar(false)} className="cursor-pointer text-stone-600 hover:text-black transition" />
                    </div>
                    {
                        loading ? <Loader /> : products.length > 0 ? <div className="w-full flex flex-col gap-3 mt-10">
                            {products.map((item, idx) => (
                                <div
                                    key={`${idx}_${item.id}`}
                                    className="group flex gap-4 w-full rounded-2xl border border-stone-200 bg-white p-3
                 hover:border-stone-300 hover:shadow-md transition-all duration-300"
                                >

                                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                                        <img
                                            src={item.images[0].image_url}
                                            alt={item.product_name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>


                                    <div className="flex flex-col justify-between w-full">
                                        <div className="space-y-1">
                                            <h2 className="text-base font-semibold text-stone-900 leading-tight">
                                                {item.product_name}
                                            </h2>

                                            <p className="text-sm text-stone-600 line-clamp-2 max-w-[90%]">
                                                {item.product_description}
                                            </p>
                                        </div>


                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-sm font-semibold text-stone-900">
                                                ₹1,000
                                            </p>

                                            <button
                                                onClick={() => naviagte(`/product/${item.id}`)}
                                                className="text-xs font-medium px-3 py-1.5 rounded-full
                                                cursor-pointer
                                                bg-stone-900 text-white
                                                opacity-0 group-hover:opacity-100
                                                transition-opacity duration-300"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                            : null
                    }
                </div>
            </motion.div>
            <div
                onClick={() => setSideBar(false)}
                className="flex-1 h-full"
            />
        </div>
    );
};



export default Navbar;
