import type { BlogPost } from "@/data/blogPosts";
import { formatDate as formatDisplayDate } from "@/lib/formatDate";

import { BlogPostRow } from "@/app/admin/blog/BlogPostRow";

type Props = {
  posts: BlogPost[];
};

export function BlogPostsTable({ posts }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/5 uppercase tracking-[0.25em] text-white/60">
          <tr>
            <th scope="col" className="px-4 py-3">Title</th>
            <th scope="col" className="px-4 py-3">Author</th>
            <th scope="col" className="px-4 py-3">Published</th>
            <th scope="col" className="px-4 py-3">Read Time</th>
            <th scope="col" className="px-4 py-3">Excerpt</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/70">
          {posts.map((post) => {
            const label = formatDisplayDate(post.published_at, "short") || "Draft";
            return <BlogPostRow key={post.slug} post={post} formattedDate={label} />;
          })}
        </tbody>
      </table>
    </section>
  );
}
