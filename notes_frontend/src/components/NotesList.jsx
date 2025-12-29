import React from 'react';
import NoteCard from './NoteCard';

// PUBLIC_INTERFACE
export default function NotesList({ notes, onEdit, onDelete, onTogglePin }) {
  /** Grid of note cards */
  return (
    <section aria-label="Notes list" className="grid">
      {notes.map((n) => (
        <div key={n.id} style={{ display: 'contents' }}>
          <NoteCard
            note={n}
            onEdit={onEdit}
            onDelete={onDelete}
            onTogglePin={onTogglePin}
          />
        </div>
      ))}
    </section>
  );
}
