import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Download,
  Maximize2,
  Minimize2,
  Play,
  RefreshCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Button from "./Button";
import { useToast } from "../../hooks/useToast";

export type DiagramViewerProps = {
  diagramType?: "flowchart" | "sequence" | "mindmap" | "er-diagram";
  diagramData: { nodes: any[]; edges: any[] };
  title: string;
  description: string;
  onClose: () => void;
};

export default function DiagramViewer(props: DiagramViewerProps) {
  return (
    <ReactFlowProvider>
      <DiagramInner {...props} />
    </ReactFlowProvider>
  );
}

function DiagramInner({
  diagramData,
  title,
  description,
  onClose,
}: DiagramViewerProps) {
  const [nodes, , onNodesChange] = useNodesState(diagramData.nodes);
  const [edges, , onEdgesChange] = useEdgesState(diagramData.edges);
  const [walkIndex, setWalkIndex] = useState(0);
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const toast = useToast();

  const highlightedNodes = useMemo(
    () =>
      nodes.map((n, idx) => ({
        ...n,
        className: idx === walkIndex ? "ring-4 ring-primary-300" : "",
      })),
    [nodes, walkIndex]
  );

  const handleExportSvg = useCallback(() => {
    const svg = document.querySelector(".react-flow__renderer svg");
    if (!svg) {
      toast.error("Nothing to export yet");
      return;
    }
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Diagram exported as SVG");
  }, [toast, title]);

  const handleWalk = useCallback(() => {
    setWalkIndex((i) => (i + 1) % Math.max(nodes.length, 1));
    toast.success("Step advanced");
  }, [nodes.length, toast]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => fitView({ padding: 0.2 })}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Fit View
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportSvg}
            icon={<Download className="h-4 w-4" />}
          >
            Export SVG
          </Button>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        <Button variant="ghost" className="p-2" onClick={() => zoomIn()}>
          {" "}
          <ZoomIn className="h-4 w-4" />{" "}
        </Button>
        <Button variant="ghost" className="p-2" onClick={() => zoomOut()}>
          {" "}
          <ZoomOut className="h-4 w-4" />{" "}
        </Button>
        <Button
          variant="ghost"
          className="p-2"
          onClick={() => fitView({ padding: 0.2 })}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-2"
          onClick={() => fitView({ padding: 0.05 })}
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          onClick={handleWalk}
          icon={<Play className="h-4 w-4" />}
        >
          Walkthrough
        </Button>
      </div>

      <div className="h-[520px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
        <ReactFlow
          nodes={highlightedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap zoomable pannable />
          <Controls showInteractive={false} />
          <Background gap={16} color="#E2E8F0" />
        </ReactFlow>
      </div>
    </div>
  );
}
