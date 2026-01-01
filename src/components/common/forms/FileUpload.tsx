import type { ChangeEvent } from "react";
import { Upload } from "lucide-react";

export default function FileUpload({
  label,
  onFiles,
}: {
  label?: string;
  onFiles: (files: FileList) => void;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) onFiles(event.target.files);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
      {label && <p className="text-sm font-semibold text-gray-900">{label}</p>}
      <Upload className="mx-auto h-8 w-8 text-primary-500" />
      <p className="text-xs text-gray-500">
        Drag & drop coming soon. Use the picker for now.
      </p>
      <label className="mx-auto cursor-pointer rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-600">
        Choose files
        <input
          type="file"
          className="hidden"
          multiple
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
