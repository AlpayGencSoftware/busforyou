import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  width?: number;
  height?: number;
  showText?: boolean;
};

export function Logo({ width = 80, height = 72, showText = true }: LogoProps) {
  return (
    <Link href="/" aria-label="Ana sayfa" className="flex items-center gap-2">
      <Image src="/Logo.svg" alt="bus4you logo" width={width} height={height} priority />
      {showText && (
        <span className="flex items-end gap-1 leading-none text-gray-900">
          <span className="text-xl md:text-4xl font-semibold text-brand-600">bus</span>
          <span className="text-2xl md:text-5xl font-extrabold">4</span>
          <span className="text-xl md:text-4xl font-semibold text-brand-600">you</span>
        </span>
      )}
    </Link>
  );
}


