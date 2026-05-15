import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pub_date: z.coerce.date(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    start_date: z.coerce.date(),
    end_date: z.coerce.date().optional(),
    links: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).optional(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }).optional(),
    featured: z.boolean().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    pub_date: z.coerce.date(),
    updated_date: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    pub_date: z.coerce.date(),
    venue: z.string(),
    url: z.string().url(),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, projects, notes, writing };
