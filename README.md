# ak33ra.github.io

Personal website for Akira van de Groenendaal. Static site built with Astro, deployed to GitHub Pages.

Design principles, accessibility floor, performance budgets, and code conventions live in [`CLAUDE.md`](./CLAUDE.md). This README is the cookbook — *how do I do X*.

## Tech stack

- **Astro 6** (static SSG)
- **Self-hosted variable fonts**: Geist Sans (body), Geist Mono (code), Fraunces (display) — pulled at build via `astro:assets`, zero third-party requests at runtime
- **@astrojs/sitemap** — auto-generated `/sitemap-index.xml`
- **Vanilla CSS** with CSS-custom-property design tokens (no Tailwind, no preprocessor)
- **WebGL** for hero animations (four interchangeable variants)
- **GitHub Pages** via `.github/workflows/deploy.yml`

## Quick start

```bash
npm install
npm run dev      # local dev server with HMR
npm run build    # production build → dist/
npm run preview  # preview the built site
```

Push to `main` → site auto-deploys.

**Heads-up**: the Astro dev server doesn't always pick up changes to `astro.config.mjs` or `src/content.config.ts`. If new fonts, collections, or integrations don't appear, Ctrl-C and `npm run dev` again.

## Project layout

```
src/
├── content.config.ts        Zod schemas for each content collection
├── content/                 Markdown content
│   ├── blog/
│   ├── projects/
│   ├── notes/
│   └── writing/
├── components/              UI building blocks
├── layouts/                 BaseLayout, MarkdownPostLayout, MarkdownPageLayout
├── pages/                   Routes (.astro and .md)
├── scripts/                 Vanilla JS (menu, theme, hero variants)
├── styles/global.css        Design tokens + element defaults
└── assets/                  Images that go through astro:assets optimization
public/                      Static assets served as-is (favicons, og.png, robots.txt)
```

---

## Creating content

All four content types follow the same pattern: a markdown file with frontmatter, validated against a Zod schema in `src/content.config.ts`, served at the route matching the collection.

### A blog post

**Simple** (no cover image): `src/content/blog/<slug>.md`

```yaml
---
title: 'My Post'
pub_date: 2026-05-14
description: 'One-sentence summary used in SEO + link previews.'
author: 'Akira'
tags: ['systems', 'graphics']
---

Body in markdown.
```

**With a cover image**: use a folder.

```
src/content/blog/<slug>/
├── index.md
└── cover.jpg
```

```yaml
---
title: 'My Post'
pub_date: 2026-05-14
description: '...'
author: 'Akira'
cover: './cover.jpg'
cover_alt: 'What the cover shows. Required when cover is set.'
tags: ['systems']
---
```

URL is `/blog/<slug>/` either way.

### A project

`src/content/projects/<slug>.md` — or folder + `index.md` if you want images.

```yaml
---
title: 'Project name'
summary: 'One-sentence pitch.'
role: 'sole author'              # or 'lead engineer', 'designer + dev', etc.
stack: ['Astro', 'TypeScript']
start_date: 2026-01-01
end_date: 2026-05-01             # optional — omit for ongoing
links:                           # optional
  - label: 'GitHub'
    url: 'https://github.com/...'
cover: './cover.jpg'             # optional
cover_alt: '...'                 # required if cover present
featured: true                   # optional
---

Body — write-up, retrospective, technical detail.
```

### A note

`src/content/notes/<slug>.md` — short, often-updated, lower formality.

```yaml
---
title: 'Title'
pub_date: 2026-05-14
updated_date: 2026-05-14   # optional
tags: ['meta']             # optional
---

Body.
```

### A writing entry (external)

`src/content/writing/<slug>.md` — for articles published elsewhere.

```yaml
---
title: 'Article title'
pub_date: 2026-05-14
venue: 'Where it was published'
url: 'https://...'         # the canonical external link
summary: '...'             # optional
tags: ['research']         # optional
---

Optional commentary about the piece. The frontmatter `url` is the destination.
```

---

## Images

### Cover images (per post)

- `cover` must be **local** — the schema's `image()` helper rejects remote URLs.
- `cover` always pairs with `cover_alt` — schema's `.refine()` rejects content with cover but no alt.
- File lives next to the post's `index.md`: `src/content/blog/<slug>/cover.jpg`.
- Astro optimizes to WebP at build (~10–30× smaller than source).

### Inline body images (inside a post)

Folder-style post, relative path:

```markdown
![Description of the figure](./figure-1.png)
```

Astro resolves and optimizes. Files can sit at the post root or in subfolders next to `index.md`.

### Site-wide OG image (link previews)

Drop a **1200×630 PNG** at `public/og.png`. Then in `src/pages/index.astro`:

```astro
<BaseLayout page_title={page_title} description="..." og_image="/og.png" wide no_title>
```

Per-post link previews already use the post's cover automatically.

---

## Editing pages

### About (`src/pages/about.md`)

Pure markdown with frontmatter (`page_title`, `description`). Edit freely.

To add other static pages (`/now`, `/uses`, `/colophon`, …): drop a `.md` file in `src/pages/` with the same `layout: ../layouts/MarkdownPageLayout.astro` line.

### Home page (`src/pages/index.astro`)

Composed of `<FluidHero>` + intro paragraph + `<MixedFeed>`.

Common edits:
- **Tagline** under the name in the hero
- **Intro paragraph** (currently a placeholder under `<!-- PLACEHOLDER -->`)
- **Feed item count**: `<MixedFeed limit={10} />`
- **Hero variant**: `<FluidHero variant="lantern" />` — options: `smoke`, `liquid`, `ambient`, `lantern`

### Index pages

| Route | File |
|---|---|
| `/blog/` | `src/pages/blog.astro` |
| `/projects/` | `src/pages/projects/index.astro` |
| `/notes/` | `src/pages/notes/index.astro` |
| `/writing/` | `src/pages/writing/index.astro` |
| `/tags/` | `src/pages/tags/index.astro` |
| `/tags/<tag>/` | `src/pages/tags/[tag].astro` |

Each index page renders its collection's entries (sorted by date) with a small list layout.

### Nav links

`src/components/Navigation.astro` — array of `{ href, label }`. Active page is auto-marked with `aria-current="page"`.

The header wordmark (`akira`) is in `src/components/Header.astro` — also auto-marks itself active when on `/`.

### Footer

`src/components/Footer.astro` — copyright on the left, social links on the right. Uncomment / add new `<li><a href="...">Label</a></li>` entries for LinkedIn, email, etc.

---

## Site configuration

| What | Where |
|---|---|
| Site URL, integrations, fonts | `astro.config.mjs` |
| Site-wide meta description | `SITE_DESCRIPTION` in `src/layouts/BaseLayout.astro` |
| Year on footer | auto-computed |
| Wordmark text | `src/components/Header.astro` |
| Nav items | `src/components/Navigation.astro` |
| Robots / sitemap | `public/robots.txt` (sitemap auto-generated) |

---

## Theming

All design tokens are CSS custom properties in `src/styles/global.css`.

- **Palette**: `--color-bg`, `--color-fg`, `--color-fg-muted`, `--color-accent`, `--color-accent-hover`, `--color-on-accent`, `--color-border`, `--color-code-bg` — defined twice, on `:root` (light) and `:root[data-theme="dark"]` (dark)
- **Spacing**: `--space-1` (4px) → `--space-24` (96px), 4px base
- **Type scale**: `--text-xs` (0.8rem) → `--text-5xl` (3rem), modular ~1.25
- **Fonts**: `--font-body`, `--font-display`, `--font-mono` — point at the Astro-managed font variables declared in `astro.config.mjs`
- **Radii**, **transitions**, **line heights** — same file

### Theme toggle

`localStorage.theme` is `'light'`, `'dark'`, or absent. Absent → follows `prefers-color-scheme`. Inline `<script>` in `<head>` applies the choice before paint, no flash.

---

## Hero variants

Each variant is a separate WebGL script in `src/scripts/`:

| Variant | File | Character |
|---|---|---|
| `smoke` | `fluid-hero-smoke.js` | Stateless FBM smoke field; cursor warps it |
| `liquid` | `fluid-hero-liquid.js` | Stateful advection; cursor paints into a blank field |
| `ambient` | `fluid-hero-ambient.js` | `liquid` + always-on wandering will-o-wisp |
| `lantern` | `fluid-hero-lantern.js` | **Current default.** Wisp = moving light source over invisible-by-default mist |

Switch via the `variant` prop on `<FluidHero>`. Only the selected variant ships (dynamic import).

**Adding a new variant**: write `src/scripts/fluid-hero-<name>.js` exporting `init_fluid_hero_<name>(canvas)`, add another `else if` branch to the boot script in `src/components/FluidHero.astro`. Don't fork inside an existing variant — tuning happens via constants, structural change gets a new file.

---

## Adding a new content collection

(More detail in `CLAUDE.md` → "Adding a new collection".)

1. Define a schema in `src/content.config.ts` with `defineCollection({ loader: glob({...}), schema })`. Snake_case keys.
2. Create `src/content/<collection>/` with markdown files.
3. Create `src/pages/<collection>/[...slug].astro` — usually a clone of `src/pages/blog/[...slug].astro`.
4. Create `src/pages/<collection>/index.astro` for the listing page.
5. Add a nav link in `src/components/Navigation.astro`.

---

## Troubleshooting

**`The collection "X" does not exist or is empty`** — your dev server was started before the collection existed. Ctrl-C and `npm run dev` again.

**New font / sitemap / integration not showing up in dev** — same fix. `astro.config.mjs` changes need a fresh dev server.

**Build fails with `cover_alt is required when cover is provided`** — you have a `cover:` line in some post's frontmatter without a paired `cover_alt:`. Schema enforces accessibility; add the alt text.

**Build fails with `... does not exist` for a cover** — Astro's `image()` helper validates that the file exists at the path you specified, relative to the markdown file. Check the path.

---

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The action runs `npm run build` and publishes `dist/` to GitHub Pages. No manual deploy.

Local production preview: `npm run build && npm run preview`.

---

## License

All rights reserved. Content, code, and design on this site are not licensed for reuse without explicit permission.
