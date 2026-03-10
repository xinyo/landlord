# Landlord

A lightweight bilingual utility billing app for landlords and room rentals.

Landlord helps track **water and electricity charges per rental unit**, calculate totals for each billing period, and generate a simple shareable summary image for tenants.

## What it does

- Manage multiple rental **units / rooms**
- Add multiple billing **records** per unit
- Track billing periods with:
  - start date
  - end date
  - water meter start/end
  - water unit price
  - electric meter start/end
  - electric unit price
  - extra fee
- Automatically calculate:
  - water usage and water fee
  - electricity usage and electricity fee
  - overall total
- Export and import app data as **JSON**
- Preview and download a billing summary as an **image**
- Switch between **English** and **Chinese**
- Use on both **desktop** and **mobile** layouts

## Business logic

Each unit contains a list of billing records.

For each record, the app computes:

- `waterUsage = max(0, waterMeterEnd - waterMeterStart)`
- `electricUsage = max(0, electricMeterEnd - electricMeterStart)`
- `waterFee = waterUsage * waterUnitPrice`
- `electricFee = electricUsage * electricUnitPrice`
- `total = waterFee + electricFee + extraFee`

When creating a new record, the app helps reduce repetitive manual entry by:

- carrying forward the previous record's water price
- carrying forward the previous record's electricity price
- carrying forward the previous record's extra fee
- using the previous record's meter end values as the new record's meter start values
- generating the next billing period based on the last record

## Tech stack

- **React 19**
- **TypeScript**
- **Vite**
- **Chakra UI**
- **i18next / react-i18next**
- **Vitest + Testing Library**
- **uuid**
- **html2canvas**
- **lucide-react**

## Project structure

```text
src/
  components/
    Footer.tsx
    RecordImage.tsx
    RecordRow.tsx
    RecordTable.tsx
    SettingsDialog.tsx
    Toolbar.tsx
    UnitCard.tsx
    UnitList.tsx
  hooks/
    useMobile.ts
  i18n/
    en.json
    index.ts
    zh.json
  test/
    setup.ts
  App.tsx
  types.ts
```

## Data model

### AppData

```ts
interface AppData {
  units: Unit[];
  settings: Settings;
}
```

### Unit

```ts
interface Unit {
  id: string;
  name: string;
  records: Record[];
}
```

### Record

```ts
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
```

### Settings

```ts
interface Settings {
  defaultWaterUnitPrice: number;
  defaultElectricUnitPrice: number;
  defaultExtraFee: number;
}
```

## Getting started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run tests

```bash
npm run test
```

### Run linting

```bash
npm run lint
```

## Notes and limitations

- This is currently a **frontend-only** application.
- There is **no backend**, database, authentication, or cloud sync.
- Data persistence is handled by **manual JSON export/import**.
- Meter regression is clamped with `max(0, ...)` instead of raising a validation error.
- This is designed as a lightweight utility calculator, not a full property-management platform.

## Possible future improvements

- Persistent local storage or cloud sync
- Validation and error states for invalid meter readings
- Better date-range rules and billing-cycle handling
- Tenant profiles and invoice history
- Rent, deposits, and payment tracking
- PDF invoice export
- Multi-user / multi-property support

## Repository purpose

This project is best described as:

> A bilingual landlord utility calculator for tracking room or unit water and electricity charges by billing period, with simple export and image-sharing support.
