# Supertennix TV App

## NOTICE: This project is for demonstration purposes only and should never be used in a Production setting.

> **Migration Note (May 2026)**: This app has been migrated from Create React App to **Vite + React 18**. Old CRA scripts have been replaced.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode with Vite (fast HMR).
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run start:dev`

Same as above (alias for Vite dev server).

### `npm run start-80:dev`

Runs on port 80 (useful for CORS testing on some TVs).

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run build:prod`

Production build (same as above).

### `npm run preview`

Locally preview the production build.

### `npm test`

Launches Vitest (if configured) or the test runner.

## Environment Variables

- Use `.env.development` and `.env.production` (Vite convention)
- Access variables with `import.meta.env.VITE_YOUR_VAR`
- For now, a compatibility shim for `process.env` is included.
