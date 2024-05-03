const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    c_id: {
      type: String,
      required: true,
    },
    c_fullName: {
      type: String,
      required: true,
    },
    c_email: {
      type: String,
      required: true,
    },
    c_contactNo: {
      type: Number,
      required: true,
      unique: true,
    },
    c_address: {
      type: String,
      required: true,
    },
    c_password: {
      type: String,
      required: true,
    },
    role: { type: String, required: true, default: "user" },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
