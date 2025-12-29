import React from 'react';
import './styles/globals.css';
import './styles/theme.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import { NotesProvider, useNotes } from './store/notesStore';

/**
 * Root content wiring the header, sidebar, list and editor modal.
 */
function AppContent() {
  const {
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
  } = useNotes();

  return (
    <div className={`app-shell`} data-theme={theme}>
      <Header
        search={search}
        onSearchChange={setSearch}
        onNewNote={() => openEditor(null)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="layout">
        <Sidebar
          active={filter}
          onChange={setFilter}
        />
        <main className="main">
          {filteredNotes.length === 0 ? (
            <EmptyState onCreate={() => openEditor(null)} />
          ) : (
            <NotesList
              notes={filteredNotes}
              onEdit={(n) => openEditor(n)}
              onDelete={removeNote}
              onTogglePin={togglePin}
            />
          )}
        </main>
      </div>

      <NoteEditor
        isOpen={editorOpen}
        note={editingNote}
        onClose={closeEditor}
        onSave={(payload) => {
          if (editingNote) {
            updateNote(editingNote.id, payload);
          } else {
            createNote(payload);
          }
          closeEditor();
        }}
      />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App root wrapped in NotesProvider */
  return (
    <NotesProvider>
      <AppContent />
    </NotesProvider>
  );
}

export default App;
