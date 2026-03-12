# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Water & Electric Fee Calculator app for managing rental property utility records. Built with React, TypeScript, Vite, and Chakra UI.

## Commands

```bash
# Start development server (requires Node.js 24)
nvm use 24 && pnpm run dev

# Build for production
nvm use 24 && pnpm run build

# Lint code
pnpm run lint

# Preview production build
pnpm run preview

# Run tests
pnpm vitest
```

Note: This project requires Node.js 24. Use `nvm use 24` before running commands.

## Testing

- All functional changes should be covered by unit tests
- Test files should be placed alongside the component they test with `.test.tsx` extension
- Use vitest for testing framework with @testing-library/react for component testing
- Mock external dependencies like `uuid` in tests

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **Chakra UI v3** for component library
- **react-i18next** for internationalization (EN/CN)
- **uuid** for generating unique IDs
