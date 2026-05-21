"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StokBahanAjar from "@/components/stok-bahan-ajar";
import TrackingDO from "@/components/tracking-do";
import { BookOpen, Truck, GraduationCap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [activeTab, setActiveTab] = useState("stok");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold tracking-tight">
                Pemesanan Bahan Ajar
              </h1>
              <p className="text-sm text-muted-foreground">
                Universitas Terbuka — Sistem Manajemen Bahan Ajar
              </p>
            </div>
            <a href="/api/download">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="size-4" />
                Download Source Code
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="stok" className="gap-2">
              <BookOpen className="size-4" />
              Stok Bahan Ajar
            </TabsTrigger>
            <TabsTrigger value="tracking" className="gap-2">
              <Truck className="size-4" />
              Tracking Delivery Order
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stok">
            <StokBahanAjar />
          </TabsContent>

          <TabsContent value="tracking">
            <TrackingDO />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Universitas Terbuka — Sistem Pemesanan Bahan Ajar
            </p>
            <p>
              Tugas Praktik 2 — Framework Vue.js (Implementasi React/Next.js)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
