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

The Android app additionally uses **Expo / React Native**, native AsyncStorage,
Android document sharing, and native view capture. Shared billing logic and JSON
validation live in `packages/core` and are used by both apps.

## Project structure

```text
apps/
  mobile/               # Expo React Native Android app
packages/
  core/                 # Shared types, calculations, dates, JSON and translations
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

## Android app

Use Node 24 LTS and pnpm 10 (the pinned versions are recorded in `.nvmrc` and
`package.json`). The Android application ID is `com.xinyo.landlord`.

Install all workspace dependencies from the repository root:

```bash
corepack enable
pnpm install
```

For local development, install Expo Go on an Android device and run:

```bash
pnpm android
```

Scan the QR code with Expo Go. The application automatically saves its data on
the device and can restore backups exported by the web app.

### One-time cloud build setup

An Expo account is required for cloud APK builds. Complete login and Android
signing setup once:

```bash
pnpm android:setup
```

Accept EAS-managed Android signing credentials when prompted.

### Build an installable APK

Either spelling works; `build:android` is canonical and `build:andriod` is kept
as the requested compatibility alias:

```bash
pnpm build:andriod
```

The command type-checks the mobile app, waits for EAS to create a signed APK,
and atomically downloads it to `dist-android/landlord.apk`. It does not require
Android Studio or a local Android SDK.

The cloud build uploads the project to Expo. JSON backups and billing data stay
on the device unless the user explicitly shares them.

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

### Build for WeChat/Weixin Mini Program WebView

```bash
npm run build:wechat
```

This generates a separate build in `dist-wechat/` so it does not overwrite the default web build in `dist/`.

In WeChat runtime, export/download actions use compatibility fallbacks:
- JSON export opens in a new page and prompts users to save from the system browser.
- Image export opens the image and prompts users to long-press to save.

### Preview the production build

```bash
npm run preview
```

### Preview the WeChat build

```bash
npm run preview:wechat
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
