"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  trackingDOData,
  upbjjList,
  paketList,
  generateDONumber,
  type TrackingDO,
  type PaketBahanAjar,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Send,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TrackingDO() {
  const { toast } = useToast();
  const [doList, setDoList] = useState<TrackingDO[]>(trackingDOData);

  // Add dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    nim: "",
    nama: "",
    ekspedisi: "",
    upbjj: "",
    paketId: "",
    tanggalKirim: new Date().toISOString().split("T")[0],
  });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  // Auto-generate DO number
  const nextDONumber = useMemo(() => generateDONumber(doList), [doList]);

  // Get available ekspedisi based on selected upbjj
  const availableEkspedisi = useMemo(() => {
    if (!addForm.upbjj) return [];
    const upbjj = upbjjList.find((u) => u.kode === addForm.upbjj);
    return upbjj ? upbjj.ekspedisi : [];
  }, [addForm.upbjj]);

  // Get selected paket detail
  const selectedPaket = useMemo((): PaketBahanAjar | null => {
    if (!addForm.paketId) return null;
    return paketList.find((p) => p.id === addForm.paketId) || null;
  }, [addForm.paketId]);

  // Format currency
  const formatRupiah = useCallback((amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!addForm.nim.trim()) errors.nim = "NIM wajib diisi";
    if (!addForm.nama.trim()) errors.nama = "Nama wajib diisi";
    if (!addForm.upbjj) errors.upbjj = "UT-Daerah wajib dipilih";
    if (!addForm.ekspedisi) errors.ekspedisi = "Ekspedisi wajib dipilih";
    if (!addForm.paketId) errors.paketId = "Paket bahan ajar wajib dipilih";
    if (!addForm.tanggalKirim) errors.tanggalKirim = "Tanggal kirim wajib diisi";
    setAddErrors(errors);
    return Object.keys(errors).length === 0;
  }, [addForm]);

  // Handle add
  const handleAdd = useCallback(() => {
    if (!validateForm()) return;
    const paket = paketList.find((p) => p.id === addForm.paketId);
    if (!paket) return;

    const newDO: TrackingDO = {
      id: `do-${Date.now()}`,
      nomorDO: nextDONumber,
      nim: addForm.nim,
      nama: addForm.nama,
      upbjj: addForm.upbjj,
      ekspedisi: addForm.ekspedisi,
      paketId: addForm.paketId,
      tanggalKirim: addForm.tanggalKirim,
      totalHarga: paket.harga,
      status: "Diproses",
    };

    setDoList((prev) => [...prev, newDO]);
    setAddDialogOpen(false);
    setAddForm({
      nim: "",
      nama: "",
      ekspedisi: "",
      upbjj: "",
      paketId: "",
      tanggalKirim: new Date().toISOString().split("T")[0],
    });
    setAddErrors({});
    toast({
      title: "Berhasil",
      description: `Delivery Order ${nextDONumber} berhasil ditambahkan`,
    });
  }, [addForm, validateForm, nextDONumber, toast]);

  // Update status
  const handleUpdateStatus = useCallback(
    (id: string, newStatus: TrackingDO["status"]) => {
      setDoList((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
      toast({
        title: "Status Diperbarui",
        description: `Status DO berhasil diubah menjadi "${newStatus}"`,
      });
    },
    [toast]
  );

  // Status badge helper
  const getStatusBadge = useCallback((status: TrackingDO["status"]) => {
    switch (status) {
      case "Diproses":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200">
            <Clock className="size-3 mr-1" />
            Diproses
          </Badge>
        );
      case "Dikirim":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200">
            <Send className="size-3 mr-1" />
            Dikirim
          </Badge>
        );
      case "Diterima":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200">
            <CheckCircle2 className="size-3 mr-1" />
            Diterima
          </Badge>
        );
    }
  }, []);

  // Stats
  const stats = useMemo(() => {
    const diproses = doList.filter((d) => d.status === "Diproses").length;
    const dikirim = doList.filter((d) => d.status === "Dikirim").length;
    const diterima = doList.filter((d) => d.status === "Diterima").length;
    return { diproses, dikirim, diterima, total: doList.length };
  }, [doList]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="size-4" />
            Total DO
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-yellow-600">
            <Clock className="size-4" />
            Diproses
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.diproses}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Send className="size-4" />
            Dikirim
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.dikirim}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="size-4" />
            Diterima
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.diterima}</div>
        </div>
      </div>

      {/* Add DO Button */}
      <div className="flex justify-end">
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Tambah Delivery Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Delivery Order Baru</DialogTitle>
              <DialogDescription>
                Isi formulir berikut untuk membuat delivery order bahan ajar baru.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Nomor DO (auto-generated) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nomor DO</Label>
                <div className="col-span-3">
                  <Input value={nextDONumber} readOnly className="bg-muted font-mono" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-generated berdasarkan tahun & sequence
                  </p>
                </div>
              </div>

              <Separator />

              {/* NIM */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">NIM</Label>
                <div className="col-span-3">
                  <Input
                    value={addForm.nim}
                    onChange={(e) => setAddForm({ ...addForm, nim: e.target.value })}
                    placeholder="Masukkan NIM mahasiswa"
                  />
                  {addErrors.nim && (
                    <p className="text-xs text-red-500 mt-1">{addErrors.nim}</p>
                  )}
                </div>
              </div>

              {/* Nama */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nama</Label>
                <div className="col-span-3">
                  <Input
                    value={addForm.nama}
                    onChange={(e) => setAddForm({ ...addForm, nama: e.target.value })}
                    placeholder="Masukkan nama mahasiswa"
                  />
                  {addErrors.nama && (
                    <p className="text-xs text-red-500 mt-1">{addErrors.nama}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* UT-Daerah */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">UT-Daerah</Label>
                <div className="col-span-3">
                  <Select
                    value={addForm.upbjj}
                    onValueChange={(val) =>
                      setAddForm({ ...addForm, upbjj: val, ekspedisi: "" })
                    }
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

              {/* Ekspedisi (dependent on upbjj) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Ekspedisi</Label>
                <div className="col-span-3">
                  <Select
                    value={addForm.ekspedisi}
                    onValueChange={(val) => setAddForm({ ...addForm, ekspedisi: val })}
                    disabled={!addForm.upbjj}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          addForm.upbjj
                            ? "Pilih Ekspedisi"
                            : "Pilih UT-Daerah terlebih dahulu"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEkspedisi.map((eksp) => (
                        <SelectItem key={eksp} value={eksp}>
                          {eksp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {addErrors.ekspedisi && (
                    <p className="text-xs text-red-500 mt-1">{addErrors.ekspedisi}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Paket Bahan Ajar */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Paket Bahan Ajar</Label>
                <div className="col-span-3">
                  <Select
                    value={addForm.paketId}
                    onValueChange={(val) => setAddForm({ ...addForm, paketId: val })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Paket Bahan Ajar" />
                    </SelectTrigger>
                    <SelectContent>
                      {paketList.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.kode} — {p.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {addErrors.paketId && (
                    <p className="text-xs text-red-500 mt-1">{addErrors.paketId}</p>
                  )}

                  {/* Paket Detail */}
                  {selectedPaket && (
                    <Card className="mt-3 border-dashed">
                      <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Package className="size-4" />
                          {selectedPaket.kode} — {selectedPaket.nama}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-3">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground mb-2">
                            Isi Paket Bahan Ajar:
                          </p>
                          {selectedPaket.isi.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <BookOpen className="size-3 text-muted-foreground" />
                              <span className="font-mono text-xs">{item.kode}</span>
                              <span className="text-muted-foreground">—</span>
                              <span>{item.judul}</span>
                            </div>
                          ))}
                          <Separator className="my-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total Harga Paket:</span>
                            <span className="text-sm font-bold text-primary">
                              {formatRupiah(selectedPaket.harga)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <Separator />

              {/* Tanggal Kirim */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Tanggal Kirim</Label>
                <div className="col-span-3">
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={addForm.tanggalKirim}
                      onChange={(e) =>
                        setAddForm({ ...addForm, tanggalKirim: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={() =>
                        setAddForm({
                          ...addForm,
                          tanggalKirim: new Date().toISOString().split("T")[0],
                        })
                      }
                    >
                      <CalendarDays className="size-4 mr-1" />
                      Hari Ini
                    </Button>
                  </div>
                  {addErrors.tanggalKirim && (
                    <p className="text-xs text-red-500 mt-1">{addErrors.tanggalKirim}</p>
                  )}
                </div>
              </div>

              {/* Total Harga Preview */}
              {selectedPaket && (
                <div className="bg-muted rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Harga</p>
                    <p className="text-xs text-muted-foreground">
                      Diambil dari harga paket
                    </p>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatRupiah(selectedPaket.harga)}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAdd}>
                <Truck className="size-4 mr-1" />
                Buat Delivery Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tracking Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">No</TableHead>
                <TableHead>Nomor DO</TableHead>
                <TableHead>NIM / Nama</TableHead>
                <TableHead>UT-Daerah</TableHead>
                <TableHead>Ekspedisi</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Tanggal Kirim</TableHead>
                <TableHead className="text-right">Total Harga</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Belum ada data delivery order
                  </TableCell>
                </TableRow>
              ) : (
                doList.map((item, index) => {
                  const paket = paketList.find((p) => p.id === item.paketId);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-center text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                          {item.nomorDO}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.nim}</div>
                          <div className="text-sm text-muted-foreground">{item.nama}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.upbjj}</TableCell>
                      <TableCell>{item.ekspedisi}</TableCell>
                      <TableCell>
                        {paket ? (
                          <div>
                            <div className="text-xs font-mono">{paket.kode}</div>
                            <div className="text-sm text-muted-foreground">{paket.nama}</div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{item.tanggalKirim}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatRupiah(item.totalHarga)}
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {item.status === "Diproses" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleUpdateStatus(item.id, "Dikirim")}
                            >
                              <Send className="size-3 mr-1" />
                              Kirim
                            </Button>
                          )}
                          {item.status === "Dikirim" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleUpdateStatus(item.id, "Diterima")}
                            >
                              <CheckCircle2 className="size-3 mr-1" />
                              Terima
                            </Button>
                          )}
                          {item.status === "Diterima" && (
                            <span className="text-xs text-green-600">Selesai</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
