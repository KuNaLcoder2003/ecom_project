import type React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { LogIn, LogOut, Search, ShoppingBagIcon, User2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const useDebounce = (word: string) => {
    const [debouncedWord, setDebouncedWord] = useState("");

    useEffect(() => {
        const t = setTimeout(() => setDebouncedWord(word), 700);
        return () => clearTimeout(t);
    }, [word]);

    return { debouncedWord };
};

const Navbar: React.FC<{ word: string }> = ({ word }) => {
    const [product, setProducts] = useState("");
    const { debouncedWord } = useDebounce(product);
    const { isLoggedIn, onLogout } = useAuth();
    const navigate = useNavigate();
    const [isOpened, setIsOpened] = useState<boolean>(false)

    const navigations = [
        { id: 1, title: "Home", navigate: "/" },
        { id: 2, title: "Categories", navigate: "/categories" },
        { id: 3, title: "About", navigate: "/about" },
        { id: 4, title: "Contact", navigate: "/contact" }
    ];

    return (
        <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-stone-300 flex items-center justify-center">
            <Toaster />
            <div className="w-full mx-auto flex items-center px-6 py-4 gap-10">

                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer justify-center flex-1 border-r-2 border-stone-300" onClick={() => navigate("/")}>
                    <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                        <img src="./assets/Logo.png" />
                    </div>
                    <h2 className="text-lg font-semibold font-[Interif]">Ecommerce</h2>
                </div>

                {/* Nav */}
                <div className="hidden md:flex md:items-center md:justify-center gap-10 flex-2 border-r-2 border-stone-300">
                    {navigations.map(n => (
                        <p
                            key={n.id}
                            onClick={() => navigate(n.navigate)}
                            className="text-lg text-stone-500 hover:text-orange-600 cursor-pointer transition font-[Interif]"
                        >
                            {n.title}
                        </p>
                    ))}
                </div>

                {/* Right */}
                <div className="flex items-center gap-5 flex-1">

                    {/* Search */}
                    <div className="relative w-[280px]">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 cursor-pointer"
                            onClick={() => {
                                if (!debouncedWord) return toast.error("Search cannot be empty");
                                navigate(`/product/search/${debouncedWord}`);
                            }}
                        />
                        <input
                            value={product.length === 0 ? word : product}
                            onChange={e => setProducts(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-stone-300
                         focus:ring-2 focus:ring-black transition"
                        />
                    </div>

                    {/* Cart */}
                    <div className="flex items-center">
                        <button className="cursor-pointer border border-stone-100 p-2" onClick={() => navigate(isLoggedIn ? "/cart" : "/signin")}>
                            <ShoppingBagIcon />
                        </button>
                        <div className="relative border border-stone-100 p-2">
                            {
                                isLoggedIn ? "2" : "0"
                            }
                        </div>
                    </div>


                    <div className="relative">
                        {/* Avatar Button */}
                        <button
                            onClick={() => setIsOpened(!isOpened)}
                            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200
                   flex items-center justify-center transition"
                        >
                            <User2Icon size={18} className="text-stone-700" />
                        </button>

                        {/* Dropdown */}
                        {isOpened && (
                            <div
                                className="absolute right-0 mt-3 w-44 rounded-xl bg-white
                       shadow-xl border border-stone-200 overflow-hidden
                       animate-in fade-in zoom-in-95"
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
                                        <LogIn onClick={() => navigate('/signin')} size={16} />
                                        Sign In
                                    </button>
                                )}
                            </div>
                        )}
                    </div>



                </div>
            </div>
        </div>
    );
};

export default Navbar;
