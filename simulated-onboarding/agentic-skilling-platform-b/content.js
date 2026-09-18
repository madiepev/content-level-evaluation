const content = document.querySelector("#content-detail-view");
const emptyState = document.querySelector("#content-empty-state");

function addListItems(containerId, items) {
  const container = document.querySelector(containerId);
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    container.append(listItem);
  });
}

function addTags(containerId, items) {
  const container = document.querySelector(containerId);
  items.forEach((item) => {
    const tag = document.createElement("span");
    tag.textContent = item;
    container.append(tag);
  });
}

function getContentCategories(item) {
  const searchableText = `${item.title} ${item.description}`.toLowerCase();

  if (searchableText.includes("business") || searchableText.includes("productivity")) {
    return {
      roles: ["Business analyst", "Functional consultant", "AI strategist"],
      skills: ["Business process automation", "AI strategy", "Responsible AI"],
    };
  }

  if (
    searchableText.includes("data") ||
    searchableText.includes("postgresql") ||
    searchableText.includes("retrieval")
  ) {
    return {
      roles: ["Data engineer", "AI engineer", "Developer"],
      skills: ["Data engineering", "Grounded AI", "AI application development"],
    };
  }

  if (searchableText.includes("agent")) {
    return {
      roles: ["AI engineer", "Developer", "Solution architect"],
      skills: ["AI agents", "AI engineering", "Prompt engineering"],
    };
  }

  return {
    roles: ["AI engineer", "Developer", "Technical professional"],
    skills: ["Generative AI", "AI prompting", "Responsible AI"],
  };
}

function getPrerequisites(item) {
  if (item.level?.includes("Beginner")) {
    return ["No prior experience is required.", "Familiarity with common workplace technology is helpful."];
  }

  if (item.level?.includes("Intermediate")) {
    return [
      "A basic understanding of generative AI concepts.",
      "Familiarity with the product or scenario covered in this content.",
    ];
  }

  return [
    "Experience building or planning AI solutions.",
    "Familiarity with generative AI, prompts, and responsible AI practices.",
  ];
}

function getObjectives(item) {
  const topic = item.title.replace(/^(Explain|Identify|Create|Complete|Build|Develop|Architect|Deploy|Transform|Get started with)\s+/i, "");
  return [
    `Explain the key concepts and capabilities related to ${topic}.`,
    "Identify an appropriate approach for a practical scenario.",
    "Apply the content to plan or complete a related task.",
  ];
}

function renderContent(item) {
  const categories = getContentCategories(item);
  document.title = `${item.title} — Skills Navigator`;
  document.querySelector("#content-type").textContent = item.contentType || "Module";
  document.querySelector("#content-title").textContent = item.title;
  document.querySelector("#content-description").textContent = item.description;
  document.querySelector("#content-duration").textContent = item.duration || "Duration varies";
  document.querySelector("#content-level").textContent = item.level || "Beginner (L100)";

  const startLink = document.querySelector("#content-start-link");
  startLink.href = item.url;
  startLink.setAttribute("aria-label", `Start ${item.title} on Microsoft Learn (opens in a new tab)`);

  addListItems("#content-prerequisites", getPrerequisites(item));
  addListItems("#content-objectives", getObjectives(item));
  addTags("#content-roles", categories.roles);
  addTags("#content-skills", categories.skills);
  content.hidden = false;
}

try {
  const selectedContent = JSON.parse(
    sessionStorage.getItem("skillsNavigatorSelectedContent") || "null",
  );

  if (
    selectedContent &&
    typeof selectedContent.title === "string" &&
    typeof selectedContent.description === "string" &&
    typeof selectedContent.url === "string"
  ) {
    renderContent(selectedContent);
  } else {
    emptyState.hidden = false;
  }
} catch (error) {
  console.error("Learning details could not be loaded.", error);
  emptyState.hidden = false;
}
