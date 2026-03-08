# Task 04 -- Project Structure and Navigation Flow

## Objective

Organize the project navigation flow with Landing Page → Login →
Dashboard.

---

## Step 1 -- Install Router

```bash
npm install vue-router
```

---

## Step 2 -- Create Router Structure

    src/router/
    index.ts
    routes.ts

---

## Step 3 -- Define Routes

Example `routes.ts`:

```ts
export const routes = [
    {
        path: '/',
        name: 'Landing',
        component: () => import('@/views/Landing.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
    }
];
```

---

## Step 4 -- Router Initialization

```ts
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

export const router = createRouter({
    history: createWebHistory(),
    routes
});
```

---

## Step 5 -- Navigation Flow

Application flow:

    Landing Page
    ↓
    Login Page
    ↓
    Dashboard

Landing page contains:

• Marketing content\
• Login button\
• Register button (optional)

Login page:

• Authentication form\
• Redirect to dashboard

Dashboard:

• Main application interface

---

## Step 6 -- Optional Route Guards

Example authentication guard:

```ts
router.beforeEach((to, from, next) => {
    const isAuthenticated = false;

    if (to.name === 'Dashboard' && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});
```

---

## Expected Result

• Landing page loads first\
• Login required for dashboard access\
• Clean and scalable navigation structure
