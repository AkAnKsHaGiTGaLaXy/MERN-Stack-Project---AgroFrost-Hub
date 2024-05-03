import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar, Line, Doughnut, PolarArea, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import UserAllReports from "./UserAllReports";
Chart.register(...registerables);

function UserOverView() {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `${endpoint}/user/chartdata/${user?.uid}`,
          config
        );

        setChartData(response?.data);
        console.log(response?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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

    fetchChartData();
  }, [user?.id]);

  const bookingLabels = chartData?.bookingData?.map(
    (data) => `${data.month}/${data.year}`
  );
  const bookingData = chartData?.bookingData?.map((data) => data.count);

  const paymentLabels = chartData?.paymentData?.map(
    (data) => `${data.month}/${data.year}`
  );
  const paymentData = chartData?.paymentData?.map((data) => data.totalPayment);

  const bookingChartData = {
    labels: bookingLabels,
    datasets: [
      {
        label: "Booking Count",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: bookingData,
      },
    ],
  };

  const paymentChartData = {
    labels: paymentLabels,
    datasets: [
      {
        label: "Total Payment",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 2,
        data: paymentData,
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Booking Count */}
            <div className="flex gap-6 p-3 rounded-md items-center shadow-lg border border-greenpallete bg-white hover:bg-greenpallete">
              <img src="/src/assets/inventory.png" className="w-24 h-24" />
              <div>
                <p className="text-3xl font-bold">
                  {chartData?.totalBookingCount}
                </p>
                <p>Total Booking</p>
              </div>
            </div>

            {/* Last Booking */}
            <div className="flex gap-6 p-3 rounded-md items-center shadow-lg border border-greenpallete bg-white hover:bg-greenpallete">
              <img src="/src/assets/booking.png" className="w-24 h-24" />
              <div>
                <p className="text-3xl font-bold">
                  {chartData?.lastBooking?.b_id}
                </p>
                <p>Last Booking</p>
              </div>
            </div>

            {/* Last Payment */}
            <div className="flex gap-6 p-3 rounded-md items-center shadow-lg border border-greenpallete bg-white hover:bg-greenpallete">
              <img src="/src/assets/creditcard.png" className="w-24 h-24" />
              <div>
                <p className="text-3xl font-bold break-words text-wrap md:text-2xl lg:text-3xl xl:text-4xl">
                  {chartData?.lastPayment?.cs_id}
                </p>
                <p>Last Payment to</p>
              </div>
            </div>
          </div>

          {/* Chart Grid Payment Data and Booking Data */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Booking Data Chart */}
            <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Booking Data</h3>
              {bookingChartData && <Bar data={bookingChartData} />}
            </div>

            {/* Payment Data Chart */}
            <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Payment Data</h3>
              {paymentChartData && <Bar data={paymentChartData} />}
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Booking Status</h3>
              {statusChartData && <Bar data={statusChartData} />}
            </div>
          </div>
        </div>

        <br />
        <hr />
        <br />

        <UserAllReports />
      </div>
    </>
  );
}

export default UserOverView;
