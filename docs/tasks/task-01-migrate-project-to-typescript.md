# Task 01 -- Migrate Vue Project from JavaScript to TypeScript

## Objective

Convert the existing Vue project template from JavaScript to TypeScript
while keeping the current functionality intact.

---

## Step 1 -- Install TypeScript Dependencies

Run the following command:

```bash
npm install -D typescript @vue/tsconfig vue-tsc
```

Optional but recommended:

```bash
npm install -D @types/node
```

---

## Step 2 -- Create the TypeScript Configuration

Create a file called:

    tsconfig.json

Example configuration:

```json
{
    "extends": "@vue/tsconfig/tsconfig.dom.json",
    "compilerOptions": {
        "strict": true,
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    },
    "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

---

## Step 3 -- Add Vue Type Support

Create the file:

    env.d.ts

```ts
/// <reference types="vite/client" />
```

---

## Step 4 -- Convert JavaScript Files

Rename files:

    .js → .ts

Example:

    main.js → main.ts
    router.js → router.ts
    store.js → store.ts

---

## Step 5 -- Update Vue Components

Inside Vue components:

```vue
<script setup lang="ts"></script>
```

or

```vue
<script lang="ts"></script>
```

---

## Step 6 -- Validate TypeScript

Run:

```bash
npx vue-tsc --noEmit
```

This checks types without generating files.

---

## Expected Result

• Project compiles with TypeScript\
• No type errors\
• Vue components support typing
