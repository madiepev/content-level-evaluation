const container = document.querySelector("#saved-playlists");
const template = document.querySelector("#saved-playlist-template");
const interestsContainer = document.querySelector("#profile-interests-list");
const resetPlaylistsButton = document.querySelector("#reset-playlists");
const resetPreferencesButton = document.querySelector("#reset-preferences");
const resetStatus = document.querySelector("#profile-reset-status");

const formatLabels = {
  "Text-based learning": "Text-based learning",
  "Video-based learning": "Video-based learning",
  "Hands-on practice": "Hands-on exercise",
  "A balanced mix": "A balanced mix",
};

const formatClasses = {
  "Text-based learning": "format-text",
  "Video-based learning": "format-video",
  "Hands-on practice": "format-hands-on",
};

function createCatalogItem(id, duration, level, matchLabel = "") {
  const item = window.skillsNavigatorCatalog?.[id];
  if (!item) {
    throw new Error(`Learning catalog item not found: ${id}`);
  }

  return {
    ...item,
    catalogId: id,
    duration,
    format: "Text-based learning",
    contentType: "Module",
    level,
    matchLabel,
  };
}

const prototypePlaylists = [
  {
    id: "generative-ai-key-concepts",
    title: "Generative AI starter playlist",
    topic: "Generative AI",
    goal: "Understand the key concepts",
    time: "15–30 minutes",
    format: "Text-based learning",
    items: [
      createCatalogItem(
        "get-started-generative-ai-agents",
        "18 min",
        "Beginner (L100)",
      ),
      createCatalogItem(
        "prepare-azure-ai-development",
        "22 min",
        "Beginner (L100)",
      ),
      createCatalogItem(
        "responsible-generative-ai",
        "28 min",
        "Intermediate (L200)",
      ),
    ],
  },
  {
    id: "build-deploy-agent-foundry",
    title: "Build and deploy an AI agent",
    topic: "Build and deploy an AI agent",
    goal: "Build and deploy an AI agent",
    time: "30–60 minutes",
    format: "Text-based learning",
    items: [
      createCatalogItem(
        "get-started-generative-ai-agents",
        "30 min",
        "Beginner (L100)",
        "More guidance",
      ),
      createCatalogItem(
        "develop-ai-agents-vscode",
        "45 min",
        "Intermediate (L200)",
        "Closest match",
      ),
      createCatalogItem(
        "build-agent-workflows",
        "60 min",
        "Proficient (L300)",
        "Stretch option",
      ),
    ],
  },
];

function renderInterests(profile) {
  const categories = [
    ["levels", "Level"],
    ["durations", "Duration"],
    ["learningPreferences", "Format"],
    ["products", "Products"],
    [["topics", "skills"], "Skills"],
  ];
  let hasInterests = false;

  categories.forEach(([keys, label]) => {
    const categoryKeys = Array.isArray(keys) ? keys : [keys];
    const values = [
      ...new Set(
        categoryKeys.flatMap((key) =>
          Array.isArray(profile[key]) ? profile[key] : [],
        ),
      ),
    ];
    if (values.length === 0) return;

    hasInterests = true;
    const group = document.createElement("div");
    const heading = document.createElement("h3");
    const tags = document.createElement("div");

    group.className = "profile-interest-group";
    heading.textContent = label;
    tags.className = "interest-tags";

    values.forEach((value) => {
      const tag = document.createElement("span");
      tag.className = "interest-tag";
      tag.textContent =
        categoryKeys.includes("learningPreferences")
          ? formatLabels[value] || value
          : value;
      tags.append(tag);
    });

    group.append(heading, tags);
    interestsContainer.append(group);
  });

  if (!hasInterests) {
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = "Save interests with a playlist to personalize future recommendations.";
    interestsContainer.append(message);
  }
}

function createMetadata(label, value) {
  const item = document.createElement("span");
  item.className = "metadata-item";
  item.dataset.label = label;
  item.textContent = value;
  return item;
}

function getContentType(format) {
  return (
    {
      "Text-based learning": "Module",
      "Video-based learning": "Video",
      "Hands-on practice": "Lab",
    }[format] || "Module"
  );
}

function renderPlaylist(playlist) {
  const fragment = template.content.cloneNode(true);
  const article = fragment.querySelector(".saved-playlist");
  const list = fragment.querySelector(".starter-option-list");

  article.querySelector("h2").textContent = playlist.title;
  article.querySelector(".saved-playlist-meta").textContent = [
    playlist.goal,
    playlist.time,
    formatLabels[playlist.format] || playlist.format,
  ].join(" · ");

  playlist.items.forEach((item) => {
    const card = document.createElement("article");
    const details = document.createElement("div");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const metadata = document.createElement("div");
    const link = document.createElement("a");
    const contentType = item.contentType || getContentType(item.format);

    card.className = `starter-option-card ${formatClasses[item.format] || "format-text"}`;
    details.className = "starter-option-content";
    link.href = "content.html";
    link.textContent = item.title;
    link.setAttribute("aria-label", `View mock content for ${item.title}`);
    link.addEventListener("click", () => {
      sessionStorage.setItem(
        "skillsNavigatorSelectedContent",
        JSON.stringify(item),
      );
    });
    title.append(link);
    title.title = item.title;
    description.textContent = item.description;

    if (item.matchLabel) {
      const matchLabel = document.createElement("span");
      matchLabel.className = `task-match-label${
        item.matchLabel === "Closest match" ? " is-closest" : ""
      }`;
      matchLabel.textContent = item.matchLabel;
      details.append(matchLabel);
    }
    details.append(title, description);

    metadata.className = "result-metadata starter-option-details";
    metadata.append(
      createMetadata("Duration", item.duration),
      createMetadata("Format", contentType),
      createMetadata("Level", item.level || "Beginner (L100)"),
    );

    card.append(details, metadata);
    list.append(card);
  });

  container.append(fragment);
}

let playlists = [];
let profile = {};
const playlistsWereReset =
  localStorage.getItem("skillsNavigatorPlaylistsReset") === "true";

try {
  playlists = JSON.parse(localStorage.getItem("skillsNavigatorPlaylists") || "[]");
} catch {
  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = "Saved playlists could not be loaded.";
  container.append(message);
}

const savedPlaylistTitles = new Set(playlists.map((playlist) => playlist.title));
playlists = [
  ...(playlistsWereReset
    ? []
    : prototypePlaylists.filter(
        (playlist) => !savedPlaylistTitles.has(playlist.title),
      )),
  ...playlists,
];

try {
  profile = JSON.parse(localStorage.getItem("skillsNavigatorProfile") || "{}");
} catch {
  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = "Saved interests could not be loaded.";
  interestsContainer.append(message);
}

if (interestsContainer.childElementCount === 0) {
  renderInterests(profile);
}

if (playlists.length === 0 && container.childElementCount === 0) {
  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = "You haven’t saved a playlist yet.";
  container.append(message);
} else {
  playlists.forEach(renderPlaylist);
}

resetPlaylistsButton.addEventListener("click", () => {
  localStorage.removeItem("skillsNavigatorPlaylists");
  localStorage.setItem("skillsNavigatorPlaylistsReset", "true");
  sessionStorage.removeItem("skillsNavigatorSelectedContent");
  playlists = [];
  container.replaceChildren();

  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = "You haven’t saved a playlist yet.";
  container.append(message);
  resetStatus.textContent = "Playlists reset.";
});

resetPreferencesButton.addEventListener("click", () => {
  localStorage.removeItem("skillsNavigatorProfile");
  profile = {};
  interestsContainer.replaceChildren();
  renderInterests(profile);
  resetStatus.textContent = "Preferences reset.";
});
