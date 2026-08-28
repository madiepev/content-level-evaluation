# Introduction

We want to automatically assign proficiency levels, from L100 to L500, to our technical training content, so learners can find material that matches their current skill. A first definition already exists for what each level means, summarized below.

| Level | Focus | Basic definition |
| --- | --- | --- |
| L100: Beginner | Understand and identify | Demonstrates basic awareness of a concept. |
| L200: Intermediate | Apply and describe | Can explain the concept clearly, but stays at a general level. |
| L300: Proficient | Analyze and integrate | Demonstrates practical understanding by reasoning through how the concept applies to a specific context or problem. |
| L400: Advanced | Evaluate and extend | Frames tradeoffs or implications of different approaches using the concept. |
| L500: "Frontier" Expert | Originate and scale | Demonstrates expert level judgment by guiding and influencing the community's thinking, reframing broader problems, and recommending scalable paths forward. |

That first definition is the rubric this study works from. Strengthening it requires attention to two distinct properties: **reliability** and **validity**.

- Reliability asks whether different judges agree on the level a piece of content gets, first between human raters, and later between human raters and any agent that takes over the categorization.
- Validity asks whether the levels measure the right thing in the first place: specifically, whether a level actually helps a learner recognize whether a piece of content is written for them, at their current skill.

A rubric can be reliable without being valid, raters can agree perfectly on a label that still fails to tell learners anything useful about fit, so both properties need to be checked directly, not assumed. This matters even more once categorization is automated: an agent trained or prompted to match human ratings will only ever be as reliable and as valid as the rubric and labels it is aligned to, so any gap in either property does not stay small, it gets applied consistently at scale.

This study treats optimizing the level rubric for both reliability and validity as the research question: how do we know the level definitions, applied by humans and eventually by agents, are both consistent and actually useful to learners deciding whether content is right for them? This splits into three research questions:

1. How reliable are trained human raters with each other when they apply the current level definitions? This is the first check, and the baseline for everything else.
2. Which features or signals of a piece of content do raters actually rely on to judge its level, and do those signals track what actually makes content a good fit for a learner at that level? This is where validity gets tested, not just agreement between raters.
3. Once categorization is automated, how should an ongoing human shadow-rating process, a sample of the automated evaluator's outputs checked by human raters on a regular basis, be designed so that its reliability and the rubric's validity stay trustworthy over time, rather than being checked just once?

# Theory

Assigning a level to a piece of content is structurally similar to grading a piece of student work against a rubric. Both require explicit criteria, and both require that the judgment be reliable across whoever is making it, whether that is one rater, several raters, or eventually a rubric-guided automated check. Three ideas from the research literature apply directly.

**Real examples enrich and sharpen existing criteria.** Rubric research finds that reliable performance-level descriptors, the specifics of what "beginner" or "expert" content actually looks like, are strengthened by sorting real samples of work across the quality range and using what separates the piles to refine the definitions. Reliability between raters is also consistently higher when raters are trained together on shared example cases before rating independently (Popham, 1997; Stevens & Levi, 2013; Jonsson & Svingby, 2007).

**An automated judge is only as good as its measured agreement with humans.** If part of the leveling process is ever automated, whether by an LLM, an agent, or a rule-based check, the research on evaluating automated judges is consistent on one point: the implementation matters less than whether it is demonstrably aligned with human ratings. That alignment should be measured with a chance-corrected statistic such as Cohen's kappa, not raw percent agreement, since raw agreement has been shown to overstate how good a judge actually is by a wide margin (Zheng et al., 2023; Norman et al., 2026).

**The sample used to build and test the levels needs deliberate design.** A good evaluation sample is sourced from real, representative examples plus deliberately chosen edge cases, since a sample of only easy, obvious cases will not reveal where raters or an automated check actually struggle to agree (Ribeiro et al., 2020).

# Methods

**Sample.** Decide the coverage the dataset needs first: which levels and topics it must span, including edge cases that plausibly sit between two levels. Then collect and curate content that meets that coverage, drawing from across our learning content rather than a single skill domain. See the subpage below for the full sampling method.

Sampling Content for the Evaluation Dataset

**Rubric construction.** Build the working rubric from the existing L100 to L500 definitions, refined with input from subject matter experts (Talia and Liberty). This is version 1 of the rubric.

**Round 1 rating.** Distribute the rubric and the sample as a form. Raters use it independently to categorize each piece of content and assign it a level, recording their confidence and which content elements they used to decide. Compute inter-rater agreement with Cohen's kappa, or an intraclass correlation if levels are treated as ordered. This is the baseline reliability score for research question 1.

**Rubric revision.** During a hackathon session, the group reviews the round 1 results together: where raters agreed, where they disagreed, and why. Use the disagreements to revise the rubric with sharper definitions for each level, plus concrete examples of what content at that level looks like. This produces version 2 of the rubric.

**Round 2 rating.** Distribute the revised rubric and a different subset of the same content pool as a new form. Raters again categorize the content independently, recording the same information as round 1. Compute Cohen's kappa again and compare it to the round 1 score, to test whether the sharper definitions and examples actually raise reliability, not just whether raters agree in the abstract.

**Rubric finalization.** A third session reviews the round 2 results and any remaining disagreements, and finalizes the rubric.

**Signal analysis.** Take the notes on which content elements raters used to decide, across both rounds, and analyze them qualitatively: read through the notes, write open notes on what each rater pointed to, then group those notes into a small taxonomy of content signals. This answers research question 2.

**Automated leveling.** Use the finalized rubric to automatically assign a level to every piece of content in the repository, either with an LLM-based judge using explicit criteria and structured scoring, or a rule-based check on the content signals identified above. Score it against the human-labeled sample from the two rating rounds and compute Cohen's kappa against the human ratings, not exact match. If the evaluator is LLM-based, also check it for position bias by re-ordering the inputs it sees.

**Re-validation via human shadow rating.** Once the automated evaluator is in use, design an ongoing shadow-rating process: on a regular schedule, draw a sample of content the evaluator has already categorized and have human raters score it independently, blind to the evaluator's output. Compare the two with Cohen's kappa, the same way the earlier reliability checks were done, and periodically re-examine validity as well. Both the criteria and the content will drift over time as new examples and edge cases appear, so this schedule needs to run continuously rather than only once.

**From levels to discovery.** Once content has levels, the next phase designs how those levels surface in search, personalization, and onboarding. This addresses research question 2 from the applied side: which signals actually help a learner recognize the right content. A kickoff session shows three demo approaches. Participants then use a GH Pages builder to select the filters and search-result fields they want, which produces a specification file they can submit and optionally use to vibe-code their own prototype. A closing session collects all the specifications, looks for patterns and disagreements across them, and combines them into one prototype.

# References

- Popham, W. J. (1997). What's wrong, and what's right, with rubrics. *Educational Leadership, 55*(2), 72-75.
- Stevens, D. D., & Levi, A. J. (2013). *Introduction to Rubrics: An Assessment Tool to Save Grading Time, Convey Effective Feedback, and Promote Student Learning* (2nd ed.). Stylus Publishing.
- Jonsson, A., & Svingby, G. (2007). The use of scoring rubrics: Reliability, validity and educational consequences. *Educational Research Review, 2*(2), 130-144.
- Zheng, L., Chiang, W.-L., Sheng, Y., et al. (2023). Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena. *NeurIPS 2023*.
- Norman, J. D., Rivera, M. U., & Hughes, D. A. (2026). Reliability without Validity: A Systematic, Large-Scale Evaluation of LLM-as-a-Judge Models Across Agreement, Consistency, and Bias. *arXiv:2606.19544*.
- Ribeiro, M. T., Wu, T., Guestrin, C., & Singh, S. (2020). Beyond Accuracy: Behavioral Testing of NLP Models with CheckList. *ACL 2020*.
