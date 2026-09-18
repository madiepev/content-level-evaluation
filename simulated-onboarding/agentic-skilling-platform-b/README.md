## Skills Navigator Version B takeover guide

This folder contains a browser-only prototype for an agentic learning platform. It guides a learner through a short conversation, generates a three-item learning playlist, supports optional personalization, and shows saved playlists on a separate page.

The prototype uses plain HTML, CSS, and JavaScript. It has no package dependencies, build process, or local service.

## Start the prototype

1. Open `index.html` in a browser.
2. Select a foundational or task-based path.
3. Complete the prompts or use one of the quick-jump prompts.
4. Select **Save playlist** to expose the optional profile-preference controls.
5. Open **View my playlists** to inspect the saved and seeded playlists.

For detailed scenarios and expected results, see [HAPPY-PATH-TESTS.md](./HAPPY-PATH-TESTS.md).

## Use the quick-jump prompts

Paste either prompt into the composer from any point in the prototype:

```text
Show happy path: Generative AI | key concepts | 15–30 minutes | Module
```

```text
Show happy path: Build and deploy an AI agent | 30–60 minutes | Module | Microsoft Foundry
```

Each prompt resets the visible conversation and opens the requested generated result. It doesn't save the playlist automatically.

## Understand the primary flows

The prototype supports these entry points:

- **Build foundational knowledge:** Collects a topic, goal, time range, and learning style.
- **Task-based paths:** Collects a task, time range, learning style, and optional products.
- **Prepare for a credential:** Remains a placeholder.

The six supported golden paths and all expected recommendation mappings are documented in [HAPPY-PATH-TESTS.md](./HAPPY-PATH-TESTS.md).

## Understand recommendation behavior

- Each result contains three recommendations.
- Module, Video, and Lab cards use blue, purple, and green accents.
- Video and Lab are simulated presentations of module-backed records.
- **Why these results?** summarizes what the learner accomplishes across the playlist.
- **How should I choose where to start?** explains the progressive order.
- Task results use **More guidance**, **Closest match**, and **Stretch option**.
- Generated recommendation titles open the corresponding live Microsoft Learn page.

## Personalize results and save preferences

**Personalize these results** uses the same metadata model as profile preferences:

1. Level.
2. Duration.
3. Format.
4. Products.
5. Skills.

All categories support multiple selections. The regenerated cards distribute selected levels, time ranges, and formats across the three recommendations. Product and Skill choices start with path-relevant options and can reveal additional related choices.

After a learner saves a playlist, the same selected metadata appears in **Want more like this? Save your preferences.** Saving preferences is separate from saving the playlist.

## Use My playlists

`profile.html` is the **My playlists** page. It includes two seeded prototype playlists:

- Generative AI, Understand the key concepts, 15–30 minutes, Module.
- Build and deploy an AI agent, 30–60 minutes, Module, Microsoft Foundry.

The saved cards use the same visual treatment as generated cards. Their titles open `content.html`, the internal mock content page. No playlist title links directly to Microsoft Learn.

Use the reset controls independently:

- **Reset playlists:** Clears stored playlists, hides the two seeded playlists, and keeps them hidden after refresh.
- **Reset preferences:** Clears saved Level, Duration, Format, Products, and Skills values.

Saving a new playlist clears the playlist-reset marker.

## Understand browser storage

The prototype uses these browser storage keys:

| Key | Storage | Purpose |
|---|---|---|
| `skillsNavigatorPlaylists` | Local storage | Stores the most recently saved generated playlist. |
| `skillsNavigatorProfile` | Local storage | Stores selected profile preferences. |
| `skillsNavigatorPlaylistsReset` | Local storage | Keeps seeded playlists hidden after reset. |
| `skillsNavigatorSelectedContent` | Session storage | Passes the selected playlist item to the mock content page. |

Version A and Version B share the playlist and profile keys. Avoid clearing all local storage when you only intend to reset one part of the prototype.

## Know the key files

| File | Purpose |
|---|---|
| `index.html` | Main conversational interface. |
| `script.js` | Flow state, recommendations, personalization, saving, and quick-jump prompts. |
| `styles.css` | Shared styling for conversation, result cards, playlists, and content details. |
| `learning-catalog.js` | Compact catalog of real Microsoft Learn module records used by the golden paths. |
| `profile.html` | My playlists page and reset controls. |
| `profile.js` | Seeded playlists, saved playlist rendering, preferences, and reset behavior. |
| `content.html` | Internal mock content-detail page. |
| `content.js` | Mock content-detail rendering and derived learning metadata. |
| `HAPPY-PATH-TESTS.md` | Manual tests, quick-jump prompts, and permutation coverage. |
| `DESIGN-DECISIONS.md` | Product and interaction decisions made during prototyping. |

## Preserve these implementation decisions

- Keep Version A unchanged unless the work explicitly requires a cross-version update.
- Keep the six golden-path recommendation mappings deterministic.
- Keep missing catalog records as explicit errors rather than silent fallbacks.
- Keep playlist saving and preference saving as separate actions.
- Keep playlist-page links internal to the mock content page.
- Keep generated recommendation links pointed at Microsoft Learn.
- Keep the generated and saved card layouts visually consistent.
- Keep Level, Duration, Format, Products, and Skills aligned across personalization and preferences.

## Validate changes

Run JavaScript syntax checks:

```powershell
node --check .\script.js
node --check .\profile.js
node --check .\content.js
```

Run the scenarios in [HAPPY-PATH-TESTS.md](./HAPPY-PATH-TESTS.md) after changes to flow state, recommendation mappings, persistence, or card rendering.

## Know the intentional limitations

- Credential preparation isn't implemented.
- Free-text requests outside the six golden paths use simplified fallback behavior.
- Product and Skill refinements are simulated and don't use a production recommendation service.
- Video and Lab results reuse module-backed catalog entries.
- Durations, formats, levels, prerequisites, objectives, roles, and skills are prototype metadata.
- The mock content page represents the future content experience. It isn't a complete learning module.
