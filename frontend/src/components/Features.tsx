import { Ribbon, Truck, Lock } from "lucide-react";
import type React from "react";

const Features: React.FC = () => {
    const features = [
        { icon: <Truck />, title: "Free Shipping", text: "Free shipping on all orders worldwide." },
        { icon: <Ribbon />, title: "Satisfaction Guarantee", text: "Love it or get your money back." },
        { icon: <Lock />, title: "Secure Payments", text: "Encrypted and safe transactions." }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
                <div
                    key={i}
                    className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition"
                >
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                        {f.icon}
                    </div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-stone-500 mt-2">{f.text}</p>
                </div>
            ))}
        </div>
    );
};

export default Features;
