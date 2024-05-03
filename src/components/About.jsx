import React from "react";

function About() {
  return (
    <section className="py-12 bg-white" id="about">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Content */}
          <div>
            <img
              src="/src/assets/aboutcs.jpg"
              alt="About Us"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          {/* Right Content */}
          <div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              blandit, urna nec viverra efficitur, elit elit faucibus est, ac
              aliquam ipsum nisi vel mauris. Vestibulum convallis libero vel
              tortor sagittis, ac hendrerit dui tincidunt. Suspendisse potenti.
              Nam nec orci et sem consectetur pulvinar. Nunc ullamcorper tortor
              velit, et sagittis sem fringilla id. Morbi ultricies odio et felis
              aliquet fringilla. Proin nec massa feugiat, maximus ligula id,
              fermentum lectus. In ut lectus sit amet ligula consequat tincidunt
              non sit amet ex. Duis vestibulum tortor eu mi vehicula, vitae
              varius ante tincidunt. Integer suscipit sapien at turpis consequat
              convallis. Sed finibus elit ac varius dignissim. Curabitur dictum
              nec ex ut aliquet.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia Curae; Donec vel sem at ligula pellentesque
              placerat. Integer nec dui tortor. Vivamus interdum eget purus id
              congue. Nam tincidunt tincidunt magna, non iaculis odio laoreet
              vel. Mauris eu fringilla est. Nullam eu justo nec libero aliquam
              laoreet id nec mauris. Vivamus varius dui non risus finibus, et
              tristique elit ullamcorper. Vestibulum nec rhoncus arcu. Nam ac
              tellus vel nisl bibendum dignissim.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
