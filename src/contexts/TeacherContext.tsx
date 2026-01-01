import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  teacherDashboardMock,
  teacherLessonsMock,
  teacherAssignmentsMock,
  teacherStudentsMock,
} from "../utils/mockData";

// Shared types for Classes and Subjects
export type BaseClass = {
  id: string;
  name: string;
};

export type BaseSubject = {
  id: string;
  name: string;
  classId: string;
};

type TeacherState = {
  dashboard: typeof teacherDashboardMock;
  lessons: typeof teacherLessonsMock;
  assignments: typeof teacherAssignmentsMock;
  students: typeof teacherStudentsMock;
  // Shared classes and subjects
  classes: BaseClass[];
  subjects: BaseSubject[];
  addClass: (name: string) => string;
  removeClass: (classId: string) => void;
  addSubject: (name: string, classId: string) => string;
  removeSubject: (subjectId: string) => void;
  getSubjectsByClass: (classId: string) => BaseSubject[];
};

const TeacherContext = createContext<TeacherState | null>(null);

export function TeacherProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<BaseClass[]>([]);
  const [subjects, setSubjects] = useState<BaseSubject[]>([]);

  const addClass = (name: string): string => {
    const newClass: BaseClass = {
      id: `class_${Date.now()}`,
      name,
    };
    setClasses((prev) => [...prev, newClass]);
    return newClass.id;
  };

  const removeClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    // Remove all subjects belonging to this class
    setSubjects((prev) => prev.filter((s) => s.classId !== classId));
  };

  const addSubject = (name: string, classId: string): string => {
    const newSubject: BaseSubject = {
      id: `subject_${Date.now()}`,
      name,
      classId,
    };
    setSubjects((prev) => [...prev, newSubject]);
    return newSubject.id;
  };

  const removeSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const getSubjectsByClass = (classId: string): BaseSubject[] => {
    return subjects.filter((s) => s.classId === classId);
  };

  const value = useMemo<TeacherState>(
    () => ({
      dashboard: teacherDashboardMock,
      lessons: teacherLessonsMock,
      assignments: teacherAssignmentsMock,
      students: teacherStudentsMock,
      classes,
      subjects,
      addClass,
      removeClass,
      addSubject,
      removeSubject,
      getSubjectsByClass,
    }),
    [classes, subjects]
  );

  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
}

export function useTeacherContext() {
  const ctx = useContext(TeacherContext);
  if (!ctx)
    throw new Error("useTeacherContext must be used within TeacherProvider");
  return ctx;
}
