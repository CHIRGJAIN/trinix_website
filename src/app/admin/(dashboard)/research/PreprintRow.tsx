"use client";

import { useState } from "react";
import { useFormState } from "react-dom";

import type { ResearchCatalogue } from "@/server/data/researchStore";

import { SaveButton } from "../blog/SaveButton";
import { type ResearchFormState, deleteResearchEntry, upsertResearchEntry } from "./actions";

const INITIAL_STATE: ResearchFormState = {};

type Entry = NonNullable<ResearchCatalogue["preprints"]>[number];

type Props = {
  entry: Entry;
};

function joinList(values?: string[]): string {
  return values?.join("\n") ?? "";
}

export function PreprintRow({ entry }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction] = useFormState(upsertResearchEntry, INITIAL_STATE);
  const [deleteState, deleteAction] = useFormState(deleteResearchEntry, INITIAL_STATE);

  return (
    <>
      <tr className="hover:bg-white/5">
        <td className="px-4 py-4 font-medium text-white">{entry.title}</td>
        <td className="px-4 py-4 text-white/60">{entry.server}</td>
        <td className="px-4 py-4 text-white/60">{entry.identifier ?? "—"}</td>
        <td className="px-4 py-4 text-white/60">{entry.version_date ?? "—"}</td>
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
                <input type="hidden" name="collection" value="preprints" />
                <input type="hidden" name="originalId" value={entry.id} />

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`pre-title-${entry.id}`}>
                    Title
                  </label>
                  <input
                    id={`pre-title-${entry.id}`}
                    name="title"
                    defaultValue={entry.title}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.title ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.title}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`pre-id-${entry.id}`}>
                    Identifier
                  </label>
                  <input
                    id={`pre-id-${entry.id}`}
                    name="id"
                    defaultValue={entry.id}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.id ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.id}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`pre-server-${entry.id}`}>
                    Server
                  </label>
                  <input
                    id={`pre-server-${entry.id}`}
                    name="server"
                    defaultValue={entry.server}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                    required
                  />
                  {updateState.errors?.server ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.server}</p> : null}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`pre-identifier-${entry.id}`}>
                    External Identifier
                  </label>
                  <input
                    id={`pre-identifier-${entry.id}`}
                    name="identifier"
                    defaultValue={entry.identifier ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`pre-date-${entry.id}`}>
                    Version Date
                  </label>
                  <input
                    id={`pre-date-${entry.id}`}
                    name="version_date"
                    type="date"
                    defaultValue={entry.version_date ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`pre-pdf-${entry.id}`}>
                    PDF Path / URL
                  </label>
                  <input
                    id={`pre-pdf-${entry.id}`}
                    name="pdf"
                    defaultValue={entry.pdf ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`pre-abstract-${entry.id}`}>
                    Abstract
                  </label>
                  <textarea
                    id={`pre-abstract-${entry.id}`}
                    name="abstract"
                    rows={4}
                    defaultValue={entry.abstract ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`pre-authors-${entry.id}`}>
                    Authors
                  </label>
                  <textarea
                    id={`pre-authors-${entry.id}`}
                    name="authors"
                    rows={3}
                    defaultValue={joinList(entry.authors)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`pre-domain-${entry.id}`}>
                    Domains
                  </label>
                  <textarea
                    id={`pre-domain-${entry.id}`}
                    name="domain"
                    rows={3}
                    defaultValue={joinList(entry.domain)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor={`pre-modal-${entry.id}`}>
                    Modal JSON
                  </label>
                  <textarea
                    id={`pre-modal-${entry.id}`}
                    name="modal"
                    rows={4}
                    defaultValue={entry.modal ? JSON.stringify(entry.modal, null, 2) : ""}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-xs text-white outline-none transition focus:border-aurora-teal/60"
                  />
                  {updateState.errors?.modal ? <p className="mt-1 text-xs text-aurora-rose">{updateState.errors.modal}</p> : null}
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
                  <p className="text-sm text-white">Remove preprint</p>
                  <p className="text-xs text-white/60">Removes this preprint from public research listings.</p>
                </div>
                <div>
                  <input type="hidden" name="collection" value="preprints" />
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
