// Comprehensive Learning Resources Database
// Organized by skill with proficiency-based filtering

export const LEARNING_RESOURCES = {
  // ============ PROGRAMMING LANGUAGES ============
  
  JavaScript: {
    courses: [
      {
        title: 'JavaScript Basics for Beginners',
        platform: 'freeCodeCamp',
        instructor: 'freeCodeCamp Team',
        duration: '10 hours',
        level: 'Beginner',
        proficiencyRange: [0, 40],
        rating: 4.8,
        students: '500k+',
        price: 'Free',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
      },
      {
        title: 'Modern JavaScript From The Beginning',
        platform: 'Udemy',
        instructor: 'Brad Traversy',
        duration: '21 hours',
        level: 'Beginner',
        proficiencyRange: [0, 50],
        rating: 4.7,
        students: '95k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/modern-javascript-from-the-beginning/',
      },
      {
        title: 'JavaScript - The Complete Guide',
        platform: 'Udemy',
        instructor: 'Maximilian Schwarzmüller',
        duration: '52 hours',
        level: 'All Levels',
        proficiencyRange: [30, 100],
        rating: 4.6,
        students: '180k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/',
      },
      {
        title: 'Advanced JavaScript Concepts',
        platform: 'Udemy',
        instructor: 'Andrei Neagoie',
        duration: '24 hours',
        level: 'Advanced',
        proficiencyRange: [60, 100],
        rating: 4.7,
        students: '75k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/advanced-javascript-concepts/',
      },
    ],
    documentation: [
      {
        title: 'MDN Web Docs - JavaScript',
        description: 'Comprehensive JavaScript documentation and tutorials',
        level: 'All Levels',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      },
      {
        title: 'JavaScript.info',
        description: 'Modern JavaScript tutorial with interactive examples',
        level: 'All Levels',
        url: 'https://javascript.info/',
      },
      {
        title: 'Eloquent JavaScript',
        description: 'Free online book covering JavaScript fundamentals to advanced topics',
        level: 'Intermediate',
        url: 'https://eloquentjavascript.net/',
      },
    ],
    projects: [
      {
        title: 'Todo List with LocalStorage',
        description: 'Build a CRUD app with browser storage',
        difficulty: 'Beginner',
        proficiencyRange: [0, 40],
        estimatedTime: '3 days',
        skills: ['DOM Manipulation', 'LocalStorage', 'Event Handling'],
      },
      {
        title: '30 JavaScript Projects in 30 Days',
        description: 'Build diverse projects to master JavaScript',
        difficulty: 'Intermediate',
        proficiencyRange: [40, 70],
        estimatedTime: '30 days',
        skills: ['APIs', 'DOM', 'ES6+', 'Async/Await'],
      },
      {
        title: 'JavaScript Design Patterns Implementation',
        description: 'Implement common design patterns in JavaScript',
        difficulty: 'Advanced',
        proficiencyRange: [70, 100],
        estimatedTime: '2 weeks',
        skills: ['OOP', 'Design Patterns', 'Architecture'],
      },
    ],
  },

  Python: {
    courses: [
      {
        title: 'Python for Everybody',
        platform: 'Coursera',
        instructor: 'Dr. Charles Severance',
        duration: '8 months',
        level: 'Beginner',
        proficiencyRange: [0, 40],
        rating: 4.8,
        students: '2M+',
        price: 'Free',
        url: 'https://www.coursera.org/specializations/python',
      },
      {
        title: 'Complete Python Bootcamp',
        platform: 'Udemy',
        instructor: 'Jose Portilla',
        duration: '22 hours',
        level: 'All Levels',
        proficiencyRange: [0, 70],
        rating: 4.6,
        students: '1.5M+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/complete-python-bootcamp/',
      },
      {
        title: 'Advanced Python Programming',
        platform: 'Udemy',
        instructor: 'Patrick Loeber',
        duration: '14 hours',
        level: 'Advanced',
        proficiencyRange: [60, 100],
        rating: 4.7,
        students: '50k+',
        price: '$79.99',
        url: 'https://www.udemy.com/course/python-advanced/',
      },
    ],
    documentation: [
      {
        title: 'Python Official Documentation',
        description: 'Comprehensive Python documentation with tutorials',
        level: 'All Levels',
        url: 'https://docs.python.org/3/',
      },
      {
        title: 'Real Python',
        description: 'In-depth Python tutorials and articles',
        level: 'Intermediate',
        url: 'https://realpython.com/',
      },
    ],
    projects: [
      {
        title: 'Web Scraper with BeautifulSoup',
        description: 'Extract data from websites automatically',
        difficulty: 'Beginner',
        proficiencyRange: [20, 50],
        estimatedTime: '1 week',
        skills: ['Requests', 'BeautifulSoup', 'Data Parsing'],
      },
      {
        title: 'REST API with Flask',
        description: 'Build a complete RESTful API',
        difficulty: 'Intermediate',
        proficiencyRange: [40, 70],
        estimatedTime: '2 weeks',
        skills: ['Flask', 'REST', 'SQLAlchemy', 'JWT'],
      },
      {
        title: 'Machine Learning Model Deployment',
        description: 'Deploy ML models with FastAPI and Docker',
        difficulty: 'Advanced',
        proficiencyRange: [70, 100],
        estimatedTime: '3 weeks',
        skills: ['FastAPI', 'Docker', 'ML', 'Production'],
      },
    ],
  },

  // ============ FRONTEND FRAMEWORKS ============

  React: {
    courses: [
      {
        title: 'React Basics',
        platform: 'Scrimba',
        instructor: 'Bob Ziroll',
        duration: '5 hours',
        level: 'Beginner',
        proficiencyRange: [0, 35],
        rating: 4.9,
        students: '100k+',
        price: 'Free',
        url: 'https://scrimba.com/learn/learnreact',
      },
      {
        title: 'React - The Complete Guide',
        platform: 'Udemy',
        instructor: 'Maximilian Schwarzmüller',
        duration: '48 hours',
        level: 'All Levels',
        proficiencyRange: [0, 80],
        rating: 4.7,
        students: '200k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
      },
      {
        title: 'Advanced React Patterns',
        platform: 'Frontend Masters',
        instructor: 'Kent C. Dodds',
        duration: '6 hours',
        level: 'Advanced',
        proficiencyRange: [70, 100],
        rating: 4.8,
        students: '30k+',
        price: '$39/month',
        url: 'https://frontendmasters.com/courses/advanced-react-patterns/',
      },
    ],
    documentation: [
      {
        title: 'React Official Documentation',
        description: 'Official React docs with interactive examples',
        level: 'All Levels',
        url: 'https://react.dev/',
      },
      {
        title: 'React Patterns',
        description: 'Common React patterns and best practices',
        level: 'Intermediate',
        url: 'https://reactpatterns.com/',
      },
    ],
    projects: [
      {
        title: 'Todo App with Hooks',
        description: 'Build a todo app using React Hooks',
        difficulty: 'Beginner',
        proficiencyRange: [20, 45],
        estimatedTime: '1 week',
        skills: ['useState', 'useEffect', 'Components'],
      },
      {
        title: 'E-commerce Store',
        description: 'Full-featured shopping cart with React & Redux',
        difficulty: 'Intermediate',
        proficiencyRange: [50, 75],
        estimatedTime: '3 weeks',
        skills: ['Redux', 'Context API', 'Routing', 'API Integration'],
      },
      {
        title: 'Real-time Collaboration App',
        description: 'Build a real-time app with WebSockets',
        difficulty: 'Advanced',
        proficiencyRange: [75, 100],
        estimatedTime: '4 weeks',
        skills: ['WebSocket', 'Redux', 'Performance', 'TypeScript'],
      },
    ],
  },

  'Node.js': {
    courses: [
      {
        title: 'Node.js Crash Course',
        platform: 'YouTube',
        instructor: 'Traversy Media',
        duration: '1.5 hours',
        level: 'Beginner',
        proficiencyRange: [0, 30],
        rating: 4.8,
        students: '500k+',
        price: 'Free',
        url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
      },
      {
        title: 'The Complete Node.js Developer Course',
        platform: 'Udemy',
        instructor: 'Andrew Mead',
        duration: '35 hours',
        level: 'All Levels',
        proficiencyRange: [0, 80],
        rating: 4.7,
        students: '180k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/',
      },
      {
        title: 'Advanced Node.js',
        platform: 'Udemy',
        instructor: 'Stephen Grider',
        duration: '16 hours',
        level: 'Advanced',
        proficiencyRange: [65, 100],
        rating: 4.6,
        students: '45k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/advanced-node-for-developers/',
      },
    ],
    documentation: [
      {
        title: 'Node.js Official Docs',
        description: 'Complete Node.js API documentation',
        level: 'All Levels',
        url: 'https://nodejs.org/docs/latest/api/',
      },
      {
        title: 'Node.js Best Practices',
        description: 'Production-ready best practices guide',
        level: 'Intermediate',
        url: 'https://github.com/goldbergyoni/nodebestpractices',
      },
    ],
    projects: [
      {
        title: 'Simple REST API',
        description: 'Build a basic REST API with Express',
        difficulty: 'Beginner',
        proficiencyRange: [15, 40],
        estimatedTime: '1 week',
        skills: ['Express', 'Routing', 'Middleware'],
      },
      {
        title: 'Authentication System',
        description: 'Complete auth with JWT and refresh tokens',
        difficulty: 'Intermediate',
        proficiencyRange: [45, 70],
        estimatedTime: '2 weeks',
        skills: ['JWT', 'bcrypt', 'Security', 'Sessions'],
      },
      {
        title: 'Microservices Architecture',
        description: 'Build scalable microservices with Docker',
        difficulty: 'Advanced',
        proficiencyRange: [75, 100],
        estimatedTime: '4 weeks',
        skills: ['Microservices', 'Docker', 'RabbitMQ', 'Load Balancing'],
      },
    ],
  },

  // ============ DATABASES ============

  MongoDB: {
    courses: [
      {
        title: 'MongoDB Basics',
        platform: 'MongoDB University',
        instructor: 'MongoDB Team',
        duration: '8 hours',
        level: 'Beginner',
        proficiencyRange: [0, 35],
        rating: 4.7,
        students: '250k+',
        price: 'Free',
        url: 'https://university.mongodb.com/',
      },
      {
        title: 'MongoDB - The Complete Developer Guide',
        platform: 'Udemy',
        instructor: 'Maximilian Schwarzmüller',
        duration: '17 hours',
        level: 'All Levels',
        proficiencyRange: [0, 75],
        rating: 4.6,
        students: '75k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/mongodb-the-complete-developers-guide/',
      },
    ],
    documentation: [
      {
        title: 'MongoDB Manual',
        description: 'Official MongoDB documentation',
        level: 'All Levels',
        url: 'https://www.mongodb.com/docs/',
      },
    ],
    projects: [
      {
        title: 'Blog Database Design',
        description: 'Design and implement a blog database schema',
        difficulty: 'Beginner',
        proficiencyRange: [20, 45],
        estimatedTime: '1 week',
        skills: ['CRUD', 'Schema Design', 'Mongoose'],
      },
      {
        title: 'E-commerce Database with Aggregations',
        description: 'Complex queries and aggregation pipelines',
        difficulty: 'Intermediate',
        proficiencyRange: [50, 75],
        estimatedTime: '2 weeks',
        skills: ['Aggregations', 'Indexes', 'Transactions'],
      },
    ],
  },

  // ============ CLOUD & DEVOPS ============

  AWS: {
    courses: [
      {
        title: 'AWS Cloud Practitioner Essentials',
        platform: 'AWS Training',
        instructor: 'AWS',
        duration: '6 hours',
        level: 'Beginner',
        proficiencyRange: [0, 30],
        rating: 4.7,
        students: '500k+',
        price: 'Free',
        url: 'https://aws.amazon.com/training/digital/',
      },
      {
        title: 'AWS Certified Solutions Architect',
        platform: 'Udemy',
        instructor: 'Stephane Maarek',
        duration: '24 hours',
        level: 'Intermediate',
        proficiencyRange: [35, 75],
        rating: 4.7,
        students: '600k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/',
      },
    ],
    documentation: [
      {
        title: 'AWS Documentation',
        description: 'Complete AWS service documentation',
        level: 'All Levels',
        url: 'https://docs.aws.amazon.com/',
      },
    ],
    projects: [
      {
        title: 'Deploy Static Website on S3',
        description: 'Host a website using S3 and CloudFront',
        difficulty: 'Beginner',
        proficiencyRange: [10, 35],
        estimatedTime: '3 days',
        skills: ['S3', 'CloudFront', 'Route53'],
      },
      {
        title: 'Serverless API with Lambda',
        description: 'Build a REST API using Lambda and API Gateway',
        difficulty: 'Intermediate',
        proficiencyRange: [45, 70],
        estimatedTime: '2 weeks',
        skills: ['Lambda', 'API Gateway', 'DynamoDB', 'IAM'],
      },
    ],
  },

  Docker: {
    courses: [
      {
        title: 'Docker for Beginners',
        platform: 'freeCodeCamp',
        instructor: 'freeCodeCamp',
        duration: '2 hours',
        level: 'Beginner',
        proficiencyRange: [0, 30],
        rating: 4.8,
        students: '300k+',
        price: 'Free',
        url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
      },
      {
        title: 'Docker Mastery',
        platform: 'Udemy',
        instructor: 'Bret Fisher',
        duration: '19 hours',
        level: 'All Levels',
        proficiencyRange: [0, 85],
        rating: 4.7,
        students: '190k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/docker-mastery/',
      },
    ],
    documentation: [
      {
        title: 'Docker Official Documentation',
        description: 'Complete Docker documentation and guides',
        level: 'All Levels',
        url: 'https://docs.docker.com/',
      },
    ],
    projects: [
      {
        title: 'Containerize a Web App',
        description: 'Create Docker containers for a full-stack app',
        difficulty: 'Beginner',
        proficiencyRange: [20, 45],
        estimatedTime: '1 week',
        skills: ['Dockerfile', 'Images', 'Containers'],
      },
      {
        title: 'Multi-Container App with Docker Compose',
        description: 'Orchestrate multiple services',
        difficulty: 'Intermediate',
        proficiencyRange: [50, 75],
        estimatedTime: '2 weeks',
        skills: ['Docker Compose', 'Networking', 'Volumes'],
      },
    ],
  },

  // ============ AI & MACHINE LEARNING ============

  'Machine Learning': {
    courses: [
      {
        title: 'Machine Learning by Stanford',
        platform: 'Coursera',
        instructor: 'Andrew Ng',
        duration: '11 weeks',
        level: 'Beginner',
        proficiencyRange: [0, 45],
        rating: 4.9,
        students: '5M+',
        price: 'Free (audit)',
        url: 'https://www.coursera.org/learn/machine-learning',
      },
      {
        title: 'Machine Learning A-Z',
        platform: 'Udemy',
        instructor: 'Kirill Eremenko',
        duration: '44 hours',
        level: 'All Levels',
        proficiencyRange: [0, 75],
        rating: 4.5,
        students: '800k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/machinelearning/',
      },
    ],
    documentation: [
      {
        title: 'Scikit-learn Documentation',
        description: 'Complete machine learning library docs',
        level: 'Intermediate',
        url: 'https://scikit-learn.org/stable/',
      },
    ],
    projects: [
      {
        title: 'House Price Prediction',
        description: 'Build a regression model for price prediction',
        difficulty: 'Beginner',
        proficiencyRange: [25, 50],
        estimatedTime: '1 week',
        skills: ['Linear Regression', 'Data Preprocessing', 'Scikit-learn'],
      },
      {
        title: 'Image Classification with CNN',
        description: 'Build a convolutional neural network',
        difficulty: 'Advanced',
        proficiencyRange: [65, 95],
        estimatedTime: '3 weeks',
        skills: ['TensorFlow', 'CNN', 'Image Processing'],
      },
    ],
  },

  // ============ MOBILE DEVELOPMENT ============

  'React Native': {
    courses: [
      {
        title: 'React Native - The Practical Guide',
        platform: 'Udemy',
        instructor: 'Maximilian Schwarzmüller',
        duration: '31 hours',
        level: 'All Levels',
        proficiencyRange: [0, 80],
        rating: 4.6,
        students: '85k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/react-native-the-practical-guide/',
      },
    ],
    documentation: [
      {
        title: 'React Native Documentation',
        description: 'Official React Native documentation',
        level: 'All Levels',
        url: 'https://reactnative.dev/docs/getting-started',
      },
    ],
    projects: [
      {
        title: 'Todo Mobile App',
        description: 'Build a cross-platform todo app',
        difficulty: 'Beginner',
        proficiencyRange: [20, 45],
        estimatedTime: '2 weeks',
        skills: ['Components', 'Navigation', 'AsyncStorage'],
      },
      {
        title: 'Social Media App',
        description: 'Full-featured social media application',
        difficulty: 'Advanced',
        proficiencyRange: [70, 100],
        estimatedTime: '6 weeks',
        skills: ['API Integration', 'Camera', 'Push Notifications', 'Real-time'],
      },
    ],
  },

  Flutter: {
    courses: [
      {
        title: 'Flutter & Dart - The Complete Guide',
        platform: 'Udemy',
        instructor: 'Maximilian Schwarzmüller',
        duration: '40 hours',
        level: 'All Levels',
        proficiencyRange: [0, 80],
        rating: 4.6,
        students: '150k+',
        price: '$84.99',
        url: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/',
      },
    ],
    documentation: [
      {
        title: 'Flutter Official Documentation',
        description: 'Complete Flutter documentation and cookbook',
        level: 'All Levels',
        url: 'https://flutter.dev/docs',
      },
    ],
    projects: [
      {
        title: 'Expense Tracker App',
        description: 'Build a personal finance tracker',
        difficulty: 'Beginner',
        proficiencyRange: [20, 45],
        estimatedTime: '2 weeks',
        skills: ['Widgets', 'State Management', 'SQLite'],
      },
      {
        title: 'E-commerce Mobile App',
        description: 'Full-featured shopping app with cart and payments',
        difficulty: 'Intermediate',
        proficiencyRange: [55, 80],
        estimatedTime: '4 weeks',
        skills: ['Provider', 'Firebase', 'Payment Gateway', 'Animations'],
      },
    ],
  },
};

// Helper function to get resources filtered by user's proficiency level
export const getResourcesByProficiency = (skillName, proficiency) => {
  const resources = LEARNING_RESOURCES[skillName];
  
  if (!resources) {
    return null;
  }

  const filteredCourses = resources.courses.filter(course => {
    if (!course.proficiencyRange) return true;
    const [min, max] = course.proficiencyRange;
    return proficiency >= min && proficiency <= max;
  });

  const filteredProjects = resources.projects.filter(project => {
    if (!project.proficiencyRange) return true;
    const [min, max] = project.proficiencyRange;
    return proficiency >= min && proficiency <= max;
  });

  return {
    courses: filteredCourses.length > 0 ? filteredCourses : resources.courses,
    documentation: resources.documentation || [],
    projects: filteredProjects.length > 0 ? filteredProjects : resources.projects,
  };
};

// Get recommended level based on proficiency
export const getRecommendedLevel = (proficiency) => {
  if (proficiency < 30) return 'Beginner';
  if (proficiency < 70) return 'Intermediate';
  return 'Advanced';
};

export default LEARNING_RESOURCES;
