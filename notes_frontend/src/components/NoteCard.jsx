import React from 'react';
import { formatDate } from '../utils/formatDate';

// PUBLIC_INTERFACE
export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  /** Single note card with pin, edit and delete actions */
  const content = note?.content || '';
  const snippet = content.slice(0, 140) + (content.length > 140 ? '…' : '');

  return (
    <article className="card note-card" role="article" aria-label={`Note ${note.title || '(untitled)'}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div className="note-title">{note.title || '(untitled)'}</div>
        <div className="note-actions">
          <button
            className="btn ghost"
            aria-pressed={!!note.pinned}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            onClick={() => onTogglePin(note.id)}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            📌
          </button>
          <button className="btn ghost" onClick={() => onEdit(note)} aria-label="Edit note">✏️</button>
          <button
            className="btn danger"
            onClick={() => {
              const ok = window.confirm('Delete this note? This action cannot be undone.');
              if (ok) onDelete(note.id);
            }}
            aria-label="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="note-snippet">{snippet || <span className="badge">No content</span>}</div>
      <div className="note-meta">
        <span>Updated {formatDate(note.updatedAt)}</span>
        {note.pinned && <span className="chip">Pinned</span>}
      </div>
    </article>
  );
}
