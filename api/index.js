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
    origin: "*", // Allow all origins temporarily for debugging
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
);

// 3. Body Parser (untuk parsing request body JSON)
app.use(express.json());

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("MongoDB Terhubung"))
  .catch((err) => console.error("Koneksi MongoDB gagal:", err));

// Schema Mongoose
const jokiSchema = new mongoose.Schema({
  idJoki: { type: String, required: true },
  namaPenjoki: { type: String, required: true },
  idKlien: { type: String, required: true },
  tanggalTerima: { type: String, required: true },
  tanggalSelesai: { type: String, required: true },
  deskripsi: { type: String, default: "-" },
  metode: { type: String, required: true },
  nota: { type: String, required: true },
  status: { type: String, required: true },
  linkFile: { type: String, default: "-" },
  catatan: { type: String, default: "-" },
});

const Joki = mongoose.model("Joki", jokiSchema);

// API Endpoint untuk menyimpan data
app.post("/api", async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Request body is empty");
    }

    // Format nota to store raw number
    const formattedData = {
      ...req.body,
      deskripsi: req.body.deskripsi || "-",
      linkFile: req.body.linkFile || "-",
      catatan: req.body.catatan || "-",
      nota: req.body.nota.replace(/[^0-9]/g, ""),
      tanggalTerima: `${req.body.tanggalTerima}`,
      tanggalSelesai: `${req.body.tanggalSelesai}`,
    };

    const newJoki = new Joki(formattedData);
    const savedJoki = await newJoki.save();

    if (!savedJoki) {
      throw new Error("Failed to save data");
    }

    res.status(201).json(savedJoki);
  } catch (error) {
    console.error("Error saat menyimpan data:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validasi data gagal",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Gagal menyimpan data ke database",
      message: error.message,
    });
  }
});

// Jalankan server (Hanya diperlukan untuk local development, tidak untuk Vercel)
// app.listen(port, () => {
//   console.log(`Server berjalan di port ${port}`);
// });

module.exports = app; // Export app untuk Vercel
