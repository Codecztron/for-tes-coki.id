// public/script.js

// Function to generate output (Tidak ada perubahan di sini)
function generateOutput(e) {
  e.preventDefault();

  const idJoki = document.getElementById("idJoki").value;
  const namaPenjoki = document.getElementById("namaPenjoki").value;
  const idKlien = document.getElementById("idKlien").value;
  const tanggalTerimaDate = document.getElementById("tanggalTerimaDate").value;
  const tanggalTerimaTime = document.getElementById("tanggalTerimaTime").value;
  const tanggalSelesaiDate =
    document.getElementById("tanggalSelesaiDate").value;
  const tanggalSelesaiTime =
    document.getElementById("tanggalSelesaiTime").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const metode = document.getElementById("metode").value;
  const nota = document.getElementById("nota").value.replace(/[^0-9]/g, "");
  const status = document.getElementById("status").value;
  const linkFile = document.getElementById("linkFile").value;
  const catatan = document.getElementById("catatan").value || "-";

  const tanggalTerima = `${tanggalTerimaDate} ${tanggalTerimaTime}`;
  const tanggalSelesai = `${tanggalSelesaiDate} ${tanggalSelesaiTime}`;

  const formattedNota = `Rp ${nota.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

  const outputAdmin = `--------------------------------------------------
  *DATA JOKI CODING - @coding_kilat.id*
  --------------------------------------------------

  *INFORMASI TUGAS*
  -----------------
  ID Joki        : ${idJoki}
  Nama Penjoki   : ${namaPenjoki}
  ID Klien       : ${idKlien}
  Tanggal Terima : ${tanggalTerima}
  Tanggal Selesai: ${tanggalSelesai}
  Deskripsi      : ${deskripsi || "-"}

  *PEMBAYARAN*
  -----------
  Metode         : ${metode || "-"}
  Nota           : ${formattedNota}
  Status         : ${status}

  --------------------------------------------------`;

  const outputCustomer = `--------------------------------------------------
  *PENYELESAIAN JOKI CODING - @coding_kilat.id*
  --------------------------------------------------

  *INFORMASI TUGAS*
  -----------------
  ID Joki        : ${idJoki}
  ID Klien       : ${idKlien}
  Tanggal Terima : ${tanggalTerima}
  Tanggal Selesai: ${tanggalSelesai}
  Deskripsi      : ${deskripsi || "-"}

  *PEMBAYARAN*
  -----------
  Metode         : ${metode || "-"}
  Status         : ${status}

  *SERAH TERIMA*
  -------------
  Link/File      : ${linkFile || "-"}

  *CATATAN*
  -------------------
  ${catatan}

  --------------------------------------------------
  Balas "*Done*" jika penugasan sudah selesai dan diterima.
  *Terima kasih!*
  --------------------------------------------------`;

  document.getElementById("outputAdmin").innerText = outputAdmin;
  document.getElementById("outputCustomer").innerText = outputCustomer;

  document.getElementById("outputAdmin").style.display = "block";
  document.getElementById("outputCustomer").style.display = "block";
}

document.getElementById("formJoki").addEventListener("submit", (e) => {
  e.preventDefault();
  generateOutput(e);
});

function formatRupiah(angka) {
  return `Rp ${angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

async function saveToMongoDB() {
  const formData = {
    idJoki: document.getElementById("idJoki").value,
    namaPenjoki: document.getElementById("namaPenjoki").value,
    idKlien: document.getElementById("idKlien").value,
    tanggalTerima: `${document.getElementById("tanggalTerimaDate").value} ${document.getElementById("tanggalTerimaTime").value}`,
    tanggalSelesai: `${document.getElementById("tanggalSelesaiDate").value} ${document.getElementById("tanggalSelesaiTime").value}`,
    deskripsi: document.getElementById("deskripsi").value || "-",
    metode: document.getElementById("metode").value,
    nota: document.getElementById("nota").value.replace(/[^0-9]/g, ""),
    status: document.getElementById("status").value,
    linkFile: document.getElementById("linkFile").value || "-",
    catatan: document.getElementById("catatan").value || "-",
  };

  try {
    const response = await fetch("/api", {
      // **PENTING:** Gunakan relative URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      throw new Error("Gagal memproses respons dari server");
    }

    if (!response.ok) {
      throw new Error(
        responseData.message || "Gagal menyimpan data ke database",
      );
    }

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data berhasil disimpan ke database",
      timer: 2000,
      showConfirmButton: false,
      background: "#fff",
      customClass: {
        popup: "animated bounceIn",
      },
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message || "Terjadi kesalahan server. Silakan coba lagi.",
      background: "#fff",
      customClass: {
        popup: "animated shake",
      },
    });
    console.error("Error:", error);
  }
}

function copyToClipboard(outputId) {
  const outputText = document.getElementById(outputId).innerText;
  navigator.clipboard
    .writeText(outputText)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Output berhasil disalin ke clipboard",
        timer: 2000,
        showConfirmButton: false,
        background: "#fff",
        customClass: {
          popup: "animated bounceIn",
        },
      });
    })
    .catch((err) => {
      console.error("Gagal menyalin:", err);
      const textarea = document.createElement("textarea");
      textarea.value = outputText;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Output berhasil disalin ke clipboard",
          timer: 2000,
          showConfirmButton: false,
          background: "#fff",
          customClass: {
            popup: "animated bounceIn",
          },
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menyalin output!",
          background: "#fff",
          customClass: {
            popup: "animated shake",
          },
        });
        console.error("Gagal menyalin:", err);
      }
      document.body.removeChild(textarea);
    });
}

// Set default values for date and time inputs
const now = new Date();
const formattedDate = now.toISOString().slice(0, 10);
const formattedTime = now.toTimeString().slice(0, 5);

document.getElementById("tanggalTerimaDate").value = formattedDate;
document.getElementById("tanggalTerimaTime").value = formattedTime;
document.getElementById("tanggalSelesaiDate").value = formattedDate;
document.getElementById("tanggalSelesaiTime").value = formattedTime;
