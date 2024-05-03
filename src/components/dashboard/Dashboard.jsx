import React from "react";
import { Outlet } from "react-router-dom";
import SidebarDashboard from "./SidebarDashboard";

function Dashboard() {
  return (
    <>
      <SidebarDashboard />
      <div className="bg-white h-screen">
        <div className="container mx-auto ">
          {" "}
          {/*pt-5 sm:pt-10 px-4 */}
          <div className="ml-0 sm:ml-64 ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
