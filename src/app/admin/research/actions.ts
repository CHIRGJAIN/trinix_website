"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/server/auth/core";
import { appendAuditEntry } from "@/server/data/auditLog";
import { readResearchCatalogue, writeResearchCatalogue } from "@/server/data/researchStore";
import type { ResearchCatalogue } from "@/server/data/researchStore";

type CatalogueArrays = Required<ResearchCatalogue>;
type PublishedEntry = CatalogueArrays["published"][number];
type PreprintEntry = CatalogueArrays["preprints"][number];
type OngoingEntry = CatalogueArrays["ongoing"][number];

const baseSchema = z.object({
  collection: z.enum(["published", "preprints", "ongoing"]),
  originalId: z.string().optional(),
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  authors: z.string().optional(),
  domain: z.string().optional(),
  venue: z.string().optional(),
  doi: z.string().optional(),
  open_access: z.string().optional(),
  server: z.string().optional(),
  identifier: z.string().optional(),
  version_date: z.string().optional(),
  abstract: z.string().optional(),
  pdf: z.string().optional(),
  modal: z.string().optional(),
  milestone_next: z.string().optional(),
  eta: z.string().optional(),
});

export type ResearchFormState = {
  message?: string;
  errors?: Record<string, string>;
};

function parseList(value?: string | null): string[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  return items.length ? items : undefined;
}

function cloneCatalogue(catalogue: ResearchCatalogue): Required<ResearchCatalogue> {
  return {
    published: [...(catalogue.published ?? [])],
    preprints: [...(catalogue.preprints ?? [])],
    ongoing: [...(catalogue.ongoing ?? [])],
  };
}

export async function upsertResearchEntry(prevState: ResearchFormState, formData: FormData): Promise<ResearchFormState> {
  const session = await auth();
  if (!session) {
    return { message: "Unauthorized" };
  }

  let submission: z.infer<typeof baseSchema>;
  try {
    submission = baseSchema.parse({
      collection: formData.get("collection")?.toString(),
      originalId: formData.get("originalId")?.toString(),
      id: formData.get("id")?.toString(),
      title: formData.get("title")?.toString(),
      authors: formData.get("authors")?.toString(),
      domain: formData.get("domain")?.toString(),
      venue: formData.get("venue")?.toString(),
      doi: formData.get("doi")?.toString(),
      open_access: formData.get("open_access")?.toString(),
      server: formData.get("server")?.toString(),
      identifier: formData.get("identifier")?.toString(),
      version_date: formData.get("version_date")?.toString(),
      abstract: formData.get("abstract")?.toString(),
      pdf: formData.get("pdf")?.toString(),
      modal: formData.get("modal")?.toString(),
      milestone_next: formData.get("milestone_next")?.toString(),
      eta: formData.get("eta")?.toString(),
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

  const authors = parseList(submission.authors);
  const domain = parseList(submission.domain);

  let modalObject: unknown;
  if (submission.collection === "preprints" && submission.modal && submission.modal.trim().length) {
    try {
      modalObject = JSON.parse(submission.modal);
    } catch (error) {
      return { errors: { modal: error instanceof Error ? error.message : "Modal JSON is invalid" } };
    }
  }

  if (submission.collection === "published" && !submission.venue?.trim()) {
    return { errors: { venue: "Venue is required" } };
  }
  if (submission.collection === "preprints" && !submission.server?.trim()) {
    return { errors: { server: "Server is required" } };
  }

  const catalogue = cloneCatalogue(await readResearchCatalogue());
  const targetId = submission.originalId?.trim().length ? submission.originalId : submission.id;
  let action: "create" | "update" = "create";
  let before: PublishedEntry | PreprintEntry | OngoingEntry | undefined;
  let after: PublishedEntry | PreprintEntry | OngoingEntry;

  switch (submission.collection) {
    case "published": {
      const list = catalogue.published;
      const existingIndex = list.findIndex((entry) => entry.id === targetId);
      const duplicate = list.some((entry, index) => entry.id === submission.id && index !== existingIndex);
      if (duplicate) {
        return { errors: { id: "Another entry already uses this ID" } };
      }

      const nextEntry: PublishedEntry = {
        id: submission.id,
        title: submission.title,
        authors,
        venue: submission.venue?.trim() ?? "",
        doi: submission.doi?.trim() || undefined,
        open_access: submission.open_access ? submission.open_access === "on" : undefined,
        domain,
      };

      action = existingIndex === -1 ? "create" : "update";
      before = existingIndex === -1 ? undefined : list[existingIndex];
      if (existingIndex === -1) {
        list.unshift(nextEntry);
      } else {
        list[existingIndex] = nextEntry;
      }
      after = nextEntry;
      break;
    }
    case "preprints": {
      const list = catalogue.preprints;
      const existingIndex = list.findIndex((entry) => entry.id === targetId);
      const duplicate = list.some((entry, index) => entry.id === submission.id && index !== existingIndex);
      if (duplicate) {
        return { errors: { id: "Another entry already uses this ID" } };
      }

      const nextEntry: PreprintEntry = {
        id: submission.id,
        title: submission.title,
        authors,
        server: submission.server?.trim() ?? "",
        identifier: submission.identifier?.trim() || undefined,
        version_date: submission.version_date?.trim() || undefined,
        abstract: submission.abstract?.trim() || undefined,
        pdf: submission.pdf?.trim() || undefined,
        domain,
        modal: modalObject as PreprintEntry["modal"],
      };

      action = existingIndex === -1 ? "create" : "update";
      before = existingIndex === -1 ? undefined : list[existingIndex];
      if (existingIndex === -1) {
        list.unshift(nextEntry);
      } else {
        list[existingIndex] = nextEntry;
      }
      after = nextEntry;
      break;
    }
    case "ongoing": {
      const list = catalogue.ongoing;
      const existingIndex = list.findIndex((entry) => entry.id === targetId);
      const duplicate = list.some((entry, index) => entry.id === submission.id && index !== existingIndex);
      if (duplicate) {
        return { errors: { id: "Another entry already uses this ID" } };
      }

      const nextEntry: OngoingEntry = {
        id: submission.id,
        title: submission.title,
        milestone_next: submission.milestone_next?.trim() || undefined,
        eta: submission.eta?.trim() || undefined,
      };

      action = existingIndex === -1 ? "create" : "update";
      before = existingIndex === -1 ? undefined : list[existingIndex];
      if (existingIndex === -1) {
        list.unshift(nextEntry);
      } else {
        list[existingIndex] = nextEntry;
      }
      after = nextEntry;
      break;
    }
    default:
      return { message: "Unsupported collection" };
  }

  await writeResearchCatalogue(catalogue);
  await appendAuditEntry({
    resource: `research-${submission.collection}`,
    action,
    userId: session.user?.id ?? session.user?.email ?? "admin",
    before,
    after,
  });

  revalidatePath("/admin/research");
  revalidatePath("/research");
  revalidatePath("/");

  redirect(`/admin/research?updated=${encodeURIComponent(`${submission.collection}:${submission.id}`)}`);
}

const deleteSchema = z.object({
  collection: z.enum(["published", "preprints", "ongoing"]),
  id: z.string().min(1, "ID is required"),
});

export async function deleteResearchEntry(prevState: ResearchFormState, formData: FormData): Promise<ResearchFormState> {
  const session = await auth();
  if (!session) {
    return { message: "Unauthorized" };
  }

  const submission = deleteSchema.safeParse({
    collection: formData.get("collection")?.toString(),
    id: formData.get("id")?.toString(),
  });

  if (!submission.success) {
    return { message: "Invalid request" };
  }

  const catalogue = cloneCatalogue(await readResearchCatalogue());
  const list = catalogue[submission.data.collection];
  const index = list.findIndex((entry) => entry.id === submission.data.id);
  if (index === -1) {
    return { message: "Entry not found" };
  }

  const [removed] = list.splice(index, 1);
  await writeResearchCatalogue(catalogue);
  await appendAuditEntry({
    resource: `research-${submission.data.collection}`,
    action: "delete",
    userId: session.user?.id ?? session.user?.email ?? "admin",
    before: removed,
    after: null,
  });

  revalidatePath("/admin/research");
  revalidatePath("/research");
  revalidatePath("/");

  redirect(`/admin/research?deleted=${encodeURIComponent(`${submission.data.collection}:${submission.data.id}`)}`);
}
