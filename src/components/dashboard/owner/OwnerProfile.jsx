import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OwnerProfile() {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [formData, setFormData] = useState({
    c_address: "",
    owner_contactNo: 0,
    owner_email: "",
    owner_fullName: "",
    owner_id: "",
    role: "",
    _id: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coldStorageData, setColdStorageData] = useState({
    owner_id: "",
    cs_id: "",
    cs_name: "",
    cs_image: null,
    cs_area: 0,
    cs_capacity: 0,
    cs_address: "",
    cs_price: 0,
    cs_time: {
      monday: "10:00-23:00",
      tuesday: "10:00-23:00",
      wednesday: "10:00-23:00",
      thursday: "10:00-23:00",
      friday: "10:00-23:00",
      saturday: "10:00-23:00",
      sunday: "10:00-23:00",
    },
    owner_ref: "",
    cs_status: false,
  });

  const [existData, setExistData] = useState(false);
  useEffect(() => {
    fetchProfile();
    fetchColdStorageProfile();
  }, [user?.id]);

  const fetchProfile = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`${endpoint}/owner/${user?.id}`, config);

      setFormData(response?.data);
      console.log(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchColdStorageProfile = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${endpoint}/owner/storage/${user?.uid}`,
        config
      );
      if (response?.data != null) {
        setExistData(true);
        setColdStorageData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleColdStorageInputChange = (e) => {
    const { name, value } = e.target;
    setColdStorageData((prevFormData) => ({
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
        `${endpoint}/owner/register/details`,
        formData,
        config
      );

      fetchProfile();
      fetchColdStorageProfile();

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

  const selectImage = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      handleImageChange(imageFile);
      setSelectedFile(imageFile);
    }
  };

  const handleImageChange = (imageFile) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setFormData({
        ...formData,
        cs_image: imageFile,
      });
    };
    reader.readAsDataURL(imageFile);
  };

  const handleColdSave = async () => {
    const formdata = {
      owner_id: user?.uid,
      cs_name: coldStorageData?.cs_name,
      cs_area: coldStorageData?.cs_area,
      cs_capacity: coldStorageData?.cs_capacity,
      cs_address: coldStorageData?.cs_address,
      cs_price: coldStorageData?.cs_price,
      cs_time: coldStorageData?.cs_time,
      owner_ref: user?.id,
    };
    try {
      const response = await axios.post(
        `${endpoint}/owner/create/coldstorage`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProfile();
      fetchColdStorageProfile();

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
  const handleColdUpdate = async () => {
    try {
      const response = await axios.put(
        `${endpoint}/owner/update/coldstorage/${coldStorageData?.cs_id}`,
        coldStorageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProfile();
      fetchColdStorageProfile();
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

  const UploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.put(
        `${endpoint}/owner/update/coldstorage/image/${coldStorageData?.cs_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProfile();
      fetchColdStorageProfile();

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

  const handleColdStorageTimeChange = (day, period, value) => {
    // Create a copy of the current cs_time object
    const updatedTime = { ...coldStorageData.cs_time };

    // Update the opening or closing time for the specified day
    if (period === "opening") {
      updatedTime[day] = `${value}-${
        updatedTime[day]?.split("-")[1] || "00:00"
      }`;
    } else if (period === "closing") {
      updatedTime[day] = `${
        updatedTime[day]?.split("-")[0] || "00:00"
      }-${value}`;
    }

    // Update the state with the new cs_time object
    setColdStorageData({
      ...coldStorageData,
      cs_time: updatedTime,
    });
  };

  const inputRef = useRef(null);

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
                      name="owner_fullName"
                      value={formData?.owner_fullName}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">Email</label>
                    <input
                      type="email"
                      name="owner_email"
                      value={formData?.owner_email}
                      disabled
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">Contact No</label>
                    <input
                      type="text"
                      name="owner_contactNo"
                      value={formData?.owner_contactNo}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">Owner Id </label>
                    <input
                      type="text"
                      name="owner_id"
                      value={formData?.owner_id}
                      onChange={handleInputChange}
                      disabled
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium">Account Type</label>
                    <input
                      type="text"
                      name="role"
                      value={formData?.role}
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

          {/* Storage Profile Details */}

          <div className=" flex flex-col gap-9">
            <div className="rounded-sm border bg-white shadow-md ">
              <div className="border-b py-4 px-6 ">
                <h3 className="font-medium text-black">Storage Details</h3>
              </div>
              <div className="flex flex-col gap-5 p-6">
                {existData && (
                  <div className="mt-5 flex items-center justify-center">
                    <div className="relative rounded-md w-full h-[200px] object-fill object-center border">
                      {previewImage && (
                        <button
                          onClick={UploadImage}
                          className="absolute inset-0 bg-black bg-opacity-50 text-white flex justify-center items-center z-10"
                        >
                          Upload
                        </button>
                      )}
                      <img
                        onClick={() => inputRef.current.click()}
                        src={
                          previewImage || coldStorageData?.cs_image
                            ? previewImage
                              ? previewImage
                              : `${endpoint}/user/images/${coldStorageData?.cs_image}`
                            : "/src/assets/select.png"
                        }
                        className="rounded-md w-full h-full object-fill object-center border"
                        alt="Profile"
                      />
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={selectImage}
                      ref={inputRef}
                      style={{ display: "none" }}
                    />
                  </div>
                )}

                <div className="mt-5 grid md:grid-cols-2 md:gap-6">
                  {/* Display input fields */}
                  <div className="flex flex-col">
                    <label className="font-medium">Cold Storage Name</label>
                    <input
                      type="text"
                      name="cs_name"
                      value={coldStorageData?.cs_name || ""}
                      onChange={handleColdStorageInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">Cold Storage Address</label>
                    <input
                      type="text"
                      name="cs_address"
                      value={coldStorageData?.cs_address || ""}
                      onChange={handleColdStorageInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">
                      Area (in square meters)
                    </label>
                    <input
                      type="number"
                      name="cs_area"
                      value={coldStorageData?.cs_area || 0}
                      onChange={handleColdStorageInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">Capacity (in tons)</label>
                    <input
                      type="number"
                      name="cs_capacity"
                      value={coldStorageData?.cs_capacity || 0}
                      onChange={handleColdStorageInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">
                      Price per day (in ruppee)
                    </label>
                    <input
                      type="number"
                      name="cs_price"
                      value={coldStorageData?.cs_price || 0}
                      onChange={handleColdStorageInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium">Status</label>
                    <select
                      name="cs_status"
                      value={coldStorageData?.cs_status || false}
                      onChange={handleColdStorageInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                      disabled
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>

                  {Object.entries(coldStorageData?.cs_time).map(
                    ([day, time], index) => (
                      <div key={index} className="flex flex-col">
                        <label className="font-medium">{day}</label>
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={time.split("-")[0]}
                            onChange={(e) =>
                              handleColdStorageTimeChange(
                                day,
                                "opening",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-md px-3 py-2"
                          >
                            {/* Render select options for opening time */}
                            {[...Array(24).keys()].map((hour) => (
                              <option
                                key={hour}
                                value={`${hour.toString().padStart(2, "0")}:00`}
                              >
                                {`${hour.toString().padStart(2, "0")}:00`}
                              </option>
                            ))}
                          </select>
                          <select
                            value={time.split("-")[1]}
                            onChange={(e) =>
                              handleColdStorageTimeChange(
                                day,
                                "closing",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-md px-3 py-2"
                          >
                            {/* Render select options for closing time */}
                            {[...Array(24).keys()].map((hour) => (
                              <option
                                key={hour}
                                value={`${hour.toString().padStart(2, "0")}:00`}
                              >
                                {`${hour.toString().padStart(2, "0")}:00`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Actions Button */}
                {coldStorageData?.cs_id ? (
                  <div className="flex gap-3 justify-between items-center mt-3 mb-5">
                    <button
                      onClick={handleColdUpdate}
                      className="bg-white shadow rounded-lg border px-6 py-2 font-inter font-medium hover:bg-greenpallete hover:text-white border-gray-300"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 justify-between items-center mt-3 mb-5">
                    <button
                      onClick={handleColdSave}
                      className="bg-white shadow rounded-lg border px-6 py-2 font-inter font-medium hover:bg-greenpallete hover:text-white border-gray-300"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OwnerProfile;
