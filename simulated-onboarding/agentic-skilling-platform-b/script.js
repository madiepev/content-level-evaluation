const composer = document.querySelector("#composer");
const composerShell = document.querySelector(".composer-shell");
const appHeader = document.querySelector(".app-header");
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
  filterLevel: "",
  filterProduct: "",
  filterTopics: "",
  filterLevels: [],
  filterDurations: [],
  filterStyles: [],
  filterProducts: [],
  filterTopicSelections: [],
};

const happyPathShortcuts = {
  "show happy path: generative ai | key concepts | 15-30 minutes | module": {
    topic: "Generative AI",
    goal: "Understand the key concepts",
    time: "15–30 minutes",
    styles: "Text-based learning",
    products: [],
    showResults: showFoundationResults,
  },
  "show happy path: build and deploy an ai agent | 30-60 minutes | module | microsoft foundry":
    {
      topic: "",
      goal: "Build and deploy an AI agent",
      time: "30–60 minutes",
      styles: "Text-based learning",
      products: ["Microsoft Foundry"],
      showResults: showTaskResults,
    },
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

const formatOptions = [
  ["Text-based learning", "Text-based learning"],
  ["Video-based learning", "Video-based learning"],
  ["Hands-on practice", "Hands-on exercise"],
  ["A balanced mix", "A balanced mix"],
];

const formatLabels = Object.fromEntries(formatOptions);

const levelOptions = [
  "Beginner (L100)",
  "Intermediate (L200)",
  "Proficient (L300)",
  "Advanced (L400)",
  "Expert (L500)",
];

const contentTypes = {
  "Text-based learning": "Module",
  "Video-based learning": "Video",
  "Hands-on practice": "Lab",
};

const decisionGuidance = {
  "Text-based learning": "Read at your own pace.",
  "Video-based learning": "Visual walkthrough.",
  "Hands-on practice": "Guided practice.",
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
    options: formatOptions,
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
      ["15–30 minutes", "15–30 minutes"],
      ["30–60 minutes", "30–60 minutes"],
      ["More than 1 hour", "More than 1 hour"],
    ],
  },
  taskFormat: {
    html: "<p><strong>How would you like to work through it?</strong></p>",
    options: formatOptions,
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
    options: formatOptions,
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

function createLearningUrl(title) {
  return `https://learn.microsoft.com/training/browse/?terms=${encodeURIComponent(title)}`;
}

function createLearningTitle(title, destination = createLearningUrl(title)) {
  const safeTitle = escapeHtml(title);
  const url = escapeHtml(destination);
  return `
    <h3>
      <a
        href="${url}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${safeTitle} (opens in a new tab)"
      >${safeTitle}</a>
    </h3>
  `;
}

const interestCategoryLabels = {
  levels: "Level",
  durations: "Duration",
  learningPreferences: "Format",
  products: "Products",
  topics: "Skills",
};

const relatedInterestMap = {
  "topics:Generative AI": [
    ["topics", "Effective Copilot prompts"],
    ["topics", "AI agents"],
    ["products", "Microsoft Copilot"],
  ],
  "topics:Effective Copilot prompts": [
    ["topics", "Generative AI"],
    ["topics", "AI agents"],
    ["products", "Microsoft Copilot"],
  ],
  "topics:AI agents": [
    ["topics", "Generative AI"],
    ["topics", "Effective Copilot prompts"],
    ["products", "Microsoft Copilot Studio"],
  ],
  "products:Microsoft Copilot": [["products", "Microsoft Copilot Studio"]],
  "products:Microsoft Copilot Studio": [["products", "Scout"]],
  "products:Scout": [["products", "Microsoft Foundry"]],
  "products:Microsoft 365 Copilot": [["products", "Cowork"]],
  "products:Cowork": [["products", "Microsoft Copilot Studio"]],
  "topics:Business process automation": [
    ["topics", "Workflow automation"],
    ["topics", "AI governance"],
    ["products", "Microsoft 365 Copilot"],
    ["products", "Cowork"],
  ],
  "topics:Grounded AI": [
    ["topics", "Knowledge grounding"],
    ["topics", "Retrieval-augmented generation"],
    ["products", "Microsoft Foundry"],
    ["products", "Scout"],
  ],
  "topics:Apply generative AI at work": [
    ["topics", "Prompt engineering"],
    ["topics", "Evaluate AI outputs"],
    ["topics", "Responsible AI"],
  ],
  "topics:Build reusable prompt workflows": [
    ["topics", "Prompt engineering"],
    ["topics", "Workflow automation"],
    ["topics", "AI agents"],
  ],
  "topics:Build and test an AI agent": [
    ["topics", "Tool integration"],
    ["topics", "Knowledge grounding"],
    ["topics", "Agent orchestration"],
  ],
  "topics:Orchestrate multiple agents": [
    ["topics", "Multi-agent design"],
    ["topics", "Agent orchestration"],
    ["topics", "Agent governance"],
  ],
  "topics:Design governed automation": [
    ["topics", "Workflow automation"],
    ["topics", "Responsible AI"],
    ["topics", "AI governance"],
  ],
  "topics:Improve grounded AI retrieval": [
    ["topics", "Retrieval-augmented generation"],
    ["topics", "Knowledge grounding"],
    ["topics", "AI search"],
  ],
  "topics:Prompt engineering": [
    ["topics", "Prompt evaluation"],
    ["topics", "Reusable prompt patterns"],
  ],
  "topics:Agent orchestration": [
    ["topics", "Multi-agent design"],
    ["topics", "Agent governance"],
  ],
  "topics:Knowledge grounding": [
    ["topics", "Retrieval-augmented generation"],
    ["topics", "AI search"],
  ],
};

function createInterestOption(category, value, selected = false, label = value) {
  return `
    <button
      type="button"
      class="interest-option"
      data-interest-option
      data-interest-category="${category}"
      data-interest-value="${escapeHtml(value)}"
      aria-pressed="${selected}"
      title="${selected ? "Remove" : "Add"} ${escapeHtml(value)}"
    >
      <span>${escapeHtml(label)}</span>
      <span class="interest-remove" aria-hidden="true">×</span>
    </button>
  `;
}

function getNextSkillOptions(context) {
  const nextSkillsByContext = {
    "Generative AI": ["Apply generative AI at work"],
    "Effective Copilot prompts": ["Build reusable prompt workflows"],
    "AI agents": ["Build and test an AI agent"],
    "Build and deploy an AI agent": ["Orchestrate multiple agents"],
    "Automate a repeatable business process": ["Design governed automation"],
    "Connect enterprise data to AI experiences": ["Improve grounded AI retrieval"],
  };

  return nextSkillsByContext[context] || ["Apply this skill in a project"];
}

function prioritizeOptions(selectedValue, options) {
  return [
    ...(selectedValue ? [selectedValue] : []),
    ...options.filter((value) => value !== selectedValue),
  ];
}

function createInterestGroups(
  topic,
  learningPreference,
  duration,
  products = [],
  selectionState = {},
) {
  const learningOptions = prioritizeOptions(learningPreference, [
    "Text-based learning",
    "Video-based learning",
    "Hands-on practice",
    "A balanced mix",
  ]);
  const durationOptions = prioritizeOptions(
    duration,
    selectionState.durationOptions || [
      "15–30 minutes",
      "30–60 minutes",
      "More than 1 hour",
    ],
  );
  const relatedTopics = (relatedInterestMap[`topics:${topic}`] || [])
    .filter(([category]) => category === "topics")
    .map(([, value]) => value);
  const topicAndSkillOptions = [
    ...new Set([
      topic,
      ...(selectionState.topics || []),
      ...relatedTopics,
      ...getNextSkillOptions(topic || selectionState.goal),
    ]),
  ].filter(Boolean);
  const relatedProducts = (relatedInterestMap[`topics:${topic}`] || [])
    .filter(([category]) => category === "products")
    .map(([, value]) => value);
  const productOptions = [
    ...new Set([
      ...products,
      ...relatedProducts,
      "Microsoft 365 Copilot",
      "Microsoft Copilot Studio",
      "Scout",
      "Cowork",
    ]),
  ];
  const initialOptions = {
    levels: levelOptions.map((value) => ({
      value,
      selected: (selectionState.levels || []).includes(value),
    })),
    durations: durationOptions.map((value) => ({
      value,
      selected:
        (selectionState.durations || []).includes(value) ||
        (Boolean(selectionState.duration) && value === duration),
    })),
    learningPreferences: learningOptions.map((value) => ({
      value: formatLabels[value] || value,
      selected:
        (selectionState.learningPreferences || []).includes(value) ||
        (Boolean(selectionState.learningPreference) &&
          value === learningPreference),
    })),
    products: productOptions.map((value) => ({
      value,
      selected: Boolean(selectionState.products) && products.includes(value),
    })),
    topics: topicAndSkillOptions.map((value) => ({
      value,
      selected:
        (selectionState.topics || []).includes(value) ||
        (Boolean(selectionState.topic) && value === topic),
    })),
  };

  return Object.entries(interestCategoryLabels)
    .map(
      ([category, label]) => `
        <div class="interest-category">
          <span class="interest-category-label">${label}</span>
          <div class="interest-options" data-interest-category-options="${category}">
            ${initialOptions[category]
              .map(({ value, selected }) =>
                createInterestOption(category, value, selected),
              )
              .join("")}
            ${
              category === "products" && productOptions.length === 0
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

function createResultFilterOption(category, value, selected = false, label = value) {
  return `
    <button
      type="button"
      class="interest-option"
      data-result-filter-option
      data-filter-category="${category}"
      data-filter-value="${escapeHtml(value)}"
      aria-pressed="${selected}"
    >${escapeHtml(label)}</button>
  `;
}

function createResultFilterGroup(category, label, options, selectedValues = []) {
  return `
    <div class="interest-category">
      <span class="interest-category-label">${label}</span>
      <div class="interest-options" data-result-filter-group="${category}">
        ${options
          .map((option) => {
            const [value, optionLabel] = Array.isArray(option)
              ? option
              : [option, option];
            return createResultFilterOption(
              category,
              value,
              selectedValues.includes(value),
              optionLabel,
            );
          })
          .join("")}
      </div>
    </div>
  `;
}

function revealRelatedResultFilters(panel, category, value) {
  const interestCategory =
    category === "topic" ? "topics" : category === "product" ? "products" : "";
  if (!interestCategory) return;

  const relatedOptions = relatedInterestMap[`${interestCategory}:${value}`] || [];
  relatedOptions.forEach(([relatedCategory, relatedValue]) => {
    const resultCategory =
      relatedCategory === "topics"
        ? "topic"
        : relatedCategory === "products"
          ? "product"
          : "";
    if (!resultCategory) return;

    const optionGroup = panel.querySelector(
      `[data-result-filter-group="${resultCategory}"]`,
    );
    const alreadyShown = [...optionGroup.querySelectorAll("[data-result-filter-option]")].some(
      (option) => option.dataset.filterValue === relatedValue,
    );
    if (!alreadyShown) {
      optionGroup.insertAdjacentHTML(
        "beforeend",
        createResultFilterOption(resultCategory, relatedValue),
      );
    }
  });
}

function showResultPersonalization() {
  const isTaskFlow = step === "taskResults";
  step = isTaskFlow ? "taskPersonalize" : "foundationPersonalize";
  setSuggestions([]);
  const taskTopicsByGoal = {
    "Build and deploy an AI agent": "AI agents",
    "Automate a repeatable business process": "Business process automation",
    "Connect enterprise data to AI experiences": "Grounded AI",
  };
  const contextTopic = isTaskFlow
    ? taskTopicsByGoal[learner.goal] || "Generative AI"
    : learner.topic || "Generative AI";
  const pathOptions = {
    "Generative AI": {
      topics: ["Effective Copilot prompts", "Responsible AI"],
      products: ["Microsoft Copilot", "Microsoft Foundry"],
    },
    "Effective Copilot prompts": {
      topics: ["Prompt engineering", "Reusable prompt patterns"],
      products: ["Microsoft Copilot", "Microsoft 365 Copilot"],
    },
    "AI agents": {
      topics: ["Agent orchestration", "Tool integration"],
      products: ["Microsoft Foundry", "Microsoft Copilot Studio", "Scout"],
    },
    "Business process automation": {
      topics: ["Workflow automation", "AI governance"],
      products: ["Microsoft 365 Copilot", "Cowork", "Microsoft Copilot Studio"],
    },
    "Grounded AI": {
      topics: ["Knowledge grounding", "Retrieval-augmented generation"],
      products: ["Microsoft Foundry", "Scout", "Azure AI Search"],
    },
  };
  const relevantOptions = pathOptions[contextTopic] || {
    topics: getNextSkillOptions(contextTopic),
    products: [],
  };
  const relatedTopics = [contextTopic, ...relevantOptions.topics];
  const selectedProducts =
    learner.filterProducts.length > 0
      ? learner.filterProducts
      : learner.products.length > 0
      ? learner.products
      : learner.filterProduct
        ? [learner.filterProduct]
        : [];
  const relatedProducts = [
    ...new Set([
      ...selectedProducts,
      ...relevantOptions.products,
    ]),
  ];
  const durationOptions = flows.foundationTime.options.map(([value]) => value);

  appendAssistantMessage(`
    <p><strong>Personalize these results.</strong></p>
    <p>Choose any filters. I’ll turn them into a prompt and update your playlist.</p>
    <div class="profile-personalization result-personalization">
      <div class="interest-category-groups">
        ${createResultFilterGroup(
          "level",
          "Level",
          levelOptions,
          learner.filterLevels,
        )}
        ${createResultFilterGroup(
          "duration",
          "Duration",
          durationOptions,
          learner.filterDurations.length > 0
            ? learner.filterDurations
            : learner.time
              ? [learner.time]
              : [],
        )}
        ${createResultFilterGroup(
          "learningStyle",
          "Format",
          formatOptions,
          learner.filterStyles.length > 0
            ? learner.filterStyles
            : learner.styles
              ? [learner.styles]
              : [],
        )}
        ${createResultFilterGroup(
          "product",
          "Products",
          relatedProducts,
          selectedProducts,
        )}
        ${createResultFilterGroup(
          "topic",
          "Skills",
          relatedTopics,
          learner.filterTopicSelections.length > 0
            ? learner.filterTopicSelections
            : [contextTopic],
        )}
      </div>
      <div class="preference-actions">
        <button type="button" data-result-filter-apply>Build prompt and update results</button>
      </div>
      <p class="save-status" data-result-filter-status role="status"></p>
    </div>
  `);
  input.placeholder = "Or describe how you want to personalize these results...";
}

function updateComposerOffset() {
  document.documentElement.style.setProperty(
    "--composer-height",
    `${Math.ceil(composerShell.getBoundingClientRect().height)}px`,
  );
}

function scrollToLatest() {
  window.requestAnimationFrame(() => {
    const latestMessage = messages.lastElementChild;
    if (!latestMessage) return;

    const messageBounds = latestMessage.getBoundingClientRect();
    const visibleTop = appHeader.getBoundingClientRect().bottom + 12;
    const visibleBottom = composerShell.getBoundingClientRect().top - 16;

    if (messageBounds.bottom > visibleBottom) {
      const desiredTop = Math.max(visibleTop, visibleBottom - messageBounds.height);
      window.scrollBy({
        top: messageBounds.top - desiredTop,
        behavior: "smooth",
      });
    } else if (messageBounds.top < visibleTop) {
      window.scrollBy({
        top: messageBounds.top - visibleTop,
        behavior: "smooth",
      });
    }
  });
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

function runHappyPathShortcut(text) {
  const normalizedText = text
    .toLowerCase()
    .replaceAll("–", "-")
    .replace(/\s+/g, " ")
    .trim();
  const shortcut = happyPathShortcuts[normalizedText];
  if (!shortcut) return false;

  resetExperience();
  learner.topic = shortcut.topic;
  learner.goal = shortcut.goal;
  learner.time = shortcut.time;
  learner.styles = shortcut.styles;
  learner.products = [...shortcut.products];
  appendUserMessage(text);
  progressMessage.textContent = "Loading the selected happy path…";
  window.setTimeout(shortcut.showResults, 250);
  return true;
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
    task: "Task-based paths",
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
        <dt>Format</dt><dd>${escapeHtml(formatLabels[learner.styles] || learner.styles)}</dd>
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

function createRecommendationSummary(context) {
  const summaries = {
    "Generative AI":
      "Understand how generative AI and agents work, prepare an Azure AI development environment, and apply responsible AI practices.",
    "Effective Copilot prompts":
      "Build a foundation in generative AI, design production-ready prompts, and extend agents with custom tools.",
    "AI agents":
      "Understand agent concepts, develop and test an agent, and ground it with enterprise knowledge.",
    "Build and deploy an AI agent":
      "Build foundational knowledge of generative AI agents, create and test an agent, and extend it into an agent-driven workflow.",
    "Automate a repeatable business process":
      "Apply responsible AI, translate business requirements into an agent design, and plan its lifecycle from development through deployment.",
    "Connect enterprise data to AI experiences":
      "Ground agents in enterprise data, connect them to operational data, and apply retrieval patterns that improve response relevance.",
  };

  return (
    summaries[context] ||
    "Build foundational understanding, apply the skill in a realistic scenario, and extend it to a more advanced outcome."
  );
}

function personalizeContentForProduct(content) {
  if (!learner.filterProduct || content.title.includes(learner.filterProduct)) {
    return content;
  }

  return {
    ...content,
    title: `${content.title} with ${learner.filterProduct}`,
    description: `Use ${learner.filterProduct} to ${content.description.charAt(0).toLowerCase()}${content.description.slice(1)}`,
  };
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
    "More than 1 hour": ["65 min", "75 min", "90 min"],
  };
  const durationSelections =
    learner.filterDurations.length > 0
      ? learner.filterDurations
      : [selectedTime];
  const selectedDurations = [0, 1, 2].map((index) => {
    const durationRange = durationSelections[index % durationSelections.length];
    return (durations[durationRange] || durations["30 minutes or less"])[index];
  });
  const topic = escapeHtml(learner.topic);
  const catalogIdsByTopic = {
    "Generative AI": [
      "get-started-generative-ai-agents",
      "prepare-azure-ai-development",
      "responsible-generative-ai",
    ],
    "Effective Copilot prompts": [
      "get-started-generative-ai-agents",
      "advanced-prompting-production-agents",
      "build-agent-custom-tools",
    ],
    "AI agents": [
      "get-started-generative-ai-agents",
      "develop-ai-agents-vscode",
      "introduction-foundry-iq",
    ],
  };
  const catalogIds =
    catalogIdsByTopic[learner.filterTopics] ||
    catalogIdsByTopic[learner.topic] ||
    catalogIdsByTopic["Generative AI"];
  const selectedContent = catalogIds.map((id) => {
    const item = window.skillsNavigatorCatalog?.[id];
    if (!item) {
      throw new Error(`Learning catalog item not found: ${id}`);
    }
    return personalizeContentForProduct({ ...item, id });
  });
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
  const selectedLearningPreference = resources[learner.styles]
    ? learner.styles
    : "A balanced mix";
  const styleSelections =
    learner.filterStyles.length > 0
      ? learner.filterStyles
      : [selectedLearningPreference];
  const formatSelections = [
    ...new Set(
      styleSelections.flatMap((style) =>
        style === "A balanced mix"
          ? resources[style].map(([format]) => format)
          : [style],
      ),
    ),
  ];
  const selectedResources = [0, 1, 2].map((index) => [
    formatSelections[index % formatSelections.length],
  ]);
  const showDecisionGuidance =
    !learner.styles &&
    new Set(selectedResources.map(([format]) => format)).size > 1;
  const levelSelections =
    learner.filterLevels.length > 0
      ? learner.filterLevels
      : ["Beginner (L100)", "Beginner (L100)", "Intermediate (L200)"];
  const levels = [0, 1, 2].map(
    (index) => levelSelections[index % levelSelections.length],
  );
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
      const contentType = contentTypes[format];

      return `
        <article
          class="starter-option-card ${formatClasses[format]}"
          data-result-item
          data-duration="${duration}"
          data-format="${format}"
          data-content-type="${contentType}"
          data-level="${level}"
          data-catalog-id="${content.id}"
        >
          ${
            showDecisionGuidance
              ? `<p class="starter-choice-guidance">${decisionGuidance[format]}</p>`
              : ""
          }
          <div class="starter-option-content">
            ${createLearningTitle(content.title, content.url)}
            <p data-result-description>${escapeHtml(content.description)}</p>
          </div>
          <div class="result-metadata starter-option-details" aria-label="Content details">
            <span class="metadata-item" data-label="Duration">${duration}</span>
            <span class="metadata-item" data-label="Format">
              <span class="format-pill">${contentType}</span>
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
    <h2 class="result-title">${topic} starter playlist</h2>
    <p class="result-rationale">
      <strong>Why these results?</strong>
      ${escapeHtml(createRecommendationSummary(learner.filterTopics || learner.topic))}
    </p>
    <details class="result-order-guidance">
      <summary>How should I choose where to start?</summary>
      <p>
        These options are presented in progressive order. Start with the first to
        establish context, continue to build the skill, then use the final option
        to extend or apply it.
      </p>
    </details>
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
          Save playlist
        </button>
        <a href="profile.html">View my playlists</a>
      </div>
      <p class="save-status" data-save-status role="status"></p>
      <div class="profile-personalization" data-preferences-panel hidden>
        <p><strong>Want more like this? Save your preferences.</strong></p>
        <p>Choose what fits. We’ll use it to personalize your For you feed.</p>
        <div class="interest-category-groups">
          ${createInterestGroups(
            learner.topic,
            selectedLearningPreference,
            learner.time,
            learner.filterProducts,
            {
              topic: Boolean(learner.topic),
              products: learner.filterProducts.length > 0,
              topics: learner.filterTopicSelections,
              levels: learner.filterLevels,
              learningPreferences: learner.filterStyles,
              durations: learner.filterDurations,
              learningPreference:
                learner.filterStyles.length === 0 && Boolean(learner.styles),
              duration:
                learner.filterDurations.length === 0 && Boolean(learner.time),
              durationOptions: flows.foundationTime.options.map(([value]) => value),
            },
          )}
        </div>
        <div class="preference-actions">
          <button type="button" data-preference-action="save">
            Save preferences
          </button>
        </div>
      </div>
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
      ["personalize", "Personalize these results"],
      ["switchToTask", "Change to task-based paths"],
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
  const selectedTime = learner.time || "30–60 minutes";
  const selectedFormat =
    contentTypes[learner.styles] || learner.styles === "A balanced mix"
      ? learner.styles
      : "Text-based learning";
  const catalogIdsByGoal = {
    "Build and deploy an AI agent": [
      "get-started-generative-ai-agents",
      "develop-ai-agents-vscode",
      "build-agent-workflows",
    ],
    "Automate a repeatable business process": [
      "responsible-ai-principles",
      "design-ai-agents-business-solutions",
      "design-alm-ai-business-solutions",
    ],
    "Connect enterprise data to AI experiences": [
      "get-started-foundry-iq",
      "generative-ai-agents-postgresql",
      "advanced-rag-foundry",
    ],
  };
  const catalogIds = catalogIdsByGoal[goal];
  const selectedContent = catalogIds
    ? catalogIds.map((id) => {
        const item = window.skillsNavigatorCatalog?.[id];
        if (!item) {
          throw new Error(`Learning catalog item not found: ${id}`);
        }
        return { ...item, id };
      })
    : [
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
    "15–30 minutes": ["18 min", "24 min", "30 min"],
    "30–60 minutes": ["30 min", "45 min", "60 min"],
    "More than 1 hour": ["65 min", "75 min", "90 min"],
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
      "Video-based learning",
      "Text-based learning",
      "Hands-on practice",
    ],
  };
  const levelSelections =
    learner.filterLevels.length > 0
      ? learner.filterLevels
      : ["Beginner (L100)", "Intermediate (L200)", "Proficient (L300)"];
  const levels = [0, 1, 2].map(
    (index) => levelSelections[index % levelSelections.length],
  );
  const levelLabels = ["More guidance", "Closest match", "Stretch option"];
  const formatClasses = {
    "Text-based learning": "format-text",
    "Video-based learning": "format-video",
    "Hands-on practice": "format-hands-on",
  };
  const durationSelections =
    learner.filterDurations.length > 0
      ? learner.filterDurations
      : [selectedTime];
  const selectedDurations = [0, 1, 2].map((index) => {
    const durationRange = durationSelections[index % durationSelections.length];
    return (durationSets[durationRange] || durationSets["30–60 minutes"])[index];
  });
  const styleSelections =
    learner.filterStyles.length > 0
      ? learner.filterStyles
      : [selectedFormat];
  const formatSelections = [
    ...new Set(
      styleSelections.flatMap((style) =>
        style === "A balanced mix" ? formats[style] : [style],
      ),
    ),
  ];
  const selectedFormats = [0, 1, 2].map(
    (index) => formatSelections[index % formatSelections.length],
  );
  if (
    styleSelections.includes("A balanced mix") &&
    selectedFormats[0] === "Video-based learning"
  ) {
    selectedDurations[0] = "15 min";
  }
  const resultChoices = selectedContent
    .map((content, index) => {
      const format = selectedFormats[index];
      const contentType = contentTypes[format];
      return `
        <article
          class="starter-option-card task-level-card ${formatClasses[format]}"
          data-result-item
          data-duration="${selectedDurations[index]}"
          data-format="${format}"
          data-content-type="${contentType}"
          data-level="${levels[index]}"
          data-catalog-id="${content.id || ""}"
        >
          <div class="starter-option-content">
            <span class="task-match-label ${index === 1 ? "is-closest" : ""}">
              ${levelLabels[index]}
            </span>
            ${createLearningTitle(content.title, content.url)}
            <p data-result-description>${escapeHtml(content.description)}</p>
          </div>
          <div class="result-metadata starter-option-details" aria-label="Content details">
            <span class="metadata-item" data-label="Duration">${selectedDurations[index]}</span>
            <span class="metadata-item" data-label="Format">
              <span class="format-pill">${contentType}</span>
            </span>
            <span class="metadata-item" data-label="Level">${levels[index]}</span>
          </div>
        </article>
      `;
    })
    .join("");

  appendAssistantMessage(`
    <h2 class="result-title">${escapeHtml(goal)}</h2>
    <p class="result-rationale">
      <strong>Why these results?</strong>
      ${escapeHtml(createRecommendationSummary(goal))}
    </p>
    <details class="result-order-guidance">
      <summary>How should I choose where to start?</summary>
      <p>
        These options are presented in progressive order. Choose More guidance
        for a supported introduction, Closest match to work directly on your
        goal, or Stretch option when you’re ready for more complexity.
      </p>
    </details>
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
          Save playlist
        </button>
        <a href="profile.html">View my playlists</a>
      </div>
      <p class="save-status" data-save-status role="status"></p>
      <div class="profile-personalization" data-preferences-panel hidden>
        <p><strong>Want more like this? Save your preferences.</strong></p>
        <p>Choose what fits. We’ll use it to personalize your For you feed.</p>
        <div class="interest-category-groups">
          ${createInterestGroups(
            "",
            selectedFormat,
            selectedTime,
            learner.products,
            {
              goal,
              products: learner.products.length > 0,
              topics: learner.filterTopicSelections,
              levels: learner.filterLevels,
              learningPreferences: learner.filterStyles,
              durations: learner.filterDurations,
              learningPreference: learner.filterStyles.length === 0,
              duration: learner.filterDurations.length === 0,
              durationOptions: flows.taskTime.options.map(([value]) => value),
            },
          )}
        </div>
        <div class="preference-actions">
          <button type="button" data-preference-action="save">
            Save preferences
          </button>
        </div>
      </div>
    </div>
  `);

  setSuggestions([
    ["personalize", "Personalize these results"],
  ]);
  input.placeholder = "Add context about your task...";
}

function saveCurrentPlaylist(button) {
  const resultMessage = button.closest(".message-content");
  const savePanel = button.closest(".profile-save-panel");
  const status = savePanel.querySelector("[data-save-status]");
  const items = [...resultMessage.querySelectorAll("[data-result-item]")].map((item) => ({
    title: item.querySelector("h3").textContent,
    url: item.querySelector("h3 a").href,
    description: item.querySelector("[data-result-description]").textContent,
    duration: item.dataset.duration,
    contentType: item.dataset.contentType,
    format: item.dataset.format,
    level: item.dataset.level,
    catalogId: item.dataset.catalogId || "",
    matchLabel:
      item.querySelector(".task-match-label")?.textContent.trim() || "",
  }));
  const playlist = {
    id: crypto.randomUUID(),
    title: button.dataset.playlistTitle || `${button.dataset.topic} learning playlist`,
    topic: button.dataset.topic,
    goal: button.dataset.goal || "Get started",
    time: button.dataset.time || "30 minutes or less",
    format: button.dataset.format || "Text-based learning",
    savedAt: new Date().toISOString(),
    items,
  };

  try {
    localStorage.removeItem("skillsNavigatorPlaylistsReset");
    localStorage.setItem("skillsNavigatorPlaylists", JSON.stringify([playlist]));
  } catch (error) {
    console.error("Playlist save failed.", error);
    status.textContent = "Your playlist couldn’t be saved. Try again.";
    status.classList.add("save-status-error");
    return;
  }

  button.textContent = "Saved";
  button.disabled = true;
  savePanel.querySelector("[data-preferences-panel]").hidden = false;
  status.textContent = "Playlist saved.";
}

function savePreferences(button) {
  const savePanel = button.closest(".profile-save-panel");
  const status = savePanel.querySelector("[data-save-status]");
  const selectedCriteria = {
    levels: [],
    durations: [],
    learningPreferences: [],
    products: [],
    topics: [],
    skills: [],
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
        '{"levels":[],"durations":[],"learningPreferences":[],"products":[],"topics":[],"skills":[]}',
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

  if (step === "taskResults") {
    if (value === "personalize") {
      showResultPersonalization();
      return;
    }
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

  if (step === "foundationResults" && value === "personalize") {
    showResultPersonalization();
    return;
  }

  if (step === "foundationResults" && value === "switchToTask") {
    const foundationTopic = learner.topic;
    learner.goal = "";
    learner.time = "";
    learner.styles = "";
    learner.products = [];
    learner.refinement = foundationTopic
      ? `the learner’s interest in ${foundationTopic}`
      : "";
    learner.filterLevel = "";
    learner.filterProduct = "";
    learner.filterTopics = "";
    learner.filterLevels = [];
    learner.filterDurations = [];
    learner.filterStyles = [];
    learner.filterProducts = [];
    learner.filterTopicSelections = [];
    step = "taskGoal";
    updateProgress(refinementSteps.taskGoal);
    appendAssistantMessage(`
      <p><strong>Let’s change this to a task-based path.</strong></p>
      ${
        foundationTopic
          ? `<p>I’ll keep your interest in <strong>${escapeHtml(foundationTopic)}</strong> in mind.</p>`
          : ""
      }
      ${flows.taskGoal.html}
    `);
    setSuggestions(flows.taskGoal.options);
    input.placeholder = "Or describe the outcome you need...";
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
  const resultFilterOption = event.target.closest("[data-result-filter-option]");
  if (resultFilterOption) {
    const category = resultFilterOption.dataset.filterCategory;
    const isSelected = resultFilterOption.getAttribute("aria-pressed") === "true";

    resultFilterOption.setAttribute("aria-pressed", String(!isSelected));

    if ((category === "topic" || category === "product") && !isSelected) {
      revealRelatedResultFilters(
        resultFilterOption.closest(".result-personalization"),
        category,
        resultFilterOption.dataset.filterValue,
      );
    }
    return;
  }

  const applyResultFilters = event.target.closest("[data-result-filter-apply]");
  if (applyResultFilters) {
    const isTaskPersonalization = step === "taskPersonalize";
    const panel = applyResultFilters.closest(".result-personalization");
    const selections = {};

    panel
      .querySelectorAll('[data-result-filter-option][aria-pressed="true"]')
      .forEach((option) => {
        const category = option.dataset.filterCategory;
        selections[category] ||= [];
        selections[category].push(option.dataset.filterValue);
      });

    if (Object.keys(selections).length === 0) {
      panel.querySelector("[data-result-filter-status]").textContent =
        "Choose at least one filter.";
      return;
    }

    const promptParts = [
      selections.level?.length && `level: ${selections.level.join(", ")}`,
      selections.duration?.length && `duration: ${selections.duration.join(", ")}`,
      selections.learningStyle?.length &&
        `format: ${selections.learningStyle
          .map((value) => formatLabels[value] || value)
          .join(", ")}`,
      selections.product?.length && `products: ${selections.product.join(", ")}`,
      selections.topic?.length && `skills: ${selections.topic.join(", ")}`,
    ].filter(Boolean);
    const prompt = `Personalize my results with ${promptParts.join("; ")}.`;
    learner.filterLevels = selections.level || [];
    learner.filterDurations = selections.duration || [];
    learner.filterStyles = selections.learningStyle || [];
    learner.filterProducts = selections.product || [];
    learner.filterTopicSelections = selections.topic || [];
    learner.filterLevel = selections.level?.[0] || "";
    learner.filterProduct = selections.product?.[0] || "";
    learner.filterTopics = selections.topic?.[0] || "";
    learner.time = selections.duration?.[0] || learner.time;
    learner.styles = selections.learningStyle?.[0] || learner.styles;
    learner.topic = selections.topic?.[0] || learner.topic;
    if (isTaskPersonalization) {
      learner.products = selections.product || learner.products;
    }

    panel
      .querySelectorAll("button")
      .forEach((button) => {
        button.disabled = true;
      });
    appendUserMessage(prompt);
    appendAssistantMessage(
      "<p><strong>Updating your playlist.</strong></p><p>I’ll use those filters to narrow the next set of results.</p>",
    );
    window.setTimeout(
      isTaskPersonalization ? showTaskResults : showFoundationResults,
      250,
    );
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

  if (runHappyPathShortcut(text)) {
    input.value = "";
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

updateComposerOffset();
new ResizeObserver(() => {
  updateComposerOffset();
  scrollToLatest();
}).observe(composerShell);
