# Naskah Percakapan Merchant + Draft LOI (Sprint Lapangan)

**Timestamp:** 2026-10-08 23:50 WIB
**Status:** DRAFT. **Draft LOI belum ditinjau konsultan hukum.** Jangan dipakai sebelum dicek.
**Pemakai:** Dandy (COO). Pasangan dari `20261008_2350_template_sprint_sam_som.xlsx` (sheet PERCAKAPAN).
**Tujuan percakapan:** mengumpulkan data (NIB, minat, kesediaan bayar, kesediaan LOI), **bukan** menutup penjualan. Data yang jujur lebih berharga daripada "ya" yang dipaksa.

---

## 1. Batasan yang tidak boleh dilanggar

1. **Jangan mengklaim fitur yang belum jalan.** Per 2026-10-08 seat-lock + DP, payment gateway, dan data merchant nyata belum ada. Ucapkan "sedang dikembangkan", bukan "sudah bisa".
2. **Harga dan bundel selalu disebut "indikatif, belum final"** (disetujui Arif 2026-10-08). Jangan menjanjikan refund, harga final, atau tanggal launch. Jika ditanya "kalau belum cocok bagaimana?", jawab: "belum ada komitmen refund, kebijakan final ditetapkan sebelum paket dijual".
3. **Jangan meminta pembayaran apa pun** pada tahap ini.
4. **Pisahkan sumber kontak.** Catat "Acak sampel" untuk tempat yang diambil acak dari Maps, "Kontak hangat" untuk 10 merchant yang sudah pernah dibicarakan. Persentase hanya dihitung dari "Acak sampel".
5. **Jangan mengarahkan jawaban.** Tanyakan terbuka dulu, baru tawarkan pilihan.
6. Catat jawaban pada hari yang sama. Jika calon menolak dicatat, hormati.

## 2. Alur singkat (±10 menit, WA/telepon/kunjungan)

### A. Pembuka (30 detik)
"Halo Kak, saya Dandy dari Seato. Kami sedang membangun aplikasi untuk membantu orang menemukan kedai kopi yang cocok dan tahu kondisinya sebelum datang. Boleh minta 10 menit untuk bertanya soal usaha Kakak? Ini riset, bukan jualan."

### B. Verifikasi (isi kolom "Lawan bicara")
"Saya bicara dengan pemilik atau pengelola?" (Pemilik/Manajer/Staf). Jika staf, minta dihubungkan atau jadwalkan ulang.

### C. Kondisi saat ini (untuk konteks, tidak dicatat di template)
- "Kalau lagi ramai atau sepi, pelanggan biasanya tahu dari mana?"
- "Apakah pelanggan sering datang lalu tempat penuh? Bagaimana Kakak mengelolanya?"
- "Reservasi sekarang lewat apa? WA, IG, atau tidak ada?"

### D. Konsep Seato (±1 menit, jujur)
"Seato menunjukkan ke calon pelanggan apakah tempat Kakak cocok dengan kebutuhan mereka (misalnya cocok untuk kerja, ada area merokok, outdoor) dan kondisi tempat saat itu, lalu mereka bisa reservasi. Untuk pemilik, dashboard menunjukkan berapa orang melihat, membuka profil, dan reservasi. Aplikasinya masih dalam pengembangan."

Tanya: "Dari skala 1 sampai 5, seberapa berguna ini untuk usaha Kakak?" → kolom **Minat konsep (1-5)**. Tanyakan alasannya, catat singkat.

### E. NIB / legalitas (backlog #3)
Pertanyaan netral, jangan menghakimi:
"Kalau boleh tahu, usaha ini sudah terdaftar resmi, misalnya punya NIB lewat OSS?" → **Ya / Tidak / Sedang proses / Tidak tahu**.
Jika Ya: "Atas nama pribadi atau badan usaha?" (catat di Catatan). Jika Tidak: tanya apa hambatannya, tanpa menyarankan apa pun.
Alasan pertanyaan ini: menentukan apakah merchant bisa menerima DP lewat payment gateway (strategi Merchant Lite vs Full-DP-only, backlog #8). Cukup bilang "untuk memahami kesiapan pemilik usaha".

### F. Paket awal (indikatif)
"Rencana awalnya ada promo peluncuran: bayar 1 bulan, dapat layanan 3 bulan. Harga paket indikatifnya mulai sekitar Rp299 ribu per bulan, dan ada paket lebih lengkap sekitar Rp599 ribu dan Rp799 ribu per bulan. Semua ini belum final."
Tanya: "Tertarik atau tidak dengan skema seperti ini?" → **Ya / Mungkin / Tidak** di kolom **Minat bundel**. Catat keberatan utama.
*(Perbedaan fitur per paket belum ada dokumen finalnya di repo. Jika calon tidak bisa memilih paket karena itu, kosongkan kolom Tier dan fokus ke pertanyaan harga.)*

### G. Harga wajar (dua pertanyaan, jangan sebut angka lebih dulu)
1. "Di harga berapa per bulan layanan seperti ini terasa **terlalu mahal** sehingga Kakak tidak mempertimbangkannya?"
2. "Di harga berapa terasa **murah tapi masih layak dipercaya**?"
Catat angka jawaban kedua di kolom **Harga wajar versi merchant** dan angka pertama di Catatan. Dua titik ini cukup untuk melihat batas bawah dan atas, tanpa mengarahkan.

### H. Surat Minat (LOI)
"Kalau nanti aplikasinya siap, apakah Kakak bersedia kami catat sebagai calon merchant awal? Ini hanya surat minat, tidak mengikat dan tidak ada pembayaran sekarang." → **Ya / Mungkin / Tidak**. Jika Ya, tawarkan LOI (bagian 4) untuk ditandatangani **sebelum kick-off launch** (belum perlu sekarang).
Jika Tidak: tanya satu alasan utama (harga, waktu, tidak percaya, tidak butuh, takut ribet) → kolom **Alasan jika tidak**.

### I. Penutup
"Terima kasih Kak. Kalau ada kabar lanjutan soal Seato, boleh kami hubungi lewat nomor ini?" (catat persetujuan). Jangan menjanjikan tanggal.

## 3. Penanganan keberatan umum (jujur, bukan membujuk)

| Keberatan | Respons |
|---|---|
| "Gratis dulu aja" | "Skema awalnya bayar 1 bulan untuk 3 bulan. Belum ada rencana versi gratis penuh. Boleh tahu kenapa gratis lebih cocok?" (catat alasan) |
| "Aplikasinya sudah ada?" | "Masih dalam pengembangan, makanya kami minta masukan Kakak sekarang." |
| "Data pelanggan saya aman?" | "Pertanyaan bagus. Kebijakan datanya sedang kami susun, saya catat sebagai masukan." (jangan menjawab klaim keamanan yang belum ada) |
| "Sudah punya POS/Instagram" | "Seato bukan POS. Fokusnya membantu orang menemukan dan reservasi, dan memberi pemilik gambaran siapa yang mencari." |
| "Nanti kalau sepi bagaimana" | "Karena itu kami catat dulu sebagai riset. Tidak ada kewajiban apa pun sekarang." |

## 4. Draft Surat Minat (LOI) — NON-BINDING

> **DRAFT. Belum ditinjau konsultan hukum. Nama badan hukum Seato diisi setelah status PT final (lihat problem5 §5 poin 3). Jangan ditandatangani sebelum ditinjau.**

**SURAT MINAT (LETTER OF INTENT)**

Tanggal: ____________

Yang bertanda tangan di bawah ini:
- Nama: ____________________
- Jabatan: ____________________
- Nama usaha: ____________________
- Alamat usaha: ____________________
- Nomor WhatsApp/Telepon: ____________________
- Nomor NIB (jika ada): ____________________

menyatakan **minat awal** untuk bergabung sebagai merchant pada aplikasi **Seato** yang dikelola oleh [NAMA BADAN HUKUM], dengan keterangan sebagai berikut:

1. **Sifat surat.** Surat ini adalah pernyataan minat dan **tidak mengikat** salah satu pihak. Tidak ada kewajiban membayar, tidak ada kewajiban bergabung, dan masing-masing pihak dapat mengundurkan diri kapan saja tanpa konsekuensi.
2. **Penawaran indikatif.** Seato berencana menawarkan promo peluncuran "bayar 1 bulan, layanan 3 bulan" dengan harga paket yang masih indikatif. Harga, cakupan layanan, dan syarat final akan diberitahukan tersendiri sebelum penawaran dibuka dan dapat berbeda dari informasi lisan.
3. **Tanpa jaminan.** Seato tidak menjamin tanggal peluncuran, ketersediaan fitur tertentu, maupun hasil bisnis bagi merchant.
4. **Data kontak.** Data pada surat ini hanya dipakai Seato untuk menghubungi pihak yang bersangkutan terkait peluncuran dan dapat diminta untuk dihapus kapan saja.

Pihak merchant,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pihak Seato,

(____________________)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(____________________)

### Pertanyaan untuk konsultan hukum (dikirim bersama draft)
1. Apakah format surat minat non-binding ini cukup jelas tidak mengikat, dan apakah perlu materai atau saksi?
2. Bagaimana pengaturan pengumpulan dan penyimpanan data kontak merchant (persetujuan, penghapusan) sesuai ketentuan pelindungan data pribadi yang berlaku?
3. Apakah menyebut harga indikatif di LOI menimbulkan komitmen harga?
4. Apakah LOI boleh dicantumkan sebagai traction di materi investor, dan dengan kalimat seperti apa?

## 5. Catatan penggunaan data

- LOI belum akan ditandatangani sebelum kick-off launch, jadi di deck tulis **"10 merchant dalam pembicaraan awal"**, bukan "komitmen".
- 10 merchant hangat dicatat dengan Sumber = "Kontak hangat". Mereka tidak dihitung dalam close rate dingin karena kemungkinan bias (teman, jejaring).
- Hasil percakapan dilihat di sheet HASIL_FUNNEL. Rentang kepercayaan lebar untuk n kecil (<20). Jangan dikutip sebagai angka tunggal di deck.
