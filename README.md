# Weighline

A private, client-side weight and body composition tracker. Log daily weigh-ins, watch weekly averages, set goals, and see the trend instead of the noise.

All data stays in the browser using `localStorage`. There is no account, server, or analytics.

## Features

- Fast weigh-in entry with the current date and time prefilled
- Optional body fat percentage and notes on every entry
- Weight and body fat trend charts using Monday-to-Sunday weekly averages
- Time ranges from 4 weeks to all time
- Goal weight, target body fat, and target date
- Progress, remaining distance, and required weekly pace
- BMI, body fat, lean body mass, fat mass, FFMI, and normalized FFMI
- Color-coded BMI, body fat, and FFMI ranges with an optional reference sex
- Click any body composition metric for its full history chart
- Latest five weigh-ins on the dashboard with a full-screen history view
- Edit and delete past weigh-ins from either view
- CSV import and export for backups or moving between browsers
- Metric and imperial units
- Light and dark themes
- Responsive, mobile-first layout

## Use locally

No build step or dependencies are needed. Serve the directory with any static file server:

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

Opening `index.html` directly also works in most browsers, but a local server is recommended so storage behavior matches the hosted site.

## GitHub Pages

The app is a static site at the repository root, so GitHub Pages can serve it directly from the `main` branch:

1. Open **Settings → Pages** in the GitHub repository.
2. Set the source to **Deploy from a branch**.
3. Choose `main` and `/ (root)`.

No build workflow is required. The `.nojekyll` file prevents Jekyll processing.

## CSV format

Exports use this shape:

```csv
date,weight_kg,body_fat_pct,note
2026-11-03T07:42:00.000Z,79.5,19.7,Morning weigh-in
2026-11-02T07:18:00.000Z,79.8,,
```

Import merges new rows into existing data and skips duplicate timestamps. The importer accepts `weight_kg`, `weight_lb`, or a generic `weight` column. A generic weight column uses the unit currently selected in the app. Body fat and notes are optional.

## Calculations

- **BMI** = weight in kg / height in meters squared
- **Lean body mass** = weight × (1 − body fat percentage / 100)
- **Fat mass** = weight × body fat percentage / 100
- **FFMI** = lean body mass / height in meters squared
- **Normalized FFMI** = FFMI + 6.3 × (1.8 − height in meters)
- **Weekly average** = the mean of all weight or body fat readings from Monday through Sunday

BMI is a broad population measure and does not account for body composition. Its categories are not sex-specific for adults. FFMI and body fat reference ranges use the optional reference sex selected in the profile.

FFMI categories are contextual fitness benchmarks, not a health diagnosis. The highest ranges are rare naturally; measurement error, training history, genetics, and PED use can all affect the number. Use trends and the full body composition picture rather than a single reading.

## Privacy and backups

Entries are stored only in the current browser's local storage. Clearing site data removes them permanently. Use **Export CSV** regularly to keep a backup. Import that file to restore your history or move it to another browser or device.
