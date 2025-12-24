import type React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import BestSellers from "../components/BestSellers";
import Featured from "../components/Featured";
import Footer from "../components/Footer";

const Home: React.FC = () => {
    return (
        <div className="w-screen h-auto overflow-x-hidden">
            <Navbar />
            <Hero show_blob={true} image_src="./assets/Hero-Image.png" image_class="w-[300px]" title="Fresh Arrivals Online" content="Discover Our Newest Collection Now" />
            <Features />
            <BestSellers />
            <Hero show_blob={false} class_name="mt-60" image_src="./assets/Category-Image.png" image_class="w-[300px]" title="Browse Our Fashion Paradise!" content="Step into a world of style and explore our diverse collection of clothing categories" />
            <Featured />
            <Footer />
        </div>
    )
}

export default Home;