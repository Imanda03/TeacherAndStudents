import { useState } from "react";
import {
  BadgeCheck,
  Clock3,
  Eye,
  XCircle,
  CheckCircle,
  Globe,
  Users,
  Heart,
  Share2,
  Bookmark,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import Card from "../../components/common/Card";
import FeatureHeader from "../../components/common/FeatureHeader";
import Modal from "../../components/common/Modal";
import DiagramViewer from "../../components/common/DiagramViewer";
import jsonSchemas from "../../utils/jsonSchemas";
import diagramData from "../../utils/diagramData";
import Button from "../../components/common/Button";
import JsonViewer from "../../components/common/JsonViewer";

type PostStatus = "pending" | "approved" | "declined";

type Post = {
  id: string;
  student: string;
  studentAvatar?: string;
  subject: string;
  title: string;
  content: string;
  submittedAt: string;
  status: PostStatus;
  likes: number;
  comments: number;
  views: number;
  tags?: string[];
};

// Mock data for student posts (pending review)
const studentPosts: Post[] = [
  {
    id: "post_001",
    student: "Emma Wilson",
    studentAvatar: "🧑‍🎓",
    subject: "Science",
    title: "My Plant Growth Experiment",
    content:
      "I observed how different amounts of sunlight affect plant growth over 2 weeks. Plants with 6-8 hours of sunlight grew 40% taller than those with only 2-3 hours...",
    submittedAt: "2025-01-15T10:30:00Z",
    status: "pending",
    likes: 0,
    comments: 0,
    views: 2,
    tags: ["Biology", "Experiment"],
  },
  {
    id: "post_002",
    student: "Liam Chen",
    studentAvatar: "👨‍🎓",
    subject: "Mathematics",
    title: "Real-World Applications of Geometry",
    content:
      "Today I discovered how architects use the Pythagorean theorem to ensure buildings are structurally sound. I calculated the diagonal measurements...",
    submittedAt: "2025-01-14T15:20:00Z",
    status: "pending",
    likes: 0,
    comments: 0,
    views: 5,
    tags: ["Geometry", "Architecture"],
  },
  {
    id: "post_003",
    student: "Sophia Martinez",
    studentAvatar: "👩‍🎓",
    subject: "English",
    title: "Character Analysis: To Kill a Mockingbird",
    content:
      "Atticus Finch represents moral integrity and justice in the novel. His decision to defend Tom Robinson despite social pressure shows...",
    submittedAt: "2025-01-13T09:15:00Z",
    status: "approved",
    likes: 12,
    comments: 3,
    views: 45,
    tags: ["Literature", "Analysis"],
  },
];

// Mock data for approved posts from everywhere
const explorePosts: Post[] = [
  {
    id: "post_101",
    student: "Alex Johnson",
    studentAvatar: "🧑‍💻",
    subject: "Computer Science",
    title: "Introduction to Machine Learning",
    content:
      "Machine learning is transforming how we solve complex problems. I built my first neural network using Python and TensorFlow...",
    submittedAt: "2025-01-12T14:00:00Z",
    status: "approved",
    likes: 89,
    comments: 23,
    views: 342,
    tags: ["AI", "Python", "Technology"],
  },
  {
    id: "post_102",
    student: "Maya Patel",
    studentAvatar: "👩‍🔬",
    subject: "Chemistry",
    title: "The Chemistry of Cooking",
    content:
      "Cooking is essentially applied chemistry! The Maillard reaction is responsible for the browning of meat and creates hundreds of flavor compounds...",
    submittedAt: "2025-01-11T11:30:00Z",
    status: "approved",
    likes: 156,
    comments: 41,
    views: 567,
    tags: ["Chemistry", "Food Science"],
  },
  {
    id: "post_103",
    student: "Oliver Brown",
    studentAvatar: "🎨",
    subject: "History",
    title: "The Renaissance: A Cultural Revolution",
    content:
      "The Renaissance wasn't just about art - it was a complete transformation of how people thought about science, religion, and humanity...",
    submittedAt: "2025-01-10T16:45:00Z",
    status: "approved",
    likes: 203,
    comments: 38,
    views: 891,
    tags: ["History", "Art", "Culture"],
  },
  {
    id: "post_104",
    student: "Isabella Garcia",
    studentAvatar: "🌍",
    subject: "Geography",
    title: "Climate Change and Coastal Cities",
    content:
      "Rising sea levels pose a significant threat to coastal cities worldwide. My research shows that cities like Miami and Venice could face...",
    submittedAt: "2025-01-09T13:20:00Z",
    status: "approved",
    likes: 127,
    comments: 29,
    views: 445,
    tags: ["Environment", "Climate"],
  },
];

export default function TeacherPosts() {
  const [activeTab, setActiveTab] = useState<"students" | "explore">(
    "students"
  );
  const [showJson, setShowJson] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [posts, setPosts] = useState<Post[]>(studentPosts);

  // Filter posts based on active tab
  const displayedPosts =
    activeTab === "students"
      ? posts.filter((p) => studentPosts.some((sp) => sp?.id === p?.id))
      : explorePosts;

  const pendingCount = posts.filter((p) => p?.status === "pending").length;
  const approvedCount = posts.filter((p) => p?.status === "approved").length;

  const handleApprove = (postId: string) => {
    setPosts(
      posts.map((p) =>
        p?.id === postId ? { ...p, status: "approved" as const } : p
      )
    );
  };

  const handleDecline = (postId: string) => {
    setPosts(
      posts.map((p) =>
        p?.id === postId ? { ...p, status: "declined" as const } : p
      )
    );
    setShowFeedbackForm(null);
    setFeedback("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Student Posts"
        description="Review student posts and explore approved content from the community."
        onShowJson={() => setShowJson(true)}
        onShowDiagram={() => setShowDiagram(true)}
      />

      {/* Tabs */}
      <Card className="p-1 bg-gray-100">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("students")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "students"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="h-4 w-4" />
            My Students Post
            {pendingCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "explore"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Globe className="h-4 w-4" />
            Explore Post
          </button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                Pending Review
              </p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {pendingCount}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <Clock3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
                Approved
              </p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {approvedCount}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                Total Views
              </p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {displayedPosts.reduce((sum, p) => sum + (p?.views || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Posts Grid */}
      {activeTab === "students" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Posts from Your Students
            </h3>
            <span className="text-sm text-gray-500">
              {displayedPosts?.length || 0} total posts
            </span>
          </div>

          {displayedPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-900">
                No student posts yet
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Student posts will appear here for your review
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {displayedPosts?.map((post) => (
                <Card
                  key={post?.id}
                  className={`p-6 transition-all hover:shadow-lg ${
                    post?.status === "pending"
                      ? "border-l-4 border-l-yellow-400 bg-yellow-50/30"
                      : post?.status === "approved"
                      ? "border-l-4 border-l-green-400 bg-green-50/30"
                      : "border-l-4 border-l-red-400 bg-red-50/30"
                  }`}
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl shadow-md">
                          {post.studentAvatar || "👤"}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">
                            {post?.student || "Unknown Student"}
                          </h4>
                          {post?.status === "approved" && (
                            <BadgeCheck className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {post?.subject || "General"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(
                              post?.submittedAt || new Date().toISOString()
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {post?.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          <Clock3 className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                      {post?.status === "approved" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          <CheckCircle className="h-3 w-3" />
                          Approved
                        </span>
                      )}
                      {post?.status === "declined" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          <XCircle className="h-3 w-3" />
                          Declined
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {post?.title || "Untitled Post"}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {post?.content || "No content available"}
                    </p>
                  </div>

                  {/* Tags */}
                  {post?.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {post?.views || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {post?.likes || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {post?.comments || 0}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - Only for pending posts */}
                  {post?.status === "pending" && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                      <Button
                        variant="secondary"
                        className="flex-1 border-2 border-red-200 text-red-600 hover:bg-red-50"
                        icon={<XCircle className="h-4 w-4" />}
                        onClick={() => setShowFeedbackForm(post?.id || "")}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        icon={<CheckCircle className="h-4 w-4" />}
                        onClick={() => handleApprove(post?.id || "")}
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Approved Posts from Community
            </h3>
            <span className="text-sm text-gray-500">
              {explorePosts?.length || 0} posts
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {explorePosts?.map((post) => (
              <Card
                key={post?.id}
                className="p-6 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-purple-200"
              >
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-2xl shadow-md">
                      {post.studentAvatar || "👤"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">
                        {post?.student || "Unknown Student"}
                      </h4>
                      <BadgeCheck className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {post?.subject || "General"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(
                          post?.submittedAt || new Date().toISOString()
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {post?.title || "Untitled Post"}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {post?.content || "No content available"}
                  </p>
                </div>

                {/* Tags */}
                {post?.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-md font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {post?.views || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Heart className="h-4 w-4 text-red-400 fill-red-400" />
                      <span className="text-sm font-medium">
                        {post?.likes || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {post?.comments || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Bookmark className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <Modal
        open={showFeedbackForm !== null}
        onClose={() => {
          setShowFeedbackForm(null);
          setFeedback("");
        }}
        title="Decline Post with Feedback"
        description="Provide constructive feedback to help the student improve."
      >
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Your feedback will be sent to the student.
              Be constructive and specific to help them improve.
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Feedback Message
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Explain what needs to be improved..."
              rows={5}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (showFeedbackForm) {
                  handleDecline(showFeedbackForm);
                }
              }}
              disabled={!feedback.trim()}
            >
              Send Feedback & Decline
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowFeedbackForm(null);
                setFeedback("");
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
        title="Posts JSON"
        description="Moderation schema"
        wide
      >
        <JsonViewer
          jsonData={{
            schema: jsonSchemas.teacherPosts.schema,
            example: jsonSchemas.teacherPosts.example,
            apiRequest: jsonSchemas.teacherPosts.apiRequest,
            apiResponse: jsonSchemas.teacherPosts.apiResponse,
          }}
          title={jsonSchemas.teacherPosts.title}
          description={jsonSchemas.teacherPosts.description}
          onClose={() => setShowJson(false)}
        />
      </Modal>

      <Modal
        open={showDiagram}
        onClose={() => setShowDiagram(false)}
        title="Post Workflow"
        description="Approval flow"
        wide
      >
        <DiagramViewer
          diagramType="flowchart"
          diagramData={diagramData.studentPosts}
          title={diagramData.studentPosts.title}
          description={diagramData.studentPosts.description}
          onClose={() => setShowDiagram(false)}
        />
      </Modal>
    </div>
  );
}
