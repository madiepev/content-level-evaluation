const PATH_DATA_URL = "../../content-data/learning-paths-with-foundry-modules.csv";

const routeView = document.querySelector("#route-view");
const resultsView = document.querySelector("#results-view");
const resultsTitle = document.querySelector("#results-title");
const resultsDescription = document.querySelector("#results-description");
const loadingState = document.querySelector("#loading-state");
const themeList = document.querySelector("#theme-list");
const portfolioToggle = document.querySelector("#portfolio-toggle");
const themeTemplate = document.querySelector("#theme-template");
const pathTemplate = document.querySelector("#path-template");
const plannedPathTemplate = document.querySelector("#planned-path-template");
const plannedCardTemplate = document.querySelector("#planned-card-template");
const moduleTemplate = document.querySelector("#module-template");

let currentPaths = [];
let activePortfolioView = "current";

const credentials = [
  {
    name: "Microsoft Certification exams",
    description: "Prepare for current exams that assess Foundry development, operations, and architecture.",
    items: [
      {
        title: "AI-103: Developing AI Apps and Agents on Azure",
        meta: "Azure AI engineer",
        description: "Build, manage, and deploy agents and AI solutions with Microsoft Foundry.",
        url: "https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-103",
      },
      {
        title: "AI-300: Operationalizing Machine Learning and Generative AI Solutions",
        meta: "AI operations",
        description: "Implement MLOps and GenAIOps infrastructure, quality assurance, and observability.",
        url: "https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-300",
      },
      {
        title: "AI-500: Designing and Implementing Multi-Agent AI Solutions",
        meta: "Expert-level multi-agent AI",
        description: "Architect, build, evaluate, secure, govern, and deploy production multi-agent systems.",
        url: "https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-500",
      },
    ],
  },
  {
    name: "Microsoft Applied Skills",
    description: "Demonstrate a focused Foundry skill through an interactive, scenario-based assessment.",
    items: [
      {
        title: "Create an AI agent with Microsoft Foundry",
        meta: "Applied Skill",
        description: "Build and configure an AI agent by using Microsoft Foundry.",
        url: "https://learn.microsoft.com/training/paths/apl-3031/",
      },
      {
        title: "Develop a generative AI chat app using the Microsoft Foundry SDK",
        meta: "Applied Skill",
        description: "Develop a generative AI application with the Microsoft Foundry SDK.",
        url: "https://learn.microsoft.com/training/paths/apl-3030/",
      },
    ],
  },
];

const taskDefinitions = [
  {
    name: "Secure AI solutions",
    description: "Protect AI workloads, interactions, identities, data, and infrastructure.",
    pattern: /secur|threat|defender|purview|authentication|authorization|rbac/i,
  },
  {
    name: "Govern and use AI responsibly",
    description: "Apply governance, responsible AI, policy, compliance, and cost controls.",
    pattern: /govern|responsible|policy|dlp|cost efficiency/i,
  },
  {
    name: "Operate and evaluate AI",
    description: "Deploy, monitor, evaluate, and improve AI applications and agents.",
    pattern: /operat|monitor|evaluate|deploy/i,
  },
  {
    name: "Build AI apps and agents",
    description: "Create AI applications, agents, multimodal solutions, and agent workflows.",
    pattern: /agent|generative ai|language|vision|visual data|postgresql|ai apps/i,
  },
  {
    name: "AI foundations",
    description: "Build foundational knowledge of AI concepts, capabilities, and terminology.",
    pattern: /ai concepts/i,
  },
  {
    name: "AI for business and industry",
    description: "Explore how AI supports business productivity, leadership, and industry outcomes.",
    pattern: /business productivity|leaders in|transform your business/i,
  },
  {
    name: "AI for educators",
    description: "Use AI responsibly to support teaching, training, accessibility, and learning.",
    pattern: /education|special education|trainers/i,
  },
  {
    name: "Data and machine learning",
    description: "Develop data, analytics, machine learning, and Microsoft Fabric capabilities.",
    pattern: /sql server|azure data|databricks|tensorflow|microsoft fabric/i,
  },
  {
    name: "Mixed reality",
    description: "Create immersive experiences with mixed reality, HoloLens, Unity, and digital twins.",
    pattern: /mixed reality|hololens/i,
  },
  {
    name: "AI-ready infrastructure",
    description: "Prepare and manage infrastructure that supports production AI workloads.",
    pattern: /ai-ready infrastructure/i,
  },
  {
    name: "Other Foundry learning",
    description: "Explore additional learning paths that include Microsoft Foundry content.",
    pattern: /.*/,
  },
];

const plannedSecurityPath = {
  title: "Secure Microsoft Foundry solutions",
  description:
    "Build security skills from foundational AI workload risks through Foundry guardrails, environment hardening, threat response, data governance, and enterprise architecture.",
  modules: [
    {
      level: "L100",
      title: "Understand AI workload risks and protection in Azure",
      description:
        "Identify the security risks that exist in AI systems and the protections available in Azure.",
    },
    {
      level: "L200",
      title: "Configure content safety and guardrails in Microsoft Foundry",
      description:
        "Understand why guardrails are needed, then configure controls to protect model inputs and outputs.",
    },
    {
      level: "L300",
      title: "Secure Microsoft Foundry environments",
      description:
        "Harden a Microsoft Foundry environment by applying appropriate platform security controls.",
    },
    {
      level: "L300",
      title: "Protect and investigate AI workloads with Defender for Cloud",
      description:
        "Detect, investigate, and respond to threats against AI workloads with Microsoft Defender for Cloud.",
    },
    {
      level: "L300",
      title: "Govern data in developer AI apps with Microsoft Purview",
      description:
        "Protect and govern sensitive data used by developer AI applications and agents with Microsoft Purview.",
    },
    {
      level: "L400",
      title: "Design security architecture for enterprise AI platforms and agents",
      description:
        "Design how identity, networking, policy, data, deployment controls, and trust boundaries fit together.",
    },
  ],
};

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

function createCard(item, type) {
  const fragment = pathTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".path-card");

  card.href = item.url;
  card.setAttribute("aria-label", `Open ${item.title} on Microsoft Learn`);
  fragment.querySelector("strong").textContent = item.title;
  fragment.querySelector("em").textContent = item.meta;
  fragment.querySelector("small").textContent = item.description;
  fragment.querySelector(".path-link").innerHTML =
    `${type === "credential" ? "View credential" : "View learning path"} ` +
    '<b aria-hidden="true">→</b>';

  return fragment;
}

function renderThemes(themes, type) {
  themeList.replaceChildren();

  themes.forEach((theme) => {
    if (!theme.items.length) return;

    const fragment = themeTemplate.content.cloneNode(true);
    const grid = fragment.querySelector(".path-grid");
    fragment.querySelector("h2").textContent = theme.name;
    fragment.querySelector(".theme-heading p").textContent = theme.description;

    theme.items.forEach((item) => {
      grid.append(createCard(item, type));
    });

    themeList.append(fragment);
  });
}

function renderPlannedPath() {
  const fragment = plannedPathTemplate.content.cloneNode(true);
  const sequence = fragment.querySelector(".module-sequence");
  fragment.querySelector("h2").textContent = plannedSecurityPath.title;
  fragment.querySelector(".planned-path-heading p").textContent =
    plannedSecurityPath.description;
  fragment.querySelector(".planned-module-count").textContent =
    `${plannedSecurityPath.modules.length} planned modules`;

  plannedSecurityPath.modules.forEach((module) => {
    const moduleFragment = moduleTemplate.content.cloneNode(true);
    moduleFragment.querySelector(".module-level").textContent = module.level;
    moduleFragment.querySelector("h3").textContent = module.title;
    moduleFragment.querySelector("p").textContent = module.description;
    sequence.append(moduleFragment);
  });

  themeList.replaceChildren(fragment);
}

function renderPlannedOverview() {
  const themeFragment = themeTemplate.content.cloneNode(true);
  const grid = themeFragment.querySelector(".path-grid");
  const cardFragment = plannedCardTemplate.content.cloneNode(true);

  themeFragment.querySelector("h2").textContent = "Secure AI solutions";
  themeFragment.querySelector(".theme-heading p").textContent =
    "Preview a rationalized security path designed to replace overlapping Foundry content.";
  cardFragment.querySelector(".planned-path-card").dataset.openPlannedPath = "";
  cardFragment.querySelector("strong").textContent = plannedSecurityPath.title;
  cardFragment.querySelector("em").textContent =
    `${plannedSecurityPath.modules.length} modules · L100-L400`;
  cardFragment.querySelector("small").textContent = plannedSecurityPath.description;
  grid.append(cardFragment);
  themeList.replaceChildren(themeFragment);
}

function setPortfolioView(view) {
  activePortfolioView = view;
  portfolioToggle.querySelectorAll("[data-portfolio]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.portfolio === view));
  });

  if (view === "planned") {
    loadingState.hidden = true;
    renderPlannedOverview();
    return;
  }

  if (currentPaths.length) {
    loadingState.hidden = true;
    renderThemes(groupPaths(currentPaths), "path");
  } else {
    loadingState.hidden = false;
    themeList.replaceChildren();
  }
}

function groupPaths(paths) {
  const themes = taskDefinitions.map((definition) => ({ ...definition, items: [] }));

  paths.forEach((path) => {
    const theme = themes.find((definition) => definition.pattern.test(path.learning_path_title));
    const totalCount = Number(path.total_module_count);

    theme.items.push({
      title: path.learning_path_title,
      meta: `${totalCount} ${totalCount === 1 ? "module" : "modules"}`,
      description: path.description,
      url: path.live_url,
    });
  });

  return themes;
}

function showResults() {
  routeView.hidden = true;
  resultsView.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  resultsTitle.focus({ preventScroll: true });
}

async function showTasks() {
  portfolioToggle.hidden = false;
  resultsTitle.textContent = "What do you want to accomplish?";
  resultsDescription.textContent =
    "Explore current and planned Microsoft Foundry learning organized around common AI tasks and outcomes.";
  setPortfolioView("current");
  showResults();

  try {
    const response = await fetch(PATH_DATA_URL);
    if (!response.ok) throw new Error(`Learning paths could not be loaded (${response.status}).`);

    currentPaths = parseCsv(await response.text());
    if (activePortfolioView === "current") {
      renderThemes(groupPaths(currentPaths), "path");
      loadingState.hidden = true;
    }
  } catch (error) {
    loadingState.textContent =
      "Learning paths could not be loaded. Serve this site from the repository root to preview it.";
    console.error(error);
  }
}

function showCredentials() {
  portfolioToggle.hidden = true;
  resultsTitle.textContent = "Choose a Foundry credential";
  resultsDescription.textContent =
    "Select a certification exam or Applied Skill that matches the expertise you want to demonstrate.";
  loadingState.hidden = true;
  renderThemes(credentials, "credential");
  showResults();
}

document.querySelector(".route-grid").addEventListener("click", (event) => {
  const card = event.target.closest("[data-mode]");
  if (!card) return;
  if (card.dataset.mode === "tasks") {
    showTasks();
  } else {
    showCredentials();
  }
});

portfolioToggle.addEventListener("click", (event) => {
  const button = event.target.closest("[data-portfolio]");
  if (!button) return;
  setPortfolioView(button.dataset.portfolio);
});

themeList.addEventListener("click", (event) => {
  if (event.target.closest("[data-open-planned-path]")) {
    renderPlannedPath();
    return;
  }

  if (event.target.closest(".planned-detail-back")) {
    renderPlannedOverview();
  }
});

document.querySelector(".back-button").addEventListener("click", () => {
  resultsView.hidden = true;
  routeView.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("#route-title").focus({ preventScroll: true });
});
