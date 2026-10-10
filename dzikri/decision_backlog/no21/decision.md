KESIMPULAN: ...

Seato memakai Email saja untuk V1 (lewat EmailService/Resend yang sudah terimplementasi, gratis s.d. 3.000 email/bulan), tidak membangun WhatsApp atau Telegram dulu. Tapi bisa juga pakai telegram karena gratis

email
Gratis: 3.000 email/bulan (cap 100/hari), 1 domain.
Berbayar: mulai $20/bulan untuk 50.000 email/bulan; kalau lewat kuota paket, kena ±$0,0008/email tambahan.

whatsapp business API:
Biaya per-pesan ke Meta (mulai 1 Oktober 2026, Meta ganti skema jadi per-pesan, bukan lagi per-percakapan): untuk Indonesia — Marketing $0,0411, Utility $0,0250, Authentication $0,0250 per pesan. Laporan performa resto kemungkinan masuk kategori Utility (transaksional, bukan marketing) ≈ $0,025/pesan.
Biaya langganan bulanan ke provider/BSP (Twilio, Qontak, dll — karena akses WA Business API tidak bisa langsung ke Meta) — contoh Qontak mulai ±Rp599rb/bulan.
Estimasi kebutuhan Seato: 340 merchant × 4 laporan/bulan = 1.360 pesan × $0,025 ≈ $34/bulan (kasar, belum termasuk fluktuasi kurs) + minimal ±Rp599rb/bulan biaya BSP — jadi WA punya biaya tetap bulanan yang nyata, beda dari Email yang kemungkinan gratis di skala ini.

telegram
free -> perlu konfigurasi dan server sendiri