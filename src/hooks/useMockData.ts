import { useTeacherContext } from "../contexts/TeacherContext";
import { useStudentContext } from "../contexts/StudentContext";

export function useMockData() {
  const teacher = useTeacherContext();
  const student = useStudentContext();
  return { teacher, student };
}
