type Props = {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      {label && <span className="font-medium text-gray-900">{label}</span>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[140px] w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-500"
      />
      <span className="text-xs text-gray-500">
        Lightweight placeholder editor. Swap with full WYSIWYG as needed.
      </span>
    </label>
  );
}
