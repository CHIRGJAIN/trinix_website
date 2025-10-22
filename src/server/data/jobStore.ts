import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

import type { JobRole } from "@/types/content";

const JOBS_PATH = path.join(process.cwd(), "src", "data", "jobs.json");

const jobSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    location: z.string(),
    type: z.string(),
    description: z.string(),
    link: z.string().optional(),
  })
);

export async function readJobs(): Promise<JobRole[]> {
  const file = await fs.readFile(JOBS_PATH, "utf8");
  const parsed = jobSchema.parse(JSON.parse(file));
  return parsed as JobRole[];
}

export async function writeJobs(jobs: JobRole[]) {
  const payload = jobSchema.parse(jobs);
  await fs.writeFile(JOBS_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}
