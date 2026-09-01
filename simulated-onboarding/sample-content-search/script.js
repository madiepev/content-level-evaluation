const DATA_URL = "../../content-data/AI_ML_Representative_Sample_100.csv";
const PAGE_SIZE = 12;
const LEVEL_ORDER = ["Beginner", "Intermediate", "Proficient", "Advanced", "Expert"];
const ROLE_ORDER = [
  "Executive",
  "Developer",
  "IT professional",
  "Data professional",
  "Security professional",
  "Sales",
  "Marketing",
  "Customer service",
  "Faculty",
  "Student",
];
const CREDENTIAL_RULES = [
  {
    name: "SC-401: Microsoft Information Security Administrator",
    pattern: /\bsc-401\b/i,
  },
  {
    name: "MS-102: Microsoft 365 Administrator",
    pattern: /\bms-102\b/i,
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    pattern: /certified kubernetes administrator|\bcka\b/i,
  },
];
const ROLE_RULES = [
  { name: "Faculty", pattern: /classroom|teacher|instructional coach|faculty|educator/i },
  { name: "Student", pattern: /\bstudent|learner/i },
  { name: "Marketing", pattern: /marketing/i },
  {
    name: "Customer service",
    pattern: /customer service|customer success|contact cent(?:er|re)|dragon medical|dax consultant|nuance/i,
  },
  { name: "Sales", pattern: /\bsales|presales|account planning|opportunity management/i },
  {
    name: "Security professional",
    pattern: /security|defender|purview|identity|vulnerabilit|compliance|threat/i,
  },
  {
    name: "Data professional",
    pattern: /machine learning|data science|data engineer|data pipeline|analytics|data storage|\brag\b/i,
  },
  {
    name: "Developer",
    pattern: /developer|development|\.net|programming|\bapi\b|source code|application development/i,
  },
  {
    name: "IT professional",
    pattern: /administrator|architecture|architect|infrastructure|cloud|storage|kubernetes|operations|migration/i,
  },
  {
    name: "Executive",
    pattern: /executive|leader|leadership|strategy|business transformation|manager/i,
  },
];

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

function recordText(record) {
  return [
    record["Course[Course Title]"],
    record["Course[Description]"],
    record.Product,
    record.Skill,
    record.Skilling,
    record.Sub_Category,
  ].join(" ");
}

function credentialFor(record) {
  const text = recordText(record);
  return CREDENTIAL_RULES.find((rule) => rule.pattern.test(text))?.name ?? "No credential";
}

function rolesFor(record) {
  const text = recordText(record);
  const roles = ROLE_RULES.filter((rule) => rule.pattern.test(text)).map((rule) => rule.name);
  return roles.length ? roles : ["IT professional"];
}

function formatFor(record) {
  return record["Course[Modality]"] === "LearningPath" ? "Learning path" : "Course";
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
  addOptions("#credential-filter", records.map(credentialFor), ["No credential"]);
  addOptions("#format-filter", records.map(formatFor));
  addOptions("#level-filter", records.map((record) => record.Content_Level), LEVEL_ORDER);
  addOptions("#role-filter", records.flatMap(rolesFor), ROLE_ORDER);
}

function matchesRecord(record, query, selectedFilters) {
  const searchableText = normalized(recordText(record));

  const recordValues = {
    credential: credentialFor(record),
    format: formatFor(record),
    level: record.Content_Level,
    role: rolesFor(record),
    duration: durationBucket(record),
  };

  return (
    (!query || searchableText.includes(query)) &&
    selectedFilters.every(
      ([name, value]) =>
        !value ||
        (Array.isArray(recordValues[name])
          ? recordValues[name].includes(value)
          : recordValues[name] === value),
    )
  );
}

function createCard(record) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const title = record["Course[Course Title]"];

  card.querySelector(".format").textContent = formatFor(record);
  card.querySelector(".duration").textContent = displayDuration(record);
  card.querySelector(".level").textContent = `${record.Skill_Level}: ${record.Content_Level}`;
  card.querySelector("h3").textContent = title;
  card.querySelector("p").textContent = record["Course[Description]"];
  card.querySelector(".skill-tag").textContent = record.Skill;
  card.querySelector(".credential-tag").textContent = credentialFor(record);

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
