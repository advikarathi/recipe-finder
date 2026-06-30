# Product Requirements Document: Eat Your Way Around the World

## Overview

Eat Your Way Around the World is a browser-based recipe explorer that helps users search for meals, browse by cuisine/country, open full recipe details, and save favorite recipes for later.

## Target User

The primary user is someone who likes food, travel, or cooking inspiration and wants a fast way to discover recipes from different places without creating an account.

## Goals

- Let users search TheMealDB recipes by name.
- Let users browse recipes by cuisine/country.
- Help users quickly compare recipe results through cards, result counts, and images.
- Let users open a detail view with ingredients, instructions, and video links.
- Let users save favorites locally in the browser.

## Non-Goals

- No backend server.
- No user accounts or login.
- No paid API key.
- No recipe creation or editing.

## Core User Stories

1. As a user, I want to search for a recipe by name so I can quickly find meals related to what I want to cook.
2. As a user, I want to browse by cuisine/country so I can discover food from different places.
3. As a user, I want to turn on vegetarian-only filtering so I can narrow results to my dietary preference.
4. As a user, I want to click a recipe card so I can see ingredients, measurements, instructions, and a video link when available.
5. As a user, I want to save favorites so I can revisit recipes after refreshing the page.

## Functional Requirements

- Fetch recipe data from TheMealDB with `fetch()`.
- Render all recipe cards dynamically with JavaScript.
- Provide recipe search through `search.php?s=TERM`.
- Provide cuisine browsing through `filter.php?a=AREA`.
- Provide full recipe details through `lookup.php?i=ID`.
- Show loading messages during API requests.
- Show friendly error messages when API requests fail.
- Show empty states when no results match a search/filter.
- Store favorites, vegetarian preference, and theme preference in `localStorage`.
- Support light and dark display modes.
- Support load-more pagination for larger result sets.

## Data Requirements

Recipe cards need:

- `idMeal`
- `strMeal`
- `strMealThumb`
- `strArea` or selected cuisine

Recipe details need:

- `strCategory`
- `strInstructions`
- `strYoutube`
- `strIngredient1-20`
- `strMeasure1-20`

## Edge Cases

- API returns `meals: null`.
- A recipe has no YouTube link.
- A cuisine has no available recipes.
- Vegetarian filtering returns zero results.
- Favorites are empty.
- Saved `localStorage` data is missing or invalid.

## Success Criteria

- A user can search recipes and see dynamic results.
- A user can browse at least several cuisine/country options.
- A user can open a recipe detail view.
- A user can save and remove favorites.
- The app works on mobile and desktop.
- The app can be deployed as a static GitHub Pages site.
