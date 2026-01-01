import type { ReactNode } from "react";

export type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Array<Column<T>>;
  emptyState?: ReactNode;
};

export default function Table<T>({ data, columns, emptyState }: TableProps<T>) {
  if (!data.length)
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        {emptyState ?? "No data"}
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-4 py-3 text-sm text-gray-800"
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : (row[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
