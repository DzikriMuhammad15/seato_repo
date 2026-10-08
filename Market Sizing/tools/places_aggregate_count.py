"""Hitung jumlah tempat lewat Google Places Aggregate API (INSIGHT_COUNT).

STATUS: BELUM PERNAH DIJALANKAN terhadap API sungguhan (belum ada billing Google Cloud, 2026-10-08).
Format request disusun dari dokumentasi resmi:
  https://developers.google.com/maps/documentation/places-aggregate/reference/rest/v1/TopLevel/computeInsights
Yang BELUM terverifikasi sampai run pertama:
  - apakah 'coffee_shop' dan 'cafe' diterima sebagai includedTypes (kalau tidak, API mengembalikan error 400),
  - apakah place ID tingkat kelurahan/kecamatan diterima sebagai 'region' (dokumentasi menyebut region ditolak
    jika tipenya masuk daftar tertentu; jika ditolak, pakai kota administrasi, atau ganti ke customArea/circle),
  - apakah beberapa includedTypes bekerja sebagai OR (karena itu script juga menghitung tiap tipe sendiri-sendiri;
    jumlah tipe terpisah bisa ganda karena satu tempat punya banyak tipe).

KEAMANAN BIAYA
  - Default = DRY-RUN: hanya mencetak rencana request, tidak memanggil API.
  - Panggilan nyata hanya jika memakai --run DAN env GOOGLE_MAPS_API_KEY terisi.
  - Ada batas --max-requests (default 60). Gratis 5.000 request/bulan, setelah itu US$10 per 1.000 (pricing Google, 2026-10).
  - Berhenti otomatis setelah 3 error berturut-turut.
  - API key JANGAN ditulis di file/chat. Pasang batas kuota harian + budget alert di Google Cloud Console.

KEPATUHAN (ToS Google, klausul 13.2 Places Aggregate)
  - Hasil boleh di-cache maksimal 30 hari kalender, lalu harus dihapus. File hasil memuat tanggal 'hapus_setelah'.
  - Simpan hanya angka dan JSON parameter request. Jangan mengekspor daftar tempat.
  - Status penggunaan angka di deck: konfirmasi konsultan hukum dulu.

CARA PAKAI
  python places_aggregate_count.py --config config_contoh.json                  (dry-run)
  python places_aggregate_count.py --config config_contoh.json --run            (panggilan nyata)
"""
import argparse
import datetime
import json
import os
import sys
import urllib.error
import urllib.request

ENDPOINT = "https://areainsights.googleapis.com/v1:computeInsights"
PLACEHOLDER_PREFIX = "GANTI"


def build_request(place_id, types, statuses, min_rating):
    body = {
        "insights": ["INSIGHT_COUNT"],
        "filter": {
            "locationFilter": {"region": {"place": f"places/{place_id}"}},
            "typeFilter": {"includedTypes": types},
            "operatingStatus": statuses,
        },
    }
    if min_rating is not None:
        body["filter"]["ratingFilter"] = {"minRating": min_rating}
    return body


def plan(cfg):
    items = []
    statuses = cfg.get("operating_status", ["OPERATING_STATUS_OPERATIONAL"])
    ratings = cfg.get("rating_min_list", [None])
    for region in cfg["regions"]:
        pid = region["place_id"]
        if pid.startswith(PLACEHOLDER_PREFIX):
            print(f"[lewati] {region['nama']}: place_id masih placeholder")
            continue
        for set_name, types in cfg["tipe_sets"].items():
            for rating in ratings:
                items.append({
                    "region": region["nama"],
                    "tipe_set": set_name,
                    "rating_min": rating,
                    "request_body": build_request(pid, types, statuses, rating),
                })
    return items


def call_api(api_key, body):
    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json", "X-Goog-Api-Key": api_key},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", required=True)
    ap.add_argument("--run", action="store_true", help="panggil API sungguhan (default: dry-run)")
    ap.add_argument("--max-requests", type=int, default=60)
    ap.add_argument("--out", default=None, help="path file hasil JSON")
    args = ap.parse_args()

    with open(args.config, encoding="utf-8-sig") as f:  # utf-8-sig: aman untuk file dari Notepad (BOM)
        cfg = json.load(f)
    items = plan(cfg)
    print(f"Rencana: {len(items)} request (batas {args.max_requests}).")
    if len(items) > args.max_requests:
        sys.exit("Dibatalkan: jumlah request melebihi --max-requests. Kurangi region/tipe atau naikkan batas secara sadar.")
    if not args.run:
        for it in items:
            print("DRY-RUN", it["region"], it["tipe_set"], it["rating_min"])
        print("Dry-run selesai, tidak ada panggilan API.")
        return

    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if not api_key:
        sys.exit("Env GOOGLE_MAPS_API_KEY belum diisi.")

    now = datetime.datetime.now()
    out_path = args.out or f"hasil_aggregate_{now:%Y%m%d_%H%M}.json"
    results, errors = [], 0
    for it in items:
        entry = dict(it)
        try:
            data = call_api(api_key, it["request_body"])
            entry["count"] = int(data.get("count", 0))
            entry["status"] = "ok"
            errors = 0
        except urllib.error.HTTPError as e:
            entry["status"] = f"http_{e.code}"
            entry["error"] = e.read().decode("utf-8", errors="replace")[:500]
            errors += 1
        except Exception as e:  # noqa: BLE001
            entry["status"] = "error"
            entry["error"] = str(e)[:500]
            errors += 1
        print(entry["region"], entry["tipe_set"], entry["rating_min"], "->", entry.get("count", entry["status"]))
        results.append(entry)
        if errors >= 3:
            print("Berhenti: 3 error berturut-turut. Periksa key, tipe, atau place_id.")
            break

    doc = {
        "dibuat": now.isoformat(timespec="seconds"),
        "hapus_setelah": (now + datetime.timedelta(days=30)).date().isoformat(),
        "peringatan": "ToS Google 13.2 (Places Aggregate): POI Count hanya boleh di-cache 30 hari, lalu wajib dihapus. "
                      "Konfirmasi konsultan hukum sebelum angka dipakai di deck.",
        "hasil": results,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
    print("Hasil disimpan:", out_path, "| hapus setelah", doc["hapus_setelah"])


if __name__ == "__main__":
    main()
