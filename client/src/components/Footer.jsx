const Footer = () => (
  <footer className="bg-[#1f2937] dark:bg-[#1f2937] text-white py-8 px-4 border-t border-gray-700 dark:border-gray-700 transition-colors">
    <div className="max-w-6xl mx-auto text-center">
      <p className="text-sm md:text-base font-light text-gray-300">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-white">codeSphere</span>. All rights reserved.
      </p>
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Privacy</a>
        <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Terms</a>
        <a href="mailto:rade47.com@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Contact</a> 
        {/* add visited count here */}
      </div>
    </div>
  </footer>
);

export default Footer;
