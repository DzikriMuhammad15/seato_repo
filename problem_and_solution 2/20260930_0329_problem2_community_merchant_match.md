# Problem 2 — Community × Merchant Match: Wadah Pertemuan Komunitas & Coffee Shop

**Timestamp:** 2026-09-30 03:29 WIB
**Status:** Disepakati (approved) — konsep dasar wadah pertemuan, pemetaan komunitas, dan mekanisme awareness. Detail teknis implementasi & monetisasi **masih terbuka**, dicatat terpisah di bagian 6.

---

## 1. Konteks

Diskusi ini melanjutkan ide awal di `Hasil visual/20260927_1626_community_merchant_realisasi_ui.jpg` — konsep mempertemukan komunitas (mis. komunitas lari) dengan coffee shop merchant lewat platform Seato. Pertanyaan awal yang diajukan: bagaimana cara mengimplementasikannya, bagaimana ini jadi *money machine* untuk Seato, dan bagaimana cara mengoperasikannya supaya goals "wadah pertemuan" antara komunitas dan coffee shop benar-benar terjalin baik.

Referensi visual pendukung diskusi ini:
- `Hasil visual/20260927_1626_community_merchant_realisasi_ui.jpg` — draft UI awal ide Community × Merchant Match
- `Hasil visual/20260927_1626_community_merchant_flow_diagram.jpg` — flow mekanisme awal
- `Hasil visual/20260927_1641_community_merchant_monetization_breakdown.jpg` — breakdown monetisasi awal
- `Hasil visual/20260930_0031_community_merchant_match_blueprint.jpg` — analisis kontradiksi & fase teknis (**belum di-approve**, lihat bagian 6)
- `Hasil visual/20260930_0059_community_discovery_ui_mockup.jpg` — mockup UI mekanisme awareness (**disepakati**)
- `Hasil visual/20260930_0326_community_venue_mapping.jpg` — pemetaan komunitas × kebutuhan venue (**disepakati**)

Pembahasan sempat masuk terlalu jauh ke detail teknis (kontradiksi model monetisasi, fase implementasi bergerbang ke obstacle map) sebelum konsep dasarnya sendiri jelas. Diskusi kemudian sengaja dimundurkan ke pertanyaan paling fundamental: **komunitas aktivitas apa saja yang masuk akal ketemu di coffee shop, dan bagaimana caranya semua user — bukan cuma anggota komunitas — bisa aware akan hal ini.** Bagian itulah yang menjadi isi kesimpulan yang disepakati di bawah ini.

## 2. Masalah yang Dibahas

1. Ide "komunitas ketemu coffee shop" awalnya cuma dicontohkan lewat satu kasus (komunitas lari) — belum jelas apakah ini konsep yang bisa digeneralisir ke jenis komunitas lain, atau butuh fitur terpisah per jenis aktivitas.
2. Belum ada jawaban konkret bagaimana keberadaan event komunitas ini bisa dilihat oleh user secara luas, bukan cuma oleh anggota komunitas yang bersangkutan — padahal ini yang menentukan apakah fitur ini jadi added value nyata bagi Seato atau cuma fitur niche yang sepi pemakai.

## 3. Catatan Kritis dari Analisis Awal (di luar cakupan approval ini)

Sebelum masuk ke solusi yang disepakati, ada temuan kritis dari analisis teknis awal yang **sengaja belum divalidasi** di kesimpulan ini karena diskusinya dimundurkan ke konsep dasar dulu. Dicatat di sini supaya tidak hilang, untuk dibahas di sesi lanjutan:

- **Kontradiksi Jalur #02 (Subscription Tier Gate) vs Opsi A (pool gratis semua tier).** Draft monetisasi awal menjual "akses terima community request sama sekali" sebagai fitur berbayar, padahal keputusan lain menyatakan pool matching harus gratis untuk semua tier merchant supaya funnel Merchant C (low-awareness) tetap terbuka.
- **Klaim "reuse mekanisme waitlist yang sudah ada" tidak akurat** — dicek ke `schema.prisma`, tidak ada model `Waitlist` sama sekali.
- **Fitur ini akan mewarisi 2 temuan dari `Hasil visual/20260929_2339_obstacle_map_project_mockup.png`:** tidak ada capacity check saat approve reservasi (Gate 1, sudah ditangani tim lain di luar diskusi ini), dan belum ada payment rail nyata ke gateway apapun (Gate 4, relevan kalau nanti mekanisme DP per-individu untuk group event mau dibangun).
- **Chicken-and-egg (komunitas/merchant awal) belum punya kriteria verifikasi dan pemilik tugas yang jelas.**

## 4. Solusi yang Disepakati

### 4.1 Pemetaan Komunitas × Kebutuhan Venue

Coffee shop relevan untuk komunitas dalam dua peran yang berbeda karakter — dibreakdown berdasarkan *kapan* coffee shop-nya dibutuhkan:

| Komunitas | Coffee shop dibutuhkan sebagai... | Kebutuhan venue konkret | Tag Seato |
|---|---|---|---|
| 🏃 Lari (running club) | Titik kumpul **setelah** aktivitas | Outdoor/semi-outdoor, dekat garis finish, buka pagi (06.00–07.00), muat rombongan | Outdoor + *(baru)* Group Capacity + *(baru)* Early Opening |
| 🚴 Sepeda (cycling club) | Titik istirahat/kumpul **setelah** (kadang di tengah rute) | Sama seperti lari, tambah parkir sepeda aman & colokan charge Garmin/HP | Outdoor + Group Capacity + *(baru)* Bike Parking |
| 🎾 Padel/tenis/futsal | Nongkrong **setelah** main | Casual, group capacity, tidak harus outdoor | Group Capacity |
| ⛰️ Hiking/naik gunung | Briefing **sebelum** & evaluasi **setelah** | Group capacity, ruang cukup luas untuk carrier/tas besar | Group Capacity |
| 🎮 Esport/gaming | **Bukan** tempat main — tempat kumpul/nobar/diskusi setelah main online | Colokan banyak, wifi kencang, meja lega, sering malam hari | Sudah tercover **WFC Friendly** |
| 🎲 Board game/tabletop | Tempat aktivitas **itu sendiri** | Meja besar, durasi lama, agak privat | Sudah tercover **Private Room** |
| 📷 Fotografi (hunting foto) | Titik kumpul/istirahat di tengah/akhir rute | Outdoor, instagramable | Sudah tercover **Outdoor** |
| 🐾 Pecinta hewan (dog meetup dll) | Tempat aktivitas **itu sendiri** | Ramah hewan | Sudah tercover **Pet Friendly** |
| 🎵 Musik (open mic, akustikan) | Tempat aktivitas **itu sendiri** | Panggung kecil/space tampil | Sudah tercover **Live Music** |

**Temuan penting:** sebagian besar kebutuhan di atas sudah tercover taxonomy Seato yang ada. Yang benar-benar baru cuma dua sinyal universal (bukan kategori per-komunitas):
- **Group Capacity** — venue bisa nampung rombongan berapa orang. Dibutuhkan hampir semua jenis komunitas.
- **Early Opening** — khusus komunitas olahraga outdoor pagi. Krusial karena banyak coffee shop baru buka jam 9–10, sementara lari pagi selesai jam 6–7; kalau tidak dicek, wadah pertemuannya gagal dari langkah pertama.
- **Bike Parking** — niche tambahan khusus komunitas sepeda, bukan sinyal universal.

Kesimpulannya: **satu mekanisme yang sama untuk semua jenis komunitas, dengan filter tag yang beda tergantung jenis aktivitas** — bukan fitur terpisah per jenis komunitas.

### 4.2 Spektrum Intensitas Event — Bukan Dikotomi Tetap per Jenis Komunitas

Revisi dari draf sebelumnya: pembedaan "titik singgah vs tempat aktivitas" **bukan properti tetap dari jenis komunitasnya**, tapi properti dari **event spesifik yang sedang dibuat**. Komunitas lari yang biasanya cuma ngopi santai setelah lari, bisa saja sesekali bikin acara yang jauh lebih terstruktur di coffee shop yang sama — ulang tahun komunitas, sharing session, brand activation dari sponsor, watch party, dst. Ini berlaku untuk semua jenis komunitas, bukan cuma yang di tabel 4.1 kolom "tempat aktivitas itu sendiri".

Jadi yang benar adalah spektrum intensitas per-event:

| | Level santai (default) | Level event terstruktur (occasional) |
|---|---|---|
| Contoh | Ngopi bareng setelah lari/sepeda/padel/hiking | Ulang tahun komunitas, sharing session, brand activation, watch party |
| Kebutuhan venue | Group capacity + jam buka yang pas | Bisa butuh private room/space presentasi, durasi lebih lama |
| Keterlibatan merchant | Pasif — terima rombongan seperti biasa | Lebih aktif — merchant bisa ikut co-promosi acaranya |

Implikasi: kolom "Tag Seato" di tabel 4.1 merepresentasikan kebutuhan **default/paling umum** per jenis komunitas, bukan batas permanen — event yang sama bisa naik level kebutuhannya tergantung agenda spesifiknya, terlepas dari jenis komunitasnya.

### 4.3 Mekanisme Dasar Wadah Pertemuan

1. Leader komunitas share rencana kegiatan (waktu, lokasi, estimasi jumlah orang, **dan jenis event: santai atau terstruktur** — lihat 4.2).
2. Sistem/ops memberi rekomendasi coffee shop yang cocok (tag + kapasitas + lokasi + jam buka; kalau event terstruktur, filter tambahan ke venue yang punya private room/space presentasi).
3. Leader memilih venue → merchant dapat notifikasi → merchant approve.
4. Ketemu di lokasi & waktu yang disepakati.
5. Jadi konten yang auto-publish ke Stream untuk promosi organik.

### 4.4 Tiga Titik Awareness (Added Value untuk Seato)

Supaya event komunitas ini terlihat oleh **semua** user (bukan cuma anggota komunitas terkait), dipakai tiga titik distribusi yang reuse ruang/infrastruktur yang sudah ada:

1. **Feed utama "For You"** — event komunitas (`Stream` tipe `COMMUNITY_EVENT`) ikut bersaing di feed default berdasarkan relevansi lokasi & tag, bukan disembunyikan di tab Events terpisah.
2. **Profil merchant** — section baru menampilkan komunitas yang rutin jadi meeting point di situ (reuse tag "Community Partner" yang sudah ada), kena ke user yang sama sekali tidak berniat buka Komunitas.
3. **Sistem XP/Badge** — reuse tabel `Badge`, `UserBadge`, `XPLog` yang sudah ada di schema. Badge komunitas (mis. "Runner") otomatis tampil di setiap postingan/interaksi user itu di seluruh aplikasi, jadi social proof yang jalan sendiri tanpa sistem notifikasi baru.

**Reposisi value:** dengan tiga titik ini, Seato bergeser dari "alat cari tempat" jadi "alat cari circle/gaya hidup yang cocok" — pembeda dari Google Maps, sekaligus pendorong retensi karena event komunitas sifatnya berulang & terjadwal (alasan rutin untuk buka aplikasi).

### 4.5 Guardrail Operasional

- **Relevansi lokasi wajib** — bukan broadcast buta ke semua user tanpa memperhatikan jarak.
- **Privasi default agregat** — yang publik cukup jumlah peserta terkonfirmasi, bukan data individu tanpa consent eksplisit.
- **Kurasi manual tetap dibutuhkan di awal** — supaya komunitas/merchant yang tampil di fitur ini beneran aktif, bukan yang sekali daftar lalu mati (mitigasi "community palsu").

## 5. Implikasi ke Produk

- **Taxonomy baru:** `Group Capacity`, `Early Opening`, `Bike Parking` (niche) — ditambahkan sebagai tag/kriteria filter, konsisten dengan prinsip Seato bahwa kategori adalah bagian dari standardisasi listing, bukan dibuat ad-hoc.
- **Model baru:** `Community` dan `CommunityEvent` — menyimpan data leader, jenis aktivitas, waktu, lokasi, estimasi headcount.
- **Reuse tanpa migrasi besar:** `RestaurantArea.total` untuk cek kapasitas, `Restaurant.tags` untuk sinyal "Community Partner", `Badge`/`UserBadge`/`XPLog` untuk sistem awareness lewat gamifikasi (tinggal tambah action & kategori badge baru).

## 6. Yang Masih Terbuka / Dicatat untuk Fase Berikutnya

- **Resolusi kontradiksi Jalur #02** (subscription tier gate) — perlu diputuskan apakah yang dikunci ke subscription itu automation/priority/badge saja, atau tetap kemampuan dasar menerima request (lihat bagian 3).
- **Detail 4 jalur monetisasi** (Sponsored Placement, Subscription Tier Gate, Data/Insight Premium, Reservation Commission) dan urutan rollout-nya — didokumentasikan di `Hasil visual/20260930_0031_community_merchant_match_blueprint.jpg`, tapi belum di-approve sebagai keputusan final.
- **Fase teknis implementasi** yang digerbang oleh temuan obstacle map (capacity check, payment rail) — perlu dibahas ulang lebih sederhana di sesi lanjutan.
- **Siapa pemilik operasional** untuk kurasi manual komunitas & verifikasi merchant di fase awal — belum diputuskan, dicatat sebagai gap terbuka.
- **Mekanisme konkret matching** (siapa yang menjalankan rekomendasi venue di langkah 2 pada bagian 4.3 — manual ops atau otomatis) — belum didetailkan, menyusul setelah keputusan di atas.
