const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authenticateToken } = require("../middlewares/authentication");
const Admin = require("../model/Admin");
const Booking = require("../model/Booking");
const Payment = require("../model/Payment");
const Customer = require("../model/Customer");
const ColdStorage = require("../model/ColdStorage");
const ColdStorageOwner = require("../model/ColdStorageOwner");
const { YOUR_EMAIL, EMAIL_PASSWORD } = process.env;

const OTP = require("../model/Otp");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { startOfMonth, endOfMonth } = require("date-fns");

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: YOUR_EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

const router = express.Router();

async function generateAdminId() {
  const lastAdmin = await Admin.findOne().sort({
    a_id: -1,
  });
  let nextAdminNumber = 1;
  if (lastAdmin) {
    const lastAdminNumber = parseInt(lastAdmin.a_id.split("-")[1]);
    if (!isNaN(lastAdminNumber)) {
      nextAdminNumber = lastAdminNumber + 1;
    }
  }

  return `ADMIN-${nextAdminNumber}`;
}

// Admin Registration
router.post("/register", async (req, res) => {
  try {
    const { a_fullName, a_email, a_contactNo, a_address, a_password } =
      req.body;

    // Check if any required fields are empty
    if (!a_fullName || !a_email || !a_contactNo || !a_address || !a_password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the email or contact number already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ a_email: a_email }, { a_contactNo: a_contactNo }],
    });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ error: "Email or contact number already exists" });
    }

    const a_id = await generateAdminId();
    const hashedPassword = await bcrypt.hash(a_password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      a_id,
      a_fullName,
      a_email,
      a_contactNo,
      a_address,
      a_password: hashedPassword,
    });

    // Save the new admin to the database
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ error: error.message });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { a_email, a_password } = req.body;

    // Validate required fields
    if (!a_email || !a_password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the admin by email
    const admin = await Admin.findOne({ a_email });

    // If admin not found or password doesn't match
    if (!admin || !(await bcrypt.compare(a_password, admin.a_password))) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign({ userId: admin._id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    const adminData = {
      id: admin._id,
      username: admin.a_fullName,
      email: admin.a_email,
      role: admin.role,
      uid: admin.a_id,
    };

    // Send token in response
    res.json({ token: token, user: adminData });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Admin Update Details
router.put("/:adminId", authenticateToken, async (req, res) => {
  try {
    const { a_fullName, a_contactNo, a_address } = req.body;
    const adminId = req.params.adminId;

    // Update admin fields
    const updateFields = {};
    if (a_fullName) {
      updateFields.a_fullName = a_fullName;
    }
    if (a_contactNo) {
      updateFields.a_contactNo = a_contactNo;
    }
    if (a_address) {
      updateFields.a_address = a_address;
    }

    // Find and update the admin
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateFields, {
      new: true,
    });

    // Check if the admin exists
    if (!updatedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Admin by ID
router.get("/:adminId", async (req, res) => {
  try {
    const adminId = req.params.adminId;

    // Find the admin by ID
    const admin = await Admin.findById(adminId).select("-a_password");

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Exclude the password field and send the admin data
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error retrieving admin:", error);
    res.status(500).json({ error: error.message });
  }
});

/**-----------------------------[Booking/payment/databas]------------------------ */
router.get("/booking/all", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find();

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

router.get("/payment/all", authenticateToken, async (req, res) => {
  try {
    // Fetch bookings for the customer
    const bookings = await Booking.find();

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

router.get("/count/all", authenticateToken, async (req, res) => {
  try {
    const bookingCount = await Booking.countDocuments();
    const customerCount = await Customer.countDocuments();
    const approvedStorage = await ColdStorage.countDocuments({
      cs_status: true,
    });
    const notApprovedStorage = await ColdStorage.countDocuments({
      cs_status: false,
    });

    const totalOwners = await ColdStorageOwner.countDocuments();

    const bookingStatusCounts = await Booking.aggregate([
      {
        $group: {
          _id: "$b_status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the status counts into an object
    const formattedBookingStatusCounts = bookingStatusCounts.reduce(
      (acc, status) => {
        acc[status._id] = status.count;
        return acc;
      },
      {}
    );

    res.status(200).json({
      bookingCount,
      customerCount,
      approvedStorage,
      notApprovedStorage,
      totalOwners,
      bookingStatusCounts: formattedBookingStatusCounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch booking data
const getBookingData = async () => {
  try {
    const bookings = await Booking.aggregate([
      {
        $match: { b_status: { $in: ["Visited", "Booked"] } }, // Filter by statuses Visited or Booked
      },
      {
        $project: {
          year: { $year: "$b_checkInDate" },
          month: { $month: "$b_checkInDate" },
          cs_id: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month", cs_id: "$cs_id" },
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: {
            $concat: [
              { $toString: "$_id.month" },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          bookings: 1,
          cs_id: "$_id.cs_id",
        },
      },
    ]);
    return bookings;
  } catch (error) {
    console.error("Error fetching booking data:", error);
    throw error;
  }
};

// Function to fetch payment data
const getPaymentData = async () => {
  try {
    const payments = await Booking.aggregate([
      {
        $match: { b_status: { $in: ["Visited", "Booked"] } }, // Filter by statuses Visited or Booked
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
        $unwind: "$payments",
      },
      {
        $group: {
          _id: {
            year: { $year: "$payments.p_date" },
            month: { $month: "$payments.p_date" },
            cs_id: "$cs_id",
          },
          totalPayment: { $sum: "$payments.p_amount" },
        },
      },
      {
        $project: {
          _id: 0,
          year: {
            $concat: [
              { $toString: "$_id.month" },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          payments: "$totalPayment",
          cs_id: "$_id.cs_id",
        },
      },
    ]);
    return payments;
  } catch (error) {
    console.error("Error fetching payment data:", error);
    throw error;
  }
};

router.get("/chart/all", authenticateToken, async (req, res) => {
  try {
    const bookingData = await getBookingData();
    const paymentData = await getPaymentData();

    // Aggregate booking status data based on booking status, month, year
    const bookingStatusData = await Booking.aggregate([
      {
        $match: { b_status: { $in: ["Visited", "Booked", "Cancelled"] } },
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

    res.status(200).json({ bookingData, paymentData, bookingStatusData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get/notapprove/storage", authenticateToken, async (req, res) => {
  try {
    const recentapprove = await ColdStorage.find({ cs_status: false }).populate(
      {
        path: "owner_ref",
        select: "-owner_password",
      }
    );

    res.status(200).json(recentapprove);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get/approve/storage", authenticateToken, async (req, res) => {
  try {
    const approve = await ColdStorage.find({ cs_status: true }).populate({
      path: "owner_ref",
      select: "-owner_password",
    });

    res.status(200).json(approve);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/set/approve/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const updatedStorage = await ColdStorage.findByIdAndUpdate(
      id,
      { cs_status: true },
      { new: true }
    );

    if (!updatedStorage) {
      return res.status(404).json({ message: "Storage not found" });
    }

    res.status(200).json({ message: "Cold Storage Approvded by you !" });
  } catch (error) {
    console.error("Error updating storage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/set/notapprove/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const updatedStorage = await ColdStorage.findByIdAndUpdate(
      id,
      { cs_status: false },
      { new: true }
    );

    if (!updatedStorage) {
      return res.status(404).json({ message: "Storage not found" });
    }

    res.status(200).json({ message: "Cold Storage Disapproved by you !" });
  } catch (error) {
    console.error("Error updating storage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get/customer/data", authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.find();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get/owner/data", authenticateToken, async (req, res) => {
  try {
    const owner = await ColdStorageOwner.find();
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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
    const user = await Admin.findOne({ a_email: email });
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
    const user = await Admin.findOne({ a_email: email });
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

/**--------------------[Routes for Reports]------------------- */
// Route for weekly report
router.get("/reports/weekly", authenticateToken, async (req, res) => {
  try {
    const weeklyData = await Booking.aggregate([
      {
        $match: {
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

// Route for monthly report
router.get("/reports/monthly", authenticateToken, async (req, res) => {
  try {
    const monthlyData = await Booking.aggregate([
      {
        $match: {
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

// Route for yearly report
router.get("/reports/yearly", authenticateToken, async (req, res) => {
  try {
    const yearlyData = await Booking.aggregate([
      {
        $match: {
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

// Route for yearly report with optional CS_ID filter
router.get("/reports/yearly/:year", authenticateToken, async (req, res) => {
  try {
    const { year } = req.params; // Get year from URL parameter
    const { csId } = req.query; // Get CS_ID from query parameters

    const startDate = new Date(year, 0, 1); // Start of the year
    const endDate = new Date(year, 11, 31); // End of the year

    const matchStage = {
      $match: {
        b_checkInDate: { $gte: startDate, $lte: endDate }, // Filter by year
        b_status: { $in: ["Visited", "Booked"] },
      },
    };

    if (csId) {
      matchStage.$match.cs_id = csId; // Add CS_ID filter if provided
    }

    const yearlyData = await Booking.aggregate([
      matchStage,
      {
        $lookup: {
          from: "payments",
          localField: "b_id",
          foreignField: "b_id",
          as: "payments",
        },
      },
    ]);
    res.json(yearlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for monthly report with optional CS_ID filter
router.get("/reports/monthly/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params; // Get year and month from URL parameters
    const { csId } = req.query; // Get CS_ID from query parameters

    // Calculate the start and end dates for the specified month and year
    const startDate = new Date(year, month - 1, 1); // Month is 0-indexed, so subtract 1
    const endDate = new Date(year, month, 0); // Get the last day of the month

    const matchStage = {
      $match: {
        b_checkInDate: { $gte: startDate, $lte: endDate }, // Filter by month and year
        b_status: { $in: ["Visited", "Booked"] },
      },
    };

    if (csId) {
      matchStage.$match.cs_id = csId; // Add CS_ID filter if provided
    }

    const monthlyData = await Booking.aggregate([
      matchStage,
      {
        $lookup: {
          from: "payments",
          localField: "b_id",
          foreignField: "b_id",
          as: "payments",
        },
      },
    ]);

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
