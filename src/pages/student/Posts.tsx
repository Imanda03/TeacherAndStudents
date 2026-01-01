import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Plus,
  Eye,
  Share2,
  Bookmark,
  Clock,
  CheckCircle,
  XCircle,
  BadgeCheck,
  Send,
  Edit3,
  User,
  Globe,
} from "lucide-react";
import FeatureHeader from "../../components/common/FeatureHeader";
import Modal from "../../components/common/Modal";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { studentPostsMock } from "../../utils/mockData";

type Post =
  | (typeof studentPostsMock.myPosts)[number]
  | (typeof studentPostsMock.explorePosts)[number];

export default function StudentPosts() {
  const [activeTab, setActiveTab] = useState<"explore" | "myPosts">("explore");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);

  // Use mock data
  const myPosts = studentPostsMock.myPosts;
  const explorePosts = studentPostsMock.explorePosts;

  const displayedPosts = activeTab === "myPosts" ? myPosts : explorePosts;

  const myPostsStats = {
    total: myPosts.length,
    pending: myPosts.filter((p) => p?.status === "pending").length,
    approved: myPosts.filter((p) => p?.status === "approved").length,
    declined: myPosts.filter((p) => p?.status === "declined").length,
    totalLikes: myPosts.reduce((sum, p) => sum + (p?.likes ?? 0), 0),
    totalViews: myPosts.reduce((sum, p) => sum + (p?.views ?? 0), 0),
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

  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Posts"
        description="Browse feed, create posts, and interact with the community."
        additionalActions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Post
          </Button>
        }
      />

      {/* Tabs */}
      <Card className="p-1 bg-gray-100">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "explore"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Globe className="h-4 w-4" />
            Explore Posts
          </button>
          <button
            onClick={() => setActiveTab("myPosts")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "myPosts"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <User className="h-4 w-4" />
            My Posts
            {myPostsStats.pending > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-yellow-500 rounded-full">
                {myPostsStats.pending}
              </span>
            )}
          </button>
        </div>
      </Card>

      {/* My Posts Stats */}
      {activeTab === "myPosts" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Total Posts
                </p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {myPostsStats.total}
                </p>
              </div>
              <Edit3 className="h-6 w-6 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  {myPostsStats.pending}
                </p>
              </div>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                  Total Likes
                </p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {myPostsStats.totalLikes}
                </p>
              </div>
              <Heart className="h-6 w-6 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
                  Total Views
                </p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {myPostsStats.totalViews}
                </p>
              </div>
              <Eye className="h-6 w-6 text-green-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Posts Grid */}
      <div
        className={
          activeTab === "explore" ? "grid gap-4 md:grid-cols-2" : "space-y-4"
        }
      >
        {displayedPosts.length === 0 ? (
          <Card className="p-12 text-center col-span-2">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-gray-900">No posts yet</p>
            <p className="text-sm text-gray-600 mt-2">
              {activeTab === "myPosts"
                ? "Create your first post to share with the community!"
                : "No posts available in the community yet"}
            </p>
          </Card>
        ) : (
          displayedPosts.map((post) => {
            const isMyPost = "status" in post;
            return (
              <Card
                key={post?.id}
                className={`p-6 transition-all hover:shadow-xl cursor-pointer ${
                  isMyPost && "status" in post && post?.status === "pending"
                    ? "border-l-4 border-l-yellow-400 bg-yellow-50/30"
                    : isMyPost &&
                      "status" in post &&
                      post?.status === "approved"
                    ? "border-l-4 border-l-green-400 bg-green-50/30"
                    : isMyPost &&
                      "status" in post &&
                      post?.status === "declined"
                    ? "border-l-4 border-l-red-400 bg-red-50/30"
                    : "hover:-translate-y-1"
                }`}
                onClick={() => openPostDetail(post)}
              >
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl shadow-md">
                      {"authorAvatar" in post ? post?.authorAvatar : "👤"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">
                        {"author" in post ? post?.author : "You"}
                      </h4>
                      {isMyPost &&
                        "status" in post &&
                        post?.status === "approved" && (
                          <BadgeCheck className="h-4 w-4 text-green-500" />
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {post?.subject}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(post?.submittedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge for My Posts */}
                  {isMyPost && "status" in post && (
                    <div>
                      {post?.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          <Clock className="h-3 w-3" />
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
                  )}
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {post?.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed line-clamp-3">
                    {post?.content}
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

                {/* Feedback for Declined Posts */}
                {isMyPost &&
                  "status" in post &&
                  post?.status === "declined" &&
                  "feedback" in post &&
                  post?.feedback && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-semibold text-red-700 mb-1">
                        Teacher Feedback:
                      </p>
                      <p className="text-sm text-red-900">{post.feedback}</p>
                    </div>
                  )}

                {/* Post Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {post?.likes ?? 0}
                    </span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {post?.comments ?? 0}
                    </span>
                  </button>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {post?.views ?? 0}
                    </span>
                  </div>
                  <button className="ml-auto flex items-center gap-1.5 text-gray-600 hover:text-purple-500 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-600 hover:text-yellow-500 transition-colors">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Post Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Post"
        description="Share your knowledge with the community"
        wide
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>History</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter post title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              rows={6}
              placeholder="Share your thoughts, findings, or questions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              placeholder="e.g., experiment, research, tutorial"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              icon={<Send className="h-4 w-4" />}
              onClick={() => setShowCreateModal(false)}
            >
              Submit for Review
            </Button>
          </div>
        </div>
      </Modal>

      {/* Post Detail Modal */}
      <Modal
        open={showPostDetail}
        onClose={() => {
          setShowPostDetail(false);
          setSelectedPost(null);
        }}
        title="Post Details"
        description="Full post content"
        wide
      >
        {selectedPost && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl shadow-md">
                {"authorAvatar" in selectedPost
                  ? selectedPost.authorAvatar
                  : "👤"}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">
                  {"author" in selectedPost ? selectedPost.author : "You"}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {selectedPost.subject}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(selectedPost.submittedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {selectedPost.title}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </p>
            </div>

            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Eye className="h-5 w-5" />
                <span className="font-medium">{selectedPost.views} views</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Heart className="h-5 w-5" />
                <span className="font-medium">{selectedPost.likes} likes</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">
                  {selectedPost.comments} comments
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
