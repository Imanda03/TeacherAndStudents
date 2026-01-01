import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className,
  ...rest
}: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      {label && <span className="font-medium text-gray-900">{label}</span>}
      <input
        className={`w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-500 ${
          className ?? ""
        }`}
        {...rest}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
