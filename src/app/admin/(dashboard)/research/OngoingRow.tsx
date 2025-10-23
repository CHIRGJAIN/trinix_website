"use client";

import { useState } from "react";
import { useFormState } from "react-dom";

import type { ResearchCatalogue } from "@/server/data/researchStore";

import { SaveButton } from "../blog/SaveButton";
import { type ResearchFormState, deleteResearchEntry, upsertResearchEntry } from "./actions";

const INITIAL_STATE: ResearchFormState = {};

type Entry = NonNullable<ResearchCatalogue["ongoing"]>[number];

type Props = {
  entry: Entry;
};

export function OngoingRow({ entry }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction] = useFormState(upsertResearchEntry, INITIAL_STATE);
  const [deleteState, deleteAction] = useFormState(deleteResearchEntry, INITIAL_STATE);

  return (
    <>
      <tr className="hover:bg-white/5">
        <td className="px-4 py-4 font-medium text-white">{entry.title}</td>
        <td className="px-4 py-4 text-white/60">{entry.milestone_next ?? "—"}</td>
        <td className="px-4 py-4 text-white/60">{entry.eta ?? "—"}</td>
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
          <td colSpan={4} className="px-4 py-6">
            <div className="space-y-6">
              <form action={updateAction} className="grid gap-4 md:grid-cols-2">
                <input type="hidden" name="collection" value="ongoing" />
                <input type="hidden" name="originalId" value={entry.id} />

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`ongoing-title-${entry.id}`}>
                    Title
                  </label>
                  <input
                    id={`ongoing-title-${entry.id}`}
                    name="title"
                    defaultValue={entry.title}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.title ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.title}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`ongoing-id-${entry.id}`}>
                    Identifier
                  </label>
                  <input
                    id={`ongoing-id-${entry.id}`}
                    name="id"
                    defaultValue={entry.id}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.id ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.id}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`ongoing-milestone-${entry.id}`}>
                    Next Milestone
                  </label>
                  <input
                    id={`ongoing-milestone-${entry.id}`}
                    name="milestone_next"
                    defaultValue={entry.milestone_next ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`ongoing-eta-${entry.id}`}>
                    ETA
                  </label>
                  <input
                    id={`ongoing-eta-${entry.id}`}
                    name="eta"
                    defaultValue={entry.eta ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
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
                  if (!window.confirm(`Delete ${entry.title}? This cannot be undone.`)) {
                    event.preventDefault();
                  }
                }}
              >
                <div>
                  <p className="text-sm text-white">Remove initiative</p>
                  <p className="text-xs text-white/60">Removes this in-flight project from public research listings.</p>
                </div>
                <div>
                  <input type="hidden" name="collection" value="ongoing" />
                  <input type="hidden" name="id" value={entry.id} />
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
