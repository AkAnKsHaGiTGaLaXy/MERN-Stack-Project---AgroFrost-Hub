import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";

function AdminDatabase() {
  const token = JSON.parse(localStorage.getItem("token"));
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [customerData, setCustomerData] = useState([]);
  const [filteredCustomerData, setFilteredCustomerData] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [filteredOwnerData, setFilteredOwnerData] = useState([]);
  const [customerFilter, setCustomerFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");

  useEffect(() => {
    const fetchCustomerData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `${endpoint}/admin/get/customer/data`,
          config
        );

        setCustomerData(response?.data);
        setFilteredCustomerData(response?.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
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

    const fetchOwnerData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `${endpoint}/admin/get/owner/data`,
          config
        );

        setOwnerData(response?.data);
        setFilteredOwnerData(response?.data);
      } catch (error) {
        console.error("Error fetching owner data:", error);
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

    fetchCustomerData();
    fetchOwnerData();
  }, [token, endpoint]);

  const handleCustomerFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setCustomerFilter(value);
    const filteredData = customerData.filter(
      (item) =>
        item.c_fullName.toLowerCase().includes(value) ||
        item.c_email.toLowerCase().includes(value) ||
        item.c_contactNo.toString().includes(value)
    );
    setFilteredCustomerData(filteredData);
  };

  const handleOwnerFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setOwnerFilter(value);
    const filteredData = ownerData.filter(
      (item) =>
        item.owner_fullName.toLowerCase().includes(value) ||
        item.owner_email.toLowerCase().includes(value) ||
        item.owner_contactNo.toString().includes(value)
    );
    setFilteredOwnerData(filteredData);
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

      <div className="container mx-auto px-4">
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Customer Data</h2>

          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faSearch}
                className="px-2 py-3 bg-redpallete text-white rounded-lg"
              />
              <input
                type="text"
                placeholder="Search Owner"
                value={customerFilter}
                onChange={handleCustomerFilterChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-redpallete"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Contact No</th>
                  <th className="px-4 py-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomerData.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{customer.c_fullName}</td>
                    <td className="px-4 py-2">{customer.c_email}</td>
                    <td className="px-4 py-2">{customer.c_contactNo}</td>
                    <td className="px-4 py-2">{customer.c_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Owner Data</h2>
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faSearch}
                className="px-2 py-3 bg-redpallete text-white rounded-lg"
              />
              <input
                type="text"
                placeholder="Search Owner"
                value={ownerFilter}
                onChange={handleOwnerFilterChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-redpallete"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Contact No</th>
                </tr>
              </thead>
              <tbody>
                {filteredOwnerData.map((owner) => (
                  <tr key={owner._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{owner.owner_fullName}</td>
                    <td className="px-4 py-2">{owner.owner_email}</td>
                    <td className="px-4 py-2">{owner.owner_contactNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDatabase;
