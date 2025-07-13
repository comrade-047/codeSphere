const Footer = () => (
  <footer className="bg-[#1f2937] text-white py-8 px-4 border-t border-gray-700">
    <div className="max-w-6xl mx-auto text-center">
      <p className="text-sm md:text-base font-light">
        &copy; {new Date().getFullYear()} <span className="font-semibold">codeSphere</span>. All rights reserved.
      </p>
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <a href="#" className="hover:text-blue-400 transition-colors duration-200">Privacy</a>
        <a href="#" className="hover:text-blue-400 transition-colors duration-200">Terms</a>
        <a href="#" className="hover:text-blue-400 transition-colors duration-200">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
