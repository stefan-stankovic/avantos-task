# Testing Guide

## Running Tests

### Run all tests

```bash
pnpm test
```

### Run tests with UI interface

```bash
pnpm test:ui
```

The UI will be available at `http://localhost:51204/__vitest__/`

## Test Files

- `mapper.test.ts` - Data transformation logic (5 tests)
- `get-action-graph.test.tsx` - React Query hook (4 tests)
- `graph-view.test.tsx` - Main graph component (5 tests)

**Total: 14 tests**

## Tech Stack

- **Vitest** - Fast test framework with native Vite integration
- **@testing-library/react** - React component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom DOM matchers
