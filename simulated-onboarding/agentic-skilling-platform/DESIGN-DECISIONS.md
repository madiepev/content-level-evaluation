**Skills Navigator design decision log**

This log records product and interface decisions for the Skills Navigator prototype. Update it when a decision changes or an open question is resolved.

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
- Apply your knowledge.
- Prepare for a credential.

**Rationale:** The paths represent distinct learner intentions and provide a predictable first decision.

**Decision:** Describe the foundational path as beginner to intermediate and the task-based path as proficient to expert.

**Rationale:** The proficiency ranges clarify that foundational learning builds understanding, while task-based learning helps learners apply established knowledge.

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

**Decision:** Offer three optional refinement directions after task results:

- Add starting experience.
- Add technical constraints.
- Narrow the task outcome.

**Rationale:** These details improve level calibration, feasibility, and goal matching more directly than another general preference question.

**Decision:** After task results, offer **Build a learning plan** as a separate next step.

**Rationale:** The task playlist solves an immediate problem. A learning plan helps the learner deepen the skill, progress to more advanced work, and stay current after completing the task.

## Suggested responses

**Decision:** Present three primary suggestions for topic, goal, and time. Present four format suggestions because “A balanced mix” is a distinct and useful final preference.

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
- Short, colored “Choose this” guidance above each option when results contain two or more formats.

**Decision:** Omit shared **Learning option / Details** headings because the content title and labeled metadata make the columns clear.

**Decision:** Use restrained blue, purple, and green accents to distinguish text, video, and hands-on options.

**Rationale:** The shared columns preserve quick metadata comparison, while separate cards and guidance keep each decision self-contained. Color supports scanning without relying only on bold text or replacing explicit format labels.

**Decision:** Don't show “Choose this” guidance when every result uses the same format.

**Rationale:** Format-based decision guidance becomes redundant after the learner explicitly selects one learning format.

**Prototype comparison:** Provide **Details right** and **Details below** views. The second view places duration, format, and level in one compact line beneath the title and description.

**Decision:** Use **Details below** as the default result layout and retain **Details right** as an optional comparison view.

**Rationale:** Inline metadata keeps each result compact and self-contained while the optional right-column view supports continued evaluation of scanability.

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

**Decision:** Let learners add a playlist to their profile and open it on a separate profile page.

**Rationale:** The conversation supports discovery. A dedicated page supports persistent access and later progress features.

## Saved interests

**Decision:** Save the playlist first. After the save succeeds, offer compact, optional multi-select controls for topics, products, learning preferences, and time durations under “Want more content like this? Save your preferences.”

**Rationale:** Separating playlist saving from preference saving keeps the primary decision focused. The follow-up prompt introduces personalization only after the learner commits to keeping the playlist.

**Not chosen:** Preselect or automatically save criteria. Playlist storage doesn't imply consent to use each answer as an ongoing profile preference.

## Related interests

**Decision:** Reveal one logical next option when a learner selects a related topic or product. Selected options show a removable × on hover or keyboard focus.

**Rationale:** Progressive expansion lets learners follow a relationship such as Generative AI → Microsoft Copilot → Microsoft Copilot Studio → Scout → Microsoft Foundry without presenting the full chain at once.

**Example relationship:** Generative AI connects to Microsoft Copilot, Microsoft Copilot Studio, Scout, and Microsoft Foundry.

**Not chosen:** Add related interests automatically. A logical product relationship doesn't always represent the learner's intent.

## Open questions

- Should the final curated playlist use progressive stages, task groups, or both?
- Which action is primary on the final playlist: start or save?
- Which controls belong in **Adjust this playlist**?
- How should **Explore task-based learning** connect to the completed foundational path?
- Which real content catalog supplies titles, metadata, links, and availability?
- How should the platform rank and explain the recommended result?
