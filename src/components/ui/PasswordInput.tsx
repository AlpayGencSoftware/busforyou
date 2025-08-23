"use client";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { TextInput } from "./TextInput";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function PasswordInput({ label, ...rest }: Props) {
  const [show, setShow] = useState(false);
  return (
    <TextInput
      label={label}
      type={show ? "text" : "password"}
      rightIcon={
        <button type="button" onClick={() => setShow((s) => !s)} aria-label="toggle password">
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      }
      {...rest}
    />
  );
}


