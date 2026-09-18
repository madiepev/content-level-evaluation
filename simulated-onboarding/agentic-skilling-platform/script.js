const composer = document.querySelector("#composer");
const input = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const suggestions = document.querySelector("#suggestions");
const restartButton = document.querySelector("#restart-button");
const showNowButton = document.querySelector("#show-now-button");
const showNowNote = document.querySelector("#show-now-note");
const refinementProgress = document.querySelector("#refinement-progress");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const progressLabel = document.querySelector("#progress-label");
const progressMessage = document.querySelector("#progress-message");
const userTemplate = document.querySelector("#user-message-template");
const assistantTemplate = document.querySelector("#assistant-message-template");
const initialMessages = messages.innerHTML;

const learner = {
  currentLevel: "",
  targetLevel: "",
  topic: "",
  goal: "",
  styles: "",
  time: "",
  products: [],
  refinement: "",
  planGoal: "",
};

let step = "welcome";

const refinementSteps = {
  foundationTopic: 1,
  foundationGoal: 2,
  foundationTime: 3,
  foundationFormat: 4,
  taskGoal: 1,
  taskTime: 2,
  taskFormat: 3,
  taskProducts: 4,
};

const progressMessages = {
  1: "Let’s get your playlist started.",
  2: "Your playlist is taking shape.",
  3: "Almost there—it’s coming together.",
  4: "The end is in sight—one final choice.",
};

const flows = {
  foundationTopic: {
    html: "<p><strong>What topic or product do you want to learn about?</strong></p><p>Choose an example or enter your own.</p>",
    options: [
      ["Generative AI", "What is generative AI?"],
      ["Effective Copilot prompts", "Write effective Copilot prompts"],
      ["AI agents", "What are AI agents?"],
    ],
  },
  foundationTime: {
    html: "<p><strong>How much time do you have today?</strong></p>",
    options: [
      ["15–30 minutes", "15–30 minutes"],
      ["30–60 minutes", "30–60 minutes"],
      ["More than 1 hour", "More than 1 hour"],
    ],
  },
  foundationGoal: {
    options: [
      ["Understand the key concepts", "Understand the key concepts"],
      ["Explore common uses and scenarios", "Explore common uses and scenarios"],
      ["Understand benefits and limitations", "Understand benefits and limitations"],
    ],
  },
  foundationFormat: {
    html: "<p><strong>How would you like to learn?</strong></p>",
    options: [
      ["Text-based learning", "Text-based learning"],
      ["Video-based learning", "Video-based learning"],
      ["Hands-on practice", "Hands-on practice"],
      ["A balanced mix", "A balanced mix"],
    ],
  },
  taskGoal: {
    html: "<p><strong>What do you want to accomplish?</strong></p><p>Choose a common task or describe the outcome you need.</p>",
    options: [
      ["Build and deploy an AI agent", "Build and deploy an AI agent"],
      ["Automate a repeatable business process", "Automate a repeatable business process"],
      ["Connect enterprise data to AI experiences", "Connect enterprise data to AI experiences"],
    ],
  },
  taskTime: {
    html: "<p><strong>How much time can you spend on this task?</strong></p>",
    options: [
      ["30–60 minutes", "30–60 minutes"],
      ["1–2 hours", "1–2 hours"],
      ["More than 2 hours", "More than 2 hours"],
    ],
  },
  taskFormat: {
    html: "<p><strong>How would you like to work through it?</strong></p>",
    options: [
      ["Text-based learning", "Step-by-step guidance"],
      ["Video-based learning", "Video walkthrough"],
      ["Hands-on practice", "Hands-on lab"],
      ["A balanced mix", "A balanced mix"],
    ],
  },
  currentLevel: {
    html: "<p>First, where would you place your current proficiency?</p>",
    options: [
      ["L100", "L100 · Foundational"],
      ["L200", "L200 · Intermediate"],
      ["L300", "L300 · Advanced"],
      ["unsure", "I’m not sure"],
    ],
  },
  targetLevel: {
    html: "<p>Great. What level would you like to reach?</p>",
    options: [
      ["L200", "L200"],
      ["L300", "L300"],
      ["L400", "L400"],
      ["L500", "L500 · Expert"],
    ],
  },
  topic: {
    html: "<p>What do you want to build proficiency in?</p>",
    options: [
      ["AI agents", "AI agents"],
      ["Data and analytics", "Data and analytics"],
      ["Cloud architecture", "Cloud architecture"],
      ["Security", "Security"],
    ],
  },
  styles: {
    html: "<p>How do you learn best? Choose the closest fit—you can refine it later.</p>",
    options: [
      ["Hands-on labs", "Hands-on labs"],
      ["Short videos", "Short videos"],
      ["Guided reading", "Guided reading"],
      ["A balanced mix", "A balanced mix"],
    ],
  },
};

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );
}

const interestCategoryLabels = {
  topics: "Topic",
  products: "Product",
  learningPreferences: "Learning preference",
  durations: "Time duration",
};

const relatedInterestMap = {
  "topics:Generative AI": [["products", "Microsoft Copilot"]],
  "topics:Effective Copilot prompts": [["products", "Microsoft Copilot"]],
  "topics:AI agents": [["products", "Microsoft Copilot Studio"]],
  "products:Microsoft Copilot": [["products", "Microsoft Copilot Studio"]],
  "products:Microsoft Copilot Studio": [["products", "Scout"]],
  "products:Scout": [["products", "Microsoft Foundry"]],
};

function createInterestOption(category, value) {
  return `
    <button
      type="button"
      class="interest-option"
      data-interest-option
      data-interest-category="${category}"
      data-interest-value="${escapeHtml(value)}"
      aria-pressed="false"
      title="Add ${escapeHtml(value)}"
    >
      <span>${escapeHtml(value)}</span>
      <span class="interest-remove" aria-hidden="true">×</span>
    </button>
  `;
}

function createInterestGroups(topic, learningPreference, duration, products = []) {
  const initialOptions = {
    topics: topic ? [topic] : [],
    products,
    learningPreferences: learningPreference ? [learningPreference] : [],
    durations: duration ? [duration] : [],
  };

  return Object.entries(interestCategoryLabels)
    .map(
      ([category, label]) => `
        <div class="interest-category">
          <span class="interest-category-label">${label}</span>
          <div class="interest-options" data-interest-category-options="${category}">
            ${initialOptions[category].map((value) => createInterestOption(category, value)).join("")}
            ${
              category === "products" && products.length === 0
                ? '<span class="interest-placeholder">Select a topic to see related options.</span>'
                : ""
            }
          </div>
        </div>
      `,
    )
    .join("");
}

function revealRelatedInterests(panel, category, value) {
  const relatedInterests = relatedInterestMap[`${category}:${value}`] || [];

  relatedInterests.forEach(([relatedCategory, relatedValue]) => {
    const categoryOptions = panel.querySelector(
      `[data-interest-category-options="${relatedCategory}"]`,
    );
    const alreadyShown = [...categoryOptions.querySelectorAll("[data-interest-option]")].some(
      (option) => option.dataset.interestValue === relatedValue,
    );
    if (alreadyShown) return;

    categoryOptions.querySelector(".interest-placeholder")?.remove();
    categoryOptions.insertAdjacentHTML(
      "beforeend",
      createInterestOption(relatedCategory, relatedValue),
    );
  });
}

function scrollToLatest() {
  messages.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetExperience() {
  Object.keys(learner).forEach((key) => {
    learner[key] = Array.isArray(learner[key]) ? [] : "";
  });
  step = "welcome";
  messages.innerHTML = initialMessages;
  setSuggestions([]);
  showNowButton.hidden = true;
  showNowNote.hidden = true;
  updateProgress();
  input.value = "";
  input.placeholder = "Describe a topic, goal, or task...";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress(currentStep = 0) {
  if (currentStep === 0) {
    refinementProgress.hidden = true;
    return;
  }

  refinementProgress.hidden = false;
  progressLabel.textContent = `Question ${currentStep} of 4`;
  progressMessage.textContent = progressMessages[currentStep];
  progressTrack.setAttribute("aria-valuenow", currentStep);
  progressFill.style.width = `${(currentStep / 4) * 100}%`;
}

function showStarterOption() {
  showNowButton.textContent = "Get started now";
  showNowButton.hidden = false;
  showNowNote.hidden = false;
}

function appendUserMessage(text) {
  const fragment = userTemplate.content.cloneNode(true);
  fragment.querySelector(".user-message").textContent = text;
  messages.append(fragment);
  scrollToLatest();
}

function appendAssistantMessage(html) {
  const fragment = assistantTemplate.content.cloneNode(true);
  fragment.querySelector(".message-content").innerHTML = html;
  messages.append(fragment);
  scrollToLatest();
}

function setSuggestions(options) {
  suggestions.replaceChildren(
    ...options.map(([value, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.value = value;
      button.textContent = label;
      return button;
    }),
  );
}

function showTaskProductSuggestions() {
  const productOptions = [
    "Microsoft Copilot Studio",
    "Microsoft Foundry",
    "Microsoft 365 Copilot",
  ].map((product) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.taskProduct = product;
    button.setAttribute("aria-pressed", "false");
    button.textContent = product;
    return button;
  });
  const continueButton = document.createElement("button");
  const skipButton = document.createElement("button");

  continueButton.type = "button";
  continueButton.className = "task-product-action";
  continueButton.dataset.taskProductsComplete = "";
  continueButton.textContent = "Use selected products";
  continueButton.disabled = true;

  skipButton.type = "button";
  skipButton.className = "task-product-action task-product-skip";
  skipButton.dataset.taskProductsSkip = "";
  skipButton.textContent = "Skip products";

  suggestions.replaceChildren(...productOptions, continueButton, skipButton);
}

function showStep(nextStep) {
  step = nextStep;
  updateProgress(refinementSteps[nextStep] || 0);
  const flow = flows[nextStep];
  appendAssistantMessage(flow.html);
  setSuggestions(flow.options);
  input.placeholder = "Or type your own answer...";
  input.focus();
}

function showHowItWorks() {
  appendAssistantMessage(`
    <p>I use your goal, proficiency, interests, and learning preferences to assemble a focused path.</p>
    <p>The path can combine internal solution-based training, LinkedIn Learning, and relevant YouTube videos. You stay in control and can tune the recommendations at any time.</p>
    <p><strong>Let’s start with where you are today.</strong></p>
  `);
  showStep("currentLevel");
}

function choosePath(path) {
  const labels = {
    foundation: "Build foundational knowledge",
    task: "Apply your knowledge",
    credential: "Prepare for a credential",
  };

  appendUserMessage(labels[path]);

  if (path === "foundation") {
    window.setTimeout(() => showStep("foundationTopic"), 250);
    return;
  }

  if (path === "task") {
    window.setTimeout(() => showStep("taskGoal"), 250);
    return;
  }

  step = "credential";
  updateProgress();
  window.setTimeout(() => {
    appendAssistantMessage(
      "<p>This option will open the credentials page, where you can explore credential-aligned learning.</p>",
    );
    input.placeholder = "Or tell me what you want to learn...";
  }, 250);
}

function showPlanPreview() {
  step = "complete";
  appendAssistantMessage(`
    <p>That’s enough to create your first recommendation.</p>
    <div class="plan-card">
      <h3>Your learning-path brief</h3>
      <dl>
        <dt>Starting point</dt><dd>${escapeHtml(learner.currentLevel)}</dd>
        <dt>Target</dt><dd>${escapeHtml(learner.targetLevel)}</dd>
        <dt>Topic</dt><dd>${escapeHtml(learner.topic)}</dd>
        <dt>Learning style</dt><dd>${escapeHtml(learner.styles)}</dd>
      </dl>
    </div>
    <p>I’ll use this to curate a progressive playlist across trusted internal content, LinkedIn Learning, and YouTube.</p>
  `);
  setSuggestions([
    ["generate", "Create my playlist"],
    ["adjust", "Adjust my answers"],
  ]);
  input.placeholder = "Add anything else I should know...";
}

function showFoundationResults() {
  step = "foundationResults";
  updateProgress();
  showNowButton.hidden = true;
  showNowNote.hidden = true;
  const selectedTime = learner.time || "30 minutes or less";
  const durations = {
    "30 minutes or less": ["18 min", "22 min", "28 min"],
    "15–30 minutes": ["18 min", "22 min", "28 min"],
    "30–60 minutes": ["35 min", "45 min", "55 min"],
    "More than 1 hour": ["25 min", "35 min", "45 min"],
  };
  const selectedDurations = durations[selectedTime] ?? ["18 min", "22 min", "28 min"];
  const topic = escapeHtml(learner.topic);
  const resultContent = {
    "Generative AI": [
      {
        title: "Explain core concepts in generative AI",
        description:
          "Define core generative AI concepts, recognize common model capabilities, and distinguish generative systems from traditional rules-based software in practical workplace scenarios.",
      },
      {
        title: "Identify practical uses for generative AI",
        description:
          "Review common generative AI scenarios, compare suitable use cases, and identify where human oversight improves accuracy, safety, and responsible outcomes.",
      },
      {
        title: "Complete a guided task with generative AI",
        description:
          "Complete a guided generative AI task, write a clear instruction, review the response, and revise the input to improve the result.",
      },
    ],
    "Effective Copilot prompts": [
      {
        title: "Identify effective prompt elements in Microsoft Copilot",
        description:
          "Identify the parts of an effective Microsoft Copilot prompt, including a clear goal, relevant context, source material, and expected output.",
      },
      {
        title: "Select prompt patterns for Microsoft Copilot",
        description:
          "Compare Microsoft Copilot prompt patterns for summarizing, drafting, analyzing, and transforming workplace information, then recognize when each pattern fits best.",
      },
      {
        title: "Write an effective prompt with Microsoft Copilot",
        description:
          "Write a Microsoft Copilot prompt for a realistic task, review the response against your goal, and revise the prompt for better results.",
      },
    ],
    "AI agents": [
      {
        title: "Explain core concepts in AI agents",
        description:
          "Define AI agent concepts, identify the role of tools and instructions, and distinguish agents from assistants and traditional automated workflows.",
      },
      {
        title: "Identify practical uses for AI agents",
        description:
          "Review common AI agent scenarios, connect agent capabilities to business needs, and identify where autonomy, oversight, and orchestration add value.",
      },
      {
        title: "Create a simple AI agent",
        description:
          "Create a simple AI agent, define its purpose and instructions, connect an appropriate tool, and test whether it completes the intended task.",
      },
    ],
  };
  const selectedContent = resultContent[learner.topic] ?? [
    {
      title: `Explain core concepts in ${learner.topic}`,
      description:
        "Review the essential concepts and terminology, recognize common capabilities, and connect the topic to practical workplace scenarios and learner needs.",
    },
    {
      title: `Identify practical uses for ${learner.topic}`,
      description:
        "Compare common scenarios, identify suitable use cases, and determine how the topic can support practical goals, decisions, and workplace outcomes.",
    },
    {
      title: `Complete a guided task with ${learner.topic}`,
      description:
        "Follow a guided activity, apply the essential steps, review the result against the intended goal, and identify an appropriate next action.",
    },
  ];
  const criteria = [
    learner.goal && `Goal: ${learner.goal}`,
    `Time: ${selectedTime}`,
    learner.styles && `Format: ${learner.styles}`,
  ].filter(Boolean);
  const resources = {
    "Text-based learning": [
      ["Text-based learning"],
      ["Text-based learning"],
      ["Text-based learning"],
    ],
    "Video-based learning": [
      ["Video-based learning"],
      ["Video-based learning"],
      ["Video-based learning"],
    ],
    "Hands-on practice": [
      ["Hands-on practice"],
      ["Hands-on practice"],
      ["Hands-on practice"],
    ],
    "A balanced mix": [
      ["Text-based learning"],
      ["Video-based learning"],
      ["Hands-on practice"],
    ],
  };
  const selectedResources = resources[learner.styles] ?? resources["A balanced mix"];
  const selectedLearningPreference = learner.styles || "A balanced mix";
  const showDecisionGuidance =
    new Set(selectedResources.map(([format]) => format)).size > 1;
  const levels = ["Beginner (L100)", "Beginner (L100)", "Intermediate (L200)"];
  const decisionGuidance = {
    "Text-based learning":
      "Choose this if you want a quick read to get started.",
    "Video-based learning":
      "Choose this if you need a short video to get started.",
    "Hands-on practice":
      "Choose this if you want to get hands-on right away.",
  };
  const formatClasses = {
    "Text-based learning": "format-text",
    "Video-based learning": "format-video",
    "Hands-on practice": "format-hands-on",
  };
  const resultChoices = selectedContent
    .map((content, index) => {
      const format = selectedResources[index][0];
      const duration = selectedDurations[index];
      const level = levels[index];

      return `
        <article
          class="starter-option-card ${formatClasses[format]}"
          data-result-item
          data-duration="${duration}"
          data-format="${format}"
          data-level="${level}"
        >
          ${
            showDecisionGuidance
              ? `<p class="starter-choice-guidance">${decisionGuidance[format]}</p>`
              : ""
          }
          <div class="starter-option-content">
            <h3>${escapeHtml(content.title)}</h3>
            <p data-result-description>${escapeHtml(content.description)}</p>
          </div>
          <div class="result-metadata starter-option-details" aria-label="Content details">
            <span class="metadata-item" data-label="Duration">${duration}</span>
            <span class="metadata-item" data-label="Format">
              <span class="format-pill">${format}</span>
            </span>
            <span class="metadata-item" data-label="Level">${level}</span>
          </div>
        </article>
      `;
    })
    .join("");
  const resultsMarkup = `
    <div class="hybrid-result-shell details-below">
      <div class="result-layout-switch">
        <span>Layout preview</span>
        <div role="group" aria-label="Compare result layouts">
          <button type="button" data-result-layout="right" aria-pressed="false">
            Details right
          </button>
          <button type="button" data-result-layout="below" aria-pressed="true">
            Details below
          </button>
        </div>
      </div>
      <div class="starter-option-list" aria-label="Recommended learning options">
        ${resultChoices}
      </div>
    </div>
  `;
  let nextPrompt = "";

  if (!learner.goal) {
    nextPrompt = `
      <p><strong>Want to make this playlist more your style?</strong></p>
      <p>What do you want to accomplish with ${topic}?</p>
    `;
  } else if (!learner.time) {
    nextPrompt = `
      <p><strong>How much time do you have today?</strong></p>
    `;
  } else if (!learner.styles) {
    nextPrompt = `
      <p><strong>How would you like to learn?</strong></p>
    `;
  }

  appendAssistantMessage(`
    <p><strong>Here are three ways to get started with ${topic}.</strong></p>
    <p class="result-context">${criteria.map(escapeHtml).join(" · ")}</p>
    ${resultsMarkup}
    <div class="profile-save-panel">
      <p><strong>Save this playlist to your profile.</strong></p>
      <div class="playlist-actions">
        <button
          type="button"
          class="primary-action"
          data-playlist-action="save"
          data-topic="${escapeHtml(learner.topic)}"
          data-goal="${escapeHtml(learner.goal)}"
          data-time="${escapeHtml(selectedTime)}"
          data-format="${escapeHtml(selectedLearningPreference)}"
        >
          Add to my profile
        </button>
        <a href="profile.html">View my profile</a>
      </div>
      <div class="profile-personalization" data-preferences-panel hidden>
        <p><strong>Want more content like this? Save your preferences.</strong></p>
        <p>Select any preferences you want to add. Related options appear as you choose.</p>
        <div class="interest-category-groups">
          ${createInterestGroups(learner.topic, selectedLearningPreference, selectedTime)}
        </div>
        <div class="preference-actions">
          <button type="button" data-preference-action="save" disabled>
            Save preferences
          </button>
        </div>
      </div>
      <p class="save-status" data-save-status role="status"></p>
    </div>
  `);

  if (!learner.goal) {
    step = "foundationGoal";
    updateProgress(refinementSteps.foundationGoal);
    setSuggestions(flows.foundationGoal.options);
    input.placeholder = "Or describe another goal...";
  } else if (!learner.time) {
    step = "foundationTime";
    updateProgress(refinementSteps.foundationTime);
    setSuggestions(flows.foundationTime.options);
    input.placeholder = "Or enter another amount of time...";
  } else if (!learner.styles) {
    step = "foundationFormat";
    updateProgress(refinementSteps.foundationFormat);
    setSuggestions(flows.foundationFormat.options);
    input.placeholder = "Or describe how you prefer to learn...";
  } else {
    setSuggestions([
      ["refine", "Refine these results"],
      ["restart", "Start over"],
    ]);
    input.placeholder = "Ask for a different type of result...";
  }

  if (nextPrompt) {
    appendAssistantMessage(nextPrompt);
  }
}

function showTaskResults() {
  step = "taskResults";
  updateProgress();
  setSuggestions([]);
  const goal = learner.goal;
  const selectedTime = learner.time || "1–2 hours";
  const selectedFormat = learner.styles || "A balanced mix";
  const contentByGoal = {
    "Build and deploy an AI agent": [
      {
        title: "Configure a guided AI agent prototype",
        description:
          "Define an agent’s purpose, write clear instructions, connect one tool, and test the core workflow before adding deployment complexity.",
      },
      {
        title: "Build and deploy a production-ready AI agent",
        description:
          "Build an AI agent for a defined business task, connect required tools and knowledge, test behavior, and deploy the working solution.",
      },
      {
        title: "Architect a scalable multi-agent solution",
        description:
          "Design coordinated agents, define orchestration and observability, apply governance controls, and evaluate the solution for enterprise-scale deployment.",
      },
    ],
    "Automate a repeatable business process": [
      {
        title: "Model a repeatable business workflow",
        description:
          "Map the process, identify decision points and required data, then build a guided workflow that handles the most common path.",
      },
      {
        title: "Automate a repeatable business process",
        description:
          "Build the automation, connect business data and approvals, test exception paths, and deploy a reliable workflow for the selected process.",
      },
      {
        title: "Architect governed enterprise automation",
        description:
          "Design reusable automation patterns, apply security and governance controls, monitor performance, and plan operations across multiple business processes.",
      },
    ],
    "Connect enterprise data to AI experiences": [
      {
        title: "Prepare enterprise data for grounded AI",
        description:
          "Identify trusted data sources, prepare access and structure, and test a basic grounded response before building the complete experience.",
      },
      {
        title: "Connect enterprise data to AI experiences",
        description:
          "Connect approved enterprise data, configure retrieval and permissions, test grounded responses, and integrate the result into an AI experience.",
      },
      {
        title: "Architect secure retrieval across enterprise data",
        description:
          "Design retrieval across multiple sources, enforce identity-aware access, evaluate answer quality, and establish monitoring for production-scale AI experiences.",
      },
    ],
  };
  const selectedContent = contentByGoal[goal] || [
    {
      title: `Prepare the core steps to ${goal.toLowerCase()}`,
      description:
        "Break the goal into essential steps, identify required tools and inputs, and complete a guided version before adding advanced requirements.",
    },
    {
      title: `Complete the task to ${goal.toLowerCase()}`,
      description:
        "Complete the requested outcome, use the relevant tools and data, test the result, and resolve the most likely implementation issues.",
    },
    {
      title: `Scale the solution to ${goal.toLowerCase()}`,
      description:
        "Extend the solution for greater scale and complexity, apply governance and monitoring, and plan reliable operations for broader use.",
    },
  ];
  const durationSets = {
    "30–60 minutes": ["30 min", "45 min", "60 min"],
    "1–2 hours": ["45 min", "75 min", "120 min"],
    "More than 2 hours": ["60 min", "120 min", "180 min"],
  };
  const formats = {
    "Text-based learning": [
      "Text-based learning",
      "Text-based learning",
      "Text-based learning",
    ],
    "Video-based learning": [
      "Video-based learning",
      "Video-based learning",
      "Video-based learning",
    ],
    "Hands-on practice": [
      "Hands-on practice",
      "Hands-on practice",
      "Hands-on practice",
    ],
    "A balanced mix": [
      "Text-based learning",
      "Hands-on practice",
      "Hands-on practice",
    ],
  };
  const levels = ["Proficient (L300)", "Advanced (L400)", "Expert (L500)"];
  const levelLabels = ["More guidance", "Closest match", "Stretch option"];
  const levelGuidance = [
    "Choose this if you want more guidance before tackling the complete task.",
    "Choose this for the closest match to your goal and selected preferences.",
    "Choose this if you’re ready for greater scale, autonomy, and complexity.",
  ];
  const formatClasses = {
    "Text-based learning": "format-text",
    "Video-based learning": "format-video",
    "Hands-on practice": "format-hands-on",
  };
  const selectedDurations = durationSets[selectedTime] || durationSets["1–2 hours"];
  const selectedFormats = formats[selectedFormat] || formats["A balanced mix"];
  const productContext =
    learner.products.length > 0 ? learner.products.join(", ") : "No product preference";
  const refinementContext = learner.refinement
    ? ` · Context: ${escapeHtml(learner.refinement)}`
    : "";
  const resultChoices = selectedContent
    .map((content, index) => {
      const format = selectedFormats[index];
      return `
        <article
          class="starter-option-card task-level-card ${formatClasses[format]}"
          data-result-item
          data-duration="${selectedDurations[index]}"
          data-format="${format}"
          data-level="${levels[index]}"
        >
          <p class="starter-choice-guidance">${levelGuidance[index]}</p>
          <div class="starter-option-content">
            <span class="task-match-label ${index === 1 ? "is-closest" : ""}">
              ${levelLabels[index]}
            </span>
            <h3>${escapeHtml(content.title)}</h3>
            <p data-result-description>${escapeHtml(content.description)}</p>
          </div>
          <div class="result-metadata starter-option-details" aria-label="Content details">
            <span class="metadata-item" data-label="Duration">${selectedDurations[index]}</span>
            <span class="metadata-item" data-label="Format">
              <span class="format-pill">${format}</span>
            </span>
            <span class="metadata-item" data-label="Level">${levels[index]}</span>
          </div>
        </article>
      `;
    })
    .join("");

  appendAssistantMessage(`
    <p><strong>Choose the right starting point for your task.</strong></p>
    <p class="result-context">
      ${escapeHtml(goal)} · ${escapeHtml(selectedTime)} · ${escapeHtml(selectedFormat)} · ${escapeHtml(productContext)}${refinementContext}
    </p>
    <div class="hybrid-result-shell details-below">
      <div class="result-layout-switch">
        <span>Layout preview</span>
        <div role="group" aria-label="Compare result layouts">
          <button type="button" data-result-layout="right" aria-pressed="false">Details right</button>
          <button type="button" data-result-layout="below" aria-pressed="true">Details below</button>
        </div>
      </div>
      <div class="starter-option-list" aria-label="Task learning options">
        ${resultChoices}
      </div>
    </div>
    <div class="profile-save-panel">
      <p><strong>Save this task playlist to your profile.</strong></p>
      <div class="playlist-actions">
        <button
          type="button"
          class="primary-action"
          data-playlist-action="save"
          data-playlist-title="${escapeHtml(goal)} task playlist"
          data-topic="${escapeHtml(goal)}"
          data-goal="${escapeHtml(goal)}"
          data-time="${escapeHtml(selectedTime)}"
          data-format="${escapeHtml(selectedFormat)}"
        >
          Add to my profile
        </button>
        <a href="profile.html">View my profile</a>
      </div>
      <div class="profile-personalization" data-preferences-panel hidden>
        <p><strong>Want more content like this? Save your preferences.</strong></p>
        <p>Select any preferences you want to add. Related options appear as you choose.</p>
        <div class="interest-category-groups">
          ${createInterestGroups("", selectedFormat, selectedTime, learner.products)}
        </div>
        <div class="preference-actions">
          <button type="button" data-preference-action="save" disabled>
            Save preferences
          </button>
        </div>
      </div>
      <p class="save-status" data-save-status role="status"></p>
    </div>
    <div class="task-plan-prompt">
      <p><strong>Go beyond this task.</strong></p>
      <p>Build a learning plan to deepen this skill, progress to more advanced work, and stay current as the technology evolves.</p>
      <button type="button" data-build-learning-plan>Build a learning plan</button>
    </div>
  `);

  setSuggestions([
    ["taskRefineExperience", "Add my starting experience"],
    ["taskRefineConstraints", "Add technical constraints"],
    ["taskRefineScope", "Narrow the task outcome"],
  ]);
  input.placeholder = "Add context about your task...";
}

function saveCurrentPlaylist(button) {
  const resultMessage = button.closest(".message-content");
  const savePanel = button.closest(".profile-save-panel");
  const status = savePanel.querySelector("[data-save-status]");
  const items = [...resultMessage.querySelectorAll("[data-result-item]")].map((item) => ({
    title: item.querySelector("h3").textContent,
    description: item.querySelector("[data-result-description]").textContent,
    duration: item.dataset.duration,
    format: item.dataset.format,
    level: item.dataset.level,
  }));
  const playlist = {
    id: crypto.randomUUID(),
    title: button.dataset.playlistTitle || `${button.dataset.topic} learning playlist`,
    topic: button.dataset.topic,
    goal: button.dataset.goal || "Get started",
    time: button.dataset.time || "30 minutes or less",
    format: button.dataset.format || "A balanced mix",
    savedAt: new Date().toISOString(),
    items,
  };

  try {
    const playlists = JSON.parse(localStorage.getItem("skillsNavigatorPlaylists") || "[]");
    playlists.unshift(playlist);
    localStorage.setItem("skillsNavigatorPlaylists", JSON.stringify(playlists));
  } catch (error) {
    console.error("Playlist save failed.", error);
    status.textContent = "Your playlist couldn’t be saved. Try again.";
    status.classList.add("save-status-error");
    return;
  }

  button.textContent = "Saved";
  button.disabled = true;
  savePanel.querySelector("[data-preferences-panel]").hidden = false;
  status.textContent = "Playlist saved to your profile.";
}

function savePreferences(button) {
  const savePanel = button.closest(".profile-save-panel");
  const status = savePanel.querySelector("[data-save-status]");
  const selectedCriteria = {
    topics: [],
    products: [],
    learningPreferences: [],
    durations: [],
  };
  savePanel
    .querySelectorAll('[data-interest-option][aria-pressed="true"]')
    .forEach((interestOption) => {
      selectedCriteria[interestOption.dataset.interestCategory].push(
        interestOption.dataset.interestValue,
      );
    });
  const selectedInterestCount = Object.values(selectedCriteria).flat().length;

  if (selectedInterestCount === 0) {
    status.textContent = "Select at least one preference to save.";
    status.classList.add("save-status-error");
    return;
  }

  try {
    const parsedProfile = JSON.parse(
      localStorage.getItem("skillsNavigatorProfile") ||
        '{"topics":[],"products":[],"learningPreferences":[],"durations":[]}',
    );
    const storedProfile =
      parsedProfile && typeof parsedProfile === "object" ? parsedProfile : {};

    Object.entries(selectedCriteria).forEach(([category, values]) => {
      const savedValues = Array.isArray(storedProfile[category])
        ? storedProfile[category].filter((value) => typeof value === "string")
        : [];

      values.forEach((value) => {
        const alreadySaved = savedValues.some(
          (savedValue) => savedValue.toLowerCase() === value.toLowerCase(),
        );
        if (!alreadySaved) savedValues.push(value);
      });

      storedProfile[category] = savedValues;
    });

    localStorage.setItem("skillsNavigatorProfile", JSON.stringify(storedProfile));
    status.textContent = "Preferences saved to your profile.";
    status.classList.remove("save-status-error");
  } catch (error) {
    console.error("Profile preference save failed.", error);
    status.textContent = "Your preferences couldn’t be saved. Try again.";
    status.classList.add("save-status-error");
    return;
  }

  button.textContent = "Preferences saved";
  button.disabled = true;
  savePanel.querySelectorAll("[data-interest-option]").forEach((option) => {
    option.disabled = true;
  });
}

function advance(value) {
  if (step === "welcome") {
    if (value === "explain") {
      showHowItWorks();
    } else {
      showStep("currentLevel");
    }
    return;
  }

  if (step === "foundationTopic") {
    learner.topic = value;
    step = "foundationGoal";
    updateProgress(refinementSteps.foundationGoal);
    appendAssistantMessage(
      `<p><strong>What do you want to accomplish with ${escapeHtml(value)}?</strong></p><p>Choose a goal or enter your own.</p>`,
    );
    setSuggestions(flows.foundationGoal.options);
    showStarterOption();
    input.placeholder = "Or describe another goal...";
    input.focus();
    return;
  }

  if (step === "foundationGoal") {
    learner.goal = value;
    step = "foundationTime";
    updateProgress(refinementSteps.foundationTime);
    appendAssistantMessage("<p><strong>How much time do you have today?</strong></p>");
    setSuggestions(flows.foundationTime.options);
    showStarterOption();
    input.placeholder = "Or enter another amount of time...";
    input.focus();
    return;
  }

  if (step === "foundationTime") {
    learner.time = value;
    step = "foundationFormat";
    updateProgress(refinementSteps.foundationFormat);
    appendAssistantMessage(flows.foundationFormat.html);
    setSuggestions(flows.foundationFormat.options);
    showStarterOption();
    input.placeholder = "Or describe how you prefer to learn...";
    input.focus();
    return;
  }

  if (step === "foundationFormat") {
    learner.styles = value;
    showFoundationResults();
    return;
  }

  if (step === "taskGoal") {
    learner.goal = value;
    showStep("taskTime");
    input.placeholder = "Or enter another amount of time...";
    return;
  }

  if (step === "taskTime") {
    learner.time = value;
    showStep("taskFormat");
    input.placeholder = "Or describe how you prefer to learn...";
    return;
  }

  if (step === "taskFormat") {
    learner.styles = value;
    step = "taskProducts";
    updateProgress(refinementSteps.taskProducts);
    appendAssistantMessage(
      "<p><strong>Are you using a specific product?</strong></p><p>Select any that apply, or skip this step.</p>",
    );
    showTaskProductSuggestions();
    input.placeholder = "Or enter another product...";
    input.focus();
    return;
  }

  if (step === "taskProducts") {
    learner.products = [value];
    showTaskResults();
    return;
  }

  if (step.startsWith("taskRefine")) {
    learner.refinement = value;
    appendAssistantMessage(
      `<p><strong>Added to your task context.</strong></p><p>I’ll use “${escapeHtml(value)}” to refine the level and content match.</p>`,
    );
    window.setTimeout(showTaskResults, 250);
    return;
  }

  if (step === "taskResults") {
    const refinementPrompts = {
      taskRefineExperience:
        "<p><strong>What experience do you already have with this task?</strong></p><p>Include similar work, tools, or concepts you already know.</p>",
      taskRefineConstraints:
        "<p><strong>What technical constraints should the solution account for?</strong></p><p>For example, name required tools, data sources, permissions, or environments.</p>",
      taskRefineScope:
        "<p><strong>What specific outcome would make this task complete?</strong></p><p>Describe the deliverable or success criteria.</p>",
    };
    if (refinementPrompts[value]) {
      step = value;
      appendAssistantMessage(refinementPrompts[value]);
      setSuggestions([]);
      input.placeholder = "Add task context...";
      input.focus();
      return;
    }
  }

  if (step === "taskPlanGoal") {
    learner.planGoal = value;
    appendAssistantMessage(`
      <p><strong>Your learning-plan direction is set.</strong></p>
      <p>I’ll use <strong>${escapeHtml(learner.goal)}</strong> as the starting point and build toward <strong>${escapeHtml(value)}</strong> with progressive skill milestones.</p>
    `);
    setSuggestions([["restart", "Start over"]]);
    input.placeholder = "Add anything else the plan should account for...";
    return;
  }

  if (step === "currentLevel") {
    learner.currentLevel = value === "unsure" ? "To be assessed" : value;
    showStep("targetLevel");
    return;
  }

  if (step === "targetLevel") {
    learner.targetLevel = value;
    showStep("topic");
    return;
  }

  if (step === "topic") {
    learner.topic = value;
    showStep("styles");
    return;
  }

  if (step === "styles") {
    learner.styles = value;
    showPlanPreview();
    return;
  }

  if (step === "foundationResults" && value === "restart") {
    resetExperience();
    return;
  }

  if (step === "foundationResults" && value === "refine") {
    appendAssistantMessage("<p>Tell me what you want to change about these results.</p>");
    setSuggestions([]);
    input.placeholder = "For example: more videos or more hands-on content...";
    input.focus();
    return;
  }

  if (value === "generate") {
    appendAssistantMessage(`
      <p><strong>Your playlist is being curated.</strong></p>
      <p>The next prototype screen will show a staged path from ${learner.currentLevel} to ${learner.targetLevel}, with content grouped by proficiency milestone.</p>
    `);
    setSuggestions([["restart", "Start over"]]);
    return;
  }

  if (value === "adjust" || value === "restart") {
    Object.keys(learner).forEach((key) => {
      learner[key] = Array.isArray(learner[key]) ? [] : "";
    });
    showStep("currentLevel");
  }

}

suggestions.addEventListener("click", (event) => {
  const productOption = event.target.closest("[data-task-product]");
  if (productOption) {
    const isSelected = productOption.getAttribute("aria-pressed") === "true";
    productOption.setAttribute("aria-pressed", String(!isSelected));
    suggestions.querySelector("[data-task-products-complete]").disabled =
      !suggestions.querySelector('[data-task-product][aria-pressed="true"]');
    return;
  }

  const finishProducts = event.target.closest(
    "[data-task-products-complete], [data-task-products-skip]",
  );
  if (finishProducts) {
    learner.products = finishProducts.hasAttribute("data-task-products-skip")
      ? []
      : [...suggestions.querySelectorAll('[data-task-product][aria-pressed="true"]')].map(
          (option) => option.dataset.taskProduct,
        );
    appendUserMessage(
      learner.products.length > 0
        ? learner.products.join(", ")
        : "No product preference",
    );
    setSuggestions([]);
    progressMessage.textContent = "Matching the task to the right level…";
    window.setTimeout(showTaskResults, 250);
    return;
  }

  const button = event.target.closest("button[data-value]");
  if (!button) return;

  appendUserMessage(button.textContent.trim());
  setSuggestions([]);
  showNowButton.hidden = true;
  showNowNote.hidden = true;
  if (step === "foundationFormat") {
    progressMessage.textContent = "Adding the finishing touches…";
  }
  window.setTimeout(() => advance(button.dataset.value), 250);
});

showNowButton.addEventListener("click", () => {
  appendUserMessage(showNowButton.textContent);
  showNowButton.hidden = true;
  showNowNote.hidden = true;
  progressMessage.textContent = "Putting your starter options together…";
  setSuggestions([]);
  window.setTimeout(showFoundationResults, 250);
});

messages.addEventListener("click", (event) => {
  const learningPlanAction = event.target.closest("[data-build-learning-plan]");
  if (learningPlanAction) {
    appendUserMessage("Build a learning plan");
    learningPlanAction.disabled = true;
    step = "taskPlanGoal";
    appendAssistantMessage(
      "<p><strong>What should this learning plan help you do next?</strong></p><p>Choose a direction or describe your longer-term goal.</p>",
    );
    setSuggestions([
      ["Deepen this skill", "Deepen this skill"],
      ["Take on more advanced work", "Take on more advanced work"],
      ["Stay current as tools evolve", "Stay current as tools evolve"],
    ]);
    input.placeholder = "Describe your longer-term goal...";
    input.focus();
    return;
  }

  const layoutOption = event.target.closest("[data-result-layout]");
  if (layoutOption) {
    const resultShell = layoutOption.closest(".hybrid-result-shell");
    resultShell.classList.toggle(
      "details-below",
      layoutOption.dataset.resultLayout === "below",
    );
    resultShell.querySelectorAll("[data-result-layout]").forEach((option) => {
      option.setAttribute(
        "aria-pressed",
        String(option.dataset.resultLayout === layoutOption.dataset.resultLayout),
      );
    });
    return;
  }

  const interestOption = event.target.closest("[data-interest-option]");
  if (interestOption) {
    const isSelected = interestOption.getAttribute("aria-pressed") === "true";
    interestOption.setAttribute("aria-pressed", String(!isSelected));
    interestOption.title = `${isSelected ? "Add" : "Remove"} ${
      interestOption.dataset.interestValue
    }`;

    if (!isSelected) {
      revealRelatedInterests(
        interestOption.closest(".profile-save-panel"),
        interestOption.dataset.interestCategory,
        interestOption.dataset.interestValue,
      );
    }
    const preferenceAction = interestOption
      .closest(".profile-save-panel")
      .querySelector("[data-preference-action]");
    preferenceAction.disabled = !interestOption
      .closest(".profile-save-panel")
      .querySelector('[data-interest-option][aria-pressed="true"]');
    return;
  }

  const preferenceAction = event.target.closest("[data-preference-action]");
  if (preferenceAction) {
    savePreferences(preferenceAction);
    return;
  }

  const playlistAction = event.target.closest("[data-playlist-action]");
  if (playlistAction) {
    saveCurrentPlaylist(playlistAction);
    return;
  }

  const button = event.target.closest("button[data-path]");
  if (!button) return;

  document.querySelectorAll(".path-choices button").forEach((choice) => {
    choice.disabled = true;
  });
  choosePath(button.dataset.path);
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  appendUserMessage(text);
  input.value = "";
  setSuggestions([]);
  showNowButton.hidden = true;
  showNowNote.hidden = true;

  if (step === "welcome") {
    learner.topic = text;
    window.setTimeout(() => showStep("currentLevel"), 250);
    return;
  }

  if (step === "task") {
    learner.topic = text;
    window.setTimeout(() => {
      appendAssistantMessage(
        `<p>I’ll look for focused learning that helps you complete: <strong>${escapeHtml(text)}</strong>.</p><p>This task-based path will be developed next.</p>`,
      );
    }, 250);
    return;
  }

  window.setTimeout(() => advance(text), 250);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    composer.requestSubmit();
  }
});

restartButton.addEventListener("click", resetExperience);
