import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Q = (skill, text, opts, ans, diff) => ({
  skillName: skill,
  questionText: text,
  options: opts,
  correctAnswer: opts[ans],
  difficulty: diff,
  questionType: "multiple-choice",
  explanation: `The correct answer is: ${opts[ans]}`
});

const writeFile = (filename, roleName, skills, questions) => {
  const dataDir = path.join(__dirname, '..', 'data');
  const filePath = path.join(dataDir, filename);
  const content = `// ${roleName} Questions\n// Skills: ${skills.join(', ')}\n// Total: ${questions.length} questions\n\nexport const ${filename.replace('.js', '')} = ${JSON.stringify(questions, null, 2)};\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${roleName}: ${questions.length} questions`);
};

console.log("🚀 Generating remaining 6 roles (450 questions)...\n");

// ROLE 3: CLOUD ENGINEER
const cloudEngineerQuestions = [
  Q("AWS","What does AWS stand for?",["Advanced Web Software","Automated Web Solutions","Amazon Web Services","Application Web Stack"],2,"basic"),
  Q("AWS","Which AWS service is used for computing power?",["DynamoDB","Lambda","EC2","S3"],2,"basic"),
  Q("AWS","What does S3 stand for in AWS?",["Static Server Space","Shared Storage Service","Secure Storage System","Simple Storage Service"],3,"basic"),
  Q("AWS","Which AWS service provides a NoSQL database?",["Redshift","DynamoDB","Aurora","RDS"],1,"basic"),
  Q("AWS","What is the main benefit of AWS regions?",["UI customization","Data redundancy and low latency for global users","Lower code complexity","Free domain names"],1,"basic"),
  Q("AWS","What is AWS IAM used for?",["Monitoring CPU usage","Managing user access and permissions","Creating EC2 instances","Encrypting databases"],1,"intermediate"),
  Q("AWS","What is AWS CloudFormation?",["Infrastructure-as-code service","Logging service","Backup tool","Security layer"],0,"intermediate"),
  Q("AWS","Which AWS service provides serverless computing?",["EC2","CloudFront","Lambda","RDS"],2,"intermediate"),
  Q("AWS","What does VPC stand for?",["Verified Public Container","Virtual Policy Cluster","Virtual Private Cloud","Volume Partition Control"],2,"intermediate"),
  Q("AWS","What is AWS Route 53 used for?",["Monitoring","Caching","DNS management","File transfer"],2,"intermediate"),
  Q("AWS","What is Auto Scaling in AWS?",["Stops unused instances manually","Reduces S3 size","Changes IAM roles","Automatically adjusts EC2 capacity based on traffic"],3,"advanced"),
  Q("AWS","What is CloudWatch used for?",["Encrypting logs","Hosting static sites","Monitoring AWS resources and applications","Backup snapshots"],2,"advanced"),
  Q("AWS","What is an Elastic Load Balancer (ELB)?",["Stores objects","Scales down instances","Uploads images","Distributes incoming traffic across multiple servers"],3,"advanced"),
  Q("AWS","What is AWS KMS used for?",["Container orchestration","Key management and encryption","Logging traffic","File system mounting"],1,"advanced"),
  Q("AWS","Which AWS service helps manage Docker containers?",["SNS","ECS","SQS","EBS"],1,"advanced"),
  Q("Docker","What is Docker primarily used for?",["Encrypting files","Containerizing applications","Monitoring logs","Virtualizing hardware"],1,"basic"),
  Q("Docker","What command lists all running containers?",["docker run","docker ps","docker image","docker build"],1,"basic"),
  Q("Docker","What is Docker Hub?",["Data pipeline","Local volume manager","Container orchestrator","Central repository for Docker images"],3,"basic"),
  Q("Docker","Which file defines Docker build instructions?",["build.yaml","Dockerfile","docker.config","compose.json"],1,"basic"),
  Q("Docker","What does docker stop do?",["Stops a running container","Restarts Docker","Clears cache","Deletes an image"],0,"basic"),
  Q("Docker","What is a Docker volume?",["Persistent storage for containers","Container metadata","Image layer","Network configuration"],0,"intermediate"),
  Q("Docker","What is Docker Compose used for?",["Managing multi-container applications","Debugging network issues","Storing environment variables","Creating backups"],0,"intermediate"),
  Q("Docker","What is a container image?",["Volume mount","Blueprint for running containers","Log store","JSON metadata file"],1,"intermediate"),
  Q("Docker","What is the purpose of docker exec?",["Copy files","Execute a command inside a running container","Install Docker","Stop container"],1,"intermediate"),
  Q("Docker","Which command removes an image?",["docker rmi","docker stop","docker delete","docker clean"],0,"intermediate"),
  Q("Docker","What is Docker Swarm?",["Registry manager","File storage system","Native container orchestration for clustering","Load balancer"],2,"advanced"),
  Q("Docker","What is the purpose of multi-stage builds?",["Reduce image size by separating build and runtime layers","Enable monitoring","Improve security logging","Speed up container startup"],0,"advanced"),
  Q("Docker","What is the difference between ENTRYPOINT and CMD?",["ENTRYPOINT defines executable; CMD provides default arguments","ENTRYPOINT overrides CMD","Both are identical","CMD runs before ENTRYPOINT"],0,"advanced"),
  Q("Docker","What is a base image?",["Registry URL","Default Docker network","Starting image layer upon which other images are built","Empty container"],2,"advanced"),
  Q("Docker","What is container orchestration?",["Running single instances","Managing containerized applications at scale","Designing YAML files","Data compression"],1,"advanced"),
  Q("Kubernetes","What is Kubernetes used for?",["Hosting web apps","Orchestrating and managing containers","Running VMs","Managing SQL databases"],1,"basic"),
  Q("Kubernetes","What is a Pod?",["Load balancer","Node group","Persistent volume","Smallest deployable unit in Kubernetes"],3,"basic"),
  Q("Kubernetes","What is a Node?",["Worker machine in a Kubernetes cluster","Container registry","User account","Network proxy"],0,"basic"),
  Q("Kubernetes","What does kubectl do?",["Backup agent","Command-line tool to interact with the Kubernetes cluster","API gateway","Network filter"],1,"basic"),
  Q("Kubernetes","What is kubelet?",["Service endpoint","Dashboard UI","Node agent managing pods","Backup utility"],2,"basic"),
  Q("Kubernetes","What is a Deployment?",["ConfigMap","Node service","A network setup","Manages pods and replicas in Kubernetes"],3,"intermediate"),
  Q("Kubernetes","What is ConfigMap used for?",["Logging pods","Managing storage","Storing non-sensitive configuration data","Encrypting keys"],2,"intermediate"),
  Q("Kubernetes","What is a Service in Kubernetes?",["Loads data","Exposes pods to network traffic","Monitors logs","Encrypts network"],1,"intermediate"),
  Q("Kubernetes","What is a ReplicaSet?",["Manages secrets","Monitors metrics","Ensures desired number of pod replicas are running","Handles ingress"],2,"intermediate"),
  Q("Kubernetes","What is Horizontal Pod Autoscaler (HPA)?",["Deletes idle pods","Schedules pods","Adjusts replicas manually","Automatically scales pods based on resource usage"],3,"intermediate"),
  Q("Kubernetes","What is Ingress in Kubernetes?",["Manages external HTTP/HTTPS access","Creates pods","Encrypts secrets","Monitors resource usage"],0,"advanced"),
  Q("Kubernetes","What is Helm?",["Package manager for Kubernetes applications","Debugger","Logging service","Database driver"],0,"advanced"),
  Q("Kubernetes","What is etcd?",["Pod manager","Distributed key-value store for cluster data","Config utility","Volume controller"],1,"advanced"),
  Q("Kubernetes","What is a DaemonSet?",["Ensures a specific pod runs on all nodes","Manages DNS","Distributes logs","Handles backups"],0,"advanced"),
  Q("Kubernetes","What is Taint in Kubernetes?",["Restriction rule preventing pods from scheduling on specific nodes","Load balancing","Authentication protocol","Memory cleanup"],0,"advanced"),
  Q("Terraform","Terraform is used for?",["Data analytics","Application deployment only","Infrastructure as Code (IaC)","Server monitoring"],2,"basic"),
  Q("Terraform","What language is Terraform configuration written in?",["HCL (HashiCorp Configuration Language)","YAML","XML","JSON"],0,"basic"),
  Q("Terraform","Which command initializes a Terraform project?",["terraform init","terraform plan","terraform start","terraform apply"],0,"basic"),
  Q("Terraform","What does terraform plan do?",["Destroys infrastructure","Shows the execution plan before applying changes","Deploys changes","Creates a new module"],1,"basic"),
  Q("Terraform","What is a Terraform provider?",["Plugin that interacts with cloud platforms","Output variable","Configuration file","Resource list"],0,"basic"),
  Q("Terraform","What is a Terraform state file used for?",["Encrypts credentials","Tracks current infrastructure state","Monitors network","Logs activities"],1,"intermediate"),
  Q("Terraform","What is the command to destroy all resources?",["terraform remove","terraform clear","terraform delete","terraform destroy"],3,"intermediate"),
  Q("Terraform","What are Terraform modules?",["CLI commands","Logging plugins","Reusable infrastructure components","Output variables"],2,"intermediate"),
  Q("Terraform","What is backend configuration in Terraform?",["Defines frontend environment","Sets variables","Defines where Terraform state is stored","Manages credentials"],2,"intermediate"),
  Q("Terraform","What command applies changes?",["terraform deploy","terraform execute","terraform apply","terraform commit"],2,"intermediate"),
  Q("Terraform","What is remote backend?",["Stores state file in shared location (like S3 or Azure Storage)","Local state configuration","Version control setup","Provider registry"],0,"advanced"),
  Q("Terraform","What is the purpose of Terraform workspaces?",["Manage multiple environments (e.g., dev, prod)","Manage users","Store providers","Create local directories"],0,"advanced"),
  Q("Terraform","What is Terraform Cloud?",["Managed service for team-based IaC","Log analyzer","Security scanner","On-premises deployment"],0,"advanced"),
  Q("Terraform","What is interpolation in Terraform?",["Embedding variables within configuration strings","Compiling code","Parsing JSON","Logging outputs"],0,"advanced"),
  Q("Terraform","What is the main benefit of Terraform's declarative approach?",["Describes desired end state instead of step-by-step execution","Requires less syntax","Only supports AWS","Uses JSON only"],0,"advanced"),
  Q("Linux","What command lists files in a directory?",["pwd","cat","cd","ls"],3,"basic"),
  Q("Linux","What does pwd display?",["File permissions","Disk usage","Current working directory","System password"],2,"basic"),
  Q("Linux","What is the root directory symbol in Linux?",["~",":","/"," \\"],2,"basic"),
  Q("Linux","What command is used to change directory?",["cd","move","dir","goto"],0,"basic"),
  Q("Linux","What is the command to view hidden files?",["ls -h","view --all","show hidden","ls -a"],3,"basic"),
  Q("Linux","What does chmod do?",["Compresses files","Moves directories","Deletes files","Changes file permissions"],3,"intermediate"),
  Q("Linux","What does grep command do?",["Sorts files alphabetically","Displays disk usage","Monitors memory","Searches for patterns in text files"],3,"intermediate"),
  Q("Linux","What is a process ID (PID)?",["Port address","File descriptor","Unique number identifying a running process","User account"],2,"intermediate"),
  Q("Linux","What does df -h show?",["Hidden directories","Disk usage in human-readable format","Network logs","Current process tree"],1,"intermediate"),
  Q("Linux","What is the use of sudo?",["Executes command with admin privileges","Deletes all files","Compiles binaries","Logs users out"],0,"intermediate"),
  Q("Linux","What is a cron job?",["Kernel process","Temporary log file","Network packet","Scheduled task that runs automatically"],3,"advanced"),
  Q("Linux","What does top command show?",["Real-time system process and CPU usage","User sessions","Disk partitions","Log files"],0,"advanced"),
  Q("Linux","What is SELinux?",["Security-Enhanced Linux for access control","Disk encryption utility","User authentication service","System error log"],0,"advanced"),
  Q("Linux","What is the difference between hard link and soft link?",["Hard link points to data on disk; soft link points to file path","Hard link is temporary","Soft link uses more memory","Both are identical"],0,"advanced"),
  Q("Linux","What does ps aux do?",["Prints kernel info","Lists users","Displays all running processes","Shows available memory"],2,"advanced"),
];

writeFile('cloudEngineerQuestions.js', 'Cloud Engineer', ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux'], cloudEngineerQuestions);

// ROLE 4: MOBILE DEVELOPER
const mobileDeveloperQuestions = [
  Q("React Native","What is React Native used for?",["Building cross-platform mobile applications","Creating desktop GUIs","Writing backend APIs","Designing databases"],0,"basic"),
  Q("React Native","React Native is developed by which company?",["Apple","Facebook (Meta)","Microsoft","Google"],1,"basic"),
  Q("React Native","Which language is primarily used in React Native?",["Dart","Swift","JavaScript","Java"],2,"basic"),
  Q("React Native","What command starts a React Native app?",["react run app","npm start","npx react-native run-android","expo publish"],2,"basic"),
  Q("React Native","Which component is used to display text?",["<Label>","<Text>","<Typography>","<Paragraph>"],1,"basic"),
  Q("React Native","What is the purpose of the <View> component?",["Input field","Container that supports layout and styling","Network request handler","Animation wrapper"],1,"intermediate"),
  Q("React Native","Which API handles device storage in React Native?",["AsyncStorage","ReactData","LocalDB","FileStore"],0,"intermediate"),
  Q("React Native","What library is commonly used for navigation?",["React Navigation","NavLink","RouteJS","FlowNav"],0,"intermediate"),
  Q("React Native","What does \"Hot Reloading\" do?",["Updates code changes instantly without losing state","Rebuilds app from scratch","Resets emulator","Restarts system cache"],0,"intermediate"),
  Q("React Native","Which hook manages local component state?",["useReducer","useState","useEffect","useContext"],1,"intermediate"),
  Q("React Native","What is the role of Metro bundler?",["Manages permissions","Bundles JavaScript code and assets for React Native","Handles animations","Stores data offline"],1,"advanced"),
  Q("React Native","What's the difference between React Native and React JS?",["React Native builds native apps; React JS builds web apps","React JS compiles to Java bytecode","React Native runs on browsers","Both are identical"],0,"advanced"),
  Q("React Native","What is a bridge in React Native?",["Mechanism connecting JavaScript and native code","File transfer API","Debugging tool","Database adapter"],0,"advanced"),
  Q("React Native","What is Expo in React Native?",["Framework and platform to streamline app development","A device testing library","Database manager","State management tool"],0,"advanced"),
  Q("React Native","How can React Native app performance be improved?",["Use FlatList and avoid unnecessary re-renders","Increase component size","Store data in global variables","Avoid native modules"],0,"advanced"),
  Q("Flutter","Flutter is developed by?",["Apple","Microsoft","Google","Facebook"],2,"basic"),
  Q("Flutter","Flutter uses which programming language?",["Kotlin","JavaScript","Dart","Swift"],2,"basic"),
  Q("Flutter","What is a widget in Flutter?",["Basic building block of UI","Background service","Animation trigger","API function"],0,"basic"),
  Q("Flutter","What command runs a Flutter app?",["flutter start","flutter build","flutter run","dart run"],2,"basic"),
  Q("Flutter","What is the root widget of a Flutter app?",["RootView","FlutterBase","MaterialApp","MainPage"],2,"basic"),
  Q("Flutter","What is a stateless widget?",["Widget that does not maintain mutable state","Widget that changes dynamically","Animation widget","Widget that fetches data"],0,"intermediate"),
  Q("Flutter","What function builds UI in a widget class?",["build()","create()","render()","paint()"],0,"intermediate"),
  Q("Flutter","What does \"Hot Reload\" do in Flutter?",["Updates code instantly without restarting the app","Deletes debug files","Clears cache","Recompiles Dart"],0,"intermediate"),
  Q("Flutter","What is a stateful widget?",["Widget that can update dynamically during runtime","Widget that never changes","Animation trigger","Network listener"],0,"intermediate"),
  Q("Flutter","Which file defines dependencies?",["flutter.yaml","pubspec.yaml","package.lock","config.json"],1,"intermediate"),
  Q("Flutter","What is Flutter's rendering engine called?",["Blink","Gecko","Skia","Chakra"],2,"advanced"),
  Q("Flutter","What is the purpose of setState()?",["Notifies framework to rebuild widget tree with updated state","Creates a new widget","Saves state permanently","Closes stateful widget"],0,"advanced"),
  Q("Flutter","What is the difference between Navigator.push() and Navigator.pop()?",["push() adds a route; pop() removes it","Both close app","pop() adds route","push() removes route"],0,"advanced"),
  Q("Flutter","What is FutureBuilder used for?",["Building widgets based on async data","Creating animations","Compiling Dart","Defining constants"],0,"advanced"),
  Q("Flutter","What is Flutter's advantage over React Native?",["Compiles to native ARM code for better performance","Uses less memory","Requires no SDK","Written in Java"],0,"advanced"),
  Q("Swift","Swift is developed by?",["Apple","Google","IBM","Microsoft"],0,"basic"),
  Q("Swift","Swift is primarily used for developing?",["iOS and macOS apps","Android apps","Web servers","Data analysis"],0,"basic"),
  Q("Swift","What keyword declares a constant?",["const","define","let","var"],2,"basic"),
  Q("Swift","What is the correct syntax to print in Swift?",["echo \"Hello\"","show(\"Hello\")","print(\"Hello\")","console.log(\"Hello\")"],2,"basic"),
  Q("Swift","What data type represents true or false?",["Bool","Logic","Binary","Boolean"],0,"basic"),
  Q("Swift","What is optional in Swift?",["Variable that can hold a value or nil","Always non-null type","Immutable variable","Static property"],0,"intermediate"),
  Q("Swift","What keyword unwraps an optional safely?",["if let","unopt","opt?","safe var"],0,"intermediate"),
  Q("Swift","What does guard statement do?",["Exits early if condition fails","Locks variable","Delays execution","Hides functions"],0,"intermediate"),
  Q("Swift","What keyword defines a function?",["func","def","function","fn"],0,"intermediate"),
  Q("Swift","What is String interpolation?",["Embedding values into string literals","Encrypting strings","Splitting text","Trimming spaces"],0,"intermediate"),
  Q("Swift","What is closure in Swift?",["Self-contained block of code that can be passed and executed","Protocol definition","Loop handler","Guard clause"],0,"advanced"),
  Q("Swift","What is the difference between struct and class in Swift?",["Struct is value type; Class is reference type","Both are value types","Class has no inheritance","Struct supports ARC"],0,"advanced"),
  Q("Swift","What is ARC in Swift?",["Automatic Reference Counting","App Resource Checker","Auto Rebuild Command","Asynchronous Runtime Compiler"],0,"advanced"),
  Q("Swift","What is protocol in Swift?",["Defines blueprint of methods and properties","Function","Guard block","Variable type"],0,"advanced"),
  Q("Swift","What is an extension in Swift?",["Adds functionality to existing class, struct, or protocol","Creates new project","Duplicates class","Locks functions"],0,"advanced"),
  Q("Kotlin","Kotlin is officially supported for which platform?",["Android","macOS","WebAssembly","iOS"],0,"basic"),
  Q("Kotlin","Kotlin is developed by?",["Microsoft","JetBrains","Apple","Google"],1,"basic"),
  Q("Kotlin","Which file extension is used in Kotlin?",[".java",".swift",".dart",".kt"],3,"basic"),
  Q("Kotlin","What keyword declares a variable?",["make","let","define","var"],3,"basic"),
  Q("Kotlin","What function prints to console?",["out()","printText()","println()","echo()"],2,"basic"),
  Q("Kotlin","What is null safety in Kotlin?",["Prevents null pointer exceptions","Disables null variables","Avoids loops","Encrypts strings"],0,"intermediate"),
  Q("Kotlin","What is the Elvis operator (?:) used for?",["Providing default value when expression is null","Comparing objects","Combining conditions","Incrementing variables"],0,"intermediate"),
  Q("Kotlin","What is a data class?",["Class that holds only data (auto-generates equals(), toString(), etc.)","Static class","Class for encryption","Anonymous object"],0,"intermediate"),
  Q("Kotlin","What keyword defines a function?",["def","fun","call","fn"],1,"intermediate"),
  Q("Kotlin","What is the difference between val and var?",["val is immutable, var is mutable","var is constant","Both are same","val is temporary"],0,"intermediate"),
  Q("Kotlin","What is a coroutine in Kotlin?",["Lightweight thread for asynchronous programming","Database connection","Static method","Class inheritance"],0,"advanced"),
  Q("Kotlin","What is companion object used for?",["Defines static members for a class","Manages inheritance","Handles async data","Creates object copy"],0,"advanced"),
  Q("Kotlin","What is sealed class?",["Restricts class hierarchy to a limited set of subclasses","Private class","Final class","Immutable class"],0,"advanced"),
  Q("Kotlin","What is higher-order function?",["Function that takes or returns another function","Multithreaded function","Static method","Recursive call"],0,"advanced"),
  Q("Kotlin","What is extension function?",["Adds new functionality to existing class","Creates interface","Declares static block","Inherits a class"],0,"advanced"),
  Q("Mobile UI/UX","What does UI stand for?",["User Interface","Universal Input","User Integration","Unique Interaction"],0,"basic"),
  Q("Mobile UI/UX","What does UX stand for?",["User Experience","Unified Extension","Universal Exchange","Unique Execution"],0,"basic"),
  Q("Mobile UI/UX","What is wireframing?",["Creating basic layout structure of an app","Adding animations","Designing icons","Writing backend code"],0,"basic"),
  Q("Mobile UI/UX","What color scheme ensures accessibility?",["Low opacity","Complex gradient","High contrast","Bright saturation"],2,"basic"),
  Q("Mobile UI/UX","What is a prototype?",["Interactive mockup of app design","Color palette","Final product","Logo design"],0,"basic"),
  Q("Mobile UI/UX","What is touch target size for mobile?",["72x72 dp","Around 48x48 dp","20x20 dp","32x32 dp"],1,"intermediate"),
  Q("Mobile UI/UX","What is a design system?",["Reusable components and design standards for consistency","Typography style","UI library only","Coding framework"],0,"intermediate"),
  Q("Mobile UI/UX","What is user flow?",["Path users take to complete tasks in an app","App loading speed","Screen brightness pattern","Animation speed"],0,"intermediate"),
  Q("Mobile UI/UX","What is material design?",["Google's design language for Android","iOS-only style","Adobe theme","Apple's UI guideline"],0,"intermediate"),
  Q("Mobile UI/UX","What is usability testing?",["Evaluating app ease of use with real users","Unit testing","Code debugging","API validation"],0,"intermediate"),
  Q("Mobile UI/UX","What is heuristic evaluation?",["Expert-based UI review method","Analytics dashboard","User survey","Visual rendering test"],0,"advanced"),
  Q("Mobile UI/UX","What is Fitts's law?",["Predicts time to reach a target area based on distance and size","Sets typography rules","Defines design hierarchy","Describes color theory"],0,"advanced"),
  Q("Mobile UI/UX","What is microinteraction?",["Small feedback animations that enhance user experience","API request","Input validation","Error message"],0,"advanced"),
  Q("Mobile UI/UX","What is the purpose of persona creation?",["Represent target user type for better design decisions","Measure load time","Define UI colors","Build prototypes"],0,"advanced"),
  Q("Mobile UI/UX","What is progressive disclosure in UX?",["Revealing information gradually to reduce cognitive load","Displaying all options at once","Animation pattern","Loading screens"],0,"advanced"),
];

writeFile('mobileDeveloperQuestions.js', 'Mobile Developer', ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile UI/UX'], mobileDeveloperQuestions);

console.log("\n✅ Roles 3-4 complete");
console.log("📊 Progress: 300/600 questions (50%)");
console.log("⏳ Generating remaining 4 roles...\n");

// Continue with remaining roles - will be added in next batch
console.log("🎉 Cloud Engineer and Mobile Developer questions generated!");
console.log("📝 Run the final batch generator for remaining 4 roles...");
