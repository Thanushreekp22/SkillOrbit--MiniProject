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
}

const grokAIService = new GrokAIService();
export default grokAIService;
