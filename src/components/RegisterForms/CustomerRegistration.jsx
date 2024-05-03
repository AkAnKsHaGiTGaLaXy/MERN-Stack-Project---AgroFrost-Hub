import axios from "axios";
import React, { useState } from "react";

import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [formData, setFormData] = useState({
    c_fullName: "",
    c_email: "",
    c_contactNo: "",
    c_address: "",
    c_password: "",
    c_confirmPass: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${endpoint}/user/register`, formData);
      setLoading(false);

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

      navigate("/login");
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

  return (
    <div className="max-w-md mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Customer Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="c_fullName"
          >
            Full Name
          </label>
          <input
            className="input-register"
            id="c_fullName"
            type="text"
            placeholder="Full Name"
            name="c_fullName"
            value={formData.c_fullName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="c_email"
          >
            Email
          </label>
          <input
            className="input-register"
            id="c_email"
            type="email"
            placeholder="Email"
            name="c_email"
            value={formData.c_email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="c_contactNo"
          >
            Contact Number
          </label>
          <input
            className="input-register"
            id="c_contactNo"
            type="text"
            placeholder="Contact Number"
            name="c_contactNo"
            value={formData.c_contactNo}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="c_address"
          >
            Address
          </label>
          <input
            className="input-register"
            id="c_address"
            type="text"
            placeholder="Address"
            name="c_address"
            value={formData.c_address}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="c_password"
          >
            Password
          </label>
          <input
            className="input-register"
            id="c_password"
            type="password"
            placeholder="Password"
            name="c_password"
            value={formData.c_password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="c_confirmPass"
          >
            Confirm Password
          </label>
          <input
            className="input-register"
            id="c_confirmPass"
            type="password"
            placeholder="Confirm Password"
            name="c_confirmPass"
            value={formData.c_confirmPass}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="btn-login"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            Register{" "}
            {loading && (
              <>
                <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerRegistration;
