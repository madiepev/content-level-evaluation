const DATA_URL = "../../content-data/AI_ML_Representative_Sample_100.csv";
const PAGE_SIZE = 12;
const LEVEL_ORDER = ["Beginner", "Intermediate", "Proficient", "Advanced", "Expert"];

const form = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const filters = [...form.querySelectorAll("select")];
const resultCount = document.querySelector("#result-count");
const clearButton = document.querySelector("#clear-filters");
const emptyState = document.querySelector("#empty-state");
const loadingState = document.querySelector("#loading-state");
const cardGrid = document.querySelector("#card-grid");
const showMoreButton = document.querySelector("#show-more");
const cardTemplate = document.querySelector("#result-card-template");

let records = [];
let filteredRecords = [];
let visibleLimit = PAGE_SIZE;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows;
  return dataRows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
}

function normalized(value) {
  return value.trim().toLocaleLowerCase();
}

function durationBucket(record) {
  const rawHours = record.Course_Hours || record["Course[Credit Hours]"];
  const hours = Number.parseFloat(rawHours);

  if (!Number.isFinite(hours)) return "Not specified";
  if (hours < 1) return "Under 1 hour";
  if (hours <= 3) return "1–3 hours";
  if (hours <= 6) return "3–6 hours";
  return "Over 6 hours";
}

function displayDuration(record) {
  const suppliedDuration = record["Course[CourseDuration]"].trim();
  if (suppliedDuration) return suppliedDuration;

  const hours = Number.parseFloat(record.Course_Hours);
  if (!Number.isFinite(hours)) return "Duration not specified";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours.toFixed(hours % 1 === 0 ? 0 : 1)}h`;
}

function addOptions(selectId, values, preferredOrder = []) {
  const select = document.querySelector(selectId);
  const sortedValues = [...new Set(values.filter(Boolean))].sort((first, second) => {
    const firstIndex = preferredOrder.indexOf(first);
    const secondIndex = preferredOrder.indexOf(second);
    if (firstIndex >= 0 || secondIndex >= 0) {
      return (firstIndex < 0 ? Infinity : firstIndex) - (secondIndex < 0 ? Infinity : secondIndex);
    }
    return first.localeCompare(second);
  });

  sortedValues.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function populateFilters() {
  addOptions("#skill-filter", records.map((record) => record.Skill));
  addOptions("#format-filter", records.map((record) => record["Course[Modality]"]));
  addOptions("#level-filter", records.map((record) => record.Content_Level), LEVEL_ORDER);
  addOptions(
    "#organization-filter",
    records.map((record) => record["Course[Hosted Training Organization]"] || "Not specified"),
  );
}

function matchesRecord(record, query, selectedFilters) {
  const searchableText = normalized(
    [
      record["Course[Course Title]"],
      record["Course[Description]"],
      record.Product,
      record.Skill,
      record.Skilling,
      record.Sub_Category,
      record["Course[Hosted Training Organization]"],
    ].join(" "),
  );

  const recordValues = {
    skill: record.Skill,
    format: record["Course[Modality]"],
    level: record.Content_Level,
    duration: durationBucket(record),
    organization: record["Course[Hosted Training Organization]"] || "Not specified",
  };

  return (
    (!query || searchableText.includes(query)) &&
    selectedFilters.every(([name, value]) => !value || recordValues[name] === value)
  );
}

function createCard(record) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const title = record["Course[Course Title]"];
  const organization = record["Course[Hosted Training Organization]"] || "Organization not specified";

  card.querySelector(".format").textContent = record["Course[Modality]"];
  card.querySelector(".duration").textContent = displayDuration(record);
  card.querySelector(".level").textContent = `${record.Skill_Level}: ${record.Content_Level}`;
  card.querySelector("h3").textContent = title;
  card.querySelector("p").textContent = record["Course[Description]"];
  card.querySelector(".skill-tag").textContent = record.Skill;
  card.querySelector(".organization-tag").textContent = organization;

  const link = card.querySelector("a");
  link.href = record["Course[Url]"];
  link.setAttribute("aria-label", `View ${title}`);

  return card;
}

function renderResults() {
  const visibleRecords = filteredRecords.slice(0, visibleLimit);
  cardGrid.replaceChildren(...visibleRecords.map(createCard));
  cardGrid.setAttribute("aria-busy", "false");
  resultCount.textContent = String(filteredRecords.length);
  emptyState.hidden = filteredRecords.length !== 0;
  showMoreButton.hidden = visibleLimit >= filteredRecords.length;
}

function updateSearch() {
  const query = normalized(searchInput.value);
  const selectedFilters = filters.map((filter) => [filter.name, filter.value]);

  filteredRecords = records.filter((record) => matchesRecord(record, query, selectedFilters));
  visibleLimit = PAGE_SIZE;

  filters.forEach((filter) => {
    filter.classList.toggle("is-active", Boolean(filter.value));
  });

  const hasFilters = Boolean(query) || selectedFilters.some(([, value]) => Boolean(value));
  clearButton.hidden = !hasFilters;
  renderResults();
}

function clearSearch() {
  form.reset();
  updateSearch();
  searchInput.focus();
}

async function loadRecords() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`The sample could not be loaded (${response.status}).`);

    records = parseCsv(await response.text());
    filteredRecords = records;
    populateFilters();
    loadingState.hidden = true;
    renderResults();
  } catch (error) {
    cardGrid.setAttribute("aria-busy", "false");
    resultCount.textContent = "0";
    loadingState.textContent =
      "The content sample could not be loaded. Serve this site from the repository root to preview it.";
    console.error(error);
  }
}

form.addEventListener("input", updateSearch);
form.addEventListener("change", updateSearch);
form.addEventListener("submit", (event) => event.preventDefault());
clearButton.addEventListener("click", clearSearch);
emptyState.querySelector("button").addEventListener("click", clearSearch);
showMoreButton.addEventListener("click", () => {
  visibleLimit += PAGE_SIZE;
  renderResults();
});

loadRecords();
