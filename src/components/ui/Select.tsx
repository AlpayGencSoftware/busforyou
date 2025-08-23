"use client";
import { useFormikContext } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "@/store";
import { updateSearchField } from "@/store/slices/searchSlice";


type Option = {
  label: string;
  value: string;
};

type FormikSelectProps = {
  name: string;
  options: Array<string | Option>;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  className?: string;
};

function normalize(options: Array<string | Option>): Option[] {
  return options.map((o) => (typeof o === "string" ? { label: o, value: o } : o));
}

export function FormikSelect({ name, options, placeholder = "Select...", leftIcon, className }: FormikSelectProps) {
  const { setFieldValue, values, setFieldTouched } = useFormikContext<Record<string, string>>();
  const dispatch = useAppDispatch();
  const current: string = (values?.[name] as string) ?? "";
  const list = useMemo(() => normalize(options), [options]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selectedLabel = list.find((o) => o.value === current)?.label || "";

  return (
    <div className="relative h-10" ref={ref}>
      {/* button */}
      <button
        type="button"
        onClick={() => {
          setOpen((s) => !s);
          setFieldTouched(name, true);
        }}
        className={className || "w-full h-10 text-left bg-gray-50 border-0 rounded-xl pl-7 pr-8 text-sm flex items-center hover:bg-gray-100 transition-colors"}
      >
        {leftIcon && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">{leftIcon}</span>
        )}
        <span className={`truncate ${selectedLabel ? "text-gray-900" : "text-gray-400"}`}>
          {selectedLabel || placeholder}
        </span>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </span>
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute z-[1000] top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {list.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => {
                setFieldValue(name, o.value);
                setFieldTouched(name, true);
                
                // Redux store'u güncelle
                dispatch(updateSearchField({ field: name as "fromCity" | "toCity" | "date", value: o.value }));
                
                // Origin değiştiğinde destination'ı temizle
                if (name === "fromCity" && values.toCity === o.value) {
                  setFieldValue("toCity", "");
                  dispatch(updateSearchField({ field: "toCity", value: "" }));
                }
                
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                current === o.value ? "bg-blue-50 text-blue-700" : "text-gray-700"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


