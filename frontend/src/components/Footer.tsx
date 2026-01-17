import type React from "react";

import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white pt-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-semibold tracking-wide">SABINA</h2>
                    <p className="text-sm text-gray-400 mt-4 max-w-xs">
                        Discover timeless pieces for effortless style.
                    </p>

                    <div className="flex gap-4 mt-6">
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <Facebook size={18} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <Instagram size={18} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <Twitter size={18} />
                        </a>
                    </div>
                </div>

                {/* Information */}
                <div>
                    <h3 className="text-sm font-medium mb-5">Information</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="hover:text-white cursor-pointer">Shipping Policy</li>
                        <li className="hover:text-white cursor-pointer">Returns & Refunds</li>
                        <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-sm font-medium mb-5">Company</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="hover:text-white cursor-pointer">About us</li>
                        <li className="hover:text-white cursor-pointer">Contact</li>
                        <li className="hover:text-white cursor-pointer">Blogs</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-sm font-medium mb-5">Contact</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li>2810 N Church St PMB 48572,<br /> Wilmington, Delaware</li>
                        <li>+1 123 456 7890</li>
                        <li>info@example.com</li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 mt-14 py-6">
                <p className="text-center text-sm text-gray-500">
                    © 2024, Sabina.
                </p>
            </div>
        </footer>
    )
}



export default Footer;