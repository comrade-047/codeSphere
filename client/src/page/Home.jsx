import Hero from "../components/Home/Hero";
import Testimonial from "../components/Home/Testimonial";
import Footer from "../components/Footer";
import Features from "../components/Home/Features";

const Home = () => {
  return (
    <>
      <main className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors">
        <Hero />
        <Features />
        <Testimonial />
      </main>
      <Footer />
    </>
  );
};

export default Home;
