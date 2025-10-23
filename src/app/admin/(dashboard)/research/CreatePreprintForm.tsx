"use client";

import { useFormState } from "react-dom";

import { SaveButton } from "../blog/SaveButton";
import { type ResearchFormState, upsertResearchEntry } from "./actions";

const INITIAL_STATE: ResearchFormState = {};

export function CreatePreprintForm() {
  const [state, formAction] = useFormState(upsertResearchEntry, INITIAL_STATE);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Add Preprint</h2>
          <p className="text-sm text-white/70">Stage forthcoming research with abstracts, PDFs, and modal metadata.</p>
        </div>
        <p className="text-xs text-white/50">Modal accepts JSON matching the public modal schema.</p>
      </div>

      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="collection" value="preprints" />

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pre-title">
            Title
          </label>
          <input
            id="pre-title"
            name="title"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Preprint title"
            required
          />
          {state.errors?.title ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.title}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pre-id">
            Identifier
          </label>
          <input
            id="pre-id"
            name="id"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Unique ID"
            required
          />
          {state.errors?.id ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.id}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pre-server">
            Server
          </label>
          <input
            id="pre-server"
            name="server"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="ArXiv, Trinix Research, etc"
            required
          />
          {state.errors?.server ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.server}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pre-identifier">
            External Identifier
          </label>
          <input
            id="pre-identifier"
            name="identifier"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="TRX-2025-01"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pre-date">
            Version Date
          </label>
          <input
            id="pre-date"
            name="version_date"
            type="date"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pre-pdf">
            PDF Path / URL
          </label>
          <input
            id="pre-pdf"
            name="pdf"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="/preprints/example.pdf"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pre-abstract">
            Abstract
          </label>
          <textarea
            id="pre-abstract"
            name="abstract"
            rows={4}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Key findings and context"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pre-authors">
            Authors
          </label>
          <textarea
            id="pre-authors"
            name="authors"
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="One author per line"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pre-domain">
            Domains
          </label>
          <textarea
            id="pre-domain"
            name="domain"
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="AI"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="pre-modal">
            Modal JSON
          </label>
          <textarea
            id="pre-modal"
            name="modal"
            rows={4}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white outline-none transition focus:border-aurora-teal/60"
            placeholder='{"layout":"research-square"}'
          />
          {state.errors?.modal ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.modal}</p> : null}
        </div>

        {state.message ? <p className="md:col-span-2 text-xs text-aurora-rose">{state.message}</p> : null}

        <div className="md:col-span-2 flex justify-end">
          <SaveButton label="Create Preprint" pendingLabel="Saving…" />
        </div>
      </form>
    </section>
  );
}
