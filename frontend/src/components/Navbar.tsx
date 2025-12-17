import type React from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { Search, User2Icon } from "lucide-react";

const Navbar: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const navigations = [
        {
            id: 1,
            title: "Home",
            navigate: '/'
        },
        {
            id: 2,
            title: "Categories",
            navigate: "/categories"
        },
        {
            id: 3,
            title: "About",
            navigate: "/about"
        },
        {
            id: 4,
            title: "Contact",
            navigate: "/contact"
        }
    ]
    const navigate = useNavigate();

    const handleCart = () => {
        if (isLoggedIn) {
            navigate('/cart')
        } else {
            navigate('/signin')
        }
    }
    return (
        <div className="w-screen p-3 bg-white overflow-x-hidden">
            <div className="max-w-8xl m-auto flex items-center justify-around">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded-full w-[40px] h-[40px] bg-black">
                        <img src="./assets/Logo.png" />
                    </div>
                    <h2 className="text-xl font-semibold font-[InterSerif]">Ecommerce</h2>
                </div>

                <div className="flex items-center justify-center gap-8">
                    {
                        navigations.map((item) => {
                            return (
                                <p key={`${item.id}_${item.title}`} onClick={() => navigate(item.navigate)} className="text-md text-stone-400 cursor-pointer hover:text-black">{item.title}</p>
                            )
                        })
                    }
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-full max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-12 pr-4 py-3 border border-stone-400 rounded-lg text-gray-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <button onClick={handleCart}>
                            <img className="" src="./assets/cart-icon.png" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        {
                            isLoggedIn ?

                                <div className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-black text-white">
                                    K
                                </div> : <User2Icon />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;