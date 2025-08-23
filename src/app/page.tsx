"use client";
import { SearchBar } from "@/components/SearchBar";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex-1" style={{ background: "var(--bg-gradient)" }}>
      <Hero>
        <SearchBar />
      </Hero>
    </div>
  );
}
