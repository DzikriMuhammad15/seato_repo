# Live Source — SEATO Financial Operating System (FOS)

**Timestamp:** 2026-10-08 18:28 WIB
**Tipe:** Reference (pointer ke sumber eksternal, bukan kesimpulan diskusi)

---

## Link

https://docs.google.com/spreadsheets/d/1n2adQI4hTffz7vJ4YbXQ3UXsr4cezm8EGWyhLSbjYp0/edit?usp=sharing

Spreadsheet ID: `1n2adQI4hTffz7vJ4YbXQ3UXsr4cezm8EGWyhLSbjYp0`

Ini adalah Google Sheet **"Copy of COPY FOS for GITHUB"** — sumber angka asli untuk seluruh model finansial SEATO. File `.xlsx` di folder ini (`SEATO FINANCIAL OPERATING SYSTEM (FOS) (1).xlsx`) adalah snapshot/copy-nya, **bukan live**. Kalau butuh angka terbaru yang belum sempat di-export ulang ke `.xlsx`, baca langsung dari link ini.

## Struktur Tab (14 tab)

PRICING, GROWTH PROJECTION, REVENUE MODEL, COST STRUCTURE, P&L STATEMENT, FUNDING ANALYSIS, CASHFLOW STATEMENT, UNIT ECONOMICS, BREAK EVEN, BURN RATE, VALUATION, DASHBOARD, KPI, CHANGELOG.

- **Scenario aktif** dikontrol di `REVENUE MODEL!C3` (1=High, 2=Mid, 3=Low, 4=Low+fee performa). Semua tab hilir ikut scenario ini. Saat ini: **3 (Low)**.
- **CHANGELOG** tab mencatat semua perubahan sel yang pernah dibuat + daftar "KEPUTUSAN TERBUKA" yang belum diputuskan pengguna (lihat ringkasan di [20261008_0348_summary_fundraise_valuasi_FOS.md](20261008_0348_summary_fundraise_valuasi_FOS.md) §7 — isinya sama, dicek ulang 18:28 dan belum ada entri baru setelah #34).

## Catatan Penting

- Data di sheet ini **belum difiksasi** — beberapa angka kunci masih berstatus "KEPUTUSAN TERBUKA" (basis retensi bulanan vs tahunan, buffer 10% vs 20%, rekonsiliasi pre-launch cost, Pasal 31E, churn belum dimodelkan, COGS=0, Growth Projection Y2-5 kosong). Jangan dikutip sebagai angka final ke investor sebelum item-item ini ditutup.
- Setiap kali membaca ulang sheet ini untuk analisis baru, cek dulu tab `CHANGELOG` untuk nomor entri terbaru — kalau sudah lebih dari #34, berarti ada perubahan sejak catatan ini dibuat dan ringkasan di atas perlu di-refresh.
