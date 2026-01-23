import type React from "react";

const CategoryBanner: React.FC<{ heading: string, subHeading: string }> = ({ heading, subHeading }) => {
    return (
        <div className="w-screen p-4 bg-gray-100 mt-8 mb-15 h-64 flex items-center justify-center">
            <div className="space-y-8">
                <h2 className="text-center font-semibold text-5xl font-[Interif]">{heading}</h2>
                <p className="max-w-xl text-center text-lg font-[Interif] m-auto">{subHeading}</p>
            </div>
        </div>
    )
}

export default CategoryBanner;