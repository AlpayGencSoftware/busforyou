"use client";
import Link from "next/link";
import { Home, TicketCheck, CreditCard, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/inquiry", icon: TicketCheck, label: "Trips" },
  { href: "/payment", icon: CreditCard, label: "Pay" },
  { href: "/login", icon: UserRound, label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white shadow-lg rounded-2xl px-4 py-2 border">
      <ul className="flex items-center justify-between">
        {items.map((it) => {
          const ActiveIcon = it.icon;
          const active = pathname === it.href;
          return (
            <li key={it.href}>
              <Link href={it.href} className={`flex flex-col items-center text-xs ${active ? "text-black" : "text-gray-500"}`}>
                <ActiveIcon size={20} />
                <span className="mt-1">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


