import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAreaChart,
  faBoxOpen,
  faLocationDot,
  faRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import { Bounce, ToastContainer, toast } from "react-toastify";

function CsDetails() {
  const { csid } = useParams();
  const [storageData, setStorageData] = useState({});
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [isOpen, setIsOpen] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [formData, setFormData] = useState({
    b_checkInDate: "",
    b_checkOutDate: "",
    b_goodsQuantity: "",
    cs_price: storageData ? storageData.cs_price : 0,
  });

  useEffect(() => {
    if (storageData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        cs_price: storageData.cs_price,
      }));
    }
  }, [storageData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchStorageDetails();
    currentCapacity(csid);
  }, [user?.id]);

  const fetchStorageDetails = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${endpoint}/user/storage/${csid}`,
        config
      );

      if (response?.data) {
        setStorageData(response?.data);
        currentCapacity(csid);
      }
    } catch (error) {
      toast.error(error.response.data.error, {
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

  const handleOpenBookingModal = () => {
    if (user?.role !== "user") {
      return toast.error("This Feature is only for Farmers", {
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

    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${endpoint}/user/createorder`,
        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response;

      const options = {
        key: "rzp_test_a0isCmKeRg2h6m",
        amount: data?.amount,
        currency: "INR",
        name: "AgroFrost Hub Pvt Ltd",
        description: `paid to ${storageData.owner_id}`,
        order_id: data?.id,
        handler: function (response) {
          savePaymentDetails(data);
        },
        prefill: {
          name: `${user?.username}`,
          email: `${user?.email}`,
          contact: 8456259656,
        },
        theme: {
          color: "#E45F2B",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
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

  const savePaymentDetails = async (paymentResponse) => {
    try {
      const data = {
        cs_id: storageData?.cs_id,
        c_id: user?.uid,
        amount: paymentResponse.amount,
        b_checkInDate: formData?.b_checkInDate,
        b_checkOutDate: formData?.b_checkOutDate,
        b_goodsQuantity: formData?.b_goodsQuantity,
        p_id: paymentResponse.id,
      };

      const axiosResponse = await axios.post(
        `${endpoint}/user/savepayment`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(axiosResponse?.data?.message, {
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

      handleSendInvoice(axiosResponse?.data?.b_id);
      currentCapacity(csid);
      handleClose();
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

  //sending Email
  const handleSendInvoice = async (b_id) => {
    try {
      const response = await axios.post(
        `${endpoint}/user/send/invoice/${b_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Set the response type to blob
        }
      );

      // Create a blob object from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the blob object
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger a click event to download the file
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
    }
  };
  const handleCheckOutCapaCity = async () => {
    try {
      const response = await axios.get(
        `${endpoint}/user/capacity/${storageData?.cs_id}?startDate=${formData?.b_checkInDate}&endDate=${formData?.b_checkOutDate}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCapacity(response?.data?.remainingCapacity);
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

  const currentCapacity = async (cs_id) => {
    try {
      const response = await axios.get(
        `${endpoint}/user/capacity/current/${cs_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStorageData((prevFormData) => ({
        ...prevFormData,
        cs_capacity: response?.data?.remainingCapacity,
      }));
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
      <div className="container mx-auto bg-white  py-10 overflow-hidden p-2">
        <ToastContainer />
        <h1 className="text-redpallete font-bold md:text-2xl text-xl  mb-5">
          Storage Details
        </h1>
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-3">
          <div className="lg:w-1/2 px-6 lg:px-0">
            <img
              src={`${endpoint}/user/images/${storageData.cs_image}`}
              alt={storageData.cs_title}
              className="w-full h-[400px] object-fill object-center border-2 rounded-lg shadow border-greenpallete"
            />
          </div>

          <div className="lg:w-1/2 px-6 lg:px-0">
            <h2 className="text-lg md:text-2xl font-bold">
              {storageData.cs_name}
            </h2>
            <h3 className="text-[18px] text-greenpallete font-bold mt-3">
              Storage Area
            </h3>
            <div className="flex items-center gap-8">
              <p className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faAreaChart}
                  className="w-8 h-8 text-yellowpallete"
                />{" "}
                Area : {storageData.cs_area} <sup>m2</sup>
              </p>
              <p className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="w-8 h-8 text-yellowpallete"
                />
                Capacity : {storageData?.cs_capacity} <sup>tons</sup>
              </p>
            </div>
            <FontAwesomeIcon
              icon={faLocationDot}
              className="w-8 h-8 mt-3 text-yellowpallete font-bold"
            />{" "}
            {storageData.cs_address}
            <hr className="mt-3 mb-3" />
            <h3 className="text-[18px] text-greenpallete font-bold mt-3">
              Timings
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {storageData.cs_time ? (
                Object.entries(storageData.cs_time).map(([day, time]) => (
                  <p key={day} className="text-sm break-words">
                    <span className="font-bold">
                      {day.charAt(0).toUpperCase() + day.slice(1)}:
                    </span>{" "}
                    {time}
                  </p>
                ))
              ) : (
                <p>No timings available</p>
              )}
            </div>
            <div className="flex items-center justify-between gap-6 mt-5">
              <h3 className="text-[18px] text-greenpallete font-bold mt-5">
                Price &nbsp;
                <FontAwesomeIcon
                  icon={faRupeeSign}
                  className="text-yellowpallete font-bold"
                />{" "}
                <span className="text-gray-600">
                  {storageData.cs_price}/- <sub>per day</sub>
                </span>
              </h3>
              <button
                onClick={handleOpenBookingModal}
                className="bg-yellowpallete px-2 py-2 rounded-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        <h1 className="text-redpallete font-bold md:text-2xl text-xl mb-5 mt-5">
          Ownership Details
        </h1>

        <p>Full Name : {storageData?.owner_ref?.owner_fullName}</p>
        <p>Contact No : {storageData?.owner_ref?.owner_contactNo}</p>
        <p>Email : {storageData?.owner_ref?.owner_email}</p>

        {/* Booking modal */}
        <div
          className={`fixed inset-0 overflow-y-auto ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <div className="relative bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <h1 className="text-xl font-bold mb-4">Booking Details</h1>

                  <h3 className="text-lg font-bold mb-2">
                    Available Capacity {capacity} (in tons)
                  </h3>
                  <div className="mb-4">
                    <label htmlFor="checkInDate" className="block mb-1">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      id="checkInDate"
                      name="b_checkInDate"
                      value={formData.b_checkInDate}
                      onChange={handleChange}
                      className="input-register"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="checkOutDate" className="block mb-1">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      id="checkOutDate"
                      name="b_checkOutDate"
                      value={formData.b_checkOutDate}
                      onChange={handleChange}
                      className="input-register"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="goodsQuantity" className="block mb-1">
                      Goods Quantity
                    </label>
                    <input
                      type="number"
                      id="goodsQuantity"
                      name="b_goodsQuantity"
                      value={formData.b_goodsQuantity}
                      onChange={handleChange}
                      className="input-register"
                      min={1}
                      required
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      className="bg-yellowpallete text-white px-4 py-2 rounded-md hover:bg-yellowpallete focus:outline-none focus:bg-yellowpallete"
                    >
                      Submit
                    </button>

                    <button
                      type="button"
                      onClick={handleCheckOutCapaCity}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-yellowpallete"
                    >
                      Check Capacity
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CsDetails;
