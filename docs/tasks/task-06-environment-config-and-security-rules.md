# Task 09 – Environment Configuration and Security Rules

## Objective

Create a safe and scalable environment configuration strategy for the project using `.env` files, typed access, and security best practices.

---

## Step 1 – Define the Environment File Strategy

Recommended files:

```bash
.env
.env.development
.env.production
.env.example
```

Purpose:

- `.env`: shared local defaults
- `.env.development`: local development overrides
- `.env.production`: production values managed by deployment platform
- `.env.example`: public template with no real secrets

---

## Step 2 – Add Example Variables

Create `.env.example`:

```env
VITE_APP_NAME=Plannance
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_DEBUG=true
```

Important:

- Only expose variables prefixed with `VITE_` to the frontend
- Never place real secrets inside `.env.example`

---

## Step 3 – Ignore Sensitive Files

In `.gitignore`, include:

```gitignore
.env
.env.*.local
.env.local
.env.development
.env.production
```

Keep `.env.example` committed to the repository.

Note:
If your team wants to version a non-sensitive environment file, review it carefully before committing.

---

## Step 4 – Create Typed Environment Access

Create a file such as:

```bash
src/config/env.ts
```

Example:

```ts
const requiredEnv = ['VITE_API_BASE_URL'] as const;

for (const key of requiredEnv) {
    if (!import.meta.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

export const env = {
    appName: import.meta.env.VITE_APP_NAME || 'Plannance',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true'
};
```

This centralizes environment access and avoids scattered `import.meta.env` usage.

---

## Step 5 – Add Type Definitions

Create or update:

```bash
env.d.ts
```

Example:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME?: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_ENABLE_DEBUG?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
```

This gives TypeScript support for environment variables.

---

## Step 6 – Separate Public and Secret Values

Frontend rule:

- only public configuration goes into `VITE_*` variables

Examples of allowed frontend variables:

- app name
- API base URL
- feature flags
- public analytics IDs

Examples that must never be exposed in the frontend:

- database passwords
- private API keys
- JWT secrets
- cloud secret access tokens

Sensitive values must stay on the backend or inside your deployment platform secret manager.

---

## Step 7 – Add Runtime Validation

Install validation library if desired:

```bash
npm install zod
```

Example with Zod:

```ts
import { z } from 'zod';

const envSchema = z.object({
    VITE_APP_NAME: z.string().optional(),
    VITE_API_BASE_URL: z.string().url(),
    VITE_ENABLE_DEBUG: z.enum(['true', 'false']).optional()
});

const parsedEnv = envSchema.parse(import.meta.env);

export const env = {
    appName: parsedEnv.VITE_APP_NAME ?? 'Plannance',
    apiBaseUrl: parsedEnv.VITE_API_BASE_URL,
    enableDebug: parsedEnv.VITE_ENABLE_DEBUG === 'true'
};
```

This prevents invalid environment values from going unnoticed.

---

## Step 8 – Create Feature Flag Support

You can use environment variables for controlled rollout:

```env
VITE_ENABLE_DASHBOARD=true
VITE_ENABLE_NOTIFICATIONS=false
```

Example:

```ts
export const features = {
    dashboard: import.meta.env.VITE_ENABLE_DASHBOARD === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true'
};
```

This helps enable or disable features without editing application logic.

---

## Step 9 – Define Security Rules

Project security rules:

- never commit real secrets
- never expose backend secrets to the frontend
- never log sensitive environment values in the browser console
- never include `.env` files in public documentation screenshots
- always use `.env.example` as the onboarding template
- validate required variables at startup
- rotate compromised secrets immediately

---

## Step 10 – Add Team Onboarding Instructions

In your project README, add a section like:

```md
## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill local values
3. Run the project normally
```

This gives new contributors a clean setup process without exposing secrets.

---

## Expected Result

- Environment variables are organized and typed
- Frontend only exposes safe public configuration
- Secret values stay out of the repository
- New developers can configure the project quickly
- The project is safer and more scalable for production
