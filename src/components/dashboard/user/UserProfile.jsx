import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserProfile() {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [formData, setFormData] = useState({
    c_address: "",
    c_contactNo: 0,
    c_email: "",
    c_fullName: "",
    c_id: "",
    role: "",
    _id: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `${endpoint}/user/${user?.id}`,
          config
        );

        setFormData(response?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${endpoint}/user/${formData._id}`,
        formData,
        config
      );

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
    } catch (error) {
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
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="mb-5">
        <h2 className="font-inter font-medium text-xl border-b border-gray-300 mb-2 px-2 py-2">
          My Profile
        </h2>

        {/* Profile */}
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 mx-4">
          <div className=" flex flex-col gap-9">
            <div className="rounded-sm border  bg-white shadow-md ">
              <div className="border-b  py-4 px-6 ">
                <h3 className="font-medium text-black">Personal Information</h3>
              </div>
              <div className="flex flex-col gap-5 p-6">
                <div className="mt-5 flex items-center justify-center">
                  <img
                    src="/src/assets/user_avtar.png"
                    className="rounded-full w-20 h-20 border"
                    alt="Profile"
                  />
                </div>

                <div className="mt-5 grid md:grid-cols-2 md:gap-6">
                  {/* Display input fields */}
                  <div className="flex flex-col">
                    <label className="font-medium">Full Name</label>
                    <input
                      type="text"
                      name="c_fullName"
                      value={formData.c_fullName}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">Email</label>
                    <input
                      type="email"
                      name="c_email"
                      value={formData.c_email}
                      disabled
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">Contact No</label>
                    <input
                      type="text"
                      name="c_contactNo"
                      value={formData.c_contactNo}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">Customer Id </label>
                    <input
                      type="text"
                      name="c_id"
                      value={formData.c_id}
                      onChange={handleInputChange}
                      disabled
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium">Customer Address</label>
                    <textarea
                      type="text"
                      name="c_address"
                      value={formData.c_address}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium">Account Type</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                </div>

                {/* Actions Button */}

                <div className="flex gap-3 justify-between items-center mt-3 mb-5">
                  <button
                    onClick={handleSave}
                    className="bg-white shadow rounded-lg border px-6 py-2 font-inter font-medium hover:bg-greenpallete hover:text-white border-gray-300"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
