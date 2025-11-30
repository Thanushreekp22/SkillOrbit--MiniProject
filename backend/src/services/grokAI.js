import axios from 'axios';

/**
 * Grok AI Service for Learning Path Recommendations
 * Uses xAI's Grok API to generate personalized learning paths
 */

class GrokAIService {
  constructor() {
    this.apiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;
    
    // Debug logging
    console.log('🔑 AI Service Initialization:');
    console.log('   GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Found' : '❌ Not Found');
    console.log('   GROK_API_KEY:', process.env.GROK_API_KEY ? '✅ Found' : '❌ Not Found');
    console.log('   Using API Key:', this.apiKey ? '✅ Yes' : '❌ No');
    
    // Support both Groq Cloud and Grok AI (xAI)
    this.apiUrl = process.env.GROQ_API_KEY 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.x.ai/v1/chat/completions';
    // Use Groq's models if Groq API key is present
    this.model = process.env.GROQ_API_KEY 
      ? 'llama-3.3-70b-versatile' // Groq's latest model (updated from llama-3.1)
      : 'grok-beta'; // xAI's Grok model
      
    console.log('   API URL:', this.apiUrl);
    console.log('   Model:', this.model);
  }

  /**
   * Generate learning path recommendations based on user data
   * @param {Object} userData - User's skills, assessment scores, and goals
   * @returns {Promise<Object>} AI-generated learning path
   */
  async generateLearningPath(userData) {
    try {
      const { skills, assessmentScores, selectedSkills, targetRole, currentLevel } = userData;

      // Build context for AI
      const prompt = this.buildPrompt(skills, assessmentScores, selectedSkills, targetRole, currentLevel);

      // Call Grok API
      const response = await axios.post(
        this.apiUrl,
        {
          messages: [
            {
              role: 'system',
              content: 'You are an expert career advisor and learning path architect specializing in technology skills. Provide detailed, actionable, and personalized learning recommendations based on the user\'s current skills, assessment scores, and career goals. Format your response as a structured learning path with clear milestones, resources, and timelines.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: this.model,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Parse and structure the response
      const aiResponse = response.data.choices[0].message.content;
      return this.parseAIResponse(aiResponse);

    } catch (error) {
      console.error('❌ Grok AI Error Details:');
      console.error('   Status:', error.response?.status);
      console.error('   Status Text:', error.response?.statusText);
      console.error('   Error Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('   Error Message:', error.message);
      console.error('   API URL:', this.apiUrl);
      console.error('   Model:', this.model);
      console.error('   Has API Key:', !!this.apiKey);
      
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to generate learning path recommendations');
    }
  }

  /**
   * Build prompt for Grok AI
   */
  buildPrompt(skills, assessmentScores, selectedSkills, targetRole, currentLevel) {
    let prompt = `I need a personalized learning path recommendation.\n\n`;

    // Current Skills
    if (skills && skills.length > 0) {
      prompt += `**Current Skills:**\n`;
      skills.forEach(skill => {
        const score = assessmentScores?.[skill.name] || 'Not assessed';
        prompt += `- ${skill.name} (${skill.category}): Proficiency ${skill.proficiency}%, Assessment Score: ${score}\n`;
      });
      prompt += `\n`;
    }

    // Selected Skills to Focus On
    if (selectedSkills && selectedSkills.length > 0) {
      prompt += `**Skills I Want to Focus On:**\n`;
      selectedSkills.forEach(skill => {
        prompt += `- ${skill}\n`;
      });
      prompt += `\n`;
    }

    // Target Role
    if (targetRole) {
      prompt += `**Target Role:** ${targetRole}\n\n`;
    }

    // Current Level
    if (currentLevel) {
      prompt += `**Current Experience Level:** ${currentLevel}\n\n`;
    }

    prompt += `Please provide:\n`;
    prompt += `1. **Gap Analysis**: What skills am I missing or need to improve for my target role?\n`;
    prompt += `2. **Learning Path**: A structured roadmap with phases (Beginner → Intermediate → Advanced)\n`;
    prompt += `3. **Recommended Resources**: Specific courses, books, or platforms for each skill\n`;
    prompt += `4. **Timeline**: Estimated time to achieve proficiency in each phase\n`;
    prompt += `5. **Projects**: Hands-on project ideas to practice each skill\n`;
    prompt += `6. **Milestones**: Clear checkpoints to track progress\n`;
    prompt += `7. **Priority Order**: Which skills to learn first and why\n\n`;
    prompt += `Format the response in a clear, structured manner with sections and bullet points.`;

    return prompt;
  }

  /**
   * Parse AI response into structured format
   */
  parseAIResponse(aiResponse) {
    const sections = this.extractSections(aiResponse);
    const resources = this.extractResources(aiResponse);
    
    return {
      rawResponse: aiResponse,
      sections,
      resources,
      generatedAt: new Date()
    };
  }
  
  /**
   * Extract resource links from AI response
   */
  extractResources(response) {
    const resources = [];
    
    // Extract URLs from the response
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    const urls = response.match(urlRegex) || [];
    
    urls.forEach(url => {
      // Determine resource type based on URL
      let type = 'article';
      let title = url;
      
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
      
      resources.push({ title, url, type });
    });
    
    return resources;
  }

  /**
   * Extract sections from AI response
   */
  extractSections(response) {
    const sections = {};
    
    // Try to identify common sections
    const sectionPatterns = [
      'Gap Analysis',
      'Learning Path',
      'Recommended Resources',
      'Timeline',
      'Projects',
      'Milestones',
      'Priority Order'
    ];

    sectionPatterns.forEach(pattern => {
      const regex = new RegExp(`(?:^|\\n)(?:\\*\\*)?${pattern}(?:\\*\\*)?:?\\s*([\\s\\S]*?)(?=\\n(?:\\*\\*)?(?:${sectionPatterns.join('|')})(?:\\*\\*)?:|$)`, 'i');
      const match = response.match(regex);
      if (match) {
        sections[pattern.toLowerCase().replace(/\s+/g, '_')] = match[1].trim();
      }
    });

    return sections;
  }

  /**
   * Generate quick skill recommendations
   * @param {String} skillName - Skill to get recommendations for
   * @returns {Promise<Object>} Quick recommendations
   */
  async getSkillRecommendations(skillName, currentProficiency = 0) {
    try {
      const prompt = `Provide a concise learning recommendation for "${skillName}" skill. Current proficiency: ${currentProficiency}%.\n\nInclude:\n1. Best resources (top 3)\n2. Learning timeline\n3. Key topics to master\n4. Practice project ideas\n\nKeep it brief and actionable.`;

      const response = await axios.post(
        this.apiUrl,
        {
          messages: [
            {
              role: 'system',
              content: 'You are a concise technical learning advisor. Provide brief, actionable recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: this.model,
          temperature: 0.7,
          max_tokens: 500,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        skill: skillName,
        recommendation: response.data.choices[0].message.content,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Grok AI Error:', error.response?.data || error.message);
      throw new Error('Failed to generate skill recommendations');
    }
  }

  /**
   * Analyze assessment results and provide insights
   */
  async analyzeAssessment(skillName, score, answers) {
    try {
      const prompt = `Analyze this assessment result:\n\nSkill: ${skillName}\nScore: ${score}%\n\nProvide:\n1. Strengths identified\n2. Areas for improvement\n3. Next steps\n4. Specific topics to study\n\nBe specific and actionable.`;

      const response = await axios.post(
        this.apiUrl,
        {
          messages: [
            {
              role: 'system',
              content: 'You are an expert technical assessor. Analyze assessment results and provide actionable feedback.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: this.model,
          temperature: 0.6,
          max_tokens: 600,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        skill: skillName,
        score: score,
        analysis: response.data.choices[0].message.content,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Grok AI Error:', error.response?.data || error.message);
      throw new Error('Failed to analyze assessment');
    }
  }

  /**
   * Generate Expert Level Assessment Questions
   * Creates 15 placement-focused questions: 6 theory, 9 practical
   * Theory: 2 MCQ, 2 True/False, 2 Short Answer
   * Practical: 3-4 Code Typing, 5-6 Code MCQ
   */
  async generateExpertQuestions(skillName, retryCount = 0) {
    try {
      const timestamp = Date.now();
      const prompt = `You are an expert technical interviewer. Generate EXACTLY 15 UNIQUE expert-level placement interview questions for ${skillName}.

IMPORTANT: Generate NEW and DIFFERENT questions each time. Do NOT repeat common questions. Use timestamp ${timestamp} to ensure uniqueness.

CRITICAL REQUIREMENTS:
1. YOU MUST GENERATE EXACTLY 15 QUESTIONS - NO MORE, NO LESS
2. QUESTIONS MUST BE UNIQUE AND VARIED - Cover different aspects, patterns, and difficulty nuances
3. MANDATORY Distribution:
   - EXACTLY 6 Theory Questions:
     * Question 1-2: Multiple Choice Questions (MCQ) with 4 options each
     * Question 3-4: True/False Questions
     * Question 5-6: Short Answer Questions (require detailed explanations)
   
   - EXACTLY 9 Practical Questions:
     * Question 7-10: Code Implementation ("code-typing") - user writes complete code
     * Question 11-15: Code-Based MCQ ("code-mcq") - analyze code snippet and choose answer

3. Difficulty: Expert level - suitable for placement interviews
4. Focus: Real-world scenarios, commonly asked in FAANG/product companies
5. Include correct answers and detailed explanations

FORMAT YOUR RESPONSE AS VALID JSON ONLY (no markdown, no code blocks):
{
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "category": "theory",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "explanation": "Detailed explanation of why this is correct"
    },
    {
      "id": 2,
      "type": "true-false",
      "category": "theory",
      "question": "Statement to evaluate",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "explanation": "Why this is true/false"
    },
    {
      "id": 3,
      "type": "short-answer",
      "category": "theory",
      "question": "Question requiring explanation",
      "correctAnswer": "Expected key points in the answer",
      "explanation": "Complete explanation with context"
    },
    {
      "id": 4,
      "type": "code-typing",
      "category": "practical",
      "question": "Write a function/code to solve this problem...",
      "correctAnswer": "Expected code solution with key concepts",
      "explanation": "Step-by-step explanation of the solution"
    },
    {
      "id": 5,
      "type": "code-mcq",
      "category": "practical",
      "question": "What is the output of this code?\n\ncode snippet here",
      "options": ["Output A", "Output B", "Output C", "Output D"],
      "correctAnswer": "Output B",
      "explanation": "Why this output is correct"
    }
  ]
}

IMPORTANT: 
- For "code-typing" type: User will write code, so provide problem description
- For "code-mcq" type: Include code snippet in question, ask about output/behavior
- Ensure exactly 6 theory and 9 practical questions
- Make 3-4 questions as "code-typing" and 5-6 as "code-mcq"

Make questions diverse, challenging, and relevant to current industry standards for ${skillName}.`;

      const response = await axios.post(
        this.apiUrl,
        {
          messages: [
            {
              role: 'system',
              content: 'You are an expert technical interviewer who creates challenging placement interview questions. You MUST generate EXACTLY 15 questions every time - this is critical. Focus on real-world scenarios and practical problem-solving. Always respond with valid JSON only, no markdown formatting. DO NOT generate less than 15 questions under any circumstances. IMPORTANT: Generate UNIQUE questions each time - vary topics, difficulty nuances, and problem types to ensure no repetition.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: this.model,
          temperature: 0.8, // Higher temperature for more variety and uniqueness
          max_tokens: 6000, // Increased to ensure all 15 questions are generated
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      let content = response.data.choices[0].message.content.trim();
      
      // Clean up markdown code blocks if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const parsedData = JSON.parse(content);
      
      // Validate and ensure correct structure
      if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
        throw new Error('Invalid response format from AI');
      }

      // Check question count and retry if needed
      if (parsedData.questions.length < 15 && retryCount < 2) {
        console.warn(`⚠️  AI generated only ${parsedData.questions.length} questions, retrying... (Attempt ${retryCount + 1}/2)`);
        return this.generateExpertQuestions(skillName, retryCount + 1);
      } else if (parsedData.questions.length < 15) {
        console.error(`❌ AI failed to generate 15 questions after retries. Using fallback.`);
        return this.getFallbackQuestions(skillName);
      } else if (parsedData.questions.length > 15) {
        console.warn(`⚠️  AI generated ${parsedData.questions.length} questions, trimming to exactly 15`);
        parsedData.questions = parsedData.questions.slice(0, 15);
      }

      // Validate question count and distribution
      const theoryCount = parsedData.questions.filter(q => q.category === 'theory').length;
      const practicalCount = parsedData.questions.filter(q => q.category === 'practical').length;
      
      // Count question types
      const codeTypingCount = parsedData.questions.filter(q => q.type === 'code-typing').length;
      const codeMcqCount = parsedData.questions.filter(q => q.type === 'code-mcq').length;
      
      console.log(`✅ Generated ${parsedData.questions.length} questions for ${skillName}`);
      console.log(`   Theory: ${theoryCount}, Practical: ${practicalCount}`);
      console.log(`   Code Typing: ${codeTypingCount}, Code MCQ: ${codeMcqCount}`);

      return {
        skill: skillName,
        questions: parsedData.questions,
        totalQuestions: parsedData.questions.length,
        theoryCount,
        practicalCount,
        codeTypingCount,
        codeMcqCount,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('❌ Expert Question Generation Error:', error.response?.data || error.message);
      
      // Fallback: Return sample questions if AI fails
      console.log('⚠️  Using fallback questions for', skillName);
      return this.getFallbackQuestions(skillName);
    }
  }

  /**
   * Fallback questions in case AI generation fails (15 questions total)
   */
  getFallbackQuestions(skillName) {
    return {
      skill: skillName,
      questions: [
        // Theory Questions (6 total)
        // 2 MCQ
        {
          id: 1,
          type: "mcq",
          category: "theory",
          question: `What is the primary purpose of ${skillName} in modern software development?`,
          options: ["Performance optimization", "Code organization", "User interface design", "Database management"],
          correctAnswer: "Code organization",
          explanation: `${skillName} is primarily used for structuring and organizing code effectively.`
        },
        {
          id: 2,
          type: "mcq",
          category: "theory",
          question: `Which of the following best describes ${skillName}'s core strength?`,
          options: ["Memory efficiency", "Developer productivity", "Runtime speed", "Hardware optimization"],
          correctAnswer: "Developer productivity",
          explanation: `${skillName} focuses on improving developer productivity and code maintainability.`
        },
        // 2 True/False
        {
          id: 3,
          type: "true-false",
          category: "theory",
          question: `${skillName} supports asynchronous programming patterns.`,
          options: ["True", "False"],
          correctAnswer: "True",
          explanation: "Most modern technologies support async patterns for better performance."
        },
        {
          id: 4,
          type: "true-false",
          category: "theory",
          question: `${skillName} is only used for frontend development.`,
          options: ["True", "False"],
          correctAnswer: "False",
          explanation: `${skillName} can be used across different layers of application development.`
        },
        // 2 Short Answer
        {
          id: 5,
          type: "short-answer",
          category: "theory",
          question: `Explain the main advantages of using ${skillName} in production environments.`,
          correctAnswer: "Key points should include performance, scalability, maintainability, ecosystem support, and community backing.",
          explanation: "Production systems require reliability, performance optimization, and strong community support."
        },
        {
          id: 6,
          type: "short-answer",
          category: "theory",
          question: `What are the key differences between ${skillName} and alternative technologies?`,
          correctAnswer: "Differences include syntax, performance characteristics, ecosystem maturity, learning curve, and use cases.",
          explanation: "Each technology has unique strengths suited for different scenarios."
        },
        // Practical Questions (9 total)
        // 3-4 Code Typing
        {
          id: 7,
          type: "code-typing",
          category: "practical",
          question: `Write a function using ${skillName} that reverses a string. Handle edge cases like empty strings and null values.`,
          correctAnswer: "function reverse(str) { return str ? str.split('').reverse().join('') : ''; }",
          explanation: "This solution handles null/undefined inputs and uses built-in methods efficiently."
        },
        {
          id: 8,
          type: "code-typing",
          category: "practical",
          question: `Implement a function in ${skillName} to find the maximum value in an array. Consider empty arrays.`,
          correctAnswer: "function findMax(arr) { return arr && arr.length > 0 ? Math.max(...arr) : null; }",
          explanation: "Uses spread operator and checks for empty arrays to avoid errors."
        },
        {
          id: 9,
          type: "code-typing",
          category: "practical",
          question: `Create a function using ${skillName} that removes duplicate values from an array.`,
          correctAnswer: "function removeDuplicates(arr) { return [...new Set(arr)]; }",
          explanation: "Set automatically removes duplicates, spread operator converts back to array."
        },
        {
          id: 10,
          type: "code-typing",
          category: "practical",
          question: `Write a function in ${skillName} to check if a string is a palindrome (reads same forwards and backwards).`,
          correctAnswer: "function isPalindrome(str) { const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, ''); return cleaned === cleaned.split('').reverse().join(''); }",
          explanation: "Cleans input, converts to lowercase, and compares with reversed version."
        },
        // 5-6 Code MCQ
        {
          id: 11,
          type: "code-mcq",
          category: "practical",
          question: `What will be the output?\n\nlet x = 5;\nconsole.log(x++);`,
          options: ["5", "6", "undefined", "Error"],
          correctAnswer: "5",
          explanation: "Post-increment (x++) returns the value before incrementing."
        },
        {
          id: 12,
          type: "code-mcq",
          category: "practical",
          question: `What is the result?\n\nconst arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);`,
          options: ["3", "4", "undefined", "Error"],
          correctAnswer: "4",
          explanation: "push() adds element to end of array, length becomes 4."
        },
        {
          id: 13,
          type: "code-mcq",
          category: "practical",
          question: `What does this return?\n\n[1, 2, 3].map(x => x * 2)`,
          options: ["[1, 2, 3]", "[2, 4, 6]", "[3, 6, 9]", "Error"],
          correctAnswer: "[2, 4, 6]",
          explanation: "map() multiplies each element by 2."
        },
        {
          id: 14,
          type: "code-mcq",
          category: "practical",
          question: `What is the output?\n\nconst obj = { a: 1 };\nconst obj2 = obj;\nobj2.a = 2;\nconsole.log(obj.a);`,
          options: ["1", "2", "undefined", "Error"],
          correctAnswer: "2",
          explanation: "Objects are passed by reference, both variables point to same object."
        },
        {
          id: 15,
          type: "code-mcq",
          category: "practical",
          question: `What does this evaluate to?\n\n0 == false`,
          options: ["true", "false", "undefined", "Error"],
          correctAnswer: "true",
          explanation: "Loose equality (==) performs type coercion, 0 equals false."
        }
      ],
      totalQuestions: 15,
      theoryCount: 6,
      practicalCount: 9,
      codeTypingCount: 4,
      codeMcqCount: 5,
      generatedAt: new Date(),
      isFallback: true
    };
  }
}

const grokAIService = new GrokAIService();
export default grokAIService;

/**
 * Generic function to get AI response for any prompt
 * @param {string} prompt - The prompt to send to AI
 * @param {Object} options - Optional configuration (temperature, max_tokens, etc.)
 * @returns {Promise<string>} AI-generated response
 */
export async function generateAIResponse(prompt, options = {}) {
  try {
    const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
    const apiUrl = process.env.GROQ_API_KEY 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.x.ai/v1/chat/completions';
    const model = process.env.GROQ_API_KEY 
      ? 'llama-3.3-70b-versatile'
      : 'grok-beta';

    if (!apiKey) {
      console.error('❌ No API key found for AI service');
      return null;
    }

    const response = await axios.post(
      apiUrl,
      {
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: model,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: options.timeout || 30000 // 30 seconds timeout
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error('❌ AI Response Error:', error.response?.data || error.message);
    return null;
  }
}
