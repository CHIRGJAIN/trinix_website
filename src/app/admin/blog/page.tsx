import { readBlogPosts } from "@/server/data/blogStore";

import { BlogPostsTable } from "@/app/admin/blog/BlogPostsTable";
import { CreateBlogPostForm } from "@/app/admin/blog/CreateBlogPostForm";

export default async function AdminBlogIndexPage() {
  const posts = await readBlogPosts();
  const ordered = [...posts].sort((a, b) => {
    const timeA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const timeB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="space-y-6 text-white">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold">Blog Catalogue</h1>
        <p className="text-sm text-white/70">Create, update, or retire blog entries surfaced on the public feed.</p>
      </header>

      <CreateBlogPostForm />
      <BlogPostsTable posts={ordered} />
    </div>
  );
}
