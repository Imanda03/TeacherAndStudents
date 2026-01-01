export const teacherDashboardMock = {
  stats: {
    totalStudents: 150,
    pendingAssignments: 12,
    pendingPosts: 5,
    activeClasses: 4,
    trend: {
      students: "+8%",
      assignments: "-3",
      posts: "+2",
    },
  },
  activity: [
    {
      id: "act_1",
      type: "submission",
      student: "John Doe",
      action: "Submitted assignment 'Trigonometry Quiz'",
      timestamp: "2025-01-12T14:30:00Z",
    },
    {
      id: "act_2",
      type: "post",
      student: "Jane Smith",
      action: "Posted in Science: Photosynthesis",
      timestamp: "2025-01-12T11:10:00Z",
    },
  ],
  deadlines: [
    {
      id: "deadline_1",
      title: "Physics Assignment",
      dueDate: "2025-01-15T23:59:00Z",
      pendingSubmissions: 12,
    },
    {
      id: "deadline_2",
      title: "Chemistry Lab Report",
      dueDate: "2025-01-20T23:59:00Z",
      pendingSubmissions: 7,
    },
  ],
  performance: [
    {
      class: "Class 10-A",
      averageScore: 85.5,
      totalStudents: 40,
      completionRate: 92,
    },
    {
      class: "Class 10-B",
      averageScore: 81.2,
      totalStudents: 35,
      completionRate: 88,
    },
  ],
};

export const teacherLessonsMock = {
  tree: [
    {
      id: "cls_10a",
      label: "Class 10-A",
      children: [
        {
          id: "math",
          label: "Mathematics",
          children: [
            { id: "trig", label: "Trigonometry" },
            { id: "alg", label: "Algebra" },
          ],
        },
        {
          id: "sci",
          label: "Science",
          children: [{ id: "chem", label: "Chemistry" }],
        },
      ],
    },
  ],
  tabs: [
    { id: "tab_1", name: "Introduction", contentType: "text", order: 1 },
    { id: "tab_2", name: "Core Concepts", contentType: "mixed", order: 2 },
  ],
};

export const teacherAssignmentsMock = {
  list: [
    {
      id: "assign_789",
      title: "Trigonometry Quiz",
      class: "Class 10-A",
      subject: "Mathematics",
      dueDate: "2025-01-15T23:59:00Z",
      submissions: { received: 28, total: 32 },
      status: "published",
    },
    {
      id: "assign_790",
      title: "Photosynthesis Report",
      class: "Class 10-B",
      subject: "Science",
      dueDate: "2025-01-18T23:59:00Z",
      submissions: { received: 12, total: 30 },
      status: "draft",
    },
  ],
};

export const teacherStudentsMock = {
  filters: {
    classes: ["Class 10-A", "Class 10-B", "Class 10-C"],
    subjects: ["Mathematics", "Science", "English"],
  },
  students: [
    {
      id: "std_101",
      name: "John Doe",
      rollNumber: "2024-10-A-15",
      class: "Class 10-A",
      section: "A",
      score: 85.5,
      trend: "up",
    },
    {
      id: "std_102",
      name: "Jane Smith",
      rollNumber: "2024-10-A-12",
      class: "Class 10-A",
      section: "A",
      score: 92.3,
      trend: "up",
    },
  ],
};

export const studentDashboardMock = {
  student: {
    id: "std_101",
    name: "John Doe",
    class: "Class 10-A",
    profilePicture: "https://placehold.co/64x64",
  },
  upcomingAssignments: [
    {
      id: "assign_789",
      title: "Trigonometry Quiz",
      subject: "Mathematics",
      dueDate: "2025-01-15T23:59:00Z",
      status: "not_started",
      totalPoints: 50,
    },
    {
      id: "assign_790",
      title: "Photosynthesis Lab Report",
      subject: "Science",
      dueDate: "2025-01-16T23:59:00Z",
      status: "in_progress",
      totalPoints: 40,
    },
  ],
  recentLessons: [
    {
      id: "lesson_123",
      subject: "Mathematics",
      chapter: "Trigonometry",
      lastViewed: "2025-01-12T16:30:00Z",
      progress: 75,
    },
  ],
};

export const studentAssignmentsMock = {
  list: [
    {
      id: "assign_789",
      title: "Trigonometry Quiz",
      subject: "Mathematics",
      class: "Class 10-A",
      dueDate: "2025-01-15T23:59:00Z",
      status: "not_started",
      totalPoints: 50,
      totalQuestions: 10,
      description:
        "Test your understanding of trigonometric ratios, identities, and their applications.",
      questions: [
        {
          id: "q1",
          questionText: "What is the value of sin(30°)?",
          type: "mcq",
          marks: 5,
          correctAnswer: "1/2",
          options: ["1/2", "√3/2", "1", "0"],
        },
        {
          id: "q2",
          questionText:
            "The Pythagorean identity states that sin²θ + cos²θ = ?",
          type: "mcq",
          marks: 5,
          correctAnswer: "1",
          options: ["0", "1", "2", "sin²θ"],
        },
        {
          id: "q3",
          questionText: "If tan θ = opposite/adjacent, what is cot θ equal to?",
          type: "short-answer",
          marks: 5,
          correctAnswer: "adjacent/opposite",
        },
      ],
      score: null,
      submittedAt: null,
      autoSaved: false,
    },
    {
      id: "assign_790",
      title: "Photosynthesis Lab Report",
      subject: "Science",
      class: "Class 10-A",
      dueDate: "2025-01-16T23:59:00Z",
      status: "in_progress",
      totalPoints: 40,
      totalQuestions: 5,
      description:
        "Document your observations and findings from the photosynthesis experiment.",
      questions: [
        {
          id: "q1",
          questionText:
            "Describe the process of photosynthesis in your own words.",
          type: "essay",
          marks: 10,
          correctAnswer: "",
        },
        {
          id: "q2",
          questionText: "What are the reactants of photosynthesis?",
          type: "fill-in-blanks",
          marks: 5,
          correctAnswer: "Carbon dioxide and water",
        },
        {
          id: "q3",
          questionText: "Photosynthesis produces oxygen as a byproduct.",
          type: "true-false",
          marks: 3,
          correctAnswer: "true",
        },
      ],
      score: null,
      submittedAt: null,
      autoSaved: true,
      lastAutoSave: "2025-01-15T14:30:00Z",
    },
    {
      id: "assign_791",
      title: "Algebra Problem Set",
      subject: "Mathematics",
      class: "Class 10-A",
      dueDate: "2025-01-20T23:59:00Z",
      status: "completed",
      totalPoints: 60,
      totalQuestions: 12,
      description:
        "Solve linear and quadratic equations using various methods.",
      questions: [
        {
          id: "q1",
          questionText: "Solve for x: 2x + 5 = 15",
          type: "short-answer",
          marks: 5,
          correctAnswer: "x = 5",
        },
        {
          id: "q2",
          questionText:
            "Which method can be used to solve quadratic equations?",
          type: "mcq",
          marks: 5,
          correctAnswer: "All of the above",
          options: [
            "Factoring",
            "Quadratic formula",
            "Completing the square",
            "All of the above",
          ],
        },
      ],
      score: 55,
      submittedAt: "2025-01-18T16:45:00Z",
      autoSaved: false,
      feedback:
        "Excellent work! Your problem-solving approach is clear and methodical.",
    },
    {
      id: "assign_792",
      title: "Chemical Reactions Quiz",
      subject: "Science",
      class: "Class 10-A",
      dueDate: "2025-01-25T23:59:00Z",
      status: "not_started",
      totalPoints: 45,
      totalQuestions: 9,
      description:
        "Assessment on types of chemical reactions and their properties.",
      questions: [
        {
          id: "q1",
          questionText: "What is a synthesis reaction?",
          type: "essay",
          marks: 10,
          correctAnswer: "",
        },
        {
          id: "q2",
          questionText:
            "In the reaction A + B → AB, this is a decomposition reaction.",
          type: "true-false",
          marks: 5,
          correctAnswer: "false",
        },
      ],
      score: null,
      submittedAt: null,
      autoSaved: false,
    },
  ],
};

export const studentPostsMock = {
  myPosts: [
    {
      id: "post_my_001",
      title: "My Understanding of Trigonometry",
      subject: "Mathematics",
      content:
        "After studying trigonometry for the past few weeks, I've realized how powerful these concepts are. The way sine, cosine, and tangent relate to real-world problems like calculating heights of buildings or distances is fascinating. I created a visual guide to help remember the ratios using the mnemonic SOH-CAH-TOA...",
      submittedAt: "2025-01-14T11:00:00Z",
      status: "pending",
      likes: 0,
      comments: 0,
      views: 3,
      tags: ["Mathematics", "Trigonometry", "Learning"],
    },
    {
      id: "post_my_002",
      title: "Photosynthesis Experiment Results",
      subject: "Science",
      content:
        "I conducted an experiment to observe how different light conditions affect plant growth. Over two weeks, I kept three plants in different environments: full sunlight, partial shade, and complete darkness. The results were remarkable! The plant in full sunlight grew 12cm, partial shade 7cm, and the one in darkness only 2cm with pale leaves...",
      submittedAt: "2025-01-10T15:30:00Z",
      status: "approved",
      likes: 24,
      comments: 8,
      views: 156,
      tags: ["Biology", "Experiment", "Plants"],
    },
    {
      id: "post_my_003",
      title: "Linear Equations in Daily Life",
      subject: "Mathematics",
      content:
        "I never thought algebra would be so practical until I started noticing linear equations everywhere! From calculating monthly savings to planning travel distances, these concepts are incredibly useful...",
      submittedAt: "2025-01-08T09:20:00Z",
      status: "declined",
      likes: 0,
      comments: 0,
      views: 5,
      tags: ["Mathematics", "Algebra"],
      feedback:
        "Good observation, but please expand on your examples with more detailed calculations and real-world scenarios.",
    },
  ],
  explorePosts: [
    {
      id: "post_101",
      author: "Alex Johnson",
      authorAvatar: "🧑‍💻",
      subject: "Computer Science",
      title: "Introduction to Machine Learning",
      content:
        "Machine learning is transforming how we solve complex problems. I built my first neural network using Python and TensorFlow to recognize handwritten digits. The accuracy reached 95% after training on the MNIST dataset...",
      submittedAt: "2025-01-12T14:00:00Z",
      status: "approved",
      likes: 89,
      comments: 23,
      views: 342,
      tags: ["AI", "Python", "Technology"],
    },
    {
      id: "post_102",
      author: "Maya Patel",
      authorAvatar: "👩‍🔬",
      subject: "Chemistry",
      title: "The Chemistry of Cooking",
      content:
        "Cooking is essentially applied chemistry! The Maillard reaction is responsible for the browning of meat and creates hundreds of flavor compounds. When proteins and sugars are heated together, they undergo a complex series of chemical reactions...",
      submittedAt: "2025-01-11T11:30:00Z",
      status: "approved",
      likes: 156,
      comments: 41,
      views: 567,
      tags: ["Chemistry", "Food Science"],
    },
    {
      id: "post_103",
      author: "Oliver Brown",
      authorAvatar: "🎨",
      subject: "History",
      title: "The Renaissance: A Cultural Revolution",
      content:
        "The Renaissance wasn't just about art - it was a complete transformation of how people thought about science, religion, and humanity. Artists like Leonardo da Vinci were also scientists and inventors...",
      submittedAt: "2025-01-10T16:45:00Z",
      status: "approved",
      likes: 203,
      comments: 38,
      views: 891,
      tags: ["History", "Art", "Culture"],
    },
    {
      id: "post_104",
      author: "Isabella Garcia",
      authorAvatar: "🌍",
      subject: "Geography",
      title: "Climate Change and Coastal Cities",
      content:
        "Rising sea levels pose a significant threat to coastal cities worldwide. My research shows that cities like Miami and Venice could face serious flooding challenges by 2050...",
      submittedAt: "2025-01-09T13:20:00Z",
      status: "approved",
      likes: 127,
      comments: 29,
      views: 445,
      tags: ["Environment", "Climate"],
    },
    {
      id: "post_105",
      author: "Emma Wilson",
      authorAvatar: "🧑‍🎓",
      subject: "Science",
      title: "My Plant Growth Experiment",
      content:
        "I observed how different amounts of sunlight affect plant growth over 2 weeks. Plants with 6-8 hours of sunlight grew 40% taller than those with only 2-3 hours...",
      submittedAt: "2025-01-15T10:30:00Z",
      status: "approved",
      likes: 45,
      comments: 12,
      views: 234,
      tags: ["Biology", "Experiment"],
    },
    {
      id: "post_106",
      author: "Liam Chen",
      authorAvatar: "👨‍🎓",
      subject: "Mathematics",
      title: "Real-World Applications of Geometry",
      content:
        "Today I discovered how architects use the Pythagorean theorem to ensure buildings are structurally sound. I calculated the diagonal measurements of my room and confirmed they form right triangles...",
      submittedAt: "2025-01-14T15:20:00Z",
      status: "approved",
      likes: 67,
      comments: 15,
      views: 312,
      tags: ["Geometry", "Architecture"],
    },
  ],
};

export const studentLessonsMock = {
  subjects: [
    {
      id: "subj_math",
      name: "Mathematics",
      completion: 75,
      totalChapters: 4,
      completedChapters: 3,
    },
    {
      id: "subj_sci",
      name: "Science",
      completion: 60,
      totalChapters: 3,
      completedChapters: 2,
    },
    {
      id: "subj_eng",
      name: "English",
      completion: 85,
      totalChapters: 5,
      completedChapters: 4,
    },
  ],
  chapters: [
    {
      id: "chap_456",
      title: "Trigonometry",
      subject: "Mathematics",
      subjectId: "subj_math",
      progress: 80,
      totalContents: 5,
      completedContents: 4,
      mindMap: {
        id: "mindmap_trig",
        rootNode: {
          id: "node_trig_root",
          label: "Trigonometry",
          description: "Study of triangles and their properties",
          color: "#3B82F6",
          children: [
            {
              id: "node_trig_ratios",
              label: "Trigonometric Ratios",
              description: "Sin, Cos, Tan and their relationships",
              color: "#10B981",
              children: [
                {
                  id: "node_trig_sine",
                  label: "Sine",
                  description: "Opposite / Hypotenuse",
                  color: "#8B5CF6",
                  children: [],
                },
                {
                  id: "node_trig_cosine",
                  label: "Cosine",
                  description: "Adjacent / Hypotenuse",
                  color: "#8B5CF6",
                  children: [],
                },
              ],
            },
            {
              id: "node_trig_identities",
              label: "Trigonometric Identities",
              description: "Fundamental trigonometric equations",
              color: "#F59E0B",
              children: [],
            },
          ],
        },
      },
      materials: [
        {
          id: "mat_trig_1",
          type: "video",
          title: "Introduction to Trigonometry",
          url: "https://example.com/video/trig-intro",
          createdAt: "2025-01-10T10:00:00Z",
        },
        {
          id: "mat_trig_2",
          type: "pdf",
          title: "Trigonometric Ratios Guide",
          url: "https://example.com/pdf/trig-ratios.pdf",
          createdAt: "2025-01-11T14:30:00Z",
        },
        {
          id: "mat_trig_3",
          type: "text",
          title: "Practice Problems",
          content:
            "Solve various trigonometry problems to master the concepts.",
          createdAt: "2025-01-12T09:00:00Z",
        },
      ],
    },
    {
      id: "chap_457",
      title: "Algebra",
      subject: "Mathematics",
      subjectId: "subj_math",
      progress: 65,
      totalContents: 4,
      completedContents: 3,
      mindMap: {
        id: "mindmap_algebra",
        rootNode: {
          id: "node_alg_root",
          label: "Algebra",
          description: "Mathematical symbols and rules",
          color: "#EF4444",
          children: [
            {
              id: "node_alg_linear",
              label: "Linear Equations",
              description: "Equations of first degree",
              color: "#10B981",
              children: [],
            },
            {
              id: "node_alg_quadratic",
              label: "Quadratic Equations",
              description: "Equations of second degree",
              color: "#F59E0B",
              children: [],
            },
          ],
        },
      },
      materials: [
        {
          id: "mat_alg_1",
          type: "video",
          title: "Algebra Basics",
          url: "https://example.com/video/algebra-basics",
          createdAt: "2025-01-08T11:00:00Z",
        },
        {
          id: "mat_alg_2",
          type: "link",
          title: "Interactive Algebra Tool",
          url: "https://example.com/tools/algebra",
          createdAt: "2025-01-09T15:00:00Z",
        },
      ],
    },
    {
      id: "chap_789",
      title: "Photosynthesis",
      subject: "Science",
      subjectId: "subj_sci",
      progress: 90,
      totalContents: 6,
      completedContents: 5,
      mindMap: {
        id: "mindmap_photo",
        rootNode: {
          id: "node_photo_root",
          label: "Photosynthesis",
          description: "Process by which plants make food",
          color: "#10B981",
          children: [
            {
              id: "node_photo_light",
              label: "Light Reaction",
              description: "Occurs in thylakoid membrane",
              color: "#F59E0B",
              children: [
                {
                  id: "node_photo_light_water",
                  label: "Water Splitting",
                  description: "Photolysis of water",
                  color: "#3B82F6",
                  children: [],
                },
                {
                  id: "node_photo_light_atp",
                  label: "ATP Formation",
                  description: "Energy production",
                  color: "#3B82F6",
                  children: [],
                },
              ],
            },
            {
              id: "node_photo_dark",
              label: "Dark Reaction",
              description: "Calvin cycle in stroma",
              color: "#8B5CF6",
              children: [],
            },
          ],
        },
      },
      materials: [
        {
          id: "mat_photo_1",
          type: "video",
          title: "Understanding Photosynthesis",
          url: "https://example.com/video/photosynthesis",
          createdAt: "2025-01-05T09:30:00Z",
        },
        {
          id: "mat_photo_2",
          type: "image",
          title: "Photosynthesis Diagram",
          url: "https://example.com/images/photosynthesis.png",
          createdAt: "2025-01-06T10:00:00Z",
        },
        {
          id: "mat_photo_3",
          type: "pdf",
          title: "Photosynthesis Notes",
          url: "https://example.com/pdf/photosynthesis-notes.pdf",
          createdAt: "2025-01-07T11:00:00Z",
        },
      ],
    },
    {
      id: "chap_790",
      title: "Chemical Reactions",
      subject: "Science",
      subjectId: "subj_sci",
      progress: 40,
      totalContents: 5,
      completedContents: 2,
      mindMap: {
        id: "mindmap_chem",
        rootNode: {
          id: "node_chem_root",
          label: "Chemical Reactions",
          description: "Types and properties of chemical reactions",
          color: "#EF4444",
          children: [
            {
              id: "node_chem_synthesis",
              label: "Synthesis",
              description: "A + B → AB",
              color: "#10B981",
              children: [],
            },
            {
              id: "node_chem_decomposition",
              label: "Decomposition",
              description: "AB → A + B",
              color: "#F59E0B",
              children: [],
            },
          ],
        },
      },
      materials: [
        {
          id: "mat_chem_1",
          type: "video",
          title: "Introduction to Chemical Reactions",
          url: "https://example.com/video/chem-reactions",
          createdAt: "2025-01-13T08:00:00Z",
        },
      ],
    },
  ],
};
