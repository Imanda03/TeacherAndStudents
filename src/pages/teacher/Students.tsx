import { useState } from "react";
import { Filter } from "lucide-react";
import Card from "../../components/common/Card";
import FeatureHeader from "../../components/common/FeatureHeader";
import Modal from "../../components/common/Modal";
import DiagramViewer from "../../components/common/DiagramViewer";
import { useTeacherContext } from "../../contexts/TeacherContext";
import jsonSchemas from "../../utils/jsonSchemas";
import diagramData from "../../utils/diagramData";
import Table from "../../components/common/Table";
import Select from "../../components/common/forms/Select";
import JsonViewer from "../../components/common/JsonViewer";

export default function TeacherStudents() {
  const { students } = useTeacherContext();
  const [showJson, setShowJson] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Student Management"
        description="Filter, drill into performance, and capture notes."
        onShowJson={() => setShowJson(true)}
        onShowDiagram={() => setShowDiagram(true)}
        additionalActions={<Filter className="h-4 w-4 text-gray-500" />}
      />

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Select
            label="Class"
            options={students.filters.classes.map((c) => ({
              label: c,
              value: c,
            }))}
            defaultValue={students.filters.classes[0]}
          />
          <Select
            label="Subject"
            options={students.filters.subjects.map((s) => ({
              label: s,
              value: s,
            }))}
            defaultValue={students.filters.subjects[0]}
          />
        </div>
        <div className="mt-4">
          <Table
            data={students.students}
            columns={[
              { key: "name", header: "Student" },
              { key: "rollNumber", header: "Roll" },
              { key: "class", header: "Class" },
              {
                key: "score",
                header: "Score",
                render: (value) => (
                  <span className="font-semibold text-primary-700">
                    {value}%
                  </span>
                ),
              },
              { key: "trend", header: "Trend" },
            ]}
          />
        </div>
      </Card>

      <Modal
        open={showJson}
        onClose={() => setShowJson(false)}
        title="Students JSON"
        description="Schema and samples"
        wide
      >
        <JsonViewer
          jsonData={{
            schema: jsonSchemas.teacherStudents.schema,
            example: jsonSchemas.teacherStudents.example,
            apiRequest: jsonSchemas.teacherStudents.apiRequest,
            apiResponse: jsonSchemas.teacherStudents.apiResponse,
          }}
          title={jsonSchemas.teacherStudents.title}
          description={jsonSchemas.teacherStudents.description}
          onClose={() => setShowJson(false)}
        />
      </Modal>

      <Modal
        open={showDiagram}
        onClose={() => setShowDiagram(false)}
        title="Student Diagram"
        description="Aggregation and notes"
        wide
      >
        <DiagramViewer
          diagramType="flowchart"
          diagramData={diagramData.teacherStudents}
          title={diagramData.teacherStudents.title}
          description={diagramData.teacherStudents.description}
          onClose={() => setShowDiagram(false)}
        />
      </Modal>
    </div>
  );
}
