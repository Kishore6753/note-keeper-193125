import React from 'react';

// PUBLIC_INTERFACE
export default function Header({ search, onSearchChange, onNewNote, theme, onToggleTheme }) {
  /** App header with title, search, new note, and theme toggle */
  return (
    <header className="header gradient-soft" role="banner">
      <div className="header-inner">
        <div className="brand" aria-label="Note Keeper">
          <div className="brand-badge" aria-hidden="true" />
          <div>
            <div style={{ fontSize: '1rem' }}>Note Keeper</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Ocean Professional</div>
          </div>
        </div>
        <label className="header-search" aria-label="Search notes">
          <span role="img" aria-label="search">🔎</span>
          <input
            className="input"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search notes by title or content"
          />
        </label>
        <div className="header-actions">
          <button className="btn" onClick={onNewNote} aria-label="Create new note">
            ＋ New Note
          </button>
          <button className="btn ghost" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
}
