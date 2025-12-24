import type React from "react";
import NewsLetter from "./NewsLetter";
import { Instagram, Twitter, Youtube } from "lucide-react";

const Footer: React.FC = () => {
    return (
        <div className="mt-30">
            <NewsLetter />
            <Cloumn />
            <p className="text-stone-400 font-[InterSerif] m-auto text-center mb-10">© 2025 Kunal. All rights reserved.</p>
        </div>
    )
}

const Cloumn: React.FC = () => {
    return (
        <div className="w-screen h-[429px] m-auto p-4">
            <div className="max-w-7xl m-auto flex items-center justify-around gap-2 mt-20">

                {/* Col - 1 */}
                <div className="flex flex-col items-baseline gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-[40px] h-[40px] rouded-full bg-black flex items-center justify-center">
                            <img src="./assets/Logo.png" />
                        </div>
                        <h2 className="text-lg font-semibold font-[InterSerif]">Ecommerce</h2>
                    </div>
                    <p className="w-[300px] text-md text-stone-400 font-[InterSerif]">
                        DevCut is a YouTube channel for practical project-based learning.
                    </p>
                    <div className="flex items-center gap-2">
                        <Youtube className="text-stone-700 cursor-pointer" />
                        <Twitter className="text-stone-700 cursor-pointer" />
                        <Instagram className="text-stone-700 cursor-pointer" />
                    </div>
                </div>

                {/* Col - 2 */}
                <div className="space-y-6">
                    <h3 className="text-md font-[InterSerif] text-center">Support</h3>
                    <div className="flex flex-col gap-4 items-center text-md font-[InterSerif] text-stone-400">
                        <p>FAQ</p>
                        <p>Terms of use</p>
                        <p>Privacy Policy</p>
                    </div>
                </div>

                {/* Col - 3 */}
                <div className="space-y-6">
                    <h3 className="text-md font-[InterSerif] text-center">Company</h3>
                    <div className="flex flex-col gap-4 items-center text-md font-[InterSerif] text-stone-400">
                        <p>About Us</p>
                        <p>Contact</p>
                        <p>Careers</p>
                    </div>
                </div>

                {/* Col - 4 */}
                <div className="space-y-6">
                    <h3 className="text-md font-[InterSerif] text-center">Shop</h3>
                    <div className="flex flex-col gap-4 items-center text-md font-[InterSerif] text-stone-400">
                        <p>My Account</p>
                        <p>Checkout</p>
                        <p>Cart</p>
                    </div>
                </div>

                {/* Col - 5 */}
                <div className="space-y-6">
                    <h3 className="text-md font-[InterSerif] text-center">Accepted Paymets</h3>
                    <div className="flex gap-4 items-center text-md font-[InterSerif] text-stone-400">
                        <img src="./assets/master.png" />
                        <img src="./assets/amex.png" />
                        <img src="./assets/visa.png" />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Footer;