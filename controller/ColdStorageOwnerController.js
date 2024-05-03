const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { SECRET_KEY, YOUR_EMAIL, EMAIL_PASSWORD } = process.env;
const ColdStorageOwner = require("../model/ColdStorageOwner");
const { authenticateToken } = require("../middlewares/authentication");
const ColdStorage = require("../model/ColdStorage");
const Payment = require("../model/Payment");
const Booking = require("../model/Booking");
const { startOfMonth, endOfMonth } = require("date-fns");
const OTP = require("../model/Otp");
const nodemailer = require("nodemailer");
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

// Define multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder for file uploads
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    // Generate a timestamp
    const timestamp = Date.now();
    // Get the file extension
    const ext = path.extname(file.originalname);
    // Set the filename to be the timestamp, underscore, and file extension
    const filename = `${timestamp}_${file.originalname}`;
    cb(null, filename);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage }).single("file");

//Function to genrate owner id of cold storage owner
async function generateColdStorageOwnerId() {
  const lastRegistration = await ColdStorageOwner.findOne().sort({
    owner_id: -1,
  });

  let nextRegistrationNumber = 1;

  if (lastRegistration) {
    const lastRegistrationNumber = parseInt(
      lastRegistration.owner_id.split("-")[1]
    );

    if (!isNaN(lastRegistrationNumber)) {
      nextRegistrationNumber = lastRegistrationNumber + 1;
    }
  }

  // Format the registration number to always have two digits
  const formattedRegistrationNumber = nextRegistrationNumber
    .toString()
    .padStart(2, "0");

  // Generate the new owner ID
  const newOwnerId = `CSOREG-${formattedRegistrationNumber}`;

  return newOwnerId;
}

//Function to generate cold storage id
async function generateColdStorageId() {
  const lastCSId = await ColdStorage.findOne().sort({
    cs_id: -1,
  });

  let nextColdId = 1;

  if (lastCSId) {
    const lastColdId = parseInt(lastCSId.cs_id.split("-")[1]);
    if (!isNaN(lastColdId)) {
      nextColdId = lastColdId + 1;
    }
  }

  // Format the cold storage ID to always have two digits
  const formattedColdId = nextColdId.toString().padStart(2, "0");

  // Generate the new cold storage ID
  const newColdId = `CS-${formattedColdId}`;

  return newColdId;
}

router.post("/register", async (req, res) => {
  try {
    // Cold storage account registration
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    const {
      owner_fullName,
      owner_email,
      owner_contactNo,
      owner_password,
      owner_confirmPass,
    } = req.body;

    if (
      !owner_fullName ||
      !owner_email ||
      !owner_contactNo ||
      !owner_password ||
      !owner_confirmPass
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    if (!emailRegex.test(owner_email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Validate phone number format and length
    if (
      !phoneRegex.test(owner_contactNo) ||
      owner_contactNo.toString().length !== 10
    ) {
      return res
        .status(400)
        .json({ error: "Invalid mobile number format (must be 10 digits)" });
    }

    if (owner_password !== owner_confirmPass) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Validate password complexity
    if (!passwordRegex.test(owner_password)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character",
      });
    }

    const existingColdOwner = await ColdStorageOwner.findOne({
      $or: [{ owner_email }, { owner_contactNo: owner_contactNo }],
    });

    if (existingColdOwner) {
      return res.status(400).json({
        error:
          "Cold storage owner already exists (email or contact number already registered)",
      });
    }

    const hashedPassword = await bcrypt.hash(owner_password, 10);

    const ownerId = await generateColdStorageOwnerId();

    const newColdStorageOwner = new ColdStorageOwner({
      owner_contactNo: owner_contactNo,
      owner_email: owner_email,
      owner_fullName: owner_fullName,
      owner_password: hashedPassword,
      owner_id: ownerId,
      role: "owner",
    });

    await newColdStorageOwner.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register cold storage owner" });
  }
});

router.put("/register/details", authenticateToken, async (req, res) => {
  try {
    const { owner_fullName, owner_id, owner_contactNo } = req.body;

    if (!owner_fullName || !owner_id || !owner_contactNo) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate contact number
    if (owner_contactNo && !/^\d{10}$/.test(owner_contactNo)) {
      return res
        .status(400)
        .json({ error: "Contact number must be a 10-digit number" });
    }

    // Find the existing cold storage owner
    const existingColdOwner = await ColdStorageOwner.findOneAndUpdate(
      { owner_id: owner_id },
      {
        owner_fullName,
        owner_contactNo,
      },
      { new: true } // To return the updated document
    );

    if (!existingColdOwner) {
      return res.status(400).json({
        error: "Cold Storage Owner Profile Not Found",
      });
    }

    res.status(201).json({
      message: "Registration details updated",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ error: "Failed update to register cold storage owner" });
  }
});

//cold storage owner login
router.post("/login", async (req, res) => {
  try {
    const { owner_email, owner_password } = req.body;

    // Validate required fields
    if (!owner_email || !owner_password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the user by email
    const user = await ColdStorageOwner.findOne({ owner_email });

    // If cold storage not found or owner_password doesn't match
    if (!user || !(await bcrypt.compare(owner_password, user.owner_password))) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "24h",
    });

    const userdata = {
      id: user._id,
      username: user.owner_fullName,
      email: user.owner_email,
      role: user.role,
      uid: user.owner_id,
    };

    // Send token in response
    res.json({ token: token, user: userdata });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

//Get Cold Storage Profile Details
router.get("/:ownerid", async (req, res) => {
  try {
    const ownerid = req.params.ownerid;

    // Find the owner by ID
    const owner = await ColdStorageOwner.findById(ownerid).select(
      "-owner_password"
    );

    if (!owner) {
      return res.status(404).json({ error: "owner not found" });
    }

    // Exclude the password field and send the customer data
    res.status(200).json(owner);
  } catch (error) {
    console.error("Error retrieving owner:", error);
    res.status(500).json({ error: error.message });
  }
});

//cold storage new details save
router.post("/create/coldstorage", authenticateToken, async (req, res) => {
  try {
    const {
      owner_id,
      cs_name,
      cs_area,
      cs_capacity,
      cs_address,
      cs_price,
      cs_time,
      owner_ref,
    } = req.body;

    console.log(req.body);

    if (
      !owner_id ||
      !cs_name ||
      !cs_area ||
      !cs_capacity ||
      !cs_address ||
      !cs_price ||
      !cs_time ||
      !owner_ref
    ) {
      return res.status(400).json({ error: "Fields cant be empty" });
    }

    const csOwner = await ColdStorageOwner.findOne({ owner_id: owner_id });

    if (!csOwner) {
      return res
        .status(400)
        .json({ error: "Cold Storage Owner Not Found please register" });
    }

    const csalreadyexist = await ColdStorage.findOne({ owner_id: owner_id });

    if (csalreadyexist) {
      return res.status(400).json({ error: "Already exist cold storage" });
    }

    const cs_id = await generateColdStorageId();

    const coldStorage = new ColdStorage({
      owner_id: owner_id,
      cs_name: cs_name,
      cs_price: cs_price,
      cs_time: cs_time,
      cs_address: cs_address,
      cs_area: cs_area,
      cs_capacity: cs_capacity,
      owner_ref: owner_ref,
      cs_id: cs_id,
      cs_status: false,
    });

    await coldStorage.save();

    res.status(201).json({ message: "Cold storage added successfully" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

//Get Cold Storage by
router.get("/storage/:owner_id", authenticateToken, async (req, res) => {
  try {
    const { owner_id } = req.params;
    const storage = await ColdStorage.findOne({ owner_id });

    res.status(200).json(storage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get/storage/:owner_id", authenticateToken, async (req, res) => {
  try {
    const { owner_id } = req.params;
    const storage = await ColdStorage.findOne({ owner_id: owner_id }).populate({
      path: "owner_ref",
      select: "-owner_password",
    });

    res.status(200).json(storage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update details of a cold storage facility
router.put(
  "/update/coldstorage/:cs_id",
  authenticateToken,
  async (req, res) => {
    try {
      const { cs_name, cs_area, cs_capacity, cs_address, cs_price, cs_time } =
        req.body;
      const { cs_id } = req.params;

      // Check if required fields are provided
      if (
        !cs_name ||
        !cs_area ||
        !cs_capacity ||
        !cs_address ||
        !cs_price ||
        !cs_time
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Update the cold storage details using findOneAndUpdate
      const updatedColdStorage = await ColdStorage.findOneAndUpdate(
        { cs_id },
        {
          $set: {
            cs_name,
            cs_area,
            cs_capacity,
            cs_address,
            cs_price,
            cs_time,
          },
        },
        { new: true }
      );

      // Check if the cold storage is found and updated
      if (!updatedColdStorage) {
        return res.status(404).json({ error: "Cold storage not found" });
      }

      res
        .status(200)
        .json({ message: "Cold storage details updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update cs_image for a specific cs_id
router.put(
  "/update/coldstorage/image/:cs_id",
  authenticateToken,
  async (req, res) => {
    try {
      // Handle file upload
      upload(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to upload image" });
        }

        const { cs_id } = req.params;

        // Check if cs_id exists
        const coldStorage = await ColdStorage.findOne({ cs_id });

        if (!coldStorage) {
          return res.status(404).json({ error: "Cold storage not found" });
        }

        let updateFields = {};

        // Delete previous image if exists
        if (coldStorage.cs_image) {
          const imagePath = path.join(
            __dirname,
            "../uploads",
            coldStorage.cs_image
          );
          // Check if file exists before attempting to delete
          if (fs.existsSync(imagePath)) {
            // Delete the file
            fs.unlinkSync(imagePath);
          }
          // Set cs_image to null after deleting the file
          updateFields.cs_image = null;
        }

        // Save new image filename
        if (req.file) {
          updateFields.cs_image = req.file.filename;
        }

        // Update the cold storage document
        await ColdStorage.findOneAndUpdate({ cs_id }, updateFields);

        res
          .status(200)
          .json({ message: "Cold storage image updated successfully" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**-----------------------------[Router For Booking and Payment]---------------------- */
router.get("/booking/all/:cs_id", authenticateToken, async (req, res) => {
  try {
    const { cs_id } = req.params;

    const bookings = await Booking.find({ cs_id });

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
    const allowedStatus = ["Visited"];
    if (!allowedStatus.includes(b_status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    // Update the booking status
    const updatedBooking = await Booking.findOneAndUpdate(
      { b_id },
      { $set: { b_status } },
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({ message: "Booking Cancelled" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/payment/all/:cs_id", authenticateToken, async (req, res) => {
  try {
    const { cs_id } = req.params;

    // Fetch bookings for the customer
    const bookings = await Booking.find({ cs_id });

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

router.get("/chartdata/:cs_id", authenticateToken, async (req, res) => {
  const { cs_id } = req.params;

  try {
    // Get the start and end dates of the current month
    const currentDate = new Date();
    const startDateOfMonth = startOfMonth(currentDate);
    const endDateOfMonth = endOfMonth(currentDate);

    // Aggregate bookings based on check-in date month and year wise
    const bookingData = await Booking.aggregate([
      {
        $match: { cs_id, b_status: { $in: ["Visited", "Booked"] } }, // Filter by cs_id and statuses Visited or Booked
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

    // Aggregate bookings based on check-in date month and year wise, grouped by status
    const bookingStatusData = await Booking.aggregate([
      {
        $match: { cs_id }, // Filter by cs_id
      },
      {
        $group: {
          _id: {
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
          month: "$_id.month",
          year: "$_id.year",
          status: "$_id.status",
          count: 1,
        },
      },
    ]);

    // Aggregate payments made this month, filtering by bookings with statuses Visited or Booked
    const paymentData = await Booking.aggregate([
      {
        $match: { cs_id, b_status: { $in: ["Visited", "Booked"] } }, // Filter by cs_id and statuses Visited or Booked
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
    const lastBooking = await Booking.findOne({ cs_id })
      .sort({ b_checkInDate: -1 })
      .limit(1);

    //get last payment
    const lastPayment = await Payment.findOne({ cs_id })
      .sort({ p_date: -1 })
      .limit(1);

    // Get the total booking count
    const totalBookingCount = await Booking.countDocuments({ cs_id });

    res.status(200).json({
      bookingData,
      bookingStatusData,
      paymentData,
      lastBooking,
      totalBookingCount,
      lastPayment,
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
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
    const user = await ColdStorageOwner.findOne({ owner_email: email });
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
    const user = await ColdStorageOwner.findOne({ owner_email: email });
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

/**------------------[Reports Router]----------------- */
// Route for weekly report with mandatory CS_ID filter
router.get("/reports/weekly/:cs_id", authenticateToken, async (req, res) => {
  try {
    const { cs_id } = req.params; // Get CS_ID from URL parameter

    const weeklyData = await Booking.aggregate([
      {
        $match: {
          cs_id: cs_id, // Filter by CS_ID
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

// Route for monthly report with mandatory CS_ID filter
router.get("/reports/monthly/:cs_id", authenticateToken, async (req, res) => {
  try {
    const { cs_id } = req.params; // Get CS_ID from URL parameter

    const monthlyData = await Booking.aggregate([
      {
        $match: {
          cs_id: cs_id, // Filter by CS_ID
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

// Route for yearly report with mandatory CS_ID filter
router.get("/reports/yearly/:cs_id", authenticateToken, async (req, res) => {
  try {
    const { cs_id } = req.params; // Get CS_ID from URL parameter

    const yearlyData = await Booking.aggregate([
      {
        $match: {
          cs_id: cs_id,
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
