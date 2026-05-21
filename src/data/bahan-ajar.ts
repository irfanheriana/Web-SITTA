// Dummy data untuk Aplikasi Pemesanan Bahan Ajar Universitas Terbuka

export interface Upbjj {
  kode: string;
  nama: string;
  ekspedisi: string[];
  kategoriList: string[];
}

export interface BahanAjar {
  id: string;
  kode: string;
  judul: string;
  kategori: string;
  upbjj: string;
  lokasiRak: string;
  qty: number;
  safety: number;
  harga: number;
  catatanHTML: string;
}

export interface PaketBahanAjar {
  id: string;
  kode: string;
  nama: string;
  harga: number;
  isi: { kode: string; judul: string }[];
}

export interface TrackingDO {
  id: string;
  nomorDO: string;
  nim: string;
  nama: string;
  upbjj: string;
  ekspedisi: string;
  paketId: string;
  tanggalKirim: string;
  totalHarga: number;
  status: "Diproses" | "Dikirim" | "Diterima";
}

// Data UT-Daerah (UPBJJ)
export const upbjjList: Upbjj[] = [
  {
    kode: "UT-JKT",
    nama: "UT Jakarta",
    ekspedisi: ["JNE Regular", "JNE Express"],
    kategoriList: ["S1 Manajemen", "S1 Akuntansi", "S1 Ilmu Administrasi Negara"],
  },
  {
    kode: "UT-BDG",
    nama: "UT Bandung",
    ekspedisi: ["JNE Regular", "JNE Express"],
    kategoriList: ["S1 Manajemen", "S1 Akuntansi", "S1 Ilmu Komunikasi"],
  },
  {
    kode: "UT-SBY",
    nama: "UT Surabaya",
    ekspedisi: ["JNE Regular", "JNE Express"],
    kategoriList: ["S1 Teknik Informatika", "S1 Sistem Informasi", "S1 Manajemen"],
  },
  {
    kode: "UT-SMD",
    nama: "UT Semarang",
    ekspedisi: ["JNE Regular"],
    kategoriList: ["S1 Manajemen", "S1 Akuntansi", "S1 Hukum"],
  },
  {
    kode: "UT-MDN",
    nama: "UT Medan",
    ekspedisi: ["JNE Express"],
    kategoriList: ["S1 Manajemen", "S1 Ilmu Administrasi Negara", "S1 Hukum"],
  },
  {
    kode: "UT-MKS",
    nama: "UT Makassar",
    ekspedisi: ["JNE Regular", "JNE Express"],
    kategoriList: ["S1 Manajemen", "S1 Akuntansi", "S1 Ilmu Komunikasi"],
  },
  {
    kode: "UT-PLB",
    nama: "UT Palembang",
    ekspedisi: ["JNE Regular"],
    kategoriList: ["S1 Manajemen", "S1 Hukum"],
  },
  {
    kode: "UT-YGY",
    nama: "UT Yogyakarta",
    ekspedisi: ["JNE Regular", "JNE Express"],
    kategoriList: ["S1 Teknik Informatika", "S1 Sistem Informasi", "S1 Ilmu Komunikasi"],
  },
];

// Data Stok Bahan Ajar
export const bahanAjarData: BahanAjar[] = [
  {
    id: "ba-001",
    kode: "EKMA4116",
    judul: "Manajemen",
    kategori: "S1 Manajemen",
    upbjj: "UT-JKT",
    lokasiRak: "A1-01",
    qty: 150,
    safety: 50,
    harga: 75000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-002",
    kode: "EKMA4115",
    judul: "Pengantar Akuntansi",
    kategori: "S1 Akuntansi",
    upbjj: "UT-JKT",
    lokasiRak: "A1-02",
    qty: 30,
    safety: 50,
    harga: 85000,
    catatanHTML: "<strong>Perlu re-order</strong>",
  },
  {
    id: "ba-003",
    kode: "ISIP4110",
    judul: "Ilmu Administrasi Negara",
    kategori: "S1 Ilmu Administrasi Negara",
    upbjj: "UT-JKT",
    lokasiRak: "A2-01",
    qty: 0,
    safety: 40,
    harga: 65000,
    catatanHTML: "<span style='color:red'>Stok habis!</span>",
  },
  {
    id: "ba-004",
    kode: "EKMA4116",
    judul: "Manajemen",
    kategori: "S1 Manajemen",
    upbjj: "UT-BDG",
    lokasiRak: "B1-01",
    qty: 80,
    safety: 50,
    harga: 75000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-005",
    kode: "EKMA4115",
    judul: "Pengantar Akuntansi",
    kategori: "S1 Akuntansi",
    upbjj: "UT-BDG",
    lokasiRak: "B1-02",
    qty: 25,
    safety: 40,
    harga: 85000,
    catatanHTML: "<em>Stok menipis</em>",
  },
  {
    id: "ba-006",
    kode: "MKDU4110",
    judul: "Ilmu Komunikasi",
    kategori: "S1 Ilmu Komunikasi",
    upbjj: "UT-BDG",
    lokasiRak: "B2-01",
    qty: 60,
    safety: 30,
    harga: 70000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-007",
    kode: "MKDU4110",
    judul: "Ilmu Komunikasi",
    kategori: "S1 Ilmu Komunikasi",
    upbjj: "UT-YGY",
    lokasiRak: "H2-01",
    qty: 45,
    safety: 30,
    harga: 70000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-008",
    kode: "MSIM4101",
    judul: "Algoritma dan Pemrograman",
    kategori: "S1 Teknik Informatika",
    upbjj: "UT-SBY",
    lokasiRak: "C1-01",
    qty: 20,
    safety: 30,
    harga: 95000,
    catatanHTML: "<strong>Perlu re-order</strong>",
  },
  {
    id: "ba-009",
    kode: "MSIM4102",
    judul: "Basis Data",
    kategori: "S1 Sistem Informasi",
    upbjj: "UT-SBY",
    lokasiRak: "C1-02",
    qty: 0,
    safety: 25,
    harga: 80000,
    catatanHTML: "<span style='color:red'>Stok habis!</span>",
  },
  {
    id: "ba-010",
    kode: "EKMA4116",
    judul: "Manajemen",
    kategori: "S1 Manajemen",
    upbjj: "UT-SBY",
    lokasiRak: "C2-01",
    qty: 90,
    safety: 50,
    harga: 75000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-011",
    kode: "HKUM4101",
    judul: "Pengantar Ilmu Hukum",
    kategori: "S1 Hukum",
    upbjj: "UT-SMD",
    lokasiRak: "D1-01",
    qty: 10,
    safety: 35,
    harga: 72000,
    catatanHTML: "<strong>Perlu re-order segera</strong>",
  },
  {
    id: "ba-012",
    kode: "EKMA4115",
    judul: "Pengantar Akuntansi",
    kategori: "S1 Akuntansi",
    upbjj: "UT-SMD",
    lokasiRak: "D1-02",
    qty: 55,
    safety: 40,
    harga: 85000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-013",
    kode: "EKMA4116",
    judul: "Manajemen",
    kategori: "S1 Manajemen",
    upbjj: "UT-MDN",
    lokasiRak: "E1-01",
    qty: 0,
    safety: 45,
    harga: 75000,
    catatanHTML: "<span style='color:red'>Stok habis!</span>",
  },
  {
    id: "ba-014",
    kode: "ISIP4110",
    judul: "Ilmu Administrasi Negara",
    kategori: "S1 Ilmu Administrasi Negara",
    upbjj: "UT-MDN",
    lokasiRak: "E2-01",
    qty: 15,
    safety: 30,
    harga: 65000,
    catatanHTML: "<strong>Stok menipis</strong>",
  },
  {
    id: "ba-015",
    kode: "HKUM4101",
    judul: "Pengantar Ilmu Hukum",
    kategori: "S1 Hukum",
    upbjj: "UT-MDN",
    lokasiRak: "E3-01",
    qty: 40,
    safety: 35,
    harga: 72000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-016",
    kode: "EKMA4116",
    judul: "Manajemen",
    kategori: "S1 Manajemen",
    upbjj: "UT-MKS",
    lokasiRak: "F1-01",
    qty: 70,
    safety: 50,
    harga: 75000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-017",
    kode: "EKMA4115",
    judul: "Pengantar Akuntansi",
    kategori: "S1 Akuntansi",
    upbjj: "UT-MKS",
    lokasiRak: "F1-02",
    qty: 0,
    safety: 40,
    harga: 85000,
    catatanHTML: "<span style='color:red'>Stok habis!</span>",
  },
  {
    id: "ba-018",
    kode: "MKDU4110",
    judul: "Ilmu Komunikasi",
    kategori: "S1 Ilmu Komunikasi",
    upbjj: "UT-MKS",
    lokasiRak: "F2-01",
    qty: 28,
    safety: 30,
    harga: 70000,
    catatanHTML: "<strong>Stok menipis</strong>",
  },
  {
    id: "ba-019",
    kode: "EKMA4116",
    judul: "Manajemen",
    kategori: "S1 Manajemen",
    upbjj: "UT-PLB",
    lokasiRak: "G1-01",
    qty: 5,
    safety: 40,
    harga: 75000,
    catatanHTML: "<strong>Perlu re-order segera</strong>",
  },
  {
    id: "ba-020",
    kode: "HKUM4101",
    judul: "Pengantar Ilmu Hukum",
    kategori: "S1 Hukum",
    upbjj: "UT-PLB",
    lokasiRak: "G2-01",
    qty: 50,
    safety: 35,
    harga: 72000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-021",
    kode: "MSIM4101",
    judul: "Algoritma dan Pemrograman",
    kategori: "S1 Teknik Informatika",
    upbjj: "UT-YGY",
    lokasiRak: "H1-01",
    qty: 35,
    safety: 25,
    harga: 95000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-022",
    kode: "MSIM4102",
    judul: "Basis Data",
    kategori: "S1 Sistem Informasi",
    upbjj: "UT-YGY",
    lokasiRak: "H1-02",
    qty: 12,
    safety: 25,
    harga: 80000,
    catatanHTML: "<strong>Stok menipis</strong>",
  },
  {
    id: "ba-023",
    kode: "MSIM4103",
    judul: "Jaringan Komputer",
    kategori: "S1 Teknik Informatika",
    upbjj: "UT-SBY",
    lokasiRak: "C1-03",
    qty: 42,
    safety: 30,
    harga: 88000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
  {
    id: "ba-024",
    kode: "MSIM4104",
    judul: "Rekayasa Perangkat Lunak",
    kategori: "S1 Sistem Informasi",
    upbjj: "UT-SBY",
    lokasiRak: "C1-04",
    qty: 18,
    safety: 25,
    harga: 92000,
    catatanHTML: "<strong>Perlu re-order</strong>",
  },
  {
    id: "ba-025",
    kode: "EKMA4120",
    judul: "Pemasaran",
    kategori: "S1 Manajemen",
    upbjj: "UT-JKT",
    lokasiRak: "A1-03",
    qty: 65,
    safety: 50,
    harga: 78000,
    catatanHTML: "<em>Stok tersedia</em>",
  },
];

// Data Paket Bahan Ajar
export const paketList: PaketBahanAjar[] = [
  {
    id: "pkt-001",
    kode: "PKT-MNJ-01",
    nama: "Paket Manajemen Semester 1",
    harga: 228000,
    isi: [
      { kode: "EKMA4116", judul: "Manajemen" },
      { kode: "EKMA4120", judul: "Pemasaran" },
      { kode: "EKMA4110", judul: "Pengantar Bisnis" },
    ],
  },
  {
    id: "pkt-002",
    kode: "PKT-AKT-01",
    nama: "Paket Akuntansi Semester 1",
    harga: 255000,
    isi: [
      { kode: "EKMA4115", judul: "Pengantar Akuntansi" },
      { kode: "EKMA4117", judul: "Akuntansi Biaya" },
      { kode: "EKMA4118", judul: "Akuntansi Keuangan" },
    ],
  },
  {
    id: "pkt-003",
    kode: "PKT-TI-01",
    nama: "Paket Teknik Informatika Semester 1",
    harga: 270000,
    isi: [
      { kode: "MSIM4101", judul: "Algoritma dan Pemrograman" },
      { kode: "MSIM4102", judul: "Basis Data" },
      { kode: "MSIM4103", judul: "Jaringan Komputer" },
    ],
  },
  {
    id: "pkt-004",
    kode: "PKT-SI-01",
    nama: "Paket Sistem Informasi Semester 1",
    harga: 252000,
    isi: [
      { kode: "MSIM4102", judul: "Basis Data" },
      { kode: "MSIM4104", judul: "Rekayasa Perangkat Lunak" },
      { kode: "MSIM4105", judul: "Analisis Sistem" },
    ],
  },
  {
    id: "pkt-005",
    kode: "PKT-IKN-01",
    nama: "Paket Ilmu Komunikasi Semester 1",
    harga: 210000,
    isi: [
      { kode: "MKDU4110", judul: "Ilmu Komunikasi" },
      { kode: "MKDU4111", judul: "Komunikasi Massa" },
      { kode: "MKDU4112", judul: "Public Relations" },
    ],
  },
  {
    id: "pkt-006",
    kode: "PKT-ADN-01",
    nama: "Paket Ilmu Administrasi Negara Semester 1",
    harga: 195000,
    isi: [
      { kode: "ISIP4110", judul: "Ilmu Administrasi Negara" },
      { kode: "ISIP4111", judul: "Administrasi Publik" },
      { kode: "ISIP4112", judul: "Kebijakan Publik" },
    ],
  },
  {
    id: "pkt-007",
    kode: "PKT-HKM-01",
    nama: "Paket Hukum Semester 1",
    harga: 216000,
    isi: [
      { kode: "HKUM4101", judul: "Pengantar Ilmu Hukum" },
      { kode: "HKUM4102", judul: "Hukum Perdata" },
      { kode: "HKUM4103", judul: "Hukum Tata Negara" },
    ],
  },
  {
    id: "pkt-008",
    kode: "PKT-MNJ-02",
    nama: "Paket Manajemen Semester 2",
    harga: 245000,
    isi: [
      { kode: "EKMA4121", judul: "Manajemen Keuangan" },
      { kode: "EKMA4122", judul: "Manajemen Sumber Daya Manusia" },
      { kode: "EKMA4123", judul: "Manajemen Operasi" },
    ],
  },
];

// Data Tracking DO awal
export const trackingDOData: TrackingDO[] = [
  {
    id: "do-001",
    nomorDO: "DO2025-001",
    nim: "123456789",
    nama: "Ahmad Fauzi",
    upbjj: "UT-JKT",
    ekspedisi: "JNE Regular",
    paketId: "pkt-001",
    tanggalKirim: "2025-01-15",
    totalHarga: 228000,
    status: "Diterima",
  },
  {
    id: "do-002",
    nomorDO: "DO2025-002",
    nim: "234567890",
    nama: "Siti Nurhaliza",
    upbjj: "UT-SBY",
    ekspedisi: "JNE Express",
    paketId: "pkt-003",
    tanggalKirim: "2025-01-20",
    totalHarga: 270000,
    status: "Dikirim",
  },
  {
    id: "do-003",
    nomorDO: "DO2025-003",
    nim: "345678901",
    nama: "Budi Santoso",
    upbjj: "UT-SMD",
    ekspedisi: "JNE Regular",
    paketId: "pkt-002",
    tanggalKirim: "2025-02-01",
    totalHarga: 255000,
    status: "Diproses",
  },
];

// Helper function to get status of bahan ajar
export function getStokStatus(qty: number, safety: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (qty === 0) {
    return { label: "Kosong", color: "text-red-600 bg-red-50 border-red-200", icon: "🚫" };
  } else if (qty < safety) {
    return { label: "Menipis", color: "text-orange-600 bg-orange-50 border-orange-200", icon: "⚠️" };
  } else {
    return { label: "Aman", color: "text-green-600 bg-green-50 border-green-200", icon: "✅" };
  }
}

// Generate DO Number
export function generateDONumber(existingDOs: TrackingDO[]): string {
  const year = new Date().getFullYear();
  const prefix = `DO${year}-`;
  const existingNumbers = existingDOs
    .filter((d) => d.nomorDO.startsWith(prefix))
    .map((d) => {
      const parts = d.nomorDO.split("-");
      return parseInt(parts[1], 10);
    });
  const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  const nextNum = maxNum + 1;
  return `${prefix}${String(nextNum).padStart(3, "0")}`;
}
