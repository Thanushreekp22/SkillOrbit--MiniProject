// Sample questions for different skills and difficulty levels
export const sampleQuestions = [
  // JavaScript Questions
  {
    skillName: "JavaScript",
    questionText: "What is the correct way to declare a variable in JavaScript?",
    options: ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
    correctAnswer: "var myVar;",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "In JavaScript, variables can be declared using 'var', 'let', or 'const' keywords."
  },
  {
    skillName: "JavaScript",
    questionText: "Which method is used to add an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correctAnswer: "push()",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "The push() method adds one or more elements to the end of an array."
  },
  {
    skillName: "JavaScript",
    questionText: "What does 'this' keyword refer to in JavaScript?",
    options: ["The current function", "The global object", "The current object", "The parent object"],
    correctAnswer: "The current object",
    difficulty: "intermediate",
    questionType: "multiple-choice",
    explanation: "'this' refers to the object that is currently executing the code."
  },
  {
    skillName: "JavaScript",
    questionText: "What is a closure in JavaScript?",
    options: [
      "A function that has access to variables in its outer scope",
      "A way to close a function",
      "A method to end a loop",
      "A type of variable declaration"
    ],
    correctAnswer: "A function that has access to variables in its outer scope",
    difficulty: "advanced",
    questionType: "multiple-choice",
    explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned."
  },

  // React Questions
  {
    skillName: "React",
    questionText: "What is JSX in React?",
    options: [
      "A JavaScript extension that allows HTML-like syntax",
      "A CSS framework",
      "A database query language",
      "A testing library"
    ],
    correctAnswer: "A JavaScript extension that allows HTML-like syntax",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files."
  },
  {
    skillName: "React",
    questionText: "Which hook is used to manage state in functional components?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: "useState",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "useState is the React hook used to add state to functional components."
  },
  {
    skillName: "React",
    questionText: "What is the purpose of useEffect hook?",
    options: [
      "To manage component state",
      "To handle side effects in functional components",
      "To create context",
      "To optimize performance"
    ],
    correctAnswer: "To handle side effects in functional components",
    difficulty: "intermediate",
    questionType: "multiple-choice",
    explanation: "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or DOM manipulation."
  },

  // Node.js Questions
  {
    skillName: "Node.js",
    questionText: "What is Node.js?",
    options: [
      "A JavaScript runtime built on Chrome's V8 engine",
      "A web browser",
      "A database management system",
      "A CSS framework"
    ],
    correctAnswer: "A JavaScript runtime built on Chrome's V8 engine",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "Node.js is a JavaScript runtime that allows you to run JavaScript on the server side."
  },
  {
    skillName: "Node.js",
    questionText: "Which module is used to create a web server in Node.js?",
    options: ["fs", "http", "path", "url"],
    correctAnswer: "http",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "The 'http' module is used to create HTTP servers and clients in Node.js."
  },
  {
    skillName: "Node.js",
    questionText: "What is middleware in Express.js?",
    options: [
      "Functions that execute during the request-response cycle",
      "Database connection methods",
      "Template engines",
      "Static file servers"
    ],
    correctAnswer: "Functions that execute during the request-response cycle",
    difficulty: "intermediate",
    questionType: "multiple-choice",
    explanation: "Middleware functions are functions that have access to the request and response objects and can execute code during the request-response cycle."
  },

  // Python Questions
  {
    skillName: "Python",
    questionText: "How do you create a list in Python?",
    options: ["list = []", "list = {}", "list = ()", "list = <>"],
    correctAnswer: "list = []",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "Lists in Python are created using square brackets []."
  },
  {
    skillName: "Python",
    questionText: "What is the correct way to define a function in Python?",
    options: ["function myFunc():", "def myFunc():", "func myFunc():", "define myFunc():"],
    correctAnswer: "def myFunc():",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "Functions in Python are defined using the 'def' keyword."
  },
  {
    skillName: "Python",
    questionText: "What is a decorator in Python?",
    options: [
      "A function that modifies another function",
      "A way to add comments",
      "A type of variable",
      "A loop construct"
    ],
    correctAnswer: "A function that modifies another function",
    difficulty: "advanced",
    questionType: "multiple-choice",
    explanation: "A decorator is a function that takes another function as an argument and extends its behavior without explicitly modifying it."
  },

  // MongoDB Questions
  {
    skillName: "MongoDB",
    questionText: "What type of database is MongoDB?",
    options: ["Relational", "Document-oriented", "Graph", "Key-value"],
    correctAnswer: "Document-oriented",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents."
  },
  {
    skillName: "MongoDB",
    questionText: "What is a collection in MongoDB?",
    options: [
      "A group of MongoDB documents",
      "A single document",
      "A database connection",
      "A query result"
    ],
    correctAnswer: "A group of MongoDB documents",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "A collection in MongoDB is a group of documents, similar to a table in relational databases."
  },

  // AWS Questions
  {
    skillName: "AWS",
    questionText: "What does EC2 stand for in AWS?",
    options: [
      "Elastic Compute Cloud",
      "Enhanced Cloud Computing",
      "Elastic Container Cloud",
      "Enterprise Compute Center"
    ],
    correctAnswer: "Elastic Compute Cloud",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "EC2 stands for Elastic Compute Cloud, which provides scalable computing capacity in the AWS cloud."
  },
  {
    skillName: "AWS",
    questionText: "Which AWS service is used for object storage?",
    options: ["EC2", "RDS", "S3", "Lambda"],
    correctAnswer: "S3",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "Amazon S3 (Simple Storage Service) is used for object storage in AWS."
  },

  // Docker Questions
  {
    skillName: "Docker",
    questionText: "What is a Docker container?",
    options: [
      "A lightweight, portable executable package",
      "A virtual machine",
      "A database",
      "A web server"
    ],
    correctAnswer: "A lightweight, portable executable package",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "A Docker container is a lightweight, portable executable package that includes everything needed to run an application."
  },
  {
    skillName: "Docker",
    questionText: "What file is used to define a Docker container?",
    options: ["Dockerfile", "docker.json", "container.yml", "docker.config"],
    correctAnswer: "Dockerfile",
    difficulty: "basic",
    questionType: "multiple-choice",
    explanation: "A Dockerfile is a text file that contains instructions for building a Docker image."
  }
];

// Function to seed questions into database
export const seedQuestions = async (QuestionBank) => {
  try {
    // Check if questions already exist
    const existingCount = await QuestionBank.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} questions. Skipping seed.`);
      return;
    }

    // Insert sample questions
    const result = await QuestionBank.insertMany(sampleQuestions);
    console.log(`✅ Successfully seeded ${result.length} questions into the database`);
    
    // Log statistics
    const stats = await QuestionBank.aggregate([
      {
        $group: {
          _id: "$skillName",
          count: { $sum: 1 },
          difficulties: { $addToSet: "$difficulty" }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    console.log("📊 Question distribution:");
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} questions (${stat.difficulties.join(', ')})`);
    });
    
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
  }
};
