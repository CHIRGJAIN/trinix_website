"use client";

import { useFormState } from "react-dom";

import { type ProjectFormState, upsertProject } from "./actions";
import { SaveButton } from "../blog/SaveButton";

const INITIAL_STATE: ProjectFormState = {};

export function CreateProjectForm() {
  const [state, formAction] = useFormState(upsertProject, INITIAL_STATE);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Add Project</h2>
          <p className="text-sm text-white/70">Capture new highlights, links, and launch details for spotlighted initiatives.</p>
        </div>
        <p className="text-xs text-white/50">CTA rows use the format: <span className="font-mono">Label | https://example.com</span></p>
      </div>

      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Project title"
            required
          />
          {state.errors?.name ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.name}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="id">
            Custom ID
          </label>
          <input
            id="id"
            name="id"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="auto-generated from name if empty"
          />
          {state.errors?.id ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.id}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="status">
            Status
          </label>
          <input
            id="status"
            name="status"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="e.g. In Discovery"
            required
          />
          {state.errors?.status ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.status}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="domain">
            Domain
          </label>
          <input
            id="domain"
            name="domain"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="FinTech"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="summary">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Short overview for listings"
            required
          />
          {state.errors?.summary ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.summary}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="link">
            External Link
          </label>
          <input
            id="link"
            name="link"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="https://..."
          />
          {state.errors?.link ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.link}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="spotlightNote">
            Spotlight Note
          </label>
          <input
            id="spotlightNote"
            name="spotlightNote"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Optional badge copy"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="keyFeatures">
            Key Features
          </label>
          <textarea
            id="keyFeatures"
            name="keyFeatures"
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="One feature per line"
          />
          {state.errors?.keyFeatures ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.keyFeatures}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="ctas">
            Calls to Action
          </label>
          <textarea
            id="ctas"
            name="ctas"
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Contact Us | mailto:projects@trinix.ai"
          />
          {state.errors?.ctas ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.ctas}</p> : null}
        </div>

        {state.message ? <p className="md:col-span-2 text-xs text-aurora-rose">{state.message}</p> : null}

        <div className="md:col-span-2 flex justify-end">
          <SaveButton label="Create Project" pendingLabel="Saving…" />
        </div>
      </form>
    </section>
  );
}
