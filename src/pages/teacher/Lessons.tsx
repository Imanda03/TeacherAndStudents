import { useState, useMemo } from "react";
import {
  Plus,
  FolderTree,
  ChevronDown,
  ChevronUp,
  Trash2,
  Network,
  Video,
  FileText,
  Image as ImageIcon,
  FileType,
  Link as LinkIcon,
  FileJson,
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

type Chapter = {
  id: string;
  name: string;
  subjectId: string;
  content: ChapterContent;
};

type ChapterContent = {
  id: string;
  title: string;
  rootNode: MindMapNode | null;
  materials: ChapterMaterial[];
};

type MindMapNode = {
  id: string;
  label: string;
  description: string;
  color: string;
  children: MindMapNode[];
};

type ContentType = "video" | "text" | "image" | "pdf" | "link";

type ChapterMaterial = {
  id: string;
  type: ContentType;
  title: string;
  url?: string;
  content?: string;
  createdAt?: string;
};

export default function TeacherLessons() {
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

  // Local state for chapters (specific to lessons)
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Classes, subjects, and chapters management
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // Build subjects with chapters
  const subjects = useMemo(() => {
    return baseSubjects.map((baseSubject) => ({
      ...baseSubject,
      chapters: chapters.filter((ch) => ch.subjectId === baseSubject.id),
    }));
  }, [baseSubjects, chapters]);

  // Mind map tree state
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [parentNodeForNewChild, setParentNodeForNewChild] =
    useState<MindMapNode | null>(null);

  // Content management state
  const [showContentTab, setShowContentTab] = useState<"mindmap" | "materials">(
    "mindmap"
  );
  const [showAddMaterialForm, setShowAddMaterialForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState<{
    type: ContentType;
    title: string;
    url: string;
    content: string;
  }>({ type: "text", title: "", url: "", content: "" });

  // Forms
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const [showAddChapterForm, setShowAddChapterForm] = useState(false);
  const [showAddNodeForm, setShowAddNodeForm] = useState(false);
  const [showAddChildNodeForm, setShowAddChildNodeForm] = useState(false);
  const [showMindMapModal, setShowMindMapModal] = useState(false);
  const [mindMapModalChapter, setMindMapModalChapter] =
    useState<Chapter | null>(null);

  const [newClassName, setNewClassName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newChapterName, setNewChapterName] = useState("");
  const [newNodeData, setNewNodeData] = useState({
    label: "",
    description: "",
    color: "#3B82F6",
  });

  // Utility function to create a new node
  const createNode = (
    label: string,
    description: string,
    color: string
  ): MindMapNode => ({
    id: `node_${Date.now()}_${Math.random()}`,
    label,
    description,
    color,
    children: [],
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

  // Add new chapter to selected subject
  const addNewChapter = () => {
    if (!newChapterName.trim() || !expandedSubject) return;

    const newChapter: Chapter = {
      id: `chapter_${Date.now()}`,
      name: newChapterName,
      subjectId: expandedSubject,
      content: {
        id: `content_${Date.now()}`,
        title: newChapterName,
        rootNode: null,
        materials: [],
      },
    };

    setChapters([...chapters, newChapter]);
    setSelectedChapter(newChapter);
    setNewChapterName("");
    setShowAddChapterForm(false);
    setExpandedNodes(new Set());
    setSelectedNode(null);
  };

  // Remove class (now uses context)
  const handleRemoveClass = (classId: string) => {
    removeClass(classId);
    // Remove chapters that belong to subjects of this class
    const subjectsInClass = baseSubjects.filter((s) => s.classId === classId);
    const subjectIds = subjectsInClass.map((s) => s.id);
    setChapters(chapters.filter((ch) => !subjectIds.includes(ch.subjectId)));

    if (expandedClass === classId) {
      setExpandedClass(null);
      setSelectedChapter(null);
    }
  };

  // Remove subject (now uses context)
  const handleRemoveSubject = (subjectId: string) => {
    removeSubject(subjectId);
    // Remove chapters that belong to this subject
    setChapters(chapters.filter((ch) => ch.subjectId !== subjectId));

    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
      setSelectedChapter(null);
    }
  };

  // Remove chapter
  const handleRemoveChapter = (chapterId: string) => {
    setChapters(chapters.filter((ch) => ch.id !== chapterId));
    if (selectedChapter?.id === chapterId) {
      setSelectedChapter(null);
    }
  };

  // Add root node to chapter
  const addRootNodeToChapter = () => {
    if (!newNodeData.label.trim() || !selectedChapter) return;

    const newNode = createNode(
      newNodeData.label,
      newNodeData.description,
      newNodeData.color
    );

    const updatedChapters = chapters.map((ch) => {
      if (ch.id === selectedChapter.id) {
        return {
          ...ch,
          content: {
            ...ch.content,
            rootNode: newNode,
          },
        };
      }
      return ch;
    });

    setChapters(updatedChapters);
    const updatedChapter = updatedChapters.find(
      (ch) => ch.id === selectedChapter.id
    );

    if (updatedChapter) {
      setSelectedChapter(updatedChapter);
      setSelectedNode(newNode);
    }

    setNewNodeData({ label: "", description: "", color: "#3B82F6" });
    setShowAddNodeForm(false);
  };

  // Add child node to a parent node
  const addChildNode = (parentNode: MindMapNode) => {
    if (!newNodeData.label.trim() || !selectedChapter) return;

    const newChild = createNode(
      newNodeData.label,
      newNodeData.description,
      newNodeData.color
    );

    const updateNodeRecursive = (node: MindMapNode): MindMapNode => {
      if (node.id === parentNode.id) {
        return {
          ...node,
          children: [...node.children, newChild],
        };
      }
      return {
        ...node,
        children: node.children.map(updateNodeRecursive),
      };
    };

    const updatedChapters = chapters.map((ch) => {
      if (ch.id === selectedChapter.id && ch.content.rootNode) {
        return {
          ...ch,
          content: {
            ...ch.content,
            rootNode: updateNodeRecursive(ch.content.rootNode),
          },
        };
      }
      return ch;
    });

    setChapters(updatedChapters);
    const updatedChapter = updatedChapters.find(
      (ch) => ch.id === selectedChapter.id
    );

    if (updatedChapter) {
      setSelectedChapter(updatedChapter);
    }

    setNewNodeData({ label: "", description: "", color: "#3B82F6" });
    setShowAddChildNodeForm(false);
    setParentNodeForNewChild(null);
  };

  // Remove a node recursively
  const removeNode = (nodeId: string) => {
    if (!selectedChapter || !selectedChapter.content.rootNode) return;

    const removeNodeRecursive = (node: MindMapNode): MindMapNode | null => {
      if (node.id === nodeId) {
        return null;
      }
      return {
        ...node,
        children: node.children
          .map(removeNodeRecursive)
          .filter((child): child is MindMapNode => child !== null),
      };
    };

    const updatedChapters = chapters.map((ch) => {
      if (ch.id === selectedChapter.id && ch.content.rootNode) {
        const updatedRoot = removeNodeRecursive(ch.content.rootNode);
        return {
          ...ch,
          content: {
            ...ch.content,
            rootNode: updatedRoot,
          },
        };
      }
      return ch;
    });

    setChapters(updatedChapters);
    const updatedChapter = updatedChapters.find(
      (ch) => ch.id === selectedChapter.id
    );

    if (updatedChapter) {
      setSelectedChapter(updatedChapter);
      setSelectedNode(null);
    }
  };

  // Toggle node expansion
  const toggleNodeExpansion = (nodeId: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(nodeId)) {
      newExpandedNodes.delete(nodeId);
    } else {
      newExpandedNodes.add(nodeId);
    }
    setExpandedNodes(newExpandedNodes);
  };

  // Add material to chapter
  const addMaterialToChapter = () => {
    if (!newMaterial.title.trim() || !selectedChapter) return;

    const material: ChapterMaterial = {
      id: `material_${Date.now()}`,
      type: newMaterial.type,
      title: newMaterial.title,
      url: newMaterial.url || undefined,
      content: newMaterial.content || undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedChapters = chapters.map((ch) => {
      if (ch.id === selectedChapter.id) {
        return {
          ...ch,
          content: {
            ...ch.content,
            materials: [...ch.content.materials, material],
          },
        };
      }
      return ch;
    });

    setChapters(updatedChapters);
    const updatedChapter = updatedChapters.find(
      (ch) => ch.id === selectedChapter.id
    );

    if (updatedChapter) {
      setSelectedChapter(updatedChapter);
    }

    setNewMaterial({ type: "text", title: "", url: "", content: "" });
    setShowAddMaterialForm(false);
  };

  // Remove material from chapter
  const removeMaterial = (materialId: string) => {
    if (!selectedChapter) return;

    const updatedChapters = chapters.map((ch) => {
      if (ch.id === selectedChapter.id) {
        return {
          ...ch,
          content: {
            ...ch.content,
            materials: ch.content.materials.filter((m) => m.id !== materialId),
          },
        };
      }
      return ch;
    });

    setChapters(updatedChapters);
    const updatedChapter = updatedChapters.find(
      (ch) => ch.id === selectedChapter.id
    );

    if (updatedChapter) {
      setSelectedChapter(updatedChapter);
    }
  };

  // These are now handled above with handleRemoveClass, handleRemoveSubject, handleRemoveChapter
  // }
  // };

  // Render mind map node recursively
  const renderNode = (
    node: MindMapNode,
    level: number = 0
  ): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div
        key={node.id}
        className="mb-2"
        style={{ marginLeft: `${level * 24}px` }}
      >
        <div
          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer group ${
            isSelected
              ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-400 shadow-md"
              : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
          }`}
          onClick={() => setSelectedNode(node)}
        >
          {/* Expand/Collapse Toggle */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(node.id);
              }}
              className={`p-1 rounded transition-colors flex-shrink-0 ${
                isExpanded
                  ? "bg-purple-100 text-purple-600"
                  : "bg-gray-100 text-gray-600 group-hover:bg-purple-50"
              }`}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="flex-shrink-0 w-6" />
          )}

          {/* Node Color & Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: node.color }}
              />
              <p
                className={`text-sm font-semibold ${
                  isSelected ? "text-blue-900" : "text-gray-900"
                }`}
              >
                {node.label}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              className="p-1.5 text-blue-600 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                setParentNodeForNewChild(node);
                setShowAddChildNodeForm(true);
              }}
              title="Add child node"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            {node !== selectedChapter?.content.rootNode && (
              <Button
                variant="ghost"
                className="p-1.5 text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNode(node.id);
                }}
                title="Delete node"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-purple-200 ml-3 pl-2 mt-1">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Lesson Management"
        description="Build class and chapter hierarchy with interactive mind maps."
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
        {/* Left: Modern Navigation Sidebar */}
        <div className="space-y-4">
          {/* Sidebar Header */}
          <div className="space-y-3">
            <Card className="p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                  <FolderTree className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">📚 Course Structure</h3>
                  <p className="text-xs text-white/80">
                    {classes.length} Classes • {baseSubjects.length} Subjects
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-blue-50 border-2 border-blue-200">
              <p className="text-xs text-blue-800 font-medium">
                💡 Tip: Click chapters to view mind map, click the network icon
                to edit it in a modal.
              </p>
            </Card>

            {/* Active Chapter (moved to left sidebar) */}
            {selectedChapter && (
              <Card className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                        Active Chapter
                      </span>
                    </div>
                    <h2 className="text-sm font-bold">
                      {selectedChapter.name}
                    </h2>
                    <p className="text-xs text-blue-100">
                      Build and organize your learning content
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowJson(true)}
                      className="p-2 hover:bg-gray-100/20 rounded-lg transition"
                      title="View JSON Schema"
                    >
                      <FileJson className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowDiagram(true)}
                      className="p-2 hover:bg-gray-100/20 rounded-lg transition"
                      title="View Diagram"
                    >
                      <Network className="w-5 h-5" />
                    </button>
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
                    Create your first class to start organizing content
                  </p>
                </div>
              ) : (
                classes.map((cls) => {
                  const classSubjects = subjects.filter(
                    (s) => s.classId === cls.id
                  );
                  return (
                    <div
                      key={cls.id}
                      className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Class Level */}
                      <div
                        className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 transition-colors group border-b border-gray-100"
                        onClick={() =>
                          setExpandedClass(
                            expandedClass === cls.id ? null : cls.id
                          )
                        }
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`p-2 rounded-lg transition-all ${
                              expandedClass === cls.id
                                ? "bg-gray-200 text-gray-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {expandedClass === cls.id ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronUp className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              {cls.name}
                            </span>
                            <span className="text-xs text-gray-600 font-medium">
                              {classSubjects.length} subject
                              {classSubjects.length !== 1 ? "s" : ""} •{" "}
                              {classSubjects.reduce(
                                (acc, s) => acc + s.chapters.length,
                                0
                              )}{" "}
                              chapters
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
                                key={subject.id}
                                className="rounded-lg border border-gray-200 bg-white overflow-hidden ml-2 shadow-sm hover:shadow-md transition-all"
                              >
                                {/* Subject Level */}
                                <div
                                  className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 transition-colors group border-b border-gray-100"
                                  onClick={() =>
                                    setExpandedSubject(
                                      expandedSubject === subject.id
                                        ? null
                                        : subject.id
                                    )
                                  }
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    <div
                                      className={`p-1.5 rounded transition-all ${
                                        expandedSubject === subject.id
                                          ? "bg-gray-200 text-gray-800"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {expandedSubject === subject.id ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronUp className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <span className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                                        {subject.name}
                                      </span>
                                      <span className="text-xs text-gray-600 font-medium">
                                        {subject.chapters.length} chapter
                                        {subject.chapters.length !== 1
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
                                    {subject.chapters.length === 0 ? (
                                      <div className="text-center py-4">
                                        <p className="text-xs text-gray-500 font-medium">
                                          📖 No chapters yet
                                        </p>
                                      </div>
                                    ) : (
                                      subject.chapters.map((chapter) => (
                                        <div
                                          key={chapter.id}
                                          className={`rounded-lg border transition-all overflow-hidden group ${
                                            selectedChapter?.id === chapter.id
                                              ? "bg-white border-blue-300 shadow-sm ring-2 ring-blue-200"
                                              : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                                          }`}
                                        >
                                          <div
                                            className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                                              selectedChapter?.id === chapter.id
                                                ? "bg-blue-50"
                                                : "hover:bg-gray-50"
                                            }`}
                                            onClick={() => {
                                              setSelectedChapter(chapter);
                                              setShowContentTab("mindmap");
                                            }}
                                          >
                                            <div className="flex items-center gap-3 flex-1">
                                              <div
                                                className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                                                  selectedChapter?.id ===
                                                  chapter.id
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                              >
                                                <FolderTree className="h-4 w-4" />
                                              </div>
                                              <div className="flex-1">
                                                <p
                                                  className={`text-sm font-semibold ${
                                                    selectedChapter?.id ===
                                                    chapter.id
                                                      ? "text-blue-900"
                                                      : "text-gray-800"
                                                  }`}
                                                >
                                                  {chapter.name}
                                                </p>
                                                {chapter.content.rootNode && (
                                                  <p className="text-xs text-green-600 font-medium">
                                                    Mind map available
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                              {chapter.content.rootNode && (
                                                <button
                                                  className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMindMapModalChapter(
                                                      chapter
                                                    );
                                                    setShowMindMapModal(true);
                                                  }}
                                                  title="View Mind Map"
                                                >
                                                  <Network className="h-4 w-4" />
                                                </button>
                                              )}
                                              <Button
                                                variant="ghost"
                                                className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleRemoveChapter(
                                                    chapter.id
                                                  );
                                                }}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    )}

                                    <Button
                                      variant="secondary"
                                      className="w-full text-xs py-2 mt-1 border-dashed border-2 border-blue-300 text-blue-600 font-semibold hover:border-solid hover:bg-blue-100 hover:text-blue-700 transition-all rounded-lg"
                                      onClick={() => {
                                        setExpandedSubject(subject.id);
                                        setShowAddChapterForm(true);
                                      }}
                                    >
                                      <Plus className="h-4 w-4" /> Add Chapter
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

        {/* Right: Workspace */}
        <div className="space-y-4">
          {selectedChapter ? (
            <>
              {/* Tab Navigation */}
              <Card className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowContentTab("mindmap")}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                      showContentTab === "mindmap"
                        ? "bg-white border border-gray-300 shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Network className="h-4 w-4" />
                    <span>Concept Mind Map</span>
                    {selectedChapter.content.rootNode && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          showContentTab === "mindmap"
                            ? "bg-green-100 text-green-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        Active
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowContentTab("materials")}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                      showContentTab === "materials"
                        ? "bg-white border border-gray-300 shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Learning Materials</span>
                    {selectedChapter.content.materials.length > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700`}
                      >
                        {selectedChapter.content.materials.length}
                      </span>
                    )}
                  </button>
                </div>
              </Card>

              {/* Mind Map Tab */}
              {showContentTab === "mindmap" && (
                <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
                  {/* Mind Map Tree */}
                  <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Network className="h-5 w-5 text-gray-700" />
                          Concept Hierarchy
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Build your knowledge tree structure
                        </p>
                      </div>
                      {!selectedChapter.content.rootNode && (
                        <Button
                          onClick={() => setShowAddNodeForm(true)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                        >
                          <Plus className="h-4 w-4" /> Create Root Node
                        </Button>
                      )}
                    </div>

                    {/* Tree Structure Renderer */}
                    {!selectedChapter.content.rootNode ? (
                      <div className="text-center py-16">
                        <div className="inline-block p-6 bg-purple-100 rounded-full mb-4">
                          <Network className="h-12 w-12 text-purple-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                          No concept map yet
                        </h4>
                        <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                          Create a root node to start building your hierarchical
                          knowledge structure
                        </p>
                        <Button
                          onClick={() => setShowAddNodeForm(true)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                        >
                          <Plus className="h-4 w-4" /> Create Root Node
                        </Button>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        {/* Tree Node Renderer Component */}
                        {(() => {
                          const renderNode = (
                            node: MindMapNode,
                            level: number = 0
                          ): React.ReactNode => {
                            const isExpanded = expandedNodes.has(node.id);
                            const hasChildren = node.children.length > 0;
                            const isSelected = selectedNode?.id === node.id;

                            return (
                              <div
                                key={node.id}
                                className="mb-2"
                                style={{ marginLeft: `${level * 24}px` }}
                              >
                                <div
                                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${
                                    isSelected
                                      ? "bg-white border-blue-300 ring-2 ring-blue-200"
                                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                  }`}
                                  onClick={() => setSelectedNode(node)}
                                >
                                  {/* Expand/Collapse Toggle */}
                                  {hasChildren ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleNodeExpansion(node.id);
                                      }}
                                      className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                                        isExpanded
                                          ? "bg-purple-100 text-purple-600"
                                          : "bg-gray-100 text-gray-600 group-hover:bg-purple-50"
                                      }`}
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronUp className="h-4 w-4" />
                                      )}
                                    </button>
                                  ) : (
                                    <div className="flex-shrink-0 w-8" />
                                  )}

                                  {/* Node Color & Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <div
                                        className={`h-3 w-3 rounded-full border border-gray-200 ${
                                          isSelected
                                            ? "ring-2 ring-blue-300"
                                            : ""
                                        }`}
                                        style={{
                                          backgroundColor: node.color,
                                        }}
                                      />
                                      <p
                                        className={`text-sm font-semibold ${
                                          isSelected
                                            ? "text-blue-900"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {node.label}
                                      </p>
                                    </div>
                                    {node.description && (
                                      <p className="text-xs text-gray-600 ml-5">
                                        {node.description}
                                      </p>
                                    )}
                                    {hasChildren && (
                                      <p className="text-xs text-gray-500 mt-1.5 font-medium ml-5">
                                        {node.children.length} sub-concept
                                        {node.children.length !== 1 ? "s" : ""}
                                      </p>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    <Button
                                      variant="ghost"
                                      className="p-2 hover:bg-green-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setParentNodeForNewChild(node);
                                        setShowAddChildNodeForm(true);
                                      }}
                                      title="Add child concept"
                                    >
                                      <Plus className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="p-2 hover:bg-red-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeNode(node.id);
                                      }}
                                      title="Delete concept"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Render Children */}
                                {hasChildren && isExpanded && (
                                  <div className="border-l-2 border-gray-200 ml-6 pl-2 mt-2">
                                    {node.children.map((child) =>
                                      renderNode(child, level + 1)
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          };

                          return renderNode(selectedChapter.content.rootNode);
                        })()}
                      </div>
                    )}
                  </Card>

                  {/* Node Details Panel with Tree Structure */}
                  {selectedNode && (
                    <Card className="p-0 overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                      {/* Header */}
                      <div className="border-b border-gray-200 p-4">
                        <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2 mb-1">
                          <Network className="h-5 w-5 text-gray-700" />
                          Concept Tree Visualization
                        </h4>
                        <p className="text-xs text-gray-600">
                          Full hierarchy with highlighted selection
                        </p>
                      </div>

                      {/* Visual Tree Structure */}
                      <div className="p-4">
                        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-x-auto p-5">
                          {(() => {
                            // Render the entire tree from root with visual connections
                            const renderTreeView = (
                              node: MindMapNode,
                              level: number = 0,
                              isLast: boolean = true,
                              prefix: string = ""
                            ): React.ReactNode => {
                              const isSelected = node.id === selectedNode.id;
                              const hasChildren = node.children.length > 0;

                              return (
                                <div
                                  key={node.id}
                                  className={`relative transition-all ${
                                    isSelected ? "scale-[1.02]" : ""
                                  }`}
                                >
                                  {/* Current Node */}
                                  <div
                                    className={`flex items-center gap-3 py-2 rounded-lg transition-all ${
                                      isSelected
                                        ? "bg-gradient-to-r from-blue-100 to-indigo-100 shadow-md pl-2 pr-3 -ml-2"
                                        : "hover:bg-gray-50"
                                    }`}
                                  >
                                    {/* Tree Lines */}
                                    {level > 0 && (
                                      <div className="flex items-center">
                                        <span className="text-gray-400 font-mono text-sm font-bold">
                                          {prefix}
                                          {isLast ? "└─" : "├─"}
                                        </span>
                                      </div>
                                    )}

                                    {/* Node Indicator with Glow */}
                                    <div className="relative">
                                      <div
                                        className={`h-4 w-4 rounded-full flex-shrink-0 transition-all ${
                                          isSelected
                                            ? "ring-4 ring-blue-400 ring-opacity-50 shadow-lg scale-125"
                                            : "hover:scale-110"
                                        }`}
                                        style={{
                                          backgroundColor: node.color,
                                          boxShadow: isSelected
                                            ? `0 0 20px ${node.color}80`
                                            : "none",
                                        }}
                                      />
                                      {isSelected && (
                                        <div
                                          className="absolute inset-0 rounded-full animate-ping opacity-75"
                                          style={{
                                            backgroundColor: node.color,
                                          }}
                                        />
                                      )}
                                    </div>

                                    {/* Node Label with Enhanced Styling */}
                                    <div className="flex-1 flex items-center gap-2">
                                      <span
                                        className={`text-sm transition-all ${
                                          isSelected
                                            ? "font-extrabold text-indigo-900 text-base"
                                            : "font-medium text-gray-700"
                                        }`}
                                      >
                                        {node.label}
                                      </span>

                                      {/* Selected Badge */}
                                      {isSelected && (
                                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold shadow-sm">
                                          SELECTED
                                        </span>
                                      )}

                                      {/* Child Count Badge */}
                                      {hasChildren && (
                                        <span
                                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                            isSelected
                                              ? "bg-indigo-200 text-indigo-800"
                                              : "bg-gray-200 text-gray-700"
                                          }`}
                                        >
                                          {node.children.length}{" "}
                                          {node.children.length === 1
                                            ? "child"
                                            : "children"}
                                        </span>
                                      )}
                                    </div>

                                    {/* Description Preview */}
                                    {isSelected && node.description && (
                                      <div className="text-xs text-gray-600 italic max-w-xs truncate">
                                        "{node.description}"
                                      </div>
                                    )}
                                  </div>

                                  {/* Render Children */}
                                  {hasChildren && (
                                    <div className="ml-1">
                                      {node.children.map((child, index) => {
                                        const childIsLast =
                                          index === node.children.length - 1;
                                        const childPrefix =
                                          level > 0
                                            ? prefix + (isLast ? "  " : "│ ")
                                            : "";
                                        return renderTreeView(
                                          child,
                                          level + 1,
                                          childIsLast,
                                          childPrefix
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            };

                            return selectedChapter.content.rootNode ? (
                              <div className="font-mono">
                                {renderTreeView(
                                  selectedChapter.content.rootNode,
                                  0
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-400">
                                <Network className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No tree structure yet</p>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Quick Stats */}
                        {selectedNode.description && (
                          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className="h-8 w-8 rounded-lg flex-shrink-0 shadow-md"
                                style={{
                                  backgroundColor: selectedNode.color,
                                }}
                              />
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 text-sm mb-1">
                                  {selectedNode.label}
                                </h5>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {selectedNode.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              )}

              <>
                {/* Materials Tab */}
                {showContentTab === "materials" && selectedChapter && (
                  <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Learning Materials
                        </h3>
                        <p className="text-sm text-gray-600">
                          Add videos, documents, images, and links for students
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={() => setShowAddMaterialForm(true)}
                      >
                        Add Material
                      </Button>
                    </div>

                    {/* Materials List */}
                    <div className="space-y-3">
                      {selectedChapter.content.materials.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
                          <FileText className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-900">
                            No materials yet
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Add learning materials for students to study
                          </p>
                        </div>
                      ) : (
                        selectedChapter.content.materials.map((material) => {
                          const icons = {
                            video: <Video className="h-5 w-5 text-red-500" />,
                            text: (
                              <FileText className="h-5 w-5 text-blue-500" />
                            ),
                            image: (
                              <ImageIcon className="h-5 w-5 text-green-500" />
                            ),
                            pdf: (
                              <FileType className="h-5 w-5 text-orange-500" />
                            ),
                            link: (
                              <LinkIcon className="h-5 w-5 text-purple-500" />
                            ),
                          };

                          return (
                            <div
                              key={material.id}
                              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow"
                            >
                              <div className="flex-shrink-0 p-2 rounded-lg bg-gray-50">
                                {icons[material.type]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {material.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5 capitalize">
                                  {material.type}
                                </p>
                                {material.url && (
                                  <a
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 mt-1 truncate hover:underline"
                                  >
                                    {material.url}
                                  </a>
                                )}
                                {material.content && (
                                  <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                                    {material.content}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                className="p-1"
                                onClick={() => removeMaterial(material.id)}
                                title="Delete material"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </Card>
                )}
              </>
            </>
          ) : (
            <Card className="p-8 text-center">
              <FolderTree className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-900">
                Select a Chapter
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Choose a chapter from the left panel to manage its content
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
        description="Create a new class to organize your lessons."
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

      {/* Add Chapter Modal */}
      <Modal
        open={showAddChapterForm}
        onClose={() => {
          setShowAddChapterForm(false);
          setNewChapterName("");
        }}
        title="Add New Chapter"
        description="Create a chapter within the selected subject."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Chapter Name
            </label>
            <input
              type="text"
              value={newChapterName}
              onChange={(e) => setNewChapterName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Chapter 1: Introduction"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="primary" onClick={addNewChapter}>
              Add Chapter
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddChapterForm(false);
                setNewChapterName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Node Modal */}
      <Modal
        open={showAddNodeForm}
        onClose={() => {
          setShowAddNodeForm(false);
          setNewNodeData({ label: "", description: "", color: "#3B82F6" });
        }}
        title="Add Root Concept"
        description="Create the main concept for this chapter."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Concept Title
            </label>
            <input
              type="text"
              value={newNodeData.label}
              onChange={(e) =>
                setNewNodeData({ ...newNodeData, label: e.target.value })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Photosynthesis"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Description (Optional)
            </label>
            <textarea
              value={newNodeData.description}
              onChange={(e) =>
                setNewNodeData({ ...newNodeData, description: e.target.value })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add supporting details..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Concept Color
            </label>
            <div className="flex gap-2">
              {[
                "#3B82F6",
                "#EF4444",
                "#10B981",
                "#F59E0B",
                "#8B5CF6",
                "#EC4899",
                "#06B6D4",
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => setNewNodeData({ ...newNodeData, color })}
                  className={`h-10 w-10 rounded-full transition-all ${
                    newNodeData.color === color
                      ? "scale-110 ring-2 ring-offset-2 ring-gray-400"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Color: ${color}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              onClick={addRootNodeToChapter}
              disabled={!newNodeData.label.trim()}
            >
              Create Concept
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddNodeForm(false);
                setNewNodeData({
                  label: "",
                  description: "",
                  color: "#3B82F6",
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Child Node Modal */}
      <Modal
        open={showAddChildNodeForm}
        onClose={() => {
          setShowAddChildNodeForm(false);
          setNewNodeData({ label: "", description: "", color: "#3B82F6" });
          setParentNodeForNewChild(null);
        }}
        title="Add Sub-Concept"
        description={`Create a sub-concept under "${
          parentNodeForNewChild?.label || "Concept"
        }"`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Sub-Concept Title
            </label>
            <input
              type="text"
              value={newNodeData.label}
              onChange={(e) =>
                setNewNodeData({ ...newNodeData, label: e.target.value })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Light Reactions"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Description (Optional)
            </label>
            <textarea
              value={newNodeData.description}
              onChange={(e) =>
                setNewNodeData({ ...newNodeData, description: e.target.value })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add supporting details..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Sub-Concept Color
            </label>
            <div className="flex gap-2">
              {[
                "#3B82F6",
                "#EF4444",
                "#10B981",
                "#F59E0B",
                "#8B5CF6",
                "#EC4899",
                "#06B6D4",
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => setNewNodeData({ ...newNodeData, color })}
                  className={`h-10 w-10 rounded-full transition-all ${
                    newNodeData.color === color
                      ? "scale-110 ring-2 ring-offset-2 ring-gray-400"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Color: ${color}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              onClick={() =>
                parentNodeForNewChild && addChildNode(parentNodeForNewChild)
              }
              disabled={!newNodeData.label.trim()}
            >
              Add Sub-Concept
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddChildNodeForm(false);
                setNewNodeData({
                  label: "",
                  description: "",
                  color: "#3B82F6",
                });
                setParentNodeForNewChild(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Material Modal */}
      <Modal
        open={showAddMaterialForm}
        onClose={() => {
          setShowAddMaterialForm(false);
          setNewMaterial({ type: "text", title: "", url: "", content: "" });
        }}
        title="Add Learning Material"
        description="Upload or link content for students to study"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Material Type
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(["video", "text", "image", "pdf", "link"] as ContentType[]).map(
                (type) => {
                  const icons = {
                    video: <Video className="h-5 w-5" />,
                    text: <FileText className="h-5 w-5" />,
                    image: <ImageIcon className="h-5 w-5" />,
                    pdf: <FileType className="h-5 w-5" />,
                    link: <LinkIcon className="h-5 w-5" />,
                  };
                  const colors = {
                    video: "border-red-500 bg-red-50 text-red-700",
                    text: "border-blue-500 bg-blue-50 text-blue-700",
                    image: "border-green-500 bg-green-50 text-green-700",
                    pdf: "border-orange-500 bg-orange-50 text-orange-700",
                    link: "border-purple-500 bg-purple-50 text-purple-700",
                  };

                  return (
                    <button
                      key={type}
                      onClick={() => setNewMaterial({ ...newMaterial, type })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newMaterial.type === type
                          ? colors[type]
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {icons[type]}
                        <span className="text-xs font-medium capitalize">
                          {type}
                        </span>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Material Title
            </label>
            <input
              type="text"
              value={newMaterial.title}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, title: e.target.value })
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Introduction to Photosynthesis"
              autoFocus
            />
          </div>

          {(newMaterial.type === "video" ||
            newMaterial.type === "link" ||
            newMaterial.type === "pdf" ||
            newMaterial.type === "image") && (
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                URL / Link
              </label>
              <input
                type="url"
                value={newMaterial.url}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, url: e.target.value })
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={`https://example.com/${newMaterial.type}`}
              />
            </div>
          )}

          {newMaterial.type === "text" && (
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                Text Content
              </label>
              <textarea
                value={newMaterial.content}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, content: e.target.value })
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter text content for students..."
                rows={6}
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              onClick={addMaterialToChapter}
              disabled={!newMaterial.title.trim()}
            >
              Add Material
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddMaterialForm(false);
                setNewMaterial({
                  type: "text",
                  title: "",
                  url: "",
                  content: "",
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
        title="Lesson JSON"
        description="Schema and payloads"
        wide
      >
        <JsonViewer
          jsonData={{
            schema: jsonSchemas.teacherLessons.schema,
            example: jsonSchemas.teacherLessons.example,
            apiRequest: jsonSchemas.teacherLessons.apiRequest,
            apiResponse: jsonSchemas.teacherLessons.apiResponse,
          }}
          title={jsonSchemas.teacherLessons.title}
          description={jsonSchemas.teacherLessons.description}
          onClose={() => setShowJson(false)}
        />
      </Modal>

      {/* Diagram Viewer Modal */}
      <Modal
        open={showDiagram}
        onClose={() => setShowDiagram(false)}
        title="Lesson Diagram"
        description="Workflow"
        wide
      >
        <DiagramViewer
          diagramType="mindmap"
          diagramData={diagramData.teacherLessons}
          title={diagramData.teacherLessons.title}
          description={diagramData.teacherLessons.description}
          onClose={() => setShowDiagram(false)}
        />
      </Modal>

      {/* Mind Map Modal */}
      <Modal
        open={showMindMapModal}
        onClose={() => {
          setShowMindMapModal(false);
          setMindMapModalChapter(null);
        }}
        title={
          mindMapModalChapter
            ? `${mindMapModalChapter.name} - Mind Map`
            : "Mind Map"
        }
        description="View, edit, add, and delete mind map nodes"
        wide
      >
        {mindMapModalChapter && (
          <div className="space-y-6">
            {/* Mind Map Visualization */}
            {mindMapModalChapter.content.rootNode && (
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Concept Structure
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {renderNode(mindMapModalChapter.content.rootNode, 0)}
                </div>
              </div>
            )}

            {/* Node Management Buttons */}
            <div className="flex flex-wrap gap-2">
              {mindMapModalChapter.content.rootNode ? (
                <>
                  <Button
                    variant="primary"
                    icon={<Plus className="h-4 w-4" />}
                    onClick={() => {
                      setSelectedChapter(mindMapModalChapter);
                      setSelectedNode(mindMapModalChapter.content.rootNode);
                      setParentNodeForNewChild(
                        mindMapModalChapter.content.rootNode
                      );
                      setShowAddChildNodeForm(true);
                      setShowMindMapModal(false);
                    }}
                  >
                    Add Child Node to Root
                  </Button>
                  {selectedNode &&
                    selectedNode.id !==
                      mindMapModalChapter.content.rootNode?.id && (
                      <Button
                        variant="secondary"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => {
                          removeNode(selectedNode.id);
                          setSelectedNode(null);
                        }}
                      >
                        Delete Selected Node
                      </Button>
                    )}
                </>
              ) : (
                <Button
                  variant="primary"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => {
                    setSelectedChapter(mindMapModalChapter);
                    setShowAddNodeForm(true);
                    setShowMindMapModal(false);
                  }}
                >
                  Create Root Node
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
