import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { TeacherProvider } from "./contexts/TeacherContext";
import { StudentProvider } from "./contexts/StudentContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TeacherProvider>
          <StudentProvider>
            <App />
            <Toaster position="top-right" />
          </StudentProvider>
        </TeacherProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
