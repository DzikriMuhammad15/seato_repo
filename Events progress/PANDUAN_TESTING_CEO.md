# Panduan Lengkap Testing & Alur Kerja: Community Events (Untuk CEO)

Dokumen ini disusun untuk memandu **CEO SEATO** melakukan uji coba langsung (*hands-on testing*) fitur **Community Events** secara end-to-end, mencakup 3 aplikasi yang saling terhubung:
1. **Customer App (Mobile)** (`seato-mockup`)
2. **Merchant Portal (Seato Business)** (`seato-mockup/admin`)
3. **Seato Admin (Superadmin Ops)** (`seato-admin`)

---

## 🖼️ Visual Alur & Diagram Kerja

Diagram alur lengkap telah disalin ke folder ini:
- **Infografis Alur Lengkap 5 Fase**: [`detailed_complete_flowchart_guide_1791190018650.jpg`](./detailed_complete_flowchart_guide_1791190018650.jpg)
- **Executive 3-Panel Guide**: [`seato_community_events_guide_1791189848842.jpg`](./seato_community_events_guide_1791189848842.jpg)
- **Presentasi Alur Interaktif HD**: Buka file [`detailed_flow_presentation.html`](./detailed_flow_presentation.html) di browser Chrome / Edge.

---

## 🔑 Kredensial Akun Testing Resmi (Dari Database)

Berikut akun yang sudah tersedia di database Supabase untuk pengujian:

### 1. Akun Pengguna / Komunitas (Customer App)
| Nama Akun | Email Login | Password | Peran di Komunitas |
|---|---|---|---|
| **Bagus Aji** | `bagus@example.com` | `password123` | **PIC Resmi** dari *Jakarta Morning Runners* (Verified) |
| **Dandy** | `dandy@example.com` | `password123` | **PIC Resmi** dari *Senayan Cycling Club* (Verified) |
| **Sarah Rahman** | `sarah@example.com` | `password123` | **PIC** dari *Bandung Padel Society* (Status: Pending Review) |
| **Arif** | `arif@example.com` | `password123` | **Member Biasa** (Untuk test Join/RSVP) |
| **Giffard** | `giffard@example.com` | `password123` | **Member Biasa** (Untuk test Join/RSVP) |

### 2. Akun Mitra Restoran (Seato Business / Merchant Portal)
| Nama Restoran | Email Login Resto | Password | Catatan Venue |
|---|---|---|---|
| **Kemang Coffee Space** | `admin@kemangcoffee.com` | `password123` | Venue utama event Jakarta |
| **Union Coffee Dago** | `admin@uniondago.com` | `password123` | Venue mitra Bandung |
| **Soto Kudus Menara** | `admin@sotomenara.com` | `password123` | Venue resto mitra |

### 3. Akun Superadmin Ops (`seato-admin`)
- URL Portal: `http://localhost:5173` (atau port Vite aktif)
- Mode Superadmin: Akses langsung tanpa login pembatas untuk kurasi komunitas & event se-platform.

---

## 🚀 Skenario Uji Coba Langkah demi Langkah (End-to-End)

CEO dapat menguji 5 skenario berurutan ini:

### Skenario 1: Kurasi Komunitas Baru (Seato Admin)
1. Buka portal **Seato Admin** di menu `Communities`.
2. Perhatikan komunitas **"Bandung Padel Society"** yang berstatus <span style="color:orange">Pending Review</span> (PIC: Sarah Rahman).
3. Klik tombol hijau **Verify** &rarr; Masukkan catatan ops: *"Komunitas valid & terverifikasi"* &rarr; Simpan.
4. **Hasil**: Status berubah menjadi **Verified**. Sekarang Sarah Rahman sudah memiliki hak untuk mengajukan event di cafe mitra.

---

### Skenario 2: PIC Mengajukan Event ke Cafe (Customer App)
1. Buka **Customer App** (Mobile View).
2. Login / gunakan akun **Bagus Aji** (`bagus@example.com`).
3. Masuk ke tab **Komunitas** di bawah &rarr; Pilih tab **Events**.
4. Karena Bagus Aji adalah PIC resmi *Jakarta Morning Runners* (Verified), tombol **+ Ajukan Event** akan tampil di header kanan atas.
5. Klik **+ Ajukan Event**:
   - Pilih Venue: **Kemang Coffee Space**
   - Format: **Santai (Min H-3)** (perhatikan datepicker otomatis memblokir tanggal yang terlalu dekat)
   - Judul: *"Sunday Morning Run & Cold Brew"*
   - Tanggal & Jam: Pilih tanggal (misal: H+4) & jam `06:30 - 08:30`
   - Kuota: `25` Orang
   - Centang Kebutuhan: *Diskon Grup*, *Free Refreshment*, *Reserve Area Khusus*
   - Catatan: *"Butuh meja panjang outdoor depan"*
6. Klik **Kirim Permintaan Event**.
7. **Hasil**: Permintaan tersimpan dengan status **PENDING**.

---

### Skenario 3: Restoran Mereview & Menyetujui + Balas 1x (Merchant Portal)
1. Buka **Merchant Portal** di `http://localhost:3000/admin`.
2. Pastikan venue yang dipilih adalah **Kemang Coffee Space** (atau set `localStorage.partnerRestoId = b14c1eb1-0262-4ede-a20d-44887a4c6a69`).
3. Klik menu **Komunitas & Event** di sidebar kiri.
4. Perhatikan badge angka ajuan masuk di tab **Ajuan Masuk**:
   - Kartu event dari Bagus Aji (*Jakarta Morning Runners*) akan tampil lengkap dengan checklist permintaan.
5. Klik tombol hijau **Setujui**:
   - Ketik balasan 1x (maksimal 140 karakter):  
     *"Siap kami siapkan 3 meja panjang outdoor depan dan complimentary refill es teh!"*
   - Klik **Konfirmasi Setujui**.
6. **Hasil**: Event pindah ke tab **Event Disetujui** dan otomatis terpublikasikan secara publik ke aplikasi customer!

---

### Skenario 4: Member Melihat Momentum Bar & RSVP (Customer App)
1. Ganti user di Customer App ke member biasa, misalnya **Arif** (`arif@example.com`).
2. Masuk ke tab **Komunitas** &rarr; tab **Events**.
3. Event yang baru saja disetujui Kemang Coffee Space akan muncul:
   - Tampil logo komunitas *Jakarta Morning Runners* dengan centang Verified.
   - **Bubble Hijau**: Balasan resmi resto *"Siap kami siapkan 3 meja..."* tampil jelas.
   - **Momentum Bar**: Menampilkan `1/25 Slot` (karena Bagus Aji sebagai PIC otomatis RSVP pertama).
4. Klik tombol **+ Gabung Run & Chill**:
   - Kuota bertambah seketika menjadi `2/25 Slot`.
   - Tombol berubah menjadi **✓ Terdaftar (Batal Ikut)**.
5. Coba klik **Batal Ikut** &rarr; Kuota kembali berkurang menjadi `1/25 Slot`. (Fitur anti-bloat & anti race condition).

---

### Skenario 5: Pengawasan & Intervensi Superadmin Ops (`seato-admin`)
1. Buka menu **Community Events** di `seato-admin`.
2. Seluruh event lintas kota akan terpantau dalam satu tabel komprehensif.
3. Superadmin dapat:
   - Menekan tombol **Flag (Bendera)** jika ada event mencurigakan.
   - Menekan tombol **Cancel** untuk membatalkan paksa jika ada sengketa mendadak antara komunitas dan cafe.

---

## ⏱️ Otomasi Sistem (Cron Jobs)
1. **Auto-Expire (SLA 48 Jam / H-2)**:
   - Jika cafe tidak merespons ajuan dalam 48 jam atau sudah H-2 sebelum acara, sistem otomatis mengubah status menjadi `EXPIRED`.
2. **Lifecycle Acara**:
   - Saat jam mulai tiba &rarr; Status otomatis berubah menjadi **● SEDANG LIVE**.
   - Saat jam selesai lewat &rarr; Status otomatis berubah menjadi **COMPLETED**.
