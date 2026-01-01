import { useMemo, useState } from "react";
import {
  Highlight,
  themes,
  type Language,
  type PrismTheme,
} from "prism-react-renderer";
import { Copy, Download, Moon, Search, Sun, FileJson } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import Button from "./Button";

export type JsonViewerProps = {
  jsonData: Record<string, unknown>;
  title: string;
  description: string;
  onClose: () => void;
};

type TabKey = "schema" | "example" | "apiRequest" | "apiResponse";

export default function JsonViewer({
  jsonData,
  title,
  description,
  onClose,
}: JsonViewerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("schema");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const toast = useToast();

  const activeData = useMemo(
    () => jsonData[activeTab] ?? {},
    [activeTab, jsonData]
  );
  const pretty = useMemo(
    () => JSON.stringify(activeData, null, 2),
    [activeData]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pretty);
      toast.success("JSON copied");
    } catch (error) {
      console.error(error);
      toast.error("Copy failed");
    }
  };

  const handleExport = () => {
    const blob = new Blob([pretty], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON exported");
  };

  const theme = dark ? themes.vsDark : themes.vsLight;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => setDark((d) => !d)}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" className="p-2" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["schema", "Schema"],
            ["example", "Example Data"],
            ["apiRequest", "API Request"],
            ["apiResponse", "API Response"],
          ] as Array<[TabKey, string]>
        ).map(([key, label]) => (
          <Button
            key={key}
            variant={activeTab === key ? "primary" : "secondary"}
            onClick={() => setActiveTab(key)}
            className="text-sm"
          >
            {label}
          </Button>
        ))}
        <div className="relative ml-auto w-full max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search within JSON"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <Button
          variant="secondary"
          onClick={handleCopy}
          icon={<Copy className="h-4 w-4" />}
        >
          Copy
        </Button>
        <Button
          variant="secondary"
          onClick={handleExport}
          icon={<Download className="h-4 w-4" />}
        >
          Export JSON
        </Button>
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
        {Object.entries(activeData as Record<string, unknown>).map(
          ([key, value]) => (
            <details key={key} open className="rounded-lg bg-white shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between border-b border-gray-100 px-4 py-2 text-sm font-semibold text-gray-800">
                <span className="inline-flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-primary-500" /> {key}
                </span>
                <span className="text-xs text-gray-500">Toggle</span>
              </summary>
              <div className="overflow-auto px-2 py-3">
                <CodeBlock
                  code={JSON.stringify({ [key]: value }, null, 2)}
                  theme={theme}
                  search={search}
                />
              </div>
            </details>
          )
        )}
        {Object.keys(activeData as Record<string, unknown>).length === 0 && (
          <CodeBlock code={pretty} theme={theme} search={search} />
        )}
      </div>
    </div>
  );
}

type CodeBlockProps = {
  code: string;
  theme: PrismTheme;
  search: string;
};

function CodeBlock({ code, theme, search }: CodeBlockProps) {
  const lines = useMemo(() => code.split("\n"), [code]);
  const filtered = useMemo(() => {
    if (!search) return lines;
    const term = search.toLowerCase();
    return lines.filter((line) => line.toLowerCase().includes(term));
  }, [lines, search]);

  const language: Language = "json";

  return (
    <div className="relative">
      <Highlight code={filtered.join("\n")} language={language} theme={theme}>
        {({ className, style, tokens, getTokenProps }) => (
          <pre
            className={`${className} rounded-lg text-sm`}
            style={{ ...style, padding: "16px" }}
          >
            {tokens.map((line, i) => (
              <div
                key={i}
                className="grid grid-cols-[40px_1fr] items-start gap-3"
              >
                <span className="select-none text-right text-xs text-gray-400">
                  {i + 1}
                </span>
                <span className="block whitespace-pre break-words">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
