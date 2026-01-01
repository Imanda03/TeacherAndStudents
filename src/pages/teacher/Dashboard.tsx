import { useState } from "react";
import {
  ArrowUpRight,
  Clock,
  TrendingUp,
  CheckCircle,
  FileText,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../../components/common/Card";
import FeatureHeader from "../../components/common/FeatureHeader";
import Modal from "../../components/common/Modal";
import DiagramViewer from "../../components/common/DiagramViewer";
import { useTeacherContext } from "../../contexts/TeacherContext";
import jsonSchemas from "../../utils/jsonSchemas";
import diagramData from "../../utils/diagramData";
import Button from "../../components/common/Button";
import JsonViewer from "../../components/common/JsonViewer";

export default function TeacherDashboard() {
  const { dashboard } = useTeacherContext();
  const [showJson, setShowJson] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);

  const stats = [
    {
      label: "Total Students",
      value: dashboard.stats.totalStudents,
      trend: dashboard.stats.trend.students,
    },
    {
      label: "Pending Assignments",
      value: dashboard.stats.pendingAssignments,
      trend: dashboard.stats.trend.assignments,
    },
    {
      label: "Pending Posts",
      value: dashboard.stats.pendingPosts,
      trend: dashboard.stats.trend.posts,
    },
    {
      label: "Active Classes",
      value: dashboard.stats.activeClasses,
      trend: "+1",
    },
  ];

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Teacher Dashboard"
        description="Overview of your teaching activities and class health."
        onShowJson={() => setShowJson(true)}
        onShowDiagram={() => setShowDiagram(true)}
        additionalActions={<Button variant="secondary">Refresh</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <TrendingUp className="h-4 w-4 text-primary-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {stat.value}
            </p>
            <p className="text-xs text-green-600">{stat.trend}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Class Performance
            </h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.performance}>
                <XAxis
                  dataKey="class"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar
                  dataKey="averageScore"
                  fill="#3B82F6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Upcoming Deadlines
          </h3>
          <div className="mt-3 space-y-3">
            {dashboard.deadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <p className="text-sm font-semibold text-gray-900">
                  {deadline.title}
                </p>
                <p className="text-xs text-gray-500">
                  Due {new Date(deadline.dueDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-orange-600">
                  Pending: {deadline.pendingSubmissions}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <ArrowUpRight className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-3 space-y-3">
            {dashboard.activity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 px-3 py-2"
              >
                <CheckCircle className="h-5 w-5 text-primary-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
            <FileText className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              "Create Assignment",
              "New Lesson",
              "Approve Posts",
              "Message Students",
            ].map((action) => (
              <button
                key={action}
                className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-800 transition hover:-translate-y-0.5 hover:bg-white hover:shadow"
              >
                {action}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        open={showJson}
        onClose={() => setShowJson(false)}
        title="Teacher Dashboard JSON"
        description="Schema, samples, and API contract"
        wide
      >
        <JsonViewer
          jsonData={{
            schema: jsonSchemas.teacherDashboard.schema,
            example: jsonSchemas.teacherDashboard.example,
            apiRequest: jsonSchemas.teacherDashboard.apiRequest,
            apiResponse: jsonSchemas.teacherDashboard.apiResponse,
          }}
          title={jsonSchemas.teacherDashboard.title}
          description={jsonSchemas.teacherDashboard.description}
          onClose={() => setShowJson(false)}
        />
      </Modal>

      <Modal
        open={showDiagram}
        onClose={() => setShowDiagram(false)}
        title="Teacher Dashboard Diagram"
        description="Data flow and navigation"
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
