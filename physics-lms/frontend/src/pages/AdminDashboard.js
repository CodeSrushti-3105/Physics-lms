import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AdminHome from './admin/AdminHome';
import AdminStudents from './admin/AdminStudents';
import AdminMaterials from './admin/AdminMaterials';
import AdminTests from './admin/AdminTests';
import AdminResults from './admin/AdminResults';
import api from '../utils/api';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    api.get('/admin/students/pending').then(r => setPendingCount(r.data.length)).catch(() => {});
  }, []);

  const navItems = [
    { section: 'Overview' },
    { path: '/admin', icon: '🏠', label: 'Dashboard' },
    { section: 'Students' },
    { path: '/admin/students', icon: '👥', label: 'Students', badge: pendingCount },
    { section: 'Content' },
    { path: '/admin/materials', icon: '📚', label: 'Materials' },
    { path: '/admin/tests', icon: '📝', label: 'Tests' },
    { section: 'Analytics' },
    { path: '/admin/results', icon: '📊', label: 'Results' },
  ];

  return (
    <div className="dashboard">
      <Sidebar navItems={navItems} />
      <div className="main-content">
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="students" element={<AdminStudents onApproval={() => setPendingCount(p => Math.max(0, p - 1))} />} />
          <Route path="materials" element={<AdminMaterials />} />
          <Route path="tests" element={<AdminTests />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
