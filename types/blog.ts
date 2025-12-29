export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  is_published: boolean;
  published_at: string | null;
  category_id: number | null;
  category?: BlogCategory | null;
  created_at: string;
  updated_at: string;
}

export interface BlogSetting {
  id: number;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  is_published: boolean;
  published_at: string;
  category_id: number | null;
}

export interface BlogCategoryFormData {
  name: string;
  slug: string;
  description: string;
}

export interface PaginatedBlogPosts {
  data: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
