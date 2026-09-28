# PrepForge — Frontend

**Build skills. Forge confidence. Get hired.**

React + JavaScript frontend for the existing Django REST Framework backend.

## Stack

- React
- JavaScript
- CSS
- Axios
- React Router
- Lucide React
- Vite

No Tailwind, TypeScript, Redux, React Query, Monaco, or UI framework is required.

## Run locally

Start Django first:

```bash
python manage.py runserver
```

Then in this folder:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Vite proxies `/api/*` to `http://127.0.0.1:8000` during development.

## Current Django API contract

### Learning

- `GET /api/learning/categories/`
- `GET /api/learning/categories/:slug/`
- `GET /api/learning/topics/`
- `GET /api/learning/topics/:slug/`
- `GET /api/learning/content/`
- `GET /api/learning/content/:id/`

### Coding

- `GET /api/coding/problems/`
- `GET /api/coding/problems/:slug/`
- `GET /api/coding/submissions/` — authenticated
- `GET /api/coding/progress/` — authenticated

The coding list filters difficulty/topic through the backend and applies search in the browser because the current Django endpoint does not implement a `search` query parameter.

### Interviews

- `GET /api/interviews/questions/`
- `GET /api/interviews/questions/:id/`
- `GET /api/interviews/bookmarks/` — authenticated
- `POST /api/interviews/bookmarks/` — authenticated
- `GET /api/interviews/answers/` — authenticated
- `POST /api/interviews/answers/` — authenticated

### Dashboard

- `GET /api/dashboard/` — authenticated

## Important backend limitations

1. The current dashboard endpoint requires authentication. The frontend does not yet have a React login/token flow, so Dashboard/Progress/Profile will show the API error until authentication is added.
2. Coding `Run Code` and `Submit` are intentionally not implemented yet. Do not execute user code with `eval()` or `exec()`.
3. Interview bookmark/prepared UI is currently session-local until authenticated persistence is wired up.
4. The current coding detail API returns solution/test-case data, including hidden test cases. This should be changed on the Django side before production so hidden tests and solutions are never sent to the client.
5. The backend currently uses `SessionAuthentication`/Django browser authentication only through its existing setup; a dedicated API login/token strategy should be added before deployment.

## Build

```bash
npm run build
```
