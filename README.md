# Avantos Task - Action Graph Visualization

React application for visualizing and managing action graphs with field mapping capabilities.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

## Getting Started

### 1. Start the Backend Simulator

**IMPORTANT:** Start the backend server first before running the React application.

```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver.git
cd frontendchallengeserver
npm install
npm start
```

The backend server runs on `http://localhost:3000`.

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Build tool
- **ReactFlow** - Graph visualization
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Vitest** - Testing

## Project Structure

```
src/
├── api/                    # API client configuration
├── components/ui/          # Reusable UI components
├── features/
│   └── action-graph/       # Action graph feature
│       ├── api/            # API routes, queries, and data mapping
│       └── components/     # Feature-specific components
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand state management
└── test/                   # Test setup and utilities
```

## Testing

See [TEST_README.md](./TEST_README.md) for detailed testing instructions.

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui
```
