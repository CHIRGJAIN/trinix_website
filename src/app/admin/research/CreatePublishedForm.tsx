"use client";

import { useFormState } from "react-dom";

import { SaveButton } from "../blog/SaveButton";
import { type ResearchFormState, upsertResearchEntry } from "./actions";

const INITIAL_STATE: ResearchFormState = {};

export function CreatePublishedForm() {
  const [state, formAction] = useFormState(upsertResearchEntry, INITIAL_STATE);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Add Published Paper</h2>
          <p className="text-sm text-white/70">Track peer-reviewed outputs with venue, DOI, and access metadata.</p>
        </div>
        <p className="text-xs text-white/50">Authors &amp; domains accept one entry per line.</p>
      </div>

      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="collection" value="published" />

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pub-title">
            Title
          </label>
          <input
            id="pub-title"
            name="title"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Paper title"
            required
          />
          {state.errors?.title ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.title}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pub-id">
            Identifier
          </label>
          <input
            id="pub-id"
            name="id"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Unique ID"
            required
          />
          {state.errors?.id ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.id}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pub-venue">
            Venue
          </label>
          <input
            id="pub-venue"
            name="venue"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Journal or conference"
            required
          />
          {state.errors?.venue ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.venue}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pub-doi">
            DOI / Link
          </label>
          <input
            id="pub-doi"
            name="doi"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="https://doi.org/..."
          />
        </div>

        <div>
          <label className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pub-open-access">
            <input
              id="pub-open-access"
              name="open_access"
              type="checkbox"
              className="h-4 w-4 rounded border-white/30 bg-black/60 text-aurora-teal focus:ring-aurora-teal"
            />
            Open Access
          </label>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pub-authors">
            Authors
          </label>
          <textarea
            id="pub-authors"
            name="authors"
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="One author per line"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pub-domain">
            Domains
          </label>
          <textarea
            id="pub-domain"
            name="domain"
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="FinTech"
          />
        </div>

        {state.message ? <p className="md:col-span-2 text-xs text-aurora-rose">{state.message}</p> : null}

        <div className="md:col-span-2 flex justify-end">
          <SaveButton label="Create Published Entry" pendingLabel="Saving…" />
        </div>
      </form>
    </section>
  );
}
