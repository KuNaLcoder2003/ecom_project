import Navbar from "../components/Navbar";
import Hero from "../components/Hero"
import NewArrivals from "../components/NewArrivals";
import Banner from "../components/Banner";
import Collections from "../components/Collections";


const Home = () => {
    return (
        <div className="w-full">
            <Navbar word="" />

            <Hero />

            <NewArrivals />

            <Banner />

            <Collections />
        </div>
    );
};

export default Home;
