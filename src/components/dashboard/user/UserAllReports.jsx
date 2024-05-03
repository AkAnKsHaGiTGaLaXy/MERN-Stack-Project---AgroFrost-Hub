import React, { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import html2pdf from "html2pdf.js";

function UserAllReports() {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [reportData, setReportData] = useState({});
  const [selectedOption, setSelectedOption] = useState("weekly");

  useEffect(() => {
    fetchReports(selectedOption);
  }, [user?.id, selectedOption]);

  const fetchReports = async (option) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let response;
      if (option === "weekly") {
        response = await axios.get(
          `${endpoint}/user/reports/weekly/${user?.uid}`,
          config
        );
      } else if (option === "monthly") {
        response = await axios.get(
          `${endpoint}/user/reports/monthly/${user?.uid}`,
          config
        );
      } else if (option === "yearly") {
        response = await axios.get(
          `${endpoint}/user/reports/yearly/${user?.uid}`,
          config
        );
      }
      setReportData(response.data);
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

  const renderChart = (data, label) => {
    return (
      <div className="mt-5">
        <h2 className="text-lg font-semibold mb-2">{label}</h2>
        <Pie data={data} />
      </div>
    );
  };

  const renderLineChart = (data, label) => {
    return (
      <div className="mt-5">
        <h2 className="text-lg font-semibold mb-2">{label}</h2>
        <Line data={data} />
      </div>
    );
  };

  const renderTable = () => {
    const data = reportData[selectedOption + "Data"] || [];
    return (
      <div className="mt-5">
        <h2 className="text-lg font-semibold mb-2">Report Data</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Booking ID</th>
                <th className="px-4 py-2">C ID</th>
                <th className="px-4 py-2">CS ID</th>
                <th className="px-4 py-2">Check-in Date</th>
                <th className="px-4 py-2">Check-out Date</th>
                <th className="px-4 py-2">Goods Quantity</th>
                <th className="px-4 py-2">Payment ID</th>
                <th className="px-4 py-2">Payment Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.b_id}</td>
                  <td className="border px-4 py-2">{item.c_id}</td>
                  <td className="border px-4 py-2">{item.cs_id}</td>
                  <td className="border px-4 py-2">
                    {formatDate(item.b_checkInDate)}
                  </td>
                  <td className="border px-4 py-2">
                    {formatDate(item.b_checkOutDate)}
                  </td>
                  <td className="border px-4 py-2">{item.b_goodsQuantity}</td>
                  <td className="border px-4 py-2">{item.payments[0]?.p_id}</td>
                  <td className="border px-4 py-2">
                    {item.payments[0]?.p_amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const totalPayments = reportData[selectedOption + "Data"]
    ? reportData[selectedOption + "Data"].reduce(
        (acc, curr) => acc + curr.payments[0]?.p_amount || 0,
        0
      )
    : 0;
  const totalBookings = reportData[selectedOption + "Data"]
    ? reportData[selectedOption + "Data"].length
    : 0;

  const reportDataSelected = reportData[selectedOption + "Data"];
  const csIdsSet = reportDataSelected
    ? new Set(reportDataSelected.map((item) => item.cs_id))
    : new Set();
  const csIds = Array.from(csIdsSet);

  const paymentChartData = {
    labels: csIds,
    datasets: [
      {
        label: "Total Payments",
        data: csIds.map((csId) => {
          const totalPaymentsForCsId = reportDataSelected
            ? reportDataSelected
                .filter((item) => item.cs_id === csId)
                .reduce(
                  (acc, curr) => acc + (curr.payments[0]?.p_amount || 0),
                  0
                )
            : 0;
          return totalPaymentsForCsId;
        }),
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
      },
    ],
  };

  const bookingChartData = {
    labels: csIds,
    datasets: [
      {
        label: "Total Bookings",
        data: csIds.map((csId) => {
          const totalBookingsForCsId = reportDataSelected
            ? reportDataSelected.filter((item) => item.cs_id === csId).length
            : 0;
          return totalBookingsForCsId;
        }),
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
      },
    ],
  };

  const renderTotalAmountAndBooking = () => {
    if (!reportData[selectedOption + "Data"]) {
      return null; // Return null if data is not available yet
    }

    const totalAmountAndBooking = {};
    reportData[selectedOption + "Data"].forEach((item) => {
      if (!totalAmountAndBooking[item.cs_id]) {
        totalAmountAndBooking[item.cs_id] = {
          totalAmount: 0,
          totalBookings: 0,
        };
      }
      totalAmountAndBooking[item.cs_id].totalAmount +=
        item.payments[0]?.p_amount || 0;
      totalAmountAndBooking[item.cs_id].totalBookings++;
    });

    return (
      <div className="mt-5">
        <h2 className="text-lg font-semibold mb-2">
          Total Amount and Total Booking by CS ID
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">CS ID</th>
                <th className="px-4 py-2">Total Booking</th>
                <th className="px-4 py-2">Total Payment Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(totalAmountAndBooking).map((csId, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{csId}</td>
                  <td className="border px-4 py-2">
                    {totalAmountAndBooking[csId].totalBookings}
                  </td>
                  <td className="border px-4 py-2">
                    {totalAmountAndBooking[csId].totalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const saveToPdf = () => {
    const element = document.getElementById("reportsdata");
    if (!element) {
      console.error(`Element with id ${"reportsdata"} not found.`);
      return;
    }

    const opt = {
      margin: 1,
      filename: `${selectedOption} Reports Data`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "in", format: "a2", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  // Generate an array of years
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 10; year--) {
    years.push(year.toString());
  }

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
      <div className="mb-5" id="reportsdata">
        <div className="col-span-3 flex justify-between items-center">
          <h2 className="text-2xl font-medium">Reports {selectedOption} </h2>
          <div>
            <button
              className={`py-2 px-4 rounded-md focus:outline-none ${
                selectedOption === "weekly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setSelectedOption("weekly")}
            >
              Weekly
            </button>
            <button
              className={`py-2 px-4 rounded-md focus:outline-none ml-2 ${
                selectedOption === "monthly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setSelectedOption("monthly")}
            >
              Monthly
            </button>
            <button
              className={`py-2 px-4 rounded-md focus:outline-none ml-2 ${
                selectedOption === "yearly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setSelectedOption("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="col-span-2">
            {renderChart(paymentChartData, "Total Payments")}
            <br />
            {renderChart(bookingChartData, "Total Bookings")}
          </div>
          <div className="col-span-3">
            {renderTable()}
            <br />
            {renderTotalAmountAndBooking()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {renderLineChart(bookingChartData, "Bookings")}
          {renderLineChart(paymentChartData, "Payments")}
        </div>
      </div>

      <button
        type="button"
        onClick={saveToPdf}
        className="bg-green-600 hover:bg-green-700 px-2 py-2 rounded-md mb-5 mt-3 text-white"
      >
        Download Reports
      </button>

      <br />
      <br />
    </>
  );
}

export default UserAllReports;
