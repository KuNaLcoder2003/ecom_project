import type React from "react";
import { useNavigate } from "react-router-dom";

const Collections: React.FC = () => {
    return (
        <div className="max-w-[83%] m-auto mt-20 space-y-10">
            <SectionHeading />
            <CollectionGrid />
        </div>
    )
}

const SectionHeading: React.FC = () => {
    return (
        <div className="w-full space-y-1">
            <h2 className="text-4xl font-semibold font-[Interif] text-center">Our Collections</h2>
            <p className="text-lg font-[Interif] text-center">Inspire and let yourself be inspired, from one unique fashion to another.</p>
        </div>
    )
}

const CollectionGrid: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full px-4 mb-16">
            {/* Centered Grid Wrapper */}
            <div onClick={() => navigate('/women')} className="
                max-w-7xl mx-auto
                grid grid-cols-1 md:grid-cols-2
                grid-rows-none md:grid-rows-2
                gap-4
                h-auto md:h-[800px]
            ">
                {/* LEFT BIG CARD */}
                <div className="md:row-span-2 relative rounded-lg overflow-hidden group">
                    <img
                        src="https://framerusercontent.com/images/6BTOlgmHkD2idTJeFOhqDRfYGJI.png?scale-down-to=2048"
                        alt="Women Collection"
                        className="
                            w-full h-full object-cover
                            transition-transform duration-500 ease-out
                            group-hover:scale-[1.05]
                        "
                    />
                    <p className="
                        absolute top-6 left-6
                        text-2xl md:text-3xl
                        font-semibold font-[Interif]
                        drop-shadow-lg
                    ">
                        Women Collection
                    </p>
                </div>

                {/* TOP RIGHT CARD */}
                <div onClick={() => navigate('/men')} className="relative rounded-lg overflow-hidden group">

                    <img
                        src="https://framerusercontent.com/images/uu7gVGc6h2mMRMjcOHoypsA4Lvo.png"
                        alt="Men Collection"
                        className="
                            w-full h-full object-cover
                            transition-transform duration-500 ease-out
                            group-hover:scale-[1.05]
                        "
                    />
                    <p className="
                        absolute top-6 left-6
                        text-2xl md:text-3xl
                        font-semibold font-[Interif]
                        
                        drop-shadow-lg
                    ">
                        Men Collection
                    </p>
                </div>

                {/* BOTTOM RIGHT CARD */}
                <div onClick={() => navigate('/bags')} className="relative rounded-lg overflow-hidden group">

                    <img
                        src="https://framerusercontent.com/images/1edwDzEP1a3uFGghWkzpDy0Bn9Q.png"
                        alt="Accessories Collection"
                        className="
                            w-full h-full object-cover
                            transition-transform duration-500 ease-out
                            group-hover:scale-[1.05]
                        "
                    />
                    <p className="
                        absolute top-6 left-6
                        text-2xl md:text-3xl
                        font-semibold font-[Interif]
                        
                        drop-shadow-lg
                    ">
                        Bags
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Collections;