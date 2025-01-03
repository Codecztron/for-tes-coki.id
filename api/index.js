// api/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // Tambahkan rate limiting
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware

// 1. Rate Limiting (untuk mencegah brute-force dan DDoS attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Batasi 100 request per IP per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Terlalu banyak request dari IP ini, coba lagi nanti.",
});
app.use(limiter);

// 2. CORS (untuk mengizinkan request dari frontend)
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Ambil dari .env (hanya izinkan dari frontend Anda)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"], // Header yang diizinkan
    credentials: false, // Set to true only if necessary for cookies, authorization headers with HTTPS
  }),
);

// 3. Body Parser (untuk parsing request body JSON)
app.use(express.json());

// Koneksi ke MongoDB
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

// API Endpoint untuk menyimpan data
app.post("/api", async (req, res) => {
  try {
    const newJoki = new Joki(req.body);
    const savedJoki = await newJoki.save();
    res.status(201).json(savedJoki);
  } catch (error) {
    console.error("Error saat menyimpan data:", error);

    if (error.name === "ValidationError") {
      res.status(400).json({
        error: "Validasi data gagal",
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: "Gagal menyimpan data ke database",
        message: error.message,
      });
    }
  }
});

// Jalankan server (Hanya diperlukan untuk local development, tidak untuk Vercel)
// app.listen(port, () => {
//   console.log(`Server berjalan di port ${port}`);
// });

module.exports = app; // Export app untuk Vercel
