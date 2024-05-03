const { mongoose } = require("mongoose");

// Define a schema for Cold Storage
const coldStorageSchema = new mongoose.Schema(
  {
    owner_id: { type: String, required: true, unique: true },
    cs_id: { type: String, required: true, unique: true },
    cs_name: { type: String, required: true },
    cs_image: { type: String, default: null },
    cs_area: { type: Number, required: true, double: true },
    cs_capacity: { type: Number, required: true, double: true },
    cs_address: { type: String, required: true },
    cs_price: { type: Number, required: true, double: true },
    cs_time: {
      type: {
        monday: { type: String, required: true },
        tuesday: { type: String, required: true },
        wednesday: { type: String, required: true },
        thursday: { type: String, required: true },
        friday: { type: String, required: true },
        saturday: { type: String, required: true },
        sunday: { type: String, required: true },
      },
      required: true,
    },
    owner_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ColdStorageOwner",
      required: true,
    },
    cs_status: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

// Define a model for Cold Storage Owner
const ColdStorage = mongoose.model("ColdStorage", coldStorageSchema);

module.exports = ColdStorage;
