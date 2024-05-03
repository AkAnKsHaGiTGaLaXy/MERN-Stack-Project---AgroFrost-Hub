import React, { useState } from "react";
import CustomerLogin from "./LoginForms/CustomerLogin";
import OwnerLogin from "./LoginForms/OwnerLogin";
import AdminLogin from "./LoginForms/AdminLogin";

const LoginTabs = () => {
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
          alt="Login Image"
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
            className={`mr-4 focus:outline-none ${
              activeTab === "owner" ? "active-tab" : ""
            }`}
            onClick={() => handleTabChange("owner")}
          >
            Owner
          </button>
          <button
            className={`focus:outline-none ${
              activeTab === "admin" ? "active-tab" : ""
            }`}
            onClick={() => handleTabChange("admin")}
          >
            Admin
          </button>
        </div>
        <div className="w-full">
          {activeTab === "customer" && <CustomerLogin />}
          {activeTab === "owner" && <OwnerLogin />}
          {activeTab === "admin" && <AdminLogin />}
        </div>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-lightgreenpallete font-bold">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginTabs;
