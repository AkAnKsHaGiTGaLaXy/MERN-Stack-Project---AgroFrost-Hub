const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const pdf = require("html-pdf");
const bcrypt = require("bcrypt");
const { authenticateToken } = require("../middlewares/authentication");
const Customer = require("../model/Customer");
const ColdStorage = require("../model/ColdStorage");
const Razorpay = require("razorpay");
const moment = require("moment");
const Booking = require("../model/Booking");
const Payment = require("../model/Payment");
const OTP = require("../model/Otp");
const { startOfMonth, endOfMonth } = require("date-fns");
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY, SECRET_KEY } = process.env;
const nodemailer = require("nodemailer");
const { EMAIL_PASSWORD, YOUR_EMAIL } = process.env;
const randomstring = require("randomstring");

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: YOUR_EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

//Genrate Customer ID
async function generateCustomerId() {
  const lastRegistration = await Customer.findOne().sort({
    c_id: -1,
  });

  let nextRegistrationNumber = 1;

  if (lastRegistration) {
    const lastRegistrationNumber = parseInt(
      lastRegistration.c_id.split("-")[1]
    );
    if (!isNaN(lastRegistrationNumber)) {
      nextRegistrationNumber = lastRegistrationNumber + 1;
    }
  }

  // Format the registration number to always have two digits
  const formattedRegistrationNumber = nextRegistrationNumber
    .toString()
    .padStart(2, "0");

  // Generate the new customer ID
  const newCustomerId = `CSREG-${formattedRegistrationNumber}`;

  return newCustomerId;
}

// Generate Booking Id
async function generateBookingId() {
  try {
    // Find the latest booking
    const latestBooking = await Booking.findOne().sort({ b_id: -1 });

    let newSerialNumber;
    if (latestBooking) {
      // Extract the serial number from the latest BKID and increment it
      const serialNumber = parseInt(latestBooking.b_id.split("-")[1]);
      newSerialNumber = serialNumber + 1;
    } else {
      // If no bookings exist yet, start with 1
      newSerialNumber = 1;
    }

    // Format the serial number to always have at least two digits
    const formattedSerialNumber = newSerialNumber.toString().padStart(2, "0");

    // Generate the new booking ID
    const newBkid = `BKID-${formattedSerialNumber}`;

    return newBkid;
  } catch (error) {
    // Handle any errors
    console.error("Error generating BKID:", error);
    throw error;
  }
}

// Customer Registration
router.post("/register", async (req, res) => {
  try {
    const {
      c_fullName,
      c_email,
      c_contactNo,
      c_address,
      c_password,
      c_confirmPass,
    } = req.body;

    // Regular expressions for email, phone number, and password validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    // Check if any required fields are empty
    if (
      !c_fullName ||
      !c_email ||
      !c_contactNo ||
      !c_address ||
      !c_password ||
      !c_confirmPass
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (c_password !== c_confirmPass) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Validate email format
    if (!emailRegex.test(c_email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate phone number format
    if (!phoneRegex.test(c_contactNo)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // Validate password complexity
    if (!passwordRegex.test(c_password)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character",
      });
    }

    // Check if the email or contact number already exists
    const existingCustomer = await Customer.findOne({
      $or: [{ c_email: c_email }, { c_contactNo: c_contactNo }],
    });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ error: "Email or contact number already exists" });
    }

    const hashedPassword = await bcrypt.hash(c_password, 10);
    const c_id = await generateCustomerId();

    // Create a new customer
    const newCustomer = new Customer({
      c_id,
      c_fullName,
      c_email,
      c_contactNo,
      c_address,
      c_password: hashedPassword,
    });

    // Save the new customer to the database
    await newCustomer.save();

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    console.error("Error registering customer:", error);
    res.status(500).json({ error: error.message });
  }
});

//customer login
router.post("/login", async (req, res) => {
  try {
    const { c_email, c_password } = req.body;

    // Validate required fields
    if (!c_email || !c_password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the user by email
    const user = await Customer.findOne({ c_email });

    // If cold storage not found or owner_password doesn't match
    if (!user || !(await bcrypt.compare(c_password, user.c_password))) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "24h",
    });

    const userdata = {
      id: user._id,
      username: user.c_fullName,
      email: user.c_email,
      role: user.role,
      uid: user.c_id,
    };

    // Send token in response
    res.json({ token: token, user: userdata });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

//customer update details
router.put("/:customerId", authenticateToken, async (req, res) => {
  try {
    const { c_fullName, c_contactNo, c_address } = req.body;
    const customerId = req.params.customerId;

    // Validate contact number
    if (c_contactNo && !/^\d{10}$/.test(c_contactNo)) {
      return res
        .status(400)
        .json({ error: "Contact number must be a 10-digit number" });
    }

    // Update customer fields
    const updateFields = {};
    if (c_fullName) {
      updateFields.c_fullName = c_fullName;
    }
    if (c_contactNo) {
      updateFields.c_contactNo = c_contactNo;
    }
    if (c_address) {
      updateFields.c_address = c_address;
    }

    // Find and update the customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      updateFields,
      { new: true }
    );

    // Check if the customer exists
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//customer get
router.get("/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // Find the customer by ID
    const customer = await Customer.findById(customerId).select("-c_password");

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Exclude the password field and send the customer data
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(500).json({ error: error.message });
  }
});

/**--------------------------[Storage Router for Customer Only]------------------------ */
//fetching image from uploads folder
router.get("/images/:image", async (req, res) => {
  try {
    const fileName = req.params.image;

    if (!fileName) {
      return res.status(404).json({ error: "file name not found" });
    }
    // Construct the file path to the profile picture
    const filePath = path.join(__dirname, `../uploads/${fileName}`);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: "Image not found" });
      }

      // Send the file as a response
      res.sendFile(filePath);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//Fetching all storages only approved
router.get("/storage/all", authenticateToken, async (req, res) => {
  try {
    const storage = await ColdStorage.find({ cs_status: true }).populate({
      path: "owner_ref",
      model: "ColdStorageOwner",
      select: "-owner_password",
    });

    res.status(200).json(storage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetching Storage Details by cs_id
router.get("/storage/:csid", authenticateToken, async (req, res) => {
  const { csid } = req.params; // Retrieve csid from request params
  try {
    const storage = await ColdStorage.findOne({ cs_id: csid }).populate({
      path: "owner_ref",
      model: "ColdStorageOwner",
      select: "-owner_password",
    });

    if (!storage) {
      return res.status(404).json({ error: "Storage not found" });
    }

    res.status(200).json(storage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/createorder", authenticateToken, async (req, res) => {
  const { b_checkInDate, b_checkOutDate, b_goodsQuantity, cs_price } = req.body;

  // Validate input data
  if (!b_checkInDate || !b_checkOutDate || !b_goodsQuantity || !cs_price) {
    return res.status(400).json({ error: "Data is empty" });
  }

  // Validate check-in and check-out dates
  const checkInDate = moment(b_checkInDate);
  const checkOutDate = moment(b_checkOutDate);
  const currentDate = moment();

  if (!checkInDate.isValid() || !checkOutDate.isValid()) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  if (!checkInDate.isSame(currentDate, "day")) {
    // Check if check-in date is today's date
    if (checkInDate.isBefore(currentDate, "day")) {
      return res
        .status(400)
        .json({ error: "Check-in date should not be in the past" });
    }
  }

  if (checkOutDate.isSameOrBefore(checkInDate)) {
    return res
      .status(400)
      .json({ error: "Check-out date should be after check-in date" });
  }

  // Calculate the number of days
  const durationInDays = checkOutDate.diff(checkInDate, "days");

  // Calculate the total amount
  const totalPrice = cs_price * durationInDays;

  const options = {
    amount: totalPrice * 100, // Convert to paisa (Indian currency)
    currency: "INR",
    receipt: "#1",
    payment_capture: 1,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});
//save payment
router.post("/savepayment", authenticateToken, async (req, res) => {
  const {
    amount,
    p_id,
    cs_id,
    c_id,
    b_checkInDate,
    b_checkOutDate,
    b_goodsQuantity,
  } = req.body;

  if (
    !amount ||
    !p_id ||
    !cs_id ||
    !c_id ||
    !b_checkInDate ||
    !b_checkOutDate ||
    !b_goodsQuantity
  ) {
    return res.status(400).json({ error: "Fields can't be blank" });
  }

  // Convert the amount to the correct value (assuming amount is in cents)
  const p_amount = parseFloat(amount) / 100;

  try {
    // Generate a booking ID
    const b_id = await generateBookingId();

    console.log(b_id);

    // Save the booking details
    const booking = new Booking({
      b_id,
      cs_id,
      c_id,
      b_checkInDate,
      b_checkOutDate,
      b_goodsQuantity,
    });
    await booking.save();

    // Save the payment details
    const payment = new Payment({
      b_id,
      p_id,
      p_amount,
      cs_id,
      c_id,
      b_checkInDate,
      b_checkOutDate,
      b_goodsQuantity,
    });
    await payment.save();

    res.status(200).json({
      message: "Payment and booking saved successfully",
      b_id: b_id,
    });
  } catch (error) {
    console.error("Error saving payment and booking:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving payment and booking" });
  }
});

/**--------------------------[Booking Router for Customer Only]------------------------ */
router.get("/booking/:c_id", authenticateToken, async (req, res) => {
  try {
    const { c_id } = req.params;

    const bookings = await Booking.find({ c_id });

    if (!bookings) {
      return res.status(404).json({ error: "Bookings not found" });
    }

    // Convert ISO date strings to readable local format
    const bookingsWithReadableDates = bookings.map((booking) => ({
      ...booking.toObject(),
      b_checkInDate: new Date(booking.b_checkInDate).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      ),
      b_checkOutDate: new Date(booking.b_checkOutDate).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      ),
    }));

    res.status(200).json(bookingsWithReadableDates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router for update booking b_status
// Route to update booking status by b_id
router.put("/booking/:b_id/status", authenticateToken, async (req, res) => {
  try {
    const { b_id } = req.params;
    const { b_status } = req.body;

    // Validate the provided status
    const allowedStatus = ["Cancelled"];
    if (!allowedStatus.includes(b_status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    // Update the booking status
    const updatedBooking = await Booking.findOneAndUpdate(
      { b_id },
      { $set: { b_status } },
      { new: true }
    );

    console.log(updatedBooking);

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({ message: "Booking Cancelled" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//router for sending invoice get
router.post("/send/invoice/:b_id", authenticateToken, async (req, res) => {
  try {
    const { b_id } = req.params;

    const bookingdata = await Booking.findOne({ b_id: b_id });

    if (!bookingdata) {
      return res.status(400).json({ message: "Booking Details Not Found" });
    }

    const paymentdata = await Payment.findOne({ b_id: b_id });

    if (!paymentdata) {
      return res.status(400).json({ message: "Payment Details Not Found" });
    }

    const customerdetails = await Customer.findOne({ c_id: paymentdata.c_id });

    if (!customerdetails) {
      return res.status(400).json({ message: "Customer Details Not Found" });
    }

    const coldstorage = await ColdStorage.findOne({
      cs_id: paymentdata.cs_id,
    }).populate({
      path: "owner_ref",
      model: "ColdStorageOwner",
      select: "-owner_password",
    });

    if (!coldstorage) {
      return res
        .status(400)
        .json({ message: "Cold Storage Details Not Found" });
    }

    const subject = `Invoice for Booking Id ${bookingdata?.b_id}`;

    // // Construct HTML email body
    const htmlBody = `
  <h2>Invoice</h2>
  <table style="width:100%; border-collapse: collapse;">
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Booking ID</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        bookingdata.b_id
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Check-in Date</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${new Date(
        bookingdata.b_checkInDate
      ).toDateString()}</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Check-out Date</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${new Date(
        bookingdata.b_checkOutDate
      ).toDateString()}</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Quantity of Goods</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        bookingdata.b_goodsQuantity
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Amount Paid</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        paymentdata.p_amount
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Customer Name</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        customerdetails.c_fullName
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Customer Email</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        customerdetails.c_email
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Customer Contact No</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        customerdetails.c_contactNo
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Cold Storage Name</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        coldstorage.cs_name
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Cold Storage Address</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        coldstorage.cs_address
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Cold Storage Price</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        coldstorage.cs_price
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Cold Storage Capacity</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        coldstorage.cs_capacity
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Owner Name</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        coldstorage.owner_ref.owner_fullName
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Owner Email</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        coldstorage.owner_ref.owner_email
      }</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Owner Contact No</th>
      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
        coldstorage.owner_ref.owner_contactNo
      }</td>
    </tr>
  </table>
`;

    // Convert HTML to PDF
    pdf.create(htmlBody).toBuffer(async (err, buffer) => {
      if (err) {
        return res.status(500).json({ error: "Error generating PDF" });
      }

      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="invoice.pdf"`
      );

      // Send PDF buffer as response
      res.send(buffer);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/payment/:c_id", authenticateToken, async (req, res) => {
  try {
    const { c_id } = req.params;

    // Fetch bookings for the customer
    const bookings = await Booking.find({ c_id });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ error: "Bookings not found" });
    }

    // Extract booking IDs
    const bookingIds = bookings.map((booking) => booking.b_id);

    // Fetch payments for the booking IDs
    const payments = await Payment.find({ b_id: { $in: bookingIds } });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ error: "Payments not found" });
    }

    // Add b_status to each payment
    const paymentsWithStatus = payments.map((payment) => {
      const booking = bookings.find((booking) => booking.b_id === payment.b_id);
      const b_status = booking ? booking.b_status : null;
      return { ...payment.toObject(), b_status };
    });

    // Convert ISO date strings to readable local format for payments
    const paymentsWithReadableDates = paymentsWithStatus.map((payment) => ({
      ...payment,
      p_date: new Date(payment.p_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));

    res.status(200).json(paymentsWithReadableDates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.get("/payment/:c_id", authenticateToken, async (req, res) => {
//   try {
//     const { c_id } = req.params;

//     const payments = await Payment.find({ c_id });

//     if (!payments) {
//       return res.status(404).json({ error: "Payments not found" });
//     }

//     // Convert ISO date strings to readable local format
//     const paymentWithRedableDates = payments.map((payment) => ({
//       ...payment.toObject(),
//       p_date: new Date(payment.p_date).toLocaleDateString("en-US", {
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       }),
//     }));

//     res.status(200).json(paymentWithRedableDates);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get("/chartdata/:c_id", authenticateToken, async (req, res) => {
  const { c_id } = req.params;

  try {
    // Get the start and end dates of the current month
    const currentDate = new Date();
    const startDateOfMonth = startOfMonth(currentDate);
    const endDateOfMonth = endOfMonth(currentDate);

    // Aggregate booking status data based on booking status, month, year, and cs_id
    const bookingStatusData = await Booking.aggregate([
      {
        $match: { c_id, b_status: { $in: ["Visited", "Booked", "Cancelled"] } }, // Filter by cs_id and booking status
      },
      {
        $group: {
          _id: {
            cs_id: "$cs_id",
            month: { $month: "$b_checkInDate" },
            year: { $year: "$b_checkInDate" },
            status: "$b_status",
          },
          count: { $sum: 1 }, // Count the bookings for each status
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          cs_id: "$_id.cs_id",
          month: "$_id.month",
          year: "$_id.year",
          status: "$_id.status",
          count: 1,
        },
      },
    ]);

    // Aggregate bookings based on check-in date month and year wise
    const bookingData = await Booking.aggregate([
      {
        $match: { c_id, b_status: { $in: ["Visited", "Booked"] } }, // Filter by c_id
      },
      {
        $group: {
          _id: {
            month: { $month: "$b_checkInDate" },
            year: { $year: "$b_checkInDate" },
          },
          count: { $sum: 1 }, // Count the bookings
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          month: "$_id.month",
          year: "$_id.year",
          count: 1,
        },
      },
    ]);

    const paymentData = await Booking.aggregate([
      {
        $match: { c_id, b_status: { $in: ["Visited", "Booked"] } },
      },
      {
        $lookup: {
          from: "payments", // Assuming the collection name is "payments"
          localField: "b_id",
          foreignField: "b_id",
          as: "payments",
        },
      },
      {
        $unwind: "$payments",
      },
      {
        $match: {
          "payments.p_date": { $gte: startDateOfMonth, $lte: endDateOfMonth }, // Filter payments within the current month
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$payments.p_date" },
            year: { $year: "$payments.p_date" },
          },
          totalPayment: { $sum: "$payments.p_amount" }, // Calculate total payment made this month
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalPayment: 1,
        },
      },
    ]);

    // Get the last booking
    const lastBooking = await Booking.findOne({ c_id })
      .sort({ b_checkInDate: -1 })
      .limit(1);

    //get last payment
    const lastPayment = await Payment.findOne({ c_id })
      .sort({ p_date: -1 })
      .limit(1);

    // Get the total booking count
    const totalBookingCount = await Booking.countDocuments({ c_id });

    res.status(200).json({
      bookingData,
      paymentData,
      lastBooking,
      totalBookingCount,
      lastPayment,
      bookingStatusData,
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route handler for sending emails
router.post("/mail/sendEmail", async (req, res) => {
  try {
    // Extract email details from the request body
    const { email, message, name } = req.body;

    const subject = "Contact Support Requested";

    // Construct HTML email body
    const htmlBody = `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // Define email options
    const mailOptions = {
      from: YOUR_EMAIL,
      to: email, // Set the recipient email address here
      subject,
      html: htmlBody, // Set HTML content
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Function For Forgotting the Customer Password
async function sendOTP(email, otp) {
  try {
    const mailOptions = {
      from: YOUR_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully.");
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP. Please try again later.");
  }
}

// Router handler for Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ error: "Please enter valid email address" });
    }
    // Check if the email exists in the database
    const user = await Customer.findOne({ c_email: email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist." });
    }

    // Generate a random OTP
    const otp = randomstring.generate({ length: 6, charset: "numeric" });

    // Save or update OTP and its expiry time in the database
    const otpExpiresAt = new Date(Date.now() + 600000); // OTP expires in 10 minutes
    let otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      otpRecord = new OTP({
        email,
        otp,
        expiresAt: otpExpiresAt,
        verified: false,
      });
    } else {
      otpRecord.otp = otp;
      otpRecord.expiresAt = otpExpiresAt;
      otpRecord.verified = false;
    }
    await otpRecord.save();

    // Send OTP to the user's email
    await sendOTP(email, otp);

    return res.status(200).json({
      message: `OTP sent to your email ${email} . Please check your inbox.`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

// Router handler for verifying OTP
router.post("/verify/otp", async (req, res) => {
  const { otp } = req.body;

  try {
    // Find the OTP record for the given email and OTP
    const otpRecord = await OTP.findOne({ otp, verified: false });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Return OTP record details
    return res
      .status(200)
      .json({ message: "OTP Verified Successfully", otpRecord });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

// Router handler for changing password
router.post("/change-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Invalid Data." });
    }
    // Find the OTP record for the given email and OTP
    const otpRecord = await OTP.findOne({ email, otp, verified: true });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or unverified OTP." });
    }

    // Find the user by email
    const user = await Customer.findOne({ c_email: email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.c_password = hashedPassword;
    await user.save();

    // Delete the OTP record
    await otpRecord.deleteOne();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

// Route to check capacity for a given date range and cs_id
router.get("/capacity/:cs_id", async (req, res) => {
  try {
    const { cs_id } = req.params;
    const { startDate, endDate } = req.query;

    // Convert string dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if start date is before end date
    if (start >= end) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    // Find the Cold Storage by cs_id
    const coldStorage = await ColdStorage.findOne({ cs_id });
    if (!coldStorage) {
      return res.status(404).json({ message: "Cold storage not found" });
    }

    // Get total booked goods quantity for this cs_id and within the date range
    const totalBookedGoodsQuantity = await Booking.aggregate([
      {
        $match: {
          cs_id,
          b_checkInDate: { $lte: end }, // Check if check-in date is before or on the end date
          b_checkOutDate: { $gte: start }, // Check if check-out date is after or on the start date
        },
      },
      { $group: { _id: null, total: { $sum: "$b_goodsQuantity" } } },
    ]);

    // Calculate remaining area in tons
    const totalBookedKg = totalBookedGoodsQuantity[0]?.total || 0; // Total booked goods quantity in kg
    const remainingCapacity = coldStorage.cs_capacity - totalBookedKg; // Remaining capacity in kg

    return res.json({ remainingCapacity });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route to check capacity for the current date and cs_id
router.get("/capacity/current/:cs_id", async (req, res) => {
  try {
    const { cs_id } = req.params;

    // Get today's date
    const today = new Date();

    // Find the Cold Storage by cs_id
    const coldStorage = await ColdStorage.findOne({ cs_id });
    if (!coldStorage) {
      return res.status(404).json({ message: "Cold storage not found" });
    }

    // Get total booked goods quantity for this cs_id and today's date
    const totalBookedGoodsQuantity = await Booking.aggregate([
      {
        $match: {
          cs_id,
          b_checkInDate: { $lte: today }, // Check if check-in date is before or on today's date
          b_checkOutDate: { $gte: today }, // Check if check-out date is after or on today's date
        },
      },
      { $group: { _id: null, total: { $sum: "$b_goodsQuantity" } } },
    ]);

    // Calculate remaining area in tons
    const totalBookedKg = totalBookedGoodsQuantity[0]?.total || 0; // Total booked goods quantity in kg
    const remainingCapacity = coldStorage.cs_capacity - totalBookedKg; // Remaining capacity in kg

    return res.json({ remainingCapacity });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route for weekly report with mandatory c_id filter

router.get("/reports/weekly/:c_id", authenticateToken, async (req, res) => {
  try {
    const { c_id } = req.params; // Get c_id from URL parameter

    const weeklyData = await Booking.aggregate([
      {
        $match: {
          c_id: c_id, // Filter by c_id
          b_status: { $in: ["Visited", "Booked"] },
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "b_id",
          foreignField: "b_id",
          as: "payments",
        },
      },
      {
        $sort: { b_checkInDate: -1 }, // Sort by check-in date in descending order
      },
      {
        $limit: 7, // Limit to the last 7 records
      },
      {
        $sort: { b_checkInDate: 1 }, // Sort by check-in date in ascending order to restore the original order
      },
    ]);
    res.json({ weeklyData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for monthly report with mandatory c_id filter
router.get("/reports/monthly/:c_id", authenticateToken, async (req, res) => {
  try {
    const { c_id } = req.params; // Get c_id from URL parameter
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const monthlyData = await Booking.aggregate([
      {
        $match: {
          b_checkInDate: { $gte: startDate, $lte: endDate },
          c_id: c_id, // Filter by c_id
          b_status: { $in: ["Visited", "Booked"] },
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "b_id",
          foreignField: "b_id",
          as: "payments",
        },
      },
    ]);
    res.json({ monthlyData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for yearly report with mandatory c_id filter
router.get("/reports/yearly/:c_id", authenticateToken, async (req, res) => {
  try {
    const { c_id } = req.params; // Get c_id from URL parameter
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1);
    const endDate = new Date(today.getFullYear(), 11, 31);
    const yearlyData = await Booking.aggregate([
      {
        $match: {
          b_checkInDate: { $gte: startDate, $lte: endDate },
          c_id: c_id,
          b_status: { $in: ["Visited", "Booked"] },
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "b_id",
          foreignField: "b_id",
          as: "payments",
        },
      },
    ]);
    res.json({ yearlyData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
