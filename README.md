# Vila Permai

Nama : Ziaurrahman Athaya
NIM : 24011130461
Repository : uts-villa-permai-24011130461

## Tentang proyek

Halaman web pemesanan vila untuk usaha keluarga Pak Hendra di daerah Puncak, Bogor. Selama ini pemesanan lewat WhatsApp dan sering salah paham soal tanggal dan harga. Halaman ini dibuat supaya calon tamu bisa lihat daftar vila, memasukkan tanggal menginap, dan langsung tahu total biayanya tanpa harus tanya dulu.

Tidak ada server maupun database. Semua data vila ada di dalam `script.js` dalam bentuk array, dan pesanan disimpan di localStorage browser.

## Cara menjalankan

1. Download atau clone repository ini.
2. Buka folder `uts-villa-permai-24011130461`.
3. Klik dua kali `index.html` sampai terbuka di browser.

Tidak perlu install apa-apa.

## Struktur file

```
uts-villa-permai-24011130461/
  .gitignore
  index.html
  style.css
  script.js
  README.md
```

## Cara hitung biaya

Total = (harga per malam + biaya tamu tambahan) x jumlah malam.

Tiap vila punya batas tamu dasar. Kalau jumlah tamu lebih dari batas itu, ada biaya tambahan per orang per malam. Sebagai contoh Vila Melati harganya Rp650.000 per malam untuk 4 tamu, lalu tiap tamu tambahan Rp50.000 per malam. Setiap vila maksimal bisa menampung 2 tamu di atas batas dasar.

## Fitur

Sudah selesai:

- [x] Daftar tiga vila yang dirender dari array di JavaScript
- [x] Pencarian vila (nama, lokasi, fasilitas)
- [x] Total biaya muncul otomatis saat tanggal/jumlah tamu berubah
- [x] Validasi form dengan pesan bahasa Indonesia
- [x] Deteksi tanggal bentrok untuk vila yang sama
- [x] Daftar pesanan dan pembatalan pesanan disimpan di localStorage
- [x] Tampilan responsif

Belum selesai / keterbatasan:

- [ ] Pesanan hanya tersimpan di browser masing-masing tamu, jadi bentrok antar perangkat belum bisa terdeteksi
- [ ] Belum ada foto vila
- [ ] Belum ada pembayaran online
- [ ] Nomor WhatsApp dan email di footer masih contoh

## Mengubah data vila

Buka `script.js`, lalu edit array `daftarVila` di bagian paling atas. Harga, fasilitas, dan status ketersediaan (`tersedia: true/false`) bisa diubah dari situ.
