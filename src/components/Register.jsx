import React, { useState } from "react";
import CustomerRegistration from "./RegisterForms/CustomerRegistration";
import OwnerRegistration from "./RegisterForms/OwnerRegistration";

function Register() {
  const [activeTab, setActiveTab] = useState("customer");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen">
      {/* Image (Hidden on Mobile) */}
      <div className="md:w-1/2 flex justify-center items-center mb-4 md:mb-0 hidden sm:block">
        <img
          src="src/assets/cold_storage_warehouse.jpg"
          alt="Registration Image"
          className="max-w-full max-h-full"
        />
      </div>
      {/* Tabs */}
      <div className="w-full md:w-1/2 md:pl-8">
        <div className="flex justify-center mb-4">
          <button
            className={`mr-4 focus:outline-none ${
              activeTab === "customer" ? "active-tab" : ""
            }`}
            onClick={() => handleTabChange("customer")}
          >
            Customer
          </button>
          <button
            className={`focus:outline-none ${
              activeTab === "owner" ? "active-tab" : ""
            }`}
            onClick={() => handleTabChange("owner")}
          >
            Owner
          </button>
        </div>
        <div className="w-full">
          {activeTab === "customer" && <CustomerRegistration />}
          {activeTab === "owner" && <OwnerRegistration />}
        </div>
        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-redpallete font-bold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
