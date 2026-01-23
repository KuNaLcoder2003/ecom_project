import type React from "react";
import Category from "../components/Category";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CategoryBanner from "../components/CategoryBanner";

const Womens: React.FC = () => {
    return (
        <div className="w-screen">
            <Navbar word="" />
            <CategoryBanner heading="Womens Collection" subHeading="Discover your perfect style with our curated collection for women—fashion designed for you." />
            <Category category="Women" />
            <Footer />
        </div>
    )
}

export default Womens;