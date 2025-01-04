// api/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Middleware

// 1. Rate Limiting (untuk mencegah brute-force dan DDoS attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Batasi 100 request per IP per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Terlalu banyak request dari IP ini, coba lagi nanti.",
});
app.use(limiter);

// 2. CORS (untuk mengizinkan request dari frontend)
// **PENTING:** Ubah origin ke URL frontend Anda setelah development selesai
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Ambil dari .env (gunakan URL frontend Vercel Anda untuk produksi)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
);

// 3. Body Parser (untuk parsing request body JSON)
app.use(express.json({ limit: "10mb" }));

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Timeout koneksi 30 detik
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
      return res.status(400).json({
        error: "Request body kosong",
        message: "Data tidak ditemukan dalam request",
      });
    }

    // Validate required fields
    const requiredFields = [
      "idJoki",
      "namaPenjoki",
      "idKlien",
      "tanggalTerima",
      "tanggalSelesai",
      "metode",
      "nota",
      "status",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: "Data tidak lengkap",
          message: `Field ${field} harus diisi`,
        });
      }
    }

    // Format data (pastikan format tanggal dan nota benar)
    const formattedData = {
      ...req.body,
      deskripsi: req.body.deskripsi || "-",
      linkFile: req.body.linkFile || "-",
      catatan: req.body.catatan || "-",
      nota: req.body.nota.toString().replace(/[^0-9]/g, ""), // Simpan nota sebagai angka saja
      tanggalTerima: `${req.body.tanggalTerima}`, // Pastikan format tanggal sesuai dengan schema
      tanggalSelesai: `${req.body.tanggalSelesai}`, // Pastikan format tanggal sesuai dengan schema
    };

    const newJoki = new Joki(formattedData);
    const savedJoki = await newJoki.save();

    if (!savedJoki) {
      return res.status(500).json({
        error: "Gagal menyimpan data",
        message: "Data tidak berhasil disimpan ke database",
      });
    }

    res.status(201).json(savedJoki);
  } catch (error) {
    console.error("Error saat menyimpan data:", error); // Log error untuk debugging

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validasi data gagal",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Gagal menyimpan data ke database",
      message: error.message || "Terjadi kesalahan internal server",
    });
  }
});

module.exports = app;
