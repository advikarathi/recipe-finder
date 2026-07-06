# Eat Your Way Around the World

A browser-based recipe explorer that lets users browse meals by country or cuisine, open full recipe details, and save favorite meals for later.

## API

This app uses [TheMealDB](https://www.themealdb.com/api.php), a free recipe API that works from GitHub Pages without a private API key.

The app uses multiple TheMealDB endpoints:

- `search.php?s=TERM` to search recipes across the database by name
- `filter.php?a=AREA` to load recipes for the selected cuisine
- `lookup.php?i=ID` to load full recipe details
- `random.php` to load a surprise recipe

## Features

- Search recipes by name across TheMealDB
- Use quick-search buttons for broader recipe ideas like chicken, pasta, curry, rice, soup, and cake
- Discover a random recipe with the "Surprise me" button
- Browse recipes using a cuisine/country dropdown with options that return real meal results
- Turn vegetarian-only filtering on or off
- Switch between light and dark mode
- View recipe cards with meal names, images, and cuisine tags
- See result statistics with a visual progress bar
- Load larger result sets in pages with a "Load more" button
- Open a detail view with ingredients, measurements, instructions, and video links when available
- See transformed recipe facts such as category, ingredient count, and video availability
- Save and remove favorites with `localStorage`
- View saved favorites in a separate app view
- Loading spinner, friendly error messages, and empty states with suggested searches
- Animated card transitions with reduced-motion support
- Responsive layout for desktop and mobile screens

Note: TheMealDB's full area list can include cuisines/countries that currently return no meals from the filter endpoint. To avoid a dropdown full of dead ends, this app uses a focused list of cuisines verified against TheMealDB's filter endpoint.

## Live Site

TODO: Add the GitHub Pages link after deployment.

Expected format:

`https://advikarathi.github.io/recipe-finder/`

## Screenshot

![Eat Your Way Around the World](screenshots/home.png)

## How to Run Locally

Open `index.html` in a browser, or run a local static server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000/
```

## Submission Checklist

- [x] Uses `fetch()` with an external API
- [x] Displays API data dynamically with JavaScript
- [x] Includes browse/filter functionality
- [x] Includes loading state
- [x] Includes friendly error state
- [x] Has responsive design
- [x] Includes an extension: `localStorage` favorites
- [x] Includes an extension: recipe detail view
- [x] Includes an extension: light/dark mode preference
- [x] Includes an extension: vegetarian-only filtering
- [x] Includes an extension: load-more pagination
- [x] Includes an extension: visual data display with a progress bar
- [x] Includes an extension: data transformation with derived recipe facts
- [x] Includes an extension: animations with reduced-motion support
- [x] Includes an extension: surprise recipe endpoint
- [x] Includes `PROPOSAL.md`
- [x] Includes weekly log notes in `WEEKLY_LOG.md`
- [x] Run Lighthouse audit and saved notes in `LIGHTHOUSE.md`
- [x] Rename/create the public GitHub repo with hyphens if needed, such as `recipe-finder`
- [x] Deploy on GitHub Pages
- [ ] Add the live site link above
- [ ] Add a screenshot above
- [ ] Link this repo from the `oim3690` README
- [ ] Get feedback from a classmate
