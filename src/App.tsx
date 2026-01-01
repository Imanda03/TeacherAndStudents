import { Navigate, Route, Routes } from "react-router-dom";
import TeacherLayout from "./layouts/TeacherLayout";
import StudentLayout from "./layouts/StudentLayout";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherLessons from "./pages/teacher/Lessons";
import TeacherAssignments from "./pages/teacher/Assignments";
import TeacherStudents from "./pages/teacher/Students";
import TeacherPosts from "./pages/teacher/Posts";
import AiAssistant from "./pages/teacher/AiAssistant";
import TeacherProfile from "./pages/teacher/Profile";
import StudentDashboard from "./pages/student/Dashboard";
import StudentLessons from "./pages/student/Lessons";
import StudentAssignments from "./pages/student/Assignments";
import StudentPosts from "./pages/student/Posts";
import Friends from "./pages/student/Friends";
import StudentProfile from "./pages/student/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />

      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="lessons" element={<TeacherLessons />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="posts" element={<TeacherPosts />} />
        <Route path="ai-assistant" element={<AiAssistant />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="lessons" element={<StudentLessons />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="posts" element={<StudentPosts />} />
        <Route path="friends" element={<Friends />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
