import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import DomainDetails from './pages/DomainDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashboardNew';
import Skills from './pages/SkillsEnhanced';
import Assessment from './pages/Assessment';
import Roles from './pages/RolesEnhanced';
import Analysis from './pages/AnalysisEnhanced';
import LearningPath from './pages/LearningPathUnified';
import Progress from './pages/ProgressEnhanced';
import Reports from './pages/ReportsEnhanced';
import Profile from './pages/Profile';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminQuestions from './pages/AdminQuestions';
import AdminUsers from './pages/AdminUsers';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/domain/:domainName" element={<DomainDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/questions" element={<AdminProtectedRoute><AdminQuestions /></AdminProtectedRoute>} />
              <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
              
              {/* Protected Routes */}
              <Route path="/app" element={<ProtectedRoute><Navbar /></ProtectedRoute>}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="skills" element={<Skills />} />
                <Route path="assessment" element={<Assessment />} />
                <Route path="roles" element={<Roles />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="learning-path" element={<LearningPath />} />
                <Route path="progress" element={<Progress />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
            
            {/* Toast notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
