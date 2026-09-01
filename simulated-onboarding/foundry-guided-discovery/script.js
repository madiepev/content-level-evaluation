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
  id: "security",
  theme: "Secure AI solutions",
  title: "Secure Microsoft Foundry solutions",
  description:
    "Build security skills from foundational AI workload risks through Foundry guardrails, environment hardening, threat response, data governance, and enterprise architecture.",
  modules: [
    {
      level: "L100",
      certification: "AI-103",
      title: "Understand AI workload risks and protection in Azure",
      description:
        "Identify the security risks that exist in AI systems and the protections available in Azure.",
    },
    {
      level: "L200",
      certification: "AI-103",
      title: "Configure content safety and guardrails in Microsoft Foundry",
      description:
        "Understand why guardrails are needed, then configure controls to protect model inputs and outputs.",
    },
    {
      level: "L300",
      certification: "AI-300",
      title: "Secure Microsoft Foundry environments",
      description:
        "Harden a Microsoft Foundry environment by applying appropriate platform security controls.",
    },
    {
      level: "L300",
      certification: "SC-500",
      title: "Protect and investigate AI workloads with Defender for Cloud",
      description:
        "Detect, investigate, and respond to threats against AI workloads with Microsoft Defender for Cloud.",
    },
    {
      level: "L300",
      certification: "SC-500",
      title: "Govern data in developer AI apps with Microsoft Purview",
      description:
        "Protect and govern sensitive data used by developer AI applications and agents with Microsoft Purview.",
    },
    {
      level: "L400",
      certification: "AI-500",
      title: "Design security architecture for enterprise AI platforms and agents",
      description:
        "Design how identity, networking, policy, data, deployment controls, and trust boundaries fit together.",
    },
  ],
};

const plannedGovernancePath = {
  id: "governance",
  theme: "Govern AI solutions",
  title: "Govern Microsoft Foundry solutions",
  description:
    "Build governance skills from foundational concepts and platform controls to enterprise policy, responsible AI, compliance, and agent lifecycle governance.",
  modules: [
    {
      level: "L100",
      certification: "AI-103",
      title: "Understand governance for AI workloads in Microsoft Foundry",
      description:
        "Recognize why AI workloads require governance and identify foundational policy, risk, compliance, and accountability concepts.",
    },
    {
      level: "L200",
      certification: "AI-300",
      title: "Apply governance controls to Microsoft Foundry workloads",
      description:
        "Configure platform controls and governed release practices for individual AI applications and workloads.",
    },
    {
      level: "L400",
      certification: "AI-500",
      title: "Design governance architecture for enterprise AI platforms",
      description:
        "Design policy, identity, networking, data, deployment, and compliance boundaries for enterprise AI platforms.",
    },
    {
      level: "L400",
      certification: "AI-500",
      title: "Scale responsible AI governance in Microsoft Foundry",
      description:
        "Design scalable responsible AI governance with content safety, evaluation, oversight, and organization-wide controls.",
    },
    {
      level: "L400",
      certification: "AI-500",
      title: "Govern data across enterprise AI applications and agents",
      description:
        "Design data protection, lifecycle, access, and compliance controls across AI applications, agents, and shared knowledge sources, with Microsoft Purview cross-references.",
    },
    {
      level: "L400",
      certification: "AI-500",
      title: "Govern the enterprise agent lifecycle in Microsoft Foundry",
      description:
        "Establish governance for agent design, approval, deployment, monitoring, change, and retirement across the enterprise.",
    },
  ],
};

const plannedEvaluationPath = {
  id: "evaluation",
  theme: "Evaluate AI systems",
  title: "Evaluate and operationalize generative AI systems",
  description:
    "Build evaluation skills from foundational concepts through GenAIOps practices and advanced multi-agent orchestration, with modules spanning AI-103, AI-300, and AI-500.",
  modules: [
    {
      level: "L200",
      certification: "AI-103",
      title: "Understand evaluation for generative AI apps and agents",
      description:
        "Explain why evaluation is needed, distinguish common quality, safety, groundedness, and agent metrics, and run a basic evaluation in Microsoft Foundry.",
    },
    {
      level: "L200",
      certification: "AI-103",
      title: "Monitor generative AI apps and agents",
      description:
        "Integrate monitoring into a deployed app or agent, then interpret traces, token usage, safety signals, latency, drift, and errors in Microsoft Foundry.",
    },
    {
      level: "L300",
      certification: "AI-300",
      title: "Design an evaluation strategy",
      description:
        "Convert requirements into assertions, create representative test datasets, select quality, safety, RAG, and agent metrics, and define human and automated evaluation roles. Lab: Create an evaluation specification and test suite for an agent.",
    },
    {
      level: "L400",
      certification: "AI-300",
      title: "Build and calibrate evaluation pipelines",
      description:
        "Configure built-in and custom evaluators, implement human evaluation and LLM-as-judge, calibrate automated judges, and add quality gates to CI/CD. Lab: Calibrate an evaluator and block a failing release.",
    },
    {
      level: "L400",
      certification: "AI-300",
      title: "Evaluate and optimize GenAI apps and agents",
      description:
        "Diagnose prompt, retrieval, grounding, tool-use, and orchestration failures; compare complete agent trajectories; and optimize quality, latency, and cost. Lab: Compare two agent versions and implement an improvement.",
    },
    {
      level: "L300",
      certification: "AI-300",
      title: "Monitor and observe production GenAI systems",
      description:
        "Implement continuous monitoring, detailed logging, tracing, debugging, alerts, and drift detection, then feed production signals back into evaluation datasets and regression tests. Lab: Trace a production failure and add a regression test.",
    },
    {
      level: "L400",
      certification: "AI-500",
      title: "Design an evaluation strategy for multi-agent orchestration",
      description:
        "Define system-level success criteria, per-agent responsibilities, coordination metrics, failure taxonomies, and representative multi-agent test scenarios.",
    },
    {
      level: "L400",
      certification: "AI-500",
      title: "Evaluate multi-agent trajectories, tools, and coordination",
      description:
        "Assess agent handoffs, routing, tool use, shared context, memory, loops, recovery behavior, and complete workflow trajectories.",
    },
    {
      level: "L400",
      certification: "AI-500",
      title: "Monitor and improve production multi-agent systems",
      description:
        "Correlate traces across agents and services, monitor agent health, coordination, availability, quality regression, and cost, and design remediation for recurring failure patterns.",
    },
  ],
};

const plannedCostEfficiencyPath = {
  id: "cost-efficiency",
  theme: "Optimize AI investments",
  title: "Maximize the Cost Efficiency of AI Agents on Azure",
  description:
    "Maximize the ROI of AI agent investments by identifying high-impact use cases, understanding cost drivers, forecasting returns, selecting efficient development approaches, designing scalable architectures, and optimizing ongoing investments.",
  modules: [
    {
      level: "L300",
      title: "Identify and Prioritize High-Impact AI Agent Use Cases",
      description:
        "Research potential applications, define business needs and measurable KPIs, assess feasibility, and prioritize quick wins with strong potential value.",
    },
    {
      level: "L100",
      title: "Understand the key cost drivers of AI agents",
      description:
        "Identify infrastructure, licensing, development, integration, data preparation, staffing, and ongoing operational costs for AI agents.",
    },
    {
      level: "L400",
      title: "Forecast the return on investment (ROI) of AI agents",
      description:
        "Quantify financial and strategic value with ROI and net present value, apply sensitivity analysis, prioritize investments, and build a business case.",
    },
    {
      level: "L300",
      title: "Implement best practices to empower AI agent efficiency and ensure long-term success",
      description:
        "Apply relevant practices from AI Centers of Excellence, FinOps, GenAIOps, the Cloud Adoption Framework, and the Well-Architected Framework.",
    },
    {
      level: "L400",
      title: "Maximize cost efficiency by choosing the right AI agent development approach on Azure",
      description:
        "Evaluate hosting, customization, time-to-value, complexity, and operational-cost tradeoffs to choose between prebuilt, low-code, and pro-code approaches.",
    },
    {
      level: "L400",
      title: "Architect scalable and cost-efficient AI agent solutions on Azure",
      description:
        "Evaluate reference architectures and orchestration patterns, then design scalable single-agent and multi-agent solutions aligned with financial goals.",
    },
    {
      level: "L300",
      title: "Manage and optimize AI agent investments on Azure",
      description:
        "Monitor agent usage and performance, create budgets, quotas, and alerts, detect anomalies, and optimize ongoing spending.",
    },
  ],
};

const plannedPaths = [
  plannedSecurityPath,
  plannedGovernancePath,
  plannedEvaluationPath,
  plannedCostEfficiencyPath,
];

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

function renderPlannedPath(path) {
  const fragment = plannedPathTemplate.content.cloneNode(true);
  const sequence = fragment.querySelector(".module-sequence");
  fragment.querySelector("h2").textContent = path.title;
  fragment.querySelector(".planned-path-heading p").textContent =
    path.description;
  fragment.querySelector(".planned-module-count").textContent =
    `${path.modules.length} planned modules`;

  path.modules.forEach((module) => {
    const moduleFragment = moduleTemplate.content.cloneNode(true);
    moduleFragment.querySelector(".module-level").textContent = module.level;
    moduleFragment.querySelector(".module-cert").textContent =
      module.certification || "No cert";
    moduleFragment.querySelector("h3").textContent = module.title;
    moduleFragment.querySelector("p").textContent = module.description;
    sequence.append(moduleFragment);
  });

  themeList.replaceChildren(fragment);
}

function renderPlannedOverview() {
  const themes = new Map();
  plannedPaths.forEach((path) => {
    if (!themes.has(path.theme)) themes.set(path.theme, []);
    themes.get(path.theme).push(path);
  });

  const fragments = [...themes.entries()].map(([theme, paths]) => {
    const themeFragment = themeTemplate.content.cloneNode(true);
    const grid = themeFragment.querySelector(".path-grid");

    themeFragment.querySelector("h2").textContent = theme;
    themeFragment.querySelector(".theme-heading p").textContent =
      `Preview the proposed ${theme.toLowerCase()} portfolio.`;

    paths.forEach((path) => {
      const cardFragment = plannedCardTemplate.content.cloneNode(true);
      const levels = path.modules
        .map((module) => Number(module.level.slice(1)))
        .sort((first, second) => first - second);
      const levelRange =
        levels[0] === levels.at(-1)
          ? `L${levels[0]}`
          : `L${levels[0]}-L${levels.at(-1)}`;

      cardFragment.querySelector(".planned-path-card").dataset.openPlannedPath = path.id;
      cardFragment.querySelector("strong").textContent = path.title;
      cardFragment.querySelector("em").textContent =
        `${path.modules.length} ${path.modules.length === 1 ? "module" : "modules"} · ${levelRange}`;
      cardFragment.querySelector("small").textContent = path.description;
      grid.append(cardFragment);
    });

    return themeFragment;
  });

  themeList.replaceChildren(...fragments);
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
  const plannedPathCard = event.target.closest("[data-open-planned-path]");
  if (plannedPathCard) {
    const path = plannedPaths.find(
      (candidate) => candidate.id === plannedPathCard.dataset.openPlannedPath,
    );
    renderPlannedPath(path);
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
