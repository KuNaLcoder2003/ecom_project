import type React from "react";

const NewsLetter: React.FC = () => {
    return (
        <div className={`w-screen h-[230px] bg-stone-100 flex items-center`}>
            <div className="flex relative w-full justify-around items-center h-full z-10 p-4">
                <div className="flex flex-col items-baseline gap-12 z-20 justify-center">
                    <div className="flex flex-col items-baseline justify-center">
                        <h2 className="text-4xl font-bold font-[InterSerif]">Join Our NewsLetter</h2>
                        <p className="text-stone-400 font-[InterSerif] text-sm w-[70%]">We love to surprise our subscribers with occasional gifts.</p>
                    </div>

                    <button className="text-white bg-black p-2 px-4 rounded-lg cursor-pointer">{"View Collection   ->"}</button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-full max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter Your Email..."
                                className="w-full pl-4 pr-4 py-3 border border-stone-400 rounded-lg text-gray-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="p-2">
                        <button className="p-2 px-4 text-white bg-black rounded-lg cursor-pointer">Subscribe</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NewsLetter;