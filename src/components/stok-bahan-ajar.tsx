"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  bahanAjarData,
  upbjjList,
  getStokStatus,
  type BahanAjar,
} from "@/data/bahan-ajar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Pencil,
  RotateCcw,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StokBahanAjar() {
  const { toast } = useToast();
  const [dataList, setDataList] = useState<BahanAjar[]>(bahanAjarData);

  // Filter states
  const [filterUpbjj, setFilterUpbjj] = useState<string>("all");
  const [filterKategori, setFilterKategori] = useState<string>("all");
  const [filterReorder, setFilterReorder] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sort state
  const [sortBy, setSortBy] = useState<string>("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BahanAjar | null>(null);
  const [editForm, setEditForm] = useState<Partial<BahanAjar>>({});

  // Add dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState<Partial<BahanAjar>>({
    kode: "",
    judul: "",
    kategori: "",
    upbjj: "",
    lokasiRak: "",
    qty: 0,
    safety: 0,
    harga: 0,
    catatanHTML: "",
  });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  // Dependent options: kategori list based on selected upbjj
  const availableKategoriList = useMemo(() => {
    if (filterUpbjj === "all") {
      // Show all unique kategori
      const allKategori = new Set<string>();
      upbjjList.forEach((u) => u.kategoriList.forEach((k) => allKategori.add(k)));
      return Array.from(allKategori).sort();
    }
    const upbjj = upbjjList.find((u) => u.kode === filterUpbjj);
    return upbjj ? upbjj.kategoriList : [];
  }, [filterUpbjj]);

  // Reset kategori when upbjj changes
  const handleUpbjjFilterChange = useCallback(
    (value: string) => {
      setFilterUpbjj(value);
      setFilterKategori("all");
    },
    []
  );

  // Filtered and sorted data (memoized - equivalent to Vue computed)
  const filteredData = useMemo(() => {
    let result = [...dataList];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.kode.toLowerCase().includes(q) ||
          item.judul.toLowerCase().includes(q) ||
          item.lokasiRak.toLowerCase().includes(q)
      );
    }

    // Filter by UT-Daerah
    if (filterUpbjj !== "all") {
      result = result.filter((item) => item.upbjj === filterUpbjj);
    }

    // Filter by Kategori (dependent on upbjj)
    if (filterKategori !== "all") {
      result = result.filter((item) => item.kategori === filterKategori);
    }

    // Filter for re-order (qty < safety or qty === 0)
    if (filterReorder) {
      result = result.filter((item) => item.qty < item.safety || item.qty === 0);
    }

    // Sort
    if (sortBy !== "none") {
      result.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case "judul":
            comparison = a.judul.localeCompare(b.judul);
            break;
          case "stock":
            comparison = a.qty - b.qty;
            break;
          case "harga":
            comparison = a.harga - b.harga;
            break;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [dataList, filterUpbjj, filterKategori, filterReorder, searchQuery, sortBy, sortOrder]);

  // Stats
  const stats = useMemo(() => {
    const aman = dataList.filter((d) => d.qty >= d.safety && d.qty > 0).length;
    const menipis = dataList.filter((d) => d.qty < d.safety && d.qty > 0).length;
    const kosong = dataList.filter((d) => d.qty === 0).length;
    return { aman, menipis, kosong, total: dataList.length };
  }, [dataList]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setFilterUpbjj("all");
    setFilterKategori("all");
    setFilterReorder(false);
    setSearchQuery("");
    setSortBy("none");
    setSortOrder("asc");
  }, []);

  // Edit handler
  const handleEdit = useCallback((item: BahanAjar) => {
    setEditingItem(item);
    setEditForm({ ...item });
    setEditDialogOpen(true);
  }, []);

  const handleEditSave = useCallback(() => {
    if (!editingItem) return;
    setDataList((prev) =>
      prev.map((item) =>
        item.id === editingItem.id ? { ...item, ...editForm } as BahanAjar : item
      )
    );
    setEditDialogOpen(false);
    setEditingItem(null);
    setEditForm({});
    toast({
      title: "Berhasil",
      description: "Data bahan ajar berhasil diperbarui",
    });
  }, [editingItem, editForm, toast]);

  // Add handler
  const validateAddForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!addForm.kode?.trim()) errors.kode = "Kode MK wajib diisi";
    if (!addForm.judul?.trim()) errors.judul = "Judul wajib diisi";
    if (!addForm.kategori?.trim()) errors.kategori = "Kategori wajib diisi";
    if (!addForm.upbjj?.trim()) errors.upbjj = "UT-Daerah wajib diisi";
    if (!addForm.lokasiRak?.trim()) errors.lokasiRak = "Lokasi Rak wajib diisi";
    if (addForm.qty === undefined || addForm.qty < 0) errors.qty = "Qty harus >= 0";
    if (addForm.safety === undefined || addForm.safety < 0) errors.safety = "Safety harus >= 0";
    if (addForm.harga === undefined || addForm.harga < 0) errors.harga = "Harga harus >= 0";
    setAddErrors(errors);
    return Object.keys(errors).length === 0;
  }, [addForm]);

  const handleAddSave = useCallback(() => {
    if (!validateAddForm()) return;
    const newItem: BahanAjar = {
      id: `ba-${Date.now()}`,
      kode: addForm.kode || "",
      judul: addForm.judul || "",
      kategori: addForm.kategori || "",
      upbjj: addForm.upbjj || "",
      lokasiRak: addForm.lokasiRak || "",
      qty: addForm.qty || 0,
      safety: addForm.safety || 0,
      harga: addForm.harga || 0,
      catatanHTML: addForm.catatanHTML || "",
    };
    setDataList((prev) => [...prev, newItem]);
    setAddDialogOpen(false);
    setAddForm({
      kode: "",
      judul: "",
      kategori: "",
      upbjj: "",
      lokasiRak: "",
      qty: 0,
      safety: 0,
      harga: 0,
      catatanHTML: "",
    });
    setAddErrors({});
    toast({
      title: "Berhasil",
      description: "Bahan ajar baru berhasil ditambahkan",
    });
  }, [addForm, validateAddForm, toast]);

  // Format currency
  const formatRupiah = useCallback((amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Total Bahan Ajar</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <ShieldCheck className="size-4" />
            Aman
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.aman}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <AlertTriangle className="size-4" />
            Menipis
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.menipis}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-red-600">
            <XCircle className="size-4" />
            Kosong
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.kosong}</div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Filter className="size-4" />
          Filter & Urutkan
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-1.5">
            <Label className="text-xs">Cari Kode/Judul</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari bahan ajar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>

          {/* UT-Daerah Filter */}
          <div className="space-y-1.5">
            <Label className="text-xs">UT-Daerah</Label>
            <Select value={filterUpbjj} onValueChange={handleUpbjjFilterChange}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Semua UT-Daerah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua UT-Daerah</SelectItem>
                {upbjjList.map((u) => (
                  <SelectItem key={u.kode} value={u.kode}>
                    {u.kode} - {u.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kategori Filter (dependent on UT-Daerah) */}
          <div className="space-y-1.5">
            <Label className="text-xs">Kategori Mata Kuliah</Label>
            <Select value={filterKategori} onValueChange={setFilterKategori}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {availableKategoriList.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Re-order Filter */}
          <div className="space-y-1.5">
            <Label className="text-xs">Filter Re-Order</Label>
            <Button
              variant={filterReorder ? "destructive" : "outline"}
              size="sm"
              className="w-full h-9"
              onClick={() => setFilterReorder(!filterReorder)}
            >
              <AlertTriangle className="size-4 mr-1" />
              {filterReorder ? "Aktif: Stok Rendah" : "Tampilkan Stok Rendah"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          {/* Sort By */}
          <div className="space-y-1.5">
            <Label className="text-xs">Urutkan Berdasarkan</Label>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue placeholder="Tidak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak Diurutkan</SelectItem>
                  <SelectItem value="judul">Judul</SelectItem>
                  <SelectItem value="stock">Stok</SelectItem>
                  <SelectItem value="harga">Harga</SelectItem>
                </SelectContent>
              </Select>
              {sortBy !== "none" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  <ArrowUpDown className="size-4 mr-1" />
                  {sortOrder === "asc" ? "Naik" : "Turun"}
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" className="h-9" onClick={handleResetFilters}>
              <RotateCcw className="size-4 mr-1" />
              Reset Filter
            </Button>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9">
                  <Plus className="size-4 mr-1" />
                  Tambah Bahan Ajar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Bahan Ajar Baru</DialogTitle>
                  <DialogDescription>
                    Isi formulir berikut untuk menambahkan data bahan ajar baru.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Kode MK</Label>
                    <div className="col-span-3">
                      <Input
                        value={addForm.kode || ""}
                        onChange={(e) => setAddForm({ ...addForm, kode: e.target.value })}
                        placeholder="Contoh: EKMA4116"
                      />
                      {addErrors.kode && (
                        <p className="text-xs text-red-500 mt-1">{addErrors.kode}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Judul</Label>
                    <div className="col-span-3">
                      <Input
                        value={addForm.judul || ""}
                        onChange={(e) => setAddForm({ ...addForm, judul: e.target.value })}
                        placeholder="Nama mata kuliah"
                      />
                      {addErrors.judul && (
                        <p className="text-xs text-red-500 mt-1">{addErrors.judul}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Kategori</Label>
                    <div className="col-span-3">
                      <Select
                        value={addForm.kategori || ""}
                        onValueChange={(val) => setAddForm({ ...addForm, kategori: val })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {(() => {
                            const allKategori = new Set<string>();
                            upbjjList.forEach((u) =>
                              u.kategoriList.forEach((k) => allKategori.add(k))
                            );
                            return Array.from(allKategori).map((k) => (
                              <SelectItem key={k} value={k}>
                                {k}
                              </SelectItem>
                            ));
                          })()}
                        </SelectContent>
                      </Select>
                      {addErrors.kategori && (
                        <p className="text-xs text-red-500 mt-1">{addErrors.kategori}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">UT-Daerah</Label>
                    <div className="col-span-3">
                      <Select
                        value={addForm.upbjj || ""}
                        onValueChange={(val) => setAddForm({ ...addForm, upbjj: val })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih UT-Daerah" />
                        </SelectTrigger>
                        <SelectContent>
                          {upbjjList.map((u) => (
                            <SelectItem key={u.kode} value={u.kode}>
                              {u.kode} - {u.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {addErrors.upbjj && (
                        <p className="text-xs text-red-500 mt-1">{addErrors.upbjj}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Lokasi Rak</Label>
                    <div className="col-span-3">
                      <Input
                        value={addForm.lokasiRak || ""}
                        onChange={(e) => setAddForm({ ...addForm, lokasiRak: e.target.value })}
                        placeholder="Contoh: A1-01"
                      />
                      {addErrors.lokasiRak && (
                        <p className="text-xs text-red-500 mt-1">{addErrors.lokasiRak}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Jumlah Stok</Label>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min={0}
                        value={addForm.qty ?? 0}
                        onChange={(e) =>
                          setAddForm({ ...addForm, qty: parseInt(e.target.value) || 0 })
                        }
                      />
                      {addErrors.qty && (
                        <p className="text-xs text-red-500 mt-1">{addErrors.qty}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Safety Stock</Label>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min={0}
                        value={addForm.safety ?? 0}
                        onChange={(e) =>
                          setAddForm({ ...addForm, safety: parseInt(e.target.value) || 0 })
                        }
                      />
                      {addErrors.safety && (
                        <p className="text-xs text-red-500 mt-1">{addErrors.safety}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Harga</Label>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min={0}
                        value={addForm.harga ?? 0}
                        onChange={(e) =>
                          setAddForm({ ...addForm, harga: parseInt(e.target.value) || 0 })
                        }
                      />
                      {addErrors.harga && (
                        <p className="text-xs text-red-500 mt-1">{addErrors.harga}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Catatan</Label>
                    <div className="col-span-3">
                      <Input
                        value={addForm.catatanHTML || ""}
                        onChange={(e) =>
                          setAddForm({ ...addForm, catatanHTML: e.target.value })
                        }
                        placeholder="Catatan (opsional)"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleAddSave}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Menampilkan {filteredData.length} dari {dataList.length} data
        </span>
        {filterReorder && (
          <Badge variant="destructive" className="text-xs">
            Filter: Stok perlu re-order aktif
          </Badge>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">No</TableHead>
                <TableHead>Kode / Nama MK</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>UT-Daerah</TableHead>
                <TableHead>Lokasi Rak</TableHead>
                <TableHead className="text-center">Stok</TableHead>
                <TableHead className="text-center">Safety</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead className="text-center w-16">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    Tidak ada data yang sesuai dengan filter
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => {
                  const status = getStokStatus(item.qty, item.safety);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-center text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.kode}</div>
                          <div className="text-sm text-muted-foreground">{item.judul}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {item.kategori}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.upbjj}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {item.lokasiRak}
                        </code>
                      </TableCell>
                      <TableCell className="text-center font-medium">{item.qty}</TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {item.safety}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${status.color}`}
                        >
                          {status.icon} {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatRupiah(item.harga)}
                      </TableCell>
                      <TableCell>
                        {item.catatanHTML ? (
                          <span
                            className="text-xs"
                            dangerouslySetInnerHTML={{ __html: item.catatanHTML }}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Stok Bahan Ajar</DialogTitle>
            <DialogDescription>
              Perbarui informasi stok bahan ajar {editingItem?.kode} - {editingItem?.judul}
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Kode MK</Label>
                <div className="col-span-3">
                  <Input
                    value={editForm.kode || ""}
                    onChange={(e) => setEditForm({ ...editForm, kode: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Judul</Label>
                <div className="col-span-3">
                  <Input
                    value={editForm.judul || ""}
                    onChange={(e) => setEditForm({ ...editForm, judul: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Kategori</Label>
                <div className="col-span-3">
                  <Select
                    value={editForm.kategori || ""}
                    onValueChange={(val) => setEditForm({ ...editForm, kategori: val })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const allKategori = new Set<string>();
                        upbjjList.forEach((u) =>
                          u.kategoriList.forEach((k) => allKategori.add(k))
                        );
                        return Array.from(allKategori).map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">UT-Daerah</Label>
                <div className="col-span-3">
                  <Select
                    value={editForm.upbjj || ""}
                    onValueChange={(val) => setEditForm({ ...editForm, upbjj: val })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih UT-Daerah" />
                    </SelectTrigger>
                    <SelectContent>
                      {upbjjList.map((u) => (
                        <SelectItem key={u.kode} value={u.kode}>
                          {u.kode} - {u.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Lokasi Rak</Label>
                <div className="col-span-3">
                  <Input
                    value={editForm.lokasiRak || ""}
                    onChange={(e) => setEditForm({ ...editForm, lokasiRak: e.target.value })}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Jumlah Stok</Label>
                <div className="col-span-3">
                  <Input
                    type="number"
                    min={0}
                    value={editForm.qty ?? 0}
                    onChange={(e) =>
                      setEditForm({ ...editForm, qty: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Safety Stock</Label>
                <div className="col-span-3">
                  <Input
                    type="number"
                    min={0}
                    value={editForm.safety ?? 0}
                    onChange={(e) =>
                      setEditForm({ ...editForm, safety: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Harga</Label>
                <div className="col-span-3">
                  <Input
                    type="number"
                    min={0}
                    value={editForm.harga ?? 0}
                    onChange={(e) =>
                      setEditForm({ ...editForm, harga: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Catatan</Label>
                <div className="col-span-3">
                  <Input
                    value={editForm.catatanHTML || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, catatanHTML: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* Status Preview */}
              <div className="flex items-center gap-2 px-4">
                <Label className="text-sm">Status Saat Ini:</Label>
                {(() => {
                  const status = getStokStatus(editForm.qty ?? 0, editForm.safety ?? 0);
                  return (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${status.color}`}
                    >
                      {status.icon} {status.label}
                    </span>
                  );
                })()}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditSave}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
