import React, { useState } from 'react';

const formulas = [
  { name: "Newton's Second Law", eq: 'F = ma', desc: 'Force equals mass times acceleration', topic: 'Mechanics' },
  { name: 'Kinematic Equation 1', eq: 'v = u + at', desc: 'Final velocity with constant acceleration', topic: 'Mechanics' },
  { name: 'Kinematic Equation 2', eq: 's = ut + ½at²', desc: 'Displacement with initial velocity', topic: 'Mechanics' },
  { name: 'Kinematic Equation 3', eq: 'v² = u² + 2as', desc: 'Velocity-displacement relation', topic: 'Mechanics' },
  { name: "Einstein's Mass-Energy", eq: 'E = mc²', desc: 'Mass-energy equivalence', topic: 'Modern Physics' },
  { name: 'Gravitational Force', eq: 'F = Gm₁m₂/r²', desc: "Newton's law of gravitation", topic: 'Gravitation' },
  { name: 'Coulomb\'s Law', eq: 'F = kq₁q₂/r²', desc: 'Electrostatic force between charges', topic: 'Electrostatics' },
  { name: 'Ohm\'s Law', eq: 'V = IR', desc: 'Voltage, current, resistance relation', topic: 'Electricity' },
  { name: 'Power', eq: 'P = VI = I²R', desc: 'Electrical power dissipation', topic: 'Electricity' },
  { name: 'Wave Speed', eq: 'v = fλ', desc: 'Wave speed, frequency, wavelength', topic: 'Waves' },
  { name: 'de Broglie Wavelength', eq: 'λ = h/mv', desc: 'Matter wave wavelength', topic: 'Modern Physics' },
  { name: 'Snell\'s Law', eq: 'n₁sinθ₁ = n₂sinθ₂', desc: 'Refraction at interface', topic: 'Optics' },
  { name: 'Lens Formula', eq: '1/f = 1/v - 1/u', desc: 'Thin lens equation', topic: 'Optics' },
  { name: 'Kinetic Energy', eq: 'KE = ½mv²', desc: 'Energy of motion', topic: 'Mechanics' },
  { name: 'Potential Energy', eq: 'PE = mgh', desc: 'Gravitational potential energy', topic: 'Mechanics' },
  { name: 'Bohr\'s Energy Level', eq: 'Eₙ = -13.6/n² eV', desc: 'Hydrogen atom energy levels', topic: 'Modern Physics' },
];

const topics = ['All', ...new Set(formulas.map(f => f.topic))];

const StudentFormulas = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = formulas.filter(f =>
    (filter === 'All' || f.topic === filter) &&
    (f.name.toLowerCase().includes(search.toLowerCase()) || f.eq.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Formula Library</div>
          <div className="topbar-subtitle">Quick reference for all key physics formulas</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Search formulas..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 14, outline: 'none', width: 220 }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {topics.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-outline'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="formula-grid">
        {filtered.map((f, i) => (
          <div className="formula-item" key={i}>
            <div className="formula-name">{f.name}</div>
            <div className="formula-eq">{f.eq}</div>
            <div className="formula-desc">{f.desc}</div>
            <div style={{ marginTop: 8 }}>
              <span className="badge badge-batch" style={{ fontSize: 10 }}>{f.topic}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state"><div className="empty-icon">🔬</div><p>No formulas match your search.</p></div>
      )}
    </div>
  );
};

export default StudentFormulas;
