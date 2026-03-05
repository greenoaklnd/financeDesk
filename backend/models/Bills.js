const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  dueDate: Date,

  intervalType: {
    type: String,
    enum: ["none", "weekly", "monthly", "custom"],
    default: "none",
  },

  intervalDays: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Bill", BillSchema);
