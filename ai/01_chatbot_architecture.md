# AI Agentic Chatbot — Arsitektur & Flow

> Catatan format: diagram memakai Mermaid (render native di GitHub), bukan `.drawio`
> seperti di `uml_technical/`, karena layout `.drawio` tidak bisa saya buat secara
> presisi tanpa editor visual. Kalau Anda butuh versi `.drawio`, diagram Mermaid ini
> bisa jadi acuan untuk digambar ulang di draw.io.

## 1. Komponen Utama

- **Channel**: Telegram Bot / in-app chat widget (frontend Seato Admin)
- **Backend Seato (Next.js)**: autentikasi, data owner (Prisma/DB), orchestrator permintaan
- **AI Agent Service (seato-ai-services)**: reasoning + tool-use (function calling)
- **Scratchpad Executor**: sandbox Python terpisah yang menjalankan kode matplotlib
  yang di-generate AI, lalu mengubahnya jadi file gambar (PNG/SVG)
- **Object storage sementara**: tempat menyimpan hasil gambar scratchpad agar bisa
  diakses via URL oleh frontend/Telegram

## 2. Arsitektur Tingkat Tinggi

```mermaid
flowchart TB
    subgraph Channel["Channel Merchant"]
        TG["Telegram Bot"]
        FE["In-App Chat Widget (Admin Dashboard)"]
    end

    subgraph Backend["Backend Seato (Next.js)"]
        AUTH["Auth & Account Linking\n(chat_id <-> merchant_id)"]
        ORC["Orchestrator API\n/api/ai/chat"]
        DB[("Database\nReservation, VisitorLog,\nReview, Promo, Area")]
    end

    subgraph AIService["AI Agent Service (seato-ai-services)"]
        ROUTER["Intent Router / Planner"]
        T1["Tool: query_data"]
        T2["Tool: generate_insight"]
        T3["Tool: write_action\n(update_reservation, create_promo)"]
        T4["Tool: visualize_data\n(generate kode matplotlib)"]
        CONFIRM["Confirmation Gate\n(aksi sensitif)"]
    end

    subgraph Sandbox["Scratchpad Executor"]
        EXEC["Python Sandbox\n(exec kode matplotlib, timeout+limit)"]
        IMG[("Image Store\n(PNG/SVG, TTL)")]
    end

    TG --> AUTH
    FE --> AUTH
    AUTH --> ORC
    ORC --> ROUTER
    ROUTER --> T1 --> DB
    ROUTER --> T2 --> DB
    ROUTER --> T3 --> CONFIRM --> DB
    ROUTER --> T4 --> EXEC --> IMG
    IMG -- "image URL" --> ORC
    DB -- "hasil data" --> ORC
    ORC -- "teks + image URL" --> TG
    ORC -- "teks + image URL" --> FE
```

## 3. Sequence Diagram — Contoh "Tampilkan grafik tren reservasi"

Ini skenario di mana AI memutuskan sendiri bahwa jawaban terbaik adalah berupa
visualisasi, lalu men-generate kode matplotlib (scratchpad), menjalankannya, dan
mengirim hasilnya balik ke chat.

```mermaid
sequenceDiagram
    actor M as Merchant
    participant CH as Channel (Telegram/FE Chat)
    participant BE as Backend Seato
    participant AI as AI Agent (Planner)
    participant SB as Scratchpad Executor
    participant DB as Database

    M->>CH: "Tampilkan tren reservasi 7 hari terakhir dalam grafik"
    CH->>BE: forward message (+ merchant_id terverifikasi)
    BE->>AI: kirim prompt + context merchant_id
    AI->>AI: Planner menilai intent -> butuh data + visualisasi
    AI->>DB: tool_call: query_data(reservation, 7 hari)
    DB-->>AI: hasil data mentah (JSON)
    AI->>AI: generate kode matplotlib berdasarkan data nyata
    AI->>SB: tool_call: run_matplotlib(code, data)
    SB->>SB: eksekusi di sandbox (CPU/time/memory limit)
    SB-->>AI: image file (PNG) + exit status
    alt eksekusi gagal (code error)
        AI->>AI: retry generate kode (maks N kali)
    end
    AI->>BE: narasi singkat + image_url
    BE->>CH: kirim balasan (teks + gambar)
    CH->>M: tampilkan bubble chat: teks + grafik
```

## 4. Alasan Desain Scratchpad (kritis, bukan sekadar "AI bikin gambar")

- **Kenapa matplotlib dieksekusi di sandbox terpisah, bukan di proses utama AI
  service?** Kode yang di-generate LLM tidak boleh dipercaya begitu saja —
  harus dijalankan dengan batas waktu, batas memori, dan tanpa akses
  filesystem/network, supaya kode error atau kode berbahaya (meski kecil
  kemungkinan) tidak bisa mengganggu service utama.
- **Kenapa AI tidak boleh "mengarang" data untuk chart?** Kode matplotlib harus
  dibangun dari hasil `query_data` yang nyata (bukan AI menebak angka), konsisten
  dengan guardrail anti-fabrikasi yang sudah ada di skill SWOT/STP.
- **Kenapa ada retry loop?** Kode yang di-generate LLM kadang syntax error atau
  salah assign variabel — perlu mekanisme "coba lagi dengan error message
  sebagai feedback" sebelum menyerah dan menjawab tanpa visual.
- **Aksi sensitif (`write_action`) tetap lewat Confirmation Gate** — konsisten
  dengan pembahasan sebelumnya: AI boleh otonom untuk baca data & visualisasi,
  tapi tidak untuk aksi yang berdampak finansial/operasional tanpa approve
  merchant.

## 5. Risiko yang Perlu Diputuskan Lebih Dulu

1. **Biaya kompute sandbox** — setiap permintaan visualisasi berarti spin-up
   proses Python terisolasi; perlu ada rate limit per merchant per hari.
2. **Keamanan sandbox** — wajib pakai container terisolasi (misal gVisor/
   nsjail/Docker tanpa network) kalau dirilis ke publik, bukan `exec()` polos.
3. **Latency** — generate kode + eksekusi + render gambar menambah waktu respons
   dibanding jawaban teks biasa; perlu loading state yang jelas di chat UI.
