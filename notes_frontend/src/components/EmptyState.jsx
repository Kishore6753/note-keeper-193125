import React from 'react';

// PUBLIC_INTERFACE
export default function EmptyState({ onCreate }) {
  /** Empty state when no notes match */
  return (
    <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem' }}>📝</div>
      <h2 style={{ margin: '0.5rem 0' }}>No notes yet</h2>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>
        Get started by creating your first note.
      </p>
      <button className="btn" onClick={onCreate} aria-label="Create your first note">Create Note</button>
    </div>
  );
}
