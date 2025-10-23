"use client";

import { useFormState } from "react-dom";

import { SaveButton } from "../blog/SaveButton";
import { type ResearchFormState, upsertResearchEntry } from "./actions";

const INITIAL_STATE: ResearchFormState = {};

export function CreateOngoingForm() {
  const [state, formAction] = useFormState(upsertResearchEntry, INITIAL_STATE);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Add Ongoing Initiative</h2>
          <p className="text-sm text-white/70">Log in-flight research strands with milestone tracking.</p>
        </div>
      </div>

      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="collection" value="ongoing" />

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="ongoing-title">
            Title
          </label>
          <input
            id="ongoing-title"
            name="title"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Initiative name"
            required
          />
          {state.errors?.title ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.title}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="ongoing-id">
            Identifier
          </label>
          <input
            id="ongoing-id"
            name="id"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Unique ID"
            required
          />
          {state.errors?.id ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.id}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="ongoing-milestone">
            Next Milestone
          </label>
          <input
            id="ongoing-milestone"
            name="milestone_next"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Prototype demo"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="ongoing-eta">
            ETA
          </label>
          <input
            id="ongoing-eta"
            name="eta"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Q1 2026"
          />
        </div>

        {state.message ? <p className="md:col-span-2 text-xs text-aurora-rose">{state.message}</p> : null}

        <div className="md:col-span-2 flex justify-end">
          <SaveButton label="Create Ongoing Entry" pendingLabel="Saving…" />
        </div>
      </form>
    </section>
  );
}
