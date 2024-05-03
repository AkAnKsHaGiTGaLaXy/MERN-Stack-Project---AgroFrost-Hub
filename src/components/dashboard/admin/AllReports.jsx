import React, { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import html2pdf from "html2pdf.js";

function AllReports() {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${import.meta.env.VITE_KEY}`;
  const [reportData, setReportData] = useState({});
  const [selectedOption, setSelectedOption] = useState("weekly");
  const [yearwisedata, setYearwisedata] = useState([]);
  const [monthwisedata, setMonthWiseData] = useState([]);
  const [approveColdStorage, setApproveColdStorageData] = useState([]);
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [queryData, setQueryData] = useState({
    year: "",
    csId: "",
  });

  const [queryMonth, setQueryMonth] = useState({
    month: "",
    year: "",
    csId: "",
  });

  useEffect(() => {
    fetchReports(selectedOption);
    fetchApprove();
  }, [user?.id, selectedOption]);

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

      setApproveColdStorageData(response?.data);
      console.log(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Event handler for selecting a cold storage ID
  const handleCsIdChange = (event) => {
    const selectedCsId = event.target.value;
    setQueryData((prevData) => ({
      ...prevData,
      csId: selectedCsId,
    }));
  };

  // Event handler for selecting a year
  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    setQueryData((prevData) => ({
      ...prevData,
      year: selectedYear,
    }));
  };

  const fetchReports = async (option) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let response;
      if (option === "weekly") {
        response = await axios.get(`${endpoint}/admin/reports/weekly`, config);
      } else if (option === "monthly") {
        response = await axios.get(`${endpoint}/admin/reports/monthly`, config);
      } else if (option === "yearly") {
        response = await axios.get(`${endpoint}/admin/reports/yearly`, config);
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

  const fetchYearlyReportByCsId = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${endpoint}/admin/reports/yearly/${queryData?.year}?csId=${queryData?.csId}`,
        config
      );

      setYearwisedata(response?.data);
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

  const fetchMonthReportByCsId = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${endpoint}/admin/reports/monthly/${queryMonth?.year}/${queryMonth?.month}?csId=${queryMonth?.csId}`,
        config
      );

      setMonthWiseData(response?.data);
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

  const handleDownloadReport = () => {
    const element = document.getElementById("downloadReports");
    if (!element) {
      console.error(`Element with id ${"downloadReports"} not found.`);
      return;
    }

    const opt = {
      margin: 1,
      filename: `Yearly ${queryData.year} Reports Data`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "in", format: "a2", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const filterColdStorageData = (cs_id) => {
    if (!cs_id) {
      return null;
    }

    const selectedColdStorage = approveColdStorage.find(
      (coldStorage) => coldStorage.cs_id === cs_id
    );

    if (!selectedColdStorage) {
      return null;
    }

    return (
      <div className="flex justify-between items-center mb-3 border-b">
        <div>
          <h3 className="font-bold">Cold Storage Details</h3>
          <p>Cold Storage Id : {selectedColdStorage.cs_id}</p>
          <p>Cold Storage Name: {selectedColdStorage.cs_name}</p>
          <p>Address : {selectedColdStorage.cs_address}</p>
        </div>

        <div>
          <h3 className="font-bold">Cold Storage Owner Details</h3>
          <p>Owner Id : {selectedColdStorage.owner_id}</p>
          <p>Owner Name : {selectedColdStorage.owner_ref.owner_fullName}</p>
          <p>Owner Email: {selectedColdStorage.owner_ref.owner_email}</p>
          <p>
            Owner Contact No : {selectedColdStorage.owner_ref.owner_contactNo}
          </p>
        </div>
      </div>
    );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQueryMonth((prevQuery) => ({
      ...prevQuery,
      [name]: value,
    }));
  };

  const handleDownloadMonthReport = () => {
    const element = document.getElementById("downloadMonthReports");
    if (!element) {
      console.error(`Element with id ${"downloadMonthReports"} not found.`);
      return;
    }

    const opt = {
      margin: 1,
      filename: `Monthly Reports Data ${queryMonth.month} ${queryMonth.year}`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "in", format: "a2", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
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

      <hr className="mt-3 mb-3" />

      {/* Generate Reports Month Wise */}

      <h2 className="text-2xl font-semibold mb-2">
        Generate Reports Year Wise
      </h2>

      <div className="flex flex-wrap gap-2 items-center mb-3 mt-3">
        <select
          className="flex-auto px-2 py-2 border border-gray-500 focus:outline-none rounded-lg"
          value={queryData.year}
          onChange={handleYearChange}
        >
          <option value="">Select a Year</option>
          {/* Assuming years is an array of available years */}
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          className="flex-auto px-2 py-2 border border-gray-500 focus:outline-none rounded-lg"
          value={queryData.csId}
          onChange={handleCsIdChange}
        >
          <option value="">Select a Cold Storage ID</option>
          {approveColdStorage.map((coldStorage, index) => (
            <option key={index} value={coldStorage.cs_id}>
              {coldStorage.cs_id}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={fetchYearlyReportByCsId}
          className="flex-auto text-white px-2 py-2 bg-indigo-700 rounded-lg"
        >
          Generate Reports
        </button>
      </div>

      {/* Show that data of yearwisedata*/}
      {yearwisedata.length > 0 && (
        <div className="mt-5 mb-5" id="downloadReports">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Yearly Report Data {queryData?.year}
          </h2>
          <div className="overflow-x-auto">
            {/* Cold Storage */}
            <div>{filterColdStorageData(queryData?.csId)}</div>
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
                {yearwisedata.map((item, index) => (
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
                    <td className="border px-4 py-2">
                      {item.payments[0]?.p_id}
                    </td>
                    <td className="border px-4 py-2">
                      {item.payments[0]?.p_amount}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={6}></td>
                  <td className="text-xl font-semibold border">
                    Total Booking Count
                  </td>
                  <td className="text-xl font-semibold border">
                    {yearwisedata.length}
                  </td>
                </tr>

                <tr>
                  <td colSpan={6}></td>
                  <td className="text-xl font-semibold border">
                    Total Payment Amount
                  </td>
                  <td className="text-xl font-semibold border">
                    {yearwisedata.reduce(
                      (total, item) =>
                        total + (item.payments[0]?.p_amount || 0),
                      0
                    )}{" "}
                    /-
                  </td>
                </tr>

                <tr>
                  <td colSpan={6}></td>
                  <button
                    onClick={handleDownloadReport}
                    type="button"
                    className="bg-green-700 hover:bg-green-800 py-2 px-2 rounded-lg text-white mt-2"
                  >
                    Download Reports
                  </button>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <br />
      <br />
      <hr />

      {/* For Monthly Data */}

      <h2 className="text-2xl font-semibold mb-2 mt-3">
        Generate Reports Month Wise
      </h2>

      <div className="flex flex-wrap gap-2 items-center mb-3 mt-3">
        <select
          name="year"
          className="flex-auto px-2 py-2 border border-gray-500 focus:outline-none rounded-lg"
          value={queryMonth.year}
          onChange={handleInputChange}
        >
          <option value="">Select a Year</option>
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          name="csId"
          className="flex-auto px-2 py-2 border border-gray-500 focus:outline-none rounded-lg"
          value={queryMonth.csId}
          onChange={handleInputChange}
        >
          <option value="">Select a Cold Storage ID</option>
          {approveColdStorage.map((coldStorage, index) => (
            <option key={index} value={coldStorage.cs_id}>
              {coldStorage.cs_id}
            </option>
          ))}
        </select>

        <select
          name="month"
          className="flex-auto px-2 py-2 border border-gray-500 focus:outline-none rounded-lg"
          value={queryMonth.month}
          onChange={handleInputChange}
        >
          <option value="">Select a Month</option>

          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={fetchMonthReportByCsId}
          className="flex-auto text-white px-2 py-2 bg-indigo-700 rounded-lg"
        >
          Generate Reports
        </button>
      </div>

      {monthwisedata.length > 0 && (
        <div className="mt-5 mb-5" id="downloadMonthReports">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Monthly Report Data {queryMonth?.month}-{queryMonth?.year}
          </h2>
          <div className="overflow-x-auto">
            {/* Cold Storage */}
            <div>{filterColdStorageData(queryMonth?.csId)}</div>
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
                {monthwisedata.map((item, index) => (
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
                    <td className="border px-4 py-2">
                      {item.payments[0]?.p_id}
                    </td>
                    <td className="border px-4 py-2">
                      {item.payments[0]?.p_amount}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={6}></td>
                  <td className="text-xl font-semibold border">
                    Total Booking Count
                  </td>
                  <td className="text-xl font-semibold border">
                    {monthwisedata.length}
                  </td>
                </tr>

                <tr>
                  <td colSpan={6}></td>
                  <td className="text-xl font-semibold border">
                    Total Payment Amount
                  </td>
                  <td className="text-xl font-semibold border">
                    {monthwisedata.reduce(
                      (total, item) =>
                        total + (item.payments[0]?.p_amount || 0),
                      0
                    )}{" "}
                    /-
                  </td>
                </tr>

                <tr>
                  <td colSpan={6}></td>
                  <button
                    onClick={handleDownloadMonthReport}
                    type="button"
                    className="bg-green-700 hover:bg-green-800 py-2 px-2 rounded-lg text-white mt-2"
                  >
                    Download Reports
                  </button>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <br />
    </>
  );
}

export default AllReports;
