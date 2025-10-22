"use client";

import { useFormState } from "react-dom";

import { type JobFormState, upsertJob } from "./actions";
import { SaveButton } from "../blog/SaveButton";

const INITIAL_STATE: JobFormState = {};

export function CreateJobForm() {
  const [state, formAction] = useFormState(upsertJob, INITIAL_STATE);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Post Role</h2>
          <p className="text-sm text-white/70">Add new opportunities with clear location, type, and application routing.</p>
        </div>
        <p className="text-xs text-white/50">Links may point to /relative paths, # anchors, or full URLs.</p>
      </div>

      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Role name"
            required
          />
          {state.errors?.title ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.title}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="id">
            Custom ID
          </label>
          <input
            id="id"
            name="id"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="auto-generated from title if empty"
          />
          {state.errors?.id ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.id}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="City, Country or Remote"
            required
          />
          {state.errors?.location ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.location}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="type">
            Role Type
          </label>
          <input
            id="type"
            name="type"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Full-time, Contract"
            required
          />
          {state.errors?.type ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.type}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Short summary surfaced on the careers page"
            required
          />
          {state.errors?.description ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.description}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="link">
            Apply Link
          </label>
          <input
            id="link"
            name="link"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="https://..., /apply, or #"
          />
          {state.errors?.link ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.link}</p> : null}
        </div>

        {state.message ? <p className="md:col-span-2 text-xs text-aurora-rose">{state.message}</p> : null}

        <div className="md:col-span-2 flex justify-end">
          <SaveButton label="Create Role" pendingLabel="Saving…" />
        </div>
      </form>
    </section>
  );
}
