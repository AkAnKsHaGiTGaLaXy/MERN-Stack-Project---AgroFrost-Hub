import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarChart,
  faFilter,
  faRupeeSign,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { Bounce, ToastContainer, toast } from "react-toastify";

function StorageDetailsCard() {
  const token = JSON.parse(localStorage.getItem("token"));
  const [storageData, setStorageData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByPriceHighToLow, setSortByPriceHighToLow] = useState(false);
  const [filteredAndSortedData, setFilteredAndSortedData] = useState([]);
  const endpoint = `${import.meta.env.VITE_KEY}`;

  useEffect(() => {
    fetchStorageDetails();
  }, [token]);

  const fetchStorageDetails = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${endpoint}/user/storage/all`, config);

      if (response?.data) {
        const storageData = response.data;
        setStorageData(storageData);
        updateCapacities(storageData);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const updateCapacities = async (storageData) => {
    try {
      const updatedStorageData = await Promise.all(
        storageData.map(async (record) => {
          const capacityResponse = await axios.get(
            `${endpoint}/user/capacity/current/${record.cs_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const currentCapacity = capacityResponse?.data?.remainingCapacity;
          return {
            ...record,
            cs_capacity: currentCapacity,
          };
        })
      );
      setFilteredAndSortedData(updatedStorageData);
    } catch (error) {
      handleErrors(error);
    }
  };

  const handleErrors = (error) => {
    toast.error(error.response?.data?.error || "An error occurred", {
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
  };

  const filterAndSortStorageData = (data, searchTerm, sortByPriceHighToLow) => {
    let filteredData = data.filter((item) =>
      item.cs_address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortByPriceHighToLow) {
      filteredData.sort((a, b) => a.cs_price - b.cs_price);
    } else {
      filteredData.sort((a, b) => b.cs_price - a.cs_price);
    }

    setFilteredAndSortedData(filteredData);
  };

  const handleSortToggle = () => {
    setSortByPriceHighToLow(!sortByPriceHighToLow);
    filterAndSortStorageData(storageData, searchTerm, !sortByPriceHighToLow);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    filterAndSortStorageData(storageData, e.target.value, sortByPriceHighToLow);
  };

  return (
    <div>
      <ToastContainer />
      <div
        className="flex justify-between flex-wrap items-center gap-2 mx-4"
        id="storage"
      >
        <h1 className="md:text-3xl text-xl  font-medium text-yellowpallete">
          All Storages
        </h1>
        <div className="flex items-center  border-bluepallete border-2 rounded-lg p-2 gap-2">
          {/* Filter Icon */}
          <FontAwesomeIcon icon={faFilter} className="text-bluepallete" />
          {/* Search input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            className="px-2 py-1 border border-gray-300 rounded-lg w-1/2"
            onChange={handleSearchTermChange}
          />

          {/* Toggle button for sorting */}
          <button
            className="bg-bluepallete p-1 rounded-lg w-1/2"
            onClick={handleSortToggle}
          >
            {sortByPriceHighToLow
              ? "Sort by Price Low to High"
              : "Sort by Price High to Low"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-4 my-2">
        {filteredAndSortedData.map((item, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded-xl  shadow-md border-gray-200 border-2 hover:border-greenpallete"
          >
            <img
              src={`${endpoint}/user/images/${item.cs_image}`}
              className="object-cover object-center w-full h-[250px] border border-lightgreenpallete bg-white rounded-lg"
              alt={`${item.cs_name}`}
            />
            <h2 className="text-xl font-bold text-greenpallete mt-2">
              {item.cs_name}
            </h2>
            <div className="flex gap-6 items-center justify-between mt-3 mb-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-yellowpallete w-6 h-6"
                />
                <span className="break-words text-sm text-gray-600">
                  {item.cs_address}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {" "}
                <FontAwesomeIcon
                  icon={faBarChart}
                  className="text-yellowpallete w-6 h-6"
                />
                <span className="break-words text-sm text-gray-600">
                  Capacity {item.cs_capacity}{" "}
                  <sub className="text-sm">(in tons)</sub>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 justify-start">
              <button className="border  border-greenpallete rounded-lg p-2">
                <FontAwesomeIcon
                  icon={faRupeeSign}
                  className="text-greenpallete font-bold"
                />{" "}
                {item.cs_price} /<sub>per day</sub>
              </button>

              <a
                href={`storage/details/${item.cs_id}`}
                className="border bg-yellowpallete rounded-lg p-2 text-white font-bold"
              >
                Book Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StorageDetailsCard;
