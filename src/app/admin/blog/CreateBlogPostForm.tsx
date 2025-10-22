"use client";

import { useFormState } from "react-dom";

import { type BlogFormState, upsertBlogPost } from "./actions";
import { SaveButton } from "@/app/admin/blog/SaveButton";

const INITIAL_STATE: BlogFormState = {};

export function CreateBlogPostForm() {
  const [state, formAction] = useFormState(upsertBlogPost, INITIAL_STATE);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
      <h2 className="font-display text-lg font-semibold text-white">Create New Post</h2>
      <p className="mb-6 mt-2 text-sm text-white/70">Draft a new entry or backfill posts migrated from other systems.</p>

      <form action={formAction} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Post headline"
            required
          />
          {state.errors?.title ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.title}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="slug">
            Custom Slug
          </label>
          <input
            id="slug"
            name="slug"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="optional-slug"
          />
          {state.errors?.slug ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.slug}</p> : null}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="author">
            Author
          </label>
          <input
            id="author"
            name="author"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Team member"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="published_at">
            Published
          </label>
          <input
            id="published_at"
            name="published_at"
            type="date"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="publication_date">
            Publication Date
          </label>
          <input
            id="publication_date"
            name="publication_date"
            type="date"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="estimated_read_duration">
            Read Duration
          </label>
          <input
            id="estimated_read_duration"
            name="estimated_read_duration"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="e.g., 5 min read"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="description_points">
            Description Points
          </label>
          <p className="mt-1 text-xs text-white/50">
            Provide up to five short statements. We will weave them into a paragraph for the public blog popup.
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <input
                key={index}
                name="description_points"
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
                placeholder={`Point ${index + 1}`}
              />
            ))}
          </div>
          {state.errors?.description_points ? (
            <p className="mt-1 text-xs text-aurora-rose">{state.errors.description_points}</p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60" htmlFor="blurb">
            Excerpt
          </label>
          <textarea
            id="blurb"
            name="blurb"
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-aurora-teal/60"
            placeholder="Short summary for listings"
            required
          />
          {state.errors?.blurb ? <p className="mt-1 text-xs text-aurora-rose">{state.errors.blurb}</p> : null}
        </div>

        {state.message ? <p className="md:col-span-2 text-xs text-aurora-rose">{state.message}</p> : null}

        <div className="md:col-span-2 flex justify-end">
          <SaveButton label="Create Post" pendingLabel="Saving…" />
        </div>
      </form>
    </section>
  );
}
