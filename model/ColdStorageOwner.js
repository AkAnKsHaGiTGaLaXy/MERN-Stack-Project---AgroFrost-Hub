const { mongoose } = require("mongoose");

// Define a schema for Cold Storage Owner
const coldStorageOwnerSchema = new mongoose.Schema(
  {
    owner_id: { type: String, required: true, unique: true },
    owner_fullName: { type: String, required: true },
    owner_email: { type: String, required: true, unique: true },
    owner_contactNo: {
      type: Number,
      required: true,
      maxlength: 10,
      unique: true,
    },
    owner_password: { type: String, required: true },
    role: { type: String, required: true, default: "owner" },
  },
  { timestamps: true }
);

// Define a model for Cold Storage Owner
const ColdStorageOwner = mongoose.model(
  "ColdStorageOwner",
  coldStorageOwnerSchema
);

module.exports = ColdStorageOwner;
