function generateOutput() {
  const idJoki = document.getElementById("idJoki").value;
  const idKlien = document.getElementById("idKlien").value;
  const tanggalTerimaDate = document.getElementById("tanggalTerimaDate").value;
  const tanggalTerimaTime = document.getElementById("tanggalTerimaTime").value;
  const tanggalSelesaiDate =
    document.getElementById("tanggalSelesaiDate").value;
  const tanggalSelesaiTime =
    document.getElementById("tanggalSelesaiTime").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const metode = document.getElementById("metode").value;
  const status = document.getElementById("status").value;
  const linkFile = document.getElementById("linkFile").value;
  const catatan = document.getElementById("catatan").value || "-";

  const tanggalTerima = `${tanggalTerimaDate} ${tanggalTerimaTime}`;
  const tanggalSelesai = `${tanggalSelesaiDate} ${tanggalSelesaiTime}`;

  const output = `--------------------------------------------------
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

  document.getElementById("output").innerText = output;
}

function copyToClipboard() {
  const outputText = document.getElementById("output").innerText;
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
      // Fallback untuk browser yang tidak mendukung Clipboard API
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
