const form = document.querySelector("#catalog-form");
const searchInput = document.querySelector("#catalog-search");
const filters = [...form.querySelectorAll("select")];
const cards = [...document.querySelectorAll(".catalog-card")];
const resultCount = document.querySelector("#result-count");
const clearButton = document.querySelector("#clear-filters");
const emptyState = document.querySelector("#empty-state");
const emptyClearButton = emptyState.querySelector("button");

function normalized(value) {
  return value.trim().toLocaleLowerCase();
}

function cardMatches(card, query, selectedFilters) {
  const searchableText = normalized(`${card.dataset.title} ${card.dataset.description}`);
  const matchesSearch = !query || searchableText.includes(query);
  const matchesFilters = selectedFilters.every(
    ([name, value]) => !value || card.dataset[name] === value,
  );

  return matchesSearch && matchesFilters;
}

function updateCatalog() {
  const query = normalized(searchInput.value);
  const selectedFilters = filters.map((filter) => [filter.name, filter.value]);
  let visibleCount = 0;

  cards.forEach((card) => {
    const isVisible = cardMatches(card, query, selectedFilters);
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  filters.forEach((filter) => {
    filter.classList.toggle("is-active", Boolean(filter.value));
  });

  const hasFilters = Boolean(query) || selectedFilters.some(([, value]) => Boolean(value));
  resultCount.textContent = String(visibleCount);
  clearButton.hidden = !hasFilters;
  emptyState.hidden = visibleCount !== 0;
}

function clearCatalog() {
  form.reset();
  updateCatalog();
  searchInput.focus();
}

form.addEventListener("input", updateCatalog);
form.addEventListener("change", updateCatalog);
form.addEventListener("submit", (event) => event.preventDefault());
clearButton.addEventListener("click", clearCatalog);
emptyClearButton.addEventListener("click", clearCatalog);
