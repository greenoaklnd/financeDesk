const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Expense = require("./models/Expense");
const Bill = require("./models/Bills");
const Debt = require("./models/Debt");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/moneyDesk") 
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Backend is alive"));

// GET all expenses
app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//post expense
app.post("/expenses", async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    res.status(400).json({ error: "Failed to add expense" });
  }
});


// CSV import
const upload = multer({ dest: "uploads/" });

app.post("/import", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const results = [];

  // clear old data
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to clear old expenses" });
  }

  fs.createReadStream(req.file.path)
    .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
    .on("data", (data) => {
      const parsedDate = new Date(data.Date);
      const parsedAmount = Number(data.Amount);

      if (!isNaN(parsedDate.getTime()) && !isNaN(parsedAmount)) {
        results.push({
          date: parsedDate,
          category: data.Category || "Other",
          description: data.Description || "",
          amount: parsedAmount,
        });
      } else {
        console.log("Skipping invalid row:", data);
      }
    })
    .on("error", (err) => {
      console.error("CSV read error:", err);
      res.status(500).json({ error: "CSV read error" });
    })
    .on("end", async () => {
      console.log("CSV parsing finished. Rows to insert:", results.length);
      try {
        if (results.length > 0) {
          await Expense.insertMany(results, { ordered: false });
        }
        fs.unlinkSync(req.file.path);
        res.json({ message: "Import successful", count: results.length });
      } catch (err) {
        console.error("Insert failed:", err);
        res.status(500).json({ error: "Insert failed" });
      }
    });
});
   
   //bills
   // GET bills
app.get("/bills", async (req, res) => {
  const bills = await Bill.find().sort({ dueDate: 1 });
  res.json(bills);
});

// ADD bill
app.post("/bills", async (req, res) => {
  const newBill = new Bill(req.body);
  await newBill.save();
  res.json(newBill);
});

// UPDATE bill
app.put("/bills/:id", async (req, res) => {
  try {
    const updated = await Bill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update bill" });
  }
});

// DELETE bill
app.delete("/bills/:id", async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete bill" });
  }
});

// GET all debts
app.get("/debts", async (req, res) => {
  const debts = await Debt.find();
  res.json(debts);
});

// ADD debt
app.post("/debts", async (req, res) => {
  const newDebt = new Debt(req.body);
  await newDebt.save();
  res.json(newDebt);
});

// DELETE debt
app.delete("/debts/:id", async (req, res) => {
  await Debt.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});




app.listen(5001, () => console.log("Server running on port 5001"));
