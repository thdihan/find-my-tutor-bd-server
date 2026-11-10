# Find My Tutor BD — Backend Server (`find-my-tutor-server`)

The modular Node.js, Express, and TypeScript backend API engine for **Find My Tutor BD**, adhering to [`../docs/API_GUIDELINES.md`](../docs/API_GUIDELINES.md) and [`../PRODUCT.md`](../PRODUCT.md).

---

## 1. Modular Architecture Overview

The backend uses a clean, feature-driven modular structure. Inside `src/app/modules/`, each domain feature is self-contained with its own controller, service, model, interface, and routes:

```
src/
├── app.ts                  # Express app setup, CORS, JSON parsers & error handling
├── server.ts               # Server lifecycle, PostgreSQL pool & graceful shutdown
└── app/
    ├── config/             # Environment configuration (dotenv)
    │   └── index.ts
    ├── db/                 # PostgreSQL + PostGIS pool connection
    │   └── index.ts
    ├── errors/             # Custom application error classes
    │   └── AppError.ts
    ├── middlewares/        # Authentication, request validation, error handlers
    │   ├── auth.ts
    │   ├── globalErrorHandler.ts
    │   ├── notFoundHandler.ts
    │   └── validateRequest.ts
    ├── utils/              # Utility helpers
    │   ├── catchAsync.ts
    │   └── sendResponse.ts
    ├── routes.ts           # Global router importing all module routes
    └── modules/
        ├── auth/           # Authentication (Register, Login, Refresh, Logout)
        │   ├── auth.controller.ts
        │   ├── auth.interface.ts
        │   ├── auth.model.ts
        │   ├── auth.routes.ts
        │   └── auth.service.ts
        ├── user/           # User Profile Management
        │   ├── user.controller.ts
        │   ├── user.interface.ts
        │   ├── user.model.ts
        │   ├── user.routes.ts
        │   └── user.service.ts
        ├── tutor/          # Tutors Directory & Spatial Search (PostGIS)
        │   ├── tutor.controller.ts
        │   ├── tutor.interface.ts
        │   ├── tutor.model.ts
        │   ├── tutor.routes.ts
        │   └── tutor.service.ts
        ├── guardian/       # Guardian Profile & Wards
        │   ├── guardian.controller.ts
        │   ├── guardian.interface.ts
        │   ├── guardian.model.ts
        │   ├── guardian.routes.ts
        │   └── guardian.service.ts
        └── tuition/        # Tuition Posts & Applications
            ├── tuition.controller.ts
            ├── tuition.interface.ts
            ├── tuition.model.ts
            ├── tuition.routes.ts
            └── tuition.service.ts
```

---

## 2. API Endpoints

All endpoints are prefixed with `/api/v1` via `src/app/routes.ts`:

- **Auth**: `/api/v1/auth` (`/register`, `/login`, `/refresh`, `/logout`)
- **Users**: `/api/v1/users` (`/me`)
- **Tutors**: `/api/v1/tutors` (`/`, `/:id`, `/me`)
- **Guardians**: `/api/v1/guardians` (`/me`)
- **Tuitions**: `/api/v1/tuitions` (`/`, `/:id`, `/:id/apply`)
- **Health Check**: `/health`

---

## 3. Development & Build Scripts

Strictly manage dependencies and run scripts using **pnpm**:

```bash
# Start development server with hot reload
pnpm run dev

# Build TypeScript to dist/
pnpm run build

# Run production build
pnpm start

# Lint TypeScript codebase
pnpm run lint
```
