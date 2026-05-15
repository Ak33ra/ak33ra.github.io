// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ak33ra.github.io',
  integrations: [sitemap()],
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
