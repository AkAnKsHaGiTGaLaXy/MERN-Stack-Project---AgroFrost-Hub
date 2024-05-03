import React from "react";

function Footer() {
  return (
    <footer className="bg-redpallete py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white text-center md:text-left mb-4 md:mb-0">
            <p>&copy; 2024 AgroFrost Hub</p>
            <p>All rights reserved.</p>
          </div>
          <div className="flex items-center">
            <a
              href="#"
              className="text-white hover:text-lightgreenpallete mr-4 transition duration-300"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-white hover:text-lightgreenpallete mr-4 transition duration-300"
            >
              Contact Us
            </a>
            <a
              href="#"
              className="text-white hover:text-lightgreenpallete mr-4 transition duration-300"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
