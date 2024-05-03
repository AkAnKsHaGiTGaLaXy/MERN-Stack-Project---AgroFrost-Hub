import React from "react";
import HeroSection from "./HeroSection";
import StorageDetailsCard from "./StorageDetailsCard";
import FeatureSection from "./FeatureSection";
import About from "./About";
import Contact from "./Contact";

function Home() {
  return (
    <div>
      <HeroSection />
      <StorageDetailsCard />
      <FeatureSection />
      <About />
      <Contact />
    </div>
  );
}

export default Home;
