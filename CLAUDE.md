# ak33ra.github.io — design principles & conventions

Personal website. Static Astro site, deployed to GitHub Pages. This document captures the principles and conventions we've committed to. Update it whenever a principle changes — don't let the code drift past the doc.

---

## Core principles

1. **Content is separable from presentation.** A markdown file describes what a post says — title, body, tags, date — and nothing about how it's rendered. Restyling, redesigning, swapping layouts, adding dark mode — none of it requires editing content files.

2. **Content is separable from code on disk.** Content lives under `src/content/<collection>/`. Source code lives under `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `src/scripts/`. The `base:` path in `src/content.config.ts` is the only line that needs to change if content ever moves (e.g., to a sibling directory or external repo).

3. **Reuse over duplication.** Layouts and components are written once and composed. Visual concerns (color, spacing, type scale, radii) live as CSS custom properties in `src/styles/global.css`, not as literals scattered through components. If the same CSS block appears in two `.astro` files, it should become a component or move into `global.css`.

---

## Styling

- **Vanilla CSS + design tokens.** No Tailwind, no CSS-in-JS, no preprocessors.
- **Tokens in `src/styles/global.css`** as CSS custom properties: colors, spacing scale, type scale, radii, shadows, transition timings.
- **Component-scoped styles** live in the component's `<style>` block (Astro scopes them automatically).
- **`global.css` also sets element defaults** (`body`, `h1–h6`, `a`, `p`, `img`, `code`, etc.) — these are what markdown renders through, so they matter.
- Markdown produces semantic HTML. CSS targets the semantic HTML. **`.md` files never carry classes.**

## Dark mode

- Toggle by setting `document.documentElement.dataset.theme` to `'light'` or `'dark'`. Persisted in `localStorage`.
- Tokens are defined twice in `global.css`: once on `:root` (light), once on `:root[data-theme="dark"]` (dark). A `prefers-color-scheme: dark` media query mirrors the dark tokens for users who haven't explicitly chosen.
- A tiny inline `<script>` in `<head>` reads `localStorage` and sets `data-theme` **before paint** to prevent flash-of-wrong-theme.
- Components consume `var(--bg)`, `var(--fg)`, etc. **No component should know which theme is active.**

## Interactivity

- **Vanilla JS only until there's a real need.** Use Astro `<script>` blocks for menu toggle, theme toggle, and similar small interactions.
- When a real reactive use case appears (filterable list, search, stateful widget): add Preact or Solid via `npx astro add <framework>`. Use per-island hydration directives (`client:visible` preferred over `client:load`).
- No JavaScript framework should be imported before it has at least one concrete user.
- **No content requires JS to be readable.** JS only enhances.

## Typography

- **Self-hosted variable fonts** — no Google Fonts, no third-party requests.
- Three faces: one **display/serif** for headings, one **sans** for body, one **mono** for code. All variable where possible (single file, many weights/widths).
- Served via Astro's built-in font management (configure in `astro.config.mjs`).
- Font family exposed as a CSS variable (`--font-display`, `--font-body`, `--font-mono`) so components consume tokens, not font names.

## Accessibility floor

This is the minimum we always meet. Higher is welcome; lower is a regression.

- **No content requires JavaScript to read.** Pages render readable HTML; JS enhances.
- **`prefers-reduced-motion` is respected.** Animations and the hero canvas pause or fall back to a still image.
- **WCAG AA color contrast** (4.5:1 body, 3:1 large text) — enforced at the token level so every component inherits it.
- **Keyboard navigable.** Visible focus indicators preserved; never `outline: none` without a replacement.
- **Semantic landmarks.** One `<main>`, real `<nav>`, real heading hierarchy. No `<div>` soup where semantic elements exist.

## Performance budget

Targets, not hard ceilings. Goal: someone on a recent laptop over typical home Wi-Fi never has to wait.

**Content pages** (blog, projects, writing):
- LCP < 1.5s
- Total page weight < 200KB including images
- JS shipped < 20KB (just menu + theme toggle)
- Lighthouse Performance ≥ 95

**Landing page** (with hero):
- LCP < 2.5s — the hero earns the headroom
- Lighthouse Performance ≥ 85
- Hero canvas does not block initial paint (`client:visible`)
- Static fallback image when `prefers-reduced-motion: reduce`

**Cross-cutting:**
- CLS < 0.1 — set explicit dimensions on every image
- INP < 200ms — trivial with minimal JS

Verify with Lighthouse (or PageSpeed Insights) when changes touch the landing page, shared layout, or `global.css`. Regressions are easier to catch than to retrofit.

## Content model

Each content type is its own Astro content collection with its own Zod schema in `src/content.config.ts`. Schemas use snake_case keys. Layouts/components are shared across collections where structure overlaps.

Planned collections:

- **`blog/`** — long-form posts. Implemented.
- **`projects/`** — portfolio entries: role, stack, dates, links, optional write-up. Card-grid index.
- **`teaching/`** — courses TA'd at CMU: course_code, course_name, role, semesters[], last_taught (sortable), summary. Card-grid index. `TeachingCard` uses an `::after` overlay so the whole card is clickable while a separate "Course site →" link stays independently clickable (no nested anchors).
- **`notes/`** — short, often-updated thoughts (digital-garden style). Lower formality than blog.
- **`writing/`** — external articles, essays, and pieces published elsewhere. Mostly link entries with metadata. (Talks can be added as a sibling collection when there's something to put in it.)
- **`news/`** — dated one-liners (awards, positions, milestones). Single `news.yaml` via the `file()` loader (keyed-object format, key = id), **not** glob/markdown — correct tool for one-liners. Home-page-only (recent 6, sorted by `date` desc); no detail pages, no `/news` archive (deferred until the list is long).

Routes mirror collections: `/blog/<slug>`, `/projects/<slug>`, etc. Each collection has a dynamic route (`src/pages/<collection>/[...slug].astro`) and an index page.

### Adding a new collection

Adding a new content type is intentionally a mechanical, ~5-step operation. Future-proofing this matters more than any individual collection:

1. Add a `defineCollection({ loader: glob({ pattern, base }), schema })` entry to `src/content.config.ts`. Snake_case keys in the schema.
2. Create `src/content/<collection>/` and start dropping markdown files in.
3. Create `src/pages/<collection>/[...slug].astro` for individual entries — usually a near-clone of `src/pages/blog/[...slug].astro`.
4. Create `src/pages/<collection>/index.astro` for the listing.
5. Add a nav link in `src/components/Navigation.astro`.

If steps 3 and 4 start looking identical across collections, refactor them into a generic `<CollectionList>` / shared dynamic route before adding a third — don't let the duplication compound.

## Image strategy

Cover images live next to the content they describe, get optimized at build, travel with their post when content is restructured.

- **Schema**: collections with cover images use Astro's `image()` helper (`schema: ({ image }) => z.object({ ... cover: image().optional(), cover_alt: z.string().optional() })`). A `.refine()` on the schema rejects content that has a `cover` without `cover_alt` — schema-enforced accessibility.
- **Where files live**: cover and inline body images live in a co-located folder per post — `src/content/blog/<slug>/index.md` next to `src/content/blog/<slug>/cover.jpg`. The glob loader's `generateId` maps `<slug>/index.md` → `<slug>` so URLs stay clean. Flat `.md` files (no folder, no images) still work for posts that don't need images.
- **Markdown body images**: reference relative paths from the `.md` file: `![alt](./screenshot.png)`. Astro resolves and optimizes.
- **Optimization**: all local images go through `astro:assets` and ship as WebP at the requested width. Source files (jpg/png) are typically ~10–30× larger than what ships.
- **Remote images**: cover images **must** be local — the schema's `image()` helper rejects remote URLs. Body images may reference remote URLs when there's a real reason (screenshots of external sites, etc.), but local-first is the default.
- **Rendering**: cover images render via `<Image src={data.cover} alt={data.cover_alt} width={...} />` from `astro:assets`. Don't use raw `<img>` for content images — you lose optimization and lazy-load defaults.
- **Site-wide OG image**: `public/og.png` (1200×630) when ready. Reference from the home page's `og_image` prop. Pages without their own `og_image` currently emit no preview image (better than a broken one).
- **Alt text discipline**: required wherever images appear via the schema's `.refine()`. Decorative-only images may use empty `alt=""` but the field must be present.

## Landing page hero

- **WebGL hero**, encapsulated as a single component (`<FluidHero variant="..." />`).
- Reads palette from CSS variables so it follows the theme automatically.
- Static radial-gradient fallback when `prefers-reduced-motion: reduce`, before the canvas inits, or under no-JS.
- The rest of the site does not know how the hero is implemented. Swappable for a different visual without touching any other file.
- **Multiple visual implementations live in `src/scripts/fluid-hero-<variant>.js`.** The component dynamically imports the chosen variant — only the selected variant's code ships to the browser. Current variants:
  - `smoke` — stateless FBM noise; full-coverage cursor-warped smoke field
  - `liquid` — stateful advection; cursor paints accent-colored trails into a blank field
  - `ambient` — `liquid` plus an always-on wandering will-o-wisp source so the hero is alive at rest; smooth crossfade between wisp and cursor painting
  - `lantern` — wisp is a moving light source above an invisible-by-default mist field; mist visibility = density × proximity × wisp speed; wisp motion parts/stirs the mist via drag + radial push (creates wakes and swirls)
- **Structural changes get a new variant file.** Tuning happens by editing constants inside an existing variant; new approaches (full Navier–Stokes, particles, raymarched, etc.) get their own `fluid-hero-<name>.js` and a new value for the `variant` prop. Don't fork inside an existing variant.
- **WebAssembly does not belong in the hero** — fluid sims run on the GPU. WASM is reserved for a future `/demos` page (or its own collection) where CPU-bound work actually benefits.

---

## Code conventions

- **snake_case** for user-defined identifiers: component props, local variables, frontmatter keys, CSS custom properties (`--bg`, `--font-body`).
- Framework APIs keep their original casing: `Astro.props`, `getStaticPaths`, `getCollection`, `defineConfig`, `import.meta.glob`, DOM attributes (`aria-expanded`).
- Pages are thin. A page imports a layout and one or more components and delegates everything else.
- Layouts compose components; components are leaf-level.
- Astro `<style>` blocks are scoped by default — keep them that way. Use `<style is:global>` only inside `global.css` imports or for very deliberate global overrides.
- Markdown frontmatter is validated by Zod schemas. A missing or wrong field fails the build with a clear error — this is a feature, don't `.optional()` your way around it.
- **Dates: always format in UTC.** `z.coerce.date()` parses `YYYY-MM-DD` frontmatter as midnight UTC. Human-formatting it without `timeZone: 'UTC'` rolls back a day in behind-UTC timezones (the build/dev machine is US-based). Use `date.toLocaleDateString('en-US', { …, timeZone: 'UTC' })` or `.toISOString().slice(0, 10)` — never `.toString()` or bare `.toLocaleDateString()`. This bug is silent and reintroduces easily.

## Repository layout

```
src/
├── content.config.ts        Zod schemas for every collection
├── content/                 All content. No code.
│   ├── blog/
│   ├── projects/            (planned)
│   ├── notes/               (planned)
│   └── writing/             (planned)
├── components/              Leaf-level UI building blocks
├── layouts/                 Page shells; compose components
├── pages/                   Thin route files; one .astro per route
├── scripts/                 Vanilla JS enhancements (menu, theme toggle, ...)
└── styles/
    └── global.css           Tokens + element defaults
public/                      Static assets served as-is (favicons, og images, ...)
```

---

## License

All rights reserved. Content, code, and design on this site are not licensed for reuse without explicit permission. No `LICENSE` file is required — "all rights reserved" is the default under copyright law. Add one if the policy changes (e.g., MIT for code, CC-BY for writing).

## Deliberately deferred

These are decisions we've consciously not made yet. Don't pick them silently — surface the choice when the need arises.

- **JS framework if/when interactivity demands it.** Preact and Solid are the candidates. React is not.
- **`/now` page.** Single-entry "what I'm focused on right now." Not adopted yet — revisit when the bio is settled and you want a lightweight live signal.
- **CV page format.** Single page vs structured collection — decide when actually building it.
- **RSS feed.** Deferred by intent (user not interested in subscribe-via-RSS as a use case); the sitemap and OG metadata are in place. Revisit if there's a future reason to feed posts to readers.
- **Mobile as a target platform.** Currently not a target. The hero is `58vh`, so the swipe-to-scroll and swipe-to-draw gestures collide — touch-drag scrolls past the hero rather than moving the wisp (the wisp still wanders autonomously, so the hero is alive, just not finger-interactive). Don't "fix" this with `touch-action` hacks — the real fix is a deliberately shorter mobile hero (~40vh) with a clearly scrollable region below it, plus proper touch handling. That's a design project, not a one-liner. Revisit only if mobile becomes a target.

---

## Working notes for future Claude sessions

- Astro version: 6.x (see `package.json`).
- Deploy: GitHub Pages via `.github/workflows/deploy.yml`, triggered on push to `main`.
- Content collections require `src/content.config.ts` with a `loader` in Astro 6 — files dropped into `src/content/` without registration are inert.
- The user prefers iterative design discussion before code. Don't bulk-implement multiple sections without checking in.
- When editing existing code containing camelCase identifiers the user controls, opportunistically convert to snake_case (see *Code conventions*).
