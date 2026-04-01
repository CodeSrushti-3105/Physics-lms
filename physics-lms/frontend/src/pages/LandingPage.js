import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Layers, ClipboardList, BookMarked, Lock, BarChart2, BookOpen } from 'lucide-react';
import '../styles/landing.css';

const features = [
  { icon: <Layers size={26} />,       title: 'Batch-wise Learning', desc: 'Separate content streams for 11th and 12th grade students. Every resource is precisely targeted.' },
  { icon: <ClipboardList size={26} />, title: 'Interactive Tests',   desc: 'Timed MCQ tests with instant scoring and detailed performance analytics.' },
  { icon: <BookMarked size={26} />,    title: 'Formula Library',     desc: 'Quick-access physics formula reference tool covering all major topics.' },
  { icon: <Lock size={26} />,          title: 'Secure Access',       desc: 'Admin-controlled student approval system ensures only verified students get access.' },
  { icon: <BarChart2 size={26} />,     title: 'Result Tracking',     desc: 'Students can track their test history and performance over time.' },
  { icon: <BookOpen size={26} />,      title: 'Study Materials',     desc: 'Organized notes, links, and resources uploaded directly by your teacher.' },
];

const LandingPage = () => (
  <div className="landing">
    <nav className="landing-nav">
      <div className="nav-logo">
        <Atom size={22} /> PhysicsLab
      </div>
      <div className="nav-links">
        <Link to="/login" className="btn btn-outline">Sign In</Link>
        <Link to="/register" className="btn btn-primary">Get Started</Link>
      </div>
    </nav>

    <section className="hero">
      <div className="hero-grid" />
      <div className="particles">
        {[...Array(6)].map((_, i) => <div key={i} className="particle" />)}
      </div>
      <div className="particles">
        <div className="formula">F = ma</div>
        <div className="formula">E = mc²</div>
        <div className="formula">v = u + at</div>
        <div className="formula">λ = h/mv</div>
        <div className="formula">∇·E = ρ/ε₀</div>
      </div>
      <div className="hero-content">
        <div className="hero-badge">
          <div className="dot" />
          Physics Learning Management System
        </div>
        <h1 className="hero-title">
          Master Physics with<br />
          <span className="gradient-text">Precision & Clarity</span>
        </h1>
        <p className="hero-subtitle">
          A dedicated platform for 11th and 12th grade physics students.
          Access materials, take tests, and track your progress — all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">Join as Student</Link>
          <Link to="/login" className="btn btn-outline">Teacher Login</Link>
        </div>
      </div>
    </section>

    <section className="features">
      <div className="section-header">
        <div className="section-tag">Features</div>
        <h2 className="section-title">Everything you need to excel</h2>
        <p className="section-subtitle">Built specifically for physics education with tools that actually matter.</p>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <footer className="landing-footer">
      <p>© 2024 PhysicsLab LMS — Built for curious minds.</p>
    </footer>
  </div>
);

export default LandingPage;
