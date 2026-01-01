export type JsonDocument = {
  title: string;
  description: string;
  schema: object;
  example: object;
  apiRequest: object;
  apiResponse: object;
};

const jsonSchemas: Record<string, JsonDocument> = {
  teacherDashboard: {
    title: "Teacher Dashboard",
    description: "Stats, activity, performance, and deadlines overview.",
    schema: {
      dashboardStats: {
        totalStudents: "number: total enrolled students",
        pendingAssignments: "number: assignments awaiting grading",
        pendingPosts: "number: posts awaiting approval",
        activeClasses: "number: classes assigned to teacher",
        trend: {
          students: "string: delta e.g. '+8%'",
          assignments: "string: delta e.g. '-3'",
          posts: "string: delta e.g. '+2'",
        },
      },
      recentActivity: [
        {
          id: "string",
          type: "'submission' | 'post' | 'comment'",
          student: "string",
          action: "string",
          timestamp: "ISO date string",
        },
      ],
      classPerformance: [
        {
          class: "string",
          averageScore: "number",
          totalStudents: "number",
          completionRate: "number percentage",
        },
      ],
      upcomingDeadlines: [
        {
          id: "string",
          title: "string",
          dueDate: "ISO date string",
          pendingSubmissions: "number",
        },
      ],
    },
    example: {
      dashboardStats: {
        totalStudents: 150,
        pendingAssignments: 12,
        pendingPosts: 5,
        activeClasses: 4,
        trend: { students: "+8%", assignments: "-3", posts: "+2" },
      },
      recentActivity: [
        {
          id: "act_1",
          type: "submission",
          student: "John Doe",
          action: "Submitted assignment 'Trigonometry Quiz'",
          timestamp: "2025-01-12T14:30:00Z",
        },
      ],
      classPerformance: [
        {
          class: "Class 10-A",
          averageScore: 85.5,
          totalStudents: 40,
          completionRate: 92,
        },
      ],
      upcomingDeadlines: [
        {
          id: "deadline_1",
          title: "Physics Assignment",
          dueDate: "2025-01-15T23:59:00Z",
          pendingSubmissions: 12,
        },
      ],
    },
    apiRequest: {
      method: "GET",
      url: "/api/teacher/dashboard",
      params: { includePerformance: true, includeActivity: true },
    },
    apiResponse: {
      status: 200,
      data: {
        /* same shape as example */
      },
    },
  },
  teacherLessons: {
    title: "Lesson Management",
    description: "Chapter structure with nested tabs, contents, and mind map.",
    schema: {
      lesson: {
        id: "string",
        teacherId: "string",
        class: { id: "string", name: "string" },
        subject: { id: "string", name: "string" },
        chapter: {
          id: "string",
          title: "string",
          description: "string",
          structure: {
            tabs: [
              {
                id: "string",
                name: "string",
                order: "number",
                contentType: "'text' | 'video' | 'image' | 'pdf' | 'mixed'",
                content: "string | object",
                subTabs: "recursive",
              },
            ],
          },
          contents: [
            {
              id: "string",
              type: "'video' | 'pdf' | 'image' | 'text'",
              title: "string",
              url: "string",
              order: "number",
            },
          ],
          mindMap: { nodes: "React Flow nodes", edges: "React Flow edges" },
          status: "'draft' | 'published'",
        },
      },
    },
    example: {
      lesson: {
        id: "lesson_123",
        teacherId: "tch_001",
        class: { id: "cls_10a", name: "Class 10-A" },
        subject: { id: "subj_math", name: "Mathematics" },
        chapter: {
          id: "chap_456",
          title: "Trigonometry",
          description: "Introduction to trigonometric ratios and identities",
          structure: {
            tabs: [
              {
                id: "tab_1",
                name: "Introduction",
                order: 1,
                contentType: "text",
                content: "Trigonometry is the study of...",
                subTabs: [
                  {
                    id: "subtab_1",
                    name: "History",
                    contentType: "text",
                    content: "...",
                    subTabs: [],
                  },
                ],
              },
            ],
          },
          contents: [
            {
              id: "cont_1",
              type: "video",
              title: "Introduction to Trigonometry",
              url: "https://example.com/intro.mp4",
              order: 1,
            },
          ],
          mindMap: {
            nodes: [
              {
                id: "node_1",
                data: { label: "Trigonometry" },
                position: { x: 250, y: 0 },
              },
              {
                id: "node_2",
                data: { label: "Ratios" },
                position: { x: 450, y: 120 },
              },
            ],
            edges: [
              {
                id: "edge_1",
                source: "node_1",
                target: "node_2",
                animated: true,
              },
            ],
          },
          status: "published",
        },
      },
    },
    apiRequest: {
      method: "POST",
      url: "/api/teacher/lessons",
      body: {
        /* lesson payload */
      },
    },
    apiResponse: {
      status: 201,
      data: { lessonId: "lesson_123", status: "created" },
    },
  },
  teacherAssignments: {
    title: "Assignment Management",
    description: "Multi-step assignment creation and submissions.",
    schema: {
      assignment: {
        id: "string",
        teacherId: "string",
        title: "string",
        class: { id: "string", name: "string" },
        subject: { id: "string", name: "string" },
        instructions: "rich text",
        dueDate: "ISO date",
        availableFrom: "ISO date",
        timeLimit: "number minutes",
        totalPoints: "number",
        passingScore: "number",
        randomizeQuestions: "boolean",
        questions:
          "array of question types (mcq, fill_blank, true_false, match, etc.)",
        submissions: "array of submission summaries",
      },
    },
    example: {
      assignment: {
        id: "assign_789",
        teacherId: "tch_001",
        title: "Trigonometry Quiz",
        class: { id: "cls_10a", name: "Class 10-A" },
        subject: { id: "subj_math", name: "Mathematics" },
        instructions: "<p>Answer all questions carefully...</p>",
        dueDate: "2025-01-15T23:59:00Z",
        availableFrom: "2025-01-08T00:00:00Z",
        timeLimit: 60,
        totalPoints: 50,
        passingScore: 35,
        randomizeQuestions: false,
        questions: [
          { id: "q1", type: "mcq", text: "What is the value of sin(90°)?" },
        ],
        submissions: [
          { id: "sub_456", studentId: "std_101", score: 42, status: "graded" },
        ],
      },
    },
    apiRequest: {
      method: "POST",
      url: "/api/teacher/assignments",
      body: {
        /* assignment */
      },
    },
    apiResponse: {
      status: 201,
      data: { id: "assign_789", status: "published" },
    },
  },
  teacherStudents: {
    title: "Student Management",
    description: "Filtering, performance, notes, and activity.",
    schema: {
      student: {
        id: "string",
        name: "string",
        rollNumber: "string",
        class: { id: "string", name: "string", section: "string" },
        performance: { overall: "number", subjects: "array of subject scores" },
        assignmentHistory: "array",
        notes: "array with category and importance",
        activityLog: "array of events",
      },
    },
    example: {
      student: {
        id: "std_101",
        name: "John Doe",
        rollNumber: "2024-10-A-15",
        class: { id: "cls_10a", name: "Class 10", section: "A" },
        performance: {
          overall: 85.5,
          subjects: [
            {
              id: "subj_math",
              name: "Mathematics",
              score: 90,
              trend: "improving",
            },
          ],
        },
        notes: [
          {
            id: "note_1",
            title: "Excellent progress",
            category: "academic",
            important: true,
          },
        ],
      },
    },
    apiRequest: {
      method: "GET",
      url: "/api/teacher/students",
      params: { classId: "cls_10a" },
    },
    apiResponse: { status: 200, data: { students: [] } },
  },
  teacherPosts: {
    title: "Student Posts (Teacher)",
    description: "Pending and approved posts with moderation.",
    schema: {
      post: {
        id: "string",
        student: { id: "string", name: "string", class: "string" },
        subject: { id: "string", name: "string" },
        chapter: { id: "string", title: "string" },
        title: "string",
        content: { text: "string", media: "array" },
        status: "'pending' | 'approved' | 'declined' | 'draft'",
        feedback: "string | null",
        approvedBy: "teacher summary",
      },
    },
    example: {
      post: {
        id: "post_555",
        student: { id: "std_101", name: "John Doe", class: "Class 10-A" },
        subject: { id: "subj_sci", name: "Science" },
        chapter: { id: "chap_789", title: "Photosynthesis" },
        title: "My Garden Experiment",
        content: {
          text: "I conducted an experiment...",
          media: [
            {
              id: "media_1",
              type: "image",
              url: "https://example.com/plant1.jpg",
            },
          ],
        },
        status: "pending",
        submittedAt: "2025-01-10T14:30:00Z",
        feedback: null,
      },
    },
    apiRequest: {
      method: "PATCH",
      url: "/api/teacher/posts/post_555",
      body: { status: "approved", feedback: "" },
    },
    apiResponse: {
      status: 200,
      data: { status: "approved", approvedAt: "2025-01-09T16:30:00Z" },
    },
  },
  aiAssistant: {
    title: "AI Assistant",
    description: "Help content, FAQs, tutorials, and support ticket form.",
    schema: {
      categories: "array of guide categories with articles",
      faqs: "array of FAQ entries with helpful counters",
      tutorials: "array of step-based tutorials",
      supportTicket: {
        title: "string",
        description: "string",
        priority: "'low' | 'medium' | 'high'",
        attachments: "array of file meta",
        category: "string",
      },
    },
    example: {
      categories: [{ id: "cat_1", name: "Platform Guide", icon: "book" }],
      faqs: [
        {
          id: "faq_1",
          question: "How do I create a lesson?",
          helpful: 45,
          notHelpful: 2,
        },
      ],
      supportTicket: {
        title: "",
        description: "",
        priority: "medium",
        attachments: [],
        category: "technical",
      },
    },
    apiRequest: {
      method: "POST",
      url: "/api/support/tickets",
      body: { title: "Issue", description: "Details", priority: "medium" },
    },
    apiResponse: {
      status: 201,
      data: { ticketId: "ticket_123", status: "open" },
    },
  },
  teacherProfile: {
    title: "Teacher Profile",
    description: "Personal and professional details with preferences.",
    schema: {
      teacher: {
        id: "string",
        personalInfo: "contact and demographic fields",
        professional: {
          employeeId: "string",
          qualifications: "array",
          experience: "object",
          specializations: "array of strings",
        },
        assignments: "array of classes and subjects",
        preferences: { notifications: "object", display: "object" },
        activityLog: "array of events",
      },
    },
    example: {
      teacher: {
        id: "tch_001",
        personalInfo: {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@school.edu",
        },
        professional: {
          employeeId: "EMP2020001",
          specializations: ["Algebra", "Geometry"],
        },
        assignments: [
          {
            classId: "cls_10a",
            className: "Class 10-A",
            subjects: [{ id: "subj_math", name: "Mathematics" }],
          },
        ],
        preferences: { notifications: { email: { newSubmissions: true } } },
      },
    },
    apiRequest: {
      method: "PUT",
      url: "/api/teacher/profile",
      body: { personalInfo: {}, preferences: {} },
    },
    apiResponse: { status: 200, data: { status: "updated" } },
  },
  studentDashboard: {
    title: "Student Dashboard",
    description: "Assignments, lessons, performance, and friends.",
    schema: {
      studentDashboard: {
        student: "profile summary",
        upcomingAssignments: "array of assignment summaries",
        recentLessons: "array of lesson progress summaries",
        performance: "overall + subject scores",
        friendActivity: "leaderboard and social updates",
      },
    },
    example: {
      studentDashboard: {
        student: { id: "std_101", name: "John Doe", class: "Class 10-A" },
        upcomingAssignments: [
          {
            id: "assign_789",
            title: "Trigonometry Quiz",
            status: "not_started",
          },
        ],
        recentLessons: [
          { id: "lesson_123", subject: "Mathematics", progress: 75 },
        ],
        performance: {
          overall: 85.5,
          subjects: [{ name: "Mathematics", score: 90, trend: "up" }],
        },
        friendActivity: {
          leaderboard: [{ rank: 1, name: "Jane Doe", score: 950 }],
          friendRequests: 2,
        },
      },
    },
    apiRequest: { method: "GET", url: "/api/student/dashboard" },
    apiResponse: {
      status: 200,
      data: {
        /* same as example */
      },
    },
  },
  studentLessons: {
    title: "Student Lessons",
    description: "Subject navigation, chapter list, content viewer, mind map.",
    schema: {
      lesson: {
        subject: {
          id: "string",
          name: "string",
          completionPercentage: "number",
        },
        chapter: {
          id: "string",
          title: "string",
          contents: "array of content items",
          mindMap: "nodes and edges",
          progress: "number",
          bookmarked: "boolean",
        },
      },
    },
    example: {
      lesson: {
        subject: {
          id: "subj_math",
          name: "Mathematics",
          completionPercentage: 75,
        },
        chapter: {
          id: "chap_456",
          title: "Trigonometry",
          contents: [
            {
              id: "cont_1",
              type: "video",
              title: "Introduction to Trigonometry",
            },
          ],
          mindMap: {
            nodes: [
              {
                id: "node_1",
                data: { label: "Trigonometry" },
                position: { x: 0, y: 0 },
              },
            ],
            edges: [],
          },
          progress: 60,
          bookmarked: true,
        },
      },
    },
    apiRequest: {
      method: "GET",
      url: "/api/student/lessons",
      params: { subjectId: "subj_math" },
    },
    apiResponse: { status: 200, data: { chapters: [] } },
  },
  studentAssignments: {
    title: "Student Assignments",
    description: "Assignment list, taking interface, results.",
    schema: {
      assignment: {
        id: "string",
        title: "string",
        subject: "string",
        dueDate: "ISO date",
        totalPoints: "number",
        passingScore: "number",
        timeLimit: "number",
        questions: "array of questions by type",
        studentProgress: "answers and autosave metadata",
      },
    },
    example: {
      assignment: {
        id: "assign_789",
        title: "Trigonometry Quiz",
        subject: "Mathematics",
        dueDate: "2025-01-15T23:59:00Z",
        totalPoints: 50,
        passingScore: 35,
        timeLimit: 60,
        questions: [
          {
            id: "q1",
            type: "mcq",
            text: "What is the value of sin(90°)?",
            options: [
              { id: "opt_1", text: "0" },
              { id: "opt_2", text: "1" },
            ],
            correctAnswer: "opt_2",
          },
        ],
        studentProgress: {
          startedAt: "2025-01-12T18:00:00Z",
          answers: [
            { questionId: "q1", answer: "opt_2", flaggedForReview: false },
          ],
          autoSaveStatus: "saved",
        },
      },
    },
    apiRequest: {
      method: "POST",
      url: "/api/student/assignments/assign_789/submit",
      body: { answers: [] },
    },
    apiResponse: {
      status: 200,
      data: { submissionId: "sub_456", totalScore: 42 },
    },
  },
  studentPosts: {
    title: "Student Posts",
    description: "Feed, my posts, interactions, creation.",
    schema: {
      post: {
        id: "string",
        author: "student summary",
        subject: "subject summary",
        chapter: "chapter summary",
        content: { html: "string", media: "array" },
        tags: "array of strings",
        status: "'draft' | 'pending' | 'approved' | 'declined'",
        interactions: {
          likes: "number",
          comments: "number",
          shares: "number",
          bookmarks: "number",
        },
        userInteraction: { liked: "boolean", bookmarked: "boolean" },
      },
    },
    example: {
      post: {
        id: "post_789",
        author: { id: "std_101", name: "John Doe", class: "Class 10-A" },
        subject: { id: "subj_sci", name: "Science" },
        chapter: { id: "chap_789", title: "Photosynthesis" },
        title: "My Garden Experiment",
        content: { html: "<p>I conducted an experiment...</p>", media: [] },
        tags: ["experiment", "photosynthesis"],
        status: "approved",
        interactions: { likes: 32, comments: 15, shares: 8, bookmarks: 12 },
        userInteraction: { liked: true, bookmarked: false },
      },
    },
    apiRequest: {
      method: "POST",
      url: "/api/student/posts",
      body: { title: "My Garden Experiment", content: { html: "<p>...</p>" } },
    },
    apiResponse: { status: 201, data: { id: "post_789", status: "pending" } },
  },
  friendsLeaderboard: {
    title: "Friends & Leaderboard",
    description: "Ranking, friend management, and chat metadata.",
    schema: {
      leaderboard: {
        scope: "'overall' | 'subject'",
        period: "'all-time' | 'month' | 'week'",
        rankings: "array of rank entries",
        totalStudents: "number",
      },
      friends: "array of friend summaries with scores",
      friendRequests: { received: "array", sent: "array" },
      chat: {
        conversations: "array of conversation summaries",
        activeConversation: "messages + typing indicator",
      },
    },
    example: {
      leaderboard: {
        scope: "overall",
        period: "all-time",
        rankings: [
          {
            rank: 1,
            studentId: "std_102",
            name: "Jane Doe",
            score: 950,
            trend: "up",
            isFriend: true,
          },
          {
            rank: 5,
            studentId: "std_101",
            name: "John Doe",
            score: 850,
            trend: "stable",
            isCurrentUser: true,
          },
        ],
        totalStudents: 40,
      },
      friends: [
        {
          id: "std_102",
          name: "Jane Doe",
          overallScore: 950,
          lastActive: "2025-01-12T18:30:00Z",
        },
      ],
      chat: {
        conversations: [{ id: "chat_555", unreadCount: 0 }],
        activeConversation: { messages: [] },
      },
    },
    apiRequest: { method: "GET", url: "/api/student/friends?scope=overall" },
    apiResponse: { status: 200, data: { leaderboard: [], friends: [] } },
  },
  studentProfile: {
    title: "Student Profile",
    description: "Read-only personal, academic, performance, achievements.",
    schema: {
      studentProfile: {
        personalInfo: "identity and contact",
        academicInfo: "class, subjects, attendance",
        performance: "overall + subject performance",
        achievements: "badges and progress",
        activityLog: "timeline items",
      },
    },
    example: {
      studentProfile: {
        personalInfo: {
          firstName: "John",
          lastName: "Doe",
          rollNumber: "2024-10-A-15",
          profilePicture: "https://example.com/profiles/john.jpg",
        },
        academicInfo: {
          class: { id: "cls_10a", name: "Class 10", section: "A" },
          subjects: [
            { id: "subj_math", name: "Mathematics", teacher: "Ms. Jane Smith" },
            { id: "subj_sci", name: "Science", teacher: "Ms. Johnson" },
          ],
          attendance: { percentage: 95.5, presentDays: 172, totalDays: 180 },
        },
        performance: {
          overall: { averageScore: 85.5, totalAssignments: 35 },
          subjects: [
            {
              id: "subj_math",
              name: "Mathematics",
              score: 90,
              trend: "improving",
            },
          ],
        },
        achievements: {
          totalEarned: 8,
          totalAvailable: 20,
          badges: [{ id: "badge_1", title: "Fast Learner", rarity: "rare" }],
          locked: [{ id: "badge_10", title: "Top of the Class", progress: 60 }],
        },
        activityLog: [
          {
            id: "log_1",
            type: "assignment_submitted",
            description: "Submitted 'Trigonometry Quiz'",
          },
        ],
      },
    },
    apiRequest: { method: "GET", url: "/api/student/profile" },
    apiResponse: {
      status: 200,
      data: {
        /* same shape as example */
      },
    },
  },
};

export default jsonSchemas;
