import Navbar from "../components/Navbar";
import Hero from "../components/Hero"
import { FabricTabs } from "../components/Hero";
import { NewestFabrics } from "../components/Hero";
import AboutStory from "../components/AboutStory";
import PopularFabrics from "../components/PopularFabrics";
import BestCategory from "../components/BestCategory";
import InstagramGrid from "../components/Instagramgrid";
import CtaSection from "../components/CtaSections";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="w-full overflow-x-hidden">
            <Navbar word="" />

            <Hero />

            <FabricTabs />

            <NewestFabrics />

            <AboutStory />

            <PopularFabrics />

            <BestCategory />

            <InstagramGrid />

            <CtaSection />

            <Footer />
        </div>
    );
};

export default Home;
