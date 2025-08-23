import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/app/providers";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Bus4You - Otobüs Bilet Satış Platformu",
  description: "Türkiye'nin güvenilir otobüs bilet satış platformu. Online bilet al, koltuğunu seç, güvenle seyahat et.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        suppressHydrationWarning
        className={`${roboto.variable} antialiased min-h-screen flex flex-col`}
      >
        <AppProviders>
          <Header />
          <main className="flex-1 md:pb-0 sm:pb-0">{children}</main>
          <Footer />
          {/* <MobileNav /> */}
        </AppProviders>
      </body>
    </html>
  );
}
