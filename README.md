# Landlord

A simple, bilingual utility billing app for landlords and room rentals.

Track water and electricity usage for each rental unit, calculate the amount due, and create a clear billing summary to share with tenants.

## Use Landlord

- **Web app:** [cal.clawd.press](https://cal.clawd.press/)
- **Android app:** [Download the latest APK from GitHub Releases](https://github.com/xinyo/landlord/releases)

The web app works on desktop and mobile browsers. To use the Android version, open the releases page on your phone, download the latest APK, and follow Android's prompts to install it.

## Features

- Manage multiple rental units or rooms
- Keep a history of billing records for every unit
- Record billing dates, meter readings, unit prices, and extra fees
- Automatically calculate water usage, electricity usage, and the total amount due
- Carry previous meter readings and prices into the next billing period
- Preview and save a billing summary image for tenants
- Export all app data to a JSON backup and import it later
- Switch between English and Chinese
- Use a responsive interface on desktop and mobile

## How to use it

1. Open the [web app](https://cal.clawd.press/) or install the [Android APK](https://github.com/xinyo/landlord/releases).
2. Add a unit or room.
3. Add a billing record with the billing period, water and electricity meter readings, unit prices, and any extra fee.
4. Review the automatically calculated charges.
5. Preview and save the summary image, then share it with the tenant.

For the next billing period, Landlord reuses the previous prices and extra fee, and uses the last meter readings as the new starting readings. You can adjust any value before saving.

## Back up your data

Landlord does not use accounts or cloud sync.

- **Web:** Your billing data is not saved automatically. Select **Save** to download a JSON backup before refreshing or closing the page, and select **Load** to restore it.
- **Android:** Your data is saved locally on your device. Use **Backup** and **Restore** to protect it or move it between the Android and web apps.

> Loading or restoring a backup replaces the app's current data. Save or back up the current data first if you may need it later.

## Privacy

There is no backend, account, or automatic cloud storage. Data only leaves your device when you explicitly download or share a backup or billing summary.

## Development documentation

Technical details, project structure, setup commands, and implementation notes are available in [docs/ai-instruction.md](docs/ai-instruction.md).
