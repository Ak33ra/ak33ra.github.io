import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// "folder/index.md" → "folder". Lets posts live in co-located folders with their
// assets (cover.jpg, screenshots, etc.) without producing /collection/folder/index/
// URLs. Flat .md files (no folder) work unchanged.
const id_from_path = (entry: string) =>
  entry.replace(/\.md$/, '').replace(/\/index$/, '');

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => id_from_path(entry),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        pub_date: z.coerce.date(),
        description: z.string(),
        author: z.string(),
        cover: image().optional(),
        cover_alt: z.string().optional(),
        tags: z.array(z.string()),
      })
      .refine(
        (data) => !data.cover || Boolean(data.cover_alt),
        { message: 'cover_alt is required when cover is provided' }
      ),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
    generateId: ({ entry }) => id_from_path(entry),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        role: z.string(),
        stack: z.array(z.string()),
        start_date: z.coerce.date(),
        end_date: z.coerce.date().optional(),
        links: z
          .array(
            z.object({
              label: z.string(),
              url: z.string().url(),
            })
          )
          .optional(),
        cover: image().optional(),
        cover_alt: z.string().optional(),
        featured: z.boolean().optional(),
      })
      .refine(
        (data) => !data.cover || Boolean(data.cover_alt),
        { message: 'cover_alt is required when cover is provided' }
      ),
});

const teaching = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/teaching',
    generateId: ({ entry }) => id_from_path(entry),
  }),
  schema: ({ image }) =>
    z
      .object({
        course_code: z.string(),
        course_name: z.string(),
        course_url: z.string().url().optional(),
        role: z.string(),
        semesters: z.array(z.string()),
        last_taught: z.coerce.date(),
        summary: z.string(),
        cover: image().optional(),
        cover_alt: z.string().optional(),
      })
      .refine(
        (data) => !data.cover || Boolean(data.cover_alt),
        { message: 'cover_alt is required when cover is provided' }
      ),
});

const notes = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/notes',
    generateId: ({ entry }) => id_from_path(entry),
  }),
  schema: z.object({
    title: z.string(),
    pub_date: z.coerce.date(),
    updated_date: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const writing = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/writing',
    generateId: ({ entry }) => id_from_path(entry),
  }),
  schema: z.object({
    title: z.string(),
    pub_date: z.coerce.date(),
    venue: z.string(),
    url: z.string().url(),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// News: short dated one-liners (awards, positions, milestones) that don't warrant
// a full post. Single YAML file, keyed-object format — each top-level key is the
// entry id (internal only; news has no detail pages). Lowest-friction content type.
const news = defineCollection({
  loader: file('src/content/news/news.yaml'),
  schema: z.object({
    date: z.coerce.date(),
    text: z.string(),
    url: z.string().url().optional(),
  }),
});

export const collections = { blog, projects, teaching, notes, writing, news };
