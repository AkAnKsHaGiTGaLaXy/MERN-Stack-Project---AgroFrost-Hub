import React, { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OwnerRegistration = () => {
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerContactNo, setOwnerContactNo] = useState("");

  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerConfirmPass, setOwnerConfirmPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        owner_fullName: ownerFullName,
        owner_email: ownerEmail,
        owner_contactNo: ownerContactNo,
        owner_password: ownerPassword,
        owner_confirmPass: ownerConfirmPass,
      };

      const response = await axios.post(`${endpoint}/owner/register`, formData);
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
      <h2 className="text-2xl font-bold mb-4">Owner Registration</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="owner_fullName"
          >
            Full Name
          </label>
          <input
            className="input-register"
            id="owner_fullName"
            type="text"
            placeholder="Full Name"
            name="owner_fullName"
            value={ownerFullName}
            onChange={(e) => setOwnerFullName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="owner_email"
          >
            Email
          </label>
          <input
            className="input-register"
            id="owner_email"
            type="email"
            placeholder="Email"
            name="owner_email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="owner_contactNo"
          >
            Contact Number
          </label>
          <input
            className="input-register"
            id="owner_contactNo"
            type="text"
            placeholder="Contact Number"
            name="owner_contactNo"
            value={ownerContactNo}
            onChange={(e) => setOwnerContactNo(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="owner_password"
          >
            Password
          </label>
          <input
            className="input-register"
            id="owner_password"
            type="password"
            placeholder="Password"
            name="owner_password"
            value={ownerPassword}
            onChange={(e) => setOwnerPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="owner_confirmPass"
          >
            Confirm Password
          </label>
          <input
            className="input-register"
            id="owner_confirmPass"
            type="password"
            placeholder="Confirm Password"
            name="owner_confirmPass"
            value={ownerConfirmPass}
            onChange={(e) => setOwnerConfirmPass(e.target.value)}
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

export default OwnerRegistration;
