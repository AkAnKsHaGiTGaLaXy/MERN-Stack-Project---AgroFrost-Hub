import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar, Line, Doughnut, PolarArea, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import AllReports from "./AllReports";
Chart.register(...registerables);

function AdminOverView() {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [countData, setCountData] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCountData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(`${endpoint}/admin/count/all`, config);

        setCountData(response?.data);
        console.log(response?.data);
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

    const fetchChart = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(`${endpoint}/admin/chart/all`, config);

        setChartData(response?.data);
        console.log(response?.data);
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

    fetchChart();
    fetchCountData();
  }, [user?.id]);

  const pieChartData = {
    labels: [
      "Booking Count",
      "Customer Count",
      "Approved Storage",
      "Not Approved Storage",
      "Total Owners",
    ],
    datasets: [
      {
        label: "Count Data",
        data: [
          countData?.bookingCount || 0,
          countData?.customerCount || 0,
          countData?.approvedStorage || 0,
          countData?.notApprovedStorage || 0,
          countData?.totalOwners || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const BookingStatusChart = {
    labels: ["Cancelled", "Visited", "Booked"],
    datasets: [
      {
        label: "Count Data",
        data: [
          countData?.bookingStatusCounts?.Cancelled || 0,
          countData?.bookingStatusCounts?.Visited || 0,
          countData?.bookingStatusCounts?.Booked || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const bookingData = {
    labels: chartData?.bookingData?.map(
      (data) => `${data.year} - ${data.cs_id}`
    ),
    datasets: [
      {
        label: "Booking Count",
        data: chartData?.bookingData?.map((data) => data.bookings),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const paymentData = {
    labels: chartData?.paymentData?.map(
      (data) => `${data.year} - ${data.cs_id}`
    ),
    datasets: [
      {
        label: "Payment Amount",
        data: chartData?.paymentData?.map((data) => data.payments),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Extracting data for bookingStatusData
  const statusLabels = chartData?.bookingStatusData?.map(
    (data) => `${data.cs_id} - ${data.month}/${data.year}`
  );

  // Initialize arrays to hold count data for each status
  const visitedData = [];
  const bookedData = [];
  const cancelledData = [];

  // Loop through the bookingStatusData to populate count data for each status
  chartData?.bookingStatusData?.forEach((data) => {
    if (data.status === "Visited") {
      visitedData.push(data.count);
      bookedData.push(0); // Add 0 for Booked and Cancelled if not available for this cs_id
      cancelledData.push(0);
    } else if (data.status === "Booked") {
      bookedData.push(data.count);
      visitedData.push(0);
      cancelledData.push(0);
    } else if (data.status === "Cancelled") {
      cancelledData.push(data.count);
      visitedData.push(0);
      bookedData.push(0);
    }
  });

  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        label: "Visited",
        backgroundColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        data: visitedData,
      },
      {
        label: "Booked",
        backgroundColor: "rgba(255,99,132,1)",
        borderWidth: 2,
        data: bookedData,
      },
      {
        label: "Cancelled",
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        data: cancelledData,
      },
    ],
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
          Dashboard
        </h2>
        <div className="mx-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Booking Count */}
            <div className="flex gap-6 p-3 rounded-md items-center shadow-lg border border-greenpallete bg-white hover:bg-greenpallete">
              <img src="/src/assets/inventory.png" className="w-20 h-20" />
              <div>
                <p className="text-3xl font-bold">
                  {countData?.bookingCount || 0}
                </p>
                <p>Total Booking</p>
              </div>
            </div>

            {/* Last Booking */}
            <div className="flex gap-6 p-3 rounded-md items-center shadow-lg border border-greenpallete bg-white hover:bg-greenpallete">
              <img src="/src/assets/customericon.png" className="w-20 h-20" />
              <div>
                <p className="text-3xl font-bold">
                  {countData?.customerCount || 0}
                </p>
                <p>Customers</p>
              </div>
            </div>

            {/* Last Payment */}
            <div className="flex gap-6 p-3 rounded-md items-center shadow-lg border border-greenpallete bg-white hover:bg-greenpallete">
              <img src="/src/assets/coldstorage.png" className="w-20 h-20" />
              <div>
                <p className="text-3xl font-bold break-words text-wrap md:text-2xl lg:text-3xl xl:text-4xl">
                  {countData?.approvedStorage || 0}
                </p>
                <p>Approved Cold Storage's</p>
              </div>
            </div>

            <div className="flex gap-6 p-3 rounded-md items-center shadow-lg border border-greenpallete bg-white hover:bg-greenpallete">
              <img src="/src/assets/coldstorage.png" className="w-20 h-20" />
              <div>
                <p className="text-3xl font-bold break-words text-wrap md:text-2xl lg:text-3xl xl:text-4xl">
                  {countData?.notApprovedStorage || 0}
                </p>
                <p>Not Approved Cold Storage's</p>
              </div>
            </div>

            <div className="flex gap-6 p-3 rounded-md items-center shadow-lg border border-greenpallete bg-white hover:bg-greenpallete">
              <img src="/src/assets/customericon.png" className="w-20 h-20" />
              <div>
                <p className="text-3xl font-bold">
                  {countData?.totalOwners || 0}
                </p>
                <p>Owners</p>
              </div>
            </div>
          </div>

          {/* Chart Grid Payment Data and Booking Data */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Counting Chart */}
            {/* Count Chart */}
            {/* Pie Chart */}
            <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Count Data</h3>
              <Doughnut data={pieChartData} />
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Booking Status</h3>
              <Doughnut data={BookingStatusChart} />
            </div>
            {/* Booking Data Chart */}
            <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Booking Data</h3>
              <Bar data={bookingData} />
            </div>
            {/* Payment Data Chart */}
            <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Payment Data</h3>
              <Bar data={paymentData} />
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Booking Status</h3>
              {statusChartData && <Bar data={statusChartData} />}
            </div>
          </div>

          <hr className="mt-3 mb-3" />
          <AllReports />
        </div>
      </div>
    </>
  );
}

export default AdminOverView;
