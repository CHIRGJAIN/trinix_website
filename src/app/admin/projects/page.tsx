import { readProjects } from "@/server/data/projectStore";

import { CreateProjectForm } from "./CreateProjectForm";
import { ProjectsTable } from "./ProjectsTable";

export default async function AdminProjectsPage() {
  const projects = await readProjects();

  return (
    <div className="space-y-6 text-white">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold">Projects Directory</h1>
        <p className="text-sm text-white/70">Create, update, or retire high-impact projects surfaced across the site.</p>
      </header>

      <CreateProjectForm />
      <ProjectsTable projects={projects} />
    </div>
  );
}
