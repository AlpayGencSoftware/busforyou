"use client";
import { SearchBar } from "@/components/SearchBar";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen md:min-h-0" style={{ background: "var(--bg-soft)" }}>
      <Hero
        title="Türkiye'de Ucuz Otobüs Biletleri Bulun"
        subtitle="Bus4You ile bir sonraki yolculuğunuzu kolayca karşılaştırın ve rezerve edin"
      >
        <SearchBar />
      </Hero>
    </div>
  );
}
