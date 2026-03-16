# Task 03 -- Testing Structure with Vitest and Coverage

## Objective

Create a scalable testing architecture using Vitest with full coverage
reporting.

---

## Step 1 -- Install Dependencies

```bash
npm install -D vitest @vue/test-utils jsdom @vitest/coverage-v8
```

---

## Step 2 -- Configure Vitest

Update `vite.config.ts`:

```ts
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html']
        }
    }
});
```

---

## Step 3 -- Create Test Folder Structure

Recommended structure:

    tests/

    components/
    views/
    stores/
    services/
    utils/

Example mirroring the project:

    src/components/Button.vue
    tests/components/Button.test.ts

---

## Step 4 -- Example Component Test

```ts
import { mount } from '@vue/test-utils';
import Button from '@/components/Button.vue';

describe('Button', () => {
    it('renders correctly', () => {
        const wrapper = mount(Button);
        expect(wrapper.exists()).toBe(true);
    });
});
```

---

## Step 5 -- Add Test Scripts

In `package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

---

## Step 6 -- Run Tests

```bash
npm run test
npm run test:coverage
```

---

## Expected Result

• Tests mirror project structure\
• Coverage reports generated\
• Components fully testable
