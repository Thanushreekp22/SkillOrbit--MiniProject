import { Skill, Assessment, Analysis } from "../models/index.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";

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
    }

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
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 20px; }
          .stats { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
          .stat-card { background: #f4f4f4; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px; }
          .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
          .stat-label { color: #666; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #667eea; color: white; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 SkillOrbit Progress Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="content">
          <h2>Hello ${req.user.name || 'User'}!</h2>
          <p>Here's your comprehensive skill development progress report.</p>
          
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
          
          <h3>📈 Top Skills</h3>
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Category</th>
                <th>Proficiency</th>
              </tr>
            </thead>
            <tbody>
              ${skills.slice(0, 5).map(skill => `
                <tr>
                  <td>${skill.name}</td>
                  <td>${skill.category || 'N/A'}</td>
                  <td>${skill.proficiency}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          ${assessments.length > 0 ? `
          <h3>🎯 Recent Assessments</h3>
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${assessments.slice(0, 5).map(assessment => `
                <tr>
                  <td>${assessment.skillName}</td>
                  <td>${assessment.score}%</td>
                  <td>${new Date(assessment.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : ''}
          
          <p style="margin-top: 30px;">
            <strong>Keep up the great work!</strong> Continue learning and improving your skills.
          </p>
        </div>
        
        <div class="footer">
          <p>This report was generated by SkillOrbit - Your Skill Development Platform</p>
          <p>© ${new Date().getFullYear()} SkillOrbit. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // In a real application, you would use a service like SendGrid, Nodemailer, etc.
    // For now, we'll simulate the email sending and return success
    console.log(`Email would be sent to: ${emailTo}`);
    console.log(`Email content length: ${emailContent.length} characters`);

    // TODO: Implement actual email sending with nodemailer or similar service
    // Example with nodemailer:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({
    //   from: 'noreply@skillorbit.com',
    //   to: emailTo,
    //   subject: 'Your SkillOrbit Progress Report',
    //   html: emailContent
    // });

    res.json({
      message: `Report will be sent to ${emailTo}`,
      success: true,
      note: "Email functionality requires SMTP configuration. Please set up nodemailer in production."
    });
  } catch (error) {
    console.error("Error emailing report:", error);
    res.status(500).json({ 
      message: "Error emailing report", 
      error: error.message 
    });
  }
};
