import mongoose from "mongoose";
import dotenv from "dotenv";
import { QuestionBank } from "../models/index.js";

dotenv.config();

// 8 Job Roles with their core skills
const jobRolesSkills = {
  "Full Stack Developer": ["React", "Node.js", "MongoDB", "TypeScript", "JavaScript"],
  "Data Scientist": ["Python", "SQL", "R", "Machine Learning", "Statistics"],
  "Cloud Engineer": ["AWS", "Docker", "Kubernetes", "Terraform", "Linux"],
  "Mobile Developer": ["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI/UX"],
  "AI/ML Engineer": ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP"],
  "Cybersecurity Specialist": ["Network Security", "Ethical Hacking", "CISSP", "Penetration Testing", "Cryptography"],
  "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "Jenkins", "Ansible"],
  "Data Analyst": ["SQL", "Tableau", "Power BI", "Excel", "Data Visualization"]
};

// Skill-specific question templates with proper options
const getSkillQuestions = (skill, difficulty) => {
  const templates = {
    // MongoDB
    "MongoDB": {
      basic: [
        { q: "What type of database is MongoDB?", options: ["NoSQL document database", "Relational database", "Graph database", "Key-value store"], answer: "NoSQL document database" },
        { q: "What is a collection in MongoDB?", options: ["A group of documents", "A single document", "A database instance", "A query result"], answer: "A group of documents" },
        { q: "Which command is used to insert data in MongoDB?", options: ["insertOne() or insertMany()", "add()", "create()", "put()"], answer: "insertOne() or insertMany()" },
        { q: "What format does MongoDB use to store data?", options: ["BSON (Binary JSON)", "XML", "CSV", "Plain text"], answer: "BSON (Binary JSON)" },
        { q: "What is the default port for MongoDB?", options: ["27017", "3306", "5432", "8080"], answer: "27017" }
      ],
      intermediate: [
        { q: "What is indexing in MongoDB?", options: ["Data structure that improves query performance", "Data backup method", "Security feature", "Replication technique"], answer: "Data structure that improves query performance" },
        { q: "What is aggregation in MongoDB?", options: ["Processing data records and returning computed results", "Joining collections", "Creating backups", "User authentication"], answer: "Processing data records and returning computed results" },
        { q: "What is a replica set in MongoDB?", options: ["Group of MongoDB instances that maintain same data", "Collection of documents", "Set of indexes", "Query optimization tool"], answer: "Group of MongoDB instances that maintain same data" },
        { q: "What is sharding in MongoDB?", options: ["Distributing data across multiple machines", "Creating indexes", "Backing up data", "Querying data"], answer: "Distributing data across multiple machines" },
        { q: "What is the purpose of $lookup in MongoDB?", options: ["Performs left outer join between collections", "Looks up indexes", "Searches documents", "Validates data"], answer: "Performs left outer join between collections" }
      ],
      advanced: [
        { q: "What is the WiredTiger storage engine?", options: ["Default storage engine in MongoDB providing document-level concurrency", "Query optimizer", "Replication manager", "Backup tool"], answer: "Default storage engine in MongoDB providing document-level concurrency" },
        { q: "What is change streams in MongoDB?", options: ["Real-time data change notifications", "Data migration tool", "Backup streams", "Query streams"], answer: "Real-time data change notifications" },
        { q: "What is the oplog in MongoDB?", options: ["Operations log for replication", "Error log", "Query log", "Access log"], answer: "Operations log for replication" },
        { q: "What is MongoDB Atlas?", options: ["Fully-managed cloud database service", "Local MongoDB GUI", "Query language", "Storage engine"], answer: "Fully-managed cloud database service" },
        { q: "What is the purpose of $facet in aggregation?", options: ["Process multiple aggregation pipelines in single stage", "Create indexes", "Join collections", "Filter documents"], answer: "Process multiple aggregation pipelines in single stage" }
      ]
    },
    // TypeScript
    "TypeScript": {
      basic: [
        { q: "What is TypeScript?", options: ["Typed superset of JavaScript", "New programming language", "JavaScript framework", "CSS preprocessor"], answer: "Typed superset of JavaScript" },
        { q: "How do you define a variable type in TypeScript?", options: ["let name: string", "let name = string", "string name", "var name as string"], answer: "let name: string" },
        { q: "What command compiles TypeScript to JavaScript?", options: ["tsc", "compile", "ts-compile", "typescript"], answer: "tsc" },
        { q: "What is the file extension for TypeScript?", options: [".ts", ".js", ".tsx", ".typescript"], answer: ".ts" },
        { q: "What is an interface in TypeScript?", options: ["A way to define object structure", "A class", "A function", "A variable type"], answer: "A way to define object structure" }
      ],
      intermediate: [
        { q: "What are generics in TypeScript?", options: ["Reusable components that work with multiple types", "Generic functions", "Type aliases", "Class inheritance"], answer: "Reusable components that work with multiple types" },
        { q: "What is a union type?", options: ["A type that can be one of several types", "Combining two interfaces", "Merging classes", "Joining strings"], answer: "A type that can be one of several types" },
        { q: "What is the 'any' type?", options: ["Disables type checking for a variable", "String type", "Number type", "Boolean type"], answer: "Disables type checking for a variable" },
        { q: "What is type assertion?", options: ["Telling compiler to treat value as specific type", "Type validation", "Type conversion", "Type checking"], answer: "Telling compiler to treat value as specific type" },
        { q: "What is the difference between interface and type?", options: ["Interfaces can be extended, types use intersections", "They are identical", "Types are faster", "Interfaces are deprecated"], answer: "Interfaces can be extended, types use intersections" }
      ],
      advanced: [
        { q: "What are conditional types?", options: ["Types that depend on a condition", "If-else statements", "Type guards", "Type assertions"], answer: "Types that depend on a condition" },
        { q: "What is mapped types?", options: ["Transform properties of existing type", "Map data structure", "Array mapping", "Object mapping"], answer: "Transform properties of existing type" },
        { q: "What is the 'never' type?", options: ["Type for values that never occur", "Null type", "Undefined type", "Empty type"], answer: "Type for values that never occur" },
        { q: "What are decorators in TypeScript?", options: ["Special declarations attached to classes/methods", "Design patterns", "Type annotations", "Comments"], answer: "Special declarations attached to classes/methods" },
        { q: "What is the 'infer' keyword?", options: ["Extract type from conditional type", "Type inference", "Type checking", "Type casting"], answer: "Extract type from conditional type" }
      ]
    },
    // JavaScript
    "JavaScript": {
      basic: [
        { q: "What is JavaScript?", options: ["High-level programming language for web", "Java framework", "CSS library", "Database language"], answer: "High-level programming language for web" },
        { q: "How do you declare a variable in JavaScript?", options: ["let, const, or var", "variable x", "declare x", "dim x"], answer: "let, const, or var" },
        { q: "What is the difference between == and ===?", options: ["== compares values, === compares values and types", "They are the same", "=== is faster", "== is deprecated"], answer: "== compares values, === compares values and types" },
        { q: "How do you create a function in JavaScript?", options: ["function myFunc() {}", "func myFunc() {}", "def myFunc() {}", "create function myFunc()"], answer: "function myFunc() {}" },
        { q: "What is an array in JavaScript?", options: ["Ordered collection of values", "Object type", "String type", "Number type"], answer: "Ordered collection of values" }
      ],
      intermediate: [
        { q: "What is a closure?", options: ["Function with access to outer function's variables", "Closed function", "Private method", "Class method"], answer: "Function with access to outer function's variables" },
        { q: "What is the 'this' keyword?", options: ["Reference to current execution context", "Current function", "Current variable", "Current class"], answer: "Reference to current execution context" },
        { q: "What is a Promise?", options: ["Object representing eventual completion of async operation", "Callback function", "Event handler", "Loop construct"], answer: "Object representing eventual completion of async operation" },
        { q: "What is async/await?", options: ["Syntactic sugar for working with Promises", "Asynchronous loops", "Event listeners", "Callback pattern"], answer: "Syntactic sugar for working with Promises" },
        { q: "What is destructuring?", options: ["Extracting values from arrays or objects", "Deleting properties", "Breaking loops", "Removing elements"], answer: "Extracting values from arrays or objects" }
      ],
      advanced: [
        { q: "What is the Event Loop?", options: ["Mechanism for handling asynchronous operations", "For loop", "Event handler", "Callback queue"], answer: "Mechanism for handling asynchronous operations" },
        { q: "What is prototypal inheritance?", options: ["Objects inherit from other objects", "Class inheritance", "Interface implementation", "Multiple inheritance"], answer: "Objects inherit from other objects" },
        { q: "What is a WeakMap?", options: ["Collection of key-value pairs with weak references", "Weak array", "Small map", "Temporary storage"], answer: "Collection of key-value pairs with weak references" },
        { q: "What is the Proxy object?", options: ["Object that intercepts operations on another object", "Server proxy", "Network proxy", "Cache proxy"], answer: "Object that intercepts operations on another object" },
        { q: "What is a generator function?", options: ["Function that can pause and resume execution", "Random number generator", "ID generator", "Code generator"], answer: "Function that can pause and resume execution" }
      ]
    },
    // Python
    "Python": {
      basic: [
        { q: "What is Python?", options: ["High-level interpreted programming language", "Snake species", "Web framework", "Database"], answer: "High-level interpreted programming language" },
        { q: "How do you print in Python?", options: ["print()", "console.log()", "echo", "printf()"], answer: "print()" },
        { q: "What is a list in Python?", options: ["Ordered mutable collection", "Dictionary", "Tuple", "Set"], answer: "Ordered mutable collection" },
        { q: "How do you create a function in Python?", options: ["def function_name():", "function function_name():", "func function_name():", "create function_name():"], answer: "def function_name():" },
        { q: "What is indentation used for in Python?", options: ["Define code blocks", "Decoration", "Comments", "Variable names"], answer: "Define code blocks" }
      ],
      intermediate: [
        { q: "What is a decorator in Python?", options: ["Function that modifies another function", "Design pattern", "Class method", "Variable type"], answer: "Function that modifies another function" },
        { q: "What is list comprehension?", options: ["Concise way to create lists", "List method", "List sorting", "List filtering"], answer: "Concise way to create lists" },
        { q: "What is the difference between list and tuple?", options: ["Lists are mutable, tuples are immutable", "They are the same", "Tuples are faster", "Lists are deprecated"], answer: "Lists are mutable, tuples are immutable" },
        { q: "What is a lambda function?", options: ["Anonymous function", "Named function", "Class method", "Built-in function"], answer: "Anonymous function" },
        { q: "What is *args and **kwargs?", options: ["Variable-length arguments", "Multiplication operators", "Pointer operators", "Comment syntax"], answer: "Variable-length arguments" }
      ],
      advanced: [
        { q: "What is the Global Interpreter Lock (GIL)?", options: ["Mutex preventing multiple threads from executing Python bytecode", "Global variable lock", "Import lock", "File lock"], answer: "Mutex preventing multiple threads from executing Python bytecode" },
        { q: "What is a metaclass?", options: ["Class of a class", "Parent class", "Abstract class", "Interface"], answer: "Class of a class" },
        { q: "What is the difference between __str__ and __repr__?", options: ["__str__ for users, __repr__ for developers", "They are identical", "__str__ is faster", "__repr__ is deprecated"], answer: "__str__ for users, __repr__ for developers" },
        { q: "What is a context manager?", options: ["Object managing resource allocation and cleanup", "Memory manager", "Process manager", "Thread manager"], answer: "Object managing resource allocation and cleanup" },
        { q: "What is asyncio?", options: ["Library for asynchronous programming", "Synchronous I/O", "File I/O library", "Network library"], answer: "Library for asynchronous programming" }
      ]
    },
    // Default template for skills without specific questions
    "default": {
      basic: [
        { q: "What is {skill} primarily used for?", options: ["Its primary purpose and main use case", "Secondary functionality", "Unrelated task", "Deprecated feature"], answer: "Its primary purpose and main use case" },
        { q: "Which category does {skill} belong to?", options: ["Its correct category", "Wrong category 1", "Wrong category 2", "Wrong category 3"], answer: "Its correct category" },
        { q: "What is a key feature of {skill}?", options: ["Main distinguishing feature", "Minor feature", "Unrelated feature", "Deprecated feature"], answer: "Main distinguishing feature" },
        { q: "How do you get started with {skill}?", options: ["Standard installation/setup method", "Incorrect method 1", "Incorrect method 2", "Incorrect method 3"], answer: "Standard installation/setup method" },
        { q: "What is the main benefit of using {skill}?", options: ["Primary advantage", "Minor benefit", "Disadvantage", "Unrelated benefit"], answer: "Primary advantage" }
      ],
      intermediate: [
        { q: "What is an important concept in {skill}?", options: ["Core intermediate concept", "Basic concept", "Advanced concept", "Unrelated concept"], answer: "Core intermediate concept" },
        { q: "How do you optimize {skill} performance?", options: ["Best practice optimization technique", "Inefficient method", "Deprecated method", "Unrelated method"], answer: "Best practice optimization technique" },
        { q: "What is a common pattern used with {skill}?", options: ["Widely-used design pattern", "Anti-pattern", "Rare pattern", "Deprecated pattern"], answer: "Widely-used design pattern" },
        { q: "How do you handle errors in {skill}?", options: ["Standard error handling approach", "Ignoring errors", "Incorrect approach", "Deprecated approach"], answer: "Standard error handling approach" },
        { q: "What tool integrates well with {skill}?", options: ["Commonly paired tool/framework", "Unrelated tool", "Deprecated tool", "Incompatible tool"], answer: "Commonly paired tool/framework" }
      ],
      advanced: [
        { q: "What is the architecture of {skill}?", options: ["Core architectural principle", "Incorrect architecture", "Simplified architecture", "Deprecated architecture"], answer: "Core architectural principle" },
        { q: "How do you scale {skill}?", options: ["Proven scalability approach", "Non-scalable approach", "Inefficient approach", "Deprecated approach"], answer: "Proven scalability approach" },
        { q: "What are the security considerations for {skill}?", options: ["Key security best practice", "Insecure practice", "Unrelated practice", "Deprecated practice"], answer: "Key security best practice" },
        { q: "How do you debug complex issues in {skill}?", options: ["Advanced debugging technique", "Basic debugging", "Trial and error", "Deprecated technique"], answer: "Advanced debugging technique" },
        { q: "What is an advanced feature of {skill}?", options: ["Sophisticated capability", "Basic feature", "Deprecated feature", "Unrelated feature"], answer: "Sophisticated capability" }
      ]
    }
  };
  
  // Get skill-specific questions or use default
  const skillQuestions = templates[skill] || templates["default"];
  return skillQuestions[difficulty].map(template => ({
    ...template,
    q: template.q.replace('{skill}', skill)
  }));
};

// Actual comprehensive questions for key skills
const comprehensiveQuestions = [
  // React Questions
  { skillName: "React", questionText: "What is JSX in React?", options: ["A JavaScript extension that allows HTML-like syntax", "A CSS framework", "A database query language", "A testing library"], correctAnswer: "A JavaScript extension that allows HTML-like syntax", difficulty: "basic", questionType: "multiple-choice", explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files." },
  { skillName: "React", questionText: "Which hook is used to manage state in functional components?", options: ["useState", "useEffect", "useContext", "useReducer"], correctAnswer: "useState", difficulty: "basic", questionType: "multiple-choice", explanation: "useState is the React hook used to add state to functional components." },
  { skillName: "React", questionText: "How do you create a React component?", options: ["function MyComponent() {}", "class MyComponent {}", "component MyComponent {}", "react MyComponent {}"], correctAnswer: "function MyComponent() {}", difficulty: "basic", questionType: "multiple-choice", explanation: "React components can be created as functions or classes." },
  { skillName: "React", questionText: "What is the correct way to render a list in React?", options: ["Using map() function", "Using for loop", "Using forEach()", "Using while loop"], correctAnswer: "Using map() function", difficulty: "basic", questionType: "multiple-choice", explanation: "The map() function is the standard way to render lists in React." },
  { skillName: "React", questionText: "What is props in React?", options: ["Properties passed from parent to child component", "Component state", "CSS properties", "HTML attributes"], correctAnswer: "Properties passed from parent to child component", difficulty: "basic", questionType: "multiple-choice", explanation: "Props are arguments passed into React components." },
  
  { skillName: "React", questionText: "What is the purpose of useEffect hook?", options: ["To handle side effects in functional components", "To manage component state", "To create context", "To optimize performance"], correctAnswer: "To handle side effects in functional components", difficulty: "intermediate", questionType: "multiple-choice", explanation: "useEffect is used to perform side effects in functional components." },
  { skillName: "React", questionText: "What is React Context used for?", options: ["Global state management", "Styling components", "Routing", "Form validation"], correctAnswer: "Global state management", difficulty: "intermediate", questionType: "multiple-choice", explanation: "React Context provides a way to pass data through the component tree." },
  { skillName: "React", questionText: "What is the Virtual DOM?", options: ["A lightweight copy of the actual DOM", "A database", "A CSS framework", "A testing tool"], correctAnswer: "A lightweight copy of the actual DOM", difficulty: "intermediate", questionType: "multiple-choice", explanation: "The Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory." },
  { skillName: "React", questionText: "What is prop drilling?", options: ["Passing props through multiple levels of components", "Creating new props", "Deleting props", "Validating props"], correctAnswer: "Passing props through multiple levels of components", difficulty: "intermediate", questionType: "multiple-choice", explanation: "Prop drilling is the process of passing data from a parent component down to deeply nested child components." },
  { skillName: "React", questionText: "What is the purpose of useCallback hook?", options: ["To memoize callback functions", "To fetch data", "To manage state", "To handle errors"], correctAnswer: "To memoize callback functions", difficulty: "intermediate", questionType: "multiple-choice", explanation: "useCallback returns a memoized version of the callback function." },
  
  { skillName: "React", questionText: "What is React Fiber?", options: ["React's reconciliation algorithm", "A CSS library", "A state management tool", "A routing library"], correctAnswer: "React's reconciliation algorithm", difficulty: "advanced", questionType: "multiple-choice", explanation: "React Fiber is the new reconciliation engine in React 16." },
  { skillName: "React", questionText: "What is the purpose of React.memo()?", options: ["To prevent unnecessary re-renders of components", "To store data", "To create routes", "To handle forms"], correctAnswer: "To prevent unnecessary re-renders of components", difficulty: "advanced", questionType: "multiple-choice", explanation: "React.memo is a higher order component that memoizes the result." },
  { skillName: "React", questionText: "What is code splitting in React?", options: ["Dividing code into smaller bundles loaded on demand", "Writing code in multiple files", "Splitting components", "Dividing state"], correctAnswer: "Dividing code into smaller bundles loaded on demand", difficulty: "advanced", questionType: "multiple-choice", explanation: "Code splitting allows you to split your code into smaller chunks." },
  { skillName: "React", questionText: "What is the purpose of useReducer hook?", options: ["Complex state logic management", "API calls", "Routing", "Styling"], correctAnswer: "Complex state logic management", difficulty: "advanced", questionType: "multiple-choice", explanation: "useReducer is used for managing complex state logic." },
  { skillName: "React", questionText: "What is Server-Side Rendering (SSR) in React?", options: ["Rendering React components on the server", "Storing data on server", "Server configuration", "API integration"], correctAnswer: "Rendering React components on the server", difficulty: "advanced", questionType: "multiple-choice", explanation: "SSR is the ability to render React components on the server." },

  // Node.js Questions
  { skillName: "Node.js", questionText: "What is Node.js?", options: ["A JavaScript runtime built on Chrome's V8 engine", "A web browser", "A database", "A CSS framework"], correctAnswer: "A JavaScript runtime built on Chrome's V8 engine", difficulty: "basic", questionType: "multiple-choice", explanation: "Node.js is a JavaScript runtime that allows you to run JavaScript on the server side." },
  { skillName: "Node.js", questionText: "Which command is used to initialize a Node.js project?", options: ["npm init", "node start", "npm create", "node init"], correctAnswer: "npm init", difficulty: "basic", questionType: "multiple-choice", explanation: "npm init creates a package.json file for your Node.js project." },
  { skillName: "Node.js", questionText: "What is npm?", options: ["Node Package Manager", "Node Program Manager", "New Package Manager", "Node Project Manager"], correctAnswer: "Node Package Manager", difficulty: "basic", questionType: "multiple-choice", explanation: "npm is the default package manager for Node.js." },
  { skillName: "Node.js", questionText: "How do you import a module in Node.js?", options: ["require('module')", "import module", "include module", "use module"], correctAnswer: "require('module')", difficulty: "basic", questionType: "multiple-choice", explanation: "The require() function is used to import modules in Node.js." },
  { skillName: "Node.js", questionText: "What is Express.js?", options: ["A web application framework for Node.js", "A database", "A testing library", "A CSS framework"], correctAnswer: "A web application framework for Node.js", difficulty: "basic", questionType: "multiple-choice", explanation: "Express.js is a minimal and flexible Node.js web application framework." },
  
  { skillName: "Node.js", questionText: "What is middleware in Express.js?", options: ["Functions that execute during request-response cycle", "Database queries", "CSS styles", "HTML templates"], correctAnswer: "Functions that execute during request-response cycle", difficulty: "intermediate", questionType: "multiple-choice", explanation: "Middleware functions have access to the request and response objects." },
  { skillName: "Node.js", questionText: "What is the Event Loop in Node.js?", options: ["Mechanism that handles asynchronous operations", "A for loop", "A database connection", "A routing system"], correctAnswer: "Mechanism that handles asynchronous operations", difficulty: "intermediate", questionType: "multiple-choice", explanation: "The Event Loop allows Node.js to perform non-blocking I/O operations." },
  { skillName: "Node.js", questionText: "What is the purpose of package.json?", options: ["Stores project metadata and dependencies", "Contains HTML code", "Stores CSS styles", "Contains images"], correctAnswer: "Stores project metadata and dependencies", difficulty: "intermediate", questionType: "multiple-choice", explanation: "package.json contains metadata about the project and lists the packages your project depends on." },
  { skillName: "Node.js", questionText: "What is CORS?", options: ["Cross-Origin Resource Sharing", "Cross-Origin Request Security", "Core Origin Resource System", "Cross-Object Resource Sharing"], correctAnswer: "Cross-Origin Resource Sharing", difficulty: "intermediate", questionType: "multiple-choice", explanation: "CORS is a security feature that allows or restricts resources on a web page to be requested from another domain." },
  { skillName: "Node.js", questionText: "What is the difference between process.nextTick() and setImmediate()?", options: ["nextTick executes before I/O events, setImmediate after", "They are the same", "setImmediate is faster", "nextTick is deprecated"], correctAnswer: "nextTick executes before I/O events, setImmediate after", difficulty: "intermediate", questionType: "multiple-choice", explanation: "process.nextTick() fires immediately on the same phase." },
  
  { skillName: "Node.js", questionText: "What is clustering in Node.js?", options: ["Running multiple Node.js processes to handle load", "Grouping data", "Database optimization", "Code organization"], correctAnswer: "Running multiple Node.js processes to handle load", difficulty: "advanced", questionType: "multiple-choice", explanation: "Clustering allows you to create child processes that share server ports." },
  { skillName: "Node.js", questionText: "What is Stream in Node.js?", options: ["Objects for handling continuous data flow", "Database connections", "HTTP requests", "File paths"], correctAnswer: "Objects for handling continuous data flow", difficulty: "advanced", questionType: "multiple-choice", explanation: "Streams are objects that let you read data from a source or write data to a destination in a continuous fashion." },
  { skillName: "Node.js", questionText: "What is the purpose of Buffer in Node.js?", options: ["To handle binary data", "To store strings", "To manage memory", "To create files"], correctAnswer: "To handle binary data", difficulty: "advanced", questionType: "multiple-choice", explanation: "Buffer class is used to handle binary data directly in Node.js." },
  { skillName: "Node.js", questionText: "What is the difference between spawn() and exec()?", options: ["spawn streams data, exec buffers data", "They are identical", "exec is faster", "spawn is deprecated"], correctAnswer: "spawn streams data, exec buffers data", difficulty: "advanced", questionType: "multiple-choice", explanation: "spawn() returns a stream and is better for large data." },
  { skillName: "Node.js", questionText: "What is Worker Threads in Node.js?", options: ["Module for running JavaScript in parallel threads", "Database workers", "HTTP workers", "File system workers"], correctAnswer: "Module for running JavaScript in parallel threads", difficulty: "advanced", questionType: "multiple-choice", explanation: "Worker Threads allow you to run JavaScript operations in parallel." },

  // Continue with more skills... (MongoDB, Python, AWS, Docker, etc.)
];

const seedComprehensiveQuestions = async () => {
  try {
    console.log("🌱 Starting comprehensive question seeding...");
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    
    // Clear existing questions
    await QuestionBank.deleteMany({});
    console.log("🗑️  Cleared existing questions");
    
    // Insert comprehensive questions
    await QuestionBank.insertMany(comprehensiveQuestions);
    console.log(`✅ Inserted ${comprehensiveQuestions.length} comprehensive questions`);
    
    // Generate additional questions for remaining skills
    const additionalQuestions = [];
    const allSkills = Object.values(jobRolesSkills).flat();
    const uniqueSkills = [...new Set(allSkills)];
    
    console.log(`📝 Generating questions for ${uniqueSkills.length} unique skills...`);
    
    for (const skill of uniqueSkills) {
      // Check if we already have questions for this skill
      const existingCount = comprehensiveQuestions.filter(q => q.skillName === skill).length;
      
      if (existingCount < 15) { // Need 15 total (5 per difficulty)
        // Generate remaining questions
        for (const difficulty of ['basic', 'intermediate', 'advanced']) {
          const difficultyCount = comprehensiveQuestions.filter(
            q => q.skillName === skill && q.difficulty === difficulty
          ).length;
          
          const needed = 5 - difficultyCount;
          
          for (let i = 0; i < needed; i++) {
            const templates = getSkillQuestions(skill, difficulty);
            const template = templates[i % templates.length];
            additionalQuestions.push({
              skillName: skill,
              questionText: template.q,
              options: template.options,
              correctAnswer: template.answer,
              difficulty,
              questionType: "multiple-choice",
              explanation: `This question tests your ${difficulty} knowledge of ${skill}.`
            });
          }
        }
      }
    }
    
    if (additionalQuestions.length > 0) {
      await QuestionBank.insertMany(additionalQuestions);
      console.log(`✅ Inserted ${additionalQuestions.length} additional questions`);
    }
    
    // Display summary
    const totalQuestions = await QuestionBank.countDocuments();
    console.log(`\n📊 Question Bank Summary:`);
    console.log(`   Total Questions: ${totalQuestions}`);
    
    for (const [role, skills] of Object.entries(jobRolesSkills)) {
      const roleQuestionCount = await QuestionBank.countDocuments({ 
        skillName: { $in: skills } 
      });
      console.log(`   ${role}: ${roleQuestionCount} questions across ${skills.length} skills`);
    }
    
    console.log("\n🎉 Comprehensive question seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📝 Database connection closed");
    process.exit(0);
  }
};

seedComprehensiveQuestions();
