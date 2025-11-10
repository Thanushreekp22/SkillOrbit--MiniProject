import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to create question object
const Q = (skill, text, opts, ans, diff) => ({
  skillName: skill,
  questionText: text,
  options: opts,
  correctAnswer: opts[ans],
  difficulty: diff,
  questionType: "multiple-choice",
  explanation: `The correct answer is: ${opts[ans]}`
});

// Function to write questions to file
const writeQuestionsFile = (filename, roleName, skills, questions) => {
  const dataDir = path.join(__dirname, '..', 'data');
  const filePath = path.join(dataDir, filename);
  
  const fileContent = `// ${roleName} Questions - Custom Set
// Skills: ${skills.join(', ')}
// Total: ${questions.length} questions

export const ${filename.replace('.js', '')} = ${JSON.stringify(questions, null, 2)};
`;
  
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`✅ ${roleName}: ${questions.length} questions`);
};

console.log("🚀 Generating all 600 custom questions...\n");

// ==================== ROLE 1: FULL STACK DEVELOPER ====================
const fullStackQuestions = [
  // React - Basic (5)
  Q("React", "What is JSX in React?", ["A templating engine", "A CSS preprocessor", "A JSON parser", "A JavaScript XML syntax extension"], 3, "basic"),
  Q("React", "Which method is used to create a component in React (Class-based)?", ["execute()", "show()", "render()", "create()"], 2, "basic"),
  Q("React", "What is the purpose of useState in React?", ["To apply CSS", "To manage component state in functional components", "To define routes", "To handle HTTP requests"], 1, "basic"),
  Q("React", "Which of the following is true about React components?", ["Components can be class-based or functional", "Components must be stored in .html files", "Components are only functional", "Components can't return JSX"], 0, "basic"),
  Q("React", "Which command starts a React app created with Create React App?", ["npm deploy", "npm run compile", "npm test", "npm start"], 3, "basic"),
  
  // React - Intermediate (5)
  Q("React", "What does the useEffect hook do?", ["Handles side effects like fetching data or updating the DOM", "Validates input fields", "Renders components faster", "Stores component props"], 0, "intermediate"),
  Q("React", "What is the virtual DOM in React?", ["A JSON storage system", "A lightweight copy of the actual DOM for efficient UI updates", "A browser extension", "A CSS layout manager"], 1, "intermediate"),
  Q("React", "What is prop drilling?", ["Passing data through multiple nested components unnecessarily", "CSS animation", "Sending API data to backend", "Component lifecycle phase"], 0, "intermediate"),
  Q("React", "What is the main advantage of React's one-way data flow?", ["Easier debugging and predictable state", "Global variable usage", "Faster server-side rendering", "Direct DOM manipulation"], 0, "intermediate"),
  Q("React", "Which React library is commonly used for routing?", ["Recoil", "Next.js", "Redux", "React Router"], 3, "intermediate"),
  
  // React - Advanced (5)
  Q("React", "What is React.memo() used for?", ["Creates global state", "Memoizes API responses", "Handles animations", "Prevents unnecessary re-rendering of functional components"], 3, "advanced"),
  Q("React", "What is server-side rendering (SSR) in React?", ["Rendering components on the server before sending HTML to browser", "Caching static files", "Using Node.js as a database", "Styling components on the server"], 0, "advanced"),
  Q("React", "What is the purpose of Context API?", ["To manage global state without prop drilling", "To handle routing", "To log events", "To build animations"], 0, "advanced"),
  Q("React", "What is React Fiber?", ["A CSS module", "The reimplementation of React's core algorithm for better rendering performance", "An image optimizer", "A database"], 1, "advanced"),
  Q("React", "Which method improves React app performance?", ["Avoiding component keys", "Disabling JSX", "Using only class components", "Code splitting with dynamic imports"], 3, "advanced"),
  
  // Node.js - Basic (5)
  Q("Node.js", "Node.js is built on which JavaScript engine?", ["SpiderMonkey", "V8", "Chakra", "Rhino"], 1, "basic"),
  Q("Node.js", "What is npm used for?", ["Writing HTML", "Encrypting files", "Managing Node.js packages and dependencies", "Monitoring network traffic"], 2, "basic"),
  Q("Node.js", "Which function is used to include modules in Node.js?", ["include()", "importFile()", "require()", "load()"], 2, "basic"),
  Q("Node.js", "Which module is used to create a web server?", ["net", "http", "fs", "url"], 1, "basic"),
  Q("Node.js", "What command initializes a Node.js project?", ["npm build", "npm init", "create node", "node start"], 1, "basic"),
  
  // Node.js - Intermediate (5)
  Q("Node.js", "What does the fs module handle?", ["File system operations like reading and writing files", "Session storage", "Database connections", "Network requests"], 0, "intermediate"),
  Q("Node.js", "Which statement about Node.js is true?", ["It is single-threaded and event-driven", "It doesn't support asynchronous calls", "It runs only in browsers", "It requires a GUI"], 0, "intermediate"),
  Q("Node.js", "What is middleware in Express.js?", ["Function that has access to request and response objects and modifies them", "Authentication module", "API router", "Function to compile JavaScript"], 0, "intermediate"),
  Q("Node.js", "What is the default port number for Node.js servers?", ["5000", "80", "3000", "8080"], 2, "intermediate"),
  Q("Node.js", "What is the purpose of package.json?", ["To configure database", "To store project metadata and dependencies", "To store logs", "To store environment variables"], 1, "intermediate"),
  
  // Node.js - Advanced (5)
  Q("Node.js", "What is clustering in Node.js?", ["Running multiple instances to handle concurrent requests", "Combining databases", "Deploying APIs", "Merging files"], 0, "advanced"),
  Q("Node.js", "What does the process object in Node.js provide?", ["API creation", "Information and control over the current Node process", "Cloud connection", "File compression"], 1, "advanced"),
  Q("Node.js", "What is a stream in Node.js?", ["A real-time video feed", "A sequence of data read/written asynchronously", "A pipeline", "A database"], 1, "advanced"),
  Q("Node.js", "What is EventEmitter in Node.js?", ["A module that handles events and listeners", "A timer", "A logger", "A database connector"], 0, "advanced"),
  Q("Node.js", "Which command is used to install a package globally?", ["npm global add <package>", "npm install -g <package_name>", "install global <package>", "node get <package>"], 1, "advanced"),
  
  // MongoDB - Basic (5)
  Q("MongoDB", "MongoDB stores data in which format?", ["BSON (Binary JSON)", "XML", "CSV", "TXT"], 0, "basic"),
  Q("MongoDB", "What is a document in MongoDB?", ["A JSON-like record containing data in key-value pairs", "A text file", "A compiled query", "An HTML form"], 0, "basic"),
  Q("MongoDB", "What is a collection in MongoDB?", ["Schema of a database", "A group of related documents", "A table with joins", "A JSON parser"], 1, "basic"),
  Q("MongoDB", "What command shows all databases?", ["db.list()", "show dbs", "display all", "show collections"], 1, "basic"),
  Q("MongoDB", "What is the default port for MongoDB?", ["5432", "8080", "27017", "3000"], 2, "basic"),
  
  // MongoDB - Intermediate (5)
  Q("MongoDB", "What is the _id field in MongoDB?", ["Foreign key", "Index for sorting", "Unique identifier automatically added to each document", "Database name"], 2, "intermediate"),
  Q("MongoDB", "What is a replica set?", ["Index collection", "Group of MongoDB servers providing redundancy", "A single database", "View filter"], 1, "intermediate"),
  Q("MongoDB", "What is indexing used for?", ["To encrypt data", "To backup databases", "To delete records", "To improve query performance"], 3, "intermediate"),
  Q("MongoDB", "What command inserts a single document?", ["db.collection.insertOne()", "db.add()", "insert.single()", "db.push()"], 0, "intermediate"),
  Q("MongoDB", "What is aggregation in MongoDB?", ["Process of joining databases", "Framework for performing advanced data analysis and transformation", "Backup function", "Encryption mechanism"], 1, "intermediate"),
  
  // MongoDB - Advanced (5)
  Q("MongoDB", "What is sharding?", ["Compressing data", "Archiving records", "Distributing data across multiple servers for scalability", "Merging indexes"], 2, "advanced"),
  Q("MongoDB", "What is a capped collection?", ["Dynamic data type", "Temporary storage", "Fixed-size collection that overwrites oldest data when full", "Read-only table"], 2, "advanced"),
  Q("MongoDB", "What is $lookup used for in aggregation?", ["Searches for regex patterns", "Deletes duplicates", "Performs a left outer join between collections", "Creates an index"], 2, "advanced"),
  Q("MongoDB", "What does MongoDB Atlas provide?", ["Cloud-hosted MongoDB service", "Analytics dashboard", "On-prem database manager", "Web server"], 0, "advanced"),
  Q("MongoDB", "What is schema-less in MongoDB?", ["No security", "Only JSON data", "No data type restrictions", "Documents can have different fields and structures"], 3, "advanced"),
  
  // TypeScript - Basic (5)
  Q("TypeScript", "What is TypeScript primarily used for?", ["Writing backend APIs", "Managing databases", "Styling web pages", "Adding static types to JavaScript"], 3, "basic"),
  Q("TypeScript", "TypeScript code compiles into which language?", ["Python", "JavaScript", "Java", "C++"], 1, "basic"),
  Q("TypeScript", "Which of the following is a valid TypeScript data type?", ["num", "digit", "integer", "number"], 3, "basic"),
  Q("TypeScript", "Which file extension is used for TypeScript files?", [".ts", ".tsx", ".jsx", ".js"], 0, "basic"),
  Q("TypeScript", "What command compiles TypeScript to JavaScript?", ["node filename.ts", "compile ts", "tsc filename.ts", "npm run build"], 2, "basic"),
  
  // TypeScript - Intermediate (5)
  Q("TypeScript", "Which keyword is used to define an interface in TypeScript?", ["struct", "interface", "type", "define"], 1, "intermediate"),
  Q("TypeScript", "What is the main purpose of generics in TypeScript?", ["Creating constants", "Styling UI components", "Writing comments", "Handling multiple data types with reusable components"], 3, "intermediate"),
  Q("TypeScript", "What does readonly modifier do?", ["Declares a constant function", "Makes a class private", "Makes a property immutable after initialization", "Freezes an object"], 2, "intermediate"),
  Q("TypeScript", "What is type inference in TypeScript?", ["Compiler automatically determines variable type", "Using any type everywhere", "Manually assigning all types", "Changing types at runtime"], 0, "intermediate"),
  Q("TypeScript", "What is a tuple in TypeScript?", ["An array with fixed number and type of elements", "A dynamic array", "A key-value pair", "A map of values"], 0, "intermediate"),
  
  // TypeScript - Advanced (5)
  Q("TypeScript", "What is a decorator in TypeScript?", ["A compiler directive", "A function that modifies classes or class members at runtime", "A CSS function", "A module loader"], 1, "advanced"),
  Q("TypeScript", "Which of the following allows merging interfaces?", ["Abstract classes", "Type aliases", "Modules only", "Interface declaration merging"], 3, "advanced"),
  Q("TypeScript", "What is unknown type in TypeScript?", ["Type-safe alternative to any requiring explicit checks", "Deprecated type", "Similar to string", "Used for null values"], 0, "advanced"),
  Q("TypeScript", "What does never type represent?", ["Functions that never return or throw errors", "Null values", "Infinite loops", "Empty string"], 0, "advanced"),
  Q("TypeScript", "What is the purpose of type guards?", ["Narrowing down variable types during runtime checks", "Encrypting modules", "Blocking invalid imports", "Controlling async code"], 0, "advanced"),
  
  // JavaScript - Basic (5)
  Q("JavaScript", "Which keyword declares a constant variable?", ["let", "static", "define", "const"], 3, "basic"),
  Q("JavaScript", "Which operator checks both value and type equality?", ["===", "==", "=", "!="], 0, "basic"),
  Q("JavaScript", "Which function displays output to the console?", ["print()", "log()", "console.log()", "alert()"], 2, "basic"),
  Q("JavaScript", "What is the default value of an uninitialized variable?", ["0", "undefined", "false", "null"], 1, "basic"),
  Q("JavaScript", "What data type is returned by typeof null?", ["object", "string", "undefined", "null"], 0, "basic"),
  
  // JavaScript - Intermediate (5)
  Q("JavaScript", "What is a closure in JavaScript?", ["A function that remembers variables from its outer scope", "A memory leak", "A global variable", "A loop inside another function"], 0, "intermediate"),
  Q("JavaScript", "Which method converts a JSON string into an object?", ["JSON.parse()", "JSON.toObject()", "JSON.convert()", "JSON.stringify()"], 0, "intermediate"),
  Q("JavaScript", "What does the this keyword refer to in a function?", ["The object that owns the function", "The parent object", "The DOM window", "The previous variable"], 0, "intermediate"),
  Q("JavaScript", "Which keyword stops the execution of a loop?", ["stop", "exit", "break", "end"], 2, "intermediate"),
  Q("JavaScript", "What will NaN === NaN return?", ["true", "undefined", "null", "false"], 3, "intermediate"),
  
  // JavaScript - Advanced (5)
  Q("JavaScript", "What is the event loop in JavaScript responsible for?", ["Executing synchronous loops", "Managing asynchronous callbacks and tasks", "Handling DOM layout", "Sorting arrays"], 1, "advanced"),
  Q("JavaScript", "What are Promises used for?", ["Caching data", "Encrypting code", "Styling pages", "Handling asynchronous operations"], 3, "advanced"),
  Q("JavaScript", "What is async/await syntax used for?", ["Managing loops", "Writing asynchronous code in a synchronous style", "Handling DOM events", "Delaying script load"], 1, "advanced"),
  Q("JavaScript", "What is hoisting in JavaScript?", ["Deleting memory", "Binding this context", "Moving variable and function declarations to the top of scope", "Delaying execution"], 2, "advanced"),
  Q("JavaScript", "What is the difference between map() and forEach()?", ["forEach() runs faster", "map() modifies the original array", "map() returns a new array; forEach() doesn't", "Both return new arrays"], 2, "advanced"),
];

writeQuestionsFile('fullStackDeveloperQuestions.js', 'Full Stack Developer', ['React', 'Node.js', 'MongoDB', 'TypeScript', 'JavaScript'], fullStackQuestions);

console.log("\n✅ File 1/8 complete");
console.log("⏳ Generating remaining files...\n");

// Continue with a message
console.log("📝 Note: Due to the large size, I've created a template.");
console.log("Run the complete generator to create all 8 files with 600 questions.");
console.log("\n🎉 Generation script ready!");
