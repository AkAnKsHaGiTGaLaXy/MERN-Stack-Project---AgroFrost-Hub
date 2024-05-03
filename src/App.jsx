import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import CsDetails from "./components/CsDetails";
import AuthGuard from "./components/guards/AuthGuard";
import Dashboard from "./components/dashboard/Dashboard";
import UserProfile from "./components/dashboard/user/UserProfile";
import OwnerProfile from "./components/dashboard/owner/OwnerProfile";
import AdminProfile from "./components/dashboard/admin/AdminProfile";
import UserBooking from "./components/dashboard/user/UserBooking";
import OwnerBooking from "./components/dashboard/owner/OwnerBooking";
import AdminBooking from "./components/dashboard/admin/AdminBooking";
import UserPayment from "./components/dashboard/user/UserPayment";
import OwnerPayment from "./components/dashboard/owner/OwnerPayment";
import AdminPayment from "./components/dashboard/admin/AdminPayment";
import AdminOverView from "./components/dashboard/admin/AdminOverView";
import UserOverView from "./components/dashboard/user/UserOverView";
import OwnerOverview from "./components/dashboard/owner/OwnerOverview";
import AdminStorage from "./components/dashboard/admin/AdminStorage";
import AdminDatabase from "./components/dashboard/admin/AdminDatabase";

function App() {
  // Profile Router
  const ProfileRouter = () => {
    // Retrieve and parse user role from localStorage
    const userRole = JSON.parse(localStorage.getItem("user"));

    // Check the user's role and render the appropriate component
    switch (userRole?.role) {
      case "user":
        return <UserProfile />;
      case "owner":
        return <OwnerProfile />;
      case "admin":
        return <AdminProfile />;
      default:
        return null;
    }
  };

  // OverViewRouter
  const OverViewRouter = () => {
    // Retrieve and parse user role from localStorage
    const userRole = JSON.parse(localStorage.getItem("user"));

    // Check the user's role and render the appropriate component
    switch (userRole?.role) {
      case "user":
        return <UserOverView />;
      case "owner":
        return <OwnerOverview />;
      case "admin":
        return <AdminOverView />;
      default:
        return null;
    }
  };

  // Booking Router
  const BookingRouter = () => {
    // Retrieve and parse user role from localStorage
    const userRole = JSON.parse(localStorage.getItem("user"));

    // Check the user's role and render the appropriate component
    switch (userRole?.role) {
      case "user":
        return <UserBooking />;
      case "owner":
        return <OwnerBooking />;
      case "admin":
        return <AdminBooking />;
      default:
        return null;
    }
  };

  // Payment Router
  const PaymentRouter = () => {
    // Retrieve and parse user role from localStorage
    const userRole = JSON.parse(localStorage.getItem("user"));

    // Check the user's role and render the appropriate component
    switch (userRole?.role) {
      case "user":
        return <UserPayment />;
      case "owner":
        return <OwnerPayment />;
      case "admin":
        return <AdminPayment />;
      default:
        return null;
    }
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard allowedRoles={["admin", "user", "owner"]}>
                <Layout>
                  <Home />
                </Layout>
              </AuthGuard>
            }
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route
            path="/storage/details/:csid"
            element={
              <Layout>
                <AuthGuard allowedRoles={["admin", "user", "owner"]}>
                  <CsDetails />
                </AuthGuard>
              </Layout>
            }
          ></Route>

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard allowedRoles={["admin", "user", "owner"]}>
                <Dashboard />
              </AuthGuard>
            }
          >
            <Route
              index
              element={
                <AuthGuard allowedRoles={["user", "owner", "admin"]}>
                  <OverViewRouter />
                </AuthGuard>
              }
            />
            <Route
              path="profile"
              element={
                <AuthGuard allowedRoles={["user", "admin", "owner"]}>
                  <ProfileRouter />
                </AuthGuard>
              }
            />
            <Route
              path="bookings"
              element={
                <AuthGuard allowedRoles={["user", "admin", "owner"]}>
                  <BookingRouter />
                </AuthGuard>
              }
            />

            <Route
              path="payments"
              element={
                <AuthGuard allowedRoles={["user", "admin", "owner"]}>
                  <PaymentRouter />
                </AuthGuard>
              }
            />

            <Route
              path="overview"
              element={
                <AuthGuard allowedRoles={["user", "admin", "owner"]}>
                  <OverViewRouter />
                </AuthGuard>
              }
            />

            <Route
              path="coldstorage"
              element={
                <AuthGuard allowedRoles={["admin"]}>
                  <AdminStorage />
                </AuthGuard>
              }
            />

            <Route
              path="database"
              element={
                <AuthGuard allowedRoles={["admin"]}>
                  <AdminDatabase />
                </AuthGuard>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
