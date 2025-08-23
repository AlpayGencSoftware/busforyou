import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-3xl font-bold">Sayfa bulunamadı</h1>
      <p className="text-gray-600">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <Link href="/" className="nav-link text-sm">Ana sayfaya dön</Link>
    </div>
  );
}


