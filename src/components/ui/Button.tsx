import clsx from "clsx";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  const base = "rounded-2xl px-4 py-3 text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-black/10";
  const styles =
    variant === "primary"
      ? "bg-brand-500 text-black hover:bg-brand-400 active:bg-brand-600"
      : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50";
  return (
    <button className={clsx(base, styles, className)} {...rest}>
      {children}
    </button>
  );
}


