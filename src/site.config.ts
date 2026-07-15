/**
 * Site-wide configuration knobs that a human toggles by hand.
 *
 * This is the one place to change behavior that isn't content and isn't styling —
 * flags that decide *what shows up where*. Keep it small and well-commented; if it
 * grows a second unrelated concern, group each concern under its own exported const.
 */

/**
 * Which content collections appear in the home-page "Recent" feed (<MixedFeed>).
 *
 * Flip a value to `false` to hide that collection from the interleaved home feed —
 * that is the ONLY thing this controls. The collection's own index page
 * (e.g. /paper-summaries/), its detail pages, and its nav link are all unaffected.
 *
 * Every collection registered in src/content.config.ts should have an entry here.
 * When you add a new collection, add its key too (and decide true/false) — that keeps
 * this map an honest, complete menu of what the feed *can* contain.
 */
export const feed_collections = {
  blog: true,
  projects: true,
  teaching: true,
  notes: true,
  writing: true,
  'paper-summaries': false, // hidden from the Recent feed; /paper-summaries/ still lists them
} as const;
