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
```

Note: This project requires Node.js 24. Use `nvm use 24` before running commands.

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **Chakra UI v3** for component library
- **react-i18next** for internationalization (EN/CN)
- **uuid** for generating unique IDs

## Architecture

```
src/
├── App.tsx              # Main app component, manages global state
├── types.ts             # TypeScript interfaces (Record, Unit, AppData)
├── main.tsx             # Entry point
├── components/
│   ├── index.ts         # Component exports
│   ├── Toolbar.tsx      # Save/Load buttons for JSON file operations
│   ├── UnitList.tsx     # List of units, add/delete units
│   ├── UnitCard.tsx     # Individual unit card with editable name
│   ├── RecordTable.tsx  # Table of records with headers
│   └── RecordRow.tsx    # Single record row with computed values
└── i18n/
    ├── index.ts         # i18next configuration
    ├── en.json          # English translations
    └── zh.json          # Chinese translations
```

## State Management

- Single source of truth in `App.tsx` using React `useState`
- State flows down: App → UnitList → UnitCard → RecordTable → RecordRow
- Callbacks propagate changes upward through props

## Data Model

```typescript
interface Record {
  id: string;
  startDate: string;
  endDate: string;
  waterMeterStart: number;
  waterMeterEnd: number;
  waterUnitPrice: number;
  electricMeterStart: number;
  electricMeterEnd: number;
  electricUnitPrice: number;
  extraFee: number;
}

interface Unit {
  id: string;
  name: string;
  records: Record[];
}

interface AppData {
  units: Unit[];
}
```

## Computed Values

- **Water Fee**: `(waterMeterEnd - waterMeterStart) * waterUnitPrice`
- **Electric Fee**: `(electricMeterEnd - electricMeterStart) * electricUnitPrice`
- **Total**: `waterFee + electricFee + extraFee`

## File Operations

- Save: Downloads JSON file with timestamp
- Load: File picker to import JSON, validates structure before loading

## i18n

- Language toggle button in top-right of app header
- Switches between English and Chinese
- All UI text uses `t('key')` from react-i18next
