import { ArrowRight, CheckCircle, PlayIcon, StarIcon } from "lucide-react";
import hero1 from "/assets/hero-1.jpg"
import hero2 from "/assets/hero-2.jpg"
const Hero = () => {
    return (
        <div className="w-screen h-auto p-2 font-[Interif]">
            <div className="max-w-7xl flex items-center justify-center m-auto mt-14 gap-10">
                <div className="flex-1 flex flex-col items-baseline gap-8 m-auto">
                    <h1 className="font-bold text-6xl">Best Online <br /> Fabric Store <br /> for Men</h1>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 p-2 px-6 bg-orange-600 cursor-pointer">
                            <p className="text-lg text-white">Explore more</p>
                            <ArrowRight color="white" />
                        </button>
                        <button className="flex items-center gap-4 p-2 bg-black">
                            <PlayIcon color="white" className="cursor-pointer" />
                        </button>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-2">
                        <h3 className="text-black text-md font-semibold text-left">What makes us pro?</h3>
                        <div className="flex flex-col items-baseline gap-2">
                            <div className="flex items-center gap-2 font-medium">
                                <CheckCircle color="orange" size={16} />
                                <p>100% Authentic Products</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle color="orange" size={16} />
                                <p>Free & Easy Returns</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle color="orange" size={16} />
                                <p>Nationwide Delivery</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle color="orange" size={16} />
                                <p>Safe Payments</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-2 flex items-center gap-4">
                    <div className="w-full relative">
                        <div className="w-100 h-140 absolute bg-orange-100" style={{ transform: "rotate(-10deg)" }}></div>
                        <img src={hero2} className="w-100" style={{ transform: "rotate(1deg)" }} />
                    </div>

                    <div className="flex flex-col items-center justify-between gap-20">
                        <div className="flex gap-2">
                            <StarIcon color="orange" />
                            <p className="text-lg">Get 100+ Sprit of <br /> Fashion Clothes</p>
                        </div>
                        <div className="w-full relative">
                            <div className="w-60 h-60 absolute bg-orange-100" style={{ transform: "rotate(-8deg)" }}></div>
                            <img src={hero1} className="w-72" style={{ transform: "rotate(5deg)" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const tabs = ["Viscose", "Cashmere", "Wool", "Synthetic", "Linen", "Silk", "Polyamide"];

const FabricTabs = () => {
    return (
        <div className="max-w-7xl mx-auto mt-24 px-6 flex flex-wrap justify-center text-sm font-medium">
            {tabs.map(t => (
                <button
                    key={t}
                    className={`w-36 py-4 border border-stone-300 text-xl text-center flex items-center justify-center ${t === "Silk"
                        ? "text-orange-500 border-b border-orange-500"
                        : "text-stone-600 hover:text-black"
                        }`}
                >
                    {t}
                </button>
            ))}
        </div>
    );
};

export { FabricTabs };

const NewestFabrics = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 mt-24">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Newest Fabrics</h2>
                <p className="text-sm text-stone-500">Quick Update on Instagram</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <img src="./assets/n1.png" className="rounded-xl" />
                <img src="./assets/n2.png" className="rounded-xl" />
                <img src="./assets/n3.png" className="rounded-xl" />
            </div>
        </section>
    );
};

export { NewestFabrics };



export default Hero;
