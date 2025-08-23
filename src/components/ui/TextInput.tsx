import clsx from "clsx";
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  rightIcon?: React.ReactNode;
};

export function TextInput({ label, hint, rightIcon, className, ...rest }: Props) {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs text-gray-700">{label}</label>}
      <div className="relative">
        <input
          className={clsx(
            "w-full rounded-2xl bg-white border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400",
            className
          )}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{rightIcon}</div>
        )}
      </div>
      {hint && <div className="text-[0.6875rem] text-gray-500">{hint}</div>}
    </div>
  );}


