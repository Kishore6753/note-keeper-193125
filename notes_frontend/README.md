# Note Keeper - Ocean Professional

A single-page React app to create, view, edit, pin, search and delete notes. Works entirely client-side via localStorage, and can optionally use a backend if REACT_APP_API_BASE is set.

## Features
- CRUD notes with title/content, timestamps, and pin/favorite
- Search across title and content; filters: All, Pinned, Recent
- Confirm before delete, basic validation (non-empty title)
- Ocean Professional theme with light/dark toggle
- LocalStorage persistence with async-like API; auto-fallback when no backend

## Env
- REACT_APP_API_BASE: optional base URL for REST endpoints:
  - GET /notes
  - POST /notes
  - PUT /notes/:id
  - DELETE /notes/:id

If unset or empty, the app uses localStorage.

## Scripts
- npm start
- npm test
- npm run build

## Notes
No backend is required. If you later add one, set REACT_APP_API_BASE and the app will use it automatically.
