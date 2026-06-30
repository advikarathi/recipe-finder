# Weekly Log: API Recipe Finder

## Iteration 1: Fetch and Display

I chose TheMealDB because it has real recipe data and does not require a private API key. The first version used a hard-coded cuisine and fetched meals from the `filter.php?a=Canadian` endpoint. The response included a `meals` array, with each meal containing an ID, name, and thumbnail image. I used `strMeal`, `strMealThumb`, and `idMeal` to render the first recipe cards.

The trickiest part was understanding that the filtered endpoint only gives summary data. To show ingredients and instructions, the app needs a second fetch to the lookup endpoint using the meal ID.

## Iteration 2: Interactivity and Design

I added a search bar and a dropdown of cuisines that return real recipes from TheMealDB. Search uses the recipe-name endpoint, so users can find more meals beyond the cuisine dropdown. Because the full area endpoint can include places that currently return no meals, the app uses a focused list of working cuisine options. When the user searches or picks a cuisine, that value is passed into a new API request and the results grid updates dynamically.

For layout, I used a responsive CSS grid for recipe cards and a modal detail view for full recipes. The design uses a travel-inspired hero image, clear controls, and card-based results so the app feels like a browsing experience instead of a plain search page.

The app now includes loading messages, empty states, and friendly error messages if an API call fails.

## Iteration 3: Polish and Extend

I added multiple extensions: a full recipe detail view, saved favorites, vegetarian-only filtering, light/dark mode, load-more pagination, visual result statistics, derived recipe facts, and card animations. Favorites and display preferences are stored in `localStorage`, so saved recipes and theme choices stay available after the page reloads. The favorites button shows a count, and users can switch between browsing cuisines, searching recipes, and viewing saved meals.

Edge cases handled so far:

- API request fails
- Cuisine unexpectedly has no meals
- User has no saved favorites
- Vegetarian filter returns no matches
- Theme preference is restored after reload
- Saved favorites data in `localStorage` is missing or invalid
- A recipe does not have a YouTube video link
- Large result sets are split into smaller pages with a load-more button

Still to do before final submission:

- Run a Lighthouse audit
- Ask a classmate for feedback
- Add a screenshot to the README
- Deploy to GitHub Pages and add the live link
- Link the repo from the `oim3690` README

## AI Collaboration Note

Key prompts used:

1. "Eat your way around the world... filter recipes by country/cuisine instead of by name, with a save-favorites feature. I want to do this can you help me."
2. "This is the assignment can you check what is missing and what I need to add. This could include changes in proposals as well."

What changed after using AI:

- The idea was shaped into a concrete app with TheMealDB area browsing, recipe detail lookup, and saved favorites.
- The proposal was adjusted to avoid overstating TheMealDB's area list as a full list of every country.
- Required submission materials were added or identified, including `README.md`, `PROPOSAL.md`, weekly log notes, deployment, screenshot, and repo-linking tasks.
