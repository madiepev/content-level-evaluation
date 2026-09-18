**Skills Navigator design decision log**

This log records product and interface decisions for the Skills Navigator prototype. Update it when a decision changes or an open question is resolved.

## Version B direction

**Decision:** Preserve the original prototype as Version A and use Version B to test a flatter, denser, feed-style experience.

**Decision:** Remove assistant speech-bubble containers while retaining a slim colored rail and assistant name for conversational context.

**Rationale:** Large repeated bubbles add whitespace and nested surfaces. The rail preserves turn recognition while making the experience feel more like a modern personalized feed.

**Decision:** Use rounded rectangles with a consistent 8–10 pixel radius for interactive controls and cards. Reserve fully rounded shapes for the progress bar.

**Rationale:** A consistent shape language feels more deliberate and remains familiar across age groups.

## Product goal

**Decision:** Help learners find the right content in the fewest possible steps.

**Rationale:** Learners receive a small, relevant result set without searching a large catalog or completing an extended intake process.

## Assistant identity

**Decision:** Name the conversational assistant **Skilling playlist builder** and don't display a subtitle.

**Rationale:** The functional name explains what the assistant creates without adding a second identity line.

## Initial value proposition

**Decision:** Lead with “Get to the right learning, faster.”

**Rationale:** The message explains the immediate learner benefit before requesting information.

**Not chosen:** A detailed platform description. It delays the first meaningful choice and increases cognitive load.

## Initial learning paths

**Decision:** Present three paths:

- Build foundational knowledge.
- Task-based paths.
- Prepare for a credential.

**Rationale:** The paths represent distinct learner intentions and provide a predictable first decision.

**Decision:** Describe the foundational path as beginner to intermediate. Describe task-based paths as a way to apply existing knowledge to more complex tasks and specific needs.

**Rationale:** The task-based language welcomes learners who have some relevant knowledge without implying that they must already be proficient or expert.

## Foundational discovery flow

**Decision:** Use no more than five criteria:

1. Learning path.
2. Topic or product.
3. Goal.
4. Available time.
5. Preferred format.

**Rationale:** These criteria materially affect relevance while keeping the path short.

## Task-based discovery flow

**Decision:** Ask for task criteria in this order:

1. Goal or problem to solve.
2. Available time.
3. Preferred format.
4. Optional product context.

**Rationale:** Task-based learners arrive with an outcome in mind. Product context can improve matching, but it shouldn't be required before the platform understands the goal.

**Decision:** Return three starting points centered on Advanced (L400):

- Proficient (L300) for learners who need more guidance.
- Advanced (L400) as the closest task match.
- Expert (L500) as a stretch option for greater scale and complexity.

**Rationale:** Adjacent levels let learners calibrate their own starting point instead of relying on a single inferred proficiency level.

## Suggested responses

**Decision:** Present three suggestions for topic, goal, and time. Present four learning-style suggestions, including **A balanced mix**. Use the same time and learning-style choices in foundational and task-based flows.

**Rationale:** Three choices support fast scanning without forcing weak options for visual symmetry.

**Not chosen:** Four or more suggestions at every step. Additional choices increase comparison effort without consistently improving the result.

## Early results

**Decision:** Offer **Get started now** as a secondary action during personalization.

**Rationale:** Learners can stop answering questions and receive results based on the information already provided.

**Default behavior:** Return three alternatives, each 30 minutes or less:

- Text-based learning.
- Video-based learning.
- Hands-on practice.

## Progressive personalization

**Decision:** After early results, present the next unanswered question in a separate assistant message.

**Rationale:** Learners can continue through goal, duration, and format without selecting a separate “personalize” action. A separate message distinguishes the result from the next question.

## Refinement progress

**Decision:** Show a compact progress bar labeled “Question X of 4” during the foundational discovery flow.

**Rationale:** The indicator sets expectations, shows that the interaction is short, and helps learners decide whether to continue or request results early.

**Decision:** Pair each progress step with warm milestone feedback, such as “Your playlist is taking shape,” “Almost there,” and “The end is in sight.”

**Rationale:** The messages build anticipation and acknowledge progress without adding fake delays, decorative rewards, or humor that distracts from the learner’s goal.

## Playlist result count

**Decision:** Show three primary results.

**Rationale:** Three options provide meaningful variety, preserve comfortable spacing, and reduce indecision.

## Playlist result metadata

**Decision:** Show:

- Outcome-focused title.
- Description.
- Duration.
- Format.
- Human-readable level.

**Rationale:** These attributes answer what the learner will accomplish, how long it takes, how they will learn, and whether the content matches their proficiency.

**Not chosen:** Role, audience, products, skills, source, and complete prerequisites. These fields add density and usually don't improve the initial comparison.

## Result content standards

**Decision:** Use a title that starts with a verb and states the outcome and product. Don't start titles with gerunds.

**Decision:** Use a 20–25-word description, with a maximum of 35 words, that explains the solution and tasks.

**Decision:** Limit the visible title and description to three lines:

- One title line.
- Two description lines.

**Rationale:** Consistent, concise copy improves scanning and comparison.

## Proficiency scale

**Decision:** Pair each numeric level with a plain-language label:

- Beginner (L100).
- Intermediate (L200).
- Proficient (L300).
- Advanced (L400).
- Expert (L500).

**Rationale:** Learners shouldn't need prior knowledge of the numeric scale.

## Result layout

**Decision:** Present every in-chat result set as a hybrid of the table and card patterns:

- One separate, color-coded card per option.
- Title and description on the left.
- Duration, format, and level on the right.
- Colored “Choose this” guidance above each option when results contain two or more formats.

**Decision:** Omit shared **Learning option / Details** headings because the content title and labeled metadata make the columns clear.

**Decision:** Give all result cards the same white surface and neutral border. In the default Details below view, present duration, format, and level as three equal-weight, softly tinted labels inside the card rather than as a footer. Match all three labels to the card's format color.

**Rationale:** The content recommendation should remain the primary visual signal. Compact labels keep supporting metadata scannable without creating a heavy visual band or overpowering the description.

**Decision:** Use restrained blue, purple, and green tints for Module, Video, and Lab metadata. In the early beginner starter playlist, repeat the corresponding tint in guidance labeled **Read at your own pace**, **Visual walkthrough**, or **Guided practice**. Hide this guidance after the learner chooses a format and throughout the task flow. Don't assign a different color to every level. Give duration, format, and level the same visual emphasis, and reserve the stronger brand treatment for the **Closest match** indicator in task results.

**Decision:** For the task-based balanced mix, order formats as Video for **More guidance**, Module for **Closest match**, and Lab for **Stretch option**. Use 15 minutes for the introductory Video.

**Decision:** Don't show “Choose this” guidance when every result uses the same format.

**Rationale:** Format-based decision guidance becomes redundant after the learner explicitly selects one learning format.

**Decision:** Describe each mixed-format option by its experience, such as “read at your own pace,” “visual walkthrough,” or “guided activity.” Keep duration in the metadata line instead of repeating it.

**Rationale:** Experience language helps learners compare formats while the adjacent metadata provides the duration without repetition or subjective classifications such as short.

**Prototype comparison:** Provide **Details right** and **Details below** views. The second view places duration, format, and level in one compact line beneath the title and description.

**Decision:** Use **Details below** as the default result layout and retain **Details right** as an optional comparison view.

**Decision:** In **Details below**, show only the metadata values separated by dividers. Keep the Duration, Format, and Level labels in **Details right**.

**Rationale:** Inline metadata is understandable without repeated labels. The right-column labels still support comparison when learners choose that layout.

**Decision:** Use a consistent result-card type scale: 18 pixels for titles, 16 pixels for descriptions and primary controls, 15 pixels for metadata, and 14 pixels for supporting labels.

**Rationale:** A predictable hierarchy makes the interface easier to scan at the browser's default zoom and continues to scale with browser zoom settings.

**Decision:** Link every result title to Microsoft Learn before the learner saves the playlist. Preserve the destination in saved playlists and generate a Microsoft Learn training search link for older saved items without a stored URL.

**Rationale:** Learners can open an individual recommendation immediately without committing to the entire playlist. Search links provide live destinations while the prototype uses simulated content titles.

## Content landing page hierarchy

**Decision:** Place these elements above the fold:

1. Title.
2. Description.
3. Level.
4. Duration.
5. Format.
6. Prerequisites.
7. Learning objectives.
8. **Start learning** action.

**Rationale:** These elements establish the outcome, effort, suitability, requirements, and expected learning before the learner starts.

**Decision:** Place role or audience, products, and skills below the fold.

**Rationale:** These attributes support discovery and context, but they are less important after the learner reaches the content from a personalized playlist.

## Saved playlists

**Decision:** Use the separate **My playlists** page to mock the Generative AI key-concepts path and the Build and deploy an AI agent path. Keep optional preferences associated with the learner profile.

**Rationale:** The conversation supports discovery. A dedicated page supports persistent access and later progress features, while limiting the prototype to one deliberately saved playlist prevents old test and exploration results from accumulating.

**Decision:** Provide separate **Reset playlists** and **Reset preferences** controls. Resetting playlists also suppresses the seeded prototype playlists on later reloads until another playlist is explicitly saved.

**Decision:** Support exact pasteable quick-jump prompts for the two mocked happy paths so prototype testing can bypass the question sequence without changing normal learner behavior.

## Saved interests

**Decision:** Save the playlist first. After the save succeeds, offer compact, optional multi-select controls for **Level**, **Duration**, **Format**, **Products**, and **Skills** under “Want more like this? Save your preferences.” Use the same field names, order, and option vocabulary in result personalization and profile preferences. Treat foundational topics and applied skills as one **Skills** grouping in this prototype.

**Rationale:** Separating playlist saving from preference saving keeps the primary decision focused. The follow-up prompt introduces personalization only after the learner commits to keeping the playlist.

**Decision:** Use the exact duration choices from the relevant discovery turn in the preference controls.

**Rationale:** Matching the original choices prevents overlapping or contradictory duration categories.

**Not chosen:** Preselect or automatically save criteria. Playlist storage doesn't imply consent to use each answer as an ongoing profile preference.

## Related interests

**Decision:** Reveal logical related topics and products when a learner selects an option. For example, Generative AI reveals Effective Copilot prompts, AI agents, and Microsoft Copilot. Selected options show a removable × on hover or keyboard focus.

**Rationale:** Progressive expansion lets learners follow a relationship such as Generative AI → Microsoft Copilot → Microsoft Copilot Studio → Scout → Microsoft Foundry without presenting the full chain at once.

**Decision:** Use the same progressive expansion in the **Skills** group. Selecting an application skill can reveal related capabilities such as prompt engineering, evaluation, responsible AI, tool integration, knowledge grounding, orchestration, and governance.

**Example relationship:** Generative AI connects to Microsoft Copilot, Microsoft Copilot Studio, Scout, and Microsoft Foundry.

**Not chosen:** Add related interests automatically. A logical product relationship doesn't always represent the learner's intent.

## Result personalization

**Decision:** Replace **Refine these results** with **Personalize these results** in both foundational and task-based flows. Show optional filters for level, duration, format, product, and skills.

**Decision:** Convert selected filters into a natural-language prompt, display that prompt as the learner's next chat message, and regenerate the simulated results.

**Rationale:** Structured controls reduce typing while preserving a transparent conversational interaction. This pattern is feasible with production chatbots because the interface can pass both the generated prompt and structured filter values to the recommendation service.

**Decision:** Ask learners to choose **Text-based learning**, **Video-based learning**, **Hands-on exercise**, or **A balanced mix**. Map the first three selections to the result formats **Module**, **Video**, and **Lab**. Map a balanced mix to one of each.

**Decision:** Make every **Personalize these results** category multi-select. Seed skills and products with the current path and show only one to three closely related additions. Selecting certain chips can progressively reveal another related choice, such as Scout for agent or grounded-data paths and Cowork for business-process paths. Distribute multiple selected levels, duration ranges, and formats across the three regenerated cards.

**Rationale:** Personalization should materially change the recommendation set, not only repeat the selected filters above unchanged cards.

## Recommendation rationale

**Decision:** Introduce every curated list with the learner’s topic or task as its title. Use **Why these results?** to summarize what the learner will accomplish across the recommended skills instead of repeating titles or selected criteria. Put progressive-order guidance behind a separate **How should I choose where to start?** disclosure.

**Rationale:** The visible personalization controls already communicate the selected criteria. A title-based summary explains the recommendation itself, while optional ordering guidance helps learners choose without adding repetitive text above the cards.

## Catalog-backed task paths

**Decision:** Back foundational and task-based recommendations with real module titles and UIDs listed in `content-data/learning-paths-with-foundry-modules.csv`.

**Decision:** Map each task goal to a deliberate progression:

- **More guidance:** Broader or introductory learning that prepares the learner for the task.
- **Closest match:** The real module with the strongest direct alignment to the selected goal.
- **Stretch option:** Advanced architecture, scale, operations, or governance content that extends beyond the immediate task.

**Decision:** Present recommendation metadata as **Module**, **Video**, or **Lab** while using text-based learning, video-based learning, and hands-on practice to generate natural guidance.

**Decision:** Continue to treat descriptions, duration, format, and proficiency level as prototype metadata because the source CSV provides module titles and UIDs but not those fields.

**Rationale:** Module-level records make individual recommendations more credible than relabeled learning paths. The broader AI/ML representative sample has richer metadata, but it contains only a small Microsoft Learn subset and doesn't provide enough relevant coverage for the prototype's task scenarios.

**Prototype limitation:** Video and Lab results currently reuse the module-backed recommendation records. Their format labels, styling, guidance, and detail metadata are simulated; the catalog doesn't yet contain separate video or lab assets.

## Learning content details

**Decision:** Keep generated recommendation titles linked directly to Microsoft Learn. On **My playlists**, link module titles to the internal mock content page instead of a live external destination, without adding a redundant details link. Render saved playlist items with the same format-colored cards, metadata, and task-match labels used for generated results.

**Decision:** Present the title, description, duration, format, level, prerequisites, and learning objectives in the primary reading flow. Place related roles and skills after a visual break as secondary discovery metadata.

**Rationale:** This order answers the learner's immediate questions before introducing classification data. It also avoids the fragmented split layout and category-first hierarchy in the reference experience.

## Switching from foundational to task-based learning

**Decision:** Offer **Change to task-based paths** after a learner completes the foundational questions. Preserve the selected topic as context, then begin the task flow at its goal question.

**Rationale:** Learners might recognize that they need applied learning only after they see foundational recommendations. Switching paths should preserve useful context without carrying over incompatible answers such as duration, learning style, or task goal.

## Open questions

- Should the final curated playlist use progressive stages, task groups, or both?
- Which action is primary on the final playlist: start or save?
- Which controls belong in **Adjust this playlist**?
- How should **Explore task-based learning** connect to the completed foundational path?
- Which real content catalog supplies titles, metadata, links, and availability?
- How should the platform rank and explain the recommended result?
