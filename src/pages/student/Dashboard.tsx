import { Trophy, Clock } from "lucide-react";
import FeatureHeader from "../../components/common/FeatureHeader";
import Card from "../../components/common/Card";
import { useStudentContext } from "../../contexts/StudentContext";
import Table from "../../components/common/Table";

export default function StudentDashboard() {
  const { dashboard } = useStudentContext();

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Student Dashboard"
        description="Upcoming work, lessons, performance, and friends."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Upcoming assignments</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {dashboard.upcomingAssignments.length}
          </p>
          <Clock className="mt-2 h-5 w-5 text-primary-500" />
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Recent lessons</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {dashboard.recentLessons.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Overall score</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">85.5</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Leaderboard rank</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">5</p>
          <Trophy className="mt-2 h-5 w-5 text-amber-500" />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Upcoming Assignments
          </h3>
          <Table
            data={dashboard.upcomingAssignments}
            columns={[
              { key: "title", header: "Title" },
              { key: "subject", header: "Subject" },
              {
                key: "dueDate",
                header: "Due",
                render: (value) => (
                  <span className="text-sm text-gray-700">
                    {new Date(value as string).toLocaleDateString()}
                  </span>
                ),
              },
              { key: "status", header: "Status" },
            ]}
          />
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Lessons
          </h3>
          <Table
            data={dashboard.recentLessons}
            columns={[
              { key: "subject", header: "Subject" },
              { key: "chapter", header: "Chapter" },
              {
                key: "progress",
                header: "Progress",
                render: (value) => (
                  <span className="text-sm font-semibold text-primary-700">
                    {value}%
                  </span>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
