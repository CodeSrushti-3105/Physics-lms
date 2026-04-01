import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardList, BarChart2, FlaskConical } from 'lucide-react';
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
    { path: '/student', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { section: 'Learning' },
    { path: '/student/materials', icon: <BookOpen size={16} />,      label: 'Study Materials', locked: !isApproved },
    { path: '/student/tests',     icon: <ClipboardList size={16} />, label: 'Tests',           locked: !isApproved },
    { path: '/student/results',   icon: <BarChart2 size={16} />,     label: 'My Results',      locked: !isApproved },
    { section: 'Tools' },
    { path: '/student/formulas',  icon: <FlaskConical size={16} />,  label: 'Formula Library' },
  ];

  return (
    <div className="dashboard">
      <Sidebar navItems={navItems} />
      <div className="main-content">
        <Routes>
          <Route index element={<StudentHome />} />
          <Route path="materials" element={<StudentMaterials />} />
          <Route path="tests"     element={<StudentTests />} />
          <Route path="tests/:id" element={<TakeTest />} />
          <Route path="results"   element={<StudentResults />} />
          <Route path="formulas"  element={<StudentFormulas />} />
          <Route path="*"         element={<Navigate to="/student" />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
