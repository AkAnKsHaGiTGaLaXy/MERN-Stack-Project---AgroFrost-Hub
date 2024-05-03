const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    p_id: {
      type: String,
      required: true,
      unique: true,
    },
    b_id: {
      type: String,
      required: true,
    },
    p_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    p_amount: {
      type: Number,
      required: true,
    },
    cs_id: {
      type: String,
      required: true,
    },
    c_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
