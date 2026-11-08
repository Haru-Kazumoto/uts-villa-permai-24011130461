const daftarVila = [
  {
    id: 1,
    nama: "Vila Melati",
    tipe: "2 kamar tidur",
    lokasi: "Cisarua, Puncak",
    harga: 650000,
    tamuDasar: 4,
    biayaTamuTambahan: 50000,
    fasilitas: ["Wi-Fi", "Dapur", "Parkir 2 mobil", "Air panas"],
    tersedia: true
  },
  {
    id: 2,
    nama: "Vila Anggrek",
    tipe: "3 kamar tidur",
    lokasi: "Megamendung, Puncak",
    harga: 1100000,
    tamuDasar: 6,
    biayaTamuTambahan: 50000,
    fasilitas: ["Wi-Fi", "Dapur", "Kolam renang", "Area barbeque", "Air panas"],
    tersedia: true
  },
  {
    id: 3,
    nama: "Vila Kenanga",
    tipe: "4 kamar tidur",
    lokasi: "Cisarua, Puncak",
    harga: 1500000,
    tamuDasar: 8,
    biayaTamuTambahan: 75000,
    fasilitas: ["Wi-Fi", "Dapur lengkap", "Kolam renang", "Karaoke", "Parkir 4 mobil"],
    tersedia: true
  }
];

const KUNCI_PESANAN = "vilaPermai.pesanan";
const KUNCI_NAMA = "vilaPermai.namaTerakhir";

const elForm = document.getElementById("form-pesan");
const elDaftarVila = document.getElementById("villa-list");
const elVilaKosong = document.getElementById("villa-kosong");
const elCari = document.getElementById("input-cari");
const elPilihan = document.getElementById("pilihan-vila");
const elNama = document.getElementById("nama");
const elCheckin = document.getElementById("checkin");
const elCheckout = document.getElementById("checkout");
const elTamu = document.getElementById("tamu");
const elHasil = document.getElementById("hasil-isi");
const elDaftarPesanan = document.getElementById("daftar-pesanan");
const tombolCek = document.getElementById("tombol-cek");

const formatUang = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});


function rupiah(angka) {
  return formatUang.format(angka);
}

function hariIni() {
  const d = new Date();
  const bulan = String(d.getMonth() + 1).padStart(2, "0");
  const tgl = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + bulan + "-" + tgl;
}

function formatTanggal(str) {
  const [th, bl, tg] = str.split("-").map(Number);
  return new Date(th, bl - 1, tg).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function hitungMalam(masuk, keluar) {
  const a = Date.parse(masuk + "T00:00:00Z");
  const b = Date.parse(keluar + "T00:00:00Z");
  return Math.round((b - a) / 86400000);
}

function cariVila(id) {
  return daftarVila.find(function(v) {
    return v.id === Number(id);
  });
}

function ambilPesanan() {
  try {
    const mentah = localStorage.getItem(KUNCI_PESANAN);
    if (!mentah) return [];
    const data = JSON.parse(mentah);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("Data pesanan tidak bisa dibaca:", err);
    return [];
  }
}

function simpanPesanan(daftar) {
  try {
    localStorage.setItem(KUNCI_PESANAN, JSON.stringify(daftar));
    return true;
  } catch (err) {
    console.warn("Gagal menyimpan pesanan:", err);
    return false;
  }
}

function simpanNama(nama) {
  try {
    localStorage.setItem(KUNCI_NAMA, nama);
  } catch (err) { }
}

function muatNama() {
  try {
    return localStorage.getItem(KUNCI_NAMA) || "";
  } catch (err) {
    return "";
  }
}

function buatKartuVila(vila) {
  const kartu = document.createElement("article");
  kartu.className = "villa-card";

  const nama = document.createElement("h3");
  nama.className = "villa-card__nama";
  nama.textContent = vila.nama;
  kartu.appendChild(nama);

  const tipe = document.createElement("p");
  tipe.className = "villa-card__info";
  tipe.textContent = vila.tipe + " | muat sampai " + (vila.tamuDasar + 2) + " tamu";
  kartu.appendChild(tipe);

  const lokasi = document.createElement("p");
  lokasi.className = "villa-card__info";
  lokasi.textContent = "Lokasi: " + vila.lokasi;
  kartu.appendChild(lokasi);

  const harga = document.createElement("p");
  harga.className = "villa-card__price";
  harga.textContent = rupiah(vila.harga) + " ";
  const kecil = document.createElement("small");
  kecil.textContent = "/ malam";
  harga.appendChild(kecil);
  kartu.appendChild(harga);

  const ul = document.createElement("ul");
  ul.className = "villa-card__fasilitas";
  vila.fasilitas.forEach(function(f) {
    const li = document.createElement("li");
    li.textContent = f;
    ul.appendChild(li);
  });
  kartu.appendChild(ul);

  const status = document.createElement("p");
  status.className = "villa-card__status";
  if (vila.tersedia) {
    status.className += " villa-card__status--ada";
    status.textContent = "Tersedia";
  } else {
    status.className += " villa-card__status--habis";
    status.textContent = "Sedang tidak tersedia";
  }
  kartu.appendChild(status);

  const tombol = document.createElement("button");
  tombol.type = "button";
  tombol.className = "tombol tombol--garis villa-card__tombol";
  tombol.textContent = "Pilih Vila Ini";
  tombol.disabled = !vila.tersedia;
  tombol.addEventListener("click", function() {
    elPilihan.value = vila.id;
    document.getElementById("pemesanan").scrollIntoView({ behavior: "smooth" });
    perbaruiRingkasan();
  });
  kartu.appendChild(tombol);

  return kartu;
}

function tampilkanVila(kataKunci) {
  const kunci = (kataKunci || "").trim().toLowerCase();
  elDaftarVila.innerHTML = "";
  let jumlah = 0;

  daftarVila.forEach(function(vila) {
    const gudang = (vila.nama + " " + vila.lokasi + " " + vila.tipe + " " + vila.fasilitas.join(" ")).toLowerCase();
    if (kunci === "" || gudang.indexOf(kunci) !== -1) {
      elDaftarVila.appendChild(buatKartuVila(vila));
      jumlah++;
    }
  });

  elVilaKosong.hidden = jumlah !== 0;
}

function isiPilihanVila() {
  const awal = document.createElement("option");
  awal.value = "";
  awal.textContent = "-- Pilih vila --";
  elPilihan.appendChild(awal);

  daftarVila.forEach(function(vila) {
    const opsi = document.createElement("option");
    opsi.value = vila.id;
    opsi.textContent = vila.nama + " (" + rupiah(vila.harga) + " / malam)";
    if (!vila.tersedia) {
      opsi.disabled = true;
      opsi.textContent += " - tidak tersedia";
    }
    elPilihan.appendChild(opsi);
  });
}

function hitungTotalHarga(vila, malam, tamu) {
  const kelebihan = Math.max(0, tamu - vila.tamuDasar);
  const tambahanPerMalam = kelebihan * vila.biayaTamuTambahan;
  const sewa = vila.harga * malam;
  const tambahan = tambahanPerMalam * malam;
  return {
    kelebihan: kelebihan,
    sewa: sewa,
    tambahan: tambahan,
    total: sewa + tambahan
  };
}

function setError(nama, pesan) {
  const el = document.querySelector('[data-error="' + nama + '"]');
  if (el) el.textContent = pesan;
  const input = elForm.elements[nama];
  if (input) input.classList.toggle("form__input--salah", pesan !== "");
}

function bersihkanError() {
  ["nama", "vila", "checkin", "checkout", "tamu"].forEach(function(n) {
    setError(n, "");
  });
}

function validasiForm(tampilError) {
  const nama = elNama.value.trim();
  const idVila = elPilihan.value;
  const masuk = elCheckin.value;
  const keluar = elCheckout.value;
  const tamu = parseInt(elTamu.value, 10);
  const galat = {};

  if (nama === "") {
    galat.nama = "Nama tamu wajib diisi.";
  }

  if (idVila === "") {
    galat.vila = "Silakan pilih salah satu unit vila.";
  } else {
    const v = cariVila(idVila);
    if (!v || !v.tersedia) galat.vila = "Vila yang dipilih sedang tidak tersedia.";
  }

  if (masuk === "") {
    galat.checkin = "Tanggal check-in belum diisi.";
  } else if (masuk < hariIni()) {
    galat.checkin = "Tanggal check-in tidak boleh sebelum hari ini.";
  }

  if (keluar === "") {
    galat.checkout = "Tanggal check-out belum diisi.";
  } else if (keluar < hariIni()) {
    galat.checkout = "Tanggal check-out tidak boleh sebelum hari ini.";
  } else if (masuk !== "" && keluar <= masuk) {
    galat.checkout = "Tanggal check-out harus setelah tanggal check-in.";
  }

  if (isNaN(tamu)) {
    galat.tamu = "Jumlah tamu belum diisi.";
  } else if (tamu < 1 || tamu > 10) {
    galat.tamu = "Jumlah tamu harus antara 1 sampai 10 orang.";
  } else if (idVila !== "") {
    const v = cariVila(idVila);
    if (v && tamu > v.tamuDasar + 2) {
      galat.tamu = v.nama + " hanya muat sampai " + (v.tamuDasar + 2) + " tamu.";
    }
  }

  if (tampilError) {
    bersihkanError();
    Object.keys(galat).forEach(function(k) {
      setError(k, galat[k]);
    });
  }

  return {
    valid: Object.keys(galat).length === 0,
    galat: galat,
    data: { nama: nama, idVila: idVila, masuk: masuk, keluar: keluar, tamu: tamu }
  };
}

function adaBentrok(idVila, masuk, keluar) {
  return ambilPesanan().some(function(p) {
    return p.idVila === Number(idVila) && masuk < p.keluar && keluar > p.masuk;
  });
}

function buatBaris(label, nilai, kelasBaris) {
  const tr = document.createElement("tr");
  if (kelasBaris) tr.className = kelasBaris;
  const td1 = document.createElement("td");
  td1.textContent = label;
  const td2 = document.createElement("td");
  td2.textContent = nilai;
  tr.appendChild(td1);
  tr.appendChild(td2);
  return tr;
}

function tampilkanRingkasan(vila, d, pesanStatus) {
  const malam = hitungMalam(d.masuk, d.keluar);
  const biaya = hitungTotalHarga(vila, malam, d.tamu);

  elHasil.innerHTML = "";
  const tabel = document.createElement("table");
  tabel.className = "hasil__tabel";
  const badan = document.createElement("tbody");

  badan.appendChild(buatBaris("Vila", vila.nama));
  badan.appendChild(buatBaris("Check-in", formatTanggal(d.masuk)));
  badan.appendChild(buatBaris("Check-out", formatTanggal(d.keluar)));
  badan.appendChild(buatBaris("Lama menginap", malam + " malam"));
  badan.appendChild(buatBaris(rupiah(vila.harga) + " x " + malam + " malam", rupiah(biaya.sewa)));
  if (biaya.kelebihan > 0) {
    badan.appendChild(buatBaris(
      "Tamu tambahan (" + biaya.kelebihan + " orang)",
      rupiah(biaya.tambahan)
    ));
  }
  badan.appendChild(buatBaris("Total", rupiah(biaya.total), "hasil__total"));

  tabel.appendChild(badan);
  elHasil.appendChild(tabel);

  if (pesanStatus) {
    const p = document.createElement("p");
    p.className = "hasil__pesan hasil__pesan--" + pesanStatus.jenis;
    p.textContent = pesanStatus.teks;
    elHasil.appendChild(p);
  }
}

function tampilkanPesanKosong(teks) {
  elHasil.innerHTML = "";
  const p = document.createElement("p");
  p.className = "hasil__kosong";
  p.textContent = teks;
  elHasil.appendChild(p);
}

function perbaruiRingkasan() {
  const cek = validasiForm(false);
  const g = cek.galat;
  const d = cek.data;

  if (g.vila || g.checkin || g.checkout || g.tamu) {
    tampilkanPesanKosong("Pilih vila, tanggal, dan jumlah tamu yang benar untuk melihat total biaya.");
    return;
  }
  tampilkanRingkasan(cariVila(d.idVila), d);
}

function tampilkanPesanan() {
  const daftar = ambilPesanan();
  elDaftarPesanan.innerHTML = "";

  if (daftar.length === 0) {
    const kosong = document.createElement("p");
    kosong.className = "pesanan-kosong";
    kosong.textContent = "Belum ada pesanan.";
    elDaftarPesanan.appendChild(kosong);
    return;
  }

  daftar.forEach(function(p, i) {
    const baris = document.createElement("div");
    baris.className = "pesanan";

    const teks = document.createElement("div");
    const judul = document.createElement("p");
    judul.className = "pesanan__nama";
    judul.textContent = p.namaVila + " - atas nama " + p.nama;
    const detail = document.createElement("p");
    detail.className = "pesanan__detail";
    detail.textContent = formatTanggal(p.masuk) + " sampai " + formatTanggal(p.keluar) +
      " | " + p.tamu + " tamu | " + rupiah(p.total);
    teks.appendChild(judul);
    teks.appendChild(detail);

    const hapus = document.createElement("button");
    hapus.type = "button";
    hapus.className = "tombol tombol--hapus";
    hapus.textContent = "Batalkan";
    hapus.addEventListener("click", function() {
      if (!confirm("Batalkan pesanan ini?")) return;
      const sisa = ambilPesanan();
      sisa.splice(i, 1);
      simpanPesanan(sisa);
      tampilkanPesanan();
    });

    baris.appendChild(teks);
    baris.appendChild(hapus);
    elDaftarPesanan.appendChild(baris);
  });
}

function cekKetersediaan() {
  const cek = validasiForm(true);
  if (!cek.valid) {
    tampilkanPesanKosong("Masih ada data yang belum benar. Silakan periksa kolom yang ditandai merah.");
    return;
  }
  const d = cek.data;
  const vila = cariVila(d.idVila);

  if (adaBentrok(d.idVila, d.masuk, d.keluar)) {
    tampilkanRingkasan(vila, d, {
      jenis: "gagal",
      teks: "Maaf, tanggal tersebut sudah terisi pesanan lain. Coba tanggal atau vila yang berbeda."
    });
  } else {
    tampilkanRingkasan(vila, d, {
      jenis: "ok",
      teks: "Vila tersedia pada tanggal tersebut. Silakan tekan Pesan Sekarang."
    });
  }
}

function kirimPesanan(e) {
  e.preventDefault();
  const cek = validasiForm(true);
  if (!cek.valid) {
    tampilkanPesanKosong("Pesanan belum bisa dikirim. Silakan perbaiki kolom yang ditandai merah.");
    return;
  }

  const d = cek.data;
  const vila = cariVila(d.idVila);

  if (adaBentrok(d.idVila, d.masuk, d.keluar)) {
    tampilkanRingkasan(vila, d, {
      jenis: "gagal",
      teks: "Maaf, tanggal tersebut sudah terisi pesanan lain. Pesanan tidak dikirim."
    });
    return;
  }

  const biaya = hitungTotalHarga(vila, hitungMalam(d.masuk, d.keluar), d.tamu);
  const daftar = ambilPesanan();
  daftar.push({
    idVila: vila.id,
    namaVila: vila.nama,
    nama: d.nama,
    masuk: d.masuk,
    keluar: d.keluar,
    tamu: d.tamu,
    total: biaya.total
  });

  if (!simpanPesanan(daftar)) {
    tampilkanRingkasan(vila, d, {
      jenis: "gagal",
      teks: "Pesanan gagal disimpan di browser ini. Coba lagi, atau hubungi pemilik lewat WhatsApp."
    });
    return;
  }

  simpanNama(d.nama);
  tampilkanRingkasan(vila, d, {
    jenis: "ok",
    teks: "Pesanan berhasil dibuat. Terima kasih, " + d.nama + "! Kami akan menghubungi Anda untuk konfirmasi."
  });
  tampilkanPesanan();

  elCheckin.value = "";
  elCheckout.value = "";
  elPilihan.value = "";
  elTamu.value = 2;
  bersihkanError();
}

function startInit() {
  if (!Array.isArray(daftarVila) || daftarVila.length === 0) {
    elDaftarVila.textContent = "Data vila tidak dapat dimuat. Silakan muat ulang halaman.";
    return;
  }

  isiPilihanVila();
  tampilkanVila("");
  tampilkanPesanan();

  elNama.value = muatNama();
  elCheckin.min = hariIni();
  elCheckout.min = hariIni();

  elCari.addEventListener("input", function() {
    tampilkanVila(elCari.value);
  });

  [elPilihan, elCheckin, elCheckout, elTamu].forEach(function(el) {
    el.addEventListener("change", perbaruiRingkasan);
  });
  elTamu.addEventListener("input", perbaruiRingkasan);

  tombolCek.addEventListener("click", cekKetersediaan);
  elForm.addEventListener("submit", kirimPesanan);
}

startInit();
