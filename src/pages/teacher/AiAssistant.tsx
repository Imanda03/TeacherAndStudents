import { useState } from "react";
import { MessageSquareMore, Send, LifeBuoy } from "lucide-react";
import FeatureHeader from "../../components/common/FeatureHeader";
import Modal from "../../components/common/Modal";
import DiagramViewer from "../../components/common/DiagramViewer";
import jsonSchemas from "../../utils/jsonSchemas";
import diagramData from "../../utils/diagramData";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/forms/Input";
import JsonViewer from "../../components/common/JsonViewer";

const quickQuestions = [
  "How do I create a lesson?",
  "Show me assignment steps",
  "Where are student notes?",
];

export default function AiAssistant() {
  const [showJson, setShowJson] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="AI Assistant"
        description="Guides, FAQs, tutorials, and support tickets."
        onShowJson={() => setShowJson(true)}
        onShowDiagram={() => setShowDiagram(true)}
        additionalActions={<LifeBuoy className="h-4 w-4 text-primary-500" />}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Suggested Questions
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <span
                key={q}
                className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700"
              >
                {q}
              </span>
            ))}
          </div>
        </Card>
        <Card className="flex h-full flex-col p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageSquareMore className="h-4 w-4" />
            <span>Chat channel</span>
          </div>
          <div className="mt-3 flex-1 space-y-3 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm text-gray-800">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="font-semibold text-gray-900">Assistant</p>
              <p className="text-sm text-gray-700">
                Ask me anything about lessons, assignments, or policies.
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question..."
              className="flex-1"
            />
            <Button variant="primary" icon={<Send className="h-4 w-4" />}>
              Send
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        open={showJson}
        onClose={() => setShowJson(false)}
        title="AI Assistant JSON"
        description="Help content schema"
        wide
      >
        <JsonViewer
          jsonData={{
            schema: jsonSchemas.aiAssistant.schema,
            example: jsonSchemas.aiAssistant.example,
            apiRequest: jsonSchemas.aiAssistant.apiRequest,
            apiResponse: jsonSchemas.aiAssistant.apiResponse,
          }}
          title={jsonSchemas.aiAssistant.title}
          description={jsonSchemas.aiAssistant.description}
          onClose={() => setShowJson(false)}
        />
      </Modal>

      <Modal
        open={showDiagram}
        onClose={() => setShowDiagram(false)}
        title="AI Assistant Diagram"
        description="Architecture"
        wide
      >
        <DiagramViewer
          diagramType="flowchart"
          diagramData={diagramData.teacherDashboard}
          title={diagramData.teacherDashboard.title}
          description={diagramData.teacherDashboard.description}
          onClose={() => setShowDiagram(false)}
        />
      </Modal>
    </div>
  );
}
