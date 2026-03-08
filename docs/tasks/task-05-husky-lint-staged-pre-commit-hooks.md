# Task 05 – Setup Husky and lint-staged Pre-commit Hooks

## Objective
Configure automated Git hooks to validate code quality before every commit and keep the repository clean and consistent.

---

## Step 1 – Install Dependencies

Run:

```bash
npm install -D husky lint-staged
```

If your project uses ESLint and Prettier, make sure they are already installed and configured.

---

## Step 2 – Initialize Husky

Run:

```bash
npx husky init
```

This creates the `.husky/` folder and a default pre-commit hook.

---

## Step 3 – Add the Prepare Script

In `package.json`, make sure you have:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

This ensures Husky is installed automatically after dependencies are installed.

---

## Step 4 – Configure lint-staged

In `package.json`, add:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css,scss}": [
      "prettier --write"
    ]
  }
}
```

This runs only on staged files, making commits faster.

---

## Step 5 – Configure the Pre-commit Hook

Update `.husky/pre-commit` to:

```bash
npx lint-staged
```

Example full file:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

---

## Step 6 – Optional: Add Type Check Before Commit

If you want stronger validation, update `.husky/pre-commit` to:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run type-check
npx lint-staged
```

And add this script to `package.json`:

```json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit"
  }
}
```

Use this only if type-check speed is acceptable for your workflow.

---

## Step 7 – Optional: Add a Pre-push Hook

To prevent pushing broken code, create:

```bash
npx husky add .husky/pre-push "npm run test:coverage"
```

Or manually create `.husky/pre-push`:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run test:coverage
```

This is useful when the team requires test coverage validation before pushing.

---

## Step 8 – Protect Sensitive Files

Do not include scripts that read, print, or validate secret values inside files such as:

```bash
.env
.env.local
.env.development
.env.production
```

Hooks should validate code quality, not expose secret configuration.

Recommended rule:
- lint source files
- format source files
- type-check source files
- avoid reading secret environment files

---

## Step 9 – Test the Hook

Stage a file and try a commit:

```bash
git add .
git commit -m "test hooks"
```

Expected behavior:
- ESLint fixes issues automatically when possible
- Prettier formats staged files
- Commit fails if there are blocking errors

---

## Expected Result

- Every commit validates code quality automatically
- Staged files are formatted before commit
- Team coding standards are enforced consistently
- Sensitive environment files are not exposed by hooks
