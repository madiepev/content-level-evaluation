const MODULE_DATA_URL = "../../content-data/microsoft-foundry-modules.csv";
const LEARNING_PATH_DATA_URL = "../../content-data/learning-paths-with-foundry-modules.csv";
const PAGE_SIZE = 12;
const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];

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

let modules = [];
let filteredModules = [];
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

function valuesFor(value) {
  return (value || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinedValues(values) {
  return [...new Set(values.filter(Boolean))].join(";");
}

function displayLabel(value) {
  const names = {
    "ai-engineer": "AI engineer",
    "business-owner": "Business owner",
    "business-user": "Business user",
    "data-engineer": "Data engineer",
    "data-scientist": "Data scientist",
    "devops-engineer": "DevOps engineer",
    "higher-ed-educator": "Higher education educator",
    "k-12-educator": "K-12 educator",
    "school-leader": "School leader",
    "security-engineer": "Security engineer",
    "solution-architect": "Solution architect",
    "technology-manager": "Technology manager",
    "app-development": "App development",
    "artificial-intelligence": "Artificial intelligence",
    "cloud-computing": "Cloud computing",
    "cloud-security": "Cloud security",
    "data-analytics": "Data analytics",
    "data-engineering": "Data engineering",
    "data-integration": "Data integration",
    "data-management": "Data management",
    "generative-ai": "Generative AI",
    "machine-learning": "Machine learning",
    "microsoft-foundry": "Microsoft Foundry",
    "foundry-agent-service": "Foundry Agent Service",
    "foundry-tools": "Foundry Tools",
  };

  return names[value] ?? value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function addOptions(selectId, values, preferredOrder = []) {
  const select = document.querySelector(selectId);
  const uniqueValues = [...new Set(values.filter(Boolean))].sort((first, second) => {
    const firstIndex = preferredOrder.indexOf(first);
    const secondIndex = preferredOrder.indexOf(second);
    if (firstIndex >= 0 || secondIndex >= 0) {
      return (firstIndex < 0 ? Infinity : firstIndex) - (secondIndex < 0 ? Infinity : secondIndex);
    }
    return displayLabel(first).localeCompare(displayLabel(second));
  });

  uniqueValues.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = displayLabel(value);
    select.append(option);
  });
}

function populateFilters() {
  addOptions("#level-filter", modules.flatMap((module) => valuesFor(module.levels)), LEVEL_ORDER);
  addOptions("#role-filter", modules.flatMap((module) => valuesFor(module.roles)));
  addOptions("#product-filter", modules.flatMap((module) => valuesFor(module.products)));
  addOptions("#subject-filter", modules.flatMap((module) => valuesFor(module.subjects)));
}

function formatFor(module) {
  return module.format;
}

function searchableText(module) {
  return normalized(
    [
      module.title,
      module.roles,
      module.products,
      module.subjects,
      module.service,
      module.source,
      module.inclusion_reasons,
      module.foundry_module_titles,
      module.description,
    ].join(" "),
  );
}

function moduleMatches(module, query, selectedFilters) {
  const moduleValues = {
    level: valuesFor(module.levels),
    role: valuesFor(module.roles),
    product: valuesFor(module.products),
    subject: valuesFor(module.subjects),
    format: [formatFor(module)],
  };

  return (
    (!query || searchableText(module).includes(query)) &&
    selectedFilters.every(
      ([name, value]) => !value || moduleValues[name].includes(value),
    )
  );
}

function summarize(module) {
  if (formatFor(module) === "learning-path") {
    return module.description;
  }

  const roles = valuesFor(module.roles).slice(0, 3).map(displayLabel);
  const products = valuesFor(module.products).slice(0, 3).map(displayLabel);
  const audience = roles.length ? `For ${roles.join(", ")}.` : "";
  const coverage = products.length ? ` Covers ${products.join(", ")}.` : "";
  return `${audience}${coverage}`.trim();
}

function createCard(module) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const level = valuesFor(module.levels)[0];
  const role = valuesFor(module.roles)[0];
  const subject = valuesFor(module.subjects)[0] || "artificial-intelligence";
  const format = formatFor(module);
  const formatLabel = format === "learning-path" ? "Learning path" : "Module";

  card.querySelector(".format").textContent = formatLabel;
  card.querySelector(".level").textContent = displayLabel(level);
  card.querySelector(".service").textContent = displayLabel(module.service || "Microsoft Learn");
  card.querySelector("h3").textContent = module.title;
  card.querySelector(".module-summary").textContent = summarize(module);
  card.querySelector(".role-tag").textContent = displayLabel(role);
  card.querySelector(".subject-tag").textContent = displayLabel(subject);

  const link = card.querySelector("a");
  link.href = module.learn_url;
  link.innerHTML = `View ${formatLabel.toLowerCase()} <span aria-hidden="true">→</span>`;
  link.setAttribute("aria-label", `View ${module.title} on Microsoft Learn`);

  return card;
}

function renderResults() {
  const visibleModules = filteredModules.slice(0, visibleLimit);
  cardGrid.replaceChildren(...visibleModules.map(createCard));
  cardGrid.setAttribute("aria-busy", "false");
  resultCount.textContent = String(filteredModules.length);
  emptyState.hidden = filteredModules.length !== 0;
  showMoreButton.hidden = visibleLimit >= filteredModules.length;
}

function updateSearch() {
  const query = normalized(searchInput.value);
  const selectedFilters = filters.map((filter) => [filter.name, filter.value]);

  filteredModules = modules.filter((module) => moduleMatches(module, query, selectedFilters));
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

function createLearningPath(path, moduleByUid) {
  const includedModules = path.foundry_module_uids
    .split("|")
    .map((uid) => moduleByUid.get(uid.trim()))
    .filter(Boolean);

  return {
    uid: path.repository_path,
    title: path.learning_path_title,
    learn_url: path.live_url,
    levels:
      joinedValues(includedModules.flatMap((module) => valuesFor(module.levels))) || "intermediate",
    roles:
      joinedValues(includedModules.flatMap((module) => valuesFor(module.roles))) ||
      "ai-engineer;developer",
    products:
      joinedValues(includedModules.flatMap((module) => valuesFor(module.products))) ||
      "microsoft-foundry",
    subjects:
      joinedValues(includedModules.flatMap((module) => valuesFor(module.subjects))) ||
      "artificial-intelligence",
    service: "microsoft-foundry",
    source: "learning-paths",
    inclusion_reasons: "",
    foundry_module_count: path.foundry_module_count,
    total_module_count: path.total_module_count,
    foundry_module_titles: path.foundry_module_titles,
    description: path.description,
    format: "learning-path",
  };
}

async function loadModules() {
  try {
    const [moduleResponse, learningPathResponse] = await Promise.all([
      fetch(MODULE_DATA_URL),
      fetch(LEARNING_PATH_DATA_URL),
    ]);
    if (!moduleResponse.ok) {
      throw new Error(`The module catalog could not be loaded (${moduleResponse.status}).`);
    }
    if (!learningPathResponse.ok) {
      throw new Error(
        `The learning path catalog could not be loaded (${learningPathResponse.status}).`,
      );
    }

    const moduleRecords = parseCsv(await moduleResponse.text()).filter(
      (module) => normalized(module.hidden) !== "true",
    );
    moduleRecords.forEach((module) => {
      module.format = "module";
      module.foundry_module_titles = "";
    });

    const moduleByUid = new Map(moduleRecords.map((module) => [module.uid, module]));
    const learningPaths = parseCsv(await learningPathResponse.text()).map((path) =>
      createLearningPath(path, moduleByUid),
    );

    modules = [...moduleRecords, ...learningPaths];
    filteredModules = modules;
    populateFilters();
    loadingState.hidden = true;
    renderResults();
  } catch (error) {
    cardGrid.setAttribute("aria-busy", "false");
    loadingState.textContent =
      "The Foundry learning catalog could not be loaded. Serve this site from the repository root to preview it.";
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

loadModules();
