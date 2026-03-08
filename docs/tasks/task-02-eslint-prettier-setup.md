# Task 02 -- Setup ESLint and Prettier

## Objective

Add linting and formatting tools to enforce consistent code quality
across the project.

---

## Step 1 -- Install Dependencies

```bash
npm install -D eslint prettier eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier
```

---

## Step 2 -- Create ESLint Configuration

Create:

    .eslintrc.cjs

Example:

```js
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    rules: {}
};
```

---

## Step 3 -- Create Prettier Configuration

Create:

    .prettierrc

Example:

```json
{
    "semi": false,
    "singleQuote": true,
    "trailingComma": "none",
    "printWidth": 100
}
```

---

## Step 4 -- Add Scripts

In `package.json`:

```json
"scripts": {
  "lint": "eslint . --ext .ts,.vue",
  "format": "prettier --write ."
}
```

---

## Step 5 -- Run Lint and Format

```bash
npm run lint
npm run format
```

---

## Expected Result

• Code is automatically formatted\
• Lint errors are reported\
• Consistent coding style across the project
