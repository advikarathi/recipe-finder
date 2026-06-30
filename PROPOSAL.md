# Proposal: Eat Your Way Around the World

**What I'm building:** A recipe explorer where users search recipes by name, browse meals by country or cuisine, discover surprise recipes, filter for vegetarian recipes, view full recipe details, page through larger result sets, and save favorites to come back to later.

**Which API I'm using:** TheMealDB (https://www.themealdb.com/api.php) — free, no signup required (uses the public test key "1", which TheMealDB explicitly allows for development and educational use).

**API JSON checked:** I opened `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken` and confirmed the response returns a `meals` array with fields like `idMeal`, `strMeal`, `strCategory`, `strArea`, `strCountry`, `strMealThumb`, `strInstructions`, `strYoutube`, `strIngredient1-20`, and `strMeasure1-20`.

**Why I chose this:** I've traveled to 25+ countries and I'm curious what's actually being cooked in places I've been or want to go next. Filtering by country/cuisine gives a travel-themed browsing mechanic, while recipe search makes it easier to find many more meals across the database. The data is rich enough to support a detail view and a favorites list without needing a second API.

**Core features:**
1. Search recipes by name using TheMealDB's full recipe search endpoint
2. Browse recipes by country/cuisine using a dropdown of TheMealDB cuisines that currently return recipes
3. Discover a random recipe with TheMealDB's random endpoint
4. A detail view for a selected meal with full ingredients, measurements, instructions, and derived recipe facts like ingredient count
5. Save/unsave favorites to localStorage, with vegetarian filtering, light/dark mode preference, pagination, and animated transitions

**What I don't know yet:**
- How to chain fetch calls cleanly — going from search or cuisine results to a single meal's full detail involves different endpoint shapes that need to work together
- How sparse the data actually is. TheMealDB's area endpoint can include cuisines/countries that do not currently return recipes, so the app uses a focused dropdown of cuisines that return real meal results and still handles empty responses as a normal case, not a bug
- How best to structure localStorage so favorites persist correctly (storing just meal IDs vs. storing full meal objects)
