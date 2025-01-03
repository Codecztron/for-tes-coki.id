const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Ambil dari .env
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // Set to true only if necessary
  }),
);
app.use(express.json());

// Koneksi ke MongoDB (dengan nama database eksplisit)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Terhubung"))
  .catch((err) => console.error("Koneksi MongoDB gagal:", err));

// Schema Mongoose
const jokiSchema = new mongoose.Schema({
  idJoki: { type: String, required: true },
  namaPenjoki: { type: String, required: true },
  idKlien: { type: String, required: true },
  tanggalTerima: { type: String, required: true },
  tanggalSelesai: { type: String, required: true },
  deskripsi: { type: String },
  metode: { type: String, required: true },
  nota: { type: String, required: true },
  status: { type: String, required: true },
  linkFile: { type: String },
  catatan: { type: String },
});

const Joki = mongoose.model("Joki", jokiSchema);

// API Endpoint untuk menyimpan data (dengan error handling yang lebih baik)
app.post("/api/save-joki", async (req, res) => {
  try {
    const newJoki = new Joki(req.body);
    const savedJoki = await newJoki.save();
    res.status(201).json(savedJoki);
  } catch (error) {
    console.error("Error saat menyimpan data:", error);
    res.status(500).json({
      error: "Gagal menyimpan data ke database",
      message: error.message,
    });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
