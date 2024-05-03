const express = require("express");
require("dotenv").config();
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const connectToDatabase = require("./db/Connection");
const ColdstorageOwnerRouter = require("./routes/ColdstorageOwnerRouter");
const CustomerRouter = require("./routes/CustomerRouter");
const AdminRouter = require("./routes/AdminRouter");

// Create an instance of Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Define a route handler for the root path
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", ColdstorageOwnerRouter);

app.use("/api", CustomerRouter);

app.use("/api", AdminRouter);

// Define the port to listen on
const port = 3000;

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
