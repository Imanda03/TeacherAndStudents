import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "classnames";
import { APP_NAME, studentNav, teacherNav } from "../../utils/constants";

function getIcon(name: string): LucideIcon {
  // Lazy icon mapping to keep footprint small
  const icons: Record<string, LucideIcon> = {
    "layout-dashboard": LayoutDashboard,
  };
  return icons[name] ?? LayoutDashboard;
}

type SidebarProps = {
  role: "teacher" | "student";
};

export default function Sidebar({ role }: SidebarProps) {
  const links = role === "teacher" ? teacherNav : studentNav;

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-gray-200 bg-white/80 backdrop-blur lg:flex lg:flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
          {role}
        </p>
        <h1 className="text-lg font-semibold text-gray-900">{APP_NAME}</h1>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
