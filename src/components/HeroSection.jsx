import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-white  py-20 overflow-hidden">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        {/* Left Column (Title and Description) */}
        <div className="lg:w-1/2 px-6 lg:px-0">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-yellowpallete">
            Welcome to Our Website
          </h1>
          <p className="text-lg lg:text-xl mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam.
          </p>
          <a
            href="#storage"
            className="bg-yellowpallete text-gray-900 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out hover:bg-gray-300"
          >
            Book Now
          </a>
        </div>
        {/* Right Column (Image) */}
        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <img
            src="./src/assets/heroimg.jpeg"
            alt="Hero Image"
            className="mx-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
