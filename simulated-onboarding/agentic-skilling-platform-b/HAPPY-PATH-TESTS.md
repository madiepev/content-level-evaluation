# Version B happy-path test guide

Use this guide to validate the primary Skills Navigator prototype journeys and their meaningful permutations.

## Quick-jump prompts

Paste either prompt into the composer from any point in the prototype to reset the conversation and jump directly to that generated playlist:

```text
Show happy path: Generative AI | key concepts | 15–30 minutes | Module
```

```text
Show happy path: Build and deploy an AI agent | 30–60 minutes | Module | Microsoft Foundry
```

The shortcuts are case-insensitive and accept a hyphen or en dash in the time range. They reset the visible conversation but don't save the generated playlist.

## Prototype testing tips

- Open `index.html` directly. The prototype doesn't require a local server, package installation, or build.
- Wait for each response animation to finish before you select the next option.
- Use **Restart** on the discovery page to clear the conversation and learner selections.
- Use **Reset playlists** on **My playlists** to clear both stored and seeded playlists. The reset persists after a page refresh.
- Use **Reset preferences** to clear profile preferences without removing playlists.
- Select **Save playlist** before you test the post-save preference controls.
- Expect generated recommendation titles to open live Microsoft Learn pages.
- Expect titles on **My playlists** to open the internal mock content page instead.
- Use **Personalize these results** to test multi-select Level, Duration, Format, Products, and Skills values.
- Select a related Product or Skill to verify that additional connected choices appear without being selected automatically.
- Refresh the page if browser animation timing leaves a control temporarily unavailable.
- Don't treat Video and Lab cards as separate source assets. They are simulated presentations of module-backed catalog records.

## Test environment

Open `index.html` from the `agentic-skilling-platform-b` folder.

Before each test:

1. Select **Restart**.
2. Confirm that the landing page presents:
   - **Build foundational knowledge**
   - **Task-based paths**
   - **Prepare for a credential**

## Shared option sets

Both foundational and task-based paths must present the same time and format choices.

### Time

- **15–30 minutes**
- **30–60 minutes**
- **More than 1 hour**

### Learning style

- **Text-based learning**
- **Video-based learning**
- **Hands-on exercise**
- **A balanced mix**

Expected format behavior:

| Selected learning style | Result format | Guidance in a mixed set |
|---|---|---|
| Text-based learning | Module | Read at your own pace. |
| Video-based learning | Video | Visual walkthrough. |
| Hands-on exercise | Lab | Guided practice. |
| A balanced mix | Module, Video, and Lab | Show the corresponding guidance on each card. |

## Golden path 1: Generative AI foundation

1. Select **Build foundational knowledge**.
2. Select **What is generative AI?**
3. Select **Understand the key concepts**.
4. Select **15–30 minutes**.
5. Select **Text-based learning**.

Expected recommendations:

1. Introduction to generative AI and agents.
2. Plan and prepare to develop AI solutions on Azure.
3. Implement a responsible generative AI solution in Microsoft Foundry.

Expected presentation:

- Durations are 18, 22, and 28 minutes.
- Every result displays **Module**.
- No “Choose this…” guidance appears because every result has the same format.
- The default layout is **Details below**.
- **Personalize these results** and **Change to task-based paths** are available.

## Golden path 2: Effective Copilot prompts foundation

1. Select **Build foundational knowledge**.
2. Select **Write effective Copilot prompts**.
3. Select **Explore common uses and scenarios**.
4. Select **30–60 minutes**.
5. Select **Video-based learning**.

Expected recommendations:

1. Introduction to generative AI and agents.
2. Create effective prompts for generative AI tools.
3. Integrate custom tools into your agent.

Expected presentation:

- Durations are 35, 45, and 55 minutes.
- Every result displays **Video**.
- No “Choose this…” guidance appears because every result has the same format.

## Golden path 3: AI agents foundation

1. Select **Build foundational knowledge**.
2. Select **What are AI agents?**
3. Select **Understand benefits and limitations**.
4. Select **More than 1 hour**.
5. Select **Hands-on exercise**.

Expected recommendations:

1. Introduction to generative AI and agents.
2. Develop AI agents with Microsoft Foundry and Visual Studio Code.
3. Build knowledge-enhanced AI agents with Foundry IQ.

Expected presentation:

- Durations are 65, 75, and 90 minutes.
- Every result displays **Lab**.
- No “Choose this…” guidance appears because every result has the same format.

## Golden path 4: Build and deploy an AI agent

1. Select **Task-based paths**.
2. Select **Build and deploy an AI agent**.
3. Select **30–60 minutes**.
4. Select **Text-based learning**.
5. Select **Microsoft Foundry**.
6. Select **Use selected products**.

Expected recommendations:

| Match | Recommendation |
|---|---|
| More guidance | Introduction to generative AI and agents |
| Closest match | Develop AI agents with Microsoft Foundry and Visual Studio Code |
| Stretch option | Build agent-driven workflows using Microsoft Foundry |

Expected presentation:

- Durations are 30, 45, and 60 minutes.
- Every result displays **Module**.
- The rationale mentions Microsoft Foundry.
- **Personalize these results** is available.
- No **Build a learning plan** prompt appears.

## Golden path 5: Automate a business process

1. Select **Task-based paths**.
2. Select **Automate a repeatable business process**.
3. Select **15–30 minutes**.
4. Select **Video-based learning**.
5. Select **Microsoft Copilot Studio**.
6. Select **Use selected products**.

Expected recommendations:

| Match | Recommendation |
|---|---|
| More guidance | Embrace responsible AI principles and practices |
| Closest match | Design AI agents for business solutions |
| Stretch option | Design the application lifecycle for AI-powered business solutions |

Expected presentation:

- Durations are 18, 24, and 30 minutes.
- Every result displays **Video**.
- The rationale mentions Microsoft Copilot Studio.

## Golden path 6: Connect enterprise data

1. Select **Task-based paths**.
2. Select **Connect enterprise data to AI experiences**.
3. Select **More than 1 hour**.
4. Select **Hands-on exercise**.
5. Select **Skip products**.

Expected recommendations:

| Match | Recommendation |
|---|---|
| More guidance | Get started with Microsoft Foundry IQ |
| Closest match | Implement generative AI agents with Azure Database for PostgreSQL |
| Stretch option | Introduction to retrieval-augmented generation concepts |

Expected presentation:

- Durations are 65, 75, and 90 minutes.
- Every result displays **Lab**.
- The context states **No product preference**.

## Test foundational early results

The **Get started now** option appears after the learner selects a topic and remains available while additional foundational questions are unanswered.

Test these stopping points:

1. Select only a topic, then select **Get started now**.
2. Select a topic and goal, then select **Get started now**.
3. Select a topic, goal, and time, then select **Get started now**.

Expected behavior:

- The selected topic determines the recommendations.
- Missing time defaults to **30 minutes or less**.
- Missing learning style returns one **Module**, one **Video**, and one **Lab**.
- Each result includes the appropriate short guidance because the set contains mixed formats.
- The next unanswered question appears after the recommendations.

## Test result personalization

Run this test once from foundational results and once from task results.

1. Select **Personalize these results**.
2. Choose **Intermediate (L200)** and **Proficient (L300)**.
3. Choose **15–30 minutes** and **30–60 minutes**.
4. Choose **Video-based learning** and **Hands-on exercise**.
5. Select more than one related **Skill** or **Product**.
6. Confirm selecting a related chip can reveal another relevant option without selecting it automatically.
7. Select **Build prompt and update results**.

Expected behavior:

- A natural-language personalization prompt appears as a learner message.
- A new result set appears beneath the previous one.
- The new cards distribute the selected levels, duration ranges, and formats across the playlist.
- Every personalization category supports multiple selections.
- Level includes **Expert (L500)**.
- Agent and grounded-data paths can reveal **Scout**; the business-process path can reveal **Cowork**.
- The new cards distribute the selected Video and Lab formats.
- No “Choose this…” guidance appears because the learner explicitly selected the formats.
- Foundational topic changes update the recommended modules.
- Task goal continues to determine the task recommendation ladder.

## Test the foundational-to-task transition

1. Complete any foundational path.
2. Select **Change to task-based paths**.

Expected behavior:

- The conversation acknowledges the change.
- The original topic is retained as context.
- The interface asks, “What do you want to accomplish?”
- Progress resets to **Question 1 of 4**.
- Foundational goal, time, and format selections don't carry into the task questions.

## Test playlist saving

Run this test from either result flow.

1. Select **Save playlist**.
2. Confirm that “Playlist saved” appears.
3. Select any optional skills, products, formats, or durations.
4. Select **Save preferences**.
5. Open **View my playlists**.

Expected behavior:

- The Generative AI key-concepts and Build and deploy an AI agent prototype playlists appear.
- An explicitly saved playlist appears in addition to the seeded prototype paths unless it has the same title.
- Playlist items retain their titles, descriptions, durations, formats, and levels, and their titles open the internal mock content page.
- Playlist items use the same format-colored card presentation as generated results.
- Task playlists retain **More guidance**, **Closest match**, and **Stretch option** labels.
- Saved interests appear under their appropriate categories.
- Result personalization and profile preferences both use **Level**, **Duration**, **Format**, **Products**, and **Skills** in that order.
- Product preferences include Microsoft 365 Copilot, Microsoft Copilot Studio, Scout, and Cowork even when they weren't selected in the discovery flow.
- Selecting an application skill reveals related skills in the same **Skills** group.
- No module-count metadata appears.

## Test recommendation links

For each recommendation set:

1. Open each linked title.
2. Confirm that the link opens in a new tab.
3. Confirm that the destination is a live Microsoft Learn module.

On **My playlists**:

1. Select a module title.
2. Confirm that it opens the internal mock content page in the same tab.
3. Confirm that no playlist title links directly to Microsoft Learn.

## Permutation coverage

### Foundational paths

The complete foundational flow supports:

- 3 topics.
- 3 goals.
- 3 time choices.
- 4 learning styles.

Total: **108 complete permutations**.

Early results add:

- 3 topic-only routes.
- 9 topic-and-goal routes.
- 27 topic-goal-and-time routes.

Total including early-result routes: **147 foundational routes**.

### Task-based paths

The complete task flow supports:

- 3 task goals.
- 3 time choices.
- 4 learning styles.
- 8 product combinations, including no product preference.

Total: **288 base task permutations**.

The six golden paths in this guide cover every recommendation set, every time range, every format, selected and skipped product states, personalization, playlist saving, content details, and the foundational-to-task transition.
