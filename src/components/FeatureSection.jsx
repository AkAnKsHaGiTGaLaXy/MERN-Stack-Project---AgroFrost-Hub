import React from "react";

function FeatureSection() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-center font-bold mb-8">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center bg-white shadow-lg p-2 border border-gray-300">
            <img
              src="/src/assets/tempcontrol.png"
              alt="Feature 1"
              className="h-24 w-24 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Temperature Control</h3>
            <p className="text-gray-700 text-center">
              Maintain optimal temperatures for various products.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center bg-white shadow-lg p-2 border border-gray-300">
            <img
              src="/src/assets/capacity.png"
              alt="Feature 2"
              className="h-24 w-24 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">High Capacity</h3>
            <p className="text-gray-700 text-center">
              Large storage capacity to accommodate bulk produce.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center bg-white shadow-lg p-2 border border-gray-300">
            <img
              src="/src/assets/247.png"
              alt="Feature 1"
              className="h-24 w-24 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
            <p className="text-gray-700 text-center">
              Accessible round the clock for convenience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
