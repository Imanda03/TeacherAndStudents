export const APP_NAME = "ThisWay LMS";

export const teacherNav = [
  { label: "Dashboard", path: "/teacher/dashboard", icon: "layout-dashboard" },
  { label: "Lessons", path: "/teacher/lessons", icon: "book-open" },
  { label: "Assignments", path: "/teacher/assignments", icon: "file-text" },
  { label: "Students", path: "/teacher/students", icon: "users" },
  { label: "Posts", path: "/teacher/posts", icon: "message-square" },
  { label: "AI Assistant", path: "/teacher/ai-assistant", icon: "bot" },
  { label: "Profile", path: "/teacher/profile", icon: "user" },
];

export const studentNav = [
  { label: "Dashboard", path: "/student/dashboard", icon: "home" },
  { label: "Lessons", path: "/student/lessons", icon: "book" },
  {
    label: "Assignments",
    path: "/student/assignments",
    icon: "clipboard-list",
  },
  { label: "Posts", path: "/student/posts", icon: "message-circle" },
  { label: "Friends", path: "/student/friends", icon: "users" },
  { label: "Profile", path: "/student/profile", icon: "id-badge" },
];

export const STAT_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#6366F1"];
