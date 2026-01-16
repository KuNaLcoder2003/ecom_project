const Hero = () => {
    return (
        <div className="w-[100%] lg:max-w-[83%] mx-auto p-2 mt-6 overflow-x-hidden">
            <div
                className="relative w-full h-[420px] sm:h-[520px] md:h-[650px] lg:h-[790px]
                   rounded-lg shadow-lg overflow-x-hidden"
                style={{
                    backgroundImage:
                        "url(https://framerusercontent.com/images/9GMR3b4eUoRdQItvULpwBeCIiE.jpeg)",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >



                <div className="absolute top-16 sm:top-24 md:top-32 lg:top-20
                        left-6 sm:left-10 md:left-16 lg:left-20
                        right-6">
                    <p
                        className="font-[Interif] font-bold text-white
                       text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                       leading-tight"
                    >
                        STYLE REDEFINED, EFFORTLESSLY YOURS
                    </p>
                </div>


                <div
                    className="absolute bottom-10 sm:bottom-24 md:bottom-32 lg:bottom-10
                     left-6 sm:left-10 md:left-16 lg:left-20
                     flex flex-col lg:flex-row lg:items-center sm:items-center
                     gap-4"
                >
                    <button
                        className="py-3 px-8 md:px-10 bg-white rounded-full
                       text-black font-[Interif] text-base md:text-lg
                       hover:bg-black hover:text-white
                       transition-colors duration-300"
                    >
                        Shop Collections
                    </button>

                    <p
                        className="font-[Interif] font-bold text-white
                       text-lg sm:text-xl md:text-2xl"
                    >
                        Wear like a pro
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Hero;
