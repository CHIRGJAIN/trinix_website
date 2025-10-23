import { readJobs } from "@/server/data/jobStore";

import { CreateJobForm } from "./CreateJobForm";
import { JobsTable } from "./JobsTable";

export default async function AdminCareersPage() {
  const jobs = await readJobs();

  return (
    <div className="space-y-6 text-white">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold">Careers Directory</h1>
        <p className="text-sm text-white/70">Manage open roles, update details, and keep the careers page in sync.</p>
      </header>

      <CreateJobForm />
      <JobsTable jobs={jobs} />
    </div>
  );
}
