const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  a_id: {
    type: String,
    required: true,
  },
  a_fullName: {
    type: String,
    required: true,
  },
  a_email: {
    type: String,
    required: true,
  },
  a_contactNo: {
    type: Number,
    required: true,
    unique: true,
  },
  a_address: {
    type: String,
    required: true,
  },
  a_password: {
    type: String,
    required: true,
  },
  role: { type: String, required: true, default: "admin" },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
