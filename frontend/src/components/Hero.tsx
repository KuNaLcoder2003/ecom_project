import type React from "react"

const Hero: React.FC = () => {
    return (
        <div className="w-screen h-[440px] bg-stone-100">
            <div className="flex relative w-full justify-around items-center h-full z-10">
                <div className="flex flex-col items-center gap-12 z-20">
                    <div className="flex flex-col items-center">
                        <h2 className="text-4xl font-bold font-[InterSerif]">Fresh Arrivals Online</h2>
                        <p className="text-stone-400 font-[InterSerif] text-sm">Discover Our Newest Collection Now</p>
                    </div>

                    <button className="text-white bg-black p-2 px-4 rounded-lg cursor-pointer">{"View Collection   ->"}</button>
                </div>

                <div className="relative z-20">
                    <div className="p-2">
                        <img src="./assets/Hero-Image.png" className="w-[300px]" />
                    </div>
                </div>
                <div className="absolute w-1/2 -right-65 top-20">
                    <img src="./assets/Ellipse.png" />
                </div>
            </div>
        </div>
    )
}

export default Hero;