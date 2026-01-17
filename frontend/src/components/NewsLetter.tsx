import type React from "react";

const NewsLetter: React.FC = () => {
    return (
        <div className="max-w-7xl m-auto flex items-center mt-10 h-[400px] mb-10">
            <div className="w-full p-10 flex items-center bg-gray-100 h-full rounded-l-lg">
                <div className="flex flex-col items-baseline gap-2">
                    <h3 className="text-4xl font-[Interif] font-medium">Join our newsletter. <br /> Enjoy big discounts.</h3>
                    <p className="text-lg font-[Interif] font-light">Hear what they say about us</p>
                    <div className="mt-6 flex items-center gap-4">
                        <input
                            className="w-[100%] bg-gray-100 rounded-lg px-6 py-2 font-[Interif] border border-zinc-300"
                            placeholder="example@gmail.com"
                        />
                        <button className="px-4 py-2 text-white bg-black text-center rounded-lg font-[Interif]">SignUp</button>
                    </div>
                </div>
            </div>
            <div className="w-full rounded-top-lg h-full">
                <img src="https://framerusercontent.com/images/aS0CKio804CAynX0og6pE47HiZ4.webp?scale-down-to=2048" className="object-cover rounded-r-lg h-full" />
            </div>
        </div>
    )
}

export default NewsLetter;