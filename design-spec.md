# AI Skills Navigator-inspired design specification

## Purpose

Use this specification to build a simplified simulated page that feels consistent with the AI Skills Navigator **For you** experience without reproducing the production application exactly. Preserve the visual character, hierarchy, and interaction patterns; simplify the information architecture and component variants where practical.

This specification is based on the public page and its production styles as observed on August 28, 2026:

- [AI Skills Navigator: For you](https://aiskillsnavigator.microsoft.com/for-you)
- [Microsoft Fluent 2](https://fluent2.microsoft.design/)
- [Microsoft accessibility design standards](https://learn.microsoft.com/power-platform/well-architected/experience-optimization/design-standards)

## Design character

The experience should feel:

- Warm and approachable rather than corporate or clinical.
- Content-first, with large headings and generous breathing room.
- Softly dimensional, using rounded surfaces, subtle borders, and light shadows.
- Microsoft-aligned, but led by muted purple and warm neutrals rather than standard Microsoft blue.
- Helpful and personalized, with concise labels, recommendations, and clear next actions.

Avoid glassmorphism, heavy gradients on every component, neon colors, sharp corners, dense dashboards, and exaggerated shadows.

## Design tokens

### Color palette

Use semantic token names in components. Do not scatter raw hex values through the implementation.

| Token | Value | Use |
| --- | --- | --- |
| `--color-canvas` | `#FFFDFB` | Default page background |
| `--color-surface` | `#FFFFFF` | Cards, menus, dialogs |
| `--color-surface-subtle` | `#FAF6F0` | Alternate sections and quiet panels |
| `--color-surface-muted` | `#F1ECE5` | Selected or grouped neutral areas |
| `--color-border` | `#E8E6E3` | Default borders and dividers |
| `--color-border-strong` | `#D1D1D1` | Input and control boundaries |
| `--color-text` | `#272320` | Headings and primary body text |
| `--color-text-secondary` | `#4C4642` | Descriptions and metadata |
| `--color-text-muted` | `#635C57` | Hints and low-emphasis labels |
| `--color-brand` | `#6B55A3` | Primary buttons and key accents |
| `--color-brand-border` | `#70579C` | Selected and focused controls |
| `--color-brand-hover` | `#5E4B8F` | Primary-button hover |
| `--color-brand-soft` | `#70579C1A` | Selected tabs, chips, and subtle highlights |
| `--color-brand-disabled` | `#9C93B8` | Disabled brand controls |
| `--color-link` | `#0078D4` | Inline links only |
| `--color-success` | `#107C10` | Success status |
| `--color-success-soft` | `#DFF6DD` | Success background |
| `--color-danger` | `#C50F1F` | Error status and destructive actions |
| `--color-danger-soft` | `#FDF3F4` | Error background |
| `--color-warning-soft` | `#FFF3E8` | Warning or event callout background |

### Decorative gradients

Reserve gradients for a hero, event banner, or one featured card per viewport.

```css
--gradient-warm:
  linear-gradient(90deg, #e9e1f2 0%, #fedbc1 45.19%, #ffefc3 100%);

--gradient-ambient:
  radial-gradient(25% 200% at -5% 70%, #efecf8 0%, transparent 100%),
  radial-gradient(70% 120% at 95% 80%, #ffecad 0%, transparent 100%),
  radial-gradient(80% 160% at 50% 90%, #ffd1c4 0%, transparent 100%),
  radial-gradient(50% 70% at 15% 100%, #d1d1ff 0%, transparent 100%),
  linear-gradient(90deg, #fff8f3 0%, #fff3e8 100%);
```

### Typography

Use **Segoe Sans** where available, followed by **Segoe UI** and system sans-serif fallbacks. The production experience references `Segoe Sans, Segoe UI, sans-serif`.

```css
--font-sans: "Segoe Sans", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace;
```

| Style | Desktop | Mobile | Weight | Line height | Use |
| --- | --- | --- | --- | --- | --- |
| Display | 48 px | 36 px | 600 | 1.1 | Hero only |
| Page title | 36 px | 30 px | 600 | 1.2 | One per page |
| Section title | 30 px | 24 px | 600 | 1.2 | Major content groups |
| Card title | 20 px | 18 px | 600 | 1.3 | Card headings |
| Body large | 18 px | 18 px | 400 | 1.55 | Hero or section introductions |
| Body | 16 px | 16 px | 400 | 1.5 | Default content |
| Label | 14 px | 14 px | 600 | 1.4 | Buttons, filters, metadata labels |
| Caption | 12 px | 12 px | 400 | 1.35 | Secondary metadata |

Use sentence case. Keep body copy to approximately 50-70 characters per line and avoid weights above 600 except for rare promotional emphasis.

### Spacing

Use a 4 px base unit:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

- Page sections: 64-80 px vertical spacing on desktop; 40-48 px on mobile.
- Card grid gaps: 24 px desktop; 16 px mobile.
- Card padding: 24 px desktop; 20 px mobile.
- Form and filter gaps: 12-16 px.
- Icon-to-label gap: 8 px.

### Shape and elevation

| Token | Value | Use |
| --- | --- | --- |
| `--radius-control` | `8px` | Inputs and compact controls |
| `--radius-card` | `16px` | Standard cards |
| `--radius-feature` | `24px` | Hero, featured card, dialog |
| `--radius-pill` | `9999px` | Buttons, chips, avatars |
| `--shadow-card` | `0 1px 3px rgba(0, 0, 0, 0.10), 0 1px 2px rgba(0, 0, 0, 0.06)` | Resting card |
| `--shadow-card-hover` | `0 6px 12px rgba(0, 0, 0, 0.08), 0 0.5px 3px rgba(0, 0, 0, 0.08)` | Hovered card |
| `--shadow-overlay` | `0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)` | Dialog or popover |

Prefer a border plus a small shadow. Do not float every element.

### Motion

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

- Animate color, border, shadow, opacity, and transforms only.
- Card hover may translate up by at most 2 px.
- Avoid autoplay motion and parallax.
- Respect `prefers-reduced-motion: reduce`.

## Page layout

### Application shell

1. Use a full-width warm canvas.
2. Place a 64 px high header at the top.
3. Keep content in a centered container with a maximum width of 1280 px.
4. Use 32 px horizontal page padding on desktop, 24 px on tablet, and 16 px on mobile.
5. For a signed-in simulation, use a compact left navigation rail or sidebar plus a flexible main region. Collapse it below 1024 px.

### Header

- White or earth-white background with a subtle bottom border.
- Left: Microsoft mark placeholder, divider, and `AI Skills Navigator`.
- Center or left-center: primary navigation when space allows.
- Right: utility icon buttons, profile/avatar, and one primary action if needed.
- Use a 40-48 px control height and pill-shaped actions.
- On mobile, retain the product name and expose navigation through one menu button.

Do not recreate or redistribute the Microsoft logo asset unless the prototype is authorized to use it. A text label or neutral four-square placeholder is sufficient for a simulation.

### Main content order

A simplified **For you** page should use:

1. Welcome and page title.
2. Optional personalized summary or onboarding prompt.
3. Featured recommendation in a warm gradient panel.
4. Recommended learning cards.
5. Continue-learning row when progress data exists.
6. Explore-more call to action.

Use one dominant call to action per section.

### Grid

- Desktop, 1200 px and wider: three cards per row.
- Tablet, 768-1199 px: two cards per row.
- Mobile, below 768 px: one card per row.
- Cards in a row should align in height, but text should not be truncated solely to force alignment.

## Components

### Buttons

**Primary**

- Brand-purple background and white text.
- Pill shape; 40 px minimum height, 48 px for prominent actions.
- Horizontal padding: 20-24 px.
- Hover: darker purple.
- Active: darker purple with a subtle inset effect.
- Disabled: muted purple, no shadow, `not-allowed` cursor.

**Secondary**

- White background, primary text, and a 1 px neutral border.
- Hover: warm neutral surface.
- May become purple-outlined when paired with a primary action.

**Subtle**

- Transparent background and primary or brand text.
- Hover: `--color-brand-soft` for brand actions or a neutral tint for utilities.

Every icon-only button needs an accessible name and a minimum 40 by 40 px hit area.

### Tabs and filter chips

- Pill or softly rounded shape.
- Unselected: transparent or white with a neutral border.
- Selected: `--color-brand-soft` background and `--color-brand-border` border.
- Keep labels short; include a count only when useful.
- Allow horizontal scrolling on narrow screens rather than squeezing text.

### Search and inputs

- 40-48 px high, 8 px radius, white fill, and 1 px strong neutral border.
- Use an icon at the start and clear affordance at the end when relevant.
- Focus uses a visible brand-purple outline; do not communicate focus with color fill alone.
- Place labels above fields. Placeholder text must not replace a label.

### Learning card

A standard card contains:

1. Optional 16:9 thumbnail or small category illustration.
2. Content-type or skill-level label.
3. Two-line title when possible.
4. Short description.
5. Metadata row for duration, format, and provider.
6. Optional progress bar.
7. Primary or text action anchored at the bottom.

Style:

- White background.
- 1 px `--color-border` border.
- 16 px radius.
- Subtle resting shadow.
- 24 px internal padding when no edge-to-edge image is present.
- Hover increases border emphasis and elevation without dramatic scaling.
- The whole card may be clickable only if nested controls are avoided and the semantic link has a clear accessible name.

### Featured recommendation

- Use `--gradient-ambient` or `--gradient-warm`.
- 24 px radius and 32-48 px padding.
- Two-column layout on desktop: copy and action on the left, illustration or summary panel on the right.
- Stack content on mobile.
- Keep decoration low-contrast and outside the text's reading path.

### Progress

- Use a thin 4-6 px rounded track.
- Brand purple indicates progress.
- Pair color with a numeric or textual completion value.
- Use `Continue` rather than `Start` after progress exists.

### Badges and status

- Use 12-14 px semibold labels.
- Use soft tinted backgrounds with dark foregrounds.
- Do not use color as the only status indicator.
- Limit a card to two visible badges; move the rest into metadata.

### Empty, loading, and error states

- Loading: use skeleton blocks that match the final layout; avoid indefinite spinners for whole sections.
- Empty: explain why the section is empty and provide one useful next action.
- Error: use plain language, a soft danger surface, and a retry action when retry is possible.

## Imagery and iconography

- Prefer Fluent-style outline icons with consistent 20 or 24 px sizing and approximately 1.5-2 px strokes.
- Use rounded, abstract illustrations with purple, peach, cream, and pale yellow accents.
- Keep thumbnails calm and editorial rather than photorealistic or visually dense.
- Do not mix filled, outlined, and multicolor icon families in one control group.
- Decorative images use empty alt text; meaningful images need concise alt text.

## Content style

- Address the learner directly and use action-oriented headings.
- Prefer `Build your AI skills` over product-centric language.
- Keep descriptions to one or two short sentences.
- Use specific action labels such as `Start learning`, `Continue`, and `View playlist`; avoid `Click here`.
- Show level, duration, and format consistently across all learning cards.

## Responsive behavior

| Breakpoint | Behavior |
| --- | --- |
| Below 640 px | Single column, 16 px gutters, collapsed navigation, full-width prominent buttons |
| 640-767 px | Single column with wider gutters; chips may scroll horizontally |
| 768-1023 px | Two-column cards; compact or overlay navigation |
| 1024-1279 px | Persistent navigation where useful; two or three card columns |
| 1280 px and wider | Centered 1280 px content area; three card columns |

At 200% text zoom, content must reflow without clipping. At narrow widths, move actions below copy instead of reducing the font or touch-target size.

## Accessibility requirements

- Meet WCAG AA contrast: at least 4.5:1 for normal text and 3:1 for large text and interactive boundaries.
- Preserve native landmarks and heading order: one `h1`, then sequential section headings.
- Provide a skip link and full keyboard operation.
- Use visible focus indicators at least 2 px thick with sufficient contrast.
- Keep touch targets at least 40 by 40 px; prefer 44 by 44 px on mobile.
- Ensure all inputs have persistent labels and error messages are programmatically associated.
- Announce dynamic recommendation, loading, and error updates appropriately.
- Support browser zoom to 400% without two-dimensional scrolling for normal page content.
- Include a `forced-colors` treatment and do not suppress system high-contrast colors.

## Starter CSS

```css
:root {
  color-scheme: light;
  --font-sans: "Segoe Sans", "Segoe UI", system-ui, -apple-system, sans-serif;

  --color-canvas: #fffdfb;
  --color-surface: #ffffff;
  --color-surface-subtle: #faf6f0;
  --color-border: #e8e6e3;
  --color-border-strong: #d1d1d1;
  --color-text: #272320;
  --color-text-secondary: #4c4642;
  --color-text-muted: #635c57;
  --color-brand: #6b55a3;
  --color-brand-border: #70579c;
  --color-brand-hover: #5e4b8f;
  --color-brand-soft: #70579c1a;
  --color-link: #0078d4;

  --radius-control: 8px;
  --radius-card: 16px;
  --radius-feature: 24px;
  --radius-pill: 9999px;

  --shadow-card:
    0 1px 3px rgb(0 0 0 / 10%),
    0 1px 2px rgb(0 0 0 / 6%);
  --shadow-card-hover:
    0 6px 12px rgb(0 0 0 / 8%),
    0 0.5px 3px rgb(0 0 0 / 8%);
}

* {
  box-sizing: border-box;
}

html {
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-canvas);
}

body {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

a {
  color: var(--color-link);
}

:focus-visible {
  outline: 2px solid var(--color-brand-border);
  outline-offset: 2px;
}

.page-container {
  width: min(100% - 64px, 1280px);
  margin-inline: auto;
}

.card {
  padding: 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}

.card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.button-primary {
  min-height: 40px;
  padding: 8px 20px;
  color: #ffffff;
  font-weight: 600;
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-pill);
}

.button-primary:hover {
  background: var(--color-brand-hover);
}

@media (max-width: 767px) {
  .page-container {
    width: min(100% - 32px, 1280px);
  }

  .card {
    padding: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}

@media (forced-colors: active) {
  .card,
  button,
  input {
    border: 1px solid CanvasText;
  }

  :focus-visible {
    outline-color: Highlight;
  }
}
```

## Simplification boundary

The simulated page should reproduce the design language, not the entire product:

- Keep one header, one optional navigation region, and three to five content sections.
- Implement one card pattern with optional variants rather than separate card systems.
- Use one primary button, one secondary button, one chip, and one input style.
- Use static sample personalization rather than reproducing authentication, tracking, recommendation services, or production data.
- Do not copy proprietary illustrations, production source code, user data, or Microsoft trademark assets into the prototype.
