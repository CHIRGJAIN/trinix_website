import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

import type { BlogPost } from "@/data/blogPosts";

const BLOG_PATH = path.join(process.cwd(), "src", "data", "blogPosts.json");

const blogSchema = z.array(
  z.object({
    slug: z.string(),
    title: z.string(),
    blurb: z.string(),
    author: z.string().optional(),
    published_at: z.string().optional(),
    publication_date: z.string().optional(),
    estimated_read_duration: z.string().optional(),
    description_points: z.array(z.string()).optional(),
  })
);

export async function readBlogPosts(): Promise<BlogPost[]> {
  const file = await fs.readFile(BLOG_PATH, "utf8");
  const parsed = blogSchema.parse(JSON.parse(file));
  return parsed;
}

export async function writeBlogPosts(posts: BlogPost[]) {
  const payload = blogSchema.parse(posts);
  await fs.writeFile(BLOG_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}
