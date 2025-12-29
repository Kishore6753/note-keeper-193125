/**
 * Simple REST client for notes with localStorage fallback.
 * If REACT_APP_API_BASE is falsy/empty, use localStorage-based async store.
 */

const API_BASE = (process.env.REACT_APP_API_BASE || '').trim();

const STORAGE_KEY = 'notes_keeper_items_v1';

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeStore(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

async function ls_getNotes() {
  await sleep(40);
  return readStore().sort((a, b) => (b.pinned === true) - (a.pinned === true) || b.updatedAt - a.updatedAt);
}

async function ls_createNote(note) {
  await sleep(40);
  const items = readStore();
  items.push(note);
  writeStore(items);
  return note;
}

async function ls_updateNote(id, patch) {
  await sleep(40);
  const items = readStore();
  const idx = items.findIndex((n) => n.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...patch };
    writeStore(items);
    return items[idx];
  }
  throw new Error('Not found');
}

async function ls_deleteNote(id) {
  await sleep(40);
  const items = readStore();
  const next = items.filter((n) => n.id !== id);
  writeStore(next);
  return { ok: true };
}

// PUBLIC_INTERFACE
export async function getNotes() {
  /** Fetch all notes - falls back to localStorage if API_BASE is not configured. */
  if (!API_BASE) return ls_getNotes();
  const res = await fetch(`${API_BASE}/notes`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a note - falls back to localStorage if API_BASE is not configured. */
  if (!API_BASE) return ls_createNote(payload);
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update a note - falls back to localStorage if API_BASE is not configured. */
  if (!API_BASE) return ls_updateNote(id, payload);
  const res = await fetch(`${API_BASE}/notes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note - falls back to localStorage if API_BASE is not configured. */
  if (!API_BASE) return ls_deleteNote(id);
  const res = await fetch(`${API_BASE}/notes/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete note');
  return { ok: true };
}
