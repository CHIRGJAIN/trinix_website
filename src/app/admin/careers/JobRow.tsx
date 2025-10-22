"use client";

import { useState } from "react";
import { useFormState } from "react-dom";

import type { JobRole } from "@/types/content";

import { type JobFormState, deleteJob, upsertJob } from "./actions";
import { SaveButton } from "../blog/SaveButton";

const INITIAL_STATE: JobFormState = {};

type Props = {
  job: JobRole;
};

export function JobRow({ job }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction] = useFormState(upsertJob, INITIAL_STATE);
  const [deleteState, deleteAction] = useFormState(deleteJob, INITIAL_STATE);

  return (
    <>
      <tr className="hover:bg-white/5">
        <td className="px-4 py-4 font-medium text-white">{job.title}</td>
        <td className="px-4 py-4 uppercase tracking-[0.15em] text-aurora-teal/80">{job.location}</td>
        <td className="px-4 py-4 text-white/60">{job.type}</td>
        <td className="px-4 py-4 text-white/60">{job.description}</td>
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
                <input type="hidden" name="originalId" value={job.id} />

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`title-${job.id}`}>
                    Title
                  </label>
                  <input
                    id={`title-${job.id}`}
                    name="title"
                    defaultValue={job.title}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.title ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.title}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`id-${job.id}`}>
                    Custom ID
                  </label>
                  <input
                    id={`id-${job.id}`}
                    name="id"
                    defaultValue={job.id}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                  {updateState.errors?.id ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.id}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`location-${job.id}`}>
                    Location
                  </label>
                  <input
                    id={`location-${job.id}`}
                    name="location"
                    defaultValue={job.location}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.location ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.location}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`type-${job.id}`}>
                    Role Type
                  </label>
                  <input
                    id={`type-${job.id}`}
                    name="type"
                    defaultValue={job.type}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.type ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.type}</p> : null}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`description-${job.id}`}>
                    Description
                  </label>
                  <textarea
                    id={`description-${job.id}`}
                    name="description"
                    rows={3}
                    defaultValue={job.description}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.description ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.description}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`link-${job.id}`}>
                    Apply Link
                  </label>
                  <input
                    id={`link-${job.id}`}
                    name="link"
                    defaultValue={job.link ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    placeholder="https://..., /apply, or #"
                  />
                  {updateState.errors?.link ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.link}</p> : null}
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
                  if (!window.confirm(`Delete ${job.title}? This cannot be undone.`)) {
                    event.preventDefault();
                  }
                }}
              >
                <div>
                  <p className="text-sm text-white">Remove role</p>
                  <p className="text-xs text-white/60">Deletes the position from the public careers page immediately.</p>
                </div>
                <div>
                  <input type="hidden" name="id" value={job.id} />
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
