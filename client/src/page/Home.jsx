import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import Testimonial from "../components/Testimonial";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Features from "../components/Features";

const  Home = () => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');
    return (
        <>
            {!isDashboard && <Header/>}
            <main className="min-h-screen">
                <Hero/>
                <Features/>
                <Testimonial/>
            </main>
            {!isDashboard && <Footer/>}
        </>
    )
}

export default Home;