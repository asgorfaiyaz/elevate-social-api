Elevate Social is a community event platform for discovering, joining, and organizing local social service events.

## Project Structure

- `src/server.ts` starts the HTTP server and connects to MongoDB.
- `src/app.ts` configures Express middleware and mounts application routes.
- `src/routes/` defines HTTP endpoints; `src/controllers/` implements request handlers.
- `src/db/` contains MongoDB setup, and `src/config/` loads environment settings.

## Configuration and Security

Copy `.env.example` to `.env` for local configuration. Keep secrets and real credentials out of source control; `.env` is gitignored. Update `.env.example` when adding required settings, using safe sample values.
