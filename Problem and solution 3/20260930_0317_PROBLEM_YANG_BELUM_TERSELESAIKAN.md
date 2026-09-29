# Problem yang Belum Terselesaikan

**Timestamp:** 2026-09-30 03:17 WIB
**Status:** Terbuka — belum ada keputusan final, dicatat supaya tidak lupa dibahas

**Visual:** `20260930_0317_PROBLEM_YANG_BELUM_TERSELESAIKAN_visual.png`

---

## Konteks

Dari diskusi scope V1 launch Seato, dua hal berikut sengaja **belum diputuskan** karena butuh keputusan internal tim / data yang belum ada — dicatat di sini biar tidak hilang dari radar, bukan ditulis seolah-olah sudah settle.

## 1. Mitigasi XP-Farming Lanjutan

**Masalah:** XP/Leaderboard bisa dipakai user buat "farming poin" lewat reservasi berulang ke merchant yang sama, ikut rebutan slot dengan customer asli yang beneran mau datang.

**Yang sudah diputuskan (baseline):** XP untuk reservasi baru cair pas status **REDEEMED** (QR discan di lokasi), bukan pas booking/DP dibayar — supaya farming butuh keluar uang DP + datang fisik, bukan cukup klik book.

**Yang belum diputuskan:** apakah baseline ini cukup, atau perlu lapisan tambahan. Opsi yang sudah dipetakan tapi belum dibahas di meeting internal:
- Diminishing returns XP per merchant per periode
- Cooldown antar reservasi ke merchant yang sama
- Cap XP harian/mingguan per user
- Bobot XP lebih besar ke aksi non-capacity (review, foto) dibanding raw visit count
- No-show/cancel rate jadi syarat eligibility badge/leaderboard
- Leaderboard berdasarkan diversity merchant, bukan total visit

**Yang dibutuhkan:** dibawa ke meeting tim, diputuskan setelah lihat data penggunaan riil pasca-launch.

## 2. Strategi Merchant Lite / KYB

**Masalah:** Split settlement DP (Midtrans/Xendit) butuh KYB merchant (NIB/badan usaha). Belum jelas berapa banyak target merchant independen di Jakarta+Bandung yang punya legalitas usaha memadai untuk lolos syarat ini — kalau banyak yang tidak lolos, target market bisa mengecil signifikan dari perkiraan awal.

**Opsi yang sudah dipetakan, belum dipilih:**
- **Segmented** — merchant ber-NIB dapat flow reservasi+DP penuh; merchant tanpa legalitas dapat flow reservasi tanpa DP (risiko no-show lebih tinggi, tapi tetap masuk ecosystem)
- **Full DP only** — hanya terima merchant yang lolos KYB dari awal, TAM lebih kecil tapi konsisten

**Yang dibutuhkan:** riset lapangan — berapa persen target merchant Jakarta+Bandung yang sebenarnya punya legalitas usaha memadai. Riset ini belum dilakukan.

## Catatan tambahan (item minor, masih terbuka)

- Definisi final "repeat customer" belum dikunci
- Harga subscription/CPM final belum ditentukan (menyusul setelah masa gratis 2 bulan pertama)
- Market size presisi Jakarta+Bandung belum dihitung (metodologi Google Places API sudah direkomendasikan, belum dieksekusi)
- Rencana moderasi konten Stream belum ada dokumennya
