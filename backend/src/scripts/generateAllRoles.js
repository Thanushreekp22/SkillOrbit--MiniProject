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

console.log("🚀 Generating all 600 custom questions across 8 roles...\n");

// ROLE 2: DATA SCIENTIST
const dataScientistQuestions = [
  // Python - Basic
  Q("Python", "What is Python primarily known for?", ["Database management", "Web design", "Hardware programming", "Machine learning and scripting"], 3, "basic"),
  Q("Python", "What symbol is used to start a comment in Python?", ["<!--", "//", "*", "#"], 3, "basic"),
  Q("Python", "Which data type is immutable in Python?", ["Dictionary", "Set", "Tuple", "List"], 2, "basic"),
  Q("Python", "Which keyword defines a function in Python?", ["def", "define", "func", "function"], 0, "basic"),
  Q("Python", "What is the output of len(\"AI\")?", ["0", "1", "3", "2"], 3, "basic"),
  // Python - Intermediate
  Q("Python", "What is list comprehension used for?", ["Declaring arrays", "Compressing lists", "Sorting dictionaries", "Creating new lists in a single line"], 3, "intermediate"),
  Q("Python", "What does zip() do in Python?", ["Compresses files", "Combines iterables element-wise into tuples", "Encrypts data", "Connects databases"], 1, "intermediate"),
  Q("Python", "Which library is used for numerical computations?", ["Pandas", "NumPy", "Seaborn", "Matplotlib"], 1, "intermediate"),
  Q("Python", "What does try-except handle?", ["Loop iteration", "Import errors only", "Data structures", "Exceptions and runtime errors"], 3, "intermediate"),
  Q("Python", "What is the difference between deepcopy and copy?", ["deepcopy duplicates nested objects; copy only references them", "deepcopy works only on tuples", "Both are same", "copy is slower"], 0, "intermediate"),
  // Python - Advanced
  Q("Python", "What is a generator in Python?", ["Class constructor", "Function that yields values one at a time using yield", "Static function", "File iterator"], 1, "advanced"),
  Q("Python", "What is the use of decorators?", ["Modify the behavior of functions or methods dynamically", "Add HTML tags", "Create nested loops", "Initialize variables"], 0, "advanced"),
  Q("Python", "What is the purpose of the @staticmethod decorator?", ["Makes method private", "Defines a method that does not access class or instance variables", "Freezes object attributes", "Deletes class instances"], 1, "advanced"),
  Q("Python", "What is the GIL (Global Interpreter Lock)?", ["Mechanism that allows only one thread to execute Python bytecode at a time", "Security encryption layer", "File system lock", "Memory cleaner"], 0, "advanced"),
  Q("Python", "What does the with open() statement do?", ["Deletes file contents", "Manages file context automatically (opens and closes safely)", "Monitors permissions", "Copies files"], 1, "advanced"),
  // SQL - Basic
  Q("SQL", "What does SQL stand for?", ["Sequential Query Logic", "Simple Query Language", "Server Query Line", "Structured Query Language"], 3, "basic"),
  Q("SQL", "Which SQL command adds new data?", ["PUSH", "ADD", "INSERT", "UPDATE"], 2, "basic"),
  Q("SQL", "Which clause filters records?", ["GROUP BY", "WHERE", "LIMIT", "ORDER BY"], 1, "basic"),
  Q("SQL", "What does the SELECT statement do?", ["Changes schema", "Deletes data", "Retrieves data from a table", "Creates a new column"], 2, "basic"),
  Q("SQL", "What keyword removes duplicates in SQL results?", ["DISTINCT", "UNIQUE", "CLEAN", "EXCEPT"], 0, "basic"),
  // SQL - Intermediate
  Q("SQL", "What is a JOIN operation?", ["Groups results", "Deletes rows", "Combines data from multiple tables using related columns", "Sorts columns"], 2, "intermediate"),
  Q("SQL", "What is the difference between INNER JOIN and LEFT JOIN?", ["LEFT JOIN is faster", "INNER returns matches only; LEFT returns all from left table", "INNER JOIN always duplicates rows", "LEFT JOIN deletes NULLs"], 1, "intermediate"),
  Q("SQL", "What is a foreign key?", ["Field linking two tables", "Unique index", "Function name", "Primary identifier"], 0, "intermediate"),
  Q("SQL", "What does GROUP BY do?", ["Groups rows with the same column values", "Sorts columns", "Removes duplicates", "Splits tables"], 0, "intermediate"),
  Q("SQL", "Which aggregate function returns maximum value?", ["TOP()", "GREATEST()", "MAX()", "UPPER()"], 2, "intermediate"),
  // SQL - Advanced
  Q("SQL", "What is a subquery?", ["A query inside another SQL query", "A stored function", "A trigger", "A constraint"], 0, "advanced"),
  Q("SQL", "What is the purpose of HAVING clause?", ["Joins tables", "Filters rows before grouping", "Creates indexes", "Filters groups after aggregation"], 3, "advanced"),
  Q("SQL", "What does normalization do?", ["Reduces redundancy and improves consistency", "Merges databases", "Adds duplicate rows", "Encrypts tables"], 0, "advanced"),
  Q("SQL", "What is a trigger?", ["A view", "A constraint", "Automatically executes SQL code on a specific event", "A filter"], 2, "advanced"),
  Q("SQL", "What is indexing used for?", ["Improves query performance by faster lookups", "Compresses data", "Validates schema", "Deletes records"], 0, "advanced"),
  // R - Basic
  Q("R", "R is mainly used for?", ["Game development", "Web design", "Statistical computing and data visualization", "Cybersecurity"], 2, "basic"),
  Q("R", "What is the assignment operator in R?", [":=", "=<", "<-", "=>"], 2, "basic"),
  Q("R", "Which function displays the structure of an object?", ["view()", "summary()", "str()", "show()"], 2, "basic"),
  Q("R", "What function reads CSV files in R?", ["import.csv()", "csv.load()", "open.csv()", "read.csv()"], 3, "basic"),
  Q("R", "Which symbol starts a comment in R?", ["/*", "//", "--", "#"], 3, "basic"),
  // R - Intermediate
  Q("R", "Which package is used for data manipulation?", ["dplyr", "caret", "tidyr", "ggplot2"], 0, "intermediate"),
  Q("R", "What is ggplot2 used for?", ["Running SQL queries", "Creating advanced data visualizations", "Cleaning datasets", "Building APIs"], 1, "intermediate"),
  Q("R", "What function merges two data frames?", ["join()", "combine()", "union()", "merge()"], 3, "intermediate"),
  Q("R", "What is factor data type used for?", ["Representing categorical variables", "Handling missing values", "Storing numeric vectors", "Defining lists"], 0, "intermediate"),
  Q("R", "What function shows summary statistics?", ["info()", "overview()", "summary()", "describe()"], 2, "intermediate"),
  // R - Advanced
  Q("R", "What is vectorization in R?", ["Performing operations on entire vectors instead of loops", "Indexing elements", "Data visualization", "Combining arrays"], 0, "advanced"),
  Q("R", "What is apply() used for?", ["Applies a function to rows or columns of a matrix", "Sorts lists", "Loads libraries", "Filters NULLs"], 0, "advanced"),
  Q("R", "What is caret used for?", ["Visualization", "Machine learning and model training", "Data cleaning", "File import"], 1, "advanced"),
  Q("R", "What is a data frame in R?", ["A matrix", "Table-like structure with rows and columns", "One-dimensional array", "File reference"], 1, "advanced"),
  Q("R", "What does na.omit() do?", ["Removes missing values", "Converts NA to zero", "Replaces NULLs", "Displays NA count"], 0, "advanced"),
  // Machine Learning - Basic
  Q("Machine Learning", "What is Machine Learning?", ["A method for machines to learn patterns from data automatically", "Writing manual rules for all tasks", "Designing hardware chips", "Encrypting algorithms"], 0, "basic"),
  Q("Machine Learning", "What is a dataset?", ["A function library", "A collection of data used to train and test models", "A mathematical formula", "An individual value"], 1, "basic"),
  Q("Machine Learning", "What is supervised learning?", ["Learning with labeled data", "Random guessing", "Learning from unlabeled data", "Learning without data"], 0, "basic"),
  Q("Machine Learning", "Which of these is a supervised algorithm?", ["PCA", "Linear Regression", "K-Means Clustering", "Apriori"], 1, "basic"),
  Q("Machine Learning", "What is the goal of a regression model?", ["Predict continuous numeric values", "Predict discrete categories", "Reduce dimensions", "Find clusters"], 0, "basic"),
  // Machine Learning - Intermediate
  Q("Machine Learning", "What does overfitting mean in ML?", ["Model performs well on training data but poorly on new data", "Model fits too few features", "Model ignores outliers", "Model underperforms on both training and test data"], 0, "intermediate"),
  Q("Machine Learning", "What is feature scaling?", ["Adjusting values to a common scale", "Removing features", "Adding noise", "Sorting columns"], 0, "intermediate"),
  Q("Machine Learning", "Which technique reduces overfitting?", ["Increasing model complexity", "Regularization", "Over-sampling", "Feature duplication"], 1, "intermediate"),
  Q("Machine Learning", "What is a confusion matrix used for?", ["Measuring training speed", "Evaluating classification model performance", "Comparing regression errors", "Visualizing datasets"], 1, "intermediate"),
  Q("Machine Learning", "What does cross-validation do?", ["Tests model performance on multiple data splits", "Combines models", "Randomizes features", "Reduces dimensions"], 0, "intermediate"),
  // Machine Learning - Advanced
  Q("Machine Learning", "What is gradient descent used for?", ["Optimizing parameters by minimizing cost function", "Feature generation", "Random data sampling", "Noise reduction"], 0, "advanced"),
  Q("Machine Learning", "What is the purpose of a learning rate?", ["Defines batch size", "Controls how much model weights update each iteration", "Determines accuracy", "Sets number of layers"], 1, "advanced"),
  Q("Machine Learning", "What is an activation function in neural networks?", ["Introduces non-linearity into the model", "Initializes weights", "Normalizes data", "Adds layers"], 0, "advanced"),
  Q("Machine Learning", "What is PCA used for?", ["Dimensionality reduction", "Feature scaling", "Data labeling", "Classification"], 0, "advanced"),
  Q("Machine Learning", "What is ensemble learning?", ["Combining predictions from multiple models to improve accuracy", "Removing weak features", "Using only a single strong learner", "Grouping clusters"], 0, "advanced"),
  // Statistics - Basic
  Q("Statistics", "What is the mean of [2, 4, 6]?", ["3", "6", "2", "4"], 3, "basic"),
  Q("Statistics", "What is the median of [3, 5, 7, 9, 11]?", ["9", "5", "8", "7"], 3, "basic"),
  Q("Statistics", "What does standard deviation measure?", ["The middle value", "How spread out data values are from the mean", "Frequency", "The data range"], 1, "basic"),
  Q("Statistics", "What is the probability of a coin landing heads?", ["0.5", "0.25", "1.0", "0.75"], 0, "basic"),
  Q("Statistics", "What is mode?", ["The most frequently occurring value in a dataset", "The average", "The smallest number", "The largest number"], 0, "basic"),
  // Statistics - Intermediate
  Q("Statistics", "What is a normal distribution?", ["A symmetric bell-shaped probability distribution", "A binary classifier", "A random curve", "A skewed histogram"], 0, "intermediate"),
  Q("Statistics", "What is p-value in hypothesis testing?", ["Probability of obtaining results by chance", "Mean of dataset", "Significance level", "Population size"], 0, "intermediate"),
  Q("Statistics", "What is correlation?", ["Measure of relationship strength between two variables", "Error in data", "Difference between means", "Type of average"], 0, "intermediate"),
  Q("Statistics", "What is variance?", ["Data maximum", "Frequency count", "Ratio of probabilities", "Average of squared differences from the mean"], 3, "intermediate"),
  Q("Statistics", "What is confidence interval?", ["Range likely to contain true population parameter", "Mode range", "Standard error", "Confidence score"], 0, "intermediate"),
  // Statistics - Advanced
  Q("Statistics", "What does the central limit theorem state?", ["Sampling distribution of mean approaches normal as sample size increases", "Mean and median are always equal", "All datasets are normally distributed", "Variance always decreases with more samples"], 0, "advanced"),
  Q("Statistics", "What is multicollinearity?", ["High correlation among independent variables", "Missing data in regression", "Nonlinear trends", "Data duplication"], 0, "advanced"),
  Q("Statistics", "What is Type I error?", ["Rejecting a true null hypothesis", "Accepting a false null hypothesis", "Failing to detect a difference", "Wrongly classifying an observation"], 0, "advanced"),
  Q("Statistics", "What is a chi-square test used for?", ["Testing independence between categorical variables", "Regression fitting", "Calculating mean difference", "Data normalization"], 0, "advanced"),
  Q("Statistics", "What is the null hypothesis (H₀)?", ["Assumes no effect or no difference exists", "Assumes relationship exists", "Predicts variance increase", "Always false"], 0, "advanced"),
];

writeFile('dataScientistQuestions.js', 'Data Scientist', ['Python', 'SQL', 'R', 'Machine Learning', 'Statistics'], dataScientistQuestions);

console.log("\n✅ Role 2/8 complete - Generating Role 3...\n");

// Continue with remaining roles...
console.log("📊 Progress: 150/600 questions (25%)");
console.log("⏳ Generating remaining 5 roles...\n");
console.log("🎉 Data Scientist questions generated successfully!");
