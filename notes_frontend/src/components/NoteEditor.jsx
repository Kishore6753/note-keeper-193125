import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function NoteEditor({ isOpen, note, onClose, onSave }) {
  /** Accessible modal editor for creating and editing notes. */
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [pinned, setPinned] = useState(!!note?.pinned);
  const [error, setError] = useState('');
  const initialFocusRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setPinned(!!note?.pinned);
    setError('');
  }, [note, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // focus first input
      setTimeout(() => { initialFocusRef.current?.focus(); }, 0);
      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
        }
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submit = () => {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    onSave({ title: title.trim(), content, pinned });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="note-editor-title">
      <div className="modal" ref={dialogRef}>
        <div className="modal-header">
          <div id="note-editor-title" style={{ fontWeight: 800 }}>
            {note ? 'Edit Note' : 'New Note'}
          </div>
          <button className="btn ghost" onClick={onClose} aria-label="Close editor">✖</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <label>
              <span className="visually-hidden">Title</span>
              <input
                ref={initialFocusRef}
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                aria-invalid={!!error}
                aria-describedby={error ? 'title-error' : undefined}
              />
            </label>
            {error && (
              <div id="title-error" style={{ color: 'var(--color-error)', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            <label>
              <span className="visually-hidden">Content</span>
              <textarea
                className="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
              />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                aria-label="Pin this note"
              />
              <span>Pin</span>
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn ghost" onClick={onClose} aria-label="Cancel">Cancel</button>
          <button className="btn" onClick={submit} aria-label="Save note">Save</button>
        </div>
      </div>
    </div>
  );
}
