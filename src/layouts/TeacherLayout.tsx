import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

export default function TeacherLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar role="teacher" />
      <div className="flex w-full flex-col">
        <Header />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
