# Lighthouse Audit

Audit run locally against:

`http://localhost:8000/`

Command:

```bash
npx --yes lighthouse http://localhost:8000/ --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless --no-sandbox"
```

## Scores

- Performance: 92
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Fixes Made After First Audit

- Added a meta description for SEO.
- Added an inline favicon to avoid a missing `favicon.ico` console error.
- Darkened the orange accent color so text/buttons pass contrast checks.
- Kept form labels, button names, and responsive viewport behavior passing.

The raw Lighthouse JSON output is saved in `lighthouse-report.json`.
