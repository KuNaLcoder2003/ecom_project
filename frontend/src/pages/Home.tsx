import type React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import BestSellers from "../components/BestSellers";

const Home: React.FC = () => {
    return (
        <div className="w-screen h-auto overflow-x-hidden">
            <Navbar />
            <Hero />
            <Features />
            <BestSellers />
        </div>
    )
}

export default Home;