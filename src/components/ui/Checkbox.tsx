import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Checkbox({ label, ...rest }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input type="checkbox" className="accent-brand-500 w-4 h-4 rounded" {...rest} />
      {label}
    </label>
  );
}


