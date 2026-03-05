const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  date: Date,
  category: String,
  description: String,
  amount: Number,
});

ExpenseSchema.index(
  { date: 1, category: 1, description: 1, amount: 1 },
  { unique: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
