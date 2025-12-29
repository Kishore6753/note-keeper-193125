import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from '../utils/id';
import { getNotes as apiGet, createNote as apiCreate, updateNote as apiUpdate, deleteNote as apiDelete } from '../services/api';

const NotesContext = createContext(null);

const THEME_KEY = 'notes_keeper_theme';

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}

const initialFilters = {
  search: '',
  filter: 'all', // all | pinned | recent
};

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** Provides notes state with actions and filtering */
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState(initialFilters.search);
  const [filter, setFilter] = useState(initialFilters.filter);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const isMounted = useRef(true);

  const { theme, toggleTheme } = useTheme();

  // Load initial notes
  useEffect(() => {
    isMounted.current = true;
    (async () => {
      try {
        const data = await apiGet();
        if (isMounted.current) setNotes(data);
      } catch {
        if (isMounted.current) setNotes([]);
      }
    })();
    return () => { isMounted.current = false; };
  }, []);

  const openEditor = useCallback((note) => {
    setEditingNote(note);
    setEditorOpen(true);
  }, []);
  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setEditingNote(null);
  }, []);

  const createNote = useCallback(async ({ title, content, pinned = false }) => {
    const now = Date.now();
    const item = { id: nanoid(), title, content, pinned, createdAt: now, updatedAt: now };
    await apiCreate(item);
    setNotes((prev) => [item, ...prev]);
  }, []);

  const updateNote = useCallback(async (id, patch) => {
    const now = Date.now();
    await apiUpdate(id, { ...patch, updatedAt: now });
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: now } : n))
    );
  }, []);

  const removeNote = useCallback(async (id) => {
    await apiDelete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const togglePin = useCallback(async (id) => {
    const target = notes.find((n) => n.id === id);
    if (!target) return;
    const next = !target.pinned;
    await apiUpdate(id, { pinned: next, updatedAt: Date.now() });
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: next } : n)));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = [...notes];

    if (query) {
      list = list.filter(
        (n) =>
          (n.title || '').toLowerCase().includes(query) ||
          (n.content || '').toLowerCase().includes(query)
      );
    }

    if (filter === 'pinned') {
      list = list.filter((n) => n.pinned);
    } else if (filter === 'recent') {
      list = list.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 20);
    } else {
      // all
      list = list.sort(
        (a, b) => (b.pinned === true) - (a.pinned === true) || b.updatedAt - a.updatedAt
      );
    }

    return list;
  }, [notes, search, filter]);

  const value = {
    notes,
    filteredNotes,
    search,
    setSearch,
    filter,
    setFilter,
    openEditor,
    closeEditor,
    editorOpen,
    editingNote,
    createNote,
    updateNote,
    removeNote,
    togglePin,
    theme,
    toggleTheme,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** Hook to access the Notes store context. */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
