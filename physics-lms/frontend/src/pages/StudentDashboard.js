import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StudentHome from './student/StudentHome';
import StudentMaterials from './student/StudentMaterials';
import StudentTests from './student/StudentTests';
import StudentResults from './student/StudentResults';
import StudentFormulas from './student/StudentFormulas';
import TakeTest from './student/TakeTest';
import '../styles/dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const isApproved = user?.status === 'approved';

  const navItems = [
    { section: 'Overview' },
    { path: '/student', icon: '🏠', label: 'Dashboard' },
    { section: 'Learning' },
    { path: '/student/materials', icon: '📚', label: 'Study Materials', locked: !isApproved },
    { path: '/student/tests', icon: '📝', label: 'Tests', locked: !isApproved },
    { path: '/student/results', icon: '📊', label: 'My Results', locked: !isApproved },
    { section: 'Tools' },
    { path: '/student/formulas', icon: '🔬', label: 'Formula Library' },
  ];

  return (
    <div className="dashboard">
      <Sidebar navItems={navItems} />
      <div className="main-content">
        <Routes>
          <Route index element={<StudentHome />} />
          <Route path="materials" element={<StudentMaterials />} />
          <Route path="tests" element={<StudentTests />} />
          <Route path="tests/:id" element={<TakeTest />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="formulas" element={<StudentFormulas />} />
          <Route path="*" element={<Navigate to="/student" />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
