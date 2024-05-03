import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OwnerProfileModal from "./OwnerProfileModal";

function AdminStorage() {
  const token = JSON.parse(localStorage.getItem("token"));
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [notApproveData, setNotApproveData] = useState([]);
  const [approveData, setApproveData] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    fetchRecentApprove();
    fetchApprove();
  }, [token, endpoint]);

  const fetchRecentApprove = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${endpoint}/admin/get/notapprove/storage`,
        config
      );

      setNotApproveData(response?.data);

      console.log(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchApprove = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${endpoint}/admin/get/approve/storage`,
        config
      );

      setApproveData(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(
        `${endpoint}/admin/set/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  const handleDisApprove = async (id) => {
    try {
      const response = await axios.put(
        `${endpoint}/admin/set/notapprove/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  const handleViewProfile = (owner) => {
    setSelectedOwner(owner);
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setSelectedOwner(null);
    setIsProfileModalOpen(false);
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
      <div className="mb-5 mx-4">
        <h2 className="font-inter font-medium text-xl border-b border-gray-300 mb-2 px-2 py-2">
          Request for Approval
        </h2>

        {!notApproveData.length > 0 && <span>No Recent Request</span>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {notApproveData.map((storage) => (
            <div
              key={storage._id}
              className="bg-white rounded-lg p-4 border-2 border-greenpallete shadow-lg"
            >
              <img
                src={`${endpoint}/user/images/${storage?.cs_image}`}
                alt="Storage Image"
                className="object-cover object-center w-52"
              />
              <h3 className="font-semibold text-lg mb-2">{storage?.cs_name}</h3>
              <p className="text-gray-600 mb-2">{storage?.cs_address}</p>
              <div className="flex gap-4 items-center">
                <p className="text-gray-600 mb-2">
                  Capacity: {storage?.cs_capacity}
                </p>
                <p className="text-gray-600 mb-2">Price: {storage?.cs_price}</p>
              </div>
              <p className="text-gray-600 mb-4">Timing:</p>
              <ul className="list-disc pl-4">
                {Object.entries(storage.cs_time).map(([day, time]) => (
                  <li key={day}>
                    {day}: {time}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between gap-3 mt-2">
                <button
                  onClick={() => handleApprove(storage._id)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleViewProfile(storage.owner_ref)}
                  className="bg-redpallete  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-inter font-medium text-xl border-b border-gray-300 mb-2 px-2 py-2">
          Approved Stoarages
        </h2>

        {!approveData.length > 0 && <span>No data found</span>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {approveData.map((storage) => (
            <div
              key={storage._id}
              className="bg-white rounded-lg p-4 border-2 border-greenpallete shadow-lg"
            >
              <img
                src={`${endpoint}/user/images/${storage?.cs_image}`}
                alt="Storage Image"
                className="object-cover object-center w-52"
              />
              <h3 className="font-semibold text-lg mb-2">{storage?.cs_name}</h3>
              <p className="text-gray-600 mb-2">{storage?.cs_address}</p>
              <div className="flex gap-4 items-center">
                <p className="text-gray-600 mb-2">
                  Capacity: {storage?.cs_capacity}
                </p>
                <p className="text-gray-600 mb-2">Price: {storage?.cs_price}</p>
              </div>
              <p className="text-gray-600 mb-4">Timing:</p>
              <ul className="list-disc pl-4">
                {Object.entries(storage.cs_time).map(([day, time]) => (
                  <li key={day}>
                    {day}: {time}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between gap-3 mt-2">
                <button
                  onClick={() => handleDisApprove(storage._id)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Disapprove
                </button>

                <button
                  onClick={() => handleViewProfile(storage.owner_ref)}
                  className="bg-redpallete  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <OwnerProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        owner={selectedOwner}
      />
    </>
  );
}

export default AdminStorage;
