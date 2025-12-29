import React from 'react';

// PUBLIC_INTERFACE
export default function Sidebar({ active, onChange }) {
  /** Sidebar with filters; collapses on small screens via CSS (hidden) */
  return (
    <aside className="sidebar" aria-label="Filters">
      <div className="section-title">Filters</div>
      <nav className="nav" aria-label="Note filters">
        <button
          aria-current={active === 'all' ? 'true' : 'false'}
          onClick={() => onChange('all')}
          aria-label="Show all notes"
        >
          All notes
        </button>
        <button
          aria-current={active === 'pinned' ? 'true' : 'false'}
          onClick={() => onChange('pinned')}
          aria-label="Show pinned notes"
        >
          Pinned
        </button>
        <button
          aria-current={active === 'recent' ? 'true' : 'false'}
          onClick={() => onChange('recent')}
          aria-label="Show recent notes"
        >
          Recent
        </button>
      </nav>
    </aside>
  );
}
