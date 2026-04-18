import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardList, BarChart2, FlaskConical, Bell, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StudentHome from './student/StudentHome';
import StudentMaterials from './student/StudentMaterials';
import StudentTests from './student/StudentTests';
import StudentResults from './student/StudentResults';
import StudentFormulas from './student/StudentFormulas';
import StudentAnnouncements from './student/StudentAnnouncements';
import StudentProgress from './student/StudentProgress';
import TakeTest from './student/TakeTest';
import api from '../utils/api';
import '../styles/dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const isApproved = user?.status === 'approved';
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch unread count
    const fetchUnreadCount = () => {
      api.get('/announcements/unread-count')
        .then(r => {
          console.log('Unread count:', r.data.count);
          setUnreadCount(r.data.count);
        })
        .catch(err => {
          console.error('Failed to fetch unread count:', err);
        });
    };

    fetchUnreadCount();

    // Poll every 30 seconds for new announcements
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { section: 'Overview' },
    { path: '/student', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { path: '/student/announcements', icon: <Bell size={16} />, label: 'Announcements', badge: unreadCount },
    { path: '/student/progress', icon: <TrendingUp size={16} />, label: 'My Progress', locked: !isApproved },
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
          <Route path="announcements" element={<StudentAnnouncements onRead={() => setUnreadCount(0)} />} />
          <Route path="progress" element={<StudentProgress />} />
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
