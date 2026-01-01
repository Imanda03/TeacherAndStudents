import { Moon, Sun, LogOut, Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { state, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const handleRoleSwitch = () => {
    const newRole = state.role === "teacher" ? "student" : "teacher";
    switchRole(newRole);
    navigate(`/${newRole}/dashboard`);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-semibold text-gray-900">{state.user.name}</span>
        <span className="text-gray-400">•</span>
        <span className="capitalize">{state.role} view</span>
        <Button variant="ghost" className="ml-2" onClick={handleRoleSwitch}>
          Switch to {state.role === "teacher" ? "Student" : "Teacher"}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="p-2"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        <Button variant="ghost" className="p-2" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1">
          <img
            src={state.user.avatar}
            alt={state.user.name}
            className="h-8 w-8 rounded-full"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">
              {state.user.name}
            </p>
            <p className="text-xs text-gray-500">{state.user.email}</p>
          </div>
          <Button
            variant="ghost"
            className="p-2"
            onClick={logout}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
