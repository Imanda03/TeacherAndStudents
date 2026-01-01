export type Diagram = {
  title: string;
  description: string;
  nodes: Array<any>;
  edges: Array<any>;
};

const diagramData: Record<string, Diagram> = {
  teacherDashboard: {
    title: "Teacher Dashboard Flow",
    description: "Data aggregation, performance calc, and navigation triggers.",
    nodes: [
      {
        id: "n1",
        position: { x: 50, y: 40 },
        data: { label: "Data Sources" },
        style: { background: "#DBEAFE" },
      },
      {
        id: "n2",
        position: { x: 260, y: 40 },
        data: { label: "Aggregation Service" },
        style: { background: "#FEF9C3" },
      },
      {
        id: "n3",
        position: { x: 470, y: 40 },
        data: { label: "Dashboard UI" },
        style: { background: "#DCFCE7" },
      },
      {
        id: "n4",
        position: { x: 260, y: 180 },
        data: { label: "Notifications" },
        style: { background: "#FFE4E6" },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "n1",
        target: "n2",
        animated: true,
        label: "fetch",
      },
      { id: "e2-3", source: "n2", target: "n3", label: "render" },
      { id: "e3-4", source: "n3", target: "n4", label: "alerts" },
    ],
  },
  teacherLessons: {
    title: "Lesson Builder",
    description: "Tabs -> Mind map -> Publish.",
    nodes: [
      { id: "n1", position: { x: 50, y: 40 }, data: { label: "Chapter Info" } },
      {
        id: "n2",
        position: { x: 260, y: 40 },
        data: { label: "Dynamic Tabs" },
      },
      {
        id: "n3",
        position: { x: 470, y: 40 },
        data: { label: "Mind Map Generator" },
      },
      {
        id: "n4",
        position: { x: 260, y: 180 },
        data: { label: "Publish/Restore" },
      },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
      { id: "e3-4", source: "n3", target: "n4" },
    ],
  },
  teacherAssignments: {
    title: "Assignment Wizard",
    description: "Steps: Info -> Questions -> Review -> Publish.",
    nodes: [
      { id: "n1", position: { x: 80, y: 60 }, data: { label: "Step 1: Info" } },
      {
        id: "n2",
        position: { x: 280, y: 60 },
        data: { label: "Step 2: Questions" },
      },
      {
        id: "n3",
        position: { x: 480, y: 60 },
        data: { label: "Step 3: Review" },
      },
      {
        id: "n4",
        position: { x: 280, y: 180 },
        data: { label: "Step 4: Publish" },
      },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
      { id: "e3-4", source: "n3", target: "n4", animated: true },
    ],
  },
  teacherStudents: {
    title: "Student Management",
    description: "Filters -> Detail -> Notes -> Activity.",
    nodes: [
      { id: "n1", position: { x: 80, y: 40 }, data: { label: "Filters" } },
      {
        id: "n2",
        position: { x: 280, y: 40 },
        data: { label: "Student Grid" },
      },
      {
        id: "n3",
        position: { x: 480, y: 40 },
        data: { label: "Detail Modal" },
      },
      {
        id: "n4",
        position: { x: 280, y: 180 },
        data: { label: "Notes & Activity" },
      },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2" },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
      { id: "e3-4", source: "n3", target: "n4" },
    ],
  },
  studentDashboard: {
    title: "Student Dashboard",
    description: "Aggregate assignments, lessons, performance, and friends.",
    nodes: [
      {
        id: "n1",
        position: { x: 60, y: 50 },
        data: { label: "Assignments Service" },
      },
      {
        id: "n2",
        position: { x: 260, y: 50 },
        data: { label: "Lessons Service" },
      },
      {
        id: "n3",
        position: { x: 460, y: 50 },
        data: { label: "Social Service" },
      },
      {
        id: "n4",
        position: { x: 260, y: 180 },
        data: { label: "Dashboard UI" },
      },
    ],
    edges: [
      { id: "e1-4", source: "n1", target: "n4", animated: true },
      { id: "e2-4", source: "n2", target: "n4", animated: true },
      { id: "e3-4", source: "n3", target: "n4", animated: true },
    ],
  },
  studentAssignments: {
    title: "Assignment Lifecycle",
    description: "Start -> Answer -> Autosave -> Submit -> Results.",
    nodes: [
      { id: "n1", position: { x: 60, y: 60 }, data: { label: "Start" } },
      { id: "n2", position: { x: 200, y: 60 }, data: { label: "Answer" } },
      { id: "n3", position: { x: 340, y: 60 }, data: { label: "Autosave" } },
      { id: "n4", position: { x: 480, y: 60 }, data: { label: "Submit" } },
      { id: "n5", position: { x: 260, y: 180 }, data: { label: "Results" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", label: "30s" },
      { id: "e3-4", source: "n3", target: "n4", animated: true },
      { id: "e4-5", source: "n4", target: "n5", animated: true },
    ],
  },
  studentLessons: {
    title: "Lesson Viewer",
    description: "Subject -> Chapter -> Content -> Progress.",
    nodes: [
      { id: "n1", position: { x: 80, y: 50 }, data: { label: "Subjects" } },
      { id: "n2", position: { x: 260, y: 50 }, data: { label: "Chapters" } },
      {
        id: "n3",
        position: { x: 440, y: 50 },
        data: { label: "Content Viewer" },
      },
      { id: "n4", position: { x: 260, y: 170 }, data: { label: "Mind Map" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2" },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
      { id: "e2-4", source: "n2", target: "n4" },
    ],
  },
  studentPosts: {
    title: "Post Flow",
    description: "Create -> Submit -> Approve -> Interact.",
    nodes: [
      { id: "n1", position: { x: 60, y: 60 }, data: { label: "Create/Edit" } },
      {
        id: "n2",
        position: { x: 240, y: 60 },
        data: { label: "Submit for Approval" },
      },
      {
        id: "n3",
        position: { x: 420, y: 60 },
        data: { label: "Teacher Review" },
      },
      {
        id: "n4",
        position: { x: 240, y: 170 },
        data: { label: "Feed & Interactions" },
      },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3" },
      { id: "e3-4", source: "n3", target: "n4", animated: true },
    ],
  },
  friendsLeaderboard: {
    title: "Friends & Leaderboard",
    description: "Scores -> Ranking -> Social -> Chat.",
    nodes: [
      {
        id: "n1",
        position: { x: 60, y: 60 },
        data: { label: "Score Aggregation" },
      },
      { id: "n2", position: { x: 260, y: 60 }, data: { label: "Leaderboard" } },
      { id: "n3", position: { x: 460, y: 60 }, data: { label: "Friends" } },
      { id: "n4", position: { x: 260, y: 180 }, data: { label: "Chat" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3" },
      { id: "e3-4", source: "n3", target: "n4", animated: true },
    ],
  },
};

export default diagramData;
