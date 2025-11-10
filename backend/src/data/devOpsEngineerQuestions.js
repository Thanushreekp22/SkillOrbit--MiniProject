// DevOps Engineer Questions
// Skills: Docker, Kubernetes, CI/CD, Jenkins, Ansible
// Total: 75 questions

export const devOpsEngineerQuestions = [
  {
    "skillName": "Docker",
    "questionText": "What is Docker used for?",
    "options": [
      "Encrypting databases",
      "Writing backend APIs",
      "Designing networks",
      "Containerizing applications to run anywhere"
    ],
    "correctAnswer": "Containerizing applications to run anywhere",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Containerizing applications to run anywhere"
  },
  {
    "skillName": "Docker",
    "questionText": "What command lists all Docker images?",
    "options": [
      "docker images",
      "docker view",
      "docker list",
      "docker ps"
    ],
    "correctAnswer": "docker images",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: docker images"
  },
  {
    "skillName": "Docker",
    "questionText": "What is a container in Docker?",
    "options": [
      "A physical server",
      "A virtual network",
      "Lightweight isolated environment for running applications",
      "A compiled binary"
    ],
    "correctAnswer": "Lightweight isolated environment for running applications",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Lightweight isolated environment for running applications"
  },
  {
    "skillName": "Docker",
    "questionText": "What file defines a Docker image build process?",
    "options": [
      "Compose.yml",
      "config.json",
      "Dockerfile",
      "ImageFile"
    ],
    "correctAnswer": "Dockerfile",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Dockerfile"
  },
  {
    "skillName": "Docker",
    "questionText": "What does the docker run command do?",
    "options": [
      "Deletes all containers",
      "Builds a new image",
      "Creates and starts a new container",
      "Pulls images from registry"
    ],
    "correctAnswer": "Creates and starts a new container",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Creates and starts a new container"
  },
  {
    "skillName": "Docker",
    "questionText": "What is the purpose of Docker Compose?",
    "options": [
      "Manage multi-container applications",
      "Encrypt images",
      "Create new Dockerfile",
      "Monitor logs"
    ],
    "correctAnswer": "Manage multi-container applications",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Manage multi-container applications"
  },
  {
    "skillName": "Docker",
    "questionText": "What is a Docker volume used for?",
    "options": [
      "Persist data beyond container lifecycle",
      "Store logs",
      "Define networks",
      "Save image layers"
    ],
    "correctAnswer": "Persist data beyond container lifecycle",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Persist data beyond container lifecycle"
  },
  {
    "skillName": "Docker",
    "questionText": "What is Docker Hub?",
    "options": [
      "Central repository for sharing container images",
      "CLI tool",
      "Network driver",
      "Logging service"
    ],
    "correctAnswer": "Central repository for sharing container images",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Central repository for sharing container images"
  },
  {
    "skillName": "Docker",
    "questionText": "What command removes all stopped containers?",
    "options": [
      "docker container prune",
      "docker flush",
      "docker reset",
      "docker stop all"
    ],
    "correctAnswer": "docker container prune",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: docker container prune"
  },
  {
    "skillName": "Docker",
    "questionText": "What is a Docker network used for?",
    "options": [
      "Connecting multiple containers to communicate",
      "Encrypting data",
      "Caching images",
      "Storing logs"
    ],
    "correctAnswer": "Connecting multiple containers to communicate",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Connecting multiple containers to communicate"
  },
  {
    "skillName": "Docker",
    "questionText": "What is a multi-stage build in Docker?",
    "options": [
      "Process that reduces image size by separating build and runtime stages",
      "Debugging mode",
      "Building multiple images simultaneously",
      "Testing environment"
    ],
    "correctAnswer": "Process that reduces image size by separating build and runtime stages",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Process that reduces image size by separating build and runtime stages"
  },
  {
    "skillName": "Docker",
    "questionText": "What is the purpose of the ENTRYPOINT command?",
    "options": [
      "Defines default executable for a container",
      "Installs dependencies",
      "Exports ports",
      "Creates environment variables"
    ],
    "correctAnswer": "Defines default executable for a container",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Defines default executable for a container"
  },
  {
    "skillName": "Docker",
    "questionText": "What is Docker Swarm?",
    "options": [
      "Native orchestration tool for clustering containers",
      "Virtual file system",
      "Security layer",
      "Backup system"
    ],
    "correctAnswer": "Native orchestration tool for clustering containers",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Native orchestration tool for clustering containers"
  },
  {
    "skillName": "Docker",
    "questionText": "What does the --detach or -d flag do?",
    "options": [
      "Runs container in background mode",
      "Builds new image",
      "Removes volumes",
      "Stops container immediately"
    ],
    "correctAnswer": "Runs container in background mode",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Runs container in background mode"
  },
  {
    "skillName": "Docker",
    "questionText": "What is difference between CMD and ENTRYPOINT?",
    "options": [
      "CMD provides default arguments; ENTRYPOINT defines executable",
      "Both are same",
      "CMD overrides ENTRYPOINT",
      "ENTRYPOINT executes last"
    ],
    "correctAnswer": "CMD provides default arguments; ENTRYPOINT defines executable",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: CMD provides default arguments; ENTRYPOINT defines executable"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "Kubernetes is mainly used for?",
    "options": [
      "Container orchestration and management",
      "CI pipeline setup",
      "Web hosting",
      "Database replication"
    ],
    "correctAnswer": "Container orchestration and management",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Container orchestration and management"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is a Pod in Kubernetes?",
    "options": [
      "Smallest deployable unit containing one or more containers",
      "Namespace",
      "Storage volume",
      "Service account"
    ],
    "correctAnswer": "Smallest deployable unit containing one or more containers",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Smallest deployable unit containing one or more containers"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is the command-line tool for Kubernetes?",
    "options": [
      "kubectl",
      "helm",
      "kubeadm",
      "kubeproxy"
    ],
    "correctAnswer": "kubectl",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: kubectl"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is a Node?",
    "options": [
      "Worker machine that runs Pods",
      "Config file",
      "Log manager",
      "Service mesh"
    ],
    "correctAnswer": "Worker machine that runs Pods",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Worker machine that runs Pods"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What file defines Kubernetes objects?",
    "options": [
      "YAML file",
      "Config.txt",
      "Dockerfile",
      "JSON file"
    ],
    "correctAnswer": "YAML file",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: YAML file"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is a Deployment used for?",
    "options": [
      "Managing replicas and rollout of Pods",
      "Storing secrets",
      "Monitoring clusters",
      "Creating networks"
    ],
    "correctAnswer": "Managing replicas and rollout of Pods",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Managing replicas and rollout of Pods"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is a ConfigMap?",
    "options": [
      "Stores non-confidential configuration data",
      "Stores secrets",
      "Defines Pods",
      "Monitors services"
    ],
    "correctAnswer": "Stores non-confidential configuration data",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Stores non-confidential configuration data"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is a Service in Kubernetes?",
    "options": [
      "Exposes Pods to network traffic",
      "Scales replicas",
      "Cleans logs",
      "Creates config files"
    ],
    "correctAnswer": "Exposes Pods to network traffic",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Exposes Pods to network traffic"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What does a ReplicaSet do?",
    "options": [
      "Ensures defined number of Pod replicas are running",
      "Encrypts pods",
      "Monitors metrics",
      "Backups cluster"
    ],
    "correctAnswer": "Ensures defined number of Pod replicas are running",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Ensures defined number of Pod replicas are running"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is a Namespace?",
    "options": [
      "Logical partitioning of cluster resources",
      "Node pool",
      "A network",
      "Pod configuration"
    ],
    "correctAnswer": "Logical partitioning of cluster resources",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Logical partitioning of cluster resources"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is Ingress used for?",
    "options": [
      "Managing external HTTP/HTTPS access to services",
      "Scaling nodes",
      "Load balancing databases",
      "Controlling namespaces"
    ],
    "correctAnswer": "Managing external HTTP/HTTPS access to services",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Managing external HTTP/HTTPS access to services"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is etcd in Kubernetes?",
    "options": [
      "Key-value store maintaining cluster state",
      "DNS resolver",
      "Security scanner",
      "Monitoring tool"
    ],
    "correctAnswer": "Key-value store maintaining cluster state",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Key-value store maintaining cluster state"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is Helm used for?",
    "options": [
      "Kubernetes package manager for managing charts",
      "Setting environment variables",
      "Creating Pods manually",
      "Scaling applications"
    ],
    "correctAnswer": "Kubernetes package manager for managing charts",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Kubernetes package manager for managing charts"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is kube-scheduler's role?",
    "options": [
      "Assigns Pods to appropriate Nodes",
      "Cleans namespaces",
      "Restarts services",
      "Monitors API calls"
    ],
    "correctAnswer": "Assigns Pods to appropriate Nodes",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Assigns Pods to appropriate Nodes"
  },
  {
    "skillName": "Kubernetes",
    "questionText": "What is the purpose of kube-proxy?",
    "options": [
      "Handles network traffic routing inside the cluster",
      "Compiles nodes",
      "Encrypts cluster communication",
      "Stores YAML definitions"
    ],
    "correctAnswer": "Handles network traffic routing inside the cluster",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Handles network traffic routing inside the cluster"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What does CI stand for?",
    "options": [
      "Continuous Integration",
      "Continuous Improvement",
      "Code Inference",
      "Constant Installation"
    ],
    "correctAnswer": "Continuous Integration",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Continuous Integration"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What does CD stand for in DevOps?",
    "options": [
      "Continuous Delivery or Deployment",
      "Continuous Debugging",
      "Command Deployment",
      "Code Design"
    ],
    "correctAnswer": "Continuous Delivery or Deployment",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Continuous Delivery or Deployment"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is the main purpose of CI/CD?",
    "options": [
      "Automate build, test, and deployment processes",
      "Manage API versions",
      "Generate reports",
      "Store code backups"
    ],
    "correctAnswer": "Automate build, test, and deployment processes",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Automate build, test, and deployment processes"
  },
  {
    "skillName": "CI/CD",
    "questionText": "Which tool is widely used for CI/CD?",
    "options": [
      "Jenkins",
      "MongoDB",
      "MySQL",
      "Figma"
    ],
    "correctAnswer": "Jenkins",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Jenkins"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is version control used for in CI?",
    "options": [
      "Tracking code changes and collaboration",
      "Limiting commits",
      "Encrypting repositories",
      "Deleting branches"
    ],
    "correctAnswer": "Tracking code changes and collaboration",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Tracking code changes and collaboration"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is a build pipeline?",
    "options": [
      "Automated sequence of steps from code to deployment",
      "Code review",
      "Manual testing",
      "Bug reporting"
    ],
    "correctAnswer": "Automated sequence of steps from code to deployment",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Automated sequence of steps from code to deployment"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is an artifact in CI/CD?",
    "options": [
      "Compiled or packaged output of a build",
      "Log file",
      "Database table",
      "Configuration file"
    ],
    "correctAnswer": "Compiled or packaged output of a build",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Compiled or packaged output of a build"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is rollback in deployment?",
    "options": [
      "Reverting to a previous stable version",
      "Undoing commits",
      "Recompiling code",
      "Restarting Jenkins"
    ],
    "correctAnswer": "Reverting to a previous stable version",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Reverting to a previous stable version"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is blue-green deployment?",
    "options": [
      "Zero-downtime release by switching between two environments",
      "Manual deployment",
      "Pipeline scheduling",
      "Testing code in different colors"
    ],
    "correctAnswer": "Zero-downtime release by switching between two environments",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Zero-downtime release by switching between two environments"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is continuous monitoring?",
    "options": [
      "Tracking application health and performance post-deployment",
      "Running builds repeatedly",
      "Restarting servers",
      "Managing backups"
    ],
    "correctAnswer": "Tracking application health and performance post-deployment",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Tracking application health and performance post-deployment"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is canary deployment?",
    "options": [
      "Releasing updates to small user group before full rollout",
      "Pipeline debugging",
      "Full release at once",
      "Network test"
    ],
    "correctAnswer": "Releasing updates to small user group before full rollout",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Releasing updates to small user group before full rollout"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is Infrastructure as Code in CI/CD?",
    "options": [
      "Managing infrastructure using scripts and version control",
      "Manual provisioning",
      "Hardware monitoring",
      "Software rollback"
    ],
    "correctAnswer": "Managing infrastructure using scripts and version control",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Managing infrastructure using scripts and version control"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is pipeline as code?",
    "options": [
      "Defining CI/CD pipeline configuration using YAML or script files",
      "CI scheduling",
      "Environment cloning",
      "Writing code in pipelines"
    ],
    "correctAnswer": "Defining CI/CD pipeline configuration using YAML or script files",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Defining CI/CD pipeline configuration using YAML or script files"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is container-based deployment?",
    "options": [
      "Deploying applications in Docker or Kubernetes containers",
      "Offline setup",
      "Manual build",
      "Using cloud only"
    ],
    "correctAnswer": "Deploying applications in Docker or Kubernetes containers",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Deploying applications in Docker or Kubernetes containers"
  },
  {
    "skillName": "CI/CD",
    "questionText": "What is DevSecOps?",
    "options": [
      "Integrating security practices within DevOps pipelines",
      "Security-only deployment",
      "Network testing",
      "Encryption setup"
    ],
    "correctAnswer": "Integrating security practices within DevOps pipelines",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Integrating security practices within DevOps pipelines"
  },
  {
    "skillName": "Jenkins",
    "questionText": "Jenkins is a tool for?",
    "options": [
      "Continuous Integration and Delivery",
      "Database management",
      "Container orchestration",
      "File compression"
    ],
    "correctAnswer": "Continuous Integration and Delivery",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Continuous Integration and Delivery"
  },
  {
    "skillName": "Jenkins",
    "questionText": "Jenkins is written in?",
    "options": [
      "Java",
      "Python",
      "Go",
      "C++"
    ],
    "correctAnswer": "Java",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Java"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is Jenkinsfile used for?",
    "options": [
      "Define build pipeline as code",
      "Configure UI",
      "Set passwords",
      "Store logs"
    ],
    "correctAnswer": "Define build pipeline as code",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Define build pipeline as code"
  },
  {
    "skillName": "Jenkins",
    "questionText": "Jenkins plugins are used to?",
    "options": [
      "Extend Jenkins functionality",
      "Compile source code",
      "Deploy directly to servers",
      "Test APIs"
    ],
    "correctAnswer": "Extend Jenkins functionality",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Extend Jenkins functionality"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is a Jenkins job?",
    "options": [
      "Task that defines a CI/CD process",
      "Log report",
      "Backup service",
      "User login"
    ],
    "correctAnswer": "Task that defines a CI/CD process",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Task that defines a CI/CD process"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is a Jenkins agent?",
    "options": [
      "Node that executes build tasks",
      "Data backup",
      "Web dashboard",
      "Plugin store"
    ],
    "correctAnswer": "Node that executes build tasks",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Node that executes build tasks"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is a pipeline stage?",
    "options": [
      "Step or group of steps in the build process",
      "Config loader",
      "Job scheduler",
      "Variable file"
    ],
    "correctAnswer": "Step or group of steps in the build process",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Step or group of steps in the build process"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is Jenkins master?",
    "options": [
      "Central controller managing agents",
      "Plugin handler",
      "Backup database",
      "Local worker node"
    ],
    "correctAnswer": "Central controller managing agents",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Central controller managing agents"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is Jenkins credential store used for?",
    "options": [
      "Securely store secrets and API tokens",
      "Encrypt builds",
      "Caching artifacts",
      "Logging users"
    ],
    "correctAnswer": "Securely store secrets and API tokens",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Securely store secrets and API tokens"
  },
  {
    "skillName": "Jenkins",
    "questionText": "Which command triggers Jenkins build remotely?",
    "options": [
      "curl -X POST <job_url>/build",
      "build run",
      "job trigger",
      "jenkins start job"
    ],
    "correctAnswer": "curl -X POST <job_url>/build",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: curl -X POST <job_url>/build"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is Jenkins distributed build?",
    "options": [
      "Running builds across multiple agents for scalability",
      "Plugin compilation",
      "Sequential tasking",
      "Multi-stage pipeline"
    ],
    "correctAnswer": "Running builds across multiple agents for scalability",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Running builds across multiple agents for scalability"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is Jenkins Blue Ocean?",
    "options": [
      "Modern UI for Jenkins pipelines",
      "Plugin management tool",
      "Backup service",
      "Database view"
    ],
    "correctAnswer": "Modern UI for Jenkins pipelines",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Modern UI for Jenkins pipelines"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is post-build action?",
    "options": [
      "Steps executed after a build (e.g., deploy or notify)",
      "Restart Jenkins",
      "Rollback job",
      "Create Dockerfile"
    ],
    "correctAnswer": "Steps executed after a build (e.g., deploy or notify)",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Steps executed after a build (e.g., deploy or notify)"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is Jenkins shared library?",
    "options": [
      "Reusable Groovy code library for pipelines",
      "Plugin repository",
      "Worker cache",
      "Secret vault"
    ],
    "correctAnswer": "Reusable Groovy code library for pipelines",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Reusable Groovy code library for pipelines"
  },
  {
    "skillName": "Jenkins",
    "questionText": "What is Jenkins webhook?",
    "options": [
      "Automatic trigger from SCM like GitHub when code changes",
      "Manual build",
      "Security test",
      "User login"
    ],
    "correctAnswer": "Automatic trigger from SCM like GitHub when code changes",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Automatic trigger from SCM like GitHub when code changes"
  },
  {
    "skillName": "Ansible",
    "questionText": "Ansible is a tool for?",
    "options": [
      "Configuration management and automation",
      "File transfer",
      "Code compilation",
      "Cloud hosting"
    ],
    "correctAnswer": "Configuration management and automation",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Configuration management and automation"
  },
  {
    "skillName": "Ansible",
    "questionText": "Which language is used to write Ansible playbooks?",
    "options": [
      "YAML",
      "XML",
      "Bash",
      "JSON"
    ],
    "correctAnswer": "YAML",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: YAML"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is an inventory file?",
    "options": [
      "List of managed hosts for Ansible",
      "Script log",
      "Config cache",
      "Role list"
    ],
    "correctAnswer": "List of managed hosts for Ansible",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: List of managed hosts for Ansible"
  },
  {
    "skillName": "Ansible",
    "questionText": "What command runs a playbook?",
    "options": [
      "ansible-playbook",
      "play start",
      "ansible-run",
      "deploy ansible"
    ],
    "correctAnswer": "ansible-playbook",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: ansible-playbook"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is a module in Ansible?",
    "options": [
      "Predefined unit that performs specific automation tasks",
      "Playbook header",
      "Config section",
      "YAML comment"
    ],
    "correctAnswer": "Predefined unit that performs specific automation tasks",
    "difficulty": "basic",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Predefined unit that performs specific automation tasks"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is an Ansible role?",
    "options": [
      "Organized way to structure reusable automation content",
      "Plugin",
      "User access file",
      "Network setup"
    ],
    "correctAnswer": "Organized way to structure reusable automation content",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Organized way to structure reusable automation content"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is the ad-hoc command format?",
    "options": [
      "ansible <host> -m <module>",
      "module run ansible",
      "ansible run playbook",
      "ansible task"
    ],
    "correctAnswer": "ansible <host> -m <module>",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: ansible <host> -m <module>"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is idempotency in Ansible?",
    "options": [
      "Running the same playbook multiple times results in same state",
      "Random execution",
      "Backup process",
      "Scaling tasks"
    ],
    "correctAnswer": "Running the same playbook multiple times results in same state",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Running the same playbook multiple times results in same state"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is a handler in Ansible?",
    "options": [
      "Triggered task that runs when notified by another task",
      "Log reader",
      "Service",
      "User role"
    ],
    "correctAnswer": "Triggered task that runs when notified by another task",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Triggered task that runs when notified by another task"
  },
  {
    "skillName": "Ansible",
    "questionText": "What does ansible-galaxy do?",
    "options": [
      "Downloads or shares roles from community repositories",
      "Encrypts files",
      "Runs local scripts",
      "Restarts servers"
    ],
    "correctAnswer": "Downloads or shares roles from community repositories",
    "difficulty": "intermediate",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Downloads or shares roles from community repositories"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is Ansible Vault used for?",
    "options": [
      "Encrypting sensitive data like passwords in playbooks",
      "Monitoring performance",
      "Managing logs",
      "Compressing roles"
    ],
    "correctAnswer": "Encrypting sensitive data like passwords in playbooks",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Encrypting sensitive data like passwords in playbooks"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is dynamic inventory?",
    "options": [
      "Automatically fetches host info from cloud providers",
      "Static host file",
      "Local variable list",
      "API endpoint"
    ],
    "correctAnswer": "Automatically fetches host info from cloud providers",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Automatically fetches host info from cloud providers"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is Jinja2 in Ansible?",
    "options": [
      "Template engine used for variable substitution",
      "Logging format",
      "Role manager",
      "Plugin runner"
    ],
    "correctAnswer": "Template engine used for variable substitution",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Template engine used for variable substitution"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is Ansible Tower?",
    "options": [
      "Web UI and dashboard for managing playbooks and inventories",
      "Command line interface",
      "Database",
      "Monitoring tool"
    ],
    "correctAnswer": "Web UI and dashboard for managing playbooks and inventories",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Web UI and dashboard for managing playbooks and inventories"
  },
  {
    "skillName": "Ansible",
    "questionText": "What is fact gathering?",
    "options": [
      "Collecting system information from managed hosts",
      "Logging user info",
      "Creating backups",
      "Encrypting playbooks"
    ],
    "correctAnswer": "Collecting system information from managed hosts",
    "difficulty": "advanced",
    "questionType": "multiple-choice",
    "explanation": "The correct answer is: Collecting system information from managed hosts"
  }
];
