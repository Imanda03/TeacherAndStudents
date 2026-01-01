import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import {
  studentDashboardMock,
  studentAssignmentsMock,
  studentPostsMock,
} from "../utils/mockData";

type StudentState = {
  dashboard: typeof studentDashboardMock;
  assignments: typeof studentAssignmentsMock;
  posts: typeof studentPostsMock;
};

const StudentContext = createContext<StudentState | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
  const value = useMemo<StudentState>(
    () => ({
      dashboard: studentDashboardMock,
      assignments: studentAssignmentsMock,
      posts: studentPostsMock,
    }),
    []
  );

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export function useStudentContext() {
  const ctx = useContext(StudentContext);
  if (!ctx)
    throw new Error("useStudentContext must be used within StudentProvider");
  return ctx;
}
