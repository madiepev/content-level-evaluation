const container = document.querySelector("#saved-playlists");
const template = document.querySelector("#saved-playlist-template");
const interestsContainer = document.querySelector("#profile-interests-list");

function renderInterests(profile) {
  const categories = [
    ["topics", "Topics"],
    ["products", "Products"],
    ["learningPreferences", "Learning preferences"],
    ["durations", "Time durations"],
  ];
  let hasInterests = false;

  categories.forEach(([key, label]) => {
    const values = Array.isArray(profile[key]) ? profile[key] : [];
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
      tag.textContent = value;
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

function renderPlaylist(playlist) {
  const fragment = template.content.cloneNode(true);
  const article = fragment.querySelector(".saved-playlist");
  const body = fragment.querySelector("tbody");

  article.querySelector("h2").textContent = playlist.title;
  article.querySelector(".saved-playlist-meta").textContent = [
    playlist.goal,
    playlist.time,
    playlist.format,
  ].join(" · ");

  playlist.items.forEach((item) => {
    const row = document.createElement("tr");
    const details = document.createElement("td");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const metadata = document.createElement("td");

    title.textContent = item.title;
    title.title = item.title;
    description.textContent = item.description;
    details.append(title, description);

    metadata.className = "result-metadata";
    metadata.append(
      createMetadata("Duration", item.duration),
      createMetadata("Format", item.format),
      createMetadata("Level", item.level || "Beginner (L100)"),
    );

    row.append(details, metadata);
    body.append(row);
  });

  container.append(fragment);
}

let playlists = [];
let profile = {};

try {
  playlists = JSON.parse(localStorage.getItem("skillsNavigatorPlaylists") || "[]");
} catch {
  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = "Saved playlists could not be loaded.";
  container.append(message);
}

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
