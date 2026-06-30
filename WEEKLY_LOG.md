# Weekly Log: API Recipe Finder

## Iteration 1: Fetch and Display

I chose TheMealDB because it has real recipe data and does not require a private API key. The first version used a hard-coded cuisine and fetched meals from the `filter.php?a=Canadian` endpoint. The response included a `meals` array, with each meal containing an ID, name, and thumbnail image. I used `strMeal`, `strMealThumb`, and `idMeal` to render the first recipe cards.

The trickiest part was understanding that the filtered endpoint only gives summary data. To show ingredients and instructions, the app needs a second fetch to the lookup endpoint using the meal ID.

## Iteration 2: Interactivity and Design

I added search, quick-search buttons, cuisine browsing, vegetarian filtering, and a surprise recipe button. Search uses TheMealDB's recipe-name endpoint, cuisine browsing uses the area filter endpoint, the surprise button uses the random endpoint, and detail cards use the lookup endpoint.

For layout, I used a responsive CSS grid for recipe cards, a compact control area, result statistics, and a modal detail view. The app includes loading spinner text, friendly API error messages, empty-state suggestions, and mobile-friendly stacking.

## Iteration 3: Polish and Extend

I added multiple extensions: a full recipe detail view, saved favorites, vegetarian-only filtering, light/dark mode, load-more pagination, visual result statistics, derived recipe facts, card animations, and a random recipe endpoint. Favorites and display preferences are stored in `localStorage`, so saved recipes and theme choices stay available after the page reloads.

Edge cases handled:

- Empty search input
- No results found
- API request fails
- API rate limit response
- Cuisine unexpectedly has no meals
- User has no saved favorites
- Vegetarian filter returns no matches
- Theme preference is restored after reload
- Saved favorites data in `localStorage` is missing or invalid
- A recipe does not have a YouTube video link
- Large result sets are split into smaller pages with a load-more button

## Lighthouse Audit

I ran Lighthouse locally against `http://localhost:8000/`.

Final scores:

- Performance: 92
- Accessibility: 100
- Best Practices: 100
- SEO: 100

After the first audit, I fixed the missing meta description, missing favicon console error, and low-contrast accent color.

## AI Collaboration Note

Key prompts used:

1. "Eat your way around the world... filter recipes by country/cuisine instead of by name, with a save-favorites feature. I want to do this can you help me."
2. "This is the assignment can you check what is missing and what I need to add. This could include changes in proposals as well."
3. "Add at least one extension... Handle edge cases... Run Lighthouse audit."

What changed after using AI:

- The idea was shaped into a concrete app with TheMealDB search, area browsing, random recipes, detail lookup, and saved favorites.
- The proposal was adjusted to avoid overstating TheMealDB's area list as a full list of every country.
- Required submission materials were added or identified, including `README.md`, `PROPOSAL.md`, `PRD.md`, weekly log notes, Lighthouse audit notes, deployment, screenshot, and repo-linking tasks.
