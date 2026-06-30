const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const FAVORITES_KEY = "worldRecipeFavorites";
const THEME_KEY = "worldRecipeTheme";
const VEGETARIAN_KEY = "worldRecipeVegetarianOnly";
const DEFAULT_AREA = "Italian";
const PAGE_SIZE = 12;
const CUISINE_OPTIONS = [
  { value: "Algerian", label: "Algerian - Algeria" },
  { value: "Australian", label: "Australian - Australia" },
  { value: "British", label: "British - United Kingdom" },
  { value: "Canadian", label: "Canadian - Canada" },
  { value: "Chinese", label: "Chinese - China" },
  { value: "Croatian", label: "Croatian - Croatia" },
  { value: "Egyptian", label: "Egyptian - Egypt" },
  { value: "Filipino", label: "Filipino - Philippines" },
  { value: "Greek", label: "Greek - Greece" },
  { value: "Irish", label: "Irish - Ireland" },
  { value: "Italian", label: "Italian - Italy" },
  { value: "Jamaican", label: "Jamaican - Jamaica" },
  { value: "Japanese", label: "Japanese - Japan" },
  { value: "Kenyan", label: "Kenyan - Kenya" },
  { value: "Malaysian", label: "Malaysian - Malaysia" },
  { value: "Mexican", label: "Mexican - Mexico" },
  { value: "Moroccan", label: "Moroccan - Morocco" },
  { value: "Polish", label: "Polish - Poland" },
  { value: "Portuguese", label: "Portuguese - Portugal" },
  { value: "Russian", label: "Russian - Russia" },
  { value: "Spanish", label: "Spanish - Spain" },
  { value: "Thai", label: "Thai - Thailand" },
  { value: "Tunisian", label: "Tunisian - Tunisia" },
  { value: "Turkish", label: "Turkish - Turkey" },
  { value: "Ukrainian", label: "Ukrainian - Ukraine" },
  { value: "Vietnamese", label: "Vietnamese - Vietnam" }
];

const areaSelect = document.getElementById("area-select");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("recipe-search");
const clearSearchButton = document.getElementById("clear-search");
const quickSearches = document.querySelector(".quick-searches");
const surpriseButton = document.getElementById("surprise-me");
const favoritesButton = document.getElementById("show-favorites");
const vegetarianToggle = document.getElementById("vegetarian-toggle");
const themeToggle = document.getElementById("theme-toggle");
const backButton = document.getElementById("back-to-browse");
const statusEl = document.getElementById("status");
const listEl = document.getElementById("meal-list");
const resultsTitle = document.getElementById("results-title");
const viewLabel = document.getElementById("view-label");
const loadMoreButton = document.getElementById("load-more");
const statTotal = document.getElementById("stat-total");
const statShown = document.getElementById("stat-shown");
const statFavorites = document.getElementById("stat-favorites");
const progressLabel = document.getElementById("progress-label");
const progressFill = document.getElementById("progress-fill");

const dialog = document.getElementById("recipe-dialog");
const closeDialogButton = document.getElementById("close-dialog");
const detailImage = document.getElementById("detail-image");
const detailArea = document.getElementById("detail-area");
const detailTitle = document.getElementById("detail-title");
const detailFavorite = document.getElementById("detail-favorite");
const detailFacts = document.getElementById("detail-facts");
const detailIngredients = document.getElementById("detail-ingredients");
const detailInstructions = document.getElementById("detail-instructions");
const detailVideo = document.getElementById("detail-video");

let currentMeals = [];
let visibleCount = PAGE_SIZE;
let currentView = "browse";
let selectedArea = DEFAULT_AREA;
let lastSearchQuery = "";
let activeMeal = null;
let favorites = loadFavorites();
let vegetarianOnly = localStorage.getItem(VEGETARIAN_KEY) === "true";
let currentTheme = localStorage.getItem(THEME_KEY) || "light";

function loadFavorites() {
  const saved = localStorage.getItem(FAVORITES_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not read saved favorites.", error);
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  updateFavoritesButton();
}

function setStatus(message) {
  statusEl.textContent = message;
  statusEl.classList.toggle(
    "loading",
    /^(Loading|Searching|Checking|Saving|Finding)/.test(message)
  );
}

function updateFavoritesButton() {
  favoritesButton.textContent = `Favorites (${favorites.length})`;
  statFavorites.textContent = favorites.length;
}

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

function updateVegetarianToggle() {
  vegetarianToggle.checked = vegetarianOnly;
}

function resetResultsDisplay() {
  visibleCount = PAGE_SIZE;
  renderCurrentMeals();
}

function renderCurrentMeals() {
  const visibleMeals = currentMeals.slice(0, visibleCount);
  renderMeals(visibleMeals);
  updateStats(visibleMeals.length);
  updateLoadMoreButton();
}

function updateStats(shownCount) {
  const total = currentMeals.length;
  const safeShownCount = Math.min(shownCount, total);
  const percentage = total ? Math.round((safeShownCount / total) * 100) : 0;

  statTotal.textContent = total;
  statShown.textContent = safeShownCount;
  statFavorites.textContent = favorites.length;
  progressLabel.textContent = `Showing ${safeShownCount} of ${total}`;
  progressFill.style.width = `${percentage}%`;
}

function updateLoadMoreButton() {
  loadMoreButton.classList.toggle("hidden", visibleCount >= currentMeals.length);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? "The API is rate limiting requests."
        : `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

function getApiErrorMessage(action, error) {
  if (error.message.includes("rate limiting")) {
    return "The API is rate limiting requests. Wait a minute and try again.";
  }

  return `Something went wrong ${action}.`;
}

async function lookupMealDetails(id) {
  const data = await fetchJson(`${API_BASE}/lookup.php?i=${id}`);
  return data.meals ? data.meals[0] : null;
}

async function applyVegetarianFilter(meals) {
  if (!vegetarianOnly) {
    return meals;
  }

  if (!meals.length) {
    return [];
  }

  setStatus("Checking for vegetarian recipes...");

  const detailedMeals = await Promise.all(
    meals.map(async (meal) => {
      if (meal.strCategory) {
        return meal;
      }

      try {
        return lookupMealDetails(meal.idMeal);
      } catch (error) {
        console.error(`Could not check vegetarian status for ${meal.strMeal}.`, error);
        return null;
      }
    })
  );

  return detailedMeals.filter((meal) => meal && meal.strCategory === "Vegetarian");
}

function loadAreas() {
  areaSelect.disabled = true;

  areaSelect.innerHTML = CUISINE_OPTIONS
    .map((area) => `<option value="${escapeHtml(area.value)}">${escapeHtml(area.label)}</option>`)
    .join("");

  selectedArea = CUISINE_OPTIONS.some((area) => area.value === DEFAULT_AREA)
    ? DEFAULT_AREA
    : CUISINE_OPTIONS[0].value;
  areaSelect.value = selectedArea;
  areaSelect.disabled = false;
  loadMealsByArea(selectedArea);
}

async function loadMealsByArea(area) {
  currentView = "browse";
  selectedArea = area;
  lastSearchQuery = "";
  searchInput.value = "";
  clearSearchButton.classList.add("hidden");
  backButton.classList.add("hidden");
  viewLabel.textContent = "Browse";
  resultsTitle.textContent = `${area} recipes`;
  setStatus(`Loading ${area} recipes...`);

  try {
    const data = await fetchJson(`${API_BASE}/filter.php?a=${encodeURIComponent(area)}`);
    currentMeals = await applyVegetarianFilter(data.meals || []);
    setStatus("");
    resetResultsDisplay();
  } catch (error) {
    console.error(error);
    currentMeals = [];
    resetResultsDisplay();
    setStatus(getApiErrorMessage("loading recipes for this cuisine", error));
  }
}

async function searchMealsByName(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    setStatus("Type a recipe name or ingredient idea to search.");
    searchInput.focus();
    return;
  }

  currentView = "search";
  lastSearchQuery = trimmedQuery;
  backButton.classList.remove("hidden");
  clearSearchButton.classList.remove("hidden");
  viewLabel.textContent = "Search";
  resultsTitle.textContent = `Results for "${trimmedQuery}"`;
  setStatus(`Searching for ${trimmedQuery} recipes...`);

  try {
    const data = await fetchJson(`${API_BASE}/search.php?s=${encodeURIComponent(trimmedQuery)}`);
    currentMeals = await applyVegetarianFilter(data.meals || []);
    setStatus("");
    resetResultsDisplay();
  } catch (error) {
    console.error(error);
    currentMeals = [];
    resetResultsDisplay();
    setStatus(getApiErrorMessage("searching for recipes", error));
  }
}

async function loadRandomMeal() {
  currentView = "surprise";
  lastSearchQuery = "";
  searchInput.value = "";
  clearSearchButton.classList.add("hidden");
  backButton.classList.remove("hidden");
  viewLabel.textContent = "Surprise";
  resultsTitle.textContent = vegetarianOnly ? "Vegetarian surprise recipe" : "Surprise recipe";
  setStatus("Finding a surprise recipe...");

  try {
    let randomMeal = null;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const data = await fetchJson(`${API_BASE}/random.php`);
      const meal = data.meals ? data.meals[0] : null;

      if (meal && (!vegetarianOnly || meal.strCategory === "Vegetarian")) {
        randomMeal = meal;
        break;
      }
    }

    currentMeals = randomMeal ? [randomMeal] : [];
    setStatus(randomMeal ? "" : "Could not find a vegetarian surprise recipe. Try again or turn off the vegetarian filter.");
    resetResultsDisplay();
  } catch (error) {
    console.error(error);
    currentMeals = [];
    resetResultsDisplay();
    setStatus(getApiErrorMessage("finding a surprise recipe", error));
  }
}

function renderMeals(meals) {
  listEl.innerHTML = "";

  if (!meals.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const message =
      currentView === "favorites"
        ? vegetarianOnly
          ? "No vegetarian favorites are saved yet. Save a vegetarian recipe to add one here."
          : "No favorites saved yet. Browse a cuisine and save a recipe to build your travel list."
        : currentView === "search"
          ? vegetarianOnly
            ? "No vegetarian recipes matched that search. Try a broader word like pasta, rice, soup, or cake."
            : "No recipes matched that search. Try a broader word like chicken, rice, pasta, or cake."
        : vegetarianOnly
          ? "No vegetarian meals found for this cuisine. Try another cuisine or turn off the vegetarian filter."
          : "No meals found for this cuisine yet. Try another option from the dropdown.";
    const suggestions = vegetarianOnly
      ? ["pasta", "rice", "soup", "cake"]
      : ["chicken", "pasta", "rice", "cake"];

    empty.innerHTML = `
      <p>${escapeHtml(message)}</p>
      <div class="empty-actions">
        ${suggestions.map((term) => `<button type="button" data-suggestion="${escapeHtml(term)}">${escapeHtml(term)}</button>`).join("")}
      </div>
    `;
    listEl.appendChild(empty);
    return;
  }

  meals.forEach((meal) => {
    const card = document.createElement("article");
    card.className = "meal-card";

    const isFavorite = favorites.some((favorite) => favorite.idMeal === meal.idMeal);
    const areaText = meal.strArea || selectedArea || "Cuisine";

    card.innerHTML = `
      <img src="${escapeHtml(meal.strMealThumb)}" alt="${escapeHtml(meal.strMeal)}" />
      <div class="card-body">
        <p>${escapeHtml(areaText)}</p>
        <h3>${escapeHtml(meal.strMeal)}</h3>
        <div class="card-actions">
          <button type="button" data-action="details" data-id="${escapeHtml(meal.idMeal)}">
            View recipe
          </button>
          <button type="button" class="secondary" data-action="favorite" data-id="${escapeHtml(meal.idMeal)}">
            ${isFavorite ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    `;

    listEl.appendChild(card);
  });
}

async function openRecipe(id) {
  setStatus("Loading recipe details...");

  try {
    activeMeal = await lookupMealDetails(id);
    if (!activeMeal) {
      throw new Error("Recipe detail was not found.");
    }
    setStatus("");
    renderRecipeDetail(activeMeal);
    dialog.showModal();
  } catch (error) {
    console.error(error);
    setStatus(getApiErrorMessage("loading that recipe", error));
  }
}

function renderRecipeDetail(meal) {
  const isFavorite = favorites.some((favorite) => favorite.idMeal === meal.idMeal);
  const ingredients = getIngredients(meal);

  detailImage.src = meal.strMealThumb;
  detailImage.alt = meal.strMeal;
  detailArea.textContent = meal.strArea || selectedArea || "Recipe";
  detailTitle.textContent = meal.strMeal;
  detailFavorite.textContent = isFavorite ? "Remove from favorites" : "Save to favorites";
  detailFavorite.dataset.id = meal.idMeal;
  detailFacts.innerHTML = `
    <div>
      <dt>Category</dt>
      <dd>${escapeHtml(meal.strCategory || "Recipe")}</dd>
    </div>
    <div>
      <dt>Ingredients</dt>
      <dd>${ingredients.length}</dd>
    </div>
    <div>
      <dt>Video</dt>
      <dd>${meal.strYoutube ? "Available" : "Not listed"}</dd>
    </div>
  `;
  detailIngredients.innerHTML = ingredients
    .map((ingredient) => `<li>${escapeHtml(ingredient)}</li>`)
    .join("");
  detailInstructions.textContent = meal.strInstructions || "No instructions available.";

  if (meal.strYoutube) {
    detailVideo.href = meal.strYoutube;
    detailVideo.classList.remove("hidden");
  } else {
    detailVideo.classList.add("hidden");
  }
}

function getIngredients(meal) {
  const ingredients = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`];
    const measure = meal[`strMeasure${index}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim());
    }
  }

  return ingredients;
}

async function toggleFavorite(meal) {
  const existingIndex = favorites.findIndex((favorite) => favorite.idMeal === meal.idMeal);

  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1);
  } else {
    let mealToSave = meal;

    if (!mealToSave.strCategory) {
      try {
        setStatus("Saving favorite...");
        mealToSave = await lookupMealDetails(meal.idMeal) || meal;
        setStatus("");
      } catch (error) {
        console.error("Could not enrich favorite details.", error);
        setStatus("");
      }
    }

    favorites.push({
      idMeal: mealToSave.idMeal,
      strMeal: mealToSave.strMeal,
      strMealThumb: mealToSave.strMealThumb,
      strArea: mealToSave.strArea || selectedArea,
      strCategory: mealToSave.strCategory || ""
    });
  }

  saveFavorites();

  if (currentView === "favorites") {
    currentMeals = getVisibleFavorites();
  }

  renderCurrentMeals();

  if (activeMeal && activeMeal.idMeal === meal.idMeal) {
    renderRecipeDetail(activeMeal);
  }
}

function showFavorites() {
  currentView = "favorites";
  currentMeals = getVisibleFavorites();
  clearSearchButton.classList.add("hidden");
  viewLabel.textContent = "Saved";
  resultsTitle.textContent = "Favorite recipes";
  backButton.classList.remove("hidden");
  setStatus("");
  resetResultsDisplay();
}

function getVisibleFavorites() {
  return vegetarianOnly
    ? favorites.filter((meal) => meal.strCategory === "Vegetarian")
    : favorites;
}

updateFavoritesButton();
updateVegetarianToggle();
applyTheme(currentTheme);

areaSelect.addEventListener("change", (event) => {
  loadMealsByArea(event.target.value);
});

favoritesButton.addEventListener("click", showFavorites);

backButton.addEventListener("click", () => {
  loadMealsByArea(selectedArea);
});

vegetarianToggle.addEventListener("change", () => {
  vegetarianOnly = vegetarianToggle.checked;
  localStorage.setItem(VEGETARIAN_KEY, String(vegetarianOnly));

  if (currentView === "search" && lastSearchQuery) {
    searchMealsByName(lastSearchQuery);
  } else if (currentView === "favorites") {
    showFavorites();
  } else {
    loadMealsByArea(selectedArea);
  }
});

themeToggle.addEventListener("click", () => {
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

surpriseButton.addEventListener("click", loadRandomMeal);

loadMoreButton.addEventListener("click", () => {
  visibleCount += PAGE_SIZE;
  renderCurrentMeals();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchMealsByName(searchInput.value);
});

clearSearchButton.addEventListener("click", () => {
  loadMealsByArea(selectedArea);
});

quickSearches.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-search]");

  if (!button) {
    return;
  }

  searchInput.value = button.dataset.search;
  searchMealsByName(button.dataset.search);
});

listEl.addEventListener("click", async (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.suggestion) {
    searchInput.value = button.dataset.suggestion;
    await searchMealsByName(button.dataset.suggestion);
    return;
  }

  const meal = [...currentMeals, ...favorites].find((item) => item.idMeal === button.dataset.id);

  if (!meal) {
    return;
  }

  if (button.dataset.action === "details") {
    openRecipe(meal.idMeal);
  }

  if (button.dataset.action === "favorite") {
    await toggleFavorite(meal);
  }
});

detailFavorite.addEventListener("click", async () => {
  if (activeMeal) {
    await toggleFavorite(activeMeal);
  }
});

closeDialogButton.addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

loadAreas();
