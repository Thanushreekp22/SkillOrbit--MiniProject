import { Skill, User } from "../models/index.js";
import { generateAIResponse } from "../services/grokAI.js";

// AI-powered trending data with caching
let cachedTrendingData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour (real-time updates)

// Clear cache endpoint (for testing/admin)
export const clearTrendingCache = async (req, res) => {
  try {
    cachedTrendingData = null;
    cacheTimestamp = null;
    console.log('🗑️  Trending data cache cleared');
    res.json({ 
      message: 'Cache cleared successfully',
      success: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error clearing cache', 
      error: error.message 
    });
  }
};

// Get trending domains and skills data
export const getTrendingData = async (req, res) => {
  try {
    // Get skill statistics from database
    const skillStats = await Skill.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgProficiency: { $avg: "$proficiency" },
          skills: { $push: "$name" }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get most popular skills
    const popularSkills = await Skill.aggregate([
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
          avgProficiency: { $avg: "$proficiency" }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get user count
    const userCount = await User.countDocuments();
    const skillCount = await Skill.countDocuments();

    // Check if cached data is still valid
    const now = Date.now();
    if (cachedTrendingData && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      const cacheAge = Math.round((now - cacheTimestamp) / 1000 / 60); // minutes
      console.log(`✅ Using cached AI trending data (${cacheAge} minutes old)`);
      return res.json({
        stats: {
          users: userCount,
          skills: skillCount,
          domains: cachedTrendingData.trendingDomains.length
        },
        ...cachedTrendingData,
        skillStats: skillStats.slice(0, 6),
        popularSkills: popularSkills.slice(0, 8),
        cached: true,
        cacheAge: `${cacheAge} minutes`
      });
    }

    // Generate AI-powered trending data
    console.log('🤖 Generating NEW AI-powered trending data...');
    console.log('   Cache status: ' + (cachedTrendingData ? 'expired' : 'empty'));
    const aiTrendingData = await generateAITrendingData();
    
    if (aiTrendingData) {
      // Cache the AI-generated data
      cachedTrendingData = aiTrendingData;
      cacheTimestamp = now;
      
      console.log('💾 AI data cached successfully');
      console.log('   Cache will expire in 60 minutes');
      
      return res.json({
        stats: {
          users: userCount,
          skills: skillCount,
          domains: aiTrendingData.trendingDomains.length
        },
        ...aiTrendingData,
        skillStats: skillStats.slice(0, 6),
        popularSkills: popularSkills.slice(0, 8),
        cached: false,
        aiGenerated: true
      });
    }
    
    console.log('⚠️  AI generation returned null, using fallback static data');

    console.log('⚠️  AI generation returned null, using fallback static data');
    
    // Fallback to static data if AI fails - Updated with 2025 tech trends
    const trendingDomains = [
      {
        name: 'Artificial Intelligence & Machine Learning',
        growth: '+45%',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'LLMs'],
        jobs: '12.5k+ jobs',
        category: 'AI/ML'
      },
      {
        name: 'Cloud Computing & DevOps',
        growth: '+38%',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
        jobs: '8.3k+ jobs',
        category: 'Cloud'
      },
      {
        name: 'Full Stack Development',
        growth: '+32%',
        skills: ['React', 'Node.js', 'Next.js', 'TypeScript'],
        jobs: '15.2k+ jobs',
        category: 'Development'
      },
      {
        name: 'Cybersecurity',
        growth: '+41%',
        skills: ['Ethical Hacking', 'Zero Trust', 'SOC Analysis', 'Pen Testing'],
        jobs: '6.7k+ jobs',
        category: 'Security'
      },
      {
        name: 'Data Science & Analytics',
        growth: '+35%',
        skills: ['Python', 'SQL', 'Tableau', 'Power BI'],
        jobs: '9.1k+ jobs',
        category: 'Data'
      },
      {
        name: 'Mobile Development',
        growth: '+29%',
        skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
        jobs: '7.4k+ jobs',
        category: 'Mobile'
      }
    ];

    // Hot TECHNOLOGY skills (not job titles) with realistic 2025 market data
    const hotSkills = [
      { name: 'ChatGPT & AI Tools', demand: 95, salary: '$120k+' },
      { name: 'Python', demand: 92, salary: '$105k+' },
      { name: 'React.js', demand: 90, salary: '$95k+' },
      { name: 'AWS Cloud', demand: 88, salary: '$110k+' },
      { name: 'Kubernetes', demand: 85, salary: '$115k+' },
      { name: 'TypeScript', demand: 83, salary: '$100k+' },
      { name: 'Docker', demand: 81, salary: '$100k+' },
      { name: 'Node.js', demand: 79, salary: '$90k+' }
    ];

    res.json({
      stats: {
        users: userCount,
        skills: skillCount,
        domains: trendingDomains.length
      },
      trendingDomains,
      hotSkills,
      skillStats: skillStats.slice(0, 6), // Top 6 categories
      popularSkills: popularSkills.slice(0, 8) // Top 8 skills
    });

  } catch (error) {
    console.error('Error fetching trending data:', error);
    res.status(500).json({ 
      message: 'Error fetching trending data', 
      error: error.message 
    });
  }
};

// Get skill insights for a specific domain
export const getDomainInsights = async (req, res) => {
  try {
    const { domain } = req.params;
    
    // Get skills in this domain/category
    const domainSkills = await Skill.find({ 
      category: new RegExp(domain, 'i') 
    }).populate('userId', 'name');

    if (domainSkills.length === 0) {
      return res.status(404).json({ message: 'Domain not found' });
    }

    // Calculate insights
    const skillInsights = domainSkills.reduce((acc, skill) => {
      const skillName = skill.name;
      if (!acc[skillName]) {
        acc[skillName] = {
          name: skillName,
          count: 0,
          totalProficiency: 0,
          users: []
        };
      }
      acc[skillName].count++;
      acc[skillName].totalProficiency += skill.proficiency;
      acc[skillName].users.push(skill.userId?.name || 'Anonymous');
      return acc;
    }, {});

    // Convert to array and calculate averages
    const insights = Object.values(skillInsights).map(skill => ({
      ...skill,
      avgProficiency: Math.round(skill.totalProficiency / skill.count),
      popularity: skill.count
    })).sort((a, b) => b.popularity - a.popularity);

    res.json({
      domain,
      totalSkills: domainSkills.length,
      uniqueSkills: insights.length,
      insights: insights.slice(0, 10) // Top 10 skills in domain
    });

  } catch (error) {
    console.error('Error fetching domain insights:', error);
    res.status(500).json({ 
      message: 'Error fetching domain insights', 
      error: error.message 
    });
  }
};

// Generate AI-powered trending data
async function generateAITrendingData() {
  try {
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const prompt = `As a technology industry analyst, provide the latest trending data for ${currentMonth}. 

CRITICAL: For "hotSkills" array, you MUST provide TECHNOLOGY NAMES/TOOLS ONLY, NOT job titles or roles.

Generate a JSON response with exactly this structure:
{
  "trendingDomains": [
    {
      "name": "Domain name",
      "growth": "Growth percentage (e.g., +45%)",
      "skills": ["skill1", "skill2", "skill3", "skill4"],
      "jobs": "Number of jobs (e.g., 12.5k+ jobs)",
      "category": "Short category name"
    }
  ],
  "hotSkills": [
    {
      "name": "Technology/Tool/Framework name",
      "demand": 95,
      "salary": "$120k+"
    }
  ]
}

Requirements:
- Provide exactly 6 trending domains with EXACT names:
  1. "Artificial Intelligence & Machine Learning"
  2. "Cloud Computing & DevOps"
  3. "Full Stack Development"
  4. "Cybersecurity"
  5. "Data Science & Analytics"
  6. "Mobile Development"

- For EACH domain, provide 4 specific technology/tool names in the "skills" array

- Provide exactly 8 hot TECHNOLOGY SKILLS with these STRICT rules:
  ✅ CORRECT examples (programming languages, frameworks, tools, platforms):
     - "Python" (language)
     - "React.js" (framework)
     - "AWS Cloud" (platform)
     - "Docker" (tool)
     - "Kubernetes" (tool)
     - "TypeScript" (language)
     - "TensorFlow" (library)
     - "Node.js" (runtime)
     - "PostgreSQL" (database)
     - "MongoDB" (database)
  
  ❌ WRONG examples (job titles, roles, or general terms):
     - "Cloud Architecture" ❌
     - "Data Engineering" ❌
     - "Software Development" ❌
     - "Cybersecurity Engineering" ❌
     - "Full Stack Development" ❌
     - "Machine Learning Engineering" ❌

- IMPORTANT: Only include specific technology names, not career roles or engineering disciplines
- Include demand scores (75-98) and realistic US market average salaries for professionals using that technology
- Use real 2025 market data and current technology trends
- Growth percentages should be realistic (+25% to +45%)
- Job numbers should reflect actual market demand (format: "12.5k+ jobs")
- Return ONLY valid JSON, no markdown formatting, no code blocks`;

    console.log('🤖 Requesting AI trending data...');
    const aiResponse = await generateAIResponse(prompt, {
      temperature: 0.7,
      max_tokens: 3000,
      timeout: 30000
    });
    
    if (!aiResponse) {
      console.error('❌ AI response is empty or null');
      return null;
    }
    
    console.log('📦 AI response received, length:', aiResponse.length);

    // Clean and parse AI response
    let cleanedResponse = aiResponse.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }
    
    cleanedResponse = cleanedResponse.trim();

    try {
      const parsedData = JSON.parse(cleanedResponse);
      
      console.log('✅ JSON parsed successfully');
      console.log('   Trending Domains:', parsedData.trendingDomains?.length || 0);
      console.log('   Hot Skills:', parsedData.hotSkills?.length || 0);
      
      // Validate structure
      if (!parsedData.trendingDomains || !parsedData.hotSkills) {
        console.error('❌ Invalid AI response structure - missing required fields');
        console.log('   Has trendingDomains:', !!parsedData.trendingDomains);
        console.log('   Has hotSkills:', !!parsedData.hotSkills);
        return null;
      }

      // Validate data
      if (parsedData.trendingDomains.length < 6 || parsedData.hotSkills.length < 8) {
        console.warn('⚠️  Insufficient trending data from AI');
        console.log('   Expected: 6 domains, 8 skills');
        console.log('   Received:', parsedData.trendingDomains.length, 'domains,', parsedData.hotSkills.length, 'skills');
        return null;
      }
      
      // Validate hotSkills - replace with curated list for consistency
      // Check if AI provided technology names or job titles
      const knownTechSkills = ['python', 'javascript', 'typescript', 'react', 'node', 'docker', 'kubernetes', 'aws', 'azure', 'java', 'c++', 'ruby', 'php', 'swift', 'kotlin', 'flutter', 'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'tensorflow', 'pytorch', 'git'];
      const jobTitleIndicators = ['engineering', 'engineer', 'development', 'analysis', 'science', 'administration'];
      
      let techSkillCount = 0;
      let jobTitleCount = 0;
      
      parsedData.hotSkills.forEach(skill => {
        const skillNameLower = skill.name.toLowerCase();
        const isTechSkill = knownTechSkills.some(tech => skillNameLower.includes(tech));
        const isJobTitle = jobTitleIndicators.some(indicator => skillNameLower.includes(indicator));
        
        if (isTechSkill) techSkillCount++;
        if (isJobTitle) {
          jobTitleCount++;
          console.warn(`   ⚠️  Job title detected: "${skill.name}"`);
        }
      });
      
      // Always use curated list to ensure quality and consistency
      console.log(`   📊 AI returned ${techSkillCount} tech skills, ${jobTitleCount} job titles`);
      console.log('   ✅ Using curated technology skills for consistency');
      
      parsedData.hotSkills = [
        { name: 'Python', demand: 95, salary: '$125k+' },
        { name: 'React.js', demand: 92, salary: '$105k+' },
        { name: 'AWS Cloud', demand: 90, salary: '$118k+' },
        { name: 'TypeScript', demand: 88, salary: '$110k+' },
        { name: 'Kubernetes', demand: 86, salary: '$125k+' },
        { name: 'Docker', demand: 84, salary: '$110k+' },
        { name: 'Node.js', demand: 82, salary: '$100k+' },
        { name: 'TensorFlow', demand: 80, salary: '$130k+' }
      ];

      // Normalize domain names to ensure consistency
      const domainNameMap = {
        'ai': 'Artificial Intelligence & Machine Learning',
        'machine learning': 'Artificial Intelligence & Machine Learning',
        'artificial intelligence': 'Artificial Intelligence & Machine Learning',
        'cloud': 'Cloud Computing & DevOps',
        'devops': 'Cloud Computing & DevOps',
        'cloud computing': 'Cloud Computing & DevOps',
        'full stack': 'Full Stack Development',
        'fullstack': 'Full Stack Development',
        'cybersecurity': 'Cybersecurity',
        'security': 'Cybersecurity',
        'data science': 'Data Science & Analytics',
        'data analytics': 'Data Science & Analytics',
        'analytics': 'Data Science & Analytics',
        'mobile': 'Mobile Development',
      };

      parsedData.trendingDomains = parsedData.trendingDomains.map(domain => {
        // Normalize the domain name
        let normalizedName = domain.name;
        const lowerName = domain.name.toLowerCase();
        
        // First, replace common separators with &
        normalizedName = normalizedName.replace(/\s*\/\s*/g, ' & ').replace(/\s*\|\s*/g, ' & ');
        
        // Then check against the mapping
        for (const [key, value] of Object.entries(domainNameMap)) {
          if (lowerName.includes(key)) {
            normalizedName = value;
            break;
          }
        }
        
        return { ...domain, name: normalizedName };
      });

      console.log('✅ AI trending data generated successfully');
      console.log('   ✓ All validation checks passed');
      return parsedData;
      
    } catch (parseError) {
      console.error('❌ Failed to parse AI JSON response:', parseError.message);
      console.log('📄 Raw AI response (first 500 chars):', cleanedResponse.substring(0, 500));
      console.log('📄 Raw AI response (last 200 chars):', cleanedResponse.substring(Math.max(0, cleanedResponse.length - 200)));
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error generating AI trending data:', error.message);
    if (error.response) {
      console.error('   API Response Status:', error.response.status);
      console.error('   API Response Data:', error.response.data);
    }
    return null;
  }
}
