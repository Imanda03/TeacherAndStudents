import { useState, useMemo } from "react";
import {
  CalendarClock,
  Plus,
  BadgeCheck,
  FolderTree,
  ChevronDown,
  ChevronUp,
  Trash2,
  FileText,
  CheckCircle,
} from "lucide-react";
import Card from "../../components/common/Card";
import FeatureHeader from "../../components/common/FeatureHeader";
import Modal from "../../components/common/Modal";
import DiagramViewer from "../../components/common/DiagramViewer";
import jsonSchemas from "../../utils/jsonSchemas";
import diagramData from "../../utils/diagramData";
import Button from "../../components/common/Button";
import JsonViewer from "../../components/common/JsonViewer";
import { useTeacherContext } from "../../contexts/TeacherContext";

type QuestionType =
  | "mcq"
  | "true-false"
  | "fill-in-blanks"
  | "essay"
  | "short-answer";

type Question = {
  id: string;
  questionText: string;
  type: QuestionType;
  marks: number;
  correctAnswer: string;
  options?: string[]; // For MCQ
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subjectId: string;
  questions: Question[];
  status: "draft" | "published";
  submissions: {
    received: number;
    total: number;
  };
};

export default function TeacherAssignments() {
  const {
    classes,
    subjects: baseSubjects,
    addClass,
    removeClass,
    addSubject,
    removeSubject,
  } = useTeacherContext();

  const [showJson, setShowJson] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);

  // Local state for assignments
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  // Build subjects with assignments
  const subjects = useMemo(() => {
    return baseSubjects.map((baseSubject) => ({
      ...baseSubject,
      assignments: assignments.filter((a) => a.subjectId === baseSubject.id),
    }));
  }, [baseSubjects, assignments]);

  // Forms
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const [showAddAssignmentForm, setShowAddAssignmentForm] = useState(false);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);

  const [newClassName, setNewClassName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newAssignmentData, setNewAssignmentData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [newQuestionData, setNewQuestionData] = useState<{
    questionText: string;
    type: QuestionType;
    marks: number;
    correctAnswer: string;
    options: string[];
  }>({
    questionText: "",
    type: "mcq",
    marks: 1,
    correctAnswer: "",
    options: ["", "", "", ""],
  });

  // Add new class
  const addNewClass = () => {
    if (!newClassName.trim()) return;
    addClass(newClassName);
    setNewClassName("");
    setShowAddClassForm(false);
  };

  // Add new subject to selected class
  const addNewSubject = () => {
    if (!newSubjectName.trim() || !expandedClass) return;
    addSubject(newSubjectName, expandedClass);
    setNewSubjectName("");
    setShowAddSubjectForm(false);
  };

  // Add new assignment to selected subject
  const addNewAssignment = () => {
    if (!newAssignmentData.title.trim() || !expandedSubject) return;

    const newAssignment: Assignment = {
      id: `assignment_${Date.now()}`,
      title: newAssignmentData.title,
      description: newAssignmentData.description,
      dueDate: newAssignmentData.dueDate,
      subjectId: expandedSubject,
      questions: [],
      status: "draft",
      submissions: {
        received: 0,
        total: 0,
      },
    };

    setAssignments([...assignments, newAssignment]);
    setSelectedAssignment(newAssignment);
    setNewAssignmentData({
      title: "",
      description: "",
      dueDate: "",
    });
    setShowAddAssignmentForm(false);
  };

  // Add question to assignment
  const addQuestionToAssignment = () => {
    if (!selectedAssignment || !newQuestionData.questionText.trim()) return;

    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      questionText: newQuestionData.questionText,
      type: newQuestionData.type,
      marks: newQuestionData.marks,
      correctAnswer: newQuestionData.correctAnswer,
      options:
        newQuestionData.type === "mcq"
          ? newQuestionData.options.filter((o) => o.trim())
          : undefined,
    };

    const updatedAssignments = assignments.map((a) => {
      if (a.id === selectedAssignment.id) {
        return {
          ...a,
          questions: [...a.questions, newQuestion],
        };
      }
      return a;
    });

    setAssignments(updatedAssignments);
    const updatedAssignment = updatedAssignments.find(
      (a) => a.id === selectedAssignment.id
    );
    if (updatedAssignment) {
      setSelectedAssignment(updatedAssignment);
    }

    setNewQuestionData({
      questionText: "",
      type: "mcq",
      marks: 1,
      correctAnswer: "",
      options: ["", "", "", ""],
    });
    setShowAddQuestionForm(false);
  };

  // Remove question from assignment
  const removeQuestion = (questionId: string) => {
    if (!selectedAssignment) return;

    const updatedAssignments = assignments.map((a) => {
      if (a.id === selectedAssignment.id) {
        return {
          ...a,
          questions: a.questions.filter((q) => q.id !== questionId),
        };
      }
      return a;
    });

    setAssignments(updatedAssignments);
    const updatedAssignment = updatedAssignments.find(
      (a) => a.id === selectedAssignment.id
    );
    if (updatedAssignment) {
      setSelectedAssignment(updatedAssignment);
    }
  };

  // Remove class (uses context)
  const handleRemoveClass = (classId: string) => {
    removeClass(classId);
    // Remove assignments that belong to subjects of this class
    const subjectsInClass = baseSubjects.filter((s) => s.classId === classId);
    const subjectIds = subjectsInClass.map((s) => s.id);
    setAssignments(
      assignments.filter((a) => !subjectIds.includes(a.subjectId))
    );

    if (expandedClass === classId) {
      setExpandedClass(null);
      setSelectedAssignment(null);
    }
  };

  // Remove subject (uses context)
  const handleRemoveSubject = (subjectId: string) => {
    removeSubject(subjectId);
    // Remove assignments that belong to this subject
    setAssignments(assignments.filter((a) => a.subjectId !== subjectId));

    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
      setSelectedAssignment(null);
    }
  };

  // Remove assignment
  const handleRemoveAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter((a) => a.id !== assignmentId));
    if (selectedAssignment?.id === assignmentId) {
      setSelectedAssignment(null);
    }
  };

  // Toggle assignment status
  const toggleAssignmentStatus = (assignment: Assignment) => {
    const updatedAssignments = assignments.map((a) => {
      if (a.id === assignment.id) {
        return {
          ...a,
          status:
            a.status === "draft" ? ("published" as const) : ("draft" as const),
        };
      }
      return a;
    });

    setAssignments(updatedAssignments);
    const updatedAssignment = updatedAssignments.find(
      (a) => a.id === assignment.id
    );
    if (updatedAssignment) {
      setSelectedAssignment(updatedAssignment);
    }
  };

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Assignments"
        description="Create, review, and publish assignments organized by class and subject."
        onShowJson={() => setShowJson(true)}
        onShowDiagram={() => setShowDiagram(true)}
        additionalActions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddClassForm(true)}
          >
            New Class
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-[340px_1fr]">
        {/* Left: Navigation Sidebar */}
        <div className="space-y-4">
          {/* Sidebar Header */}
          <div className="space-y-3">
            <Card className="p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                  <FolderTree className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    📋 Assignment Structure
                  </h3>
                  <p className="text-xs text-white/80">
                    {classes.length} Classes • {baseSubjects.length} Subjects
                  </p>
                </div>
              </div>
            </Card>

            {/* Active Assignment */}
            {selectedAssignment && (
              <Card className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                        Active Assignment
                      </span>
                    </div>
                    <h2 className="text-sm font-bold">
                      {selectedAssignment?.title || "Untitled"}
                    </h2>
                    <p className="text-xs text-blue-100">
                      {selectedAssignment?.questions?.length || 0} Questions •{" "}
                      {selectedAssignment?.status?.toUpperCase() || "DRAFT"}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Navigation Tree */}
          <Card className="p-4 bg-white shadow-sm border border-gray-200 rounded-xl">
            <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto custom-scrollbar">
              {classes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
                    <FolderTree className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    No classes yet
                  </p>
                  <p className="text-xs text-gray-500">
                    Create your first class to start organizing assignments
                  </p>
                </div>
              ) : (
                classes.map((cls) => {
                  const classSubjects = subjects.filter(
                    (s) => s?.classId === cls?.id
                  );
                  return (
                    <div
                      key={cls?.id}
                      className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Class Level */}
                      <div
                        className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 transition-colors group border-b border-gray-100"
                        onClick={() =>
                          setExpandedClass(
                            expandedClass === cls?.id ? null : cls?.id
                          )
                        }
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`p-2 rounded-lg transition-all ${
                              expandedClass === cls?.id
                                ? "bg-gray-200 text-gray-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {expandedClass === cls?.id ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronUp className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              {cls?.name || "Unnamed Class"}
                            </span>
                            <span className="text-xs text-gray-600 font-medium">
                              {classSubjects.length} subject
                              {classSubjects.length !== 1 ? "s" : ""} •{" "}
                              {classSubjects.reduce(
                                (acc, s) => acc + (s?.assignments?.length || 0),
                                0
                              )}{" "}
                              assignments
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveClass(cls.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                        </Button>
                      </div>

                      {expandedClass === cls.id && (
                        <div className="border-t border-gray-200 p-3 space-y-3 bg-gray-50">
                          {classSubjects.length === 0 ? (
                            <div className="text-center py-6">
                              <p className="text-xs text-gray-500 font-medium mb-2">
                                📝 No subjects yet
                              </p>
                              <p className="text-xs text-gray-400">
                                Add a subject to get started
                              </p>
                            </div>
                          ) : (
                            classSubjects.map((subject) => (
                              <div
                                key={subject?.id}
                                className="rounded-lg border border-gray-200 bg-white overflow-hidden ml-2 shadow-sm hover:shadow-md transition-all"
                              >
                                {/* Subject Level */}
                                <div
                                  className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 transition-colors group border-b border-gray-100"
                                  onClick={() =>
                                    setExpandedSubject(
                                      expandedSubject === subject?.id
                                        ? null
                                        : subject?.id
                                    )
                                  }
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    <div
                                      className={`p-1.5 rounded transition-all ${
                                        expandedSubject === subject?.id
                                          ? "bg-gray-200 text-gray-800"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {expandedSubject === subject?.id ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronUp className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <span className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                                        {subject?.name || "Unnamed Subject"}
                                      </span>
                                      <span className="text-xs text-gray-600 font-medium">
                                        {subject?.assignments?.length || 0}{" "}
                                        assignment
                                        {(subject?.assignments?.length || 0) !==
                                        1
                                          ? "s"
                                          : ""}
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveSubject(subject.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                {expandedSubject === subject.id && (
                                  <div className="border-t border-purple-100 p-3 space-y-2 bg-white">
                                    {subject.assignments.length === 0 ? (
                                      <div className="text-center py-4">
                                        <p className="text-xs text-gray-500 font-medium">
                                          📖 No assignments yet
                                        </p>
                                      </div>
                                    ) : (
                                      subject?.assignments?.map(
                                        (assignment) => (
                                          <div
                                            key={assignment?.id}
                                            className={`rounded-lg border transition-all overflow-hidden group ${
                                              selectedAssignment?.id ===
                                              assignment?.id
                                                ? "bg-white border-blue-300 shadow-sm ring-2 ring-blue-200"
                                                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                                            }`}
                                          >
                                            <div
                                              className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                                                selectedAssignment?.id ===
                                                assignment?.id
                                                  ? "bg-blue-50"
                                                  : "hover:bg-gray-50"
                                              }`}
                                              onClick={() => {
                                                setSelectedAssignment(
                                                  assignment
                                                );
                                              }}
                                            >
                                              <div className="flex items-center gap-3 flex-1">
                                                <div
                                                  className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                                                    selectedAssignment?.id ===
                                                    assignment?.id
                                                      ? "bg-blue-600 text-white"
                                                      : "bg-gray-100 text-gray-700"
                                                  }`}
                                                >
                                                  <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                  <p
                                                    className={`text-sm font-semibold ${
                                                      selectedAssignment?.id ===
                                                      assignment?.id
                                                        ? "text-blue-900"
                                                        : "text-gray-800"
                                                    }`}
                                                  >
                                                    {assignment?.title ||
                                                      "Untitled"}
                                                  </p>
                                                  <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-gray-500 font-medium">
                                                      {assignment?.questions
                                                        ?.length || 0}{" "}
                                                      questions
                                                    </span>
                                                    <span
                                                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                                        assignment?.status ===
                                                        "published"
                                                          ? "bg-green-100 text-green-700"
                                                          : "bg-yellow-100 text-yellow-700"
                                                      }`}
                                                    >
                                                      {assignment?.status ||
                                                        "draft"}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                  variant="ghost"
                                                  className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveAssignment(
                                                      assignment.id
                                                    );
                                                  }}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )
                                    )}

                                    <Button
                                      variant="secondary"
                                      className="w-full text-xs py-2 mt-1 border-dashed border-2 border-blue-300 text-blue-600 font-semibold hover:border-solid hover:bg-blue-100 hover:text-blue-700 transition-all rounded-lg"
                                      onClick={() => {
                                        setExpandedSubject(subject.id);
                                        setShowAddAssignmentForm(true);
                                      }}
                                    >
                                      <Plus className="h-4 w-4" /> Add
                                      Assignment
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}

                          <Button
                            variant="secondary"
                            className="w-full mt-2 text-xs py-2 border-dashed border-2 border-purple-300 text-purple-600 font-semibold hover:border-solid hover:bg-purple-100 hover:text-purple-700 transition-all rounded-lg"
                            onClick={() => setShowAddSubjectForm(true)}
                          >
                            <Plus className="h-4 w-4" /> Add Subject
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right: Assignment Details */}
        <div className="space-y-4">
          {selectedAssignment ? (
            <>
              {/* Assignment Details Card */}
              <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedAssignment?.title || "Untitled Assignment"}
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          selectedAssignment?.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        <BadgeCheck className="h-3 w-3" />{" "}
                        {selectedAssignment?.status || "draft"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        <CalendarClock className="h-3 w-3" />{" "}
                        {selectedAssignment?.dueDate
                          ? new Date(
                              selectedAssignment.dueDate
                            ).toLocaleDateString()
                          : "No due date"}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={
                      selectedAssignment.status === "draft"
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() => toggleAssignmentStatus(selectedAssignment)}
                  >
                    {selectedAssignment.status === "draft"
                      ? "Publish"
                      : "Unpublish"}
                  </Button>
                </div>

                {/* Assignment Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-1">
                      Total Questions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedAssignment?.questions?.length || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-1">
                      Total Marks
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedAssignment?.questions?.reduce(
                        (sum, q) => sum + (q?.marks || 0),
                        0
                      ) || 0}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedAssignment?.description && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedAssignment.description}
                    </p>
                  </div>
                )}

                {/* Questions Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Questions
                    </h4>
                    <Button
                      variant="primary"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() => setShowAddQuestionForm(true)}
                    >
                      Add Question
                    </Button>
                  </div>

                  {(selectedAssignment?.questions?.length || 0) === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
                      <FileText className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-900">
                        No questions yet
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Add questions to build your assignment
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedAssignment?.questions?.map((question, index) => (
                        <div
                          key={question?.id}
                          className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                  {index + 1}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold capitalize">
                                  {question?.type?.replace("-", " ") ||
                                    "Unknown"}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                                  {question?.marks || 0} mark
                                  {(question?.marks || 0) !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-2">
                                {question?.questionText || "No question text"}
                              </p>
                              {question?.options &&
                                question.options.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {question.options.map(
                                      (option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className={`text-xs px-3 py-1.5 rounded ${
                                            option === question?.correctAnswer
                                              ? "bg-green-50 text-green-700 font-semibold border border-green-200"
                                              : "bg-gray-50 text-gray-600"
                                          }`}
                                        >
                                          {option ===
                                            question?.correctAnswer && (
                                            <CheckCircle className="inline h-3 w-3 mr-1" />
                                          )}
                                          {String.fromCharCode(65 + optIndex)}.{" "}
                                          {option}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              {(!question?.options ||
                                question.options.length === 0) && (
                                <div className="mt-2 text-xs">
                                  <span className="text-gray-600">
                                    Correct Answer:{" "}
                                  </span>
                                  <span className="text-green-700 font-semibold bg-green-50 px-2 py-1 rounded">
                                    {question?.correctAnswer || "Not specified"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              className="p-2 hover:bg-red-50"
                              onClick={() => removeQuestion(question?.id || "")}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-900">
                Select an Assignment
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Choose an assignment from the left panel to view its details
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Add Class Modal */}
      <Modal
        open={showAddClassForm}
        onClose={() => {
          setShowAddClassForm(false);
          setNewClassName("");
        }}
        title="Add New Class"
        description="Create a new class to organize your assignments."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Class Name
            </label>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Class X-A, Biology 101"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="primary" onClick={addNewClass}>
              Create Class
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddClassForm(false);
                setNewClassName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Subject Modal */}
      <Modal
        open={showAddSubjectForm}
        onClose={() => {
          setShowAddSubjectForm(false);
          setNewSubjectName("");
        }}
        title="Add New Subject"
        description="Create a subject within the selected class."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Subject Name
            </label>
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Mathematics, Physics, English"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="primary" onClick={addNewSubject}>
              Create Subject
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddSubjectForm(false);
                setNewSubjectName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Assignment Modal */}
      <Modal
        open={showAddAssignmentForm}
        onClose={() => {
          setShowAddAssignmentForm(false);
          setNewAssignmentData({
            title: "",
            description: "",
            dueDate: "",
          });
        }}
        title="Create New Assignment"
        description="Set up assignment details and deadlines."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Title
            </label>
            <input
              type="text"
              value={newAssignmentData.title}
              onChange={(e) =>
                setNewAssignmentData({
                  ...newAssignmentData,
                  title: e.target.value,
                })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Chapter 5 Quiz"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Description
            </label>
            <textarea
              value={newAssignmentData.description}
              onChange={(e) =>
                setNewAssignmentData({
                  ...newAssignmentData,
                  description: e.target.value,
                })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the assignment..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Due Date
            </label>
            <input
              type="date"
              value={newAssignmentData.dueDate}
              onChange={(e) =>
                setNewAssignmentData({
                  ...newAssignmentData,
                  dueDate: e.target.value,
                })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              onClick={addNewAssignment}
              disabled={!newAssignmentData.title.trim()}
            >
              Create Assignment
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddAssignmentForm(false);
                setNewAssignmentData({
                  title: "",
                  description: "",
                  dueDate: "",
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Question Modal */}
      <Modal
        open={showAddQuestionForm}
        onClose={() => {
          setShowAddQuestionForm(false);
          setNewQuestionData({
            questionText: "",
            type: "mcq",
            marks: 1,
            correctAnswer: "",
            options: ["", "", "", ""],
          });
        }}
        title="Add Question"
        description="Create a new question for this assignment."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Question Type
            </label>
            <select
              value={newQuestionData.type}
              onChange={(e) =>
                setNewQuestionData({
                  ...newQuestionData,
                  type: e.target.value as QuestionType,
                })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="mcq">Multiple Choice (MCQ)</option>
              <option value="true-false">True/False</option>
              <option value="fill-in-blanks">Fill in the Blanks</option>
              <option value="short-answer">Short Answer</option>
              <option value="essay">Essay</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Question Text
            </label>
            <textarea
              value={newQuestionData.questionText}
              onChange={(e) =>
                setNewQuestionData({
                  ...newQuestionData,
                  questionText: e.target.value,
                })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your question here..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Marks
            </label>
            <input
              type="number"
              value={newQuestionData.marks}
              onChange={(e) =>
                setNewQuestionData({
                  ...newQuestionData,
                  marks: parseInt(e.target.value) || 1,
                })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="1"
              min="1"
            />
          </div>

          {newQuestionData.type === "mcq" && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Options
              </label>
              {newQuestionData.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...newQuestionData.options];
                    updatedOptions[index] = e.target.value;
                    setNewQuestionData({
                      ...newQuestionData,
                      options: updatedOptions,
                    });
                  }}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
              ))}
              <Button
                variant="secondary"
                className="mt-2 w-full"
                onClick={() =>
                  setNewQuestionData({
                    ...newQuestionData,
                    options: [...newQuestionData.options, ""],
                  })
                }
              >
                <Plus className="h-4 w-4" /> Add Option
              </Button>
            </div>
          )}

          {newQuestionData.type === "true-false" && (
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                Correct Answer
              </label>
              <select
                value={newQuestionData.correctAnswer}
                onChange={(e) =>
                  setNewQuestionData({
                    ...newQuestionData,
                    correctAnswer: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select...</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </div>
          )}

          {newQuestionData.type === "mcq" && (
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                Correct Answer
              </label>
              <select
                value={newQuestionData.correctAnswer}
                onChange={(e) =>
                  setNewQuestionData({
                    ...newQuestionData,
                    correctAnswer: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select correct option...</option>
                {newQuestionData.options
                  .filter((o) => o.trim())
                  .map((option, index) => (
                    <option key={index} value={option}>
                      {String.fromCharCode(65 + index)}. {option}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {(newQuestionData.type === "fill-in-blanks" ||
            newQuestionData.type === "short-answer" ||
            newQuestionData.type === "essay") && (
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                Correct Answer / Model Answer
              </label>
              <textarea
                value={newQuestionData.correctAnswer}
                onChange={(e) =>
                  setNewQuestionData({
                    ...newQuestionData,
                    correctAnswer: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter the correct answer..."
                rows={2}
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              onClick={addQuestionToAssignment}
              disabled={
                !newQuestionData.questionText.trim() ||
                !newQuestionData.correctAnswer.trim()
              }
            >
              Add Question
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddQuestionForm(false);
                setNewQuestionData({
                  questionText: "",
                  type: "mcq",
                  marks: 1,
                  correctAnswer: "",
                  options: ["", "", "", ""],
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* JSON Viewer Modal */}
      <Modal
        open={showJson}
        onClose={() => setShowJson(false)}
        title="Assignments JSON"
        description="Schemas"
        wide
      >
        <JsonViewer
          jsonData={{
            schema: jsonSchemas.teacherAssignments.schema,
            example: jsonSchemas.teacherAssignments.example,
            apiRequest: jsonSchemas.teacherAssignments.apiRequest,
            apiResponse: jsonSchemas.teacherAssignments.apiResponse,
          }}
          title={jsonSchemas.teacherAssignments.title}
          description={jsonSchemas.teacherAssignments.description}
          onClose={() => setShowJson(false)}
        />
      </Modal>

      {/* Diagram Viewer Modal */}
      <Modal
        open={showDiagram}
        onClose={() => setShowDiagram(false)}
        title="Assignment Diagram"
        description="Workflow"
        wide
      >
        <DiagramViewer
          diagramType="flowchart"
          diagramData={diagramData.teacherAssignments}
          title={diagramData.teacherAssignments.title}
          description={diagramData.teacherAssignments.description}
          onClose={() => setShowDiagram(false)}
        />
      </Modal>
    </div>
  );
}
