// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Promote a standalone markdown image — a paragraph whose only child is an
// `![alt](src)` — into a semantic <figure> with a <figcaption>. The image node
// is left untouched (same src), so it still flows through astro:assets
// optimization; remark-collect-images has already run by the rehype phase.
// The caption text is the image's `title` if present, else its `alt`
// (`![caption](src)` is the simple case; `![alt](src "caption")` lets alt and
// caption differ). Keeps `.md` free of raw HTML and classes.
function rehype_figure() {
  const is_whitespace = (node) =>
    node.type === 'text' && node.value.trim() === '';
  const is_img = (node) => node.type === 'element' && node.tagName === 'img';

  const walk = (node) => {
    if (!node.children) return;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.type === 'element' && child.tagName === 'p') {
        const meaningful = child.children.filter((n) => !is_whitespace(n));
        if (meaningful.length === 1 && is_img(meaningful[0])) {
          const img = meaningful[0];
          const caption = img.properties?.title || img.properties?.alt;
          // Drop `title` so it doesn't also render as a hover tooltip.
          if (img.properties) delete img.properties.title;
          const figure = {
            type: 'element',
            tagName: 'figure',
            properties: {},
            children: [img],
          };
          if (caption) {
            figure.children.push({
              type: 'element',
              tagName: 'figcaption',
              properties: {},
              children: [{ type: 'text', value: String(caption) }],
            });
          }
          node.children[i] = figure;
          continue;
        }
      }
      walk(child);
    }
  };

  return (tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://ak33ra.github.io',
  integrations: [sitemap()],
  // Math: remark-math parses `$inline$` / `$$block$$`; rehype-katex renders it to
  // static HTML at build time (no client JS). KaTeX's stylesheet + self-hosted fonts
  // are imported once in BaseLayout — see src/layouts/BaseLayout.astro.
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehype_figure],
  },
  fonts: [
    {
      name: 'Geist Sans',
      cssVariable: '--font-geist-sans',
      provider: fontProviders.fontsource(),
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
    },
    {
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'SF Mono', 'Consolas', 'monospace'],
    },
    {
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      provider: fontProviders.fontsource(),
      weights: [600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-serif', 'Georgia', 'serif'],
    },
  ],
});
