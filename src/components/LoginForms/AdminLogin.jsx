import axios from "axios";
import React, { useState } from "react";

import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [forgotemail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpData, setOtpData] = useState({});
  const [isopenForgotModal, setIsForgotModal] = useState(false);
  const [floading, setFloading] = useState(false);
  const [isOpenOtpModal, setIsOpenOtpModal] = useState(false);
  const [isOpenPasswordModal, setIsOpenPasswordModal] = useState(false);
  const [fpassword, setFPassword] = useState("");
  const [fconfirmPassword, setFConfirmPassword] = useState("");

  const handleLogin = async () => {
    const data = {
      a_email: email,
      a_password: password,
    };
    try {
      const response = await axios.post(`${endpoint}/admin/login`, data);
      setLoading(false);

      localStorage.setItem("token", JSON.stringify(response?.data?.token));
      localStorage.setItem("user", JSON.stringify(response?.data?.user));

      toast.success(response?.data?.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleForgotPassword = async () => {
    setFloading(true);
    try {
      const response = await axios.post(`${endpoint}/admin/forgot-password`, {
        email: forgotemail,
      });

      toast.success(response?.data?.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setFloading(false);
      setIsForgotModal(false);
      setIsOpenOtpModal(true);
    } catch (error) {
      setFloading(false);
      toast.error(error?.response?.data?.error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleVerifyOTP = async () => {
    setFloading(true);
    try {
      // Call API to verify OTP
      const response = await axios.post(`${endpoint}/admin/verify/otp`, {
        otp,
      });

      setFloading(false);
      setIsOpenOtpModal(false);
      setIsOpenPasswordModal(true);
      setOtpData(response?.data?.otpRecord);

      toast.success(response?.data?.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      // Navigate to screen for entering new password
    } catch (error) {
      setFloading(false);
      toast.error(error?.response?.data?.error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      if (fpassword !== fconfirmPassword) {
        return toast.error("Passwords do not match.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
      setFloading(true);
      // Call API to change password

      const data = {
        email: otpData?.email,
        otp: otpData?.otp,
        newPassword: fpassword,
      };
      await axios.post(`${endpoint}/admin/change-password`, data);
      setFConfirmPassword("");
      setFPassword("");
      setForgotEmail("");
      setOtp("");
      setOtpData({});
      setIsOpenPasswordModal(false);
      setFloading(false);
      toast.success("Password changed successfully.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      // Navigate to login screen or any other desired page
    } catch (error) {
      setFloading(false);
      toast.error(error?.response?.data?.error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="input-login"
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="input-login"
            id="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="btn-login"
            type="button"
            onClick={handleLogin}
            disabled={loading}
          >
            Login{" "}
            {loading && (
              <>
                <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
              </>
            )}
          </button>
          <button
            type="button"
            className="forgot-txt"
            onClick={() => setIsForgotModal(true)}
          >
            Forgot Password?
          </button>
        </div>
      </form>

      {/* Forgot Modal */}
      <div
        className={`fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 ${
          isopenForgotModal ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            <input
              className="input-login mb-4"
              type="email"
              value={forgotemail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Email"
            />
            <div className="flex items-center justify-between">
              <button
                className="btn-login"
                type="button"
                onClick={handleForgotPassword}
                disabled={floading}
              >
                Send OTP{" "}
                {floading && (
                  <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                )}
              </button>
              <button
                className="btn-login bg-gray-400 hover:bg-gray-500"
                type="button"
                onClick={() => setIsForgotModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <div
        className={`fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 ${
          isOpenOtpModal ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
            <input
              className="input-login mb-4"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <div className="flex items-center justify-between">
              <button
                className="btn-login"
                type="button"
                onClick={handleVerifyOTP}
                disabled={floading}
              >
                Verify OTP{" "}
                {floading && (
                  <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                )}
              </button>
              <button
                className="btn-login bg-gray-400 hover:bg-gray-500"
                type="button"
                onClick={() => setIsOpenOtpModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <div
        className={`fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 ${
          isOpenPasswordModal ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <input
              className="input-login mb-4"
              type="password"
              value={fpassword}
              onChange={(e) => setFPassword(e.target.value)}
              placeholder="New Password"
            />
            <input
              className="input-login mb-4"
              type="password"
              value={fconfirmPassword}
              onChange={(e) => setFConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            <div className="flex items-center justify-between">
              <button
                className="btn-login"
                type="button"
                onClick={handleChangePassword}
                disabled={floading}
              >
                Change Password{" "}
                {floading && (
                  <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                )}
              </button>
              <button
                className="btn-login bg-gray-400 hover:bg-gray-500"
                type="button"
                onClick={() => setIsOpenPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
