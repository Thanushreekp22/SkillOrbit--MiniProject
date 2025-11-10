import { Skill, User } from "../models/index.js";

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

    // Static trending domains data (can be made dynamic later)
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
