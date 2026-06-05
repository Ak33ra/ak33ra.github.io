// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://ak33ra.github.io',
  integrations: [sitemap()],
  // Math: remark-math parses `$inline$` / `$$block$$`; rehype-katex renders it to
  // static HTML at build time (no client JS). KaTeX's stylesheet + self-hosted fonts
  // are imported once in BaseLayout — see src/layouts/BaseLayout.astro.
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
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
