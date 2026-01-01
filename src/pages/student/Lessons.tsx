import { useState } from "react";
import {
  BookOpenCheck,
  Video,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import FeatureHeader from "../../components/common/FeatureHeader";
import Modal from "../../components/common/Modal";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { studentLessonsMock } from "../../utils/mockData";

type MindMapNode = {
  id: string;
  label: string;
  description: string;
  color: string;
  children: MindMapNode[];
};

type Chapter = (typeof studentLessonsMock.chapters)[number];

export default function StudentLessons() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showMindMapModal, setShowMindMapModal] = useState(false);
  const [mindMapChapter, setMindMapChapter] = useState<Chapter | null>(null);

  const subjects = studentLessonsMock.subjects;
  const chapters = selectedSubject
    ? studentLessonsMock.chapters.filter(
        (ch) => ch.subjectId === selectedSubject
      )
    : studentLessonsMock.chapters;

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const openMindMap = (chapter: Chapter) => {
    setMindMapChapter(chapter);
    setShowMindMapModal(true);
    setExpandedNodes(new Set());
  };

  const renderMindMapNode = (node: MindMapNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node?.id);
    const hasChildren = node?.children && node.children.length > 0;

    return (
      <div key={node?.id} className="ml-4">
        <div
          className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 rounded px-2"
          onClick={() => hasChildren && toggleNode(node?.id)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <div className="w-4" />
          )}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: node?.color }}
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{node?.label}</p>
            <p className="text-xs text-gray-500">{node?.description}</p>
          </div>
        </div>
        {isExpanded &&
          hasChildren &&
          node?.children?.map((child) => renderMindMapNode(child, depth + 1))}
      </div>
    );
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Lessons"
        description="Browse subjects, chapters, content, and mind maps."
        additionalActions={
          selectedChapter ? (
            <Button
              variant="secondary"
              onClick={() => setSelectedChapter(null)}
            >
              Back to Chapters
            </Button>
          ) : null
        }
      />

      {!selectedChapter ? (
        <>
          {/* Subjects Overview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              My Subjects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subj) => (
                <Card
                  key={subj.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedSubject === subj.id ? "ring-2 ring-primary-500" : ""
                  }`}
                  onClick={() =>
                    setSelectedSubject(
                      selectedSubject === subj.id ? null : subj.id
                    )
                  }
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {subj.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {subj.completedChapters} of {subj.totalChapters}{" "}
                        chapters completed
                      </p>
                    </div>
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                      {subj.completion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${subj.completion}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Chapters List */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {selectedSubject
                ? `${
                    subjects.find((s) => s.id === selectedSubject)?.name
                  } Chapters`
                : "All Chapters"}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {chapters.map((chap) => (
                <Card key={chap.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {chap.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {chap.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        {chap.completedContents} of {chap.totalContents}{" "}
                        contents completed
                      </p>
                    </div>
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                      {chap.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${chap.progress}%` }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="flex-1"
                      icon={<BookOpenCheck className="h-4 w-4" />}
                      onClick={() => openMindMap(chap)}
                    >
                      Mind Map
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => setSelectedChapter(chap)}
                    >
                      View Materials
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Chapter Details View */
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedChapter?.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedChapter?.subject}
                </p>
              </div>
              <span className="rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
                {selectedChapter?.progress ?? 0}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${selectedChapter?.progress ?? 0}%` }}
              />
            </div>
          </Card>

          {/* Mind Map Section */}
          {selectedChapter?.mindMap?.rootNode && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Chapter Mind Map
              </h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                {renderMindMapNode(selectedChapter.mindMap.rootNode)}
              </div>
            </Card>
          )}

          {/* Learning Materials */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Learning Materials ({selectedChapter?.materials?.length ?? 0})
            </h3>
            <div className="space-y-3">
              {selectedChapter?.materials &&
              selectedChapter.materials.length > 0 ? (
                selectedChapter.materials.map((material, index) => (
                  <div
                    key={material?.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                        {getContentIcon(material?.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {material?.title}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {material?.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {index < (selectedChapter?.completedContents ?? 0) ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                      <Button variant="ghost">
                        {material?.type === "video" ? "Watch" : "View"}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No learning materials available yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Mind Map Modal */}
      <Modal
        open={showMindMapModal}
        onClose={() => {
          setShowMindMapModal(false);
          setExpandedNodes(new Set());
        }}
        title={`${mindMapChapter?.title} - Mind Map`}
        description="Interactive concept map"
        wide
      >
        {mindMapChapter?.mindMap?.rootNode && (
          <div className="p-4 bg-gray-50 rounded-lg max-h-[70vh] overflow-y-auto">
            {renderMindMapNode(mindMapChapter.mindMap.rootNode)}
          </div>
        )}
      </Modal>
    </div>
  );
}
