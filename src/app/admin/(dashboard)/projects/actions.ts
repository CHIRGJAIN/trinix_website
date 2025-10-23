"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { slugify } from "@/lib/slugify";
import { getAdminSession } from "@/server/auth/simpleSession";
import { appendAuditEntry } from "@/server/data/auditLog";
import { readProjects, writeProjects } from "@/server/data/projectStore";
import type { Project, ProjectCta } from "@/types/content";

const projectFormSchema = z.object({
  originalId: z.string().optional(),
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  summary: z.string().min(1, "Summary is required"),
  status: z.string().min(1, "Status is required"),
  domain: z.string().optional(),
  link: z.string().optional(),
  spotlightNote: z.string().optional(),
  keyFeatures: z.string().optional(),
  ctas: z.string().optional(),
});

export type ProjectFormState = {
  message?: string;
  errors?: Record<string, string>;
};

function parseFeatureList(value?: string | null): string[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  return items.length ? items : undefined;
}

function parseCtas(value?: string | null): ProjectCta[] | undefined {
  if (!value) return undefined;
  const rows = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (!rows.length) {
    return undefined;
  }
  const ctas: ProjectCta[] = [];
  for (const row of rows) {
    const [label, href] = row.split("|").map((part) => part.trim());
    if (!label || !href) {
      throw new Error("CTA rows must use the format 'Label | https://example.com'");
    }
    ctas.push({ label, href });
  }
  return ctas;
}

function normalizeLink(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed.length) return undefined;
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    return url.toString();
  } catch {
    throw new Error("Link must be a valid URL");
  }
}

export async function upsertProject(prevState: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { message: "Unauthorized" };
  }

  let payload: z.infer<typeof projectFormSchema>;
  try {
    payload = projectFormSchema.parse({
      originalId: formData.get("originalId")?.toString(),
      id: formData.get("id")?.toString(),
      name: formData.get("name")?.toString(),
      summary: formData.get("summary")?.toString(),
      status: formData.get("status")?.toString(),
      domain: formData.get("domain")?.toString(),
      link: formData.get("link")?.toString(),
      spotlightNote: formData.get("spotlightNote")?.toString(),
      keyFeatures: formData.get("keyFeatures")?.toString(),
      ctas: formData.get("ctas")?.toString(),
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
  let keyFeatures: string[] | undefined;
  let ctas: ProjectCta[] | undefined;

  try {
    link = normalizeLink(payload.link);
  } catch (error) {
    return { errors: { link: error instanceof Error ? error.message : "Invalid link" } };
  }

  try {
    keyFeatures = parseFeatureList(payload.keyFeatures);
  } catch (error) {
    return { errors: { keyFeatures: error instanceof Error ? error.message : "Invalid features" } };
  }

  try {
    ctas = parseCtas(payload.ctas);
  } catch (error) {
    return { errors: { ctas: error instanceof Error ? error.message : "Invalid CTAs" } };
  }

  const normalizedId = (payload.id && payload.id.trim().length ? slugify(payload.id) : slugify(payload.name)) || slugify(payload.name);
  const projects = await readProjects();
  const existingIndex = projects.findIndex((project) => project.id === (payload.originalId?.trim().length ? payload.originalId : normalizedId));
  const duplicate = projects.some((project, index) => project.id === normalizedId && index !== existingIndex);
  if (duplicate) {
    return { errors: { id: "Another project already uses this ID" } };
  }

  const nextProject: Project = {
    id: normalizedId,
    name: payload.name,
    summary: payload.summary,
    status: payload.status,
    domain: payload.domain?.trim() ? payload.domain.trim() : undefined,
    link,
    spotlightNote: payload.spotlightNote?.trim() ? payload.spotlightNote.trim() : undefined,
    keyFeatures,
    ctas,
  };

  const nextProjects = [...projects];
  const action: "create" | "update" = existingIndex === -1 ? "create" : "update";
  const before = existingIndex === -1 ? undefined : projects[existingIndex];

  if (existingIndex === -1) {
    nextProjects.unshift(nextProject);
  } else {
    nextProjects[existingIndex] = nextProject;
  }

  await writeProjects(nextProjects);
  await appendAuditEntry({
    resource: "projects",
    action,
    userId: session.userId,
    before,
    after: nextProject,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");

  redirect(`/admin/projects?updated=${encodeURIComponent(nextProject.id)}`);
}

const deleteSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export async function deleteProject(prevState: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { message: "Unauthorized" };
  }

  const submission = deleteSchema.safeParse({ id: formData.get("id")?.toString() });
  if (!submission.success) {
    return { message: "Invalid request" };
  }

  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === submission.data.id);
  if (index === -1) {
    return { message: "Project not found" };
  }

  const [removed] = projects.splice(index, 1);
  await writeProjects(projects);
  await appendAuditEntry({
    resource: "projects",
    action: "delete",
    userId: session.userId,
    before: removed,
    after: null,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");

  redirect(`/admin/projects?deleted=${encodeURIComponent(removed.id)}`);
}
