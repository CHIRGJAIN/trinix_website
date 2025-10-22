import posts from "./blogPosts.json";

export type BlogPost = {
  slug: string;
  title: string;
  blurb: string;
  author?: string;
  published_at?: string;
  publication_date?: string;
  estimated_read_duration?: string;
  description_points?: string[];
};

export const POSTS = posts as BlogPost[];
