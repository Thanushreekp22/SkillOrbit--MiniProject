import { Skill, User } from "../models/index.js";
import { generateAIResponse } from "../services/grokAI.js";

// AI-powered trending data with caching
let cachedTrendingData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour (real-time updates)

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
      console.log('✅ Using cached AI trending data');
      return res.json({
        stats: {
          users: userCount,
          skills: skillCount,
          domains: cachedTrendingData.trendingDomains.length
        },
        ...cachedTrendingData,
        skillStats: skillStats.slice(0, 6),
        popularSkills: popularSkills.slice(0, 8),
        cached: true
      });
    }

    // Generate AI-powered trending data
    console.log('🤖 Generating AI-powered trending data...');
    const aiTrendingData = await generateAITrendingData();
    
    if (aiTrendingData) {
      // Cache the AI-generated data
      cachedTrendingData = aiTrendingData;
      cacheTimestamp = now;
      
      return res.json({
        stats: {
          users: userCount,
          skills: skillCount,
          domains: aiTrendingData.trendingDomains.length
        },
        ...aiTrendingData,
        skillStats: skillStats.slice(0, 6),
        popularSkills: popularSkills.slice(0, 8),
        cached: false
      });
    }

    // Fallback to static data if AI fails
    const trendingDomains = [
      {
        name: 'Artificial Intelligence & Machine Learning',
        growth: '+45%',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Neural Networks'],
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
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        jobs: '15.2k+ jobs',
        category: 'Development'
      },
      {
        name: 'Cybersecurity',
        growth: '+41%',
        skills: ['Ethical Hacking', 'Network Security', 'CISSP', 'Penetration Testing'],
        jobs: '6.7k+ jobs',
        category: 'Security'
      },
      {
        name: 'Data Science & Analytics',
        growth: '+35%',
        skills: ['SQL', 'R', 'Tableau', 'Power BI'],
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

    // Hot skills with demand calculation
    const hotSkills = [
      { name: 'ChatGPT & AI Tools', demand: 95, salary: '$120k+' },
      { name: 'React.js', demand: 92, salary: '$95k+' },
      { name: 'Python', demand: 89, salary: '$105k+' },
      { name: 'AWS Cloud', demand: 87, salary: '$110k+' },
      { name: 'Docker', demand: 84, salary: '$100k+' },
      { name: 'Node.js', demand: 82, salary: '$90k+' },
      { name: 'Kubernetes', demand: 79, salary: '$115k+' },
      { name: 'TypeScript', demand: 77, salary: '$85k+' }
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
      "name": "Skill name",
      "demand": 95,
      "salary": "$120k+"
    }
  ]
}

Requirements:
- Provide exactly 6 trending domains covering: AI/ML, Cloud/DevOps, Full Stack Development, Cybersecurity, Data Science, Mobile Development
- Provide exactly 8 hot skills with demand scores (70-100) and realistic US market salaries
- Use real 2025 market data and current technology trends
- Growth percentages should be realistic (+20% to +50%)
- Job numbers should reflect actual market demand
- Skills should be currently in-demand technologies
- Return ONLY valid JSON, no markdown formatting`;

    const aiResponse = await generateAIResponse(prompt);
    
    if (!aiResponse) {
      console.error('❌ AI response is empty');
      return null;
    }

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
      
      // Validate structure
      if (!parsedData.trendingDomains || !parsedData.hotSkills) {
        console.error('❌ Invalid AI response structure');
        return null;
      }

      // Validate data
      if (parsedData.trendingDomains.length < 6 || parsedData.hotSkills.length < 8) {
        console.error('❌ Insufficient trending data from AI');
        return null;
      }

      console.log('✅ AI trending data generated successfully');
      return parsedData;
      
    } catch (parseError) {
      console.error('❌ Failed to parse AI JSON response:', parseError);
      console.log('Raw AI response:', cleanedResponse.substring(0, 500));
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error generating AI trending data:', error);
    return null;
  }
}
