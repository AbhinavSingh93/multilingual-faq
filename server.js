const express = require("express");
const mongoose = require("mongoose");
const faqRoutes = require("./Routes/faqRoutes");
require('dotenv').config();
const cors = require("cors");

const app = express();
app.use(cors()); 
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/faq")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.use("/api/faqs", faqRoutes);

app.get("/", (req, res) => {
  res.send("FAQ API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

