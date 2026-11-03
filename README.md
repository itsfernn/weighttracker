# Weighline

A private, client-side weight and body composition tracker. Log daily weigh-ins, watch weekly averages, set goals, and see the trend instead of the noise.

All data stays in the browser using `localStorage`. There is no account, server, or analytics.

## Features

- Fast weigh-in entry with the current date and time prefilled
- Optional body fat percentage and notes on every entry
- Weight and body fat trend charts using Monday-to-Sunday weekly averages
- A regression trend line and recent weekly momentum
- Time ranges from 4 weeks to all time
- Goal weight, target body fat, and target date
- Progress, remaining distance, required weekly pace, and on-track guidance
- Goal projections for BMI, body fat, and FFMI
- BMI, body fat, lean body mass, fat mass, FFMI, and normalized FFMI
- Clickable metric details with reference ranges and historical charts
- Optional male, female, or general reference ranges for body composition context
- Edit and delete past weigh-ins
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
- **Normalized FFMI** = FFMI + 6.1 × (1.8 − height in meters)
- **Weekly average** = the mean of all weight or body fat readings from Monday through Sunday
- **Recent pace** = a linear regression over the last 28 days of weigh-ins, reported in kg or lb per week
- **Projected body fat at goal** = 1 − (current lean mass / target weight)

The goal view compares the weekly pace needed to hit your target date with your recent pace. Pace bands use general fitness guidance: roughly 0.25–1% of body weight per week for weight loss and 0.1–0.5% per week for weight gain. These are not medical recommendations. Context ranges are general fitness references and can vary by sex, age, training history, and measurement method.

## Privacy and backups

Entries are stored only in the current browser's local storage. Clearing site data removes them permanently. Use **Export CSV** regularly to keep a backup. Import that file to restore your history or move it to another browser or device.
