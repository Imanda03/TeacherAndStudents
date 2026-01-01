import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: Array<{ label: string; value: string }>;
};

export default function Select({
  label,
  error,
  options,
  className,
  ...rest
}: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      {label && <span className="font-medium text-gray-900">{label}</span>}
      <select
        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-500 ${
          className ?? ""
        }`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
