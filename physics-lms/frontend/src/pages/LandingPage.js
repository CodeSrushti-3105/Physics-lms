import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Layers, ClipboardList, BookMarked, Lock, BarChart2, BookOpen, Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
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
        <Atom size={22} /> S.B.Classes
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
      <div className="footer-top">
        {/* Left — Brand */}
        <div className="footer-col">
          <div className="footer-brand">
            <Atom size={22} />
            <span>S.B.Classes</span>
          </div>
          <p className="footer-tagline">
            Empowering students through quality physics education. Learn, practice, and excel.
          </p>
          <div className="footer-contact">
            <a href="mailto:badshahshoaib824@gmail.com" className="footer-contact-item">
              <Mail size={15} /> badshahshoaib824@gmail.com
            </a>
            <a href="tel:+918830805768" className="footer-contact-item">
              <Phone size={15} /> +91 88308 05768
            </a>
          </div>
        </div>

        {/* Middle — Quick Links + Batch Timings */}
        <div className="footer-col">
          <div className="footer-section-title">Quick Links</div>
          <div className="footer-links">
            <Link to="/" className="footer-link"><ArrowRight size={13} /> Home</Link>
            <Link to="/login" className="footer-link"><ArrowRight size={13} /> Sign In</Link>
            <Link to="/register" className="footer-link"><ArrowRight size={13} /> Register</Link>
          </div>

          <div className="footer-section-title" style={{ marginTop: 24 }}>Batch Timings</div>
          <div className="footer-timings">
            <div className="footer-timing-row">
              <Clock size={13} />
              <div>
                <div className="timing-batch">11th Grade</div>
                <div className="timing-time">Mon · Wed · Fri — 4:00 PM to 6:00 PM</div>
              </div>
            </div>
            <div className="footer-timing-row">
              <Clock size={13} />
              <div>
                <div className="timing-batch">12th Grade</div>
                <div className="timing-time">Tue · Thu · Sat — 5:00 PM to 7:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Location + Map */}
        <div className="footer-col">
          <div className="footer-section-title">Our Location</div>
          <div className="footer-address">
            <MapPin size={15} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>Guruwarward, Malegaon,<br />Dist. Nashik, Maharashtra</span>
          </div>
          <div className="footer-map">
            <iframe
              title="S.B.Classes Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5!2d74.5249!3d20.5579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bde98b1b3b3b3b3%3A0x0!2sMalegaon%2C+Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="160"
              style={{ border: 0, borderRadius: 10, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2024 S.B.Classes — All rights reserved.</span>
        <span>Built for curious minds.</span>
      </div>
    </footer>
  </div>
);

export default LandingPage;
