const onboardingView = document.querySelector("#onboarding-view");
const dashboardView = document.querySelector("#dashboard-view");
const personalizationForm = document.querySelector("#personalization-form");
const editPreferencesButton = document.querySelector("#edit-preferences");
const levelDescription = document.querySelector("#level-description");
const personalizedSummary = document.querySelector("#personalized-summary");
const steps = [...personalizationForm.querySelectorAll("fieldset[data-step]")];
const stepContainer = document.querySelector("#step");
const stepLabel = document.querySelector("#step-label");
const stepProgress = document.querySelector("#step-progress");
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");
const createButton = document.querySelector("#create-button");
const pathLevel = document.querySelector("#path-level");
const pathTitle = document.querySelector("#path-title");
const pathDescription = document.querySelector("#path-description");
const pathIcon = document.querySelector("#path-icon");
const pathDuration = document.querySelector("#path-duration");

const levelDescriptions = {
  Beginner: "Beginner: I'm new to the topic or just getting started.",
  Intermediate: "Intermediate: I understand the fundamentals and want to apply them in my work.",
  Advanced: "Advanced: I have extensive knowledge and want deeper, specialized content.",
};

const recommendations = {
  "Azure cloud": {
    icon: "△",
    title: "Build and operate solutions on Azure",
    description:
      "Build a strong Azure foundation, deploy common workloads, and apply security and reliability practices.",
    modules: "7 modules",
    duration: "5h 10m",
    format: "Mixed formats",
  },
  Security: {
    icon: "◉",
    title: "Secure identities, data, and cloud workloads",
    description:
      "Recognize common threats and apply identity, access, data protection, and cloud security controls.",
    modules: "6 modules",
    duration: "4h 35m",
    format: "Hands-on",
  },
  "Data and analytics": {
    icon: "▥",
    title: "Turn data into insights with Microsoft tools",
    description:
      "Prepare, model, analyze, and visualize data using a practical end-to-end analytics workflow.",
    modules: "8 modules",
    duration: "6h",
    format: "Mixed formats",
  },
  "Power Platform": {
    icon: "◇",
    title: "Build business solutions with Power Platform",
    description:
      "Create apps, automate processes, and turn business requirements into maintainable low-code solutions.",
    modules: "6 modules",
    duration: "4h 45m",
    format: "Hands-on",
  },
  "Microsoft 365": {
    icon: "⌁",
    title: "Work smarter across Microsoft 365",
    description:
      "Use collaboration, content, and productivity capabilities to improve everyday team workflows.",
    modules: "5 modules",
    duration: "3h 20m",
    format: "Mixed formats",
  },
  "Developer tools": {
    icon: "⌘",
    title: "Build, test, and ship modern applications",
    description:
      "Strengthen your development workflow with GitHub, automated testing, delivery, and cloud-native practices.",
    modules: "7 modules",
    duration: "5h 30m",
    format: "Hands-on",
  },
  "AI and agents": {
    icon: "✦",
    title: "Design and build trustworthy AI agents",
    description:
      "Design agent workflows, evaluate behavior, and apply responsible AI controls with Microsoft Foundry.",
    modules: "6 modules",
    duration: "4h 20m",
    format: "Hands-on",
  },
};

let currentStep = 0;

function selectedValues(name) {
  return [...personalizationForm.querySelectorAll(`[name="${name}"]:checked`)].map(
    (input) => input.value,
  );
}

function showStep(stepIndex) {
  currentStep = Math.max(0, Math.min(stepIndex, steps.length - 1));
  steps.forEach((step, index) => {
    step.hidden = index !== currentStep;
  });

  const stepNumber = currentStep + 1;
  stepLabel.textContent = `${stepNumber} of ${steps.length}`;
  stepContainer.setAttribute("aria-label", `Step ${stepNumber} of ${steps.length}`);
  stepProgress.style.width = `${(stepNumber / steps.length) * 100}%`;
  backButton.hidden = currentStep === 0;
  nextButton.hidden = currentStep === steps.length - 1;
  createButton.hidden = currentStep !== steps.length - 1;

  const heading = steps[currentStep].querySelector(".question-title");
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

function createRecommendation() {
  const goal = selectedValues("goal")[0];
  const roles = selectedValues("role");
  const topics = selectedValues("topic");
  const level = selectedValues("level")[0];
  const roleText =
    roles.length === 1
      ? `your work as a ${roles[0].toLowerCase()}`
      : roles.length
        ? `your work across ${roles.join(" and ").toLowerCase()} roles`
        : "your role";
  const topicText = topics.length ? topics.slice(0, 2).join(" and ") : "your selected topics";
  const goalText = goal.charAt(0).toLowerCase() + goal.slice(1);
  const recommendation = recommendations[topics[0]] ?? recommendations["Azure cloud"];

  personalizedSummary.textContent =
    `You're here to ${goalText}. Recommendations prioritize ${level.toLowerCase()} content for ` +
    `${roleText}, focused on ${topicText}.`;
  pathLevel.textContent = level;
  pathTitle.textContent = recommendation.title;
  pathDescription.textContent = recommendation.description;
  pathIcon.textContent = recommendation.icon;
  pathDuration.textContent = recommendation.duration;

  onboardingView.hidden = true;
  dashboardView.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("#dashboard-title").focus({ preventScroll: true });
}

nextButton.addEventListener("click", () => {
  showStep(currentStep + 1);
});

backButton.addEventListener("click", () => {
  showStep(currentStep - 1);
});

personalizationForm.addEventListener("change", (event) => {
  if (event.target.name === "level") {
    levelDescription.textContent = levelDescriptions[event.target.value];
  }
});

personalizationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createRecommendation();
});

editPreferencesButton.addEventListener("click", () => {
  dashboardView.hidden = true;
  onboardingView.hidden = false;
  showStep(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("#onboarding-title").focus({ preventScroll: true });
});
