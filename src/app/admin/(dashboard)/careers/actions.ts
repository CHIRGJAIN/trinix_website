"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { slugify } from "@/lib/slugify";
import { getAdminSession } from "@/server/auth/simpleSession";
import { appendAuditEntry } from "@/server/data/auditLog";
import { readJobs, writeJobs } from "@/server/data/jobStore";
import type { JobRole } from "@/types/content";

const jobFormSchema = z.object({
  originalId: z.string().optional(),
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().optional(),
});

export type JobFormState = {
  message?: string;
  errors?: Record<string, string>;
};

function normalizeLink(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed.length) return undefined;
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    return url.toString();
  } catch {
    throw new Error("Link must be a valid URL or start with / or #");
  }
}

export async function upsertJob(prevState: JobFormState, formData: FormData): Promise<JobFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { message: "Unauthorized" };
  }

  let payload: z.infer<typeof jobFormSchema>;
  try {
    payload = jobFormSchema.parse({
      originalId: formData.get("originalId")?.toString(),
      id: formData.get("id")?.toString(),
      title: formData.get("title")?.toString(),
      location: formData.get("location")?.toString(),
      type: formData.get("type")?.toString(),
      description: formData.get("description")?.toString(),
      link: formData.get("link")?.toString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") {
          errors[key] = issue.message;
        }
      }
      return { errors };
    }
    return { message: "Invalid submission" };
  }

  let link: string | undefined;
  try {
    link = normalizeLink(payload.link);
  } catch (error) {
    return { errors: { link: error instanceof Error ? error.message : "Invalid link" } };
  }

  const normalizedId = payload.id && payload.id.trim().length ? slugify(payload.id) : slugify(payload.title);
  const jobs = await readJobs();
  const existingIndex = jobs.findIndex((job) => job.id === (payload.originalId?.trim().length ? payload.originalId : normalizedId));
  const duplicate = jobs.some((job, index) => job.id === normalizedId && index !== existingIndex);
  if (duplicate) {
    return { errors: { id: "Another role already uses this ID" } };
  }

  const nextJob: JobRole = {
    id: normalizedId,
    title: payload.title,
    location: payload.location,
    type: payload.type,
    description: payload.description,
    link,
  };

  const nextJobs = [...jobs];
  const action: "create" | "update" = existingIndex === -1 ? "create" : "update";
  const before = existingIndex === -1 ? undefined : jobs[existingIndex];

  if (existingIndex === -1) {
    nextJobs.unshift(nextJob);
  } else {
    nextJobs[existingIndex] = nextJob;
  }

  await writeJobs(nextJobs);
  await appendAuditEntry({
    resource: "careers",
    action,
    userId: session.userId,
    before,
    after: nextJob,
  });

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  revalidatePath("/");

  redirect(`/admin/careers?updated=${encodeURIComponent(nextJob.id)}`);
}

const deleteSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export async function deleteJob(prevState: JobFormState, formData: FormData): Promise<JobFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { message: "Unauthorized" };
  }

  const submission = deleteSchema.safeParse({ id: formData.get("id")?.toString() });
  if (!submission.success) {
    return { message: "Invalid request" };
  }

  const jobs = await readJobs();
  const index = jobs.findIndex((job) => job.id === submission.data.id);
  if (index === -1) {
    return { message: "Role not found" };
  }

  const [removed] = jobs.splice(index, 1);
  await writeJobs(jobs);
  await appendAuditEntry({
    resource: "careers",
    action: "delete",
    userId: session.userId,
    before: removed,
    after: null,
  });

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  revalidatePath("/");

  redirect(`/admin/careers?deleted=${encodeURIComponent(removed.id)}`);
}
