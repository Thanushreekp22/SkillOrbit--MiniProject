import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  CircularProgress,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Skills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get(`/skills?userId=${user._id}`);
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProficiencyLevel = (proficiency) => {
    if (proficiency >= 80) return { level: 'Expert', color: 'success' };
    if (proficiency >= 60) return { level: 'Advanced', color: 'info' };
    if (proficiency >= 40) return { level: 'Intermediate', color: 'warning' };
    return { level: 'Beginner', color: 'error' };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          My Skills
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* TODO: Open add skill dialog */}}
        >
          Add Skill
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Skill Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Proficiency</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No skills added yet. Click "Add Skill" to get started!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              skills.map((skill) => {
                const { level, color } = getProficiencyLevel(skill.proficiency);
                return (
                  <TableRow key={skill._id}>
                    <TableCell>{skill.name}</TableCell>
                    <TableCell>{skill.category || 'Uncategorized'}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <LinearProgress
                          variant="determinate"
                          value={skill.proficiency}
                          sx={{ width: 100, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2">{skill.proficiency}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={level} color={color} size="small" />
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => {/* TODO: Edit skill */}}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Skills;
