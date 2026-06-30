# Proposal: Eat Your Way Around the World

**What I'm building:** A recipe explorer where users browse meals by country or cuisine, view full recipe details, and save favorites to come back to later.

**Which API I'm using:** TheMealDB (https://www.themealdb.com/api.php) — free, no signup required (uses the public test key "1", which TheMealDB explicitly allows for development and educational use).

**Why I chose this:** I've traveled to 25+ countries and I'm curious what's actually being cooked in places I've been or want to go next. Filtering by country/cuisine gives a real browsing mechanic instead of just a search box, and the data is rich enough to support a detail view and a favorites list without needing a second API.

**Core features:**
1. Browse recipes by country/cuisine, pulled dynamically from the API's full list of areas (200+ countries)
2. A results grid showing each meal's name, image, and cuisine tag
3. A detail view for a selected meal with full ingredients, measurements, and instructions
4. Save/unsave favorites to localStorage, with a separate view to revisit saved meals
5. Loading state while fetching, plus a friendly empty-state message for countries that don't have any recipes yet

**What I don't know yet:**
- How to chain fetch calls cleanly — going from the area list, to the filtered meal list, to a single meal's full detail involves three different endpoint shapes that need to work together
- How sparse the data actually is. The area list now covers every country, but the database itself looks like it only has a few hundred meals total, so a lot of those countries will probably come back empty — I'll need to handle that as a normal case, not a bug
- How best to structure localStorage so favorites persist correctly (storing just meal IDs vs. storing full meal objects)
