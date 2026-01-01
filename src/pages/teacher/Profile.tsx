import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import Card from "../../components/common/Card";
import FeatureHeader from "../../components/common/FeatureHeader";
import Modal from "../../components/common/Modal";
import DiagramViewer from "../../components/common/DiagramViewer";
import jsonSchemas from "../../utils/jsonSchemas";
import diagramData from "../../utils/diagramData";
import Input from "../../components/common/forms/Input";
import Button from "../../components/common/Button";
import JsonViewer from "../../components/common/JsonViewer";

export default function TeacherProfile() {
  const [showJson, setShowJson] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Teacher Profile"
        description="Manage your personal and professional details."
        onShowJson={() => setShowJson(true)}
        onShowDiagram={() => setShowDiagram(true)}
        additionalActions={<ShieldCheck className="h-4 w-4 text-primary-500" />}
      />

      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Info</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label="First Name" defaultValue="Jane" />
          <Input label="Last Name" defaultValue="Smith" />
          <Input label="Email" defaultValue="jane.smith@school.edu" />
          <Input label="Phone" defaultValue="+1234567890" />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="primary">Save Changes</Button>
        </div>
      </Card>

      <Modal
        open={showJson}
        onClose={() => setShowJson(false)}
        title="Profile JSON"
        description="Profile schema"
        wide
      >
        <JsonViewer
          jsonData={{
            schema: jsonSchemas.teacherProfile.schema,
            example: jsonSchemas.teacherProfile.example,
            apiRequest: jsonSchemas.teacherProfile.apiRequest,
            apiResponse: jsonSchemas.teacherProfile.apiResponse,
          }}
          title={jsonSchemas.teacherProfile.title}
          description={jsonSchemas.teacherProfile.description}
          onClose={() => setShowJson(false)}
        />
      </Modal>

      <Modal
        open={showDiagram}
        onClose={() => setShowDiagram(false)}
        title="Profile Diagram"
        description="Edit and security flow"
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
