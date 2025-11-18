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

    // Create PDF document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="skillorbit-report-${Date.now()}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add gradient-like header background (using rectangles)
    doc.rect(0, 0, doc.page.width, 150).fill('#667eea');
    
    // Header
    doc.fillColor('#ffffff')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('SkillOrbit Progress Report', 50, 50, { align: 'center' });
    
    doc.fontSize(12)
       .font('Helvetica')
       .text(`Generated on ${new Date().toLocaleDateString()}`, 50, 90, { align: 'center' });
    
    doc.fontSize(14)
       .text(`Report for: ${req.user.name || 'User'}`, 50, 110, { align: 'center' });

    // Reset text color and move down
    doc.fillColor('#333333');
    doc.moveDown(4);

    // Summary Statistics Section
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#667eea')
       .text('📊 Summary Statistics', 50, 180);
    
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').fillColor('#333333');

    const statsY = 210;
    const statBoxWidth = 120;
    const statBoxHeight = 70;
    const gap = 15;

    // Draw stat boxes
    const stats = [
      { label: 'Total Skills', value: skills.length, color: '#667eea' },
      { label: 'Avg Proficiency', value: `${avgProficiency}%`, color: '#48bb78' },
      { label: 'Expert Skills', value: expertSkills, color: '#ed8936' },
      { label: 'Assessments', value: assessments.length, color: '#4299e1' }
    ];

    stats.forEach((stat, index) => {
      const x = 50 + (index * (statBoxWidth + gap));
      
      // Box background
      doc.roundedRect(x, statsY, statBoxWidth, statBoxHeight, 5)
         .fillAndStroke('#f7fafc', '#e2e8f0');
      
      // Value
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .fillColor(stat.color)
         .text(stat.value.toString(), x, statsY + 15, { 
           width: statBoxWidth, 
           align: 'center' 
         });
      
      // Label
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#666666')
         .text(stat.label, x, statsY + 45, { 
           width: statBoxWidth, 
           align: 'center' 
         });
    });

    doc.moveDown(6);

    // Skills Section
    if (skills.length > 0) {
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .fillColor('#667eea')
         .text('🎯 Top Skills', 50, doc.y + 20);
      
      doc.moveDown(0.5);
      
      // Table header
      const tableTop = doc.y + 10;
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#ffffff');
      
      doc.rect(50, tableTop, 500, 25).fill('#667eea');
      
      doc.text('Skill Name', 60, tableTop + 8, { width: 200 });
      doc.text('Category', 270, tableTop + 8, { width: 100 });
      doc.text('Proficiency', 380, tableTop + 8, { width: 80 });
      doc.text('Assessments', 470, tableTop + 8, { width: 70 });

      // Table rows
      doc.font('Helvetica').fillColor('#333333');
      let currentY = tableTop + 25;
      
      skills.slice(0, 10).forEach((skill, index) => {
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }

        const skillAssessments = assessments.filter(a => 
          a.skillName && skill.name && 
          a.skillName.toLowerCase() === skill.name.toLowerCase()
        );

        // Alternate row colors
        if (index % 2 === 0) {
          doc.rect(50, currentY, 500, 25).fill('#f7fafc');
        }

        doc.fillColor('#333333')
           .text(skill.name, 60, currentY + 8, { width: 200 });
        doc.text(skill.category || 'N/A', 270, currentY + 8, { width: 100 });
        doc.text(`${skill.proficiency}%`, 380, currentY + 8, { width: 80 });
        doc.text(skillAssessments.length.toString(), 470, currentY + 8, { width: 70 });

        currentY += 25;
      });

      doc.moveDown(2);
    }

    // Recent Assessments Section
    if (assessments.length > 0) {
      const assessmentY = doc.y + 30;
      
      if (assessmentY > 650) {
        doc.addPage();
      }

      doc.fontSize(18)
         .font('Helvetica-Bold')
         .fillColor('#667eea')
         .text('📝 Recent Assessments', 50, doc.y + 20);
      
      doc.moveDown(0.5);
      
      // Table header
      const tableTop = doc.y + 10;
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#ffffff');
      
      doc.rect(50, tableTop, 500, 25).fill('#667eea');
      
      doc.text('Skill', 60, tableTop + 8, { width: 180 });
      doc.text('Score', 250, tableTop + 8, { width: 60 });
      doc.text('Difficulty', 320, tableTop + 8, { width: 80 });
      doc.text('Date', 410, tableTop + 8, { width: 130 });

      // Table rows
      doc.font('Helvetica').fillColor('#333333');
      let currentY = tableTop + 25;
      
      assessments.slice(0, 8).forEach((assessment, index) => {
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }

        // Alternate row colors
        if (index % 2 === 0) {
          doc.rect(50, currentY, 500, 25).fill('#f7fafc');
        }

        doc.fillColor('#333333')
           .text(assessment.skillName || 'N/A', 60, currentY + 8, { width: 180 });
        doc.text(`${assessment.score}%`, 250, currentY + 8, { width: 60 });
        doc.text(assessment.difficulty || 'N/A', 320, currentY + 8, { width: 80 });
        doc.text(new Date(assessment.createdAt).toLocaleDateString(), 410, currentY + 8, { width: 130 });

        currentY += 25;
      });

      doc.moveDown(2);
    }

    // Category Breakdown Section
    if (skills.length > 0) {
      if (doc.y > 650) {
        doc.addPage();
      }

      doc.fontSize(18)
         .font('Helvetica-Bold')
         .fillColor('#667eea')
         .text('📊 Skills by Category', 50, doc.y + 20);
      
      doc.moveDown(1);

      const categories = {};
      skills.forEach(skill => {
        const cat = skill.category || 'Other';
        categories[cat] = (categories[cat] || 0) + 1;
      });

      Object.keys(categories).forEach((category, index) => {
        if (doc.y > 700) {
          doc.addPage();
        }

        const count = categories[category];
        const percentage = Math.round((count / skills.length) * 100);

        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#333333')
           .text(`${category}: ${count} skills (${percentage}%)`, 70, doc.y + 5);

        // Progress bar
        const barY = doc.y + 5;
        const barWidth = 300;
        const filledWidth = (percentage / 100) * barWidth;

        // Background bar
        doc.rect(70, barY, barWidth, 10)
           .fillAndStroke('#e0e0e0', '#cccccc');

        // Filled bar
        doc.rect(70, barY, filledWidth, 10)
           .fill('#667eea');

        doc.moveDown(1);
      });
    }

    // Insights Section
    if (doc.y > 650) {
      doc.addPage();
    }

    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#667eea')
       .text('💡 Insights & Recommendations', 50, doc.y + 20);
    
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').fillColor('#333333');

    // Generate insights
    const insights = [];
    
    if (avgProficiency >= 80) {
      insights.push('✓ Excellent overall proficiency! You\'re doing great across all skills.');
    } else if (avgProficiency >= 60) {
      insights.push('✓ Good progress! Focus on practicing weaker skills to reach expert level.');
    } else {
      insights.push('• Consider dedicating more time to skill development and practice.');
    }

    if (expertSkills > 0) {
      insights.push(`✓ You have ${expertSkills} expert-level skill${expertSkills > 1 ? 's' : ''}. Great job!`);
    }

    if (assessments.length > 0) {
      insights.push(`✓ You've completed ${assessments.length} assessment${assessments.length > 1 ? 's' : ''}. Keep testing your knowledge!`);
    } else {
      insights.push('• Take skill assessments to validate your proficiency levels.');
    }

    if (avgScore > 0 && avgScore >= 80) {
      insights.push(`✓ Your assessment average of ${avgScore}% shows strong understanding.`);
    } else if (avgScore > 0) {
      insights.push(`• Your assessment average is ${avgScore}%. Review concepts to improve scores.`);
    }

    insights.forEach(insight => {
      doc.text(`  ${insight}`, 70, doc.y + 10);
      doc.moveDown(0.5);
    });
    
    doc.moveDown(1);

    // Recommendations
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#667eea')
       .text('Next Steps:', 70, doc.y + 10);
    
    doc.fontSize(11).font('Helvetica').fillColor('#333333');
    doc.text('1. Continue taking assessments to track your progress', 70, doc.y + 10);
    doc.text('2. Focus on skills with proficiency below 70%', 70, doc.y + 5);
    doc.text('3. Explore learning paths for your target roles', 70, doc.y + 5);
    doc.text('4. Practice regularly to maintain and improve your skills', 70, doc.y + 5);
    

    // Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.fontSize(8)
         .fillColor('#999999')
         .text(
           `Page ${i + 1} of ${pageCount} | © ${new Date().getFullYear()} SkillOrbit - Your Skill Development Platform`,
           50,
           doc.page.height - 50,
           { align: 'center', width: doc.page.width - 100 }
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
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      // Development: Create test account with Ethereal
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('📧 Using Ethereal test email account:', testAccount.user);
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
      throw new Error(`Failed to send email: ${emailError.message}`);
    }
  } catch (error) {
    console.error("Error emailing report:", error);
    res.status(500).json({ 
      message: "Error emailing report", 
      error: error.message 
    });
  }
};
