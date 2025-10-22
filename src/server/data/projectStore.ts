import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

import type { Project } from "@/types/content";

const PROJECT_PATH = path.join(process.cwd(), "src", "data", "projects.json");

const ctaSchema = z.object({ label: z.string(), href: z.string() });

const projectSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    summary: z.string(),
    status: z.string(),
    domain: z.string().optional(),
    keyFeatures: z.array(z.string()).optional(),
    ctas: z.array(ctaSchema).optional(),
    link: z.string().optional(),
    spotlightNote: z.string().optional(),
  })
);

export async function readProjects(): Promise<Project[]> {
  const file = await fs.readFile(PROJECT_PATH, "utf8");
  const parsed = projectSchema.parse(JSON.parse(file));
  return parsed as Project[];
}

export async function writeProjects(projects: Project[]) {
  const payload = projectSchema.parse(projects);
  await fs.writeFile(PROJECT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}
