const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());

// 👇 اینجا لینک MongoDB خودتو بذار
mongoose.connect("mongodb+srv://<nsr_sn1persan>:<1384A.a1384>@cluster0.jymdeua.mongodb.net/?appName=Cluster0");

const Product = mongoose.model("Product", {
  name: String,
  barcode: String,
  batch: String,
  expiry: Date,
  quantity: Number
});

// افزودن دارو
app.post("/add", async (req, res) => {
  const p = new Product(req.body);
  await p.save();
  res.send("Saved");
});

// دریافت همه
app.get("/all", async (req, res) => {
  const data = await Product.find();
  res.json(data);
});

// هشدار انقضا
app.get("/expiry-alerts", async (req, res) => {
  const today = new Date();
  const next30 = new Date();
  next30.setDate(today.getDate() + 30);

  const expiring = await Product.find({
    expiry: { $lte: next30 }
  }).sort({ expiry: 1 });

  res.json(expiring);
});

// منقضی
app.get("/expired", async (req, res) => {
  const today = new Date();

  const expired = await Product.find({
    expiry: { $lt: today }
  });

  res.json(expired);
});

// اجرای روزانه
cron.schedule("0 8 * * *", async () => {
  console.log("Checking expiry...");
});

app.listen(3000, () => console.log("Server running on 3000"));
