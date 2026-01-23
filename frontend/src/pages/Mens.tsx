import type React from "react";
import Category from "../components/Category";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CategoryBanner from "../components/CategoryBanner";

const Mens: React.FC = () => {
    return (
        <div className="w-screen">
            <Navbar word="" />
            <CategoryBanner heading="Mens Collection" subHeading="Discover timeless style with our curated collection for men—sharp, sleek, and confident." />
            <Category category="Men" />
            <Footer />
        </div>
    )
}

export default Mens;