"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminSession } from "@/server/auth/simpleSession";
import { appendAuditEntry } from "@/server/data/auditLog";
import { readBlogPosts, writeBlogPosts } from "@/server/data/blogStore";
import { slugify } from "@/lib/slugify";
import type { BlogPost } from "@/data/blogPosts";

const blogFormSchema = z.object({
  originalSlug: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  blurb: z.string().min(1, "Excerpt is required"),
  author: z.string().optional(),
  published_at: z.string().optional(),
  publication_date: z.string().optional(),
  estimated_read_duration: z.string().optional(),
  description_points: z
    .array(z.string().min(1, "Each description point must include text"))
    .max(5, "Only five description points are allowed")
    .optional(),
});

export type BlogFormState = {
  message?: string;
  errors?: Record<string, string>;
};

export async function upsertBlogPost(prevState: BlogFormState, formData: FormData): Promise<BlogFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { message: "Unauthorized" };
  }

  const rawDescriptionPoints = formData
    .getAll("description_points")
    .map((value) => value?.toString().trim() ?? "")
    .filter((value) => value.length > 0);

  const submission = blogFormSchema.safeParse({
    originalSlug: formData.get("originalSlug")?.toString(),
    title: formData.get("title")?.toString(),
    slug: formData.get("slug")?.toString(),
    blurb: formData.get("blurb")?.toString(),
    author: formData.get("author")?.toString(),
    published_at: formData.get("published_at")?.toString(),
    publication_date: formData.get("publication_date")?.toString(),
    estimated_read_duration: formData.get("estimated_read_duration")?.toString(),
    description_points: rawDescriptionPoints.length ? rawDescriptionPoints : undefined,
  });

  if (!submission.success) {
    const errors: Record<string, string> = {};
    for (const issue of submission.error.issues) {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message;
      }
    }
    return { errors };
  }

  const payload = submission.data;
  const normalizedSlug = slugify(payload.slug?.length ? payload.slug : payload.title);
  const publishedAt = payload.published_at?.trim() ? payload.published_at : undefined;
  const author = payload.author?.trim() ? payload.author : undefined;
  const publicationDate = payload.publication_date?.trim() ? payload.publication_date : undefined;
  const estimatedReadDuration = payload.estimated_read_duration?.trim() ? payload.estimated_read_duration : undefined;
  const descriptionPoints = payload.description_points?.map((point) => point.trim()).filter((point) => point.length > 0);

  const posts = await readBlogPosts();
  const existingIndex = posts.findIndex((post) => post.slug === (payload.originalSlug ?? normalizedSlug));

  const duplicate = posts.some((post, index) => post.slug === normalizedSlug && index !== existingIndex);
  if (duplicate) {
    return { errors: { slug: "Another post already uses this slug" } };
  }

  const nextPost: BlogPost = {
    slug: normalizedSlug,
    title: payload.title,
    blurb: payload.blurb,
    author,
    published_at: publishedAt,
    publication_date: publicationDate,
    estimated_read_duration: estimatedReadDuration,
    description_points: descriptionPoints && descriptionPoints.length ? descriptionPoints : undefined,
  };

  const nextPosts = [...posts];
  const action: "create" | "update" = existingIndex === -1 ? "create" : "update";
  const before = existingIndex === -1 ? undefined : posts[existingIndex];

  if (existingIndex === -1) {
    nextPosts.unshift(nextPost);
  } else {
    nextPosts[existingIndex] = nextPost;
  }

  await writeBlogPosts(nextPosts);
  await appendAuditEntry({
    resource: "blog",
    action,
    userId: session.userId,
    before,
    after: nextPost,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");

  redirect(`/admin/blog?updated=${encodeURIComponent(nextPost.slug)}`);
}

const deleteSchema = z.object({ slug: z.string().min(1, "Slug is required") });

export async function deleteBlogPost(prevState: BlogFormState, formData: FormData): Promise<BlogFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { message: "Unauthorized" };
  }

  const submission = deleteSchema.safeParse({ slug: formData.get("slug")?.toString() });
  if (!submission.success) {
    return { message: "Invalid request" };
  }

  const posts = await readBlogPosts();
  const index = posts.findIndex((post) => post.slug === submission.data.slug);
  if (index === -1) {
    return { message: "Post not found" };
  }

  const [removed] = posts.splice(index, 1);
  await writeBlogPosts(posts);
  await appendAuditEntry({
    resource: "blog",
    action: "delete",
    userId: session.userId,
    before: removed,
    after: null,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");

  redirect(`/admin/blog?deleted=${encodeURIComponent(removed.slug)}`);
}
