# Problem 2 — Scope Fitur V1: Apa yang Realistis Dijalankan di Customer, Merchant, dan AI

**Timestamp:** 2026-09-30 03:23 WIB
**Status:** Disepakati (approved) — dasar acuan scope fitur V1, dengan catatan update di Bagian G

**Visual:** `20260930_0323_problem2_scope_fitur_v1_customer_merchant_ai_visual.png`

---

## Konteks

Pertanyaan awal: dari semua hal di business definition Seato (`.claude/CLAUDE.md`) dan yang sudah ter-mockup di `project_mockup`, apa saja yang realistis dijalankan di **V1 saat aplikasi launching**? Jawaban ini disusun berdasarkan audit langsung ke schema (`prisma/schema.prisma`), kode AI pipeline (`src/server/ai/pipeline.js`, `scraper.js`), dan dokumen `problem1` yang sudah disepakati sebelumnya — bukan asumsi.

## A. Wajib Ada — Customer Side

| Fitur | Alasan konkret |
|---|---|
| Discovery + taxonomy filter (WFC, Smoking Indoor, Outdoor, dst) | Sudah ada `tags` di `Restaurant` model, sudah ada `ExploreScreen`/`CategoryDetailScreen`. Ini core value prop, bukan opsional. Syarat: taxonomy harus fixed list dikurasi tim Seato saat onboarding merchant, bukan tag bebas — sesuai poin 6 business def sendiri. |
| Nearby discovery | `latitude`/`longitude` sudah ada di `User` dan `Restaurant`. Teknis sudah siap, tinggal query radius. |
| Real-time occupancy | V1 = input manual staff, plus bonus: porsi `seatoOccupied` vs `seatoAllocated` sekarang otomatis akurat karena dihitung dari reservasi asli (hasil keputusan seat-lock), jadi nggak 100% manual lagi — lebih baik dari yang didefinisikan di business def poin 9. |
| Reservation (seat-lock + DP) | Sudah punya solusi teknis disetujui lengkap (atomic lock, dua timer, DP via QRIS Midtrans/Xendit split settlement, dispute resolution — lihat `problem1`). Value prop utama Seato ("availability nyata, bukan directory") — kalau ini nggak masuk V1, Seato nggak beda dari Google Maps. |
| Rating & Review | Sudah full built (`Review` model, `ReviewModal`), zero dependency berat. |
| Favorite & History | Sudah built (`UserFavorite`), zero dependency berat. |
| Newcomers section | Murah: filter `createdAt < 3 bulan`. Nggak butuh data behavior sama sekali. Penting buat cold-start supply side — merchant baru yang belum punya reservasi/review tetap dapat exposure. |

### Yang harus disederhanakan, bukan dihilangkan

- **Waitlist**: belum ada di schema sama sekali (nggak ada model Waitlist). Rekomendasi V1: kalau area penuh, tampilkan slot alternatif terdekat (bukan waitlist real-time) — cukup untuk mengurangi drop-off, nggak butuh infra baru.
- **Top Charts / ranking**: business def sendiri bilang "formula final ranking belum kita tetapkan" dan warning keras jangan asal sebut "terbaik" cuma dari views. Rekomendasi awal: jangan tampilkan `isTrending`/`isRecommended` manual/hardcode sebagai "Top Places" — itu klaim data yang nggak bisa dipertanggungjawabkan. **(Lihat Bagian G — sudah diperjelas jadi model dual-track.)**

## B. Wajib Ada — Merchant / B2B Side

| Fitur | Alasan konkret |
|---|---|
| Total Views | Ada `MerchantVisitorLog`, tapi cap anti-buzzer 20 views/user **belum ada di kode manapun**. Wajib dibangun sebelum launch — kalau angka Total Views bisa digoreng, kredibilitas dashboard B2B runtuh di percobaan pertama merchant. |
| Profile Visits, Reservations, Average Rating | Sumber data riil sudah ada (`MerchantVisitorLog`, `Reservation`, `Review`), tinggal agregasi. |
| Traffic History (pola hari/jam) | Derivable dari timestamp log yang sudah ada, nggak butuh dependency eksternal. |
| Top Keywords/Categories per merchant | Sudah ada fallback heuristic-nya di `pipeline.js` (`keywordsCount` dari `visitorLogs`). Murah, langsung actionable. |
| Conversion Funnel (Views→Profile→Reservation) | Bisa jalan hari 1, tapi kasih minimum sample threshold sebelum funnel % ditampilkan — merchant dengan 3 views jangan ditampilin "conversion 33%" yang menyesatkan. |

### Yang harus ditunda, dengan alasan konkret

- **Demand Heatmap** — butuh volume traffic besar lintas merchant/kategori/waktu supaya nggak jadi peta kosong/noise di hari 1.
- **Market Benchmark (median kategori)** — kalau N merchant per kategori+kota kecil, selain nggak valid statistik, juga masalah privasi (merchant bisa nebak angka kompetitor spesifik). Wajib di-gate minimum N merchant per segmen, auto-hide di bawah threshold.
- **Customer Understanding demografis** — schema `User` nggak punya field demografis apapun. Business def melarang klaim umur kalau data belum dikumpulkan. Mulai collect field opsional saat onboarding dari sekarang, tapi jangan expose insight-nya di V1.
- **Lost Potential Customer** — business def sendiri sudah bilang "definition under validation." Nggak masuk V1.
- **Repeat Customer** — teknis murah dihitung, tapi definisi "repeat" belum dikunci. Perlu difinalisasi sebelum launch.

## C. AI (Phase 1)

Kode AI pipeline sudah nyata (call ke LLM + heuristic fallback kalau API key belum ada) — realistis dibangun. Scope V1:

- **Masuk V1**: Interpretation (WHO/WHAT dari data yang Seato benar-benar punya: views, keyword, funnel, occupancy) + Strategy suggestion sederhana format Opportunity→Who→What→Why→Strategy→Action→KPI (poin 32 business def).
- Action items ke luar Seato (saran konten IG/TikTok, optimasi Google Business Profile) — boleh muncul sebagai saran teks generik, **tapi jangan dijadikan KPI terukur** — Seato nggak punya cara verifikasi efeknya.
- **Tidak masuk V1**: seluruh framework poin 30 (STP, SWOT, TOWS, Porter, Ansoff, Balanced Scorecard) sebagai fitur yang di-expose ke owner — itu mental model internal prompt AI, bukan UI.
- **Market/competitor scraper — tidak dibangun di V1.** `scraper.js` saat ini 100% mock/stub. Scraping Google Maps/IG/TikTok melanggar ToS, berisiko legal/ops tinggi. Kalau butuh benchmark, pakai data first-party Seato sendiri (dengan gating N minimum di atas).

## D. Revenue Model V1

Business def sendiri bilang harga subscription "masih dalam tahap penentuan," CPM sponsored placement "masih dalam research," reservation fee "belum ada fee untuk tahap awal." Rekomendasi awal: V1 launch tanpa monetisasi aktif (free/beta tier) — mencoba charge sebelum ada bukti retensi & value loop bakal jadi friksi adopsi duluan sebelum ada data buat nentuin harga yang bener. **(Lihat Bagian G — sudah diperjelas jadi 2 bulan gratis rolling per-merchant.)**

## E. Poin Kritis — Gamification & Social Feed (Stream/Leaderboard/Badges/XP)

Di kode mockup ada scope besar yang sama sekali nggak disebut di business definition manapun: `XPLog`, `Badge`, `UserBadge`, level/leveling di `User`, `LeaderboardScreen`, dan `Stream` (feed sosial dengan post/review/promo + reply + likes).

Kekhawatiran yang diangkat saat itu:
- Nggak ada di 40 poin business definition — perlu diklarifikasi apakah keputusan strategis atau scope creep.
- Leaderboard/feed sosial butuh critical mass buat nggak keliatan mati di hari 1.
- Stream butuh moderasi konten (spam, review palsu, abuse) — beban ops baru yang belum ada gambarannya.
- Menyedot effort development dari core loop (reservation + merchant intelligence).

Rekomendasi awal: tunda Stream/Community feed dan Leaderboard ke Fase 2, XP/Badge dipertahankan minimal sebagai personal progress. **(Lihat Bagian G — rekomendasi ini di-override user, keputusan final: keep full.)**

## F. Checklist Gap Teknis Sebelum Launch

Bukan fitur baru, tapi prasyarat dari yang sudah diputuskan:

- Implementasi cap anti-buzzer 20 views/user (belum ada di kode)
- Implementasi seat-lock + DP sesuai `problem1` (belum diimplementasi di route yang ada sekarang, masih di tahap desain disetujui)
- Kunci definisi "repeat customer" sebelum dashboard merchant menampilkan metrik itu
- Field demografis opsional di onboarding user (untuk modal data Fase 2, walau nggak dipakai display di V1)

## G. Update Pasca-Diskusi Lanjutan

Bagian A–F di atas adalah jawaban awal yang di-approve sebagai kerangka dasar. Setelah didiskusikan lebih lanjut, beberapa poin diperjelas/diputuskan berbeda dari rekomendasi awal — dicatat di sini biar dokumen ini tetap akurat, bukan menyisakan rekomendasi yang sudah usang:

- **Top Charts (Bagian A)**: diperjelas jadi model dual-track. **Top Charts** = rating dihitung "objektif/terverifikasi" hanya dari user yang sudah reservasi REDEEMED minimal 3 kali ke merchant yang **sama**, dengan mitigasi fraud (3 kunjungan wajib berjarak waktu, plus flag akun yang aktivitasnya 100% ke 1 merchant saja). **Trending** = terpisah, berdasarkan volume tag merchant di Stream (mirip trending Twitter/X), murni sinyal buzz bukan klaim kualitas.
- **Gamification & Stream (Bagian E)**: rekomendasi "tunda" di-**override** oleh keputusan user — final: **keep full** (Stream, Leaderboard, XP, Badge tetap masuk V1). Syarat wajib yang menyertai: rencana moderasi konten Stream harus dibuat sebelum launch (belum ada dokumennya).
  - Tambahan: ditemukan celah XP-farming (user bisa reservasi berulang demi poin, rebutan slot dengan customer asli). Mitigasi baseline yang diputuskan: XP untuk reservasi baru cair saat status **REDEEMED** (QR discan di lokasi), bukan saat booking/DP dibayar. Opsi mitigasi lanjutan masih terbuka — lihat `PROBLEM_YANG_BELUM_TERSELESAIKAN.md`.
- **Revenue Model (Bagian D)**: diperjelas jadi **2 bulan gratis pertama untuk merchant**, dihitung **rolling per-merchant** dari tanggal onboard masing-masing (bukan fixed calendar window). Fokus 2 bulan ini: A/B testing dan mengukur impact ke merchant.
- **Launch market**: Jakarta + Bandung dipilih sebagai kota peluncuran V1. Klaim market size "63.000 coffee shop" untuk 2 kota ini **tidak terverifikasi** dari riset — angka dari berbagai sumber berkisar 1.200 (Bandung saja, kedai kopi spesifik) sampai 461.991 (nasional, semua POI "coffee"), tergantung definisi. Rekomendasi: pakai Google Places API untuk sizing presisi, belum dieksekusi.
- Item yang masih terbuka/belum diputuskan (mitigasi XP-farming lanjutan, strategi Merchant Lite/KYB, dll) dicatat terpisah di `PROBLEM_YANG_BELUM_TERSELESAIKAN.md` — sengaja dipisah dari dokumen ini biar tidak tercampur antara yang sudah final dan yang masih terbuka.
