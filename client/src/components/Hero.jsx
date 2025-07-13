import { Link } from "react-router-dom";

const Hero = () => (
  <section className="text-center py-20 bg-gray-50">
    <h2 className="text-4xl font-bold mb-4">
      Code Anytime, anywhere
    </h2>
    <p className="text-lg mb-6 max-w-xl mx-auto">
        A global, all-encompassing space for coding challenges
    </p>
    <Link to= "signup" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
        Start your journey
    </Link>
  </section>
);

export default Hero;
