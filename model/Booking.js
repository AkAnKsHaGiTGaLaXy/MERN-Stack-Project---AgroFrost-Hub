const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    b_id: {
      type: String,
      required: true,
      unique: true,
    },
    cs_id: {
      type: String,
      required: true,
    },
    c_id: {
      type: String,
      required: true,
    },
    b_checkInDate: {
      type: Date,
      required: true,
    },
    b_checkOutDate: {
      type: Date,
      required: true,
    },
    b_goodsQuantity: {
      type: Number,
      required: true,
    },
    b_status: {
      type: String,
      required: true,
      default: "Booked",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
