const composer = document.querySelector("#composer");
const input = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const messages = document.querySelector("#messages");
const suggestions = document.querySelector("#suggestions");
const userTemplate = document.querySelector("#user-message-template");
const loadingTemplate = document.querySelector("#loading-template");
const playlistTemplate = document.querySelector("#playlist-template");
const savedTemplate = document.querySelector("#saved-template");

let responseShown = false;

function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function scrollToLatest(behavior = "smooth") {
  const latest = messages.lastElementChild;
  latest?.scrollIntoView({ behavior, block: "start" });
}

function appendUserMessage(text) {
  const fragment = userTemplate.content.cloneNode(true);
  fragment.querySelector(".message-time").textContent = formatTime();
  fragment.querySelector(".user-message").textContent = text;
  messages.append(fragment);
}

function showPlaylist() {
  messages.querySelector(".loading-message")?.remove();

  const fragment = playlistTemplate.content.cloneNode(true);
  fragment.querySelector(".response-time").textContent = formatTime();
  messages.append(fragment);
  suggestions.hidden = false;
  input.value = "";
  input.placeholder = "Tell me more";
  input.disabled = false;
  sendButton.disabled = false;
  responseShown = true;
  scrollToLatest();
}

function showSystemMessage(text) {
  const message = document.createElement("p");
  message.className = "system-message";
  message.textContent = text;
  messages.append(message);
  suggestions.hidden = true;
  scrollToLatest();
}

function showSavedMessage() {
  const fragment = savedTemplate.content.cloneNode(true);
  fragment.querySelector(".response-time").textContent = formatTime();
  messages.append(fragment);

  const labels = [
    ["save", "Save as-is, please"],
    ["hands-on", "Tune for hands-on only"],
    ["timeline", "Set weekly pacing… 2 hrs/week"],
  ];

  suggestions.replaceChildren(
    ...labels.map(([action, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.action = action;
      button.textContent = label;
      return button;
    }),
  );
  suggestions.hidden = false;
  scrollToLatest();
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  appendUserMessage(text);
  input.value = "";
  input.placeholder = "Building your playlist…";
  input.disabled = true;
  sendButton.disabled = true;
  suggestions.hidden = true;

  if (responseShown) {
    window.setTimeout(() => {
      input.disabled = false;
      sendButton.disabled = false;
      input.placeholder = "Tell me more";
      showSystemMessage("Thanks—I've added that context to the simulation.");
    }, 450);
    return;
  }

  messages.append(loadingTemplate.content.cloneNode(true));
  scrollToLatest();
  window.setTimeout(showPlaylist, 900);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    composer.requestSubmit();
  }
});

suggestions.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  appendUserMessage(button.textContent.trim());

  if (button.dataset.action === "save") {
    suggestions.hidden = true;
    window.setTimeout(showSavedMessage, 350);
    return;
  }

  const responses = {
    "hands-on": "Got it. I'll tune the playlist to prioritize labs and applied exercises.",
    timeline: "No problem. Tell me how much time learners have and when they need to finish.",
  };

  showSystemMessage(responses[button.dataset.action]);
});
