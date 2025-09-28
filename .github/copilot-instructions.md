## Purpose
Short, actionable guidance for AI coding agents working on this Express + Mongoose backend (WTWR).

Keep changes minimal and follow existing naming and response-shape conventions. Reference these files when unsure: `app.js`, `package.json`, `routes/*`, `controllers/*`, `models/*`, `utils/errors.js`, `README.md`.

## Big picture
- This is an Express server using Mongoose for MongoDB (`mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')` in `app.js`).
- Typical request flow: request -> `routes/*.js` -> `controllers/*` -> `models/*` -> MongoDB -> controller sends JSON response.
- Controllers consistently return JSON shaped as `{ data: ... }` on success and `{ message: ... }` on error. Preserve that shape.

## Key files & patterns (explicit examples)
- Route files: `routes/users.js` defines endpoints and imports controllers (example: `router.get('/users', getUsers)`).
- Controllers: each controller exports functions with signature `(req, res)` and uses model methods returning promises; successful responses use `res.send({data: ...})`. See `controllers/users.js` and `controllers/clothingItems.js` for examples.
- Models: Mongoose schemas live in `models/*.js` and are exported with `module.exports = mongoose.model('<name>', <schema>)` (e.g., `models/user.js`, `models/clothingItem.js`).
- Utils: `utils/errors.js` exists as a placeholder for custom errors; currently unused/empty — prefer to keep 500/err.message handling unless you add and wire custom errors.

## Developer workflows
- Start server: `npm run start` (uses `node app.js`).
- Dev with auto-reload: `npm run dev` (uses `nodemon app.js`).
- Lint: `npm run lint` -> runs `npx eslint .`.
- Local DB: The app expects a local MongoDB accessible at `mongodb://127.0.0.1:27017/wtwr_db`. Ensure MongoDB is running when testing.
- Sprint note: before committing, edit `sprint.txt` with the sprint number (see `README.md`).

## Project-specific conventions & gotchas (detectable in code)
- Response contract: controllers return `{ data: ... }` for successful payloads. Keep that consistent.
- Model/Schema naming: models are registered with lowercase names (e.g., `'user'`, `'clothingItem'`) — watch for `ref`/`populate` name mismatches.
- Common issues already present — be conservative and write fixes that preserve intent:
  - Some model files use `string` instead of `String` and reference `validator` without importing it.
  - Controller exports/imports have name mismatches (e.g., `createUsers` vs expected `createUser`) and incorrect model usage (`findByID` vs `findById`). When fixing, keep public route signatures stable (don't change route paths without updating `routes/*`).
  - `app.js` currently sets up Express and connects to Mongoose but does not mount route modules — verify and add `app.use()` only when intended.

## Integration points & dependencies
- External runtime dependencies: `express`, `mongoose` (see `package.json`). No authentication yet.
- Dev tools: `nodemon`, `eslint`, `prettier` configured as devDependencies.

## How to approach edits
- Small, focused PRs. Preserve existing API responses and status codes unless fixing a clear bug.
- When you add imports (e.g., `validator`), update only the files that need them.
- Run `npm run lint` before proposing changes; keep style consistent with project ESLint/Prettier configs.

## When you see errors / tests
- There are no automated tests in the repo. Use a local run (`npm run dev`) and exercise endpoints with an HTTP client.
- Typical controller error handling currently sends 500 with `err.message`. If you introduce richer error types, wire them through `utils/errors.js` and update controllers accordingly.

If anything above is unclear or you need extra examples (route mounting, missing imports, or model fixes), ask for the specific file to inspect and I'll provide a targeted suggestion.
