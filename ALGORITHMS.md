# SkillOrbit - Algorithms Documentation

## Table of Contents
1. [Overview](#overview)
2. [Score Calculation Algorithm](#1-score-calculation-algorithm)
3. [MongoDB Aggregation Pipeline Algorithm](#2-mongodb-aggregation-pipeline-algorithm)
4. [AI Prompt Construction Algorithm](#3-ai-prompt-construction-algorithm)
5. [Regex-Based Response Parsing Algorithm](#4-regex-based-response-parsing-algorithm)
6. [URL Resource Extraction Algorithm](#5-url-resource-extraction-algorithm)
7. [JWT Token Verification Algorithm](#6-jwt-token-verification-algorithm)
8. [Average & Statistical Aggregation Algorithm](#7-average--statistical-aggregation-algorithm)
9. [PDF Page Buffering Algorithm](#8-pdf-page-buffering-algorithm)
10. [Pagination Algorithm](#9-pagination-algorithm)
11. [Similarity Metrics Analysis](#similarity-metrics-analysis)

---

## Overview

This document provides detailed explanations of all algorithms implemented in the SkillOrbit project. The project uses **traditional algorithms** (string matching, database queries, cryptography) rather than ML-based similarity metrics (Word2Vec, cosine similarity, embeddings).

### Technologies Used
- **Backend:** Node.js, Express.js, MongoDB
- **AI Service:** LLaMA 3.3-70B (Groq Cloud API)
- **Authentication:** JWT (HMAC-SHA256)
- **PDF Generation:** PDFKit
- **Email:** Nodemailer with Gmail SMTP

### Key Finding
❌ **No ML Similarity Metrics Used:** The project does NOT implement Word2Vec, cosine similarity, or vector embeddings.  
✅ **Algorithm Types:** String matching, database aggregation, cryptographic verification, statistical calculations.

---

## 1. Score Calculation Algorithm ⭐⭐⭐⭐⭐

**Location:** `backend/src/controllers/assessmentController.js:67-117`

**Purpose:** Calculate assessment scores with normalized answer comparison

### Algorithm Steps

```javascript
// STEP 1: Answer Normalization (Text Preprocessing)
const userAnswerNormalized = userAnswer.userAnswer.toLowerCase().trim();
const correctAnswerNormalized = q.correctAnswer.toLowerCase().trim();

// STEP 2: Exact String Matching (O(n) time complexity)
const isCorrect = userAnswerNormalized === correctAnswerNormalized;

// STEP 3: Counter Accumulation
if (isCorrect) correctAnswers++;

// STEP 4: Percentage Calculation Formula
score = Math.round((correctAnswers / totalQuestions) * 100)

// STEP 5: Rule-Based Feedback Classification
if (score >= 90) feedback = 'Excellent! Mastered';        // Tier 1: Expert
else if (score >= 75) feedback = 'Good job! Strong';     // Tier 2: Advanced
else if (score >= 60) feedback = 'Fair performance';     // Tier 3: Intermediate
else feedback = 'Needs improvement';                      // Tier 4: Beginner
```

### Mathematical Formula

```
Score = ⌊(CorrectAnswers / TotalQuestions) × 100⌉

Where:
- ⌊⌉ = Math.round() function
- CorrectAnswers ∈ [0, TotalQuestions]
- Score ∈ [0, 100]
```

### Complexity Analysis

- **Time Complexity:** O(n) where n = number of questions
- **Space Complexity:** O(n) for storing question-answer pairs

### Example

```javascript
Input:
  totalQuestions = 10
  correctAnswers = 8
  
Process:
  score = Math.round((8 / 10) * 100) = Math.round(80) = 80
  
Output:
  score = 80
  feedback = "Good job! You have a strong understanding."
```

### Feedback Classification Tiers

| Score Range | Feedback | Skill Level |
|-------------|----------|-------------|
| 90-100 | Excellent! You have mastered this skill. | Expert |
| 75-89 | Good job! You have a strong understanding. | Advanced |
| 60-74 | Fair performance. Consider reviewing key concepts. | Intermediate |
| 0-59 | Needs improvement. Focus on fundamental concepts. | Beginner |

---

## 2. MongoDB Aggregation Pipeline Algorithm ⭐⭐⭐⭐⭐

**Location:** `backend/src/controllers/assessmentController.js:189-203`

**Purpose:** Group assessments by skill and calculate statistics

### Algorithm Stages

```javascript
// STAGE 1: $match - Filter documents (WHERE clause equivalent)
{ 
  $match: { 
    userId: new mongoose.Types.ObjectId(userId) 
  } 
}
// Filters only assessments for specific user
// Time: O(log n) with userId index

// STAGE 2: $group - Aggregate operations (GROUP BY equivalent)
{
  $group: {
    _id: "$skillName",                          // Group key
    totalAssessments: { $sum: 1 },              // COUNT(*)
    averageScore: { $avg: "$score" },           // AVG(score)
    bestScore: { $max: "$score" },              // MAX(score)
    lastAssessment: { $max: "$createdAt" },     // MAX(date)
    difficulties: { $addToSet: "$difficulty" }   // DISTINCT difficulties
  }
}
// Time: O(n) to scan all matched documents

// STAGE 3: $sort - Order results (ORDER BY equivalent)
{ 
  $sort: { averageScore: -1 }  // Descending order
}
// Time: O(k log k) where k = unique skills
```

### Mathematical Formulas

```
Average Score = Σ(scores) / n

Where:
- Σ = summation operator
- n = totalAssessments per skill
- scores = array of individual assessment scores

Best Score = max(score₁, score₂, ..., scoreₙ)
```

### Pipeline Flow Diagram

```
[All Assessments] 
    ↓ $match (filter by userId)
[User Assessments]
    ↓ $group (by skillName)
[
  {skill: "Python", avgScore: 85, bestScore: 90, totalAssessments: 5},
  {skill: "React", avgScore: 78, bestScore: 88, totalAssessments: 3}
]
    ↓ $sort (by avgScore DESC)
[Sorted Statistics]
```

### Complexity Analysis

- **Time Complexity:** O(n log k) where n = total assessments, k = unique skills
- **Space Complexity:** O(k) for storing grouped results

### Example Output

```javascript
[
  {
    _id: "Python",
    totalAssessments: 5,
    averageScore: 85,
    bestScore: 90,
    lastAssessment: ISODate("2025-11-21"),
    difficulties: ["basic", "intermediate", "advanced"]
  },
  {
    _id: "React",
    totalAssessments: 3,
    averageScore: 78,
    bestScore: 88,
    lastAssessment: ISODate("2025-11-20"),
    difficulties: ["basic", "intermediate"]
  }
]
```

---

## 3. AI Prompt Construction Algorithm ⭐⭐⭐⭐

**Location:** `backend/src/services/grokAI.js:78-130`

**Purpose:** Build context-rich prompts for LLaMA 3.3-70B

### Algorithm Structure

```javascript
function buildPrompt(skills, assessmentScores, selectedSkills, targetRole, currentLevel) {
  let prompt = "";
  
  // SECTION 1: Current Skills Matrix
  // Time: O(n) where n = number of skills
  skills.forEach(skill => {
    prompt += `- ${skill.name} (${skill.category}): ` +
              `Proficiency ${skill.proficiency}%, ` +
              `Assessment Score: ${assessmentScores[skill.name] || 'Not assessed'}\n`;
  });
  
  // SECTION 2: Focus Skills List (O(m))
  selectedSkills.forEach(skill => {
    prompt += `- ${skill}\n`;
  });
  
  // SECTION 3: Target Role & Level (O(1))
  prompt += `**Target Role:** ${targetRole}\n`;
  prompt += `**Current Experience Level:** ${currentLevel}\n`;
  
  // SECTION 4: Structured Output Requirements (7-point format)
  prompt += `Please provide:\n`;
  prompt += `1. Gap Analysis\n`;
  prompt += `2. Learning Path (Beginner → Intermediate → Advanced)\n`;
  prompt += `3. Recommended Resources\n`;
  prompt += `4. Timeline\n`;
  prompt += `5. Projects\n`;
  prompt += `6. Milestones\n`;
  prompt += `7. Priority Order\n`;
  
  return prompt;
}
```

### Prompt Engineering Principles

1. **Context Loading:** Provide current state (skills + scores)
2. **Goal Specification:** Define target role and level
3. **Output Formatting:** Request structured response
4. **Constraint Setting:** Define expected sections

### Example Output Prompt

```
I need a personalized learning path recommendation.

**Current Skills:**
- Python (Programming): Proficiency 85%, Assessment Score: 90
- React (Frontend): Proficiency 70%, Assessment Score: 75

**Skills I Want to Focus On:**
- Node.js
- MongoDB

**Target Role:** Full Stack Developer

**Current Experience Level:** Intermediate

Please provide:
1. **Gap Analysis**: What skills am I missing or need to improve for my target role?
2. **Learning Path**: A structured roadmap with phases (Beginner → Intermediate → Advanced)
3. **Recommended Resources**: Specific courses, books, or platforms for each skill
4. **Timeline**: Estimated time to achieve proficiency in each phase
5. **Projects**: Hands-on project ideas to practice each skill
6. **Milestones**: Clear checkpoints to track progress
7. **Priority Order**: Which skills to learn first and why

Format the response in a clear, structured manner with sections and bullet points.
```

### Complexity Analysis

- **Time Complexity:** O(n + m) where n = skills, m = selectedSkills
- **Space Complexity:** O(n + m) for string concatenation

---

## 4. Regex-Based Response Parsing Algorithm ⭐⭐⭐⭐

**Location:** `backend/src/services/grokAI.js:142-159`

**Purpose:** Extract structured sections from AI text response

### Algorithm

```javascript
// Pattern Array: Predefined section headers
const sectionPatterns = [
  'Gap Analysis',
  'Learning Path',
  'Recommended Resources',
  'Timeline',
  'Projects',
  'Milestones',
  'Priority Order'
];

// For each pattern, construct dynamic regex
sectionPatterns.forEach(pattern => {
  // Regex Breakdown:
  // (?:^|\\n)              - Start of line or newline
  // (?:\\*\\*)?            - Optional bold markers
  // ${pattern}             - Section name (e.g., "Gap Analysis")
  // (?:\\*\\*)?:?          - Optional bold markers and colon
  // \\s*                   - Optional whitespace
  // ([\\s\\S]*?)           - CAPTURE: Any content (lazy match)
  // (?=\\n...:|$)          - LOOKAHEAD: Until next section or end
  
  const regex = new RegExp(
    `(?:^|\\n)(?:\\*\\*)?${pattern}(?:\\*\\*)?:?\\s*` +
    `([\\s\\S]*?)` +
    `(?=\\n(?:\\*\\*)?(?:${sectionPatterns.join('|')})(?:\\*\\*)?:|$)`,
    'i'  // Case-insensitive flag
  );
  
  const match = response.match(regex);
  if (match) {
    sections[pattern.toLowerCase().replace(/\s+/g, '_')] = match[1].trim();
  }
});
```

### Regex Components Explained

| Component | Purpose | Example |
|-----------|---------|---------|
| `(?:^|\\n)` | Non-capturing group: line start or newline | Matches at beginning or after `\n` |
| `(?:\\*\\*)?` | Optional bold markers | Matches `**` or nothing |
| `${pattern}` | Dynamic section name | "Gap Analysis", "Timeline" |
| `([\\s\\S]*?)` | Capture any content (lazy) | Captures section content |
| `(?=...)` | Positive lookahead | Stops at next section |
| `i` | Case-insensitive flag | Matches "gap analysis" or "Gap Analysis" |

### Regex Matching Example

**Input Text:**
```
**Gap Analysis:** You need to improve backend skills.

**Learning Path:** Start with Node.js basics...

**Timeline:** 6 months to proficiency
```

**Extracted Sections:**
```javascript
{
  gap_analysis: "You need to improve backend skills.",
  learning_path: "Start with Node.js basics...",
  timeline: "6 months to proficiency"
}
```

### Complexity Analysis

- **Time Complexity:** O(n × m) where n = response length, m = number of patterns
- **Space Complexity:** O(k) where k = number of extracted sections

---

## 5. URL Resource Extraction Algorithm ⭐⭐⭐

**Location:** `backend/src/services/grokAI.js:166-196`

**Purpose:** Extract and classify URLs from AI response

### Algorithm

```javascript
// STEP 1: URL Pattern Matching (Regex)
const urlRegex = /(https?:\/\/[^\s\)]+)/g;
const urls = response.match(urlRegex) || [];

// STEP 2: Type Classification (Domain-Based)
urls.forEach(url => {
  let type = 'article';  // Default type
  let title = url;
  
  // Classification Rules (IF-ELSE Chain)
  if (url.includes('udemy.com')) {
    type = 'course';
    title = 'Udemy Course';
  } else if (url.includes('coursera.org')) {
    type = 'course';
    title = 'Coursera Course';
  } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    type = 'video';
    title = 'YouTube Video';
  } else if (url.includes('docs.') || url.includes('developer.mozilla.org')) {
    type = 'documentation';
    title = 'Documentation';
  } else if (url.includes('github.com')) {
    type = 'tutorial';
    title = 'GitHub Repository';
  }
  
  // STEP 3: Resource Object Creation
  resources.push({ title, url, type });
});
```

### Classification Logic Tree

```
URL Input
  │
  ├─ Contains "udemy.com"? → type = 'course'
  ├─ Contains "coursera.org"? → type = 'course'
  ├─ Contains "youtube.com"? → type = 'video'
  ├─ Contains "docs." or "developer.mozilla.org"? → type = 'documentation'
  ├─ Contains "github.com"? → type = 'tutorial'
  └─ Else → type = 'article' (default)
```

### Example

**Input AI Response:**
```
Learn Node.js from https://www.udemy.com/nodejs-course
Watch this tutorial: https://www.youtube.com/watch?v=abc123
Check documentation: https://nodejs.org/docs/
```

**Extracted Resources:**
```javascript
[
  {
    title: "Udemy Course",
    url: "https://www.udemy.com/nodejs-course",
    type: "course"
  },
  {
    title: "YouTube Video",
    url: "https://www.youtube.com/watch?v=abc123",
    type: "video"
  },
  {
    title: "Documentation",
    url: "https://nodejs.org/docs/",
    type: "documentation"
  }
]
```

### Complexity Analysis

- **Time Complexity:** O(n × m) where n = number of URLs, m = classification rules
- **Space Complexity:** O(n) for resource array

---

## 6. JWT Token Verification Algorithm ⭐⭐⭐⭐⭐

**Location:** `backend/src/middleware/authMiddleware.js:5-17`

**Purpose:** Verify JWT tokens for authenticated requests

### Algorithm

```javascript
// STEP 1: Extract Authorization Header
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(403).json({ message: "No token provided" });

// STEP 2: Parse Bearer Token
// Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const token = authHeader.split(" ")[1];  // Get second element after space

// STEP 3: JWT Verification (HMAC-SHA256)
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Verification Steps:
  // 1. Decode header and payload (Base64 decode)
  // 2. Recreate signature: HMACSHA256(header + "." + payload, secret)
  // 3. Compare signatures (timing-safe comparison)
  // 4. Check expiration: current_time < exp
  
  // STEP 4: Attach User to Request Object
  req.user = decoded;  // { id, email, name, iat, exp }
  next();  // Proceed to next middleware/controller
  
} catch (err) {
  // Invalid signature or expired token
  res.status(401).json({ message: "Invalid or expired token" });
}
```

### JWT Structure

```
Header.Payload.Signature

Header (Base64):
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (Base64):
{
  "id": "user123",
  "email": "user@example.com",
  "iat": 1700000000,  // Issued at
  "exp": 1700086400   // Expires at (24 hours)
}

Signature (HMAC-SHA256):
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

### Verification Process Flowchart

```
[Incoming Request]
    ↓
[Extract Authorization Header]
    ↓
[Parse Bearer Token]
    ↓
[Decode Header & Payload] ← Base64 Decode
    ↓
[Recreate Signature] ← HMACSHA256(header + payload, secret)
    ↓
[Compare Signatures] ← Timing-safe comparison
    ↓
    ├─ Mismatch → [401 Invalid Token]
    └─ Match
        ↓
    [Check Expiration] ← current_time < exp?
        ↓
        ├─ Expired → [401 Expired Token]
        └─ Valid
            ↓
        [Attach User to Request]
            ↓
        [Proceed to Controller]
```

### Security Properties

| Property | Implementation | Benefit |
|----------|---------------|---------|
| **Integrity** | HMAC-SHA256 signature | Prevents tampering with token data |
| **Authenticity** | Secret key verification | Proves token issued by server |
| **Expiration** | `exp` claim validation | Automatic token invalidation |
| **Stateless** | No server-side session | Scalable across multiple servers |
| **Timing-Safe** | Constant-time comparison | Prevents timing attacks |

### Complexity Analysis

- **Time Complexity:** O(1) for verification
- **Space Complexity:** O(1)

---

## 7. Average & Statistical Aggregation Algorithm ⭐⭐⭐⭐

**Location:** `backend/src/controllers/reportController.js:14-46`

**Purpose:** Calculate user performance statistics

### A. Average Proficiency (Mean Calculation)

```javascript
// Mathematical Formula: x̄ = (Σxᵢ) / n

const avgProficiency = skills.length > 0
  ? Math.round(
      skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length
    )
  : 0;

// Implementation Details:
// 1. reduce() accumulates sum: O(n) time
// 2. Division by count: O(1)
// 3. Math.round() for integer result: O(1)
```

**Mathematical Formula:**
```
                n
               ___
              \
x̄ = (1/n) ×   /    xᵢ
              ‾‾‾
              i=1

Where:
- x̄ = average proficiency
- n = number of skills
- xᵢ = proficiency of skill i
```

**Example:**
```javascript
skills = [
  { name: "Python", proficiency: 85 },
  { name: "React", proficiency: 75 },
  { name: "Node.js", proficiency: 90 }
]

Step 1: Sum = 85 + 75 + 90 = 250
Step 2: Count = 3
Step 3: Average = 250 / 3 = 83.333...
Step 4: Rounded = Math.round(83.333) = 83

Output: avgProficiency = 83
```

### B. Category Frequency Counter (Hash Table)

```javascript
// Algorithm: Hash-based counting

const categories = {};  // Hash table initialization

skills.forEach(skill => {
  const cat = skill.category || 'Other';  // Get category key
  
  // Hash table lookup and increment
  categories[cat] = (categories[cat] || 0) + 1;
  
  // Pseudocode equivalent:
  // if (categories.hasKey(cat)):
  //     categories[cat]++
  // else:
  //     categories[cat] = 1
});

// Result: { "Programming": 5, "Frontend": 3, "Database": 2 }
```

**Hash Table Operations:**
- **Lookup:** O(1) average case
- **Insert:** O(1) average case
- **Total:** O(n) for n skills

**Example:**
```javascript
Input:
skills = [
  { name: "Python", category: "Programming" },
  { name: "React", category: "Frontend" },
  { name: "Node.js", category: "Programming" },
  { name: "MongoDB", category: "Database" }
]

Process:
Iteration 1: categories = { "Programming": 1 }
Iteration 2: categories = { "Programming": 1, "Frontend": 1 }
Iteration 3: categories = { "Programming": 2, "Frontend": 1 }
Iteration 4: categories = { "Programming": 2, "Frontend": 1, "Database": 1 }

Output: categories = {
  "Programming": 2,
  "Frontend": 1,
  "Database": 1
}
```

### C. Skill-Specific Average Score

```javascript
// Filter + Reduce + Conditional Average

const skillAssessments = assessments.filter(a => 
  a.skillName && skill.name && 
  a.skillName.toLowerCase() === skill.name.toLowerCase()
);

const avgSkillScore = skillAssessments.length > 0
  ? Math.round(
      skillAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / 
      skillAssessments.length
    )
  : skill.proficiency;  // Fallback to proficiency if no assessments
```

**Algorithm Flow:**
```
[All Assessments]
    ↓ filter (case-insensitive match)
[Skill-Specific Assessments]
    ↓ reduce (sum scores)
[Total Score]
    ↓ divide by count
[Average Score]
    ↓ Math.round()
[Final Integer Score]
```

### Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Average Proficiency | O(n) | O(1) |
| Category Counter | O(n) | O(k) where k = unique categories |
| Skill-Specific Average | O(m) per skill | O(k) where k = filtered assessments |
| All Skills Average | O(n × m) | O(n) |

**Where:**
- n = number of skills
- m = number of assessments
- k = result size

---

## 8. PDF Page Buffering Algorithm ⭐⭐⭐⭐⭐

**Location:** `backend/src/controllers/reportController.js:300-600`

**Purpose:** Generate multi-page PDF with consistent footers

### Algorithm

```javascript
// STEP 1: Initialize PDF with Buffering
const doc = new PDFDocument({ 
  margin: 40, 
  size: 'A4', 
  bufferPages: true  // Enable buffering (stores page range)
});

// STEP 2: Content Generation (Multiple Pages)
doc.addPage();  // Page 1
doc.text("Content 1");

doc.addPage();  // Page 2
doc.text("Content 2");

doc.addPage();  // Page 3
doc.text("Content 3");

// STEP 3: Get Buffered Page Range
const range = doc.bufferedPageRange();
// Returns: { start: 0, count: 3 }

// STEP 4: Iterate Over Pages for Footer
for (let i = 0; i < range.count; i++) {
  // CRITICAL: Use range.start offset
  doc.switchToPage(range.start + i);  // Absolute page index
  
  // Add footer to current page
  doc.fontSize(10)
     .text(
       `Page ${i + 1} of ${range.count}`,
       40,
       doc.page.height - 50
     );
}

// STEP 5: Finalize PDF
doc.end();
```

### Page Indexing Issue & Fix

**❌ WRONG (Causes "out of bounds" error):**
```javascript
doc.switchToPage(i);  // Assumes pages start at 0
// If document already has pages, this fails
```

**✅ CORRECT:**
```javascript
doc.switchToPage(range.start + i);
// range.start = absolute starting page index
// i = relative page offset within current buffer
```

### Visual Representation

```
Document Structure:
[Existing Page 0] [Existing Page 1] [NEW: range.start=2]
                                      ↓
                              [Page 2: i=0] → switchToPage(2+0)
                              [Page 3: i=1] → switchToPage(2+1)
                              [Page 4: i=2] → switchToPage(2+2)
```

### Buffer Range Object

```javascript
const range = doc.bufferedPageRange();

// Returns:
{
  start: 2,    // Absolute index of first buffered page
  count: 3     // Number of pages in buffer
}

// Iteration:
for (i=0; i<3; i++) {
  switchToPage(2 + i)  // Pages: 2, 3, 4
}
```

### Footer Positioning Algorithm

```javascript
// Footer positioning formula:
const footerY = doc.page.height - bottomMargin;

// For A4 page (595 × 842 points):
// footerY = 842 - 50 = 792 points from top

doc.text(
  `Page ${i + 1} of ${range.count}`,  // "Page 1 of 5"
  leftMargin,                          // X: 40
  footerY,                             // Y: 792
  { align: 'center' }
);
```

### Complexity Analysis

- **Time Complexity:** O(p) where p = number of pages
- **Space Complexity:** O(1) per page (streaming)

---

## 9. Pagination Algorithm ⭐⭐⭐

**Location:** `backend/src/controllers/assessmentController.js:155`

**Purpose:** Implement offset-based pagination for API

### Algorithm

```javascript
const { page = 1, limit = 10 } = req.query;

// Formula for Skip:
// skip = (page - 1) × limit

const assessments = await Assessment.find(filter)
  .sort({ createdAt: -1 })      // Sort descending
  .limit(limit * 1)              // Convert string to number
  .skip((page - 1) * limit);     // Calculate offset

const total = await Assessment.countDocuments(filter);

// Calculate total pages: ⌈total / limit⌉
const totalPages = Math.ceil(total / limit);
```

### Mathematical Formulas

```
Skip Offset = (CurrentPage - 1) × ItemsPerPage

Total Pages = ⌈TotalItems / ItemsPerPage⌉

Where ⌈x⌉ = Math.ceil(x) = smallest integer ≥ x
```

### Pagination Visualization

```
Total Items: 45
Items Per Page: 10

┌─────────┬─────────┬────────────┬──────────────┐
│  Page   │  Skip   │   Limit    │  Items Range │
├─────────┼─────────┼────────────┼──────────────┤
│    1    │    0    │     10     │    1-10      │
│    2    │   10    │     10     │   11-20      │
│    3    │   20    │     10     │   21-30      │
│    4    │   30    │     10     │   31-40      │
│    5    │   40    │     10     │   41-45*     │
└─────────┴─────────┴────────────┴──────────────┘

* Only 5 items on last page
Total Pages = ⌈45 / 10⌉ = 5
```

### Example Calculations

```javascript
// Scenario: 45 total assessments, 10 per page

Page 1:
  skip = (1 - 1) × 10 = 0
  limit = 10
  → Returns items 1-10

Page 2:
  skip = (2 - 1) × 10 = 10
  limit = 10
  → Returns items 11-20

Page 3:
  skip = (3 - 1) × 10 = 20
  limit = 10
  → Returns items 21-30

Page 5:
  skip = (5 - 1) × 10 = 40
  limit = 10
  → Returns items 41-45 (only 5 items)

Total Pages = Math.ceil(45 / 10) = Math.ceil(4.5) = 5
```

### API Response Format

```javascript
{
  assessments: [...],           // Array of assessment objects
  totalPages: 5,                // Calculated total pages
  currentPage: 2,               // Current page number
  total: 45                     // Total number of items
}
```

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Page < 1 | Defaults to page 1 |
| Page > totalPages | Returns empty array |
| Limit < 1 | Defaults to 10 |
| Total = 0 | Returns { assessments: [], totalPages: 0, currentPage: 1, total: 0 } |

### Complexity Analysis

- **Time Complexity:** O(skip + limit) for MongoDB cursor
- **Space Complexity:** O(limit) for returned documents

### MongoDB Index Optimization

```javascript
// Create index for efficient pagination
Assessment.createIndex({ userId: 1, createdAt: -1 });

// Index benefits:
// 1. Fast userId filtering: O(log n)
// 2. Efficient sorting by createdAt: O(1)
// 3. Skip operation uses index: O(skip) instead of O(n)
```

---

## Similarity Metrics Analysis

### Question: Does SkillOrbit Use Word2Vec or Similarity Metrics?

**Answer: ❌ NO**

### What's NOT Implemented

| Technology | Purpose | Status |
|------------|---------|--------|
| **Word2Vec** | Word embeddings for semantic similarity | ❌ Not used |
| **Cosine Similarity** | Measure similarity between vectors | ❌ Not used |
| **Euclidean Distance** | Distance metric for vector comparison | ❌ Not used |
| **TensorFlow/PyTorch** | Machine learning model training | ❌ Not used |
| **Gensim** | NLP library for word embeddings | ❌ Not used |
| **sklearn** | Machine learning library | ❌ Not used |
| **spaCy** | NLP processing library | ❌ Not used |
| **Vector Embeddings** | Semantic representation of text | ❌ Not used |

### What IS Implemented

| Algorithm | Type | Purpose |
|-----------|------|---------|
| **String Matching** | Exact comparison | Answer validation |
| **LLaMA 3.3-70B API** | External AI | Learning path generation |
| **MongoDB Aggregation** | Database queries | Statistical calculations |
| **HMAC-SHA256** | Cryptographic | JWT token verification |
| **Hash Tables** | Data structure | Category frequency counting |
| **Pagination** | Offset-based | API data retrieval |
| **Regex Parsing** | Pattern matching | AI response extraction |

### Why No ML Similarity Metrics?

**Reasons:**
1. **External AI Service:** Uses LLaMA 3.3-70B via Groq API instead of local ML models
2. **Exact Matching:** Assessment answers use exact string comparison, not semantic matching
3. **Simplicity:** Traditional algorithms sufficient for project requirements
4. **Resource Constraints:** No GPU/training infrastructure needed
5. **API-First Approach:** Leverages pre-trained models via API calls

### Comparison: Traditional vs ML Approach

| Aspect | SkillOrbit (Traditional) | ML-Based Alternative |
|--------|-------------------------|---------------------|
| Answer Validation | Exact string match | Cosine similarity with embeddings |
| Skill Matching | String contains/regex | Word2Vec similarity scores |
| Learning Paths | LLaMA API (external) | Local NLP model |
| Infrastructure | Simple Node.js server | GPU server + ML frameworks |
| Dependencies | axios, mongoose, jwt | tensorflow, pytorch, gensim |
| Setup Complexity | Low | High |
| Training Required | No | Yes |
| Response Time | Fast (string ops) | Slower (embedding computation) |

### Cosine Similarity (Not Used, But Explained)

If the project were to implement cosine similarity for semantic answer matching, it would look like:

```python
# HYPOTHETICAL IMPLEMENTATION (NOT IN PROJECT)

from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

# Load pre-trained model
model = SentenceTransformer('all-MiniLM-L6-v2')

# User answer and correct answer
user_answer = "Node.js is a JavaScript runtime"
correct_answer = "Node.js is a runtime environment for JavaScript"

# Generate embeddings (vector representations)
user_embedding = model.encode([user_answer])       # Shape: (1, 384)
correct_embedding = model.encode([correct_answer])  # Shape: (1, 384)

# Calculate cosine similarity
similarity = cosine_similarity(user_embedding, correct_embedding)[0][0]
# Result: 0.92 (92% similar)

# Threshold-based matching
if similarity >= 0.80:
    is_correct = True  # Accept semantically similar answers
else:
    is_correct = False
```

**Formula:**
```
                    A · B
cosine_similarity = ─────
                    ||A|| × ||B||

Where:
- A, B = vector embeddings
- A · B = dot product
- ||A|| = magnitude of vector A
```

### Word2Vec Model (Not Used, But Explained)

Hypothetical Word2Vec implementation for skill matching:

```python
# HYPOTHETICAL IMPLEMENTATION (NOT IN PROJECT)

from gensim.models import Word2Vec

# Train Word2Vec model on skill descriptions
sentences = [
    ["javascript", "react", "frontend", "web", "development"],
    ["python", "django", "backend", "api", "server"],
    ["node", "express", "javascript", "backend", "api"]
]

model = Word2Vec(sentences, vector_size=100, window=5, min_count=1)

# Find similar skills
similar_skills = model.wv.most_similar("react", topn=5)
# Result: [("frontend", 0.85), ("javascript", 0.82), ("web", 0.78), ...]

# Calculate similarity between two skills
similarity = model.wv.similarity("react", "vue")
# Result: 0.75 (75% similar)
```

---

## Summary Table: All Algorithms

| # | Algorithm | Location | Type | Time Complexity | Space Complexity | ML/AI Used |
|---|-----------|----------|------|----------------|------------------|------------|
| 1 | Score Calculation | assessmentController.js | String Matching | O(n) | O(n) | ❌ |
| 2 | MongoDB Aggregation | assessmentController.js | Database Pipeline | O(n log k) | O(k) | ❌ |
| 3 | AI Prompt Construction | grokAI.js | String Concatenation | O(n + m) | O(n + m) | ✅ (External) |
| 4 | Regex Response Parsing | grokAI.js | Pattern Matching | O(n × m) | O(k) | ❌ |
| 5 | URL Extraction | grokAI.js | String Search | O(n × m) | O(n) | ❌ |
| 6 | JWT Verification | authMiddleware.js | Cryptographic | O(1) | O(1) | ❌ |
| 7 | Statistical Aggregation | reportController.js | Mathematical | O(n) | O(k) | ❌ |
| 8 | PDF Page Buffering | reportController.js | Sequential I/O | O(p) | O(1) | ❌ |
| 9 | Pagination | assessmentController.js | Offset-Limit | O(skip + limit) | O(limit) | ❌ |

### Legend
- **n** = number of skills/questions
- **m** = number of patterns/assessments
- **k** = unique categories/results
- **p** = number of PDF pages

---

## Performance Optimizations Implemented

### 1. Database Indexing
```javascript
// MongoDB indexes for fast queries
User.createIndex({ email: 1 }, { unique: true });
Assessment.createIndex({ userId: 1, createdAt: -1 });
Skill.createIndex({ userId: 1, category: 1 });
```

### 2. Parallel Promise Execution
```javascript
// Fetch multiple collections simultaneously
const [skills, assessments, analyses] = await Promise.all([
  Skill.find({ userId }),
  Assessment.find({ userId }).sort({ createdAt: -1 }),
  Analysis.find({ userId }).sort({ analyzedAt: -1 })
]);
// Time: O(max(T1, T2, T3)) instead of O(T1 + T2 + T3)
```

### 3. Query Result Limiting
```javascript
// Limit results to prevent memory overflow
const questions = await QuestionBank.find({ skillName, difficulty })
  .limit(10);  // Only fetch 10 questions
```

### 4. Selective Field Projection
```javascript
// Exclude unnecessary fields
const user = await User.findById(userId).select('-password');
// Don't load sensitive password hash
```

### 5. Aggregation Pipeline Optimization
```javascript
// Use indexes in $match stage
{
  $match: { userId: new mongoose.Types.ObjectId(userId) }  // Uses index
}

// Sort after grouping (smaller dataset)
{ $group: { ... } },
{ $sort: { averageScore: -1 } }  // Sort k groups instead of n documents
```

---

## Conclusion

SkillOrbit implements **9 core algorithms** using traditional computer science approaches:

✅ **String matching** for answer validation  
✅ **Database aggregation** for statistics  
✅ **Cryptographic hashing** for security  
✅ **Regex parsing** for text extraction  
✅ **Hash tables** for frequency counting  
✅ **Pagination** for API data management  
✅ **PDF buffering** for report generation  
✅ **External AI API** for learning recommendations  

❌ **No local ML models** (Word2Vec, embeddings, similarity metrics)  
❌ **No vector-based matching** (relies on exact string comparison)  
❌ **No TensorFlow/PyTorch** (uses LLaMA 3.3-70B via API)

This architecture provides:
- **Simplicity:** Easy to deploy and maintain
- **Performance:** Fast response times with optimized queries
- **Scalability:** Stateless JWT authentication
- **Security:** HMAC-SHA256 token verification
- **AI-Powered:** Leverages state-of-the-art LLaMA model via API

---

**Document Version:** 1.0  
**Last Updated:** November 21, 2025  
**Project:** SkillOrbit Mini-Project  
**Repository:** SkillOrbit--MiniProject
