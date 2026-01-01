import { useState } from "react";
import {
  ClipboardList,
  Play,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Calendar,
  Trophy,
  TrendingUp,
  Eye,
  AlertCircle,
  Save,
} from "lucide-react";
import FeatureHeader from "../../components/common/FeatureHeader";
import Modal from "../../components/common/Modal";
import Card from "../../components/common/Card";
import { useStudentContext } from "../../contexts/StudentContext";
import Button from "../../components/common/Button";
import { studentAssignmentsMock } from "../../utils/mockData";

type Assignment = (typeof studentAssignmentsMock.list)[number];

export default function StudentAssignments() {
  const { assignments: contextAssignments } = useStudentContext();
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Use mock data instead of context
  const assignments = studentAssignmentsMock.list;

  const filteredAssignments = assignments.filter((assignment) => {
    if (filterStatus === "all") return true;
    return assignment?.status === filterStatus;
  });

  const stats = {
    total: assignments.length,
    notStarted: assignments.filter((a) => a?.status === "not_started").length,
    inProgress: assignments.filter((a) => a?.status === "in_progress").length,
    completed: assignments.filter((a) => a?.status === "completed").length,
    averageScore:
      assignments
        .filter((a) => a?.score !== null && a?.score !== undefined)
        .reduce((sum, a) => sum + (a?.score ?? 0), 0) /
        assignments.filter((a) => a?.score !== null && a?.score !== undefined)
          .length || 0,
  };

  const openAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "bg-gray-100 text-gray-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "not_started":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) return "Due Today";
    if (diffInHours < 48) return "Due Tomorrow";
    return `Due ${date.toLocaleDateString()}`;
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== "completed";
  };

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Assignments"
        description="Start, autosave, submit, and review results."
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                Total
              </p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {stats.total}
              </p>
            </div>
            <ClipboardList className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Not Started
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.notStarted}
              </p>
            </div>
            <Clock className="h-8 w-8 text-gray-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                In Progress
              </p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">
                {stats.inProgress}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
                Completed
              </p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {stats.completed}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card className="p-1 bg-gray-100">
        <div className="flex gap-1">
          {[
            { key: "all", label: "All Assignments" },
            { key: "not_started", label: "Not Started" },
            { key: "in_progress", label: "In Progress" },
            { key: "completed", label: "Completed" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterStatus(filter.key)}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterStatus === filter.key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Assignments List */}
      <div className="grid gap-4">
        {filteredAssignments.length === 0 ? (
          <Card className="p-12 text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-gray-900">
              No assignments found
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {filterStatus === "all"
                ? "You don't have any assignments yet"
                : `No ${filterStatus.replace("_", " ")} assignments`}
            </p>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => {
            const overdue = isOverdue(assignment?.dueDate, assignment?.status);
            return (
              <Card
                key={assignment?.id}
                className={`p-6 transition-all hover:shadow-lg ${
                  overdue
                    ? "border-l-4 border-l-red-500 bg-red-50/30"
                    : assignment?.status === "completed"
                    ? "border-l-4 border-l-green-500 bg-green-50/30"
                    : assignment?.status === "in_progress"
                    ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                    : "border-l-4 border-l-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 p-2 rounded-lg ${
                          overdue
                            ? "bg-red-100"
                            : assignment?.status === "completed"
                            ? "bg-green-100"
                            : assignment?.status === "in_progress"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {getStatusIcon(assignment?.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {assignment?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {assignment?.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {assignment?.subject}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(assignment?.dueDate)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {assignment?.totalQuestions ?? 0} questions •{" "}
                            {assignment?.totalPoints ?? 0} points
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        assignment?.status
                      )}`}
                    >
                      {getStatusIcon(assignment?.status)}
                      {assignment?.status
                        ?.replace("_", " ")
                        ?.replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    {assignment?.score !== null &&
                      assignment?.score !== undefined && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Trophy className="h-4 w-4" />
                          <span className="font-bold">
                            {assignment?.score}/{assignment?.totalPoints}
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                {/* Auto-save indicator */}
                {assignment?.autoSaved && assignment?.lastAutoSave && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 bg-gray-50 p-2 rounded">
                    <Save className="h-3 w-3" />
                    <span>
                      Auto-saved on{" "}
                      {new Date(assignment.lastAutoSave).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Feedback */}
                {assignment?.feedback && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 mb-1">
                      Teacher Feedback:
                    </p>
                    <p className="text-sm text-blue-900">
                      {assignment.feedback}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {assignment?.status === "completed" ? (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => openAssignment(assignment)}
                      >
                        View Results
                      </Button>
                    </>
                  ) : assignment?.status === "in_progress" ? (
                    <>
                      <Button
                        variant="primary"
                        className="flex-1"
                        icon={<Play className="h-4 w-4" />}
                        onClick={() => openAssignment(assignment)}
                      >
                        Continue
                      </Button>
                      <Button
                        variant="outline"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => openAssignment(assignment)}
                      >
                        Preview
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      className="flex-1"
                      icon={<Play className="h-4 w-4" />}
                      onClick={() => openAssignment(assignment)}
                    >
                      Start Assignment
                    </Button>
                  )}
                </div>

                {overdue && (
                  <div className="mt-3 flex items-center gap-2 text-red-600 text-sm font-semibold">
                    <XCircle className="h-4 w-4" />
                    <span>This assignment is overdue!</span>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Assignment Detail Modal */}
      <Modal
        open={showAssignmentModal}
        onClose={() => {
          setShowAssignmentModal(false);
          setSelectedAssignment(null);
        }}
        title={selectedAssignment?.title || "Assignment"}
        description={selectedAssignment?.subject || ""}
        wide
      >
        {selectedAssignment && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedAssignment?.totalQuestions ?? 0} Questions
                </p>
                <p className="text-xs text-gray-500">
                  Total Points: {selectedAssignment?.totalPoints ?? 0}
                </p>
              </div>
              {selectedAssignment?.score !== null &&
                selectedAssignment?.score !== undefined && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedAssignment?.score}/
                      {selectedAssignment?.totalPoints}
                    </p>
                    <p className="text-xs text-gray-500">Your Score</p>
                  </div>
                )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Questions:</h4>
              {selectedAssignment?.questions?.map((q: any, index) => (
                <Card key={q?.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {q?.questionText}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium capitalize">
                          {q?.type?.replace("-", " ")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {q?.marks ?? 0} points
                        </span>
                      </div>
                      {q?.options && (
                        <div className="mt-3 space-y-2">
                          {q.options.map((option: any, i: any) => (
                            <div
                              key={i}
                              className="text-sm p-2 bg-gray-50 rounded"
                            >
                              {String.fromCharCode(65 + i)}. {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
