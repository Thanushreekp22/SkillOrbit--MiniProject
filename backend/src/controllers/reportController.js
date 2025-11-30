import { Skill, Assessment, Analysis, User } from "../models/index.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

// Generate report data for a user
export const generateReportData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all user data
    const [skills, assessments, analyses] = await Promise.all([
      Skill.find({ userId }),
      Assessment.find({ userId }).sort({ createdAt: -1 }),
      Analysis.find({ userId }).sort({ analyzedAt: -1 })
    ]);

    // Calculate overview statistics
    const avgProficiency = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)
      : 0;

    const avgScore = assessments.length > 0
      ? Math.round(assessments.reduce((acc, a) => acc + (a.score || 0), 0) / assessments.length)
      : 0;

    const expertSkills = skills.filter(s => s.proficiency >= 80).length;

    // Category breakdown
    const categories = {};
    skills.forEach(skill => {
      const cat = skill.category || 'Other';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    // Recent assessments
    const recentAssessments = assessments.slice(0, 10).map(a => ({
      skillName: a.skillName,
      score: a.score,
      difficulty: a.difficulty,
      date: a.createdAt,
      status: a.status
    }));

    // Skill performance
    const skillPerformance = skills.map(skill => {
      const skillAssessments = assessments.filter(a => 
        a.skillName && skill.name && 
        a.skillName.toLowerCase() === skill.name.toLowerCase()
      );
      const avgSkillScore = skillAssessments.length > 0
        ? Math.round(skillAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / skillAssessments.length)
        : skill.proficiency;

      return {
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        assessmentCount: skillAssessments.length,
        avgScore: avgSkillScore
      };
    });

    // Recent analyses
    const recentAnalyses = analyses.slice(0, 5).map(a => ({
      targetRole: a.targetRole,
      readinessScore: a.readinessScore,
      totalGaps: a.gaps ? a.gaps.filter(g => g.gapValue > 0).length : 0,
      date: a.analyzedAt
    }));

    const reportData = {
      generatedAt: new Date(),
      user: {
        id: userId,
        name: req.user.name || 'User',
        email: req.user.email
      },
      overview: {
        totalSkills: skills.length,
        avgProficiency,
        expertSkills,
        totalAssessments: assessments.length,
        avgScore,
        totalAnalyses: analyses.length
      },
      categories,
      skillPerformance,
      recentAssessments,
      recentAnalyses
    };

    res.json({
      message: "Report data generated successfully",
      report: reportData
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ 
      message: "Error generating report", 
      error: error.message 
    });
  }
};

// Download report as JSON (can be extended to PDF)
export const downloadReport = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all user data
    const [skills, assessments, analyses] = await Promise.all([
      Skill.find({ userId }),
      Assessment.find({ userId }).sort({ createdAt: -1 }),
      Analysis.find({ userId }).sort({ analyzedAt: -1 })
    ]);

    // Calculate overview statistics
    const avgProficiency = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)
      : 0;

    const avgScore = assessments.length > 0
      ? Math.round(assessments.reduce((acc, a) => acc + (a.score || 0), 0) / assessments.length)
      : 0;

    const expertSkills = skills.filter(s => s.proficiency >= 80).length;

    // Category breakdown
    const categories = {};
    skills.forEach(skill => {
      const cat = skill.category || 'Other';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    // Skill performance
    const skillPerformance = skills.map(skill => {
      const skillAssessments = assessments.filter(a => 
        a.skillName && skill.name && 
        a.skillName.toLowerCase() === skill.name.toLowerCase()
      );
      const avgSkillScore = skillAssessments.length > 0
        ? Math.round(skillAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / skillAssessments.length)
        : skill.proficiency;

      return {
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        assessmentCount: skillAssessments.length,
        avgScore: avgSkillScore
      };
    });

    const reportData = {
      title: "SkillOrbit Progress Report",
      generatedAt: new Date().toISOString(),
      user: {
        name: req.user.name || 'User',
        email: req.user.email
      },
      summary: {
        totalSkills: skills.length,
        avgProficiency,
        expertSkills,
        totalAssessments: assessments.length,
        avgScore,
        totalAnalyses: analyses.length
      },
      categories,
      skills: skillPerformance,
      recentAssessments: assessments.slice(0, 10).map(a => ({
        skillName: a.skillName,
        score: a.score,
        difficulty: a.difficulty,
        date: a.createdAt,
        status: a.status
      })),
      analyses: analyses.slice(0, 5).map(a => ({
        targetRole: a.targetRole,
        readinessScore: a.readinessScore,
        totalGaps: a.gaps ? a.gaps.filter(g => g.gapValue > 0).length : 0,
        date: a.analyzedAt
      }))
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="skillorbit-report-${Date.now()}.json"`);
    res.json(reportData);
  } catch (error) {
    console.error("Error downloading report:", error);
    res.status(500).json({ 
      message: "Error downloading report", 
      error: error.message 
    });
  }
};

// Download report as PDF
export const downloadReportPDF = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all user data including user details
    const [user, skills, assessments, analyses] = await Promise.all([
      User.findById(userId).select('-password'),
      Skill.find({ userId }),
      Assessment.find({ userId }).sort({ createdAt: -1 }),
      Analysis.find({ userId }).sort({ analyzedAt: -1 })
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate overview statistics
    const avgProficiency = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)
      : 0;

    const avgScore = assessments.length > 0
      ? Math.round(assessments.reduce((acc, a) => acc + (a.score || 0), 0) / assessments.length)
      : 0;

    const expertSkills = skills.filter(s => s.proficiency >= 80).length;
    const intermediateSkills = skills.filter(s => s.proficiency >= 50 && s.proficiency < 80).length;
    const beginnerSkills = skills.filter(s => s.proficiency < 50).length;

    // Category breakdown
    const categoryMap = {};
    skills.forEach(skill => {
      const cat = skill.category || 'Other';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { count: 0, totalProf: 0 };
      }
      categoryMap[cat].count++;
      categoryMap[cat].totalProf += skill.proficiency;
    });

    // Create PDF document
    const doc = new PDFDocument({ 
      margin: 40, 
      size: 'A4',
      bufferPages: true 
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="SkillOrbit_Report_${user.name.replace(/\s+/g, '_')}_${Date.now()}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // ==================== PAGE 1: HEADER & STUDENT INFO ====================
    
    // Header Background
    doc.rect(0, 0, doc.page.width, 120).fill('#1E40AF');
    
    // Company/Platform Logo Area
    doc.fillColor('#ffffff')
       .fontSize(32)
       .font('Helvetica-Bold')
       .text('SkillOrbit', 40, 30);
    
    doc.fontSize(11)
       .font('Helvetica')
       .text('Skill Assessment & Development Platform', 40, 68);
    
    // Report Title
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .text('PROGRESS REPORT', doc.page.width - 250, 35);
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Generated: ${new Date().toLocaleDateString('en-US', { 
         year: 'numeric', 
         month: 'long', 
         day: 'numeric' 
       })}`, doc.page.width - 250, 60);
    
    doc.fontSize(9)
       .text(`Report ID: SR-${Date.now().toString().slice(-8)}`, doc.page.width - 250, 78);

    // Reset position after header
    doc.fillColor('#1F2937');
    let yPos = 150;

    // ==================== STUDENT INFORMATION BOX ====================
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#1E40AF')
       .text('STUDENT INFORMATION', 40, yPos);
    
    yPos += 25;
    
    // Draw info box
    doc.roundedRect(40, yPos, doc.page.width - 80, 140, 8)
       .lineWidth(1.5)
       .strokeColor('#E5E7EB')
       .stroke();
    
    yPos += 20;
    
    // Student Name (Large and Bold)
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#1F2937')
       .text(user.name || 'N/A', 60, yPos);
    
    yPos += 35;
    
    // Contact Information in Two Columns
    const leftCol = 60;
    const rightCol = 320;
    
    // Left Column
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#6B7280')
       .text('EMAIL:', leftCol, yPos);
    
    doc.fontSize(11)
       .font('Helvetica')
       .fillColor('#1F2937')
       .text(user.email || 'N/A', leftCol, yPos + 15);
    
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#6B7280')
       .text('PHONE:', leftCol, yPos + 40);
    
    doc.fontSize(11)
       .font('Helvetica')
       .fillColor('#1F2937')
       .text(user.phone || 'Not Provided', leftCol, yPos + 55);
    
    // Right Column
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#6B7280')
       .text('LOCATION:', rightCol, yPos);
    
    doc.fontSize(11)
       .font('Helvetica')
       .fillColor('#1F2937')
       .text(user.location || 'Not Provided', rightCol, yPos + 15);
    
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#6B7280')
       .text('STUDENT ID:', rightCol, yPos + 40);
    
    doc.fontSize(11)
       .font('Helvetica')
       .fillColor('#1F2937')
       .text(userId.substring(0, 12).toUpperCase(), rightCol, yPos + 55);
    
    yPos += 110;

    // ==================== PROFESSIONAL INFORMATION ====================
    
    if (user.currentRole || user.company || user.education) {
      yPos += 20;
      
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#1E40AF')
         .text('PROFESSIONAL DETAILS', 40, yPos);
      
      yPos += 25;
      
      if (user.currentRole) {
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .fillColor('#6B7280')
           .text('Current Role:', 60, yPos);
        
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#1F2937')
           .text(user.currentRole, 160, yPos);
        
        yPos += 20;
      }
      
      if (user.company) {
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .fillColor('#6B7280')
           .text('Company:', 60, yPos);
        
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#1F2937')
           .text(user.company, 160, yPos);
        
        yPos += 20;
      }
      
      if (user.education) {
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .fillColor('#6B7280')
           .text('Education:', 60, yPos);
        
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#1F2937')
           .text(user.education, 160, yPos, { width: 380 });
        
        yPos += 25;
      }
    }

    // ==================== PERFORMANCE SUMMARY ====================
    
    yPos += 20;
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#1E40AF')
       .text('PERFORMANCE SUMMARY', 40, yPos);
    
    yPos += 30;
    
    // Summary Stats Boxes
    const boxWidth = 120;
    const boxHeight = 85;
    const boxGap = 15;
    const startX = 40;
    
    const summaryStats = [
      { label: 'Total Skills', value: skills.length, color: '#3B82F6' },
      { label: 'Avg Proficiency', value: `${avgProficiency}%`, color: '#10B981' },
      { label: 'Expert Level', value: expertSkills, color: '#F59E0B' },
      { label: 'Assessments', value: assessments.length, color: '#8B5CF6' }
    ];
    
    summaryStats.forEach((stat, index) => {
      const x = startX + (index * (boxWidth + boxGap));
      
      // Box with colored top border
      doc.rect(x, yPos, boxWidth, 5).fill(stat.color);
      doc.roundedRect(x, yPos, boxWidth, boxHeight, 5)
         .lineWidth(1)
         .strokeColor('#E5E7EB')
         .stroke();
      
      // Value (larger and centered)
      doc.fontSize(32)
         .font('Helvetica-Bold')
         .fillColor(stat.color)
         .text(stat.value.toString(), x, yPos + 25, { 
           width: boxWidth, 
           align: 'center' 
         });
      
      // Label
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#6B7280')
         .text(stat.label.toUpperCase(), x, yPos + 70, { 
           width: boxWidth, 
           align: 'center' 
         });
    });
    
    yPos += boxHeight + 30;

    // ==================== SKILLS BREAKDOWN ====================
    
    if (skills.length > 0) {
      // Check if we need a new page
      if (yPos > 650) {
        doc.addPage();
        yPos = 40;
      }
      
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#1E40AF')
         .text('SKILLS INVENTORY', 40, yPos);
      
      yPos += 30;
      
      // Skills Level Distribution
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('Skill Level Distribution:', 60, yPos);
      
      yPos += 20;
      
      const levelData = [
        { label: 'Expert (80-100%)', value: expertSkills, color: '#10B981', width: (expertSkills / skills.length) * 450 },
        { label: 'Intermediate (50-79%)', value: intermediateSkills, color: '#F59E0B', width: (intermediateSkills / skills.length) * 450 },
        { label: 'Beginner (0-49%)', value: beginnerSkills, color: '#EF4444', width: (beginnerSkills / skills.length) * 450 }
      ];
      
      levelData.forEach(level => {
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#6B7280')
           .text(`${level.label}: ${level.value} skills`, 80, yPos);
        
        yPos += 18;
        
        // Progress bar
        doc.rect(80, yPos, 450, 12)
           .fillColor('#F3F4F6')
           .fill();
        
        if (level.width > 0) {
          doc.rect(80, yPos, level.width, 12)
             .fillColor(level.color)
             .fill();
        }
        
        yPos += 20;
      });
      
      yPos += 15;
      
      // Skills Table Header
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('Detailed Skills List:', 60, yPos);
      
      yPos += 25;
      
      // Table header
      doc.rect(40, yPos, doc.page.width - 80, 28)
         .fillColor('#1E40AF')
         .fill();
      
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#ffffff')
         .text('Skill Name', 50, yPos + 10, { width: 180 })
         .text('Category', 240, yPos + 10, { width: 120 })
         .text('Proficiency', 370, yPos + 10, { width: 80 })
         .text('Level', 460, yPos + 10, { width: 80 });
      
      yPos += 28;
      
      // Table rows
      const sortedSkills = [...skills].sort((a, b) => b.proficiency - a.proficiency).slice(0, 15);
      
      sortedSkills.forEach((skill, index) => {
        // Check for page break
        if (yPos > 720) {
          doc.addPage();
          yPos = 40;
          
          // Repeat header
          doc.rect(40, yPos, doc.page.width - 80, 28)
             .fillColor('#1E40AF')
             .fill();
          
          doc.fontSize(10)
             .font('Helvetica-Bold')
             .fillColor('#ffffff')
             .text('Skill Name', 50, yPos + 10, { width: 180 })
             .text('Category', 240, yPos + 10, { width: 120 })
             .text('Proficiency', 370, yPos + 10, { width: 80 })
             .text('Level', 460, yPos + 10, { width: 80 });
          
          yPos += 28;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.rect(40, yPos, doc.page.width - 80, 24)
             .fillColor('#F9FAFB')
             .fill();
        }
        
        // Determine skill level and color
        let level = 'Beginner';
        let levelColor = '#EF4444';
        if (skill.proficiency >= 80) {
          level = 'Expert';
          levelColor = '#10B981';
        } else if (skill.proficiency >= 50) {
          level = 'Intermediate';
          levelColor = '#F59E0B';
        }
        
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#1F2937')
           .text(skill.name, 50, yPos + 8, { width: 180, ellipsis: true })
           .text(skill.category || 'General', 240, yPos + 8, { width: 120 })
           .text(`${skill.proficiency}%`, 370, yPos + 8, { width: 80 });
        
        doc.fontSize(9)
           .font('Helvetica-Bold')
           .fillColor(levelColor)
           .text(level, 460, yPos + 8, { width: 80 });
        
        yPos += 24;
      });
      
      yPos += 20;
      
      // If there are more skills, add note
      if (skills.length > 15) {
        doc.fontSize(9)
           .font('Helvetica-Oblique')
           .fillColor('#6B7280')
           .text(`* Showing top 15 of ${skills.length} total skills`, 50, yPos);
        
        yPos += 20;
      }
    }

    // ==================== ASSESSMENT HISTORY ====================
    
    if (assessments.length > 0) {
      // Check for new page
      if (yPos > 650) {
        doc.addPage();
        yPos = 40;
      }
      
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#1E40AF')
         .text('ASSESSMENT HISTORY', 40, yPos);
      
      yPos += 30;
      
      // Summary stats
      const passedAssessments = assessments.filter(a => a.score >= 60).length;
      const passRate = Math.round((passedAssessments / assessments.length) * 100);
      
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#1F2937')
         .text(`Total Assessments: ${assessments.length} | Passed (≥60%): ${passedAssessments} | Pass Rate: ${passRate}%`, 60, yPos);
      
      yPos += 30;
      
      // Table header
      doc.rect(40, yPos, doc.page.width - 80, 28)
         .fillColor('#1E40AF')
         .fill();
      
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#ffffff')
         .text('Domain/Skill', 50, yPos + 10, { width: 200 })
         .text('Score', 260, yPos + 10, { width: 60 })
         .text('Difficulty', 330, yPos + 10, { width: 80 })
         .text('Date', 420, yPos + 10, { width: 120 });
      
      yPos += 28;
      
      // Table rows
      const recentAssessments = assessments.slice(0, 10);
      
      recentAssessments.forEach((assessment, index) => {
        // Check for page break
        if (yPos > 720) {
          doc.addPage();
          yPos = 40;
          
          // Repeat header
          doc.rect(40, yPos, doc.page.width - 80, 28)
             .fillColor('#1E40AF')
             .fill();
          
          doc.fontSize(10)
             .font('Helvetica-Bold')
             .fillColor('#ffffff')
             .text('Domain/Skill', 50, yPos + 10, { width: 200 })
             .text('Score', 260, yPos + 10, { width: 60 })
             .text('Difficulty', 330, yPos + 10, { width: 80 })
             .text('Date', 420, yPos + 10, { width: 120 });
          
          yPos += 28;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.rect(40, yPos, doc.page.width - 80, 24)
             .fillColor('#F9FAFB')
             .fill();
        }
        
        // Score color
        let scoreColor = '#EF4444'; // Red for low scores
        if (assessment.score >= 80) {
          scoreColor = '#10B981'; // Green for high scores
        } else if (assessment.score >= 60) {
          scoreColor = '#F59E0B'; // Orange for medium scores
        }
        
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#1F2937')
           .text(assessment.skillName || 'N/A', 50, yPos + 8, { width: 200, ellipsis: true })
           .fillColor(scoreColor)
           .font('Helvetica-Bold')
           .text(`${assessment.score}%`, 260, yPos + 8, { width: 60 })
           .fillColor('#1F2937')
           .font('Helvetica')
           .text(assessment.difficulty || 'N/A', 330, yPos + 8, { width: 80 })
           .text(new Date(assessment.createdAt).toLocaleDateString('en-US', {
             month: 'short',
             day: 'numeric',
             year: 'numeric'
           }), 420, yPos + 8, { width: 120 });

        yPos += 24;
      });
      
      yPos += 20;
      
      // Note if more assessments exist
      if (assessments.length > 10) {
        doc.fontSize(9)
           .font('Helvetica-Oblique')
           .fillColor('#6B7280')
           .text(`* Showing recent 10 of ${assessments.length} total assessments`, 50, yPos);
        
        yPos += 20;
      }
    }

    // ==================== CATEGORY BREAKDOWN ====================
    
    if (skills.length > 0 && Object.keys(categoryMap).length > 0) {
      // Check for new page
      if (yPos > 650) {
        doc.addPage();
        yPos = 40;
      }
      
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#1E40AF')
         .text('SKILLS BY CATEGORY', 40, yPos);
      
      yPos += 30;
      
      const categoryEntries = Object.entries(categoryMap).sort((a, b) => b[1].count - a[1].count);
      
      categoryEntries.forEach(([category, data]) => {
        if (yPos > 720) {
          doc.addPage();
          yPos = 40;
        }
        
        const count = data.count;
        const avgProf = Math.round(data.totalProf / count);
        const percentage = Math.round((count / skills.length) * 100);
        
        // Category name and stats
        doc.fontSize(11)
           .font('Helvetica-Bold')
           .fillColor('#1F2937')
           .text(`${category}`, 60, yPos);
        
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#6B7280')
           .text(`${count} skills (${percentage}%) • Avg: ${avgProf}%`, 60, yPos + 15);
        
        yPos += 35;
        
        // Progress bar background
        doc.rect(60, yPos, 480, 14)
           .fillColor('#E5E7EB')
           .fill();
        
        // Progress bar fill (based on percentage of total skills)
        const barWidth = (percentage / 100) * 480;
        let barColor = '#3B82F6';
        if (avgProf >= 80) barColor = '#10B981';
        else if (avgProf >= 50) barColor = '#F59E0B';
        else barColor = '#EF4444';
        
        doc.rect(60, yPos, barWidth, 14)
           .fillColor(barColor)
           .fill();
        
        // Percentage text on bar
        doc.fontSize(9)
           .font('Helvetica-Bold')
           .fillColor('#ffffff')
           .text(`${percentage}%`, 65, yPos + 3);
        
        yPos += 30;
      });
      
      yPos += 10;
    }

    // ==================== INSIGHTS & RECOMMENDATIONS ====================
    
    // Check for new page
    if (yPos > 650) {
      doc.addPage();
      yPos = 40;
    }
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#1E40AF')
       .text('PERFORMANCE INSIGHTS', 40, yPos);
    
    yPos += 30;
    
    // Insights box
    doc.roundedRect(40, yPos, doc.page.width - 80, 140, 8)
       .lineWidth(1)
       .strokeColor('#E5E7EB')
       .fillColor('#F0F9FF')
       .fillAndStroke();
    
    yPos += 20;
    
    // Generate insights
    const insights = [];
    
    if (avgProficiency >= 80) {
      insights.push('+ Outstanding proficiency level! You demonstrate expertise across your skill set.');
    } else if (avgProficiency >= 60) {
      insights.push('+ Solid foundation established. Focus on advancing skills to expert level.');
    } else if (avgProficiency >= 40) {
      insights.push('* Developing proficiency. Consistent practice will accelerate growth.');
    } else {
      insights.push('* Beginning stage. Dedicate focused time to skill development.');
    }

    if (expertSkills > 5) {
      insights.push(`+ Impressive! ${expertSkills} expert-level skills demonstrate strong capability.`);
    } else if (expertSkills > 0) {
      insights.push(`+ ${expertSkills} expert skill${expertSkills > 1 ? 's' : ''} achieved. Great progress!`);
    } else {
      insights.push('* Work towards achieving expert level (80%+) in key skills.');
    }

    if (assessments.length >= 10) {
      insights.push(`+ ${assessments.length} assessments completed! Regular testing validates learning.`);
    } else if (assessments.length > 0) {
      insights.push(`+ ${assessments.length} assessment${assessments.length > 1 ? 's' : ''} taken. Continue testing knowledge regularly.`);
    } else {
      insights.push('* Begin taking assessments to benchmark your skill proficiency.');
    }

    if (avgScore >= 80) {
      insights.push(`+ Excellent assessment average (${avgScore}%). Strong conceptual understanding.`);
    } else if (avgScore >= 60) {
      insights.push(`+ Good assessment average (${avgScore}%). Review challenging topics for improvement.`);
    } else if (avgScore > 0) {
      insights.push(`* Assessment average: ${avgScore}%. Additional study and practice recommended.`);
    }

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#1F2937');
    
    insights.forEach((insight, index) => {
      doc.text(`${insight}`, 60, yPos, { width: doc.page.width - 120 });
      yPos += 22;
      if (index < insights.length - 1 && yPos > 700) {
        doc.addPage();
        yPos = 40;
      }
    });
    
    yPos += 20;

    // ==================== RECOMMENDATIONS ====================
    
    if (yPos > 650) {
      doc.addPage();
      yPos = 40;
    }
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#1E40AF')
       .text('ACTION PLAN & RECOMMENDATIONS', 40, yPos);
    
    yPos += 30;
    
    const recommendations = [
      {
        title: 'Continue Regular Assessments',
        desc: 'Take assessments weekly to track progress and identify knowledge gaps.'
      },
      {
        title: 'Focus on Low Proficiency Skills',
        desc: 'Prioritize skills below 70% proficiency through structured learning.'
      },
      {
        title: 'Explore AI Learning Paths',
        desc: 'Generate personalized learning roadmaps for your target roles.'
      },
      {
        title: 'Practice Consistently',
        desc: 'Dedicate 30-60 minutes daily to skill practice and hands-on projects.'
      },
      {
        title: 'Set Skill Goals',
        desc: 'Define target proficiency levels and create timeline for achievement.'
      }
    ];
    
    recommendations.forEach((rec, index) => {
      if (yPos > 700) {
        doc.addPage();
        yPos = 40;
      }
      
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text(`${index + 1}. ${rec.title}`, 60, yPos);
      
      yPos += 18;
      
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#6B7280')
         .text(rec.desc, 75, yPos, { width: doc.page.width - 130 });
      
      yPos += 30;
    });
    
    yPos += 20;
    
    // ==================== CLOSING SECTION ====================
    
    if (yPos > 650) {
      doc.addPage();
      yPos = 40;
    }
    
    doc.rect(40, yPos, doc.page.width - 80, 80)
       .fillColor('#F9FAFB')
       .fill();
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#1E40AF')
       .text('Need Help or Guidance?', 60, yPos + 15);
    
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#1F2937')
       .text('Visit SkillOrbit platform for personalized learning paths, expert resources,', 60, yPos + 35);
    
    doc.text('and AI-powered recommendations tailored to your career goals.', 60, yPos + 50);

    // ==================== FOOTER - ADD TO ALL PAGES ====================
    
    const range = doc.bufferedPageRange();
    const pageCount = range.count;
    
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(range.start + i);
      
      // Footer line
      doc.moveTo(40, doc.page.height - 60)
         .lineTo(doc.page.width - 40, doc.page.height - 60)
         .strokeColor('#E5E7EB')
         .lineWidth(1)
         .stroke();
      
      // Footer text
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#9CA3AF')
         .text(
           `SkillOrbit - Skill Assessment & Development Platform`,
           40,
           doc.page.height - 45,
           { align: 'left' }
         );
      
      doc.text(
        `Page ${i + 1} of ${pageCount}`,
        0,
        doc.page.height - 45,
        { align: 'center' }
      );
      
      doc.text(
        `© ${new Date().getFullYear()} SkillOrbit`,
        0,
        doc.page.height - 45,
        { align: 'right', width: doc.page.width - 40 }
      );
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF report:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Error generating PDF report", 
        error: error.message 
      });
    }
  }
};

// Email report to user
export const emailReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipientEmail } = req.body;

    // Use user's email if no recipient specified
    const emailTo = recipientEmail || req.user.email;

    if (!emailTo) {
      return res.status(400).json({ 
        message: "No email address provided" 
      });
    }

    // Fetch all user data
    const [skills, assessments, analyses] = await Promise.all([
      Skill.find({ userId }),
      Assessment.find({ userId }).sort({ createdAt: -1 }).limit(10),
      Analysis.find({ userId }).sort({ analyzedAt: -1 }).limit(5)
    ]);

    // Calculate overview statistics
    const avgProficiency = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)
      : 0;

    const avgScore = assessments.length > 0
      ? Math.round(assessments.reduce((acc, a) => acc + (a.score || 0), 0) / assessments.length)
      : 0;

    const expertSkills = skills.filter(s => s.proficiency >= 80).length;

    // Generate email content (HTML format)
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f5f5f5;
          }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 { margin-bottom: 10px; font-size: 28px; }
          .header p { opacity: 0.9; font-size: 14px; }
          .content { padding: 30px; }
          .greeting { font-size: 18px; margin-bottom: 20px; }
          .intro { color: #666; margin-bottom: 30px; }
          .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
            gap: 15px; 
            margin: 30px 0; 
          }
          .stat-card { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            padding: 20px; 
            border-radius: 12px; 
            text-align: center;
            border: 1px solid #dee2e6;
          }
          .stat-value { 
            font-size: 32px; 
            font-weight: bold; 
            color: #667eea; 
            margin-bottom: 5px;
          }
          .stat-label { 
            color: #666; 
            font-size: 13px; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #667eea;
            margin: 30px 0 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
            border-radius: 8px;
            overflow: hidden;
          }
          th, td { 
            padding: 14px 12px; 
            text-align: left; 
          }
          th { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            font-weight: 600;
          }
          tr:nth-child(even) { background-color: #f8f9fa; }
          tr:hover { background-color: #e9ecef; }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          .badge-success { background-color: #d4edda; color: #155724; }
          .badge-warning { background-color: #fff3cd; color: #856404; }
          .badge-danger { background-color: #f8d7da; color: #721c24; }
          .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
          }
          .cta-section h3 { margin-bottom: 10px; }
          .cta-section p { opacity: 0.9; margin-bottom: 20px; }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: white;
            color: #667eea;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 5px;
          }
          .footer { 
            text-align: center; 
            padding: 30px; 
            color: #999; 
            font-size: 12px; 
            background-color: #f8f9fa;
            border-top: 1px solid #dee2e6;
          }
          .footer p { margin: 5px 0; }
          @media only screen and (max-width: 600px) {
            .stats { grid-template-columns: 1fr; }
            .content { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 SkillOrbit Progress Report</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <div class="content">
            <div class="greeting">Hello ${req.user.name || 'User'}! 👋</div>
            <p class="intro">Here's your comprehensive skill development progress report. Keep up the great work on your learning journey!</p>
            
            <div class="stats">
              <div class="stat-card">
                <div class="stat-value">${skills.length}</div>
                <div class="stat-label">Total Skills</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${avgProficiency}%</div>
                <div class="stat-label">Avg Proficiency</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${expertSkills}</div>
                <div class="stat-label">Expert Skills</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${assessments.length}</div>
                <div class="stat-label">Assessments</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${avgScore}%</div>
                <div class="stat-label">Avg Score</div>
              </div>
            </div>
            
            ${skills.length > 0 ? `
            <h3 class="section-title">📈 Top Skills</h3>
            <table>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Category</th>
                  <th>Proficiency</th>
                </tr>
              </thead>
              <tbody>
                ${skills.slice(0, 5).map(skill => {
                  let badge = 'badge-danger';
                  if (skill.proficiency >= 80) badge = 'badge-success';
                  else if (skill.proficiency >= 60) badge = 'badge-warning';
                  
                  return `
                    <tr>
                      <td><strong>${skill.name}</strong></td>
                      <td>${skill.category || 'General'}</td>
                      <td><span class="badge ${badge}">${skill.proficiency}%</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            ` : '<p style="text-align: center; color: #999; padding: 20px;">No skills added yet. Start by adding your skills!</p>'}
            
            ${assessments.length > 0 ? `
            <h3 class="section-title">🎯 Recent Assessments</h3>
            <table>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${assessments.slice(0, 5).map(assessment => {
                  let badge = 'badge-danger';
                  if (assessment.score >= 80) badge = 'badge-success';
                  else if (assessment.score >= 60) badge = 'badge-warning';
                  
                  return `
                    <tr>
                      <td><strong>${assessment.skillName}</strong></td>
                      <td><span class="badge ${badge}">${assessment.score}%</span></td>
                      <td>${new Date(assessment.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            ` : ''}
            
            <div class="cta-section">
              <h3>🚀 Keep Growing!</h3>
              <p>Continue your learning journey on SkillOrbit</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/app/dashboard" class="button">View Dashboard</a>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/app/learning-path" class="button">Explore Learning Paths</a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <strong>💡 Pro Tip:</strong> Regular assessments help track your progress and identify areas for improvement. 
              Try to take at least one assessment per week to stay on track!
            </p>
          </div>
          
          <div class="footer">
            <p><strong>SkillOrbit</strong> - Your Skill Development Platform</p>
            <p>© ${new Date().getFullYear()} SkillOrbit. All rights reserved.</p>
            <p style="margin-top: 10px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: #667eea; text-decoration: none;">Visit Website</a> • 
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/app/profile" style="color: #667eea; text-decoration: none;">Manage Account</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Configure email transporter
    // For development, we'll use Ethereal (fake SMTP service)
    // For production, use Gmail, SendGrid, or other SMTP service
    let transporter;
    
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Production: Use configured SMTP server
      console.log('📧 Configuring email with Gmail SMTP...');
      console.log('   Host:', process.env.EMAIL_HOST);
      console.log('   User:', process.env.EMAIL_USER);
      console.log('   Port:', process.env.EMAIL_PORT || 587);
      
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // Use STARTTLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        },
        requireTLS: true,
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 60000,
        socketTimeout: 60000,
        pool: true
      });
      
      // Verify connection (skip verification, just attempt to send)
      console.log('⚠️ Skipping verification, will attempt direct send...');
    } else {
      // Missing email configuration
      console.error('❌ Email configuration missing!');
      console.error('   Required environment variables:');
      console.error('   - EMAIL_HOST:', process.env.EMAIL_HOST ? '✓' : '✗');
      console.error('   - EMAIL_USER:', process.env.EMAIL_USER ? '✓' : '✗');
      console.error('   - EMAIL_PASS:', process.env.EMAIL_PASS ? '✓' : '✗');
      
      return res.status(500).json({
        message: 'Email service is not configured. Please contact administrator.',
        error: 'Missing email configuration on server'
      });
    }

    // Send email
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"SkillOrbit" <noreply@skillorbit.com>',
        to: emailTo,
        subject: '📊 Your SkillOrbit Progress Report',
        html: emailContent
      });

      console.log('✅ Email sent successfully!');
      console.log('Message ID:', info.messageId);
      
      // Preview URL for Ethereal (development only)
      if (info.messageId && !process.env.EMAIL_HOST) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('📧 Preview URL:', previewUrl);
        
        res.json({
          message: `Report sent successfully to ${emailTo}`,
          success: true,
          previewUrl: previewUrl, // Only in development
          note: "Using test email service. In production, configure SMTP settings."
        });
      } else {
        res.json({
          message: `Report sent successfully to ${emailTo}`,
          success: true
        });
      }
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      console.error('   Error code:', emailError.code);
      console.error('   Error command:', emailError.command);
      
      // Provide user-friendly error message
      let userMessage = 'Failed to send email. ';
      if (emailError.code === 'EAUTH') {
        userMessage += 'Email authentication failed. Please contact administrator.';
      } else if (emailError.code === 'ETIMEDOUT' || emailError.code === 'ECONNECTION') {
        userMessage += 'Email server connection timeout. Please try again.';
      } else {
        userMessage += 'Please try again or contact support.';
      }
      
      return res.status(500).json({
        message: userMessage,
        error: emailError.message,
        success: false
      });
    }
  } catch (error) {
    console.error("Error emailing report:", error);
    res.status(500).json({ 
      message: error.message || "Error emailing report", 
      error: error.message,
      success: false
    });
  }
};
