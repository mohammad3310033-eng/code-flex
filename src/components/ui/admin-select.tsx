"use client";

import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type AdminSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type AdminSelectProps = {
  id?: string;
  name: string;
  options: AdminSelectOption[];
  placeholder: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  dir?: "ltr" | "rtl" | "auto";
  "aria-label"?: string;
  "aria-describedby"?: string;
  "data-field"?: string;
};

export function AdminSelect({
  id,
  name,
  options,
  placeholder,
  value,
  defaultValue = "",
  onValueChange,
  required,
  allowClear,
  disabled,
  invalid,
  className,
  dir,
  ...props
}: AdminSelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;

  return (
    <Select.Root
      id={id}
      name={name}
      value={selectedValue || null}
      required={required}
      disabled={disabled}
      items={options.map(({ value: optionValue, label }) => ({ value: optionValue, label }))}
      onValueChange={(nextValue) => {
        const normalizedValue = typeof nextValue === "string" ? nextValue : "";
        if (value === undefined) setUncontrolledValue(normalizedValue);
        onValueChange?.(normalizedValue);
      }}
    >
      <Select.Trigger
        {...props}
        dir={dir}
        aria-invalid={invalid || undefined}
        className={cn(
          "font-latin mt-2 flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-black/12 bg-white px-3 text-start text-sm font-medium text-foreground outline-none transition-colors hover:border-black/20 data-[placeholder]:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60",
          invalid && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15",
          className,
        )}
      >
        <Select.Value className="min-w-0 flex-1 truncate" placeholder={placeholder} />
        <Select.Icon className="shrink-0 text-muted-foreground">
          <ChevronDown className="size-4" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={6} align="start" className="z-[70] outline-none">
          <Select.Popup dir={dir} className="min-w-[var(--anchor-width)] max-w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-black/12 bg-white text-foreground shadow-xl shadow-black/12 outline-none">
            <Select.List className="max-h-72 overflow-y-auto overscroll-contain p-1">
              {allowClear && (
                <Select.Item
                  value={null}
                  className="flex min-w-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground outline-none select-none data-[highlighted]:bg-[#4c57cd]/8 data-[highlighted]:text-foreground"
                >
                  <span className="size-4 shrink-0" />
                  <Select.ItemText className="min-w-0 flex-1 text-start">{placeholder}</Select.ItemText>
                </Select.Item>
              )}
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="group flex min-w-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground outline-none select-none data-[highlighted]:bg-[#4c57cd]/8 data-[highlighted]:text-foreground data-[selected]:bg-[#4c57cd]/12 data-[selected]:text-[#343e9e] data-[selected]:data-[highlighted]:bg-[#4c57cd]/18 data-[selected]:data-[highlighted]:text-[#29328c] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                >
                  <Select.ItemIndicator className="grid size-4 shrink-0 place-items-center text-[#4c57cd]">
                    <Check className="size-3.5" aria-hidden="true" />
                  </Select.ItemIndicator>
                  <Select.ItemText className="min-w-0 flex-1 text-start">{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
