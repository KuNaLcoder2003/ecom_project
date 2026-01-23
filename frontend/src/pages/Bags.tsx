import type React from "react";
import Navbar from "../components/Navbar";
import CategoryBanner from "../components/CategoryBanner";
import Category from "../components/Category";
import Footer from "../components/Footer";

const Bags: React.FC = () => {
    return (
        <div className="w-screen">
            <Navbar word="" />
            <CategoryBanner heading="Bags Collection" subHeading="Find the perfect blend of style and function with our curated bag collection." />
            <Category category="Bags" />
            <Footer />
        </div>
    )
}

export default Bags;