const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

//////////////////////////////////////
// ✅ CONNECT MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/invoiceDB")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

//////////////////////////////////////
// ✅ SCHEMA
const Invoice = mongoose.model("Invoice", {
  invoiceNo: String,
  total: Number,
  discount: Number,
  finalTotal: Number,
  customer: Object,
  date: String
});

//////////////////////////////////////
// ✅ CALCULATE + SAVE
app.post("/calculate", async (req, res) => {

  let total = req.body.total;

  let finalTotal = total;
  let discount = 0;

  if(total >= 2000){
    finalTotal = 1800;
    discount = total - finalTotal;
  }

  let invoiceNo = "INV-" + Date.now();

  // SAVE TO DATABASE
  await Invoice.create({
    invoiceNo: invoiceNo,
    total: total,
    discount: discount,
    finalTotal: finalTotal,
    customer: req.body.customer,
    date: new Date().toLocaleString()
  });

  res.json({
    invoiceNo,
    total,
    discount,
    finalTotal
  });
});

//////////////////////////////////////
// ✅ GET ALL INVOICES (THIS FIXES YOUR ERROR)
app.get("/invoices", async (req, res) => {
  try {
    let data = await Invoice.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching invoices" });
  }
});

//////////////////////////////////////
// OPTIONAL TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

//////////////////////////////////////
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000 🚀");
});