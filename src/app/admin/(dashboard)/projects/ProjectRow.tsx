"use client";

import { useState } from "react";
import { useFormState } from "react-dom";

import type { Project } from "@/types/content";

import { type ProjectFormState, deleteProject, upsertProject } from "./actions";
import { SaveButton } from "../blog/SaveButton";

const INITIAL_STATE: ProjectFormState = {};

type Props = {
  project: Project;
};

function joinFeatures(features?: string[]): string {
  return features?.join("\n") ?? "";
}

function joinCtas(ctas?: Project["ctas"]): string {
  if (!ctas?.length) return "";
  return ctas.map((cta) => `${cta.label} | ${cta.href}`).join("\n");
}

export function ProjectRow({ project }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction] = useFormState(upsertProject, INITIAL_STATE);
  const [deleteState, deleteAction] = useFormState(deleteProject, INITIAL_STATE);

  return (
    <>
      <tr className="hover:bg-white/5">
        <td className="px-4 py-4 font-medium text-white">{project.name}</td>
        <td className="px-4 py-4 uppercase tracking-[0.15em] text-aurora-teal/80">{project.status}</td>
        <td className="px-4 py-4 text-white/60">{project.domain ?? "—"}</td>
        <td className="px-4 py-4 text-white/60">{project.summary}</td>
        <td className="px-4 py-4 text-right">
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="inline-flex items-center rounded-lg border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-aurora-teal/60 hover:text-white"
          >
            {isEditing ? "Close" : "Edit"}
          </button>
        </td>
      </tr>
      {isEditing ? (
        <tr className="bg-black/40">
          <td colSpan={5} className="px-4 py-6">
            <div className="space-y-6">
              <form action={updateAction} className="grid gap-4 md:grid-cols-2">
                <input type="hidden" name="originalId" value={project.id} />

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`name-${project.id}`}>
                    Name
                  </label>
                  <input
                    id={`name-${project.id}`}
                    name="name"
                    defaultValue={project.name}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.name ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.name}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`id-${project.id}`}>
                    Custom ID
                  </label>
                  <input
                    id={`id-${project.id}`}
                    name="id"
                    defaultValue={project.id}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                  {updateState.errors?.id ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.id}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`status-${project.id}`}>
                    Status
                  </label>
                  <input
                    id={`status-${project.id}`}
                    name="status"
                    defaultValue={project.status}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.status ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.status}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`domain-${project.id}`}>
                    Domain
                  </label>
                  <input
                    id={`domain-${project.id}`}
                    name="domain"
                    defaultValue={project.domain ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`summary-${project.id}`}>
                    Summary
                  </label>
                  <textarea
                    id={`summary-${project.id}`}
                    name="summary"
                    rows={3}
                    defaultValue={project.summary}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.summary ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.summary}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`link-${project.id}`}>
                    External Link
                  </label>
                  <input
                    id={`link-${project.id}`}
                    name="link"
                    defaultValue={project.link ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                  {updateState.errors?.link ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.link}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`spotlight-${project.id}`}>
                    Spotlight Note
                  </label>
                  <input
                    id={`spotlight-${project.id}`}
                    name="spotlightNote"
                    defaultValue={project.spotlightNote ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`features-${project.id}`}>
                    Key Features
                  </label>
                  <textarea
                    id={`features-${project.id}`}
                    name="keyFeatures"
                    rows={3}
                    defaultValue={joinFeatures(project.keyFeatures)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                  {updateState.errors?.keyFeatures ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.keyFeatures}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`ctas-${project.id}`}>
                    Calls to Action
                  </label>
                  <textarea
                    id={`ctas-${project.id}`}
                    name="ctas"
                    rows={3}
                    defaultValue={joinCtas(project.ctas)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    placeholder="Label | https://example.com"
                  />
                  {updateState.errors?.ctas ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.ctas}</p> : null}
                </div>

                {updateState.message ? <p className="md:col-span-2 text-xs text-aurora-rose">{updateState.message}</p> : null}

                <div className="md:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm text-white/70 transition hover:text-white"
                  >
                    Cancel
                  </button>
                  <SaveButton label="Save Changes" pendingLabel="Saving…" />
                </div>
              </form>

              <form
                action={deleteAction}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/60 px-4 py-3"
                onSubmit={(event) => {
                  if (!window.confirm(`Delete ${project.name}? This cannot be undone.`)) {
                    event.preventDefault();
                  }
                }}
              >
                <div>
                  <p className="text-sm text-white">Remove project</p>
                  <p className="text-xs text-white/60">Deletes the entry from public listings immediately.</p>
                </div>
                <div>
                  <input type="hidden" name="id" value={project.id} />
                  <SaveButton label="Delete" pendingLabel="Deleting…" variant="danger" />
                </div>
              </form>
              {deleteState.message ? <p className="text-xs text-aurora-rose">{deleteState.message}</p> : null}
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
