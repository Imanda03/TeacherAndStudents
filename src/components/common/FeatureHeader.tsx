import type { ReactNode } from "react";
import Button from "./Button";
import { FileJson, Network } from "lucide-react";

type FeatureHeaderProps = {
  title: string;
  description?: string;
  showJsonButton?: boolean;
  showDiagramButton?: boolean;
  onShowJson?: () => void;
  onShowDiagram?: () => void;
  additionalActions?: ReactNode;
};

export default function FeatureHeader({
  title,
  description,
  showJsonButton = true,
  showDiagramButton = true,
  onShowJson,
  onShowDiagram,
  additionalActions,
}: FeatureHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {additionalActions}
        {showJsonButton && (
          <Button
            variant="secondary"
            onClick={onShowJson}
            className="shadow-sm"
          >
            <FileJson className="h-4 w-4" /> Show JSON
          </Button>
        )}
        {showDiagramButton && (
          <Button
            variant="primary"
            onClick={onShowDiagram}
            className="shadow-sm"
          >
            <Network className="h-4 w-4" /> Show Diagram
          </Button>
        )}
      </div>
    </div>
  );
}
