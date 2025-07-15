import { Link } from 'react-router-dom'; 
import { Loader, HardHat } from 'lucide-react';

const UnderConstructionPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-6 border-2 border-gray-300 rounded-xl bg-white shadow-lg max-w-lg w-full">
        {/* Hard Hat Icon for construction */}
        <HardHat className="mx-auto text-yellow-500 w-16 h-16 mb-4" />
        
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Page Under Construction</h1>
        <p className="text-lg text-gray-600 mb-6">We are working hard to bring you this page. Check back soon!</p>
        
        {/* Spinner with loader icon */}
        <div className="mb-6">
          <Loader className="mx-auto text-gray-500 w-12 h-12 animate-spin" />
        </div>

        {/* Link to Home */}
        <Link to="/" className="text-lg text-gray-700 font-semibold border-2 border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 hover:text-gray-800 transition duration-300">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
