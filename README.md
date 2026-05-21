# Web-SITTA — Sistem Informasi Tata Kelola Tugas & Ajar

Aplikasi website untuk pemesanan Bahan Ajar di Universitas Terbuka.

## Fitur

### 1. Halaman Stok Bahan Ajar
- Tabel daftar stok bahan ajar untuk seluruh UT daerah
- Status stok: ✅ Aman / ⚠️ Menipis / 🚫 Kosong
- Filter berdasarkan UT-Daerah dan Kategori Mata Kuliah (dependent options)
- Filter re-order (stok < safety stock atau stok = 0)
- Sort berdasarkan judul, stok, dan harga
- Fitur edit dan tambah bahan ajar baru dengan validasi

### 2. Tracking Delivery Order (DO)
- Tracking status pengiriman DO bahan ajar
- Auto-generated nomor DO (format: DO{Tahun}-{Sequence})
- Form input DO baru dengan pilihan paket bahan ajar
- Detail isi paket bahan ajar setelah memilih paket
- Status progression: Diproses → Dikirim → Diterima

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: React useState + useMemo

## Instalasi

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka http://localhost:3000 di browser.

## Struktur Proyek

```
src/
├── app/
│   ├── api/download/     # API route untuk download source code
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Halaman utama dengan tab navigasi
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── stok-bahan-ajar.tsx   # Komponen halaman stok
│   └── tracking-do.tsx       # Komponen halaman tracking DO
├── data/
│   └── bahan-ajar.ts     # Data dummy (upbjjList, bahanAjar, paket, tracking)
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

## Data

Data menggunakan dummy data yang disimpan dalam file TypeScript (`src/data/bahan-ajar.ts`), meliputi:
- **upbjjList**: 8 UT-Daerah dengan ekspedisi dan kategori
- **bahanAjarData**: 25 item stok bahan ajar
- **paketList**: 8 paket bahan ajar
- **trackingDOData**: 3 data tracking DO awal
