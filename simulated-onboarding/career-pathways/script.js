const views = {
  intent: document.querySelector("#intent-view"),
  route: document.querySelector("#route-view"),
  paths: document.querySelector("#paths-view"),
};

const selectedIntent = document.querySelector("#selected-intent");
const pathMode = document.querySelector("#path-mode");
const pathsDescription = document.querySelector("#paths-description");
const themeList = document.querySelector("#theme-list");
const themeTemplate = document.querySelector("#theme-template");
const pathTemplate = document.querySelector("#path-template");
const toast = document.querySelector("#toast");

const roleThemes = [
  {
    name: "Architecture and development",
    mark: "AD",
    paths: [
      ["Solutions architect", "You enjoy solving business problems with technology", "Design secure, scalable cloud solutions for business needs."],
      ["Cloud developer", "You enjoy building applications and writing code", "Build, test, and deploy cloud-native applications on Azure."],
      ["DevOps engineer", "You like improving how software reaches users", "Automate delivery, infrastructure, observability, and operations."],
    ],
  },
  {
    name: "Data and AI",
    mark: "DA",
    paths: [
      ["Data engineer", "You like building dependable data systems", "Design data pipelines, storage, processing, and analytics solutions."],
      ["AI engineer", "You want to build intelligent applications", "Create and evaluate AI solutions, agents, and responsible AI controls."],
      ["Data analyst", "You turn information into decisions", "Prepare, model, analyze, and visualize data with Microsoft tools."],
    ],
  },
  {
    name: "Infrastructure and security",
    mark: "IS",
    paths: [
      ["Azure administrator", "You keep cloud environments running", "Manage identity, governance, storage, compute, and virtual networks."],
      ["Security engineer", "You protect systems, identities, and data", "Implement threat protection and security controls across cloud workloads."],
      ["Network engineer", "You connect users, systems, and services", "Design and operate secure hybrid and cloud networking solutions."],
    ],
  },
  {
    name: "Business applications",
    mark: "BA",
    paths: [
      ["Power Platform developer", "You solve business problems with low code", "Build apps, automations, integrations, and reusable components."],
      ["Functional consultant", "You connect business needs to solutions", "Configure Microsoft business applications around real processes."],
      ["Customer experience specialist", "You improve sales and service journeys", "Use Dynamics 365 to support connected customer experiences."],
    ],
  },
];

const credentialThemes = [
  {
    name: "Architecture and development",
    mark: "AD",
    paths: [
      ["Azure Solutions Architect Expert", "Expert certification", "Prepare to design cloud and hybrid solutions on Microsoft Azure."],
      ["Azure Developer Associate", "Associate certification", "Prepare to develop, deploy, secure, and monitor Azure solutions."],
      ["DevOps Engineer Expert", "Expert certification", "Prepare to design and implement collaborative delivery practices."],
    ],
  },
  {
    name: "Data and AI",
    mark: "DA",
    paths: [
      ["Power BI Data Analyst Associate", "Associate certification", "Prepare to model, visualize, and analyze data with Power BI."],
      ["Azure Data Scientist Associate", "Associate certification", "Prepare to implement data science and machine learning workloads."],
      ["Azure AI Engineer Associate", "Associate certification", "Prepare to build and manage Azure AI solutions."],
    ],
  },
  {
    name: "Infrastructure and security",
    mark: "IS",
    paths: [
      ["Azure Administrator Associate", "Associate certification", "Prepare to implement, manage, and monitor an Azure environment."],
      ["Security Operations Analyst Associate", "Associate certification", "Prepare to investigate and respond to security threats."],
      ["Cybersecurity Architect Expert", "Expert certification", "Prepare to design security strategy and architecture."],
    ],
  },
  {
    name: "Business applications",
    mark: "BA",
    paths: [
      ["Power Platform Developer Associate", "Associate certification", "Prepare to design and build Power Platform solutions."],
      ["Power Platform Solution Architect Expert", "Expert certification", "Prepare to lead successful solution implementations."],
      ["Dynamics 365 Fundamentals", "Fundamentals certification", "Build foundational knowledge of Dynamics 365 applications."],
    ],
  },
];

let currentIntent = "Advance my career";
let toastTimer;

function showView(name) {
  Object.entries(views).forEach(([viewName, view]) => {
    view.hidden = viewName !== name;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  views[name].querySelector("h1").focus({ preventScroll: true });
}

function renderPaths(mode) {
  const themes = mode === "roles" ? roleThemes : credentialThemes;
  pathMode.textContent = mode === "roles" ? "Role-based learning" : "Microsoft credentials";
  pathsDescription.textContent =
    mode === "roles"
      ? "Select the path that best matches the role you want to pursue."
      : "Select a credential path to see focused preparation resources.";
  themeList.replaceChildren();

  themes.forEach((theme) => {
    const themeFragment = themeTemplate.content.cloneNode(true);
    const themeElement = themeFragment.querySelector(".theme");
    const grid = themeFragment.querySelector(".path-grid");
    themeFragment.querySelector("h2").textContent = theme.name;

    theme.paths.forEach(([title, fit, description]) => {
      const pathFragment = pathTemplate.content.cloneNode(true);
      const card = pathFragment.querySelector(".path-card");
      card.dataset.title = title;
      pathFragment.querySelector(".path-mark").textContent = theme.mark;
      pathFragment.querySelector("strong").textContent = title;
      pathFragment.querySelector("em").textContent = fit;
      pathFragment.querySelector("small").textContent = description;
      grid.append(pathFragment);
    });

    themeList.append(themeElement);
  });

  showView("paths");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

document.querySelector(".intent-grid").addEventListener("click", (event) => {
  const card = event.target.closest("[data-intent]");
  if (!card) return;
  currentIntent = card.dataset.intent;
  selectedIntent.textContent = currentIntent;
  showView("route");
});

document.querySelector(".route-grid").addEventListener("click", (event) => {
  const card = event.target.closest("[data-mode]");
  if (!card) return;
  renderPaths(card.dataset.mode);
});

document.addEventListener("click", (event) => {
  const backButton = event.target.closest("[data-back]");
  if (backButton) {
    showView(backButton.dataset.back);
    return;
  }

  const pathCard = event.target.closest(".path-card");
  if (pathCard) {
    showToast(`${pathCard.dataset.title} selected for ${currentIntent.toLowerCase()}.`);
  }
});
