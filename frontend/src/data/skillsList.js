// Comprehensive list of skills for autocomplete
// Organized by category for better management

export const SKILLS_DATABASE = [
  // Programming Languages
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'C',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'PHP',
  'Ruby',
  'Scala',
  'R',
  'MATLAB',
  'Perl',
  'Dart',
  'Objective-C',
  'Shell Scripting',
  'Bash',
  'PowerShell',
  
  // Frontend Development
  'React',
  'React.js',
  'Angular',
  'Vue.js',
  'Next.js',
  'Nuxt.js',
  'Svelte',
  'HTML',
  'HTML5',
  'CSS',
  'CSS3',
  'SASS',
  'SCSS',
  'LESS',
  'Tailwind CSS',
  'Bootstrap',
  'Material-UI',
  'Ant Design',
  'Chakra UI',
  'Styled Components',
  'Redux',
  'MobX',
  'Zustand',
  'Recoil',
  'jQuery',
  'Webpack',
  'Vite',
  'Parcel',
  'Babel',
  
  // Backend Development
  'Node.js',
  'Express.js',
  'NestJS',
  'Django',
  'Flask',
  'FastAPI',
  'Spring Boot',
  'Spring Framework',
  'ASP.NET',
  '.NET Core',
  'Ruby on Rails',
  'Laravel',
  'Symfony',
  'CodeIgniter',
  'Gin',
  'Echo',
  'Fiber',
  
  // Databases
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'SQLite',
  'Oracle',
  'Microsoft SQL Server',
  'MariaDB',
  'Cassandra',
  'DynamoDB',
  'Firebase',
  'Firestore',
  'Supabase',
  'CouchDB',
  'Neo4j',
  'InfluxDB',
  'Elasticsearch',
  
  // Cloud & DevOps
  'AWS',
  'Amazon Web Services',
  'Azure',
  'Google Cloud Platform',
  'GCP',
  'Docker',
  'Kubernetes',
  'Jenkins',
  'GitLab CI/CD',
  'GitHub Actions',
  'CircleCI',
  'Travis CI',
  'Terraform',
  'Ansible',
  'Puppet',
  'Chef',
  'Vagrant',
  'Nginx',
  'Apache',
  'Linux',
  'Ubuntu',
  'CentOS',
  'Debian',
  
  // Mobile Development
  'React Native',
  'Flutter',
  'Ionic',
  'Xamarin',
  'SwiftUI',
  'Android Development',
  'iOS Development',
  'Kotlin Multiplatform',
  'Cordova',
  'PhoneGap',
  
  // AI & Machine Learning
  'Machine Learning',
  'Deep Learning',
  'TensorFlow',
  'PyTorch',
  'Keras',
  'Scikit-learn',
  'OpenCV',
  'Natural Language Processing',
  'NLP',
  'Computer Vision',
  'Neural Networks',
  'CNN',
  'RNN',
  'LSTM',
  'Transformers',
  'BERT',
  'GPT',
  'LangChain',
  'Hugging Face',
  'MLflow',
  'Pandas',
  'NumPy',
  'Matplotlib',
  'Seaborn',
  'Jupyter',
  
  // Data Science & Analytics
  'Data Analysis',
  'Data Visualization',
  'Tableau',
  'Power BI',
  'Apache Spark',
  'Hadoop',
  'Apache Kafka',
  'Apache Airflow',
  'ETL',
  'Data Mining',
  'Statistical Analysis',
  'A/B Testing',
  
  // Testing
  'Jest',
  'Mocha',
  'Chai',
  'Jasmine',
  'Cypress',
  'Selenium',
  'Playwright',
  'Puppeteer',
  'JUnit',
  'PyTest',
  'TestNG',
  'Postman',
  'Insomnia',
  'Unit Testing',
  'Integration Testing',
  'E2E Testing',
  'TDD',
  'BDD',
  
  // Version Control
  'Git',
  'GitHub',
  'GitLab',
  'Bitbucket',
  'SVN',
  'Mercurial',
  
  // API & Web Services
  'REST API',
  'RESTful API',
  'GraphQL',
  'gRPC',
  'WebSocket',
  'SOAP',
  'Microservices',
  'API Design',
  'Swagger',
  'OpenAPI',
  
  // Security
  'Cybersecurity',
  'Information Security',
  'Penetration Testing',
  'Ethical Hacking',
  'OWASP',
  'OAuth',
  'JWT',
  'SSL/TLS',
  'Encryption',
  'Authentication',
  'Authorization',
  
  // Blockchain
  'Blockchain',
  'Ethereum',
  'Solidity',
  'Smart Contracts',
  'Web3.js',
  'Hyperledger',
  'Cryptocurrency',
  
  // Game Development
  'Unity',
  'Unreal Engine',
  'Godot',
  'Game Design',
  '3D Modeling',
  'Blender',
  'Maya',
  
  // Design
  'UI/UX Design',
  'Figma',
  'Adobe XD',
  'Sketch',
  'InVision',
  'Photoshop',
  'Illustrator',
  'After Effects',
  'Responsive Design',
  'User Research',
  'Wireframing',
  'Prototyping',
  
  // Soft Skills
  'Communication',
  'Leadership',
  'Team Collaboration',
  'Problem Solving',
  'Critical Thinking',
  'Time Management',
  'Project Management',
  'Agile',
  'Scrum',
  'Kanban',
  'JIRA',
  'Confluence',
  'Trello',
  'Asana',
  
  // Other Technologies
  'Blockchain',
  'IoT',
  'AR/VR',
  'WebAssembly',
  'Progressive Web Apps',
  'PWA',
  'Serverless',
  'Lambda Functions',
  'Edge Computing',
  'WebRTC',
  'Socket.io',
  'RabbitMQ',
  'Message Queue',
  'Microservices Architecture',
  'Monolithic Architecture',
  'Event-Driven Architecture',
  'Domain-Driven Design',
  'Clean Architecture',
  'SOLID Principles',
  'Design Patterns',
  'Object-Oriented Programming',
  'OOP',
  'Functional Programming',
  'Reactive Programming',
];

// Export sorted and unique list
export const SKILLS_LIST = [...new Set(SKILLS_DATABASE)].sort();

// Category-wise skills for better organization
export const SKILLS_BY_CATEGORY = {
  'Frontend': [
    'React', 'React.js', 'Angular', 'Vue.js', 'Next.js', 'Nuxt.js', 'Svelte',
    'HTML', 'HTML5', 'CSS', 'CSS3', 'SASS', 'SCSS', 'LESS',
    'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Ant Design', 'Chakra UI',
    'Styled Components', 'Redux', 'MobX', 'Zustand', 'Recoil', 'jQuery',
    'Webpack', 'Vite', 'Parcel', 'Babel', 'UI/UX Design', 'Figma', 'Adobe XD',
    'Sketch', 'Responsive Design', 'Wireframing', 'Prototyping'
  ],
  'Backend': [
    'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI',
    'Spring Boot', 'Spring Framework', 'ASP.NET', '.NET Core',
    'Ruby on Rails', 'Laravel', 'Symfony', 'CodeIgniter',
    'Gin', 'Echo', 'Fiber', 'REST API', 'RESTful API', 'GraphQL',
    'gRPC', 'WebSocket', 'SOAP', 'Microservices', 'API Design'
  ],
  'Database': [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
    'Microsoft SQL Server', 'MariaDB', 'Cassandra', 'DynamoDB',
    'Firebase', 'Firestore', 'Supabase', 'CouchDB', 'Neo4j',
    'InfluxDB', 'Elasticsearch', 'SQL'
  ],
  'DevOps': [
    'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI/CD', 'GitHub Actions',
    'CircleCI', 'Travis CI', 'Terraform', 'Ansible', 'Puppet', 'Chef',
    'Vagrant', 'Nginx', 'Apache', 'Linux', 'Ubuntu', 'CentOS', 'Debian',
    'CI/CD', 'Shell Scripting', 'Bash', 'PowerShell'
  ],
  'Cloud': [
    'AWS', 'Amazon Web Services', 'Azure', 'Google Cloud Platform', 'GCP',
    'Serverless', 'Lambda Functions', 'Edge Computing', 'Networking'
  ],
  'Mobile': [
    'React Native', 'Flutter', 'Ionic', 'Xamarin', 'SwiftUI',
    'Android Development', 'iOS Development', 'Kotlin Multiplatform',
    'Cordova', 'PhoneGap', 'Mobile UI/UX'
  ],
  'AI/ML': [
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras',
    'Scikit-learn', 'OpenCV', 'Natural Language Processing', 'NLP',
    'Computer Vision', 'Neural Networks', 'CNN', 'RNN', 'LSTM',
    'Transformers', 'BERT', 'GPT', 'LangChain', 'Hugging Face', 'MLflow',
    'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter',
    'Data Analysis', 'Data Visualization', 'Statistics', 'Statistical Analysis'
  ],
  'Security': [
    'Cybersecurity', 'Information Security', 'Penetration Testing',
    'Ethical Hacking', 'OWASP', 'OAuth', 'JWT', 'SSL/TLS', 'Encryption',
    'Authentication', 'Authorization', 'Network Security', 'Security Auditing'
  ],
  'Testing': [
    'Jest', 'Mocha', 'Chai', 'Jasmine', 'Cypress', 'Selenium', 'Playwright',
    'Puppeteer', 'JUnit', 'PyTest', 'TestNG', 'Postman', 'Insomnia',
    'Unit Testing', 'Integration Testing', 'E2E Testing', 'TDD', 'BDD'
  ],
  'Other': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C',
    'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'Ruby', 'Scala', 'R',
    'MATLAB', 'Perl', 'Dart', 'Objective-C',
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial',
    'Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts', 'Web3.js',
    'Unity', 'Unreal Engine', 'Godot', 'Game Design', '3D Modeling',
    'Blender', 'Maya', 'Photoshop', 'Illustrator', 'After Effects',
    'Communication', 'Leadership', 'Team Collaboration', 'Problem Solving',
    'Critical Thinking', 'Time Management', 'Project Management',
    'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence', 'Trello', 'Asana',
    'IoT', 'AR/VR', 'WebAssembly', 'Progressive Web Apps', 'PWA',
    'WebRTC', 'Socket.io', 'RabbitMQ', 'Message Queue',
    'Microservices Architecture', 'Event-Driven Architecture',
    'Domain-Driven Design', 'Clean Architecture', 'SOLID Principles',
    'Design Patterns', 'Object-Oriented Programming', 'OOP',
    'Functional Programming', 'Reactive Programming',
    'Tableau', 'Power BI', 'Apache Spark', 'Hadoop', 'Apache Kafka',
    'Apache Airflow', 'ETL', 'Data Mining', 'A/B Testing', 'Excel'
  ],
};

// Function to auto-detect category based on skill name
export const detectCategory = (skillName) => {
  if (!skillName) return '';
  
  const normalizedSkill = skillName.trim();
  
  // Search through categories to find a match
  for (const [category, skills] of Object.entries(SKILLS_BY_CATEGORY)) {
    const found = skills.some(skill => 
      skill.toLowerCase() === normalizedSkill.toLowerCase()
    );
    if (found) {
      return category;
    }
  }
  
  // If no exact match, try partial matching for common patterns
  const lowerSkill = normalizedSkill.toLowerCase();
  
  // Frontend patterns
  if (lowerSkill.includes('react') || lowerSkill.includes('angular') || 
      lowerSkill.includes('vue') || lowerSkill.includes('html') || 
      lowerSkill.includes('css') || lowerSkill.includes('ui') ||
      lowerSkill.includes('frontend') || lowerSkill.includes('front-end')) {
    return 'Frontend';
  }
  
  // Backend patterns
  if (lowerSkill.includes('node') || lowerSkill.includes('express') ||
      lowerSkill.includes('django') || lowerSkill.includes('flask') ||
      lowerSkill.includes('spring') || lowerSkill.includes('api') ||
      lowerSkill.includes('backend') || lowerSkill.includes('back-end')) {
    return 'Backend';
  }
  
  // Database patterns
  if (lowerSkill.includes('sql') || lowerSkill.includes('mongo') ||
      lowerSkill.includes('database') || lowerSkill.includes('db') ||
      lowerSkill.includes('redis') || lowerSkill.includes('firebase')) {
    return 'Database';
  }
  
  // Cloud patterns
  if (lowerSkill.includes('aws') || lowerSkill.includes('azure') ||
      lowerSkill.includes('gcp') || lowerSkill.includes('cloud')) {
    return 'Cloud';
  }
  
  // DevOps patterns
  if (lowerSkill.includes('docker') || lowerSkill.includes('kubernetes') ||
      lowerSkill.includes('jenkins') || lowerSkill.includes('terraform') ||
      lowerSkill.includes('devops') || lowerSkill.includes('ci/cd')) {
    return 'DevOps';
  }
  
  // Mobile patterns
  if (lowerSkill.includes('mobile') || lowerSkill.includes('android') ||
      lowerSkill.includes('ios') || lowerSkill.includes('flutter') ||
      lowerSkill.includes('swift')) {
    return 'Mobile';
  }
  
  // AI/ML patterns
  if (lowerSkill.includes('machine learning') || lowerSkill.includes('ml') ||
      lowerSkill.includes('ai') || lowerSkill.includes('tensorflow') ||
      lowerSkill.includes('pytorch') || lowerSkill.includes('neural') ||
      lowerSkill.includes('deep learning')) {
    return 'AI/ML';
  }
  
  // Security patterns
  if (lowerSkill.includes('security') || lowerSkill.includes('cyber') ||
      lowerSkill.includes('encryption') || lowerSkill.includes('penetration')) {
    return 'Security';
  }
  
  // Testing patterns
  if (lowerSkill.includes('test') || lowerSkill.includes('jest') ||
      lowerSkill.includes('cypress') || lowerSkill.includes('selenium')) {
    return 'Testing';
  }
  
  // Default to Other if no match found
  return 'Other';
};

export default SKILLS_LIST;
